const mongoose = require("mongoose");

const VoiceSampleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    transcript: String,
    triggerDetected: Boolean,
    voiceStressScore: Number,
    acousticFeatures: Object,
    analysisSummary: String,
  },
  { timestamps: true }
);

VoiceSampleSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.VoiceSample || mongoose.model("VoiceSample", VoiceSampleSchema);
