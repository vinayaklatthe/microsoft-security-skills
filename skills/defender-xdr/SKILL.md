---
name: defender-xdr
description: "Guidance for Microsoft Defender XDR — the unified extended detection and response suite that correlates signals across endpoints, identities, email, and cloud apps into prioritised incidents with attack-graph context. Covers onboarding the four core workloads, incident investigation, advanced hunting in KQL, custom detection rules, automatic attack disruption, AIR, and unified RBAC. WHEN: Microsoft Defender XDR, XDR incident investigation, correlate alerts across workloads, advanced hunting KQL, automatic attack disruption, AIR, Defender portal incidents, cross-domain detection, how do I investigate an attack across multiple Microsoft 365 products, alert correlation across endpoint and identity, unified incident view, attack graph, custom detection rule, unified RBAC. DO NOT USE when the need is SIEM log ingestion or custom KQL detections from third-party sources (use sentinel), merging Sentinel into the Defender portal (use unified-secops-platform), or endpoint-only EDR (use defender-for-endpoint)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender XDR

Microsoft Defender XDR is a unified pre- and post-breach defence suite. It natively correlates
signals across endpoints (MDE), identities (MDI + Entra ID Protection), email/collaboration
(MDO), and cloud apps (MDA) to deliver a single prioritised **incident** with the full attack
story - graph, timeline, evidence, and recommended actions.

## When to use
Running coordinated detection and response across the Microsoft 365 estate from one portal
(security.microsoft.com), instead of investigating each workload in isolation. Also when you
need the **attack disruption** feature - it requires the XDR correlation.

**Do not use this skill** when ingesting third-party logs or writing custom KQL detections
across non-Microsoft sources (`sentinel`), merging Sentinel + Defender into one portal
(`unified-secops-platform`), or tuning endpoint-only policies (`defender-for-endpoint`).

## Map the signal to the source workload

XDR is only as good as the workloads feeding it. Use this to confirm what's onboarded and
which alerts are missing.

| If the signal is... | Source workload | Required licence |
|---|---|---|
| Process tree, network connection, file hash on a device | **Defender for Endpoint (MDE) P2** | M365 E5 / MDE P2 |
| Kerberos anomaly, DCSync, AD CS abuse, on-prem lateral movement | **Defender for Identity (MDI)** | M365 E5 / EMS E5 |
| Risky sign-in, leaked credentials, anomalous token use | **Entra ID Protection** | Entra ID P2 |
| Phishing URL click, malicious attachment detonation, BEC | **Defender for Office 365 P2** | M365 E5 / MDO P2 |
| Risky OAuth app, anomalous SaaS upload, MCAS-style alert | **Defender for Cloud Apps (MDA)** | MDA standalone or E5 |
| Azure resource alert, AKS pod compromise | **Defender for Cloud** | DfC plan-based |

> **Rule of thumb:** if an incident shows "1 alert, 1 entity," a workload is missing. A real
> attack always touches at least two of the above.

## Approach

1. **Onboard the core workloads first** — In order: MDE (highest endpoint signal), MDI (lateral
   movement), Entra ID Protection, MDO. Add MDA when SaaS apps are in scope. Each workload
   onboarded to its own portal still surfaces in the unified Defender portal.
   *Verify: `Incidents` view shows alerts from at least 3 different `ServiceSource` values
   after 24 hours.*

2. **Configure unified RBAC before broad enablement** — Move from per-workload roles to
   **Microsoft Defender XDR Unified RBAC** (security.microsoft.com → Permissions). Build
   custom roles scoped by data source + permission level. Pilot in active-directory mode for
   30 days before enforcing.
   *Verify: a Tier-1 analyst can triage and contain but not modify policies; a Tier-3 can
   tune detections but not change RBAC.*

3. **Investigate by incident, not by alert** — Incidents group related alerts, assets, and
   evidence with an attack graph. Always start from the **Incidents** queue. The attack graph
   shows the kill chain across workloads in one view.
   *Verify: open a multi-alert incident; the graph shows entities (user, device, mailbox,
   IP) linked across workloads.*

4. **Enable automatic attack disruption** — Defender XDR can contain high-confidence active
   attacks (disable a user, isolate a device, contain a mailbox) using cross-signal
   confidence ≥ 99%. Roll out in **report-only** for 14 days, review actions, then enforce.
   *Verify: review `Action center` for past 14 days; no false positives in disruption actions.*

5. **Advanced hunting** — Query the shared schema in KQL (`DeviceEvents`, `IdentityLogonEvents`,
   `EmailEvents`, `CloudAppEvents`). Promote useful hunts into **custom detection rules** with
   incident grouping and impacted entities mapped.
   *Verify: each custom rule has entity mappings; without them, alerts don't join into
   incidents.*

6. **Automated Investigation & Remediation (AIR)** — Configure remediation level per device
   group (`No remediation` → `Semi` → `Full`). Most environments run Full on workstations,
   Semi on servers.

7. **Coverage review monthly** — Use the **MITRE ATT&CK coverage** view to find blind spots.
   Track median time-to-acknowledge and time-to-contain as the only two SOC metrics that
   matter for XDR ROI.

## Guardrails
- **All four workloads or you don't have XDR.** A "Defender XDR with only MDE" deployment is
  EDR with a fancy portal. The correlation needs at least MDE + MDI + Entra ID Protection.
- **Unified RBAC first, then enable broadly.** Without it, analysts get tenant-wide rights
  via per-workload role groups. Lock down RBAC before granting access.
- **Run attack disruption in report-only first.** It will isolate devices and disable users.
  Pilot the actions for 14 days, review the Action Center, then enforce.
- **Custom detection rules need entity mappings.** Without them, alerts don't correlate into
  incidents and the attack graph is broken.
- **Don't suppress incidents at the queue level.** Suppress at the alert source (MDE/MDI/MDO)
  so the underlying detection still tunes. Queue suppression hides the symptom, not the cause.
- **The Defender portal is the SOC pane.** Don't have analysts swivel between MDE, MDI, MDO
  portals - that's the problem XDR exists to solve.

## Common anti-patterns
- **"We onboarded MDE only and call it XDR"** - Half the kill chain is invisible. Onboard MDI
  and Entra ID Protection before claiming XDR coverage.
- **"Each Defender workload has its own analyst team"** - Defeats the unified investigation
  model. One incident, one analyst, all workloads.
- **"Enabled attack disruption tenant-wide on day one"** - Will disrupt legitimate activity
  (e.g. a pen test that looks like ransomware). Report-only 14 days first.
- **"Custom rules without entity mappings"** - Alerts don't aggregate into incidents. Always
  map at least one entity (user/device/IP).
- **"Use unified RBAC for some workloads and legacy RBAC for others"** - Permission overlap
  creates over-privilege. Migrate all workloads or none.
- **"AIR set to No remediation everywhere because we don't trust automation"** - Analyst hours
  wasted on rote tasks. Start Semi on workstations and review.

## Example prompts
- `What are the first Defender XDR controls I should enable for a new Microsoft 365 tenant?`
- `Walk me through how to investigate a multi-stage incident in Defender XDR using the attack graph.`
- `Write an advanced hunting KQL query to find suspicious PowerShell execution across devices.`
- `How does automatic attack disruption work and what should I configure first?`
- `How do I correlate an identity alert with a device alert in the same incident?`
- `Design the unified RBAC roles for a 3-tier SOC.`
- `Convert this hunting query into a custom detection rule with entity mappings.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-xdr/microsoft-365-defender
- Advanced hunting: https://learn.microsoft.com/defender-xdr/advanced-hunting-overview
- Attack disruption: https://learn.microsoft.com/defender-xdr/automatic-attack-disruption
- Custom detection rules: https://learn.microsoft.com/defender-xdr/custom-detection-rules
- Unified RBAC: https://learn.microsoft.com/defender-xdr/manage-rbac
- Incident investigation: https://learn.microsoft.com/defender-xdr/investigate-incidents
- AIR overview: https://learn.microsoft.com/defender-xdr/m365d-autoir
