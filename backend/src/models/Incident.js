import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "investigating", "contained", "closed"],
      default: "open",
      index: true
    },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    detectionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Detection" }],
    eventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    entities: { type: mongoose.Schema.Types.Mixed, default: {} },
    timeline: [{ type: mongoose.Schema.Types.Mixed }],
    summary: String,
    owner: String,
    tags: [{ type: String, index: true }]
  },
  { timestamps: true }
);

incidentSchema.index({ status: 1, updatedAt: -1 });
incidentSchema.index({ severity: 1, updatedAt: -1 });

export const Incident = mongoose.model("Incident", incidentSchema);
