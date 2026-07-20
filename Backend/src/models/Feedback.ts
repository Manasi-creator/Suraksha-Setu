import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  doctor: string;
  patient: string;
  drugsChecked: string;
  aiResult: string;
  assessment: "Correct" | "Partially Correct" | "Incorrect";
  note: string;
  status: "Pending" | "Reviewed" | "Escalated";
  date: Date;
}

const FeedbackSchema: Schema = new Schema({
  doctor: { type: String, required: true },
  patient: { type: String, required: true },
  drugsChecked: { type: String, required: true },
  aiResult: { type: String, required: true },
  assessment: { type: String, enum: ["Correct", "Partially Correct", "Incorrect"], required: true },
  note: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Reviewed", "Escalated"], default: "Pending" },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
