import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  action: string;
  performedBy: string;
  target: string;
  details?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  target: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);
