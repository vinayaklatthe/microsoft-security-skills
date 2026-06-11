---
name: purview-general
description: "Orientation skill for the Microsoft Purview data security, governance, and compliance suite. Helps choose the right Purview solution for a goal and understand the unified portal, roles, and licensing model. WHEN: Microsoft Purview overview, which Purview solution, Purview portal, data governance vs data security vs compliance, Purview roles and permissions, where to start with Purview, Purview licensing, I do not know which Purview feature to use, what does Purview cover, getting started with Purview, Purview product overview, which compliance tool do I need. Use this skill first for Purview orientation, then follow up with the specific skill for your use case."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview (Overview)

Microsoft Purview is a unified suite for **data security, data governance, and risk &
compliance**, managed from the Microsoft Purview portal. This skill is the **router**: it
helps decide which Purview solution (and which deeper skill in this repo) addresses a goal,
in what order, and what to verify before building anything.

## When to use
Use this skill **first** when the user is unsure which Purview capability fits, is starting
a Purview programme from scratch, is evaluating licensing, or asks "where do I begin". Once
the route is clear, hand off to the specific skill (DLP, classification, eDiscovery, etc.).

**Do not use this skill** when the user already knows the solution they need - go straight
to that skill (e.g. `purview-dlp-policy`, `purview-ediscovery`).

## Map the goal to a solution

Pick the row that matches the question, then load the named skill.

| If the goal is... | Primary solution | Deeper skill |
|---|---|---|
| Find and tag sensitive data | Information Protection + Data Classification (SITs, trainable classifiers, EDM) | `purview-data-classification` |
| Stop sensitive data leaving M365, endpoints, or browsers | Data Loss Prevention | `purview-dlp-policy`, `purview-advanced-dlp` |
| Retain or delete content for legal / regulatory reasons | Data Lifecycle Management, Records Management | `purview-data-lifecycle` |
| Catalogue and curate enterprise data estate (lakehouses, DBs, SaaS) | Unified Catalog + Data Map | `purview-data-catalog`, `purview-data-map` |
| Detect insider data theft, sabotage, or policy violations | Insider Risk Management | `insider-risk-baseline` |
| Detect harassment, regulated comms, or info leakage in messaging | Communication Compliance | `purview-communication-compliance` |
| Run legal hold, collection, review for litigation/HR | eDiscovery (Premium for advanced) | `purview-ediscovery` |
| Tenant-wide audit trail of user/admin activity | Purview Audit (Standard or Premium) | `purview-audit` |
| Understand AI prompt data flow (Copilot, custom agents) | DSPM for AI | `purview-dspm-ai` |
| Fix oversharing before Copilot rollout | SAM + restricted content discovery + sensitivity labels | `purview-copilot-oversharing` |
| Govern data used by AI agents (Copilot Studio, custom) | Agent security + classification + DLP for AI | `purview-agent-365-security` |
| Privacy programme (subject rights, GDPR) | Microsoft Priva (separate product) | `microsoft-priva` |
| Tour Purview for a specific workload (Exchange/SharePoint/Teams) | Workload-scoped Purview controls | `purview-for-m365` |
| Information governance programme (Know→Protect→Govern→Manage) | Cross-solution programme | `purview-information-governance` |

> **Rule of thumb:** if more than one row fits, start with **classification** - every other
> Purview capability is weaker without it.

## Approach

A Purview programme dies fast when teams skip discovery and jump to enforcement. Follow
this order; each step gates the next.

1. **Discovery first** — Run the **Content Explorer** and **Activity Explorer** in the Purview
   portal to see what sensitive data already exists and how it moves. Without this, every
   downstream decision (labels, DLP rules, retention) is guesswork.
   *Verify: Content Explorer shows non-zero items for at least 3 built-in SITs you expect to
   exist (e.g. credit card, national ID, IBAN).*

2. **Confirm licensing before designing** — Many capabilities are gated. Check before promising
   timelines.
   - **Included in M365 E3:** sensitivity labels (manual), basic DLP for SharePoint/OneDrive/
     Exchange, Audit Standard, basic retention.
   - **Requires M365 E5 / E5 Compliance:** Advanced DLP, Endpoint DLP, Insider Risk, Comms
     Compliance, Records Management, eDiscovery Premium, Audit Premium, DSPM for AI.
   - **Separate add-on/SKU:** Microsoft Priva, Purview Data Governance for non-M365 sources.

   *Verify: portal banner shows "Advanced features available" for E5; if missing, the feature
   will appear in UI but block at policy creation.*

3. **Confirm roles, least privilege** — Purview has its own role groups under
   *Settings → Roles & scopes → Permissions*. Do not assign **Compliance Administrator** or
   **Organization Management** wholesale; use scoped groups.
   - DLP work → *Compliance Data Administrator* + *DLP Compliance Management*
   - eDiscovery → *eDiscovery Manager* (not Admin) for case workers
   - Insider Risk → *Insider Risk Management Investigators* (separate from Analysts for SoD)
   - Read-only review → *Compliance Reader*

   *Verify: a test account in a scoped role can perform the intended action and is blocked
   from other workloads.*

4. **Sequence the rollout** — Build maturity in this order; each layer assumes the previous.
   `Classification → Sensitivity labels (manual) → Auto-labelling (simulation mode) → DLP
   audit-only → DLP block → Lifecycle / retention → Insider Risk → DSPM for AI`.
   Skipping forward (e.g. auto-label without manual adoption first) creates user backlash
   and false positives that erode trust in the programme.

5. **Pilot before tenant-wide** — Every Purview enforcement (DLP block, auto-label, retention
   delete) should run **audit / simulation mode for 7-14 days** on a pilot group before going
   live. Watch override counts and false-positive rates.

## Guardrails
- **Never enable enforcement before classification maturity.** Auto-labelling or DLP-block
  without confidence in your SITs produces false positives at scale and destroys user trust.
  Run simulation mode for at least 7 days first.
- **Do not over-assign Compliance Administrator or Organization Management.** These bypass
  scoped role groups and break separation of duties for eDiscovery and Insider Risk
  investigations.
- **Validate licensing before designing.** Several solutions appear in the portal regardless of
  SKU and only fail at policy-creation time. Use the
  [M365 service description](https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance)
  as the source of truth, not the portal UI.
- **Do not scope by feature availability.** Scope by data sensitivity and regulatory driver
  (GDPR, HIPAA, FINRA, PCI). Building "we have it, let's turn it on" creates noise without
  reducing risk.
- **Teams retention has limits.** Teams chat retention applies forward only; historical chats
  are not back-filled. Communicate this before rollout.
- **eDiscovery holds are silent to users by design.** Confirm legal/HR sign-off before placing
  a hold - inadvertent notification has happened via admin audit log access.

## Common anti-patterns
- **"DLP first, classification later"** — Rules fire on regex matches without label context,
  flooding the SOC with false positives. Always classify first.
- **"Turn on every Purview feature at once"** — Overwhelms admins and users. Stick to the
  Sequence in Approach step 4.
- **"Use Org Management for the Purview admin team"** — Grants tenant-wide rights including
  Exchange and SharePoint admin. Use scoped Purview role groups instead.
- **"Auto-label everything sensitive"** — Without simulation, you will mislabel hundreds of
  documents and trigger access denials. Always run *simulation mode* and review the report
  before publishing.

## Example prompts
- `Which Microsoft Purview solution should I use for my scenario?`
- `Where do I start with Microsoft Purview for a new tenant?`
- `What licence do I need for Insider Risk Management?`
- `Explain data governance vs data security vs compliance in Purview.`
- `What is the right order to roll out Purview features?`
- `Which Purview role should I give my compliance team?`

## Microsoft Learn
- Purview overview: https://learn.microsoft.com/purview/purview
- Purview portal walkthrough: https://learn.microsoft.com/purview/purview-portal
- Roles and permissions (scoped role groups): https://learn.microsoft.com/purview/purview-permissions
- Content Explorer (discovery): https://learn.microsoft.com/purview/data-classification-content-explorer
- Activity Explorer (how data moves): https://learn.microsoft.com/purview/data-classification-activity-explorer
- Licensing guidance (source of truth): https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance
- Adaptive Protection (sequencing context): https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection
