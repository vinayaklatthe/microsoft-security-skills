---
name: purview-for-m365
description: "Guidance for applying Microsoft Purview data security and compliance across Microsoft 365 workloads (Exchange, SharePoint, OneDrive, Teams) — coordinating labels, DLP, retention, and Copilot data protection per workload. WHEN: Purview for Microsoft 365, protect SharePoint and Teams data, M365 compliance, labels and DLP across Office, retention for Exchange, Teams data security, OneDrive governance, Microsoft 365 data protection."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview for Microsoft 365

This skill coordinates Purview controls across the core Microsoft 365 workloads — Exchange Online,
SharePoint, OneDrive, and Teams — so labelling, DLP, retention, and Copilot data protection are
applied coherently per workload.

## When to use
Operationalising Purview specifically across Microsoft 365 collaboration and email, accounting for
each workload's behaviours.

## Per-workload considerations
- **Exchange Online** — Email DLP, encryption (sensitivity labels / OME), retention, mail-flow
  considerations; transport-level enforcement.
- **SharePoint & OneDrive** — Sensitivity labels (incl. container labels for sites), service-side
  auto-labeling, DLP, retention, and oversharing controls via SharePoint Advanced Management.
- **Teams** — Chat/channel DLP (post-creation only), container labels for teams, retention for
  messages, and meeting/recording considerations.

## Approach
1. **Baseline classification & labels** across all workloads first.
2. **Apply DLP** per workload location with simulation before enforcement.
3. **Apply retention/records** via policies and adaptive scopes.
4. **Protect Copilot interactions** — pair with oversharing controls and DSPM for AI.
5. **Monitor** with Activity Explorer, alerts, and audit.

## Guardrails
- Each workload is a distinct DLP/retention location — selecting one does not cover the others.
- Teams DLP and retention are not retroactive for some message types — confirm scope.
- Container (site/team) labels and item labels serve different purposes — design both.

## Example prompts
- `Protect SharePoint and Teams data with labels and DLP across Office.`
- `Set up retention for Exchange and OneDrive governance.`
- `How do I apply Microsoft 365 data protection end to end?`
- `Secure Teams data with sensitivity labels.`

## Microsoft Learn
- Information protection: https://learn.microsoft.com/purview/information-protection
- DLP across M365: https://learn.microsoft.com/purview/dlp-learn-about-dlp
- Retention for M365 workloads: https://learn.microsoft.com/purview/retention-policies-sharepoint
- Container labels: https://learn.microsoft.com/purview/sensitivity-labels-teams-groups-sites
