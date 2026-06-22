import mongoose from "mongoose";

const rawLogSchema = new mongoose.Schema(
  {
    sourceType: { type: String, required: true, index: true },
    sourceName: { type: String, default: "manual" },
    receivedAt: { type: Date, default: Date.now, index: true },
    raw: { type: mongoose.Schema.Types.Mixed, required: true },
    hash: { type: String, required: true, unique: true },
    parseStatus: {
      type: String,
      enum: ["pending", "parsed", "failed"],
      default: "pending"
    },
    errors: [{ type: String }]
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const RawLog = mongoose.model("RawLog", rawLogSchema);
