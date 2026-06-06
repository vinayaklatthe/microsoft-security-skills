---
name: purview-data-catalog
description: "Guidance for the Microsoft Purview Unified Catalog (data catalog) — business-friendly discovery, governance domains, data products, glossary terms, and data quality on top of the Data Map. Covers governance domains, data products, and curation. WHEN: Purview data catalog, unified catalog, data products, governance domain, business glossary, data quality, data discovery for analysts, curate data assets, data stewardship."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Unified Catalog

The Unified Catalog provides business-friendly data discovery and governance on top of the Data
Map: organising assets into **governance domains** and **data products**, with glossary terms,
ownership, and data quality.

## When to use
Making governed data discoverable and trustworthy for analysts and data consumers, and assigning
accountable ownership.

## Approach
1. **Establish governance domains** — Model business areas (e.g., Finance, HR) as governance
   domains with accountable owners.
2. **Publish data products** — Group related data assets into curated **data products** with
   descriptions, terms, and access guidance so consumers can find and request them.
3. **Build the glossary** — Define business terms and link them to assets to add shared meaning.
4. **Assign stewardship** — Set data owners/stewards; drive curation completeness.
5. **Data quality** — Configure data quality rules/scoring for critical data elements.
6. **Enable discovery** — Let users search, understand lineage, and request access.

## Guardrails
- Start with a few high-value domains and data products; broad rollout without ownership fails.
- Curation is a continuous program, not a one-time load.
- Align catalog access with the Data Map collection permissions.

## Microsoft Learn
- Unified Catalog: https://learn.microsoft.com/purview/unified-catalog
- Governance domains: https://learn.microsoft.com/purview/concept-governance-domain
- Data products: https://learn.microsoft.com/purview/concept-data-products
- Data quality: https://learn.microsoft.com/purview/data-quality-overview
