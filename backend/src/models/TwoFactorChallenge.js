const mongoose = require("mongoose");

const TwoFactorChallengeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    codeHash: { type: String, required: true },
    purpose: { type: String, enum: ["login", "settings"], default: "login" },
    channel: { type: String, enum: ["mock-email", "email", "sms", "authenticator"], default: "mock-email" },
    destination: String,
    attempts: { type: Number, default: 0 },
    consumedAt: Date,
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
  },
  { timestamps: true }
);

TwoFactorChallengeSchema.index({ userId: 1, createdAt: -1 });

module.exports =
  mongoose.models.TwoFactorChallenge || mongoose.model("TwoFactorChallenge", TwoFactorChallengeSchema);
