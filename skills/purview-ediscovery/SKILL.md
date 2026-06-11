---
name: purview-ediscovery
description: "Guidance for Microsoft Purview eDiscovery (unified experience consolidating prior Standard and Premium) - identifying, preserving, collecting, reviewing, analysing, and exporting content across Microsoft 365 for legal cases, regulatory requests, and investigations. Covers cases, custodians, legal holds, searches, review sets, analytics, and export. WHEN: eDiscovery, legal hold, preserve content, collect for litigation, review set, export evidence, eDiscovery case, custodian, search and hold Microsoft 365, legal investigation, EDRM workflow, defensible collection."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview eDiscovery

Microsoft Purview eDiscovery identifies, preserves, collects, reviews, analyses, and exports
content across Microsoft 365 (Exchange, SharePoint, OneDrive, Teams, Copilot interactions) for
legal cases, regulatory requests, and internal investigations - following the EDRM workflow with
defensibility at every step.

## When to use
Responding to litigation, regulatory, or HR/investigation requests requiring defensible content
preservation and production from Microsoft 365.

Do not use this skill for routine audit-log searches without a legal/investigation matter
(use `purview-audit`) or for retention policy design (use `purview-data-lifecycle`).

## Pick the right matter type
| Matter | Approach |
|---|---|
| Litigation with named custodians | Full case: custodians on hold, collection, review set, export |
| Regulatory request, broad scope | Non-custodial data sources + searches + review set |
| HR investigation, single user | Lightweight case with targeted hold + collection (no review set if simple) |
| Quick fact-finding, no preservation duty | `purview-audit` instead |

Rule of thumb: if there is any preservation duty, open a case and apply a hold **before** you
search - searches without holds risk spoliation if a custodian deletes content during triage.

## Approach
1. **Create a case** - Organise the matter in an eDiscovery case; assign role-scoped reviewers
   (eDiscovery Manager vs Reviewer) and record matter metadata.
   *Verify: the case appears in the eDiscovery solution and only assigned users can open it.*
2. **Add custodians and non-custodial sources** - Identify people and locations in scope;
   non-custodial sources cover sites/mailboxes not tied to a person.
   *Verify: custodian status shows hold pending or applied.*
3. **Apply legal holds** - Place custodians/data sources on **hold** before any collection;
   confirm hold receipt where required.
   *Verify: hold status is Active for all custodians and shows source coverage (mailbox, OneDrive, sites, Teams).*
4. **Build searches** - Run draft searches with keywords, conditions, date ranges, and locations;
   review statistics and refine before committing to a collection.
   *Verify: search statistics show estimated item count and size; top locations look sensible.*
5. **Commit to a collection and review set** - Commit refined results to a **review set**; use
   analytics (near-duplicate, email threading, themes) and tagging to cull.
   *Verify: review set indexing completes and analytics tiles populate.*
6. **Review and tag** - Reviewers tag responsive/privileged/etc.; redact where supported; track
   reviewer progress.
   *Verify: tagging history is auditable per reviewer.*
7. **Export and produce** - Export reviewed content in a defensible format with a load file
   suitable for downstream review platforms.
   *Verify: export package includes load file, native files, and a manifest with hashes.*

## Guardrails
- Apply holds **before** searching/collecting to ensure defensibility - a search without a hold
  can be argued away.
- The current unified eDiscovery experience consolidates prior Standard and Premium - confirm
  feature availability against your licensing (advanced features like review sets, analytics,
  and Copilot interaction collection require E5 / E5 Compliance / eDiscovery Premium add-on).
- Scope access tightly; eDiscovery can reach highly sensitive content, including content sensitivity
  labels would otherwise restrict - use role groups and case-level membership, not tenant-wide grants.
- Hold notification, custodian acknowledgements, and chain-of-custody records belong outside Purview
  (matter management system) - eDiscovery is the technical tool, not the legal record.
- Test export against your review platform's load-file expectations before the deadline.

## Common anti-patterns
- Running a tenant-wide content search and skipping the hold step "to save time".
- Granting eDiscovery Manager broadly instead of per-case Reviewer assignment.
- Forgetting to add Teams chat / Copilot interaction locations when scoping.
- Exporting from a search instead of from a reviewed review set (no defensible review trail).
- Closing the case (and releasing holds) before legal confirms the matter is concluded.

## Example prompts
- `Create an eDiscovery case with legal hold to preserve content.`
- `Collect and review content for litigation in a review set.`
- `How do I export evidence and manage custodians?`
- `Run search and hold across Microsoft 365 for an investigation.`
- `Apply analytics and near-duplicate detection to cull a large review set.`

## Microsoft Learn
- eDiscovery overview: https://learn.microsoft.com/purview/edisc
- Get started with eDiscovery: https://learn.microsoft.com/purview/ediscovery-standard-get-started
- Create and manage holds: https://learn.microsoft.com/purview/ediscovery-create-holds
- Manage review sets: https://learn.microsoft.com/purview/ediscovery-managing-review-sets
- Export from a review set: https://learn.microsoft.com/purview/ediscovery-export-documents-from-review-set
- Role and permissions: https://learn.microsoft.com/purview/ediscovery-assign-permissions
