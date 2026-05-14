import { Event } from "../models/Event.js";
import { RawLog } from "../models/RawLog.js";

export async function listEvents(req, res, next) {
  try {
    const { actor, asset, severity, eventType, start, end, q } = req.query;
    const query = {};

    if (actor) query["actor.user"] = actor;
    if (asset) query["asset.hostname"] = asset;
    if (severity) query.severity = severity;
    if (eventType) query.eventType = eventType;
    if (start || end) query.timestamp = {};
    if (start) query.timestamp.$gte = new Date(start);
    if (end) query.timestamp.$lte = new Date(end);
    if (q) query.message = { $regex: q, $options: "i" };

    const events = await Event.find(query).sort({ timestamp: -1 }).limit(200);
    res.json(events);
  } catch (error) {
    next(error);
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ error: { message: "Event not found" } });
    const rawLog = event.rawLogId ? await RawLog.findById(event.rawLogId).lean() : null;
    res.json({ event, rawLog });
  } catch (error) {
    next(error);
  }
}
