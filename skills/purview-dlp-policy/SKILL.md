---
name: purview-dlp-policy
description: "Guidance for designing Microsoft Purview Data Loss Prevention (DLP) policies across Exchange, SharePoint, OneDrive, Teams, and Endpoint. Covers locations, conditions (SITs/labels), actions, simulation mode, and Endpoint DLP. WHEN: Purview DLP, data loss prevention policy, prevent data exfiltration, Endpoint DLP, DLP rule conditions, DLP simulation mode, block sensitive sharing, policy tips, DLP across Microsoft 365."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview DLP Policy

Microsoft Purview Data Loss Prevention (DLP) detects and prevents risky sharing, transfer, or
use of sensitive data across Microsoft 365 services and Windows/macOS endpoints — anchored to the
Zero Trust **Data** pillar.

## When to use
Stopping exfiltration of sensitive content (PII, financial, IP, regulated data) across email,
collaboration, and endpoints.

## Approach
1. **Locations** — Choose locations explicitly: Exchange, SharePoint, OneDrive, Teams, and
   **Endpoint** (a single policy does not cover all locations by default). Endpoint DLP requires
   onboarded devices and E5 Compliance.
2. **Conditions** — Match on **SITs**, **sensitivity labels**, trainable classifiers, and content
   volume thresholds (e.g., 5+ credit-card numbers).
3. **Actions by severity** — Low = audit only; Medium = warn with override + justification;
   High = block + notify. Configure policy tips and incident reports.
4. **Simulation first** — Run in **simulation mode** (7–14 days), review matches in Activity
   Explorer, tune false positives, then promote to enforcement.
5. **Exceptions** — Define trusted recipients/domains and business-justification overrides so
   legitimate processes aren't blocked.
6. **Operate** — Route incidents to a shared compliance mailbox; review override justifications.

## Guardrails
- Never enable **block** without exception handling and a simulation period.
- DLP precedence: policies evaluate in priority order; the most restrictive action wins.
- Complete data classification first — DLP without classification generates excessive noise.
- Teams DLP applies only to messages posted **after** the policy is created (not retroactive).

## Example prompts
- `Help me build a Purview DLP policy to protect financial data in Exchange and SharePoint.`
- `How do I configure Endpoint DLP to block USB copy of sensitive files?`
- `What DLP simulation mode steps should I follow before enforcing a new policy?`
- `Design a DLP policy for GDPR that covers personal data across Microsoft 365.`
- `How do I tune a DLP rule to reduce false positives on credit card numbers?`

## Microsoft Learn
- Create & deploy a DLP policy: https://learn.microsoft.com/purview/dlp-create-deploy-policy
- Endpoint DLP: https://learn.microsoft.com/purview/endpoint-dlp-learn-about
- DLP policy reference: https://learn.microsoft.com/purview/dlp-policy-reference
