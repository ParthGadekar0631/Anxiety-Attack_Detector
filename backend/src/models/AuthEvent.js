const mongoose = require("mongoose");

const AuthEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, lowercase: true, trim: true, index: true },
    eventType: {
      type: String,
      enum: ["register", "login", "google-auth", "2fa-challenge", "2fa-verify", "logout", "settings-update"],
      required: true,
      index: true,
    },
    provider: { type: String, default: "password" },
    status: { type: String, enum: ["success", "failure", "pending"], required: true, index: true },
    ipAddress: String,
    userAgent: String,
    reason: String,
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

AuthEventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.models.AuthEvent || mongoose.model("AuthEvent", AuthEventSchema);
