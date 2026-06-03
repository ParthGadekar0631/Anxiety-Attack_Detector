const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    stressLevel: Number,
    heartRate: Number,
    sleepQuality: Number,
    breathingIrregularity: Boolean,
    triggerEvent: Boolean,
    triggerType: String,
    caffeineIntake: Number,
    mood: String,
    chestTightness: Number,
    dizziness: Number,
    notes: String,
    latitude: Number,
    longitude: Number,
    locationAccuracy: Number,
    riskScore: Number,
    confidenceScore: Number,
    escalationProbability: Number,
    riskCategory: String,
    aiResponse: Object,
    interventionStarted: Boolean,
    emergencyFlowStarted: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Episode || mongoose.model("Episode", EpisodeSchema);
