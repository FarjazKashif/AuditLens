import { Detection } from "../../models/Detection.js";
import { Incident } from "../../models/Incident.js";
import { Report } from "../../models/Report.js";
import { buildIncidentTimeline } from "../timeline/timeline.service.js";

export async function generateIncidentReport(incidentId) {
  const incident = await Incident.findById(incidentId);
  if (!incident) {
    const error = new Error("Incident not found");
    error.status = 404;
    throw error;
  }

  const detections = await Detection.find({ _id: { $in: incident.detectionIds } }).lean();
  const timeline = await buildIncidentTimeline(incidentId);
  const keyFindings = detections.map((detection) => `${detection.ruleName}: ${detection.reason}`);

  const report = await Report.create({
    incidentId,
    summary: `${incident.title} is a ${incident.severity} severity investigation with ${detections.length} deterministic detection match(es) and ${timeline.length} timeline item(s).`,
    timeline,
    keyFindings,
    recommendedActions: [
      "Validate involved accounts and assets.",
      "Review authentication and privilege activity in the affected window.",
      "Preserve raw logs referenced by the normalized events."
    ],
    evidence: timeline.map((item) => ({ type: item.type, evidenceId: item.evidenceId, timestamp: item.timestamp })),
    generatedBy: "deterministic"
  });

  incident.summary = report.summary;
  incident.timeline = timeline;
  await incident.save();

  return report;
}
