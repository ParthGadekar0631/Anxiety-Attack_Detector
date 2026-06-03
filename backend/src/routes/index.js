const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { env } = require("../config/env");
const { authMiddleware } = require("../middleware/authMiddleware");
const { predictRisk } = require("../services/predictionService");
const { generateCalmingResponse } = require("../services/aiCalmingService");
const { sendEmergencySms } = require("../services/smsService");
const { simulateReading, analyzeWearable } = require("../services/wearableService");
const { detectTrigger, scoreVoiceStress, triggerPhrases } = require("../services/voiceStressService");
const { personalizedInsights, relapseRisk } = require("../services/insightService");
const User = require("../models/User");
const AuthEvent = require("../models/AuthEvent");
const TwoFactorChallenge = require("../models/TwoFactorChallenge");
const EmergencyContact = require("../models/EmergencyContact");
const Episode = require("../models/Episode");
const Prediction = require("../models/Prediction");
const VoiceSample = require("../models/VoiceSample");
const WearableReading = require("../models/WearableReading");
const EmergencyAction = require("../models/EmergencyAction");
const Medication = require("../models/Medication");
const MedicationLog = require("../models/MedicationLog");

const router = express.Router();

function publicUser(user) {
  const raw = typeof user.toObject === "function" ? user.toObject() : user;
  const { passwordHash, ...safe } = raw;
  return safe;
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: "7d" });
}

function normalizedEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function generateTwoFactorCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function requestMeta(req) {
  return {
    ipAddress: req.ip,
    userAgent: req.get("user-agent") || "",
  };
}

async function logAuthEvent(payload) {
  await AuthEvent.create(payload);
}

async function createTwoFactorChallenge(user, req, purpose = "login") {
  const code = generateTwoFactorCode();
  const challenge = await TwoFactorChallenge.create({
    userId: user._id,
    codeHash: await bcrypt.hash(code, 10),
    purpose,
    channel: "mock-email",
    destination: user.email,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await logAuthEvent({
    userId: user._id,
    email: user.email,
    eventType: "2fa-challenge",
    provider: user.authProvider,
    status: "pending",
    metadata: { challengeId: challenge.id, purpose },
    ...requestMeta(req),
  });

  return {
    success: true,
    requiresTwoFactor: true,
    challengeId: challenge.id,
    delivery: {
      channel: "mock-email",
      destination: user.email,
      expiresInMinutes: 10,
    },
    ...(env.nodeEnv !== "production" ? { devCode: code } : {}),
  };
}

async function authResponse(user, req, eventType, provider = user.authProvider || "password") {
  if (user.twoFactorEnabled) {
    return createTwoFactorChallenge(user, req, "login");
  }

  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date(), lastLoginProvider: provider });
  await logAuthEvent({
    userId: user._id,
    email: user.email,
    eventType,
    provider,
    status: "success",
    ...requestMeta(req),
  });

  return { success: true, token: signToken(user), user: publicUser(user) };
}

async function findUserByEmail(email) {
  return User.findOne({ email: normalizedEmail(email) });
}

async function verifyGoogleCredential(credential) {
  if (!credential || !env.googleClientId) return null;
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
  if (!response.ok) {
    throw new Error("Google credential could not be verified");
  }
  const profile = await response.json();
  if (profile.aud !== env.googleClientId) {
    throw new Error("Google credential audience mismatch");
  }
  if (profile.email_verified !== "true" && profile.email_verified !== true) {
    throw new Error("Google account email is not verified");
  }
  return {
    email: profile.email,
    name: profile.name,
    sub: profile.sub,
  };
}

function normalizeEpisodePayload(payload = {}) {
  const location =
    payload.latitude || payload.longitude || payload.location
      ? {
          latitude: payload.location?.latitude ?? payload.latitude,
          longitude: payload.location?.longitude ?? payload.longitude,
          accuracyMeters: payload.location?.accuracyMeters ?? payload.locationAccuracy,
        }
      : undefined;

  return {
    ...payload,
    location,
    latitude: location?.latitude,
    longitude: location?.longitude,
    locationAccuracy: location?.accuracyMeters,
  };
}

function medicationFilter(userId, medicationId) {
  return { _id: medicationId, userId };
}

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "anxiety-attack-detector-api",
    status: "ok",
    database: {
      provider: "mongodb",
      readyState: mongoose.connection.readyState,
      connected: mongoose.connection.readyState === 1,
    },
    mockServices: {
      ai: env.aiProvider === "mock" || (!env.openAiApiKey && !env.geminiApiKey),
      sms: env.smsProvider !== "twilio" || !env.twilioAccountSid,
      googleAuth: !env.googleClientId,
      twoFactorDelivery: "mock-email",
      databaseFallback: false,
    },
  });
});

router.post("/auth/register", async (req, res) => {
  const { name, email, password, medicalNotes = "", preferredCalmingStyle = "grounded" } = req.body || {};
  if (!name || !email || !password || password.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: "Name, valid email, and password of at least 6 characters are required", details: {} });
  }

  const emailAddress = normalizedEmail(email);
  if (await User.exists({ email: emailAddress })) {
    await logAuthEvent({
      email: emailAddress,
      eventType: "register",
      provider: "password",
      status: "failure",
      reason: "duplicate-email",
      ...requestMeta(req),
    });
    return res.status(409).json({ success: false, message: "Email already registered", details: {} });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: emailAddress,
    passwordHash,
    medicalNotes,
    preferredCalmingStyle,
    voiceTriggerEnabled: true,
    wearableMonitoringEnabled: true,
    smsAlertsEnabled: true,
    authProvider: "password",
    twoFactorEnabled: false,
  });

  await logAuthEvent({
    userId: user._id,
    email: user.email,
    eventType: "register",
    provider: "password",
    status: "success",
    ...requestMeta(req),
  });

  res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    await logAuthEvent({
      email: normalizedEmail(email),
      eventType: "login",
      provider: "password",
      status: "failure",
      reason: "invalid-credentials",
      ...requestMeta(req),
    });
    return res.status(401).json({ success: false, message: "Invalid email or password", details: {} });
  }

  res.json(await authResponse(user, req, "login", "password"));
});

router.post("/auth/google", async (req, res) => {
  let profile = req.body?.profile || {};
  try {
    const verifiedProfile = await verifyGoogleCredential(req.body?.credential);
    if (verifiedProfile) profile = verifiedProfile;
  } catch (error) {
    await logAuthEvent({
      email: normalizedEmail(profile.email || req.body?.email),
      eventType: "google-auth",
      provider: "google",
      status: "failure",
      reason: error.message,
      ...requestMeta(req),
    });
    return res.status(401).json({ success: false, message: error.message, details: {} });
  }

  const email = normalizedEmail(profile.email || req.body?.email);
  if (!email) {
    return res.status(400).json({ success: false, message: "Google profile email is required", details: {} });
  }

  let user = await findUserByEmail(email);
  if (user) {
    user.authProvider = user.authProvider === "password" ? "password+google" : user.authProvider || "google";
    user.googleId = String(profile.sub || profile.id || user.googleId || "");
    await user.save();
    return res.json(await authResponse(user, req, "google-auth", "google"));
  }

  user = await User.create({
    name: String(profile.name || req.body?.name || email.split("@")[0]),
    email,
    passwordHash: await bcrypt.hash(crypto.randomUUID(), 10),
    medicalNotes: "",
    preferredCalmingStyle: "grounded",
    voiceTriggerEnabled: true,
    wearableMonitoringEnabled: true,
    smsAlertsEnabled: true,
    authProvider: "google",
    googleId: String(profile.sub || profile.id || ""),
    twoFactorEnabled: false,
  });

  await logAuthEvent({
    userId: user._id,
    email: user.email,
    eventType: "google-auth",
    provider: "google",
    status: "success",
    ...requestMeta(req),
  });

  res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
});

router.post("/auth/2fa/verify", async (req, res) => {
  const { challengeId, code } = req.body || {};
  const challenge = await TwoFactorChallenge.findById(challengeId);
  if (!challenge || challenge.consumedAt || challenge.expiresAt.getTime() < Date.now()) {
    return res.status(401).json({ success: false, message: "Two-factor challenge expired or invalid", details: {} });
  }

  const isValid = await bcrypt.compare(String(code || "").trim(), challenge.codeHash);
  if (!isValid) {
    challenge.attempts += 1;
    await challenge.save();
    return res.status(401).json({ success: false, message: "Invalid two-factor code", details: {} });
  }

  const user = await User.findById(challenge.userId);
  if (!user) {
    return res.status(401).json({ success: false, message: "User no longer exists", details: {} });
  }

  challenge.consumedAt = new Date();
  await challenge.save();
  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date(), lastLoginProvider: user.authProvider });
  await logAuthEvent({
    userId: user._id,
    email: user.email,
    eventType: "2fa-verify",
    provider: user.authProvider,
    status: "success",
    metadata: { challengeId: challenge.id },
    ...requestMeta(req),
  });

  res.json({ success: true, token: signToken(user), user: publicUser(user) });
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

router.patch("/settings/security", authMiddleware, async (req, res) => {
  const patch = {};
  if (typeof req.body?.twoFactorEnabled === "boolean") patch.twoFactorEnabled = req.body.twoFactorEnabled;
  if (typeof req.body?.voiceTriggerEnabled === "boolean") patch.voiceTriggerEnabled = req.body.voiceTriggerEnabled;
  if (typeof req.body?.wearableMonitoringEnabled === "boolean") patch.wearableMonitoringEnabled = req.body.wearableMonitoringEnabled;
  if (typeof req.body?.smsAlertsEnabled === "boolean") patch.smsAlertsEnabled = req.body.smsAlertsEnabled;
  if (typeof req.body?.preferredCalmingStyle === "string") patch.preferredCalmingStyle = req.body.preferredCalmingStyle;

  const user = await User.findByIdAndUpdate(req.user._id, patch, { new: true });
  await logAuthEvent({
    userId: user._id,
    email: user.email,
    eventType: "settings-update",
    provider: user.authProvider,
    status: "success",
    metadata: { fields: Object.keys(patch) },
    ...requestMeta(req),
  });

  res.json({
    success: true,
    user: publicUser(user),
    twoFactor: {
      enabled: Boolean(user.twoFactorEnabled),
      method: "mock-email-code",
    },
  });
});

router.post("/contacts", authMiddleware, async (req, res) => {
  const { name, relationship = "", phone, email = "", priority = 1, isPrimary = false } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "Contact name and phone are required", details: {} });
  }

  if (isPrimary) {
    await EmergencyContact.updateMany({ userId: req.user._id }, { $set: { isPrimary: false } });
  }

  const contact = await EmergencyContact.create({
    userId: req.user._id,
    name,
    relationship,
    phone,
    email,
    priority,
    isPrimary,
  });

  res.status(201).json({ success: true, contact });
});

router.get("/contacts", authMiddleware, async (req, res) => {
  const contacts = await EmergencyContact.find({ userId: req.user._id }).sort({ priority: 1, createdAt: 1 });
  res.json({ success: true, contacts });
});

router.post("/predict", authMiddleware, async (req, res) => {
  const prediction = await predictRisk(req.body || {});
  const saved = await Prediction.create({
    userId: req.user._id,
    inputFeatures: req.body,
    ...prediction,
  });
  res.json({ success: true, ...prediction, predictionId: saved.id });
});

router.post("/episodes", authMiddleware, async (req, res) => {
  const input = normalizeEpisodePayload(req.body || {});
  const prediction = await predictRisk(input);
  const aiResponse = await generateCalmingResponse({
    ...input,
    riskCategory: prediction.riskCategory,
    preferredCalmingStyle: req.user.preferredCalmingStyle,
  });

  const episode = await Episode.create({
    userId: req.user._id,
    ...input,
    ...prediction,
    aiResponse,
    interventionStarted: true,
    emergencyFlowStarted: prediction.riskCategory === "High",
  });

  await Prediction.create({
    userId: req.user._id,
    episodeId: episode._id,
    inputFeatures: input,
    ...prediction,
  });

  res.status(201).json({ success: true, episode, aiResponse, prediction });
});

router.get("/episodes", authMiddleware, async (req, res) => {
  const episodes = await Episode.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, episodes });
});

router.get("/history", authMiddleware, async (req, res) => {
  const [episodes, predictions, wearableReadings, voiceSamples, emergencyActions, medications, medicationLogs] = await Promise.all([
    Episode.find({ userId: req.user._id }).sort({ createdAt: -1 }),
    Prediction.find({ userId: req.user._id }).sort({ createdAt: -1 }),
    WearableReading.find({ userId: req.user._id }).sort({ timestamp: -1, createdAt: -1 }),
    VoiceSample.find({ userId: req.user._id }).sort({ createdAt: -1 }),
    EmergencyAction.find({ userId: req.user._id }).sort({ createdAt: -1 }),
    Medication.find({ userId: req.user._id }).sort({ active: -1, name: 1 }),
    MedicationLog.find({ userId: req.user._id }).sort({ scheduledFor: -1, createdAt: -1 }).populate("medicationId"),
  ]);

  res.json({
    success: true,
    episodes,
    predictions,
    wearableReadings,
    voiceSamples,
    emergencyActions,
    medications,
    medicationLogs,
  });
});

router.post("/calm", authMiddleware, async (req, res) => {
  const aiResponse = await generateCalmingResponse({ ...req.body, preferredCalmingStyle: req.user.preferredCalmingStyle });
  res.json({ success: true, aiResponse });
});

router.post("/emergency/start", authMiddleware, async (req, res) => {
  const action = await EmergencyAction.create({
    userId: req.user._id,
    episodeId: req.body?.episodeId,
    actionType: "emergency-start",
    status: "started",
    details: req.body || {},
    timestamp: new Date(),
  });
  res.status(201).json({ success: true, action });
});

router.post("/emergency/notify", authMiddleware, async (req, res) => {
  const contacts = await EmergencyContact.find({ userId: req.user._id }).sort({ priority: 1, createdAt: 1 });
  if (!contacts.length) {
    return res.status(400).json({ success: false, message: "No emergency contacts configured", details: {} });
  }

  const episode = req.body?.episodeId ? await Episode.findOne({ _id: req.body.episodeId, userId: req.user._id }) : null;
  const result = await sendEmergencySms({
    user: req.user,
    contacts,
    episode,
    location: req.body?.location || episode?.location || episode,
  });

  const actions = await EmergencyAction.insertMany(
    result.deliveries.map((delivery) => ({
      userId: req.user._id,
      episodeId: episode?._id,
      contactId: delivery.contactId,
      actionType: "sms",
      status: delivery.status,
      details: {
        provider: delivery.provider,
        to: delivery.to,
        contactName: delivery.contactName,
        message: delivery.message,
      },
      timestamp: new Date(),
    }))
  );

  res.json({ success: true, ...result, actions });
});

router.post("/wearables/simulate", authMiddleware, async (req, res) => {
  const reading = { ...simulateReading(req.body?.source), ...(req.body?.reading || {}) };
  const analysis = analyzeWearable(reading);
  const saved = await WearableReading.create({ userId: req.user._id, ...reading, ...analysis });
  res.status(201).json({ success: true, reading: saved, analysis });
});

router.post("/wearables/analyze", authMiddleware, async (req, res) => {
  const analysis = analyzeWearable(req.body || {});
  const saved = await WearableReading.create({
    userId: req.user._id,
    ...req.body,
    ...analysis,
    timestamp: req.body?.timestamp || new Date().toISOString(),
  });
  res.status(201).json({ success: true, reading: saved, analysis });
});

router.post("/voice/analyze", authMiddleware, async (req, res) => {
  const transcript = req.body?.transcript || "";
  const stress = scoreVoiceStress(req.body?.features || req.body || {});
  const triggerDetected = detectTrigger(transcript);
  const sample = await VoiceSample.create({ userId: req.user._id, transcript, triggerDetected, ...stress });
  res.status(201).json({ success: true, sample, triggerDetected, triggerPhrases });
});

router.get("/insights/personalized", authMiddleware, async (req, res) => {
  res.json({ success: true, insights: await personalizedInsights(req.user._id) });
});

router.get("/insights/relapse-risk", authMiddleware, async (req, res) => {
  res.json({ success: true, relapseRisk: await relapseRisk(req.user._id) });
});

router.get("/medications", authMiddleware, async (req, res) => {
  const medications = await Medication.find({ userId: req.user._id }).sort({ active: -1, name: 1 });
  res.json({ success: true, medications });
});

router.post("/medications", authMiddleware, async (req, res) => {
  const { name, dosage, frequency = "", scheduleTimes = [], route = "", prescribingDoctor = "", pharmacy = "", startDate, endDate, instructions = "", notes = "", refill = {}, active = true } = req.body || {};
  if (!name || !dosage) {
    return res.status(400).json({ success: false, message: "Medication name and dosage are required", details: {} });
  }

  const medication = await Medication.create({
    userId: req.user._id,
    name,
    dosage,
    frequency,
    scheduleTimes,
    route,
    prescribingDoctor,
    pharmacy,
    startDate,
    endDate,
    instructions,
    notes,
    refill,
    active,
  });

  res.status(201).json({ success: true, medication });
});

router.patch("/medications/:medicationId", authMiddleware, async (req, res) => {
  const medication = await Medication.findOneAndUpdate(medicationFilter(req.user._id, req.params.medicationId), req.body || {}, { returnDocument: "after" });
  if (!medication) {
    return res.status(404).json({ success: false, message: "Medication not found", details: {} });
  }
  res.json({ success: true, medication });
});

router.get("/medications/logs", authMiddleware, async (req, res) => {
  const logs = await MedicationLog.find({ userId: req.user._id }).sort({ scheduledFor: -1, createdAt: -1 }).populate("medicationId");
  res.json({ success: true, logs });
});

router.post("/medications/:medicationId/logs", authMiddleware, async (req, res) => {
  const medication = await Medication.findOne(medicationFilter(req.user._id, req.params.medicationId));
  if (!medication) {
    return res.status(404).json({ success: false, message: "Medication not found", details: {} });
  }

  const { scheduledFor, takenAt, status, notes = "" } = req.body || {};
  if (!status || !["taken", "missed", "skipped"].includes(status)) {
    return res.status(400).json({ success: false, message: "Medication log status must be taken, missed, or skipped", details: {} });
  }

  const log = await MedicationLog.create({
    userId: req.user._id,
    medicationId: medication._id,
    scheduledFor,
    takenAt,
    status,
    notes,
  });

  res.status(201).json({ success: true, log });
});

module.exports = router;
