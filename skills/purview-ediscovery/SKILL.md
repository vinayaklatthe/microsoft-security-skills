---
name: purview-ediscovery
description: "Guidance for Microsoft Purview eDiscovery — identifying, preserving, collecting, reviewing, and exporting content for legal and investigation matters across Microsoft 365. Covers cases, legal holds, collections, review sets, and analytics. WHEN: eDiscovery, legal hold, preserve content, collect for litigation, review set, export evidence, eDiscovery case, custodian, search and hold Microsoft 365, legal investigation."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview eDiscovery

Microsoft Purview eDiscovery identifies, preserves, collects, reviews, analyses, and exports
content across Microsoft 365 (Exchange, SharePoint, OneDrive, Teams) for legal cases, regulatory
requests, and internal investigations — following the EDRM workflow.

## When to use
Responding to litigation, regulatory, or HR/investigation requests requiring defensible content
preservation and production.

## Approach
1. **Create a case** — Organise the matter in an eDiscovery case with role-scoped access.
2. **Preserve (legal hold)** — Place custodians/data sources on **hold** to prevent spoliation
   before collection.
3. **Collect & search** — Build searches (keywords, conditions, locations); estimate and refine
   before committing to a collection.
4. **Review set** — Add results to a **review set**; use review, tagging, near-duplicate/email
   threading and analytics to cull.
5. **Export/produce** — Export reviewed content in a defensible format with a load file.

## Guardrails
- Apply holds **before** searching/collecting to ensure defensibility.
- The current unified eDiscovery experience consolidates prior Standard/Premium — confirm feature
  availability against your licensing (Premium features require E5/add-on).
- Scope access tightly; eDiscovery can reach highly sensitive content.

## Microsoft Learn
- eDiscovery overview: https://learn.microsoft.com/purview/edisc
- Get started: https://learn.microsoft.com/purview/ediscovery-standard-get-started
- Holds: https://learn.microsoft.com/purview/ediscovery-create-holds
- Review sets: https://learn.microsoft.com/purview/ediscovery-managing-review-sets
