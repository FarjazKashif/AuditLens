import { buildIncidentTimeline } from "../services/timeline/timeline.service.js";

export async function getTimeline(req, res, next) {
  try {
    const timeline = await buildIncidentTimeline(req.params.id);
    res.json({ timeline });
  } catch (error) {
    next(error);
  }
}
