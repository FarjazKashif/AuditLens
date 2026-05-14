import { Event } from "../../models/Event.js";
import { Incident } from "../../models/Incident.js";
import { InvestigationNote } from "../../models/InvestigationNote.js";

export async function buildIncidentTimeline(incidentId) {
  const incident = await Incident.findById(incidentId);
  if (!incident) {
    const error = new Error("Incident not found");
    error.status = 404;
    throw error;
  }

  const events = await Event.find({ _id: { $in: incident.eventIds } }).lean();
  const notes = await InvestigationNote.find({ incidentId }).lean();

  return [
    ...events.map((event) => ({
      type: "event",
      timestamp: event.timestamp,
      severity: event.severity,
      title: event.eventType,
      description: event.message,
      evidenceId: event._id
    })),
    ...notes.map((note) => ({
      type: "note",
      timestamp: note.createdAt,
      severity: "low",
      title: "Analyst note",
      description: note.body,
      evidenceId: note._id
    }))
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}
