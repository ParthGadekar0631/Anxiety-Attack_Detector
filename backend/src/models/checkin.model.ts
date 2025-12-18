import { Schema, model, Document, Types } from 'mongoose';

export interface ICheckin extends Document {
  user: Types.ObjectId;
  anxietyLevel: number;
  symptoms: string[];
  triggers: string[];
  copingMechanisms: string[];
  notes?: string;
  riskScore: number;
  recommendations: string[];
  modelVersion: string;
  createdAt: Date;
}

const checkinSchema = new Schema<ICheckin>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    anxietyLevel: { type: Number, min: 0, max: 10, required: true },
    symptoms: [{ type: String }],
    triggers: [{ type: String }],
    copingMechanisms: [{ type: String }],
    notes: { type: String },
    riskScore: { type: Number, min: 0, max: 1, required: true },
    recommendations: [{ type: String }],
    modelVersion: { type: String, default: 'v1' },
  },
  { timestamps: true }
);

export const CheckinModel = model<ICheckin>('Checkin', checkinSchema);
