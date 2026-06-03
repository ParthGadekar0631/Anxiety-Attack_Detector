const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    episodeId: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" },
    modelVersion: String,
    inputFeatures: Object,
    riskScore: Number,
    confidenceScore: Number,
    escalationProbability: Number,
    riskCategory: String,
    explanation: [String],
  },
  { timestamps: true }
);

PredictionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
