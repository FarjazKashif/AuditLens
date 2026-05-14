import { Router } from "express";
import auditLensRoutes from "./auditlens.js";
import { runCorrelation } from "../controllers/correlation.controller.js";
import { getDashboardSummary, getSystemHealth } from "../controllers/dashboard.controller.js";
import { listDetections, runDetectionRules, updateDetection } from "../controllers/detections.controller.js";
import { getEvent, listEvents } from "../controllers/events.controller.js";
import { createIncident, getIncident, listIncidents, updateIncident } from "../controllers/incidents.controller.js";
import { createNote, ingestEvents, listIngestionJobs } from "../controllers/ingestion.controller.js";
import { createReport, getReport } from "../controllers/reports.controller.js";
import { getTimeline } from "../controllers/timeline.controller.js";

const router = Router();

router.get("/health", getSystemHealth);
router.get("/dashboard/summary", getDashboardSummary);

router.use("/auditlens", auditLensRoutes);

router.post("/ingest/events", ingestEvents);
router.post("/ingest/notes", createNote);
router.get("/ingest/jobs", listIngestionJobs);

router.get("/events", listEvents);
router.get("/events/:id", getEvent);

router.post("/correlate", runCorrelation);
router.get("/correlations", (_req, res) => res.json({ correlations: [] }));

router.post("/detections/run", runDetectionRules);
router.get("/detections", listDetections);
router.patch("/detections/:id", updateDetection);

router.get("/incidents", listIncidents);
router.post("/incidents", createIncident);
router.get("/incidents/:id", getIncident);
router.patch("/incidents/:id", updateIncident);
router.get("/incidents/:id/timeline", getTimeline);
router.post("/incidents/:id/report", createReport);
router.get("/incidents/:id/report", getReport);

export default router;
