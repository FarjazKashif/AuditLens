// Stores AuditLens ingest/query activity returned by the Python RAG service.
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["ingest", "query"],
      required: true
    },
    input: { type: String, required: true },
    output: { type: mongoose.Schema.Types.Mixed, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

auditLogSchema.index({ type: 1, timestamp: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
