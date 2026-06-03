const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    medicalNotes: { type: String, default: "" },
    preferredCalmingStyle: { type: String, default: "grounded" },
    voiceTriggerEnabled: { type: Boolean, default: true },
    wearableMonitoringEnabled: { type: Boolean, default: true },
    smsAlertsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
