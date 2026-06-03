const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("../app");
const { resetStore } = require("../services/dataStore");

async function withServer(fn) {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  try {
    await fn(`http://127.0.0.1:${port}/api`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function jsonFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const body = await response.json();
  return { response, body };
}

async function register(baseUrl) {
  const { body } = await jsonFetch(`${baseUrl}/auth/register`, {
    method: "POST",
    body: JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      password: "secret123",
      medicalNotes: "Asthma inhaler in front pocket",
    }),
  });
  return body.token;
}

test("auth register/login and protected route", async () => {
  resetStore();
  await withServer(async (baseUrl) => {
    const token = await register(baseUrl);
    assert.ok(token);

    const login = await jsonFetch(`${baseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "secret123" }),
    });
    assert.equal(login.response.status, 200);
    assert.ok(login.body.token);

    const me = await jsonFetch(`${baseUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(me.body.user.email, "test@example.com");
  });
});

test("google auth creates an account and returns a JWT", async () => {
  resetStore();
  await withServer(async (baseUrl) => {
    const google = await jsonFetch(`${baseUrl}/auth/google`, {
      method: "POST",
      body: JSON.stringify({
        profile: {
          email: "google-user@example.com",
          name: "Google User",
          sub: "mock-google-123",
        },
      }),
    });

    assert.equal(google.response.status, 201);
    assert.ok(google.body.token);
    assert.equal(google.body.user.email, "google-user@example.com");
    assert.equal(google.body.user.authProvider, "google");
  });
});

test("2FA can be enabled from settings and verified during login", async () => {
  resetStore();
  await withServer(async (baseUrl) => {
    const token = await register(baseUrl);
    const headers = { Authorization: `Bearer ${token}` };

    const settings = await jsonFetch(`${baseUrl}/settings/security`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ twoFactorEnabled: true }),
    });
    assert.equal(settings.response.status, 200);
    assert.equal(settings.body.user.twoFactorEnabled, true);

    const login = await jsonFetch(`${baseUrl}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email: "test@example.com", password: "secret123" }),
    });
    assert.equal(login.response.status, 200);
    assert.equal(login.body.requiresTwoFactor, true);
    assert.ok(login.body.challengeId);
    assert.match(login.body.devCode, /^\d{6}$/);

    const verified = await jsonFetch(`${baseUrl}/auth/2fa/verify`, {
      method: "POST",
      body: JSON.stringify({ challengeId: login.body.challengeId, code: login.body.devCode }),
    });
    assert.equal(verified.response.status, 200);
    assert.ok(verified.body.token);
    assert.equal(verified.body.user.email, "test@example.com");
  });
});

test("prediction route returns fallback-safe high risk output", async () => {
  resetStore();
  await withServer(async (baseUrl) => {
    const token = await register(baseUrl);
    const result = await jsonFetch(`${baseUrl}/predict`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        stressLevel: 9,
        heartRate: 122,
        sleepQuality: 3,
        breathingIrregularity: true,
        triggerEvent: true,
        chestTightness: 8,
        dizziness: 6,
      }),
    });
    assert.equal(result.response.status, 200);
    assert.ok(result.body.riskScore >= 70);
    assert.ok(Array.isArray(result.body.explanation));
  });
});

test("episode creation and emergency mock SMS flow", async () => {
  resetStore();
  await withServer(async (baseUrl) => {
    const token = await register(baseUrl);
    const headers = { Authorization: `Bearer ${token}` };

    const contact = await jsonFetch(`${baseUrl}/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name: "Avery", relationship: "Friend", phone: "+15551234567", isPrimary: true }),
    });
    assert.equal(contact.response.status, 201);

    const episode = await jsonFetch(`${baseUrl}/episodes`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        stressLevel: 8,
        heartRate: 118,
        sleepQuality: 4,
        breathingIrregularity: true,
        triggerEvent: true,
        triggerType: "crowded place",
        caffeineIntake: 2,
        chestTightness: 7,
        dizziness: 5,
        latitude: 40.7128,
        longitude: -74.006,
      }),
    });
    assert.equal(episode.response.status, 201);
    assert.ok(episode.body.aiResponse.message);

    const sms = await jsonFetch(`${baseUrl}/emergency/notify`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        episodeId: episode.body.episode.id,
        location: { latitude: 40.7128, longitude: -74.006 },
      }),
    });
    assert.equal(sms.response.status, 200);
    assert.equal(sms.body.provider, "mock");
    assert.match(sms.body.message, /Emergency support alert/);
  });
});

test("wearable, voice, personalized insight, and relapse endpoints", async () => {
  resetStore();
  await withServer(async (baseUrl) => {
    const token = await register(baseUrl);
    const headers = { Authorization: `Bearer ${token}` };

    const wearable = await jsonFetch(`${baseUrl}/wearables/simulate`, {
      method: "POST",
      headers,
      body: JSON.stringify({ source: "samsung" }),
    });
    assert.equal(wearable.response.status, 201);
    assert.equal(wearable.body.reading.source, "Samsung Health");

    const voice = await jsonFetch(`${baseUrl}/voice/analyze`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        transcript: "I need help right now",
        features: { speechRate: 180, pitchVariance: 0.8, pauseCount: 8, volumeVariance: 0.75 },
      }),
    });
    assert.equal(voice.body.triggerDetected, true);
    assert.ok(voice.body.sample.voiceStressScore >= 60);

    const insights = await jsonFetch(`${baseUrl}/insights/personalized`, { headers });
    assert.equal(insights.response.status, 200);
    assert.ok(Array.isArray(insights.body.insights.recommendedPreventiveActions));

    const relapse = await jsonFetch(`${baseUrl}/insights/relapse-risk`, { headers });
    assert.equal(relapse.response.status, 200);
    assert.equal(relapse.body.relapseRisk.window, "24-72 hours");
  });
});
