---
name: purview-audit
description: "Guidance for Microsoft Purview Audit (Standard and Premium) — logging and searching user/admin activity across Microsoft 365 for investigations and compliance. Covers audit log search, retention, high-value events, and access via the portal and API. WHEN: Purview Audit, audit log search, Microsoft 365 audit, Audit Premium, investigate user activity, audit log retention, Microsoft Graph audit API, forensic logging, crucial audit events."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Audit

Microsoft Purview Audit records user and admin activity across Microsoft 365 services and makes
it searchable for security investigations, forensics, and compliance.

## When to use
Investigating incidents, supporting eDiscovery/compliance, and meeting logging requirements.

## Approach
1. **Confirm tier** — **Audit (Standard)** provides core logging and search with default retention;
   **Audit (Premium)** adds longer default retention (up to 1 year, extendable to 10 with add-on),
   higher bandwidth, and access to **crucial/high-value events** (e.g., MailItemsAccessed,
   Send, SearchQueryInitiated) valuable for forensics.
2. **Verify auditing is on** — Confirm audit logging is enabled for the tenant.
3. **Search** — Use **Audit search** (or the Office 365 Management Activity API / Microsoft Graph)
   to query by user, activity, workload, and time.
4. **Retention policies** — Configure audit log retention policies to keep specific record types
   longer based on workload/activity.
5. **Operationalise** — Stream audit data to Sentinel/SIEM for correlation and long-term analytics.

## Guardrails
- Validate retention meets regulatory requirements **before** an incident — default retention may
  be insufficient.
- Premium-only events (e.g., MailItemsAccessed) are critical for breach investigations — confirm
  licensing.
- Audit search has latency; design investigations accordingly.

## Example prompts
- `Search the Microsoft 365 audit log to investigate user activity.`
- `Configure audit log retention and confirm Audit Premium events.`
- `How do I export audit data via the Microsoft Graph audit API?`
- `Set up forensic logging for crucial audit events.`

## Microsoft Learn
- Audit overview: https://learn.microsoft.com/purview/audit-solutions-overview
- Audit Standard vs Premium: https://learn.microsoft.com/purview/audit-premium
- Search the audit log: https://learn.microsoft.com/purview/audit-search
- Audit log retention policies: https://learn.microsoft.com/purview/audit-log-retention-policies
