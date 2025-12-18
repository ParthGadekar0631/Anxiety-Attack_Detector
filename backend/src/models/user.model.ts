import { Schema, model, Document } from 'mongoose';

export type UserRole = 'patient' | 'provider' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['patient', 'provider', 'admin'], default: 'patient' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);
