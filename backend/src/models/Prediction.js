const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    episodeId: String,
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

module.exports = mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
