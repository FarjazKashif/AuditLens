import { correlateEvents } from "../services/correlation/correlation.service.js";

export async function runCorrelation(req, res, next) {
  try {
    const correlations = await correlateEvents(req.body || {});
    res.json({ correlations });
  } catch (error) {
    next(error);
  }
}
