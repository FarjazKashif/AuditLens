import { z } from "zod";
import { RawLog } from "../models/RawLog.js";
import { ingestNote, ingestRecords } from "../services/ingestion/ingestion.service.js";

const ingestEventsSchema = z.object({
  sourceType: z.string().default("audit"),
  sourceName: z.string().default("api"),
  records: z.array(z.record(z.any())).min(1)
});

const ingestNoteSchema = z.object({
  incidentId: z.string().optional(),
  author: z.string().default("analyst"),
  body: z.string().min(1),
  linkedEventIds: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});

export async function ingestEvents(req, res, next) {
  try {
    const payload = ingestEventsSchema.parse(req.body);
    const results = await ingestRecords(payload);
    res.status(201).json({ ingested: results.length, results });
  } catch (error) {
    next(error);
  }
}

export async function createNote(req, res, next) {
  try {
    const payload = ingestNoteSchema.parse(req.body);
    const result = await ingestNote(payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listIngestionJobs(_req, res, next) {
  try {
    const jobs = await RawLog.find()
      .sort({ receivedAt: -1 })
      .limit(50)
      .select("sourceType sourceName receivedAt parseStatus errors")
      .lean();

    res.json({ jobs });
  } catch (error) {
    next(error);
  }
}
