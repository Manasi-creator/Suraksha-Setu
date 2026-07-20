import mongoose, { Schema, Document } from "mongoose";

export interface IMedicine extends Document {
  name: string;
  compounds: string;
  category: string;
  type: "modern" | "ayurvedic";
  status: "Verified" | "Needs Review";
}

const MedicineSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  compounds: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ["modern", "ayurvedic"], required: true },
  status: { type: String, enum: ["Verified", "Needs Review"], default: "Verified" }
});

export default mongoose.model<IMedicine>("Medicine", MedicineSchema);
