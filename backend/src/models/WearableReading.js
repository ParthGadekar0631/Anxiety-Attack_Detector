const mongoose = require("mongoose");

const WearableReadingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: String,
    heartRate: Number,
    oxygenLevel: Number,
    hrv: Number,
    sleepHours: Number,
    respiratoryRate: Number,
    activityLevel: String,
    anomalyDetected: Boolean,
    anomalyReason: [String],
    wearableRiskScore: Number,
    riskCategory: String,
    timestamp: Date,
  },
  { timestamps: true }
);

WearableReadingSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.models.WearableReading || mongoose.model("WearableReading", WearableReadingSchema);
