const mongoose = require("mongoose");

const MedicationLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    medicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Medication", required: true, index: true },
    scheduledFor: Date,
    takenAt: Date,
    status: { type: String, enum: ["taken", "missed", "skipped"], required: true, index: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

MedicationLogSchema.index({ userId: 1, scheduledFor: -1 });

module.exports = mongoose.models.MedicationLog || mongoose.model("MedicationLog", MedicationLogSchema);
