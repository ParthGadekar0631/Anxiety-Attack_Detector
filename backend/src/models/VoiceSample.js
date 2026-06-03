const mongoose = require("mongoose");

const VoiceSampleSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    transcript: String,
    triggerDetected: Boolean,
    voiceStressScore: Number,
    acousticFeatures: Object,
    analysisSummary: String,
  },
  { timestamps: true }
);

module.exports = mongoose.models.VoiceSample || mongoose.model("VoiceSample", VoiceSampleSchema);
