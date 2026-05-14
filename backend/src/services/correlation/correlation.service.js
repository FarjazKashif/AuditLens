import { Event } from "../../models/Event.js";

export async function correlateEvents({ start, end, actor, asset, sourceIp }) {
  const query = {
    timestamp: {
      $gte: start ? new Date(start) : new Date(Date.now() - 24 * 60 * 60 * 1000),
      $lte: end ? new Date(end) : new Date()
    }
  };

  if (actor) query["actor.user"] = actor;
  if (asset) query["asset.hostname"] = asset;
  if (sourceIp) query["source.ip"] = sourceIp;

  const events = await Event.find(query).sort({ timestamp: 1 }).limit(1000);
  const groups = new Map();

  for (const event of events) {
    for (const key of event.correlationKeys || []) {
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(event);
    }
  }

  return [...groups.entries()]
    .filter(([, groupedEvents]) => groupedEvents.length > 1)
    .map(([key, groupedEvents]) => ({
      key,
      eventCount: groupedEvents.length,
      firstSeen: groupedEvents[0].timestamp,
      lastSeen: groupedEvents[groupedEvents.length - 1].timestamp,
      severity: highestSeverity(groupedEvents),
      events: groupedEvents
    }));
}

function highestSeverity(events) {
  const order = ["low", "medium", "high", "critical"];
  return events.reduce((highest, event) => (order.indexOf(event.severity) > order.indexOf(highest) ? event.severity : highest), "low");
}
