import { Detection } from "../../models/Detection.js";
import { correlateEvents } from "../correlation/correlation.service.js";
import { detectionRules } from "./rules.js";

export async function runDetections({ start, end, actor, asset, sourceIp }) {
  const correlations = await correlateEvents({ start, end, actor, asset, sourceIp });
  const detections = [];

  for (const group of correlations) {
    for (const rule of detectionRules) {
      const match = rule.evaluate(group.events);
      if (!match) continue;

      const detection = await Detection.create({
        ruleId: rule.id,
        ruleName: rule.name,
        severity: rule.severity,
        window: { start: group.firstSeen, end: group.lastSeen },
        eventIds: match.eventIds,
        entities: { correlationKey: group.key },
        reason: match.reason
      });

      detections.push(detection);
    }
  }

  return detections;
}
