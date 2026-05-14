import mongoose from "mongoose";

const entitySchema = new mongoose.Schema(
  {
    user: String,
    userId: String,
    role: String,
    hostname: String,
    ip: String,
    id: String,
    type: String,
    resource: String,
    account: String,
    process: String,
    path: String,
    port: Number,
    geo: String,
    application: String
  },
  { _id: false, strict: false }
);

const eventSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true, index: true },
    eventType: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
      index: true
    },
    actor: entitySchema,
    asset: entitySchema,
    source: entitySchema,
    target: entitySchema,
    action: String,
    outcome: { type: String, enum: ["success", "failure", "unknown"], default: "unknown" },
    message: { type: String, required: true },
    rawLogId: { type: mongoose.Schema.Types.ObjectId, ref: "RawLog" },
    correlationKeys: [{ type: String, index: true }],
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

eventSchema.index({ "actor.user": 1, timestamp: -1 });
eventSchema.index({ "asset.hostname": 1, timestamp: -1 });

export const Event = mongoose.model("Event", eventSchema);
