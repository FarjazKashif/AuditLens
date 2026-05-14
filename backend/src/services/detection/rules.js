export const detectionRules = [
  {
    id: "AUTH_FAILED_BURST",
    name: "Failed login burst",
    severity: "high",
    evaluate(events) {
      const failures = events.filter((event) => event.eventType === "auth.failure");
      return failures.length >= 5
        ? {
            eventIds: failures.map((event) => event._id),
            reason: `${failures.length} authentication failures observed in the correlation window.`
          }
        : null;
    }
  },
  {
    id: "AUTH_SUCCESS_AFTER_FAILURES",
    name: "Successful login after repeated failures",
    severity: "critical",
    evaluate(events) {
      const ordered = [...events].sort((a, b) => a.timestamp - b.timestamp);
      const failures = ordered.filter((event) => event.eventType === "auth.failure");
      const success = ordered.find((event) => event.eventType === "auth.success");
      return failures.length >= 3 && success
        ? {
            eventIds: [...failures, success].map((event) => event._id),
            reason: "A successful login followed repeated authentication failures for a related entity."
          }
        : null;
    }
  },
  {
    id: "PRIVILEGE_CHANGE_AFTER_AUTH",
    name: "Privilege change after suspicious authentication",
    severity: "high",
    evaluate(events) {
      const hasSuspiciousAuth = events.some((event) => event.eventType === "auth.failure" || event.eventType === "auth.success");
      const privilegeChange = events.find((event) => event.eventType === "identity.privilege_change");
      return hasSuspiciousAuth && privilegeChange
        ? {
            eventIds: events.filter((event) => ["auth.failure", "auth.success", "identity.privilege_change"].includes(event.eventType)).map((event) => event._id),
            reason: "Privilege activity occurred in a window containing suspicious authentication activity."
          }
        : null;
    }
  }
];
