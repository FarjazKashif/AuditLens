import { Detection } from "../models/Detection.js";
import { runDetections } from "../services/detection/detection.service.js";

export async function runDetectionRules(req, res, next) {
  try {
    const detections = await runDetections(req.body || {});
    res.status(201).json({ detections });
  } catch (error) {
    next(error);
  }
}

export async function listDetections(req, res, next) {
  try {
    const detections = await Detection.find(req.query.status ? { status: req.query.status } : {})
      .sort({ matchedAt: -1 })
      .limit(100);
    res.json(detections);
  } catch (error) {
    next(error);
  }
}

export async function updateDetection(req, res, next) {
  try {
    const detection = await Detection.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    if (!detection) return res.status(404).json({ error: { message: "Detection not found" } });
    res.json(detection);
  } catch (error) {
    next(error);
  }
}
