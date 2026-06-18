---
name: copilot-for-m365-readiness
description: "Guidance for safely deploying Microsoft 365 Copilot — end-to-end readiness covering oversharing remediation, SharePoint Advanced Management (SAM) restricted sites and content discovery, sensitivity label coverage, Purview DLP for Copilot, Restricted SharePoint Search (RSS) interim safeguard, site lifecycle and ownership, Copilot interaction auditing, Copilot in Defender XDR alerts, prompt-shield risks, licensing prerequisites, and a phased rollout that doesn't surface confidential data on day one. WHEN: M365 Copilot rollout, Copilot oversharing remediation, SAM, SharePoint Advanced Management, Restricted SharePoint Search, RSS Copilot, sensitivity labels Copilot, DLP for Copilot, Copilot audit, safe Copilot deployment, Copilot pilot, prevent Copilot data leakage. DO NOT USE for tenant-wide oversharing program design (use m365-oversharing), Purview DSPM for AI alone (use purview-dspm-ai), or Microsoft Foundry agent security (use microsoft-agent-365)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft 365 Copilot — Safe Readiness

Microsoft 365 Copilot is only as safe as your SharePoint, OneDrive, and Teams permission
hygiene. The #1 incident pattern is "Copilot surfaced HR/board/legal content because the
underlying site was over-permissioned." This skill is the end-to-end readiness playbook —
identify oversharing, contain via SAM and labels, then enable Copilot in waves.

## When to use
Preparing to deploy Microsoft 365 Copilot. Use for the pre-launch security workstream:
oversharing detection, containment controls, label/DLP coverage, audit, and phased
rollout.

**Do not use this skill** for the broader oversharing program (`m365-oversharing`),
Purview DSPM for AI in isolation (`purview-dspm-ai`), or agent-specific security
(`microsoft-agent-365`).

## Readiness gates — don't skip

| Gate | Why |
|---|---|
| Sensitivity labels published and adopted | Copilot honors label encryption + usage rights |
| Auto-labeling for known sensitive content classes | Catches the long tail users won't label |
| DLP for Copilot policies | Prevents sensitive content surfacing in chat answers |
| SAM (SharePoint Advanced Management) provisioned | Required for restricted access + data access governance |
| Site ownership confirmed | Orphaned sites with permissive ACLs are the #1 incident path |
| Audit on | Copilot interactions are auditable; off = no investigation possible |

## Approach

1. **Inventory and triage oversharing.** Run SAM **Data Access Governance** reports:
   - Sites shared with **Everyone except external users** (EEEU).
   - Sites with anonymous links.
   - Sites with high external sharing volume.
   - Sites with sensitive content but permissive ACLs.
   Prioritize the top 5% by volume and sensitivity.

2. **Apply Restricted SharePoint Search (RSS) as an interim safeguard.** RSS limits
   Copilot grounding (and SharePoint search) to a curated allowlist of sites + the user's
   own OneDrive. Buys 90 days while you fix the long tail.
   *Verify: in test tenant, Copilot prompt "summarize HR salary data" returns no
   grounded content from non-allowlisted sites.*

3. **Roll out sensitivity labels with mandatory labeling** for the pilot population, plus
   auto-labeling for known sensitive info types. Labels with encryption restrict Copilot
   from showing content to users without usage rights.

4. **Author DLP for Copilot** policies. Specifically the *Microsoft 365 Copilot*
   location:
   - Block Copilot from using sensitive-labeled content in chat responses.
   - Block credit-card / SSN / financial data from appearing in Copilot output.
   - Audit-mode first, block after 2 weeks of tuning.

5. **Site lifecycle controls** via SAM:
   - **Restricted Access Control** — explicitly cap who can access a site even if
     other policies would grant access; useful for HR, finance, board.
   - **Site lifecycle policies** — archive/inactive sites are excluded from Copilot
     grounding.
   - **Block download** for specific sensitivity labels.

6. **Audit and monitoring.**
   - Enable Purview Audit Premium for long retention.
   - Stream Copilot interaction logs to Sentinel; alert on prompts with sensitive
     terms or attempts to access restricted content.
   - Copilot incidents now show in Defender XDR — wire to SOC queue.

7. **Phased rollout.**
   - **Wave 0 (50 users)**: IT + Security; validate auditing and DLP.
   - **Wave 1 (500)**: low-sensitivity department (Marketing).
   - **Wave 2**: broader workforce after oversharing top-5% remediated.
   - **Wave 3**: regulated departments (Finance, Legal, HR) only after deep label
     coverage.
   Measure prompts blocked, sensitive content surfaced, and user satisfaction at each
   wave.

8. **Licensing prerequisites checklist:** Microsoft 365 Copilot license + Microsoft
   365 E3/E5, SharePoint Advanced Management add-on for SAM features, Purview E5 for
   advanced DLP and Audit Premium.

## Guardrails
- **Don't enable Copilot tenant-wide before oversharing remediation.** "Day 1 Copilot
  surfaced last year's redundancy list" is a real headline.
- **Restricted SharePoint Search is interim.** It hides the problem; it doesn't fix
  permissions. Set a sunset date.
- **Sensitivity labels without encryption don't restrict Copilot grounding.** Only
  encrypted labels with denied EXTRACT/VIEW for the user actually prevent surfacing.
- **Auto-labeling needs validation.** A poorly-tuned auto-label policy can mass-encrypt
  the wrong content, breaking workflows.
- **DLP for Copilot covers Copilot, not all AI surfaces.** External AI (ChatGPT, Gemini)
  needs Purview AI Hub + browser controls (see `purview-ai-hub`).
- **Audit retention matters.** Default Purview Audit retention is 180 days. Copilot
  incident investigations months later need Audit Premium.
- **Orphaned site ownership is the silent killer.** A site with no owner has no one to
  approve access reviews; permissions calcify.
- **Copilot can't decrypt what users can't decrypt.** Label-encryption + Copilot is
  consistent — if a user can't open a doc, Copilot can't ground on it for them.

## Common anti-patterns
- **"Bought Copilot licenses, enabled tenant-wide, fixed permissions later"** —
  oversharing incidents in week one.
- **"RSS forever"** — Copilot is unusable because the allowlist is tiny.
- **"Sensitivity labels visual-only, no encryption"** — labels look right, restrict
  nothing.
- **"DLP for Copilot in audit forever"** — sensitive data flows in chat outputs; audit
  proves it, no prevention.
- **"Site owners = 'IT helpdesk'"** — no business accountability for ACLs.
- **"No Sentinel/SOC integration for Copilot incidents"** — invisible.
- **"Pilot in Finance day 1"** — highest-sensitivity audience, lowest-prepared
  permission model. Pilot Marketing first.

## Example prompts
- `Build a 90-day M365 Copilot readiness plan for a 25,000-user tenant — oversharing
  remediation, SAM, labels, DLP, audit, phased rollout.`
- `Run SAM data access governance reports and propose a top-50 site remediation
  backlog.`
- `Configure Restricted SharePoint Search with an allowlist of 200 sites as an
  interim Copilot safeguard.`
- `Author DLP for Copilot policies that block confidential-labeled content from
  Copilot output.`
- `Wire Copilot interaction audit logs to Sentinel with detections for sensitive-term
  prompts.`
- `Pilot wave plan: who, when, success criteria, rollback triggers.`
- `Audit and Defender XDR integration for Copilot incidents — runbook for analysts.`

## Microsoft Learn
- Copilot readiness overview: https://learn.microsoft.com/microsoft-365-copilot/microsoft-365-copilot-overview
- Data, privacy, security: https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-privacy
- Restricted SharePoint Search: https://learn.microsoft.com/sharepoint/restricted-sharepoint-search
- SharePoint Advanced Management: https://learn.microsoft.com/sharepoint/advanced-management
- Data Access Governance reports: https://learn.microsoft.com/sharepoint/data-access-governance-reports
- Sensitivity labels with Copilot: https://learn.microsoft.com/purview/sensitivity-labels-teams-groups-sites
- DLP for Copilot: https://learn.microsoft.com/purview/ai-microsoft-purview
- Restricted Access Control: https://learn.microsoft.com/sharepoint/restricted-access-control
- Copilot audit: https://learn.microsoft.com/purview/audit-copilot
- Copilot in Defender XDR: https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-overview
