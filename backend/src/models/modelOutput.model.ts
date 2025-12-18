import { Schema, model, Document, Types } from 'mongoose';

export interface IModelOutput extends Document {
  user: Types.ObjectId;
  checkin: Types.ObjectId;
  modelVersion: string;
  score: number;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const modelOutputSchema = new Schema<IModelOutput>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    checkin: { type: Schema.Types.ObjectId, ref: 'Checkin', required: true },
    modelVersion: { type: String, required: true },
    score: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const ModelOutputModel = model<IModelOutput>('ModelOutput', modelOutputSchema);
