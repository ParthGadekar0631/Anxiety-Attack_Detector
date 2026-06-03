const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },
    relationship: String,
    phone: { type: String, required: true },
    email: String,
    priority: { type: Number, default: 1 },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EmergencyContactSchema.index({ userId: 1, priority: 1 });

module.exports =
  mongoose.models.EmergencyContact || mongoose.model("EmergencyContact", EmergencyContactSchema);
