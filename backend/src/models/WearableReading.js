const mongoose = require("mongoose");

const WearableReadingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    source: String,
    heartRate: Number,
    oxygenLevel: Number,
    hrv: Number,
    sleepHours: Number,
    respiratoryRate: Number,
    activityLevel: String,
    anomalyDetected: Boolean,
    anomalyReason: [String],
    timestamp: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.WearableReading || mongoose.model("WearableReading", WearableReadingSchema);
