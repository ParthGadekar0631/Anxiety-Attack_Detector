const Episode = require("../models/Episode");
const WearableReading = require("../models/WearableReading");
const { riskCategory } = require("../utils/riskCategories");

function groupCounts(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || "unspecified";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

async function personalizedInsights(userId) {
  const [episodes, wearable] = await Promise.all([
    Episode.find({ userId }).lean(),
    WearableReading.find({ userId }).lean(),
  ]);

  const topTriggers = Object.entries(groupCounts(episodes, "triggerType"))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([triggerType, count]) => ({ triggerType, count }));

  const averageStress = Number(average(episodes.map((entry) => Number(entry.stressLevel || 0))).toFixed(1));
  const averageRisk = Number(average(episodes.map((entry) => Number(entry.riskScore || 0))).toFixed(1));
  const anomalyCount = wearable.filter((entry) => entry.anomalyDetected).length;

  return {
    topTriggers,
    recurringPatterns: [
      averageStress >= 7 ? "Stress levels before logged episodes trend high." : "Stress inputs are not consistently high.",
      anomalyCount > 0 ? "Wearable anomalies appear in recent history." : "No wearable anomaly pattern has been logged yet.",
    ],
    baselineComparisons: {
      averageStress,
      averageRisk,
      wearableAnomalyCount: anomalyCount,
    },
    recommendedPreventiveActions: [
      "Review high-frequency triggers before known stressful contexts.",
      "Start breathing guidance when stress reaches 7/10 instead of waiting for escalation.",
      "Prioritize sleep recovery when sleep quality drops below 5/10.",
    ],
    personalizedRiskNotes:
      episodes.length === 0
        ? "No episode history yet. Insights will become more specific as logs accumulate."
        : "Insights are computed from logged episodes, wearable anomalies, and symptom patterns.",
  };
}

async function relapseRisk(userId) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [recent, wearable] = await Promise.all([
    Episode.find({ userId, createdAt: { $gte: sevenDaysAgo } }).lean(),
    WearableReading.find({
      userId,
      $or: [{ timestamp: { $gte: sevenDaysAgo } }, { createdAt: { $gte: sevenDaysAgo } }],
    }).lean(),
  ]);

  const averageRisk = average(recent.map((entry) => Number(entry.riskScore || 0)));
  const averageStress = average(recent.map((entry) => Number(entry.stressLevel || 0)));
  const poorSleepCount = recent.filter((entry) => Number(entry.sleepQuality || 10) <= 4).length;
  const anomalyCount = wearable.filter((entry) => entry.anomalyDetected).length;
  const triggerRecurrence = Math.max(0, ...Object.values(groupCounts(recent, "triggerType")));
  const score = Math.min(
    100,
    Math.round(recent.length * 9 + averageRisk * 0.32 + averageStress * 3 + poorSleepCount * 8 + anomalyCount * 10 + triggerRecurrence * 4)
  );

  return {
    relapseRiskScore: score,
    relapseRiskCategory: riskCategory(score),
    explanation: [
      `${recent.length} episode(s) logged in the last 7 days`,
      `Average recent risk score is ${Math.round(averageRisk)}`,
      `${poorSleepCount} recent episode(s) included poor sleep`,
      `${anomalyCount} wearable anomaly/anomalies found`,
    ],
    window: "24-72 hours",
  };
}

module.exports = { personalizedInsights, relapseRisk };
