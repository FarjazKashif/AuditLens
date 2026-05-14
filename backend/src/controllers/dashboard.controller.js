// Aggregates live MongoDB metrics for the dashboard and health views.
import mongoose from "mongoose";
import { AuditLog } from "../models/AuditLog.js";
import { Detection } from "../models/Detection.js";
import { Event } from "../models/Event.js";
import { Incident } from "../models/Incident.js";
import { RawLog } from "../models/RawLog.js";

export async function getDashboardSummary(_req, res, next) {
  try {
    const [
      eventCount,
      rawLogCount,
      openIncidentCount,
      criticalDetectionCount,
      latestEvents,
      activeIncidents,
      detectionBreakdown,
      auditLensActivityCount
    ] = await Promise.all([
      Event.countDocuments(),
      RawLog.countDocuments(),
      Incident.countDocuments({ status: { $ne: "closed" } }),
      Detection.countDocuments({ severity: "critical", status: { $ne: "suppressed" } }),
      Event.find().sort({ timestamp: -1 }).limit(8).lean(),
      Incident.find({ status: { $ne: "closed" } }).sort({ updatedAt: -1 }).limit(8).lean(),
      Detection.aggregate([{ $group: { _id: "$severity", count: { $sum: 1 } } }]),
      AuditLog.countDocuments()
    ]);

    res.json({
      metrics: {
        normalizedEvents: eventCount,
        rawLogs: rawLogCount,
        openIncidents: openIncidentCount,
        criticalDetections: criticalDetectionCount,
        auditLensActivity: auditLensActivityCount,
        mongoState: mongoose.connection.readyState
      },
      latestEvents,
      activeIncidents,
      detectionBreakdown: detectionBreakdown.reduce((acc, item) => {
        acc[item._id || "unknown"] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    next(error);
  }
}

export async function getSystemHealth(_req, res, next) {
  try {
    const [events, rawLogs, detections, incidents, auditLensHistory] = await Promise.all([
      Event.countDocuments(),
      RawLog.countDocuments(),
      Detection.countDocuments(),
      Incident.countDocuments(),
      AuditLog.countDocuments()
    ]);

    res.json({
      status: "ok",
      service: "auditlens-api",
      mongo: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.connection.readyState
      },
      collections: {
        events,
        rawLogs,
        detections,
        incidents,
        auditLensHistory
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
}
