import mongoose, { Schema, Document } from "mongoose";

export interface IPatientProfile extends Document {
  user: mongoose.Types.ObjectId;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  assignedDoctor?: string; // Doctor name or reference
  profileCompletion: number;
  status: "Active" | "Inactive";
}

const PatientProfileSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  age: { type: Number },
  gender: { type: String },
  height: { type: Number },
  weight: { type: Number },
  assignedDoctor: { type: String, default: "Dr. Priya Sharma" },
  profileCompletion: { type: Number, default: 50 },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
});

export default mongoose.model<IPatientProfile>("PatientProfile", PatientProfileSchema);
