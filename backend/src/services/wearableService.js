const { riskCategory } = require("../utils/riskCategories");

const adapterProfiles = {
  apple: { source: "Apple Watch", heartRate: 112, oxygenLevel: 97, hrv: 32, sleepHours: 5.2, respiratoryRate: 19, activityLevel: "resting" },
  fitbit: { source: "Fitbit", heartRate: 104, oxygenLevel: 96, hrv: 38, sleepHours: 6.1, respiratoryRate: 18, activityLevel: "light" },
  samsung: { source: "Samsung Health", heartRate: 118, oxygenLevel: 95, hrv: 29, sleepHours: 4.7, respiratoryRate: 21, activityLevel: "resting" },
};

function simulateReading(source = "apple") {
  const normalized = String(source).toLowerCase();
  return {
    ...(adapterProfiles[normalized] || adapterProfiles.apple),
    timestamp: new Date().toISOString(),
  };
}

function analyzeWearable(reading) {
  const reasons = [];
  if (reading.heartRate >= 110 && reading.activityLevel !== "active") reasons.push("High resting heart rate");
  if (reading.oxygenLevel && reading.oxygenLevel < 94) reasons.push("Oxygen level below configured threshold");
  if (reading.sleepHours && reading.sleepHours < 5.5) reasons.push("Low sleep duration");
  if (reading.hrv && reading.hrv < 35) reasons.push("Low HRV");
  if (reading.respiratoryRate && (reading.respiratoryRate < 10 || reading.respiratoryRate > 20)) reasons.push("Respiratory rate outside normal range");
  const score = Math.min(100, reasons.length * 22 + Math.max(0, reading.heartRate - 95));
  return {
    anomalyDetected: reasons.length > 0,
    anomalyReason: reasons,
    wearableRiskScore: Math.round(score),
    riskCategory: riskCategory(Math.round(score)),
  };
}

module.exports = { simulateReading, analyzeWearable };
