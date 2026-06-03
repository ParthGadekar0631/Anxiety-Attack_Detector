const mongoose = require("mongoose");

const EmergencyActionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    episodeId: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" },
    contactId: { type: mongoose.Schema.Types.ObjectId, ref: "EmergencyContact" },
    actionType: { type: String, required: true, index: true },
    status: { type: String, required: true, index: true },
    details: Object,
    timestamp: Date,
  },
  { timestamps: true }
);

EmergencyActionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.EmergencyAction || mongoose.model("EmergencyAction", EmergencyActionSchema);
