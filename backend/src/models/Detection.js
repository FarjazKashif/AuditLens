import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema(
  {
    ruleId: { type: String, required: true, index: true },
    ruleName: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true },
    confidence: { type: Number, default: 0.7 },
    matchedAt: { type: Date, default: Date.now, index: true },
    window: {
      start: Date,
      end: Date
    },
    eventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    entities: { type: mongoose.Schema.Types.Mixed, default: {} },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "triaged", "suppressed", "linked"],
      default: "new",
      index: true
    }
  },
  { timestamps: true }
);

export const Detection = mongoose.model("Detection", detectionSchema);
