import crypto from "node:crypto";
import { Event } from "../../models/Event.js";
import { InvestigationNote } from "../../models/InvestigationNote.js";
import { RawLog } from "../../models/RawLog.js";
import { normalizeRecord } from "../normalization/normalization.service.js";

export async function ingestRecords({ records, sourceType = "audit", sourceName = "api" }) {
  const results = [];

  for (const record of records) {
    const raw = { ...record, sourceType };
    const hash = hashRecord(raw);
    const rawLog = await RawLog.findOneAndUpdate(
      { hash },
      { $setOnInsert: { sourceType, sourceName, raw, hash } },
      { upsert: true, new: true }
    );

    const normalized = normalizeRecord({ ...record, sourceType }, rawLog._id);
    const event = await Event.create(normalized);
    rawLog.parseStatus = "parsed";
    await rawLog.save();

    results.push({ rawLogId: rawLog._id, eventId: event._id });
  }

  return results;
}

export async function ingestNote({ incidentId, author, body, linkedEventIds = [], tags = [] }) {
  const note = await InvestigationNote.create({ incidentId, author, body, linkedEventIds, tags });
  const [eventResult] = await ingestRecords({
    sourceType: "incident_note",
    sourceName: "analyst_note",
    records: [{ timestamp: note.createdAt, note: true, message: body, user: author }]
  });

  return { note, eventResult };
}

function hashRecord(record) {
  return crypto.createHash("sha256").update(JSON.stringify(record)).digest("hex");
}
