import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident", required: true, index: true },
    summary: { type: String, required: true },
    timeline: [{ type: mongoose.Schema.Types.Mixed }],
    keyFindings: [{ type: String }],
    recommendedActions: [{ type: String }],
    evidence: [{ type: mongoose.Schema.Types.Mixed }],
    generatedBy: { type: String, enum: ["deterministic", "ai_assisted"], default: "deterministic" }
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
