---
name: purview-audit
description: "Guidance for Microsoft Purview Audit (Standard and Premium) - logging and searching user/admin activity across Microsoft 365 for investigations and compliance. Covers tier differences, default and extended retention, high-value events, audit search UX, Office 365 Management Activity API / Microsoft Graph audit API, and Sentinel/SIEM integration. WHEN: Purview Audit, audit log search, Microsoft 365 audit, Audit Premium, investigate user activity, audit log retention, Microsoft Graph audit API, forensic logging, crucial audit events, MailItemsAccessed."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Audit

Microsoft Purview Audit records user and admin activity across Microsoft 365 services and makes
it searchable for security investigations, forensics, and compliance. It's the first thing the
IR team reaches for and the first thing leadership wishes they had configured better.

## When to use
Investigating incidents, supporting eDiscovery/compliance, and meeting regulatory logging
requirements for Microsoft 365 services.

Do not use this skill for sign-in/identity logs (use Entra ID sign-in logs / Defender XDR) or
for Azure resource activity (use Azure Activity Log via Sentinel).

## Pick the right tier and retention
| Need | Tier | Retention |
|---|---|---|
| Core admin/user actions for routine ops | Audit (Standard) | ~180 days default |
| Breach investigation (MailItemsAccessed, Send, SearchQueryInitiated) | Audit (Premium) | 1 year default |
| Regulated industries / legal hold scenarios | Audit (Premium) + 10-year add-on | Up to 10 years |
| Long-term SIEM/UEBA correlation | Stream to Sentinel via Office 365 connector | Sentinel retention |

Rule of thumb: confirm tier and retention **before** an incident - default retention is the
single most common gap that turns a "we have audit logs" into "we don't have the right ones".

## Approach
1. **Confirm tier** - **Audit (Standard)** provides core logging with default retention;
   **Audit (Premium)** adds longer default retention (1 year, extendable to 10 with add-on),
   higher bandwidth, and access to **crucial/high-value events** (e.g., MailItemsAccessed,
   Send, SearchQueryInitiated) valuable for forensics.
   *Verify: a sample query for MailItemsAccessed returns results for a known user.*
2. **Verify auditing is on** - Confirm audit logging is enabled for the tenant (it should be on
   by default in modern tenants but old tenants can have it disabled).
   *Verify: Get-AdminAuditLogConfig / portal shows audit ingestion active.*
3. **Configure retention policies** - Audit log retention policies extend or shorten retention
   for specific record types/workloads/activities; build them around your top investigation
   playbooks.
   *Verify: retention policies cover MailItemsAccessed, FileAccessed, SearchQueryInitiated for executives at minimum.*
4. **Search** - Use **Audit search** in the Purview portal (or the Office 365 Management Activity
   API / Microsoft Graph audit API) to query by user, activity, workload, and time.
   *Verify: a test investigation query returns within the SLA expected for audit search.*
5. **Operationalise** - Stream audit data to Sentinel/SIEM for correlation and long-term
   analytics; document the playbooks investigators use.
   *Verify: the Office 365 connector in Sentinel shows ingestion and a workbook is in place.*
6. **Practice** - Run a tabletop using the audit log to answer "who exfiltrated what when";
   note any gap in retention or premium events.

## Guardrails
- Validate retention meets regulatory requirements **before** an incident - default retention may
  be insufficient for your sector or for the time it takes to discover a breach.
- Premium-only events (e.g., MailItemsAccessed) are critical for breach investigations - confirm
  licensing and that the events are flowing for every user you would ever investigate.
- Audit search has latency; design investigations accordingly and prefer Sentinel/KQL for
  iterative pivoting on hot data.
- Scope reviewer access tightly - audit data can reveal sensitive activity; use the eDiscovery /
  Audit role groups, not Global Admin.
- Treat audit configuration as a security control with change management - turning it off must
  be auditable and alerted.

## Common anti-patterns
- Assuming Premium events flow automatically without confirming licensing per user.
- Default retention only, then surprised when the breach window is 9 months back.
- Investigating in the Purview portal under time pressure instead of pre-built KQL in Sentinel.
- No retention policy for crucial events - retention drops back to default for the records that
  matter most.
- Granting tenant-wide audit reader to large groups.

## Example prompts
- `Search the Microsoft 365 audit log to investigate user activity.`
- `Configure audit log retention and confirm Audit Premium events.`
- `How do I export audit data via the Microsoft Graph audit API?`
- `Set up forensic logging for crucial audit events.`
- `Stream Microsoft 365 audit to Sentinel and build an investigation workbook.`

## Microsoft Learn
- Audit solutions overview: https://learn.microsoft.com/purview/audit-solutions-overview
- Audit Standard vs Premium: https://learn.microsoft.com/purview/audit-premium
- Search the audit log: https://learn.microsoft.com/purview/audit-search
- Audit log retention policies: https://learn.microsoft.com/purview/audit-log-retention-policies
- Office 365 Management Activity API: https://learn.microsoft.com/office/office-365-management-api/office-365-management-activity-api-reference
