---
name: defender-for-cloud-apps
description: "Guidance for Microsoft Defender for Cloud Apps (MDA) — the CASB for SaaS discovery, app governance, session controls, and threat detection. Covers Cloud Discovery, OAuth app governance, Conditional Access App Control, and SaaS security posture. WHEN: Defender for Cloud Apps, CASB, shadow IT discovery, cloud app governance, OAuth app risk, session control, Conditional Access App Control, SaaS security posture management, sanction or unsanction app."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Cloud Apps

Microsoft Defender for Cloud Apps (MDA) is a Cloud Access Security Broker (CASB) and SaaS
security solution providing visibility into cloud app usage, data and threat protection,
app governance, and SaaS security posture management (SSPM).

## When to use
Discovering shadow IT, governing OAuth apps, applying real-time session controls, and detecting
threats across connected SaaS services.

## Approach
1. **Cloud Discovery** — Identify shadow IT by ingesting logs (ideally via Defender for Endpoint
   integration for seamless, agentless discovery). Review the Cloud App Catalog risk scores and
   **sanction/unsanction** apps.
2. **App connectors** — Connect key SaaS apps (Microsoft 365, and major third-party apps) via
   API connectors for activity visibility, data governance, and anomaly detection.
3. **App governance** — Monitor and govern **OAuth apps** with access to Microsoft 365 data;
   detect risky/over-privileged apps and anomalous API behaviour.
4. **Conditional Access App Control** — Integrate with Entra Conditional Access to apply
   **session policies** (block download, apply labels, monitor) for in-session control.
5. **Policies** — Use file, activity, anomaly detection, and session policies; align with
   Insider Risk and DLP where relevant.
6. **SSPM** — Action security posture recommendations for connected SaaS apps.

## Guardrails
- Cloud Discovery data can include user activity — set anonymisation per privacy requirements.
- Pilot session policies; reverse-proxy session control can affect app behaviour.
- Prioritise app governance for apps with broad Microsoft Graph permissions.

## Example prompts
- `Discover shadow IT and sanction or unsanction cloud apps.`
- `Set up Conditional Access App Control session policies.`
- `How do I assess OAuth app risk and govern cloud apps?`
- `Review the Cloud App Catalog and block risky apps.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-cloud-apps/what-is-defender-for-cloud-apps
- Cloud Discovery: https://learn.microsoft.com/defender-cloud-apps/set-up-cloud-discovery
- App governance: https://learn.microsoft.com/defender-cloud-apps/app-governance-manage-app-governance
- Conditional Access App Control: https://learn.microsoft.com/defender-cloud-apps/proxy-intro-aad
