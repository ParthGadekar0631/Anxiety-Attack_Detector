const { env } = require("../config/env");
const { riskCategory, recommendedIntervention } = require("../utils/riskCategories");

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function ruleBasedScore(input = {}) {
  const contributors = [];
  let score = 0;

  const add = (condition, points, label) => {
    if (condition) {
      score += points;
      contributors.push(label);
    }
  };

  add(toNumber(input.stressLevel ?? input.stress_level) >= 8, 20, "High stress level");
  add(toNumber(input.heartRate ?? input.heart_rate) >= 110, 20, "Elevated heart rate");
  add(toNumber(input.sleepQuality ?? input.sleep_quality, 10) <= 4, 15, "Poor sleep quality");
  add(Boolean(input.breathingIrregularity ?? input.breathing_irregularity), 20, "Breathing irregularity detected");
  add(Boolean(input.triggerEvent ?? input.trigger_event), 10, "Trigger event reported");
  add(toNumber(input.chestTightness ?? input.chest_tightness) >= 7, 15, "Chest tightness is elevated");
  add(toNumber(input.dizziness) >= 7, 10, "Dizziness is elevated");
  add(toNumber(input.recentEpisodeCount ?? input.recent_episode_count) >= 3, 10, "Recent episode count is elevated");
  add(Boolean(input.wearableAnomaly ?? input.wearable_anomaly), 15, "Wearable anomaly detected");
  add(toNumber(input.voiceStressScore ?? input.voice_stress_score) >= 70, 15, "Voice stress score is high");

  return { score: Math.min(100, score), contributors };
}

function localMlProbability(input = {}) {
  const stress = toNumber(input.stressLevel ?? input.stress_level) / 10;
  const heartRate = Math.min(1, Math.max(0, (toNumber(input.heartRate ?? input.heart_rate, 70) - 65) / 70));
  const sleepRisk = 1 - toNumber(input.sleepQuality ?? input.sleep_quality, 7) / 10;
  const symptoms = (toNumber(input.chestTightness ?? input.chest_tightness) + toNumber(input.dizziness)) / 20;
  const binary =
    (Boolean(input.breathingIrregularity ?? input.breathing_irregularity) ? 0.18 : 0) +
    (Boolean(input.triggerEvent ?? input.trigger_event) ? 0.08 : 0) +
    (Boolean(input.wearableAnomaly ?? input.wearable_anomaly) ? 0.1 : 0);

  return Math.min(0.99, Math.max(0.03, stress * 0.28 + heartRate * 0.22 + sleepRisk * 0.16 + symptoms * 0.16 + binary));
}

async function callMlEngine(input) {
  if (!env.mlEngineUrl) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);
  try {
    const response = await fetch(`${env.mlEngineUrl.replace(/\/$/, "")}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stress_level: input.stressLevel,
        heart_rate: input.heartRate,
        sleep_quality: input.sleepQuality,
        breathing_irregularity: input.breathingIrregularity,
        trigger_event: input.triggerEvent,
        caffeine_intake: input.caffeineIntake,
        chest_tightness: input.chestTightness,
        dizziness: input.dizziness,
        recent_sleep_hours: input.recentSleepHours,
        recent_episode_count: input.recentEpisodeCount,
        wearable_heart_rate: input.wearableHeartRate,
        wearable_oxygen_level: input.wearableOxygenLevel,
        voice_stress_score: input.voiceStressScore,
      }),
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return response.json();
  } catch (_error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function predictRisk(input = {}) {
  const rules = ruleBasedScore(input);
  const mlResponse = await callMlEngine(input);
  const mlRisk = mlResponse ? toNumber(mlResponse.risk_score ?? mlResponse.riskScore) : localMlProbability(input) * 100;
  const combinedScore = Math.round(Math.min(100, mlRisk * 0.7 + rules.score * 0.3));
  const category = riskCategory(combinedScore);
  const confidence = Math.min(0.96, Math.max(0.55, 0.58 + rules.contributors.length * 0.055));
  const escalation = Math.min(0.98, Math.max(0.08, combinedScore / 100 - 0.08 + rules.contributors.length * 0.025));

  return {
    riskScore: combinedScore,
    confidenceScore: Number(confidence.toFixed(2)),
    escalationProbability: Number(escalation.toFixed(2)),
    riskCategory: category,
    explanation: rules.contributors.length ? rules.contributors : ["Inputs do not currently indicate strong escalation signals"],
    recommendedIntervention: recommendedIntervention(category),
    modelVersion: mlResponse ? "fastapi-ml-engine" : "local-rule-ml-fallback",
    fallbackUsed: !mlResponse,
  };
}

module.exports = { predictRisk, ruleBasedScore };
