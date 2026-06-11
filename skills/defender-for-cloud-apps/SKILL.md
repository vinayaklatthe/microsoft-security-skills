---
name: defender-for-cloud-apps
description: "Guidance for Microsoft Defender for Cloud Apps (MDA) — the CASB for SaaS discovery, app governance, session controls, and threat detection. Covers Cloud Discovery via Defender for Endpoint integration, OAuth app governance, Conditional Access App Control (reverse-proxy session policies), and SaaS security posture (SSPM). WHEN: Defender for Cloud Apps, MDA, CASB, shadow IT discovery, cloud app governance, OAuth app risk, session control, Conditional Access App Control, SaaS security posture management, SSPM, sanction or unsanction app, Cloud App Catalog, app connectors. DO NOT USE for IaaS / PaaS posture (use defender-for-cloud-hardening), endpoint EDR (use defender-for-endpoint), or DLP (use purview-dlp-policy)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Cloud Apps

Microsoft Defender for Cloud Apps (MDA) is a Cloud Access Security Broker (CASB) and SaaS
security solution providing visibility into cloud app usage, governance of OAuth-connected
apps, real-time session controls via Conditional Access App Control, and threat detection
across connected SaaS services.

## When to use
Discovering shadow IT, governing OAuth apps connected to Microsoft 365, applying in-session
controls, and managing SaaS posture (SSPM). Use this skill when the question is about
**applications** (SaaS or third-party), not IaaS or endpoints.

**Do not use this skill** for IaaS / PaaS posture (`defender-for-cloud-hardening`), EDR
(`defender-for-endpoint`), or DLP authoring (`purview-dlp-policy`).

## Pick the MDA capability

| Goal | Capability | Notes |
|---|---|---|
| Find unsanctioned cloud apps in use | **Cloud Discovery** via MDE integration | Agentless; uses MDE telemetry |
| Get activity / file visibility for sanctioned SaaS | **App connector** (API-based) | M365, Salesforce, ServiceNow, Workday |
| Govern OAuth apps connected to Microsoft 365 | **App governance** add-on | Risk score + automated policies |
| Block file download in browser session | **Conditional Access App Control** (session) | Reverse proxy; integrates with CA |
| Detect anomalous user activity (impossible travel, mass download) | **Anomaly detection policies** | UEBA-style |
| Posture for connected SaaS (config drift) | **SaaS Security Posture Management (SSPM)** | Per-app recommendations |
| Investigate / contain a compromised SaaS account | **Governance actions** | Suspend, force re-auth, revoke OAuth |

> **Rule of thumb:** start with Cloud Discovery via MDE (free with E5) to find shadow IT
> and app governance for OAuth risk - those two cover 80% of the SaaS attack surface. Session
> control via CAAC is powerful but the reverse proxy adds operational surface area; pilot it
> narrowly.

## Approach

1. **Enable Cloud Discovery via MDE** — Integration → Microsoft Defender for Endpoint → on.
   No agents, no log uploads - discovery happens automatically from MDE telemetry on
   managed endpoints.
   *Verify: Discovery dashboard populates within 24-48 hours; app catalogue scores visible.*

2. **Triage the Cloud App Catalog** — Sort by risk score + user count. **Sanction** approved
   apps; **unsanction** risky / unused apps (MDE then blocks them on managed endpoints).
   *Verify: top 10 high-user-count high-risk apps reviewed weekly.*

3. **Connect sanctioned SaaS via app connectors** — Microsoft 365, Salesforce, ServiceNow,
   Workday, GitHub Enterprise via API connector. Provides activity log, file inventory,
   admin / user account governance.

4. **Turn on app governance for OAuth risk** — Microsoft Graph permissions are the SaaS
   blast radius. App governance scores third-party OAuth apps by risk and permission
   privilege. Auto-policy: block apps requesting > X high-privilege permissions or
   unverified publisher.
   *Verify: app governance shows risk distribution; high-risk apps either approved or
   blocked, not lingering.*

5. **Conditional Access App Control - pilot session policies** — Reverse-proxy session
   control for browser sessions to cloud apps. Use cases: block download on unmanaged
   devices, force document-labeling on upload, monitor copy/paste.
   *Verify: a session from an unmanaged device shows the watermark / download block; from
   a compliant device, no friction.*

6. **Anomaly detection + alert tuning** — Default policies (impossible travel, mass
   download, multiple failed sign-ins, ransomware activity). Tune thresholds; stream to
   Defender XDR for unified incident view.

7. **Operationalise** — Stream MDA alerts into XDR / Sentinel. Define playbooks for the
   top 5 alert types (impossible travel, mass download, OAuth consent granted, file
   externally shared, admin activity from unusual location).

## Guardrails
- **Cloud Discovery data can include user activity - set anonymisation per privacy
  requirements.** EU works councils may require user anonymisation in the discovery view.
- **Pilot session policies; reverse-proxy session control can affect app behaviour.** Some
  SaaS app features break under the reverse proxy. Test thoroughly per app.
- **Prioritise app governance for apps with broad Microsoft Graph permissions.** Mail.Read
  + Files.Read.All for a third-party app = data-exfil risk on first compromise. Review
  before consent or auto-block.
- **Sanction state matters.** Unsanctioning blocks via MDE - confirm impact before flipping
  high-user apps.
- **OAuth consent should be admin-only for most permissions.** User-consent for high-
  privilege scopes is a phish-then-consent route.
- **MDA isn't DLP.** Use Purview DLP for content-aware policies; MDA for context (session,
  app, device).

## Common anti-patterns
- **"Discover apps but never sanction"** - Visibility without action. Sort by risk, decide.
- **"Auto-block all newly discovered apps"** - User outrage; legitimate apps blocked.
  Review then sanction / unsanction.
- **"OAuth governance later - it's just app permissions"** - First compromised OAuth app
  with Mail.Read = mass exfil. Govern from day one.
- **"Session policies on every app"** - Pilot one app; broaden carefully.
- **"Ignore the privacy / works-council angle"** - Discovery rollout blocked by HR or
  legal mid-flight. Anonymisation question is the first one.
- **"MDA alerts not in XDR / Sentinel"** - Analysts miss them. Stream by default.

## Example prompts
- `Discover shadow IT via Defender for Endpoint integration and sanction or unsanction cloud apps.`
- `Set up Conditional Access App Control session policies for unmanaged devices.`
- `Assess OAuth app risk with app governance and block high-risk consents.`
- `Connect Microsoft 365 and Salesforce via app connectors for full activity visibility.`
- `Tune impossible-travel and mass-download anomaly policies.`
- `Stream MDA alerts into Defender XDR for unified investigation.`

## Microsoft Learn
- MDA overview: https://learn.microsoft.com/defender-cloud-apps/what-is-defender-for-cloud-apps
- Cloud Discovery: https://learn.microsoft.com/defender-cloud-apps/set-up-cloud-discovery
- MDE integration for Discovery: https://learn.microsoft.com/defender-cloud-apps/mde-integration
- App governance: https://learn.microsoft.com/defender-cloud-apps/app-governance-manage-app-governance
- Conditional Access App Control: https://learn.microsoft.com/defender-cloud-apps/proxy-intro-aad
- App connectors: https://learn.microsoft.com/defender-cloud-apps/enable-instant-visibility-protection-and-governance-actions-for-your-apps
- Anomaly detection: https://learn.microsoft.com/defender-cloud-apps/anomaly-detection-policy
- SSPM: https://learn.microsoft.com/defender-cloud-apps/security-saas
