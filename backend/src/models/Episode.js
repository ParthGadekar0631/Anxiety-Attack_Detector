const mongoose = require("mongoose");

const EpisodeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
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
    location: {
      latitude: Number,
      longitude: Number,
      accuracyMeters: Number,
    },
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

EpisodeSchema.index({ userId: 1, createdAt: -1 });
EpisodeSchema.index({ userId: 1, riskCategory: 1 });

module.exports = mongoose.models.Episode || mongoose.model("Episode", EpisodeSchema);
