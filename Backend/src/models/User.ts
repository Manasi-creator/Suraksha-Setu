import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "patient" | "doctor" | "admin";
  dateJoined: Date;
  age?: number;
  gender?: string;
  clinicName?: string;
  phone?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor", "admin"], required: true },
  dateJoined: { type: Date, default: Date.now },
  age: { type: Number },
  gender: { type: String },
  clinicName: { type: String },
  phone: { type: String }
});

export default mongoose.model<IUser>("User", UserSchema);
