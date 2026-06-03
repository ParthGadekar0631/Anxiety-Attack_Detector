const mongoose = require("mongoose");

const EmergencyActionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    episodeId: String,
    actionType: String,
    status: String,
    details: Object,
    timestamp: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.EmergencyAction || mongoose.model("EmergencyAction", EmergencyActionSchema);
