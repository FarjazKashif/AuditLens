# Domain Context: Security Audit and Log Analysis

That is why the assistant must interpret logs in context.

## Common audit signals
### Authentication
- repeated failed logins
- login from unusual IP ranges
- login at unusual hours
- sudden success after a failure series

### Privilege use
- admin group changes
- sudo or elevated token usage
- privilege escalation attempts
- access to protected resources after elevation

### Process behavior
- odd parent-child process chains
- shell invocation from a document editor
- scripted tools launched unexpectedly
- command-line flags that suggest automation or misuse

### File and resource access
- access to sensitive files outside normal hours
- bulk reads of protected records
- repeated access to the same restricted resource

## Common false positives
- scheduled jobs
- backup scripts
- admin maintenance windows
- identity provider syncs
- system patching activity
- monitoring agents

## Interpretation rules
- One event is rarely enough.
- Sequence matters more than isolated lines.
- Time proximity matters.
- Source trust matters.
- Policy context matters.

## Analyst reasoning pattern
1. Identify the event type.
2. Extract the timeline.
3. Check whether the actor is expected.
4. Compare against policy or playbook.
5. Decide whether the pattern is suspicious.
6. Recommend a follow-up action.

## Typical conclusions
- benign
- suspicious but inconclusive
- likely policy violation
- likely brute force
- likely privilege misuse
- likely incident requiring escalation

## Important caution
The assistant is not a forensic truth engine. It is a grounded reasoning aid. Final security decisions should still be reviewed by a human analyst.