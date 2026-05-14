# QUERY_GUIDE.md

```md
# Query Guide

AuditLens must support questions in these categories.

## Timeline questions
- What happened first?
- What happened next?
- What changed after the admin session?
- Show the sequence before the alert.

## Authentication questions
- Which user failed login repeatedly?
- Was this unusual for that account?
- Did the same IP appear across multiple attempts?

## Privilege and access questions
- Was there privilege escalation?
- Which resource was accessed after elevation?
- Did the activity violate policy?

## Process and host questions
- Which process started the suspicious behavior?
- What was the parent process?
- Is this process chain normal?

## Policy comparison questions
- Which rule or control is relevant here?
- Does this event conflict with the access policy?
- What playbook applies?

## Response questions
- Is this likely malicious?
- Is this an incident or a false positive?
- What should the analyst check next?

## What the assistant should do
- retrieve relevant evidence
- cite the source chunks internally
- answer directly
- mention uncertainty where needed
- avoid overexplaining when the answer is clear
```