import { Report } from "../models/Report.js";
import { generateIncidentReport } from "../services/reporting/reporting.service.js";

export async function createReport(req, res, next) {
  try {
    const report = await generateIncidentReport(req.params.id);
    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
}

export async function getReport(req, res, next) {
  try {
    const report = await Report.findOne({ incidentId: req.params.id }).sort({ createdAt: -1 });
    if (!report) return res.status(404).json({ error: { message: "Report not found" } });
    res.json(report);
  } catch (error) {
    next(error);
  }
}
