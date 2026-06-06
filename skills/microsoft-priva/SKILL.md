---
name: microsoft-priva
description: "Guidance for Microsoft Priva — privacy risk management and subject rights requests. Covers Priva Privacy Risk Management and Priva Subject Rights Requests to find privacy risks and fulfill data subject requests (GDPR/CCPA). WHEN: Microsoft Priva, privacy risk management, subject rights request, DSAR, data subject request, GDPR fulfillment, privacy risk policies, data minimization, overexposed personal data."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Priva

Microsoft Priva helps organisations manage privacy risk and fulfil data subject (privacy) rights
requests for personal data held in Microsoft 365 and beyond.

## When to use
Operationalising privacy obligations (GDPR, CCPA, and similar): reducing personal-data risk and
responding to subject rights requests at scale.

## Solutions
- **Priva Privacy Risk Management** — Detect and remediate privacy risks such as data
  **overexposure**, **hoarding**, and risky **transfers** of personal data, with policies and
  user-empowerment notifications.
- **Priva Subject Rights Requests (SRR)** — Automate discovery, review, and secure fulfilment of
  data subject requests (find, collect, review for conflicts, and produce personal data).

## Approach
1. **Establish data understanding** — Leverage Purview classification (SITs for personal data) so
   Priva can find personal/sensitive data.
2. **Privacy Risk Management** — Create policies for overexposure/transfer/minimisation; route
   remediation and user notifications.
3. **Subject Rights Requests** — Configure SRR workflows; search across sources, review with
   collaboration, redact, and securely deliver.
4. **Report** — Track request SLAs and privacy posture trends.

## Guardrails
- Priva depends on accurate personal-data classification — invest in SITs/classifiers first.
- Coordinate with legal/privacy office on request handling and retention of request artifacts.
- Apply least-privilege roles; SRR content is highly sensitive.

## Microsoft Learn
- Priva overview: https://learn.microsoft.com/privacy/priva/priva-overview
- Privacy Risk Management: https://learn.microsoft.com/privacy/priva/risk-management-policies
- Subject Rights Requests: https://learn.microsoft.com/privacy/priva/subject-rights-requests
- Get started: https://learn.microsoft.com/privacy/priva/priva-setup
