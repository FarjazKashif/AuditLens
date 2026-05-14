import mongoose from "mongoose";

const investigationNoteSchema = new mongoose.Schema(
  {
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: "Incident", index: true },
    author: { type: String, default: "analyst" },
    body: { type: String, required: true },
    linkedEventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export const InvestigationNote = mongoose.model("InvestigationNote", investigationNoteSchema);
