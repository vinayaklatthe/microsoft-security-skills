---
name: unified-secops-platform
description: "Guidance for the Microsoft unified security operations platform that brings Microsoft Sentinel, Microsoft Defender XDR, Security Copilot, Threat Intelligence, and Microsoft Security Exposure Management together in the Microsoft Defender portal. Covers prerequisites, onboarding Sentinel, unified incident queue, advanced hunting across SIEM+XDR, and RBAC. WHEN: unified SecOps, onboard Sentinel to Defender portal, single SOC pane of glass, unified incident queue, connect Sentinel workspace to Defender XDR, exposure management, unified portal, merge Sentinel and Defender XDR, reduce context-switching for analysts, single pane of glass, move off the Azure Sentinel portal. DO NOT USE for Sentinel-only workspace design (use sentinel) or Defender XDR-only incident investigation (use defender-xdr)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Unified SecOps Platform (Microsoft Defender portal)

The unified security operations platform consolidates SIEM (Microsoft Sentinel), XDR (Microsoft
Defender XDR), Microsoft Security Copilot, Microsoft Defender Threat Intelligence, and
Microsoft Security Exposure Management into a single experience in the **Microsoft Defender
portal** (security.microsoft.com).

## When to use
Standardising the SOC on one portal, unifying the incident queue across SIEM and XDR signals,
and reducing context-switching for analysts.

**Do not use this skill** for:
- Workspace, data connector, or analytics rule design only (use `sentinel`)
- Endpoint/identity/email/cloud-app investigation only (use `defender-xdr`)
- Threat-hunting query writing only (use `sentinel` for KQL guidance)

## Pick the right starting question

| Today's pain | Use the unified portal to... | Notes |
|---|---|---|
| Analysts toggle between Azure portal and security.microsoft.com | Onboard Sentinel to the Defender portal | One queue, one entity graph |
| Two incident queues, manual correlation | Unified incident queue across SIEM + XDR | Auto-correlation, single triage |
| Hunting across Defender + Sentinel tables is two queries | Advanced hunting in the Defender portal | Single KQL surface |
| Need attack-surface and attack-path view | Add Exposure Management | Prioritise by blast radius |
| SOC wants AI assist inline | Add Security Copilot embedded | Per-incident summary |

> **Rule of thumb:** if your SOC has Sentinel **and** Defender XDR, you should be in the
> unified portal. The Azure Sentinel portal is the legacy surface; new investments land in the
> Defender portal first.

## Approach

1. **Confirm prerequisites** - A Microsoft Sentinel workspace, Microsoft Defender XDR onboarded
   with at least one Defender product, the required Entra and Sentinel **RBAC** roles for the
   onboarding admin, and tenant alignment between the Sentinel workspace and the Defender XDR
   tenant.
   *Verify: the workspace and Defender XDR are in the same tenant; the admin holds
   Microsoft Sentinel Contributor + a Defender XDR security role.*
2. **Pick the primary workspace** - Only **one Sentinel workspace** can be the primary in the
   unified portal per tenant. If you run multiple workspaces, decide which carries the unified
   experience and which remain Azure-portal-only. Plan migrations accordingly.
   *Verify: workspace inventory documents which is primary and the rationale.*
3. **Onboard Sentinel to the Defender portal** - From the Defender portal, connect the Log
   Analytics workspace. Onboarding is non-destructive to existing Sentinel content (analytics
   rules, hunting queries, playbooks) but changes where analysts work.
   *Verify: Defender portal → Investigation & response shows incidents from both Sentinel
   analytics rules and Defender XDR detections.*
4. **Validate the unified incident queue** - Incidents and alerts from Sentinel and Defender
   XDR merge into one queue with shared entities, enabling single-pane triage. Confirm Sentinel
   incidents that previously stood alone now correlate to XDR alerts where appropriate.
   *Verify: an end-to-end test attack (e.g. simulated phishing + sign-in anomaly) creates one
   correlated incident, not two.*
5. **Use unified advanced hunting** - Query both Sentinel and XDR tables together with KQL in
   the Defender portal hunting experience. Retire duplicate hunting queries that only existed
   to bridge the two surfaces.
   *Verify: a hunting query joining a Defender table (e.g. DeviceLogonEvents) and a Sentinel
   table runs in one window.*
6. **Layer in cross-cutting capabilities** - Add Security Copilot for inline AI assistance,
   Threat Intelligence for IOC management, and Exposure Management for attack-surface and
   attack-path insight. Each adds value but each adds licence/SCU cost - sequence by SOC pain.
   *Verify: each capability has a named SOC use case before enabling, not just a toggle flip.*
7. **Validate RBAC end-to-end** - Defender portal **unified RBAC** governs access to the merged
   experiences. Map existing Sentinel and Defender role assignments to the unified model and
   confirm no role escalation or unintended access has appeared.
   *Verify: a least-privilege analyst sees only their assigned workloads in both incident queue
   and hunting.*
8. **Migrate analyst workflow** - Update runbooks, shift links, and training to point at the
   Defender portal. Treat the Azure Sentinel portal as legacy for analyst day-to-day.

## Guardrails
- **Some Sentinel features behave differently** once onboarded to the Defender portal - review
  the "what's changed" guidance for analytics rule UX, workbook rendering, and incident
  enrichment before migrating analysts off the Azure portal.
- **Validate RBAC** carefully. Defender portal unified RBAC governs the merged experiences and
  can grant or restrict access differently than Sentinel-native or Defender-native RBAC alone.
- **One primary workspace** per tenant in the unified portal - multi-workspace SOCs need an
  explicit primary decision and a plan for the rest.
- **Onboarding is not a migration** - analytics rules, playbooks, and workbooks stay in
  Sentinel; the portal is the surface that changes. Treat content portability separately.
- **Cost surfaces shift but do not disappear.** Sentinel ingestion still bills via Log Analytics;
  Copilot bills via SCUs; Exposure Management may have separate licensing. Model before you
  enable.
- **Keep the Azure Sentinel portal accessible** during transition - some admin tasks (workspace
  settings, advanced data connector config) still live there.

## Common anti-patterns
- **"Onboard everything on day one."** Without an RBAC and workspace plan, you get noisy
  incident merges and analyst confusion.
- **Treating the Defender portal as a replacement for Sentinel content.** Rules and playbooks
  still live in Sentinel; the portal is the cockpit.
- **Skipping the RBAC validation step.** Unified RBAC can quietly grant cross-product access
  that Sentinel-only or Defender-only roles did not.
- **Multi-workspace tenants with no primary decision.** Analysts will not know which queue is
  the source of truth.
- **Enabling Exposure Management or Copilot before the unified queue is bedded in.** Layered
  capability on an unstable base just amplifies noise.

## Example prompts
- `Onboard a Sentinel workspace to the Defender portal for a single SOC pane.`
- `How do I merge Sentinel and Defender XDR into one unified incident queue?`
- `Move off the Azure Sentinel portal to the unified platform.`
- `Reduce analyst context-switching by adding Exposure Management to the unified portal.`
- `What changes for my analysts after onboarding Sentinel to the Defender portal?`

## Microsoft Learn
- Unified SecOps overview: https://learn.microsoft.com/unified-secops-platform/overview-unified-security
- Connect Sentinel to the Defender portal: https://learn.microsoft.com/azure/sentinel/microsoft-sentinel-defender-portal
- Microsoft Defender portal: https://learn.microsoft.com/defender-xdr/microsoft-365-defender-portal
- Unified RBAC in the Defender portal: https://learn.microsoft.com/defender-xdr/manage-rbac
- Microsoft Security Exposure Management: https://learn.microsoft.com/security-exposure-management/microsoft-security-exposure-management
- Advanced hunting in the unified portal: https://learn.microsoft.com/defender-xdr/advanced-hunting-overview
