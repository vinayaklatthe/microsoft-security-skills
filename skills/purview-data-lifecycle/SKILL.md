---
name: purview-data-lifecycle
description: "Guidance for Microsoft Purview Data Lifecycle Management and Records Management - retention labels and policies to retain and delete content across Microsoft 365, plus declaring records. Covers retention strategy, adaptive vs static scopes, principle of precedence, disposition review, and regulatory records. WHEN: data lifecycle management, retention policy, retention label, records management, declare record, disposition review, adaptive scopes, retain and delete content, file plan, regulatory retention, immutable records."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Data Lifecycle & Records Management

Data Lifecycle Management (retention policies and labels) and Records Management govern how long
content is **retained** and when it is **deleted** across Microsoft 365 - meeting regulatory,
legal, and business requirements while reducing risk and cost from over-retention.

## When to use
Implementing retention and disposition for Exchange, SharePoint, OneDrive, and Teams, and
managing formal records (including regulatory records) with a defensible file plan.

Do not use this skill for legal-hold preservation tied to a specific matter (use
`purview-ediscovery`) or for audit log retention (use `purview-audit`).

## Pick the right control
| Need | Use |
|---|---|
| Retain or delete content at a location level (whole mailbox/site) | **Retention policy** |
| Item-level retain/delete, label-driven workflow | **Retention label** |
| Immutable, regulator-grade record | **Regulatory record** (label-based) |
| Triggered retention (start clock on event, e.g., contract end) | **Event-based retention** |
| Policies that adapt as users move/leave | **Adaptive scopes** (query-based) |
| One-time targeted scope | Static scope |

Rule of thumb: policies for breadth, labels for precision, adaptive scopes by default so the
policy follows the org, not the org chart of two years ago.

## Approach
1. **Define requirements** - Map regulatory/legal/business retention rules to content types and
   locations; build a retention schedule / file plan with the records manager.
   *Verify: each retention rule cites a regulation or business owner approval.*
2. **Retention policies vs labels** - Use **retention policies** for broad location-level
   retain/delete; use **retention labels** for item-level control and records declaration.
   *Verify: each rule in the file plan is mapped to either a policy or a label, not both.*
3. **Adaptive scopes** - Prefer **adaptive scopes** (query-based on user/site/group attributes)
   over static scopes so policies stay current as the org changes.
   *Verify: scope queries return expected user/site sets in preview.*
4. **Records management** - Declare **records** / regulatory records where immutability is
   required; build the file plan with retention triggers (event-based where needed).
   *Verify: records cannot be edited or deleted outside the disposition workflow.*
5. **Auto-apply labels** - Configure auto-apply rules based on SITs, classifiers, or keywords in
   simulation first; review impact before broad rollout.
   *Verify: simulation shows expected match coverage and few false positives.*
6. **Disposition** - Configure **disposition review** so reviewers approve deletion of labelled
   content; capture proof of disposition for audit.
   *Verify: disposition queue populates and reviewer notifications fire.*
7. **Operate** - Quarterly review of policy coverage, disposition backlog, and file plan drift
   against new regulations.

## Guardrails
- Understand retention **principle of precedence** (retention wins over deletion; longest
  retention wins; explicit beats implicit; record beats non-record) before layering policies -
  unexpected interactions are the top support issue.
- Regulatory records are immutable - apply only where truly required; you cannot undo
  declaration even by a Global Admin.
- Pilot auto-applied retention labels; review impact before broad rollout - mis-targeted auto-apply
  is hard to roll back at scale.
- Coordinate with eDiscovery - retention labels do not replace legal holds, and a hold extends
  retention until released.
- Keep the file plan short and human-readable; a 200-row plan no one understands fails audit.

## Common anti-patterns
- Stacking three overlapping retention policies on the same location and being surprised by
  precedence outcomes.
- Declaring everything a regulatory record "to be safe" - blocks legitimate deletion forever.
- Auto-applying labels in production without simulation - mass mislabel events.
- Building a file plan in IT with no records manager / legal sign-off.
- Treating retention as a one-off project; regulations change and the plan must too.

## Example prompts
- `Create retention policies and labels with adaptive scopes.`
- `Set up records management with disposition review.`
- `How do I declare records and meet regulatory retention?`
- `Build a file plan to retain and delete content correctly.`
- `Explain retention precedence when policies and labels overlap.`

## Microsoft Learn
- Data lifecycle management: https://learn.microsoft.com/purview/data-lifecycle-management
- Retention policies & labels: https://learn.microsoft.com/purview/retention
- Records management: https://learn.microsoft.com/purview/records-management
- Disposition review: https://learn.microsoft.com/purview/disposition
- Retention for SharePoint & OneDrive: https://learn.microsoft.com/purview/retention-policies-sharepoint
- Principles of retention: https://learn.microsoft.com/purview/retention-policies-exchange
