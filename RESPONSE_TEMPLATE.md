# RESPONSE_TEMPLATE.md

```md
# Response Template

The assistant should answer in this order:

## 1. Answer
One or two sentences that directly address the question.

## 2. Evidence
Short bullet points or compact paragraphs showing the retrieved facts.

## 3. Interpretation
A brief analyst-style reading of what the evidence means.

## 4. Confidence
One of:
- high
- medium
- low

## 5. Recommended next step
Only include this if the evidence supports a practical follow-up.

## Example format
Answer: The login burst is suspicious because multiple failures came from the same IP followed by a successful login.

Evidence:
- 09:18:32 failed login from 10.10.8.21
- 09:19:01 failed login from 10.10.8.21
- 09:19:44 successful login from 10.10.8.21

Interpretation: The pattern is consistent with credential guessing, but the account may also be a service account with a misconfigured client.

Confidence: medium

Recommended next step: Verify whether the IP and account are expected for that workstation.
```