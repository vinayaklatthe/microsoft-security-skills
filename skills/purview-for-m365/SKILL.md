---
name: purview-for-m365
description: "Guidance for applying Microsoft Purview data security and compliance across Microsoft 365 workloads (Exchange, SharePoint, OneDrive, Teams) - coordinating labels, DLP, retention, and Copilot data protection per workload with each workload's distinct behaviour. WHEN: Purview for Microsoft 365, protect SharePoint and Teams data, M365 compliance, labels and DLP across Office, retention for Exchange, Teams data security, OneDrive governance, Microsoft 365 data protection, per-workload Purview."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview for Microsoft 365

This skill coordinates Purview controls across the core Microsoft 365 workloads - Exchange Online,
SharePoint, OneDrive, and Teams - so labelling, DLP, retention, and Copilot data protection are
applied coherently per workload, recognising that each workload has distinct behaviour.

## When to use
Operationalising Purview specifically across Microsoft 365 collaboration and email, accounting
for each workload's quirks (Teams chat retroactivity, container vs item labels, mail flow).

Do not use this skill for the multicloud Data Map (use `purview-data-map`) or for end-to-end
strategy sequencing (use `purview-information-governance`).

## Per-workload picker
| Workload | Labels | DLP | Retention | Notes |
|---|---|---|---|---|
| Exchange Online | Item + OME | Transport-level | Policy + label | Mail-flow rules; encryption (OME) |
| SharePoint | Item + container | Service-side | Policy + label | Container labels for sites; auto-label at rest |
| OneDrive | Item | Service-side | Policy + label | Auto-label at rest |
| Teams | Container + item (chat scoped) | Chat/channel, post-creation only | Policy + label | Meeting recordings retained in OneDrive/SharePoint |

Rule of thumb: each workload is its own location for DLP and retention; selecting one does not
cover the others. Design per-workload first, harmonise second.

## Per-workload considerations
- **Exchange Online** - Email DLP, encryption (sensitivity labels / OME), retention, mail-flow
  considerations; transport-level enforcement and connector behaviour matter.
- **SharePoint & OneDrive** - Sensitivity labels (incl. container labels for sites), service-side
  auto-labelling, DLP, retention, and oversharing controls via SharePoint Advanced Management.
- **Teams** - Chat/channel DLP (post-creation only), container labels for teams, retention for
  messages, and meeting/recording considerations (recordings live in OneDrive or SharePoint).

## Approach
1. **Baseline classification & labels** across all workloads first; confirm the label set is
   published to all relevant user groups and shows in each app.
   *Verify: a pilot user sees the label menu in Outlook, Word, SharePoint, and Teams.*
2. **Apply DLP per workload location** with simulation before enforcement; one policy per
   workload (or per workload + severity tier) is easier to tune than one mega-policy.
   *Verify: simulation reports per workload reviewed; false-positive rate within target.*
3. **Apply retention/records** via policies and adaptive scopes; map workloads to retention
   schedules.
   *Verify: each workload has retention coverage; disposition review configured for label-based deletion.*
4. **Protect Copilot interactions** - pair with oversharing controls and DSPM for AI so Copilot
   honours both permissions and labels.
   *Verify: a test user cannot retrieve labelled-restricted content via Copilot.*
5. **Monitor** with Activity Explorer, alerts, and audit; build per-workload incident SLAs.
   *Verify: weekly per-workload incident triage cadence in place.*

## Guardrails
- Each workload is a distinct DLP/retention location - selecting one does not cover the others;
  cross-check coverage when adding new sensitive data types.
- Teams DLP and retention are not retroactive for some message types - confirm scope before
  promising legal/compliance audiences coverage.
- Container (site/team) labels and item labels serve different purposes - design both;
  container labels do not encrypt items, item labels do.
- Mail flow can break if Exchange DLP encrypts or blocks unexpectedly - test with partner domains.
- Meeting recordings live in OneDrive/SharePoint - retention for "Teams" alone misses them.

## Common anti-patterns
- One DLP policy ticking every location box and applying the same rule everywhere - noise in
  some workloads, gaps in others.
- Container label without item label - users think the site protects content, it doesn't encrypt.
- Teams DLP enabled and treated as covering historical chat - false sense of coverage.
- Retention configured for SharePoint but not OneDrive - personal sites diverge.
- Ignoring meeting recordings in retention scope.

## Example prompts
- `Protect SharePoint and Teams data with labels and DLP across Office.`
- `Set up retention for Exchange and OneDrive governance.`
- `How do I apply Microsoft 365 data protection end to end?`
- `Secure Teams data with sensitivity labels.`
- `Apply container labels to a sensitive SharePoint site and a private Team.`

## Microsoft Learn
- Information protection: https://learn.microsoft.com/purview/information-protection
- DLP across M365: https://learn.microsoft.com/purview/dlp-learn-about-dlp
- Retention for SharePoint & OneDrive: https://learn.microsoft.com/purview/retention-policies-sharepoint
- Container labels (sites & teams): https://learn.microsoft.com/purview/sensitivity-labels-teams-groups-sites
- Office Message Encryption: https://learn.microsoft.com/purview/ome
- Teams DLP and chat retention: https://learn.microsoft.com/purview/dlp-microsoft-teams
