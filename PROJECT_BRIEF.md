# Project Brief: AuditLens

## Problem
Security analysts often need to ask questions across audit logs, system logs, application logs, policies, and incident notes. The information is fragmented, time-sensitive, and easy to misread manually.

## Goal
Build a retrieval-grounded assistant that can answer security audit and log analysis questions clearly, with evidence.

## Target users
- security students
- SOC analysts
- security engineers
- audit and compliance reviewers
- anyone investigating access, authentication, or privilege-related events

## Key question types
- summarize event timelines
- identify suspicious logins
- explain anomalous access patterns
- highlight possible privilege escalation
- compare events against policy or playbook guidance

## Inputs
- CSV audit logs
- text logs
- markdown incident notes
- markdown policies
- markdown response playbooks

## Outputs
- short answer
- evidence snippets
- timeline references
- confidence level
- recommended next step

## Success criteria
The assistant is successful when it:
- answers from retrieved evidence
- avoids unsupported claims
- handles log and policy questions
- returns useful analyst-style summaries
- can be tested with a small evaluation set