const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    medicalNotes: { type: String, default: "" },
    emergencyMedicalSummary: {
      allergies: [{ type: String, trim: true }],
      conditions: [{ type: String, trim: true }],
      primaryPhysician: { type: String, default: "" },
      emergencyInstructions: { type: String, default: "" },
    },
    preferredCalmingStyle: { type: String, default: "grounded" },
    voiceTriggerEnabled: { type: Boolean, default: true },
    wearableMonitoringEnabled: { type: Boolean, default: true },
    smsAlertsEnabled: { type: Boolean, default: true },
    authProvider: { type: String, enum: ["password", "google", "password+google"], default: "password" },
    googleId: { type: String, default: "", index: true },
    twoFactorEnabled: { type: Boolean, default: false },
    lastLoginAt: Date,
    lastLoginProvider: String,
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
