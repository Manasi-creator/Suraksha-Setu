import mongoose, { Schema, Document } from "mongoose";

export interface IAlert extends Document {
  patient: mongoose.Types.ObjectId;
  severity: "High Risk" | "Caution" | "Info";
  message: string;
  sentBy: string;
  status: "Read" | "Unread";
  date: Date;
}

const AlertSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  severity: { type: String, enum: ["High Risk", "Caution", "Info"], required: true },
  message: { type: String, required: true },
  sentBy: { type: String, required: true },
  status: { type: String, enum: ["Read", "Unread"], default: "Unread" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IAlert>("Alert", AlertSchema);
