---
name: defender-xdr
description: "Guidance for Microsoft Defender XDR, the extended detection and response suite that correlates signals across endpoints, identities, email, and cloud apps into unified incidents. Covers onboarding, incident investigation, advanced hunting, and automatic attack disruption. WHEN: Microsoft Defender XDR, XDR incident investigation, correlate alerts across workloads, advanced hunting KQL, automatic attack disruption, Defender portal incidents, cross-domain detection, how do I investigate an attack across multiple Microsoft 365 products, alert correlation across endpoint and identity, unified incident view, I see an alert but do not know the full attack story. DO NOT USE when the need is SIEM log ingestion or custom KQL detections from third-party sources (use sentinel), merging Sentinel into the Defender portal (use unified-secops-platform), or endpoint-only EDR (use defender-for-endpoint)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender XDR

Microsoft Defender XDR is a unified pre- and post-breach enterprise defence suite. It natively
correlates signals across endpoints, identities, email/collaboration, and cloud apps to deliver
a single prioritised **incident** with the full attack story.

## When to use
Running coordinated detection and response across the Microsoft 365 estate from one portal
(security.microsoft.com), instead of investigating each workload in isolation.

## Component workloads
- **Defender for Endpoint** — endpoints (EDR/EPP)
- **Defender for Identity** — on-prem AD and Entra ID identity threats
- **Defender for Office 365** — email and collaboration
- **Defender for Cloud Apps** — SaaS / cloud app activity and posture

## Approach
1. **Onboard each workload** so signals flow into the unified incident queue.
2. **Investigate by incident**, not by alert — incidents group related alerts, assets, and
   evidence with an attack graph and timeline.
3. **Advanced hunting** — proactively query the shared schema (DeviceEvents, IdentityLogonEvents,
   EmailEvents, CloudAppEvents, etc.) with KQL; convert useful hunts into custom detection rules.
4. **Automatic attack disruption** — let Defender XDR contain high-confidence active attacks
   (e.g., disable a user, isolate a device) using cross-signal confidence.
5. **AIR** — enable automated investigation and remediation to reduce analyst load.

## Guardrails
- Configure role-based access (unified RBAC) before broad enablement.
- Review automatic attack disruption scope and exclusions in a controlled rollout.
- Tune custom detection rules to limit alert fatigue.

## Example prompts
- `What are the first Defender XDR controls I should enable for a new Microsoft 365 tenant?`
- `Walk me through how to investigate a multi-stage incident in Defender XDR.`
- `Write an advanced hunting KQL query to find suspicious PowerShell execution across devices.`
- `How does automatic attack disruption work and what should I configure first?`
- `How do I correlate an identity alert with a device alert in the same incident?`

## Microsoft Learn
- Advanced hunting: https://learn.microsoft.com/defender-xdr/advanced-hunting-overview
- Attack disruption: https://learn.microsoft.com/defender-xdr/automatic-attack-disruption
