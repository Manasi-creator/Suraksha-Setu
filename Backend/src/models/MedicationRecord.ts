import mongoose, { Schema, Document } from "mongoose";

export interface IMedicationRecord extends Document {
  patient: mongoose.Types.ObjectId;
  type: "modern" | "ayurvedic";
  medicine: string;
  dosage: string;
  frequency: string;
  timing: string[];
  notes?: string;
  createdAt: Date;
}

const MedicationRecordSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["modern", "ayurvedic"], required: true },
  medicine: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  timing: [{ type: String }],
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// Compound index to ensure uniqueness per patient and medicine
MedicationRecordSchema.index({ patient: 1, medicine: 1 }, { unique: true });

export default mongoose.model<IMedicationRecord>("MedicationRecord", MedicationRecordSchema);
