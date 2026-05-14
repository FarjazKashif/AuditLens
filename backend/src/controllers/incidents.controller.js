import { Incident } from "../models/Incident.js";

export async function listIncidents(_req, res, next) {
  try {
    const incidents = await Incident.find().sort({ updatedAt: -1 }).limit(100);
    res.json(incidents);
  } catch (error) {
    next(error);
  }
}

export async function createIncident(req, res, next) {
  try {
    const incident = await Incident.create(req.body);
    res.status(201).json(incident);
  } catch (error) {
    next(error);
  }
}

export async function getIncident(req, res, next) {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate("detectionIds")
      .populate("eventIds");
    if (!incident) return res.status(404).json({ error: { message: "Incident not found" } });
    res.json(incident);
  } catch (error) {
    next(error);
  }
}

export async function updateIncident(req, res, next) {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!incident) return res.status(404).json({ error: { message: "Incident not found" } });
    res.json(incident);
  } catch (error) {
    next(error);
  }
}
