const mongoose = require("mongoose");

const MedicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, default: "", trim: true },
    scheduleTimes: [{ type: String, trim: true }],
    route: { type: String, default: "", trim: true },
    prescribingDoctor: { type: String, default: "", trim: true },
    pharmacy: { type: String, default: "", trim: true },
    startDate: Date,
    endDate: Date,
    instructions: { type: String, default: "" },
    notes: { type: String, default: "" },
    refill: {
      remaining: { type: Number, default: 0 },
      reminderDate: Date,
    },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

MedicationSchema.index({ userId: 1, active: 1, name: 1 });

module.exports = mongoose.models.Medication || mongoose.model("Medication", MedicationSchema);
