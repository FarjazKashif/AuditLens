# EVAL_SET.md

```md
# Evaluation Set

Use this file to test whether the assistant is grounded and useful.

## Core questions
1. Summarize the incident timeline.
2. Which account was involved in the suspicious login sequence?
3. Is the failed login burst more likely brute force or a normal system process?
4. What evidence suggests privilege escalation?
5. What was the first abnormal event?
6. Which policy is relevant to this event?
7. What should the analyst check next?
8. Are the logs sufficient to conclude malicious behavior?
9. Which host appears most relevant to the incident?
10. What process chain is visible in the logs?

## Expected answer qualities
- uses source evidence
- avoids guessing
- distinguishes facts from interpretation
- states uncertainty when needed
- produces a useful analyst-style conclusion

## Failure cases
- inventing an IP address
- guessing a timestamp
- calling something malicious without evidence
- ignoring policy context
- returning a generic chatbot answer
```
