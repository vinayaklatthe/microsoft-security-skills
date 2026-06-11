---
name: purview-data-lifecycle
description: "Guidance for Microsoft Purview Data Lifecycle Management and Records Management — retention labels and policies to retain and delete content across Microsoft 365, plus declaring records. Covers retention strategy, adaptive scopes, and disposition review. WHEN: data lifecycle management, retention policy, retention label, records management, declare record, disposition review, adaptive scopes, retain and delete content, file plan, regulatory retention."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Data Lifecycle & Records Management

Data Lifecycle Management (retention policies and labels) and Records Management govern how long
content is **retained** and when it is **deleted** across Microsoft 365 — meeting regulatory,
legal, and business requirements while reducing risk from over-retention.

## When to use
Implementing retention and disposition for Exchange, SharePoint, OneDrive, and Teams, and
managing formal records.

## Approach
1. **Define requirements** — Map regulatory/legal/business retention rules to content types and
   locations; build a retention schedule / file plan.
2. **Retention policies vs labels** — Use **retention policies** for broad location-level
   retain/delete; use **retention labels** for item-level control and records declaration.
3. **Adaptive scopes** — Prefer **adaptive scopes** (query-based on user/site/group attributes)
   over static scopes so policies stay current as the org changes.
4. **Records management** — Declare **records** / regulatory records where immutability is
   required; build the file plan with retention triggers (event-based where needed).
5. **Disposition** — Configure **disposition review** so reviewers approve deletion of labelled
   content; capture proof of disposition.

## Guardrails
- Understand retention **principle of precedence** (retention wins over deletion; longest
  retention wins) before layering policies.
- Regulatory records are immutable — apply only where truly required.
- Pilot auto-applied retention labels; review impact before broad rollout.

## Example prompts
- `Create retention policies and labels with adaptive scopes.`
- `Set up records management with disposition review.`
- `How do I declare records and meet regulatory retention?`
- `Build a file plan to retain and delete content correctly.`

## Microsoft Learn
- Data lifecycle management: https://learn.microsoft.com/purview/data-lifecycle-management
- Retention policies & labels: https://learn.microsoft.com/purview/retention
- Records management: https://learn.microsoft.com/purview/records-management
- Adaptive scopes: https://learn.microsoft.com/purview/retention#adaptive-or-static-policy-scopes-for-retention
