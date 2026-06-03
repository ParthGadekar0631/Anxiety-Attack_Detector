const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { authMiddleware } = require("../middleware/authMiddleware");
const { store, insert, byUser } = require("../services/dataStore");
const { predictRisk } = require("../services/predictionService");
const { generateCalmingResponse } = require("../services/aiCalmingService");
const { sendEmergencySms } = require("../services/smsService");
const { simulateReading, analyzeWearable } = require("../services/wearableService");
const { detectTrigger, scoreVoiceStress, triggerPhrases } = require("../services/voiceStressService");
const { personalizedInsights, relapseRisk } = require("../services/insightService");

const router = express.Router();

function publicUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: "7d" });
}

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "anxiety-attack-detector-api",
    status: "ok",
    mockServices: {
      ai: env.aiProvider === "mock" || (!env.openAiApiKey && !env.geminiApiKey),
      sms: env.smsProvider !== "twilio" || !env.twilioAccountSid,
      databaseFallback: true,
    },
  });
});

router.post("/auth/register", async (req, res) => {
  const { name, email, password, medicalNotes = "", preferredCalmingStyle = "grounded" } = req.body || {};
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ success: false, message: "Name, valid email, and password of at least 6 characters are required", details: {} });
  }
  const normalizedEmail = String(email).toLowerCase();
  if (store.users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ success: false, message: "Email already registered", details: {} });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = insert("users", {
    name,
    email: normalizedEmail,
    passwordHash,
    medicalNotes,
    preferredCalmingStyle,
    voiceTriggerEnabled: true,
    wearableMonitoringEnabled: true,
    smsAlertsEnabled: true,
  });
  res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const user = store.users.find((entry) => entry.email === String(email || "").toLowerCase());
  if (!user || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid email or password", details: {} });
  }
  res.json({ success: true, token: signToken(user), user: publicUser(user) });
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

router.post("/contacts", authMiddleware, (req, res) => {
  const { name, relationship = "", phone, email = "", priority = 1, isPrimary = false } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "Contact name and phone are required", details: {} });
  }
  const contact = insert("contacts", { userId: req.user.id, name, relationship, phone, email, priority, isPrimary });
  res.status(201).json({ success: true, contact });
});

router.get("/contacts", authMiddleware, (req, res) => {
  res.json({ success: true, contacts: byUser("contacts", req.user.id).sort((a, b) => a.priority - b.priority) });
});

router.post("/predict", authMiddleware, async (req, res) => {
  const prediction = await predictRisk(req.body || {});
  const saved = insert("predictions", {
    userId: req.user.id,
    inputFeatures: req.body,
    ...prediction,
  });
  res.json({ success: true, ...prediction, predictionId: saved.id });
});

router.post("/episodes", authMiddleware, async (req, res) => {
  const prediction = await predictRisk(req.body || {});
  const aiResponse = await generateCalmingResponse({
    ...req.body,
    riskCategory: prediction.riskCategory,
    preferredCalmingStyle: req.user.preferredCalmingStyle,
  });
  const episode = insert("episodes", {
    userId: req.user.id,
    ...req.body,
    ...prediction,
    aiResponse,
    interventionStarted: true,
    emergencyFlowStarted: prediction.riskCategory === "High",
  });
  insert("predictions", {
    userId: req.user.id,
    episodeId: episode.id,
    inputFeatures: req.body,
    ...prediction,
  });
  res.status(201).json({ success: true, episode, aiResponse, prediction });
});

router.get("/episodes", authMiddleware, (req, res) => {
  res.json({ success: true, episodes: byUser("episodes", req.user.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

router.get("/history", authMiddleware, (req, res) => {
  res.json({
    success: true,
    episodes: byUser("episodes", req.user.id),
    predictions: byUser("predictions", req.user.id),
    wearableReadings: byUser("wearableReadings", req.user.id),
    voiceSamples: byUser("voiceSamples", req.user.id),
    emergencyActions: byUser("emergencyActions", req.user.id),
  });
});

router.post("/calm", authMiddleware, async (req, res) => {
  const aiResponse = await generateCalmingResponse({ ...req.body, preferredCalmingStyle: req.user.preferredCalmingStyle });
  res.json({ success: true, aiResponse });
});

router.post("/emergency/start", authMiddleware, (req, res) => {
  const action = insert("emergencyActions", {
    userId: req.user.id,
    episodeId: req.body?.episodeId,
    actionType: "emergency-start",
    status: "started",
    details: req.body || {},
    timestamp: new Date().toISOString(),
  });
  res.status(201).json({ success: true, action });
});

router.post("/emergency/notify", authMiddleware, async (req, res) => {
  const contacts = byUser("contacts", req.user.id);
  if (!contacts.length) {
    return res.status(400).json({ success: false, message: "No emergency contacts configured", details: {} });
  }
  const episode = req.body?.episodeId ? byUser("episodes", req.user.id).find((entry) => entry.id === req.body.episodeId) : undefined;
  const result = await sendEmergencySms({ user: req.user, contacts, episode, location: req.body?.location || episode });
  res.json({ success: true, ...result });
});

router.post("/wearables/simulate", authMiddleware, (req, res) => {
  const reading = { ...simulateReading(req.body?.source), ...(req.body?.reading || {}) };
  const analysis = analyzeWearable(reading);
  const saved = insert("wearableReadings", { userId: req.user.id, ...reading, ...analysis });
  res.status(201).json({ success: true, reading: saved, analysis });
});

router.post("/wearables/analyze", authMiddleware, (req, res) => {
  const analysis = analyzeWearable(req.body || {});
  const saved = insert("wearableReadings", { userId: req.user.id, ...req.body, ...analysis, timestamp: req.body?.timestamp || new Date().toISOString() });
  res.status(201).json({ success: true, reading: saved, analysis });
});

router.post("/voice/analyze", authMiddleware, (req, res) => {
  const transcript = req.body?.transcript || "";
  const stress = scoreVoiceStress(req.body?.features || req.body || {});
  const triggerDetected = detectTrigger(transcript);
  const sample = insert("voiceSamples", { userId: req.user.id, transcript, triggerDetected, ...stress });
  res.status(201).json({ success: true, sample, triggerDetected, triggerPhrases });
});

router.get("/insights/personalized", authMiddleware, (req, res) => {
  res.json({ success: true, insights: personalizedInsights(req.user.id) });
});

router.get("/insights/relapse-risk", authMiddleware, (req, res) => {
  res.json({ success: true, relapseRisk: relapseRisk(req.user.id) });
});

module.exports = router;
