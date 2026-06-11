---
name: purview-data-map
description: "Guidance for the Microsoft Purview Data Map — the foundation that scans and maps data sources across multicloud and on-premises estates to power cataloging and governance. Covers data sources, scanning, classifications, and the managed/self-hosted integration runtime. WHEN: Purview Data Map, scan data sources, register data source, data discovery, integration runtime, map enterprise data, multicloud data scanning, classification scan."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Data Map

The Data Map is the foundational layer of Microsoft Purview data governance: it discovers,
scans, and maps metadata and classifications from data sources across Azure, multicloud, SaaS,
and on-premises, powering the Unified Catalog.

## When to use
Building an enterprise-wide inventory of data assets and their classifications as the basis for
governance and security.

## Approach
1. **Register sources** — Connect data sources (Azure Storage, SQL, Synapse, Fabric, AWS S3,
   databases, Power BI, etc.).
2. **Choose an integration runtime** — Use the **managed** (Azure-hosted) runtime for cloud
   sources; deploy a **self-hosted integration runtime** to reach on-premises or private-network
   sources securely.
3. **Configure scans** — Schedule scans with scan rule sets; apply **classifications** (built-in
   SITs and custom) and lineage extraction where supported.
4. **Curate** — Review discovered assets, apply glossary terms, and assign data owners/stewards.
5. **Govern access** — Use collections to organise assets and scope permissions by domain.

## Guardrails
- Scope and schedule scans to manage cost and source load; avoid scanning everything at full
  depth on day one.
- Secure the self-hosted integration runtime host as sensitive infrastructure.
- Validate classification accuracy before relying on it for downstream protection.

## Example prompts
- `Register and scan data sources in the Purview Data Map.`
- `Configure an integration runtime for multicloud data scanning.`
- `How do I map enterprise data and run classification scans?`
- `Plan data discovery across cloud and on-prem sources.`

## Microsoft Learn
- Data Map overview: https://learn.microsoft.com/purview/concept-elastic-data-map
- Register & scan sources: https://learn.microsoft.com/purview/scan-data-sources
- Integration runtime: https://learn.microsoft.com/purview/manage-integration-runtimes
- Classifications: https://learn.microsoft.com/purview/concept-classification
