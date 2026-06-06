---
name: purview-general
description: "Orientation skill for the Microsoft Purview data security, governance, and compliance suite. Helps choose the right Purview solution for a goal and understand the unified portal, roles, and licensing model. WHEN: Microsoft Purview overview, which Purview solution, Purview portal, data governance vs data security vs compliance, Purview roles and permissions, where to start with Purview, Purview licensing, I do not know which Purview feature to use, what does Purview cover, getting started with Purview, Purview product overview, which compliance tool do I need. Use this skill first for Purview orientation, then follow up with the specific skill for your use case."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview (Overview)

Microsoft Purview is a unified suite for **data security, data governance, and risk &
compliance**, managed from the Microsoft Purview portal. This skill helps route a need to the
right solution.

## When to use
Deciding which Purview capability addresses a goal and understanding the portal, roles, and
prerequisites.

## Map the goal to a solution
- **Know your data** → Data Map, Unified Catalog, Information Protection (sensitivity labels),
  Data Classification (SITs/trainable classifiers).
- **Protect your data** → Information Protection labels + encryption, **Data Loss Prevention (DLP)**,
  Adaptive Protection, DSPM and **DSPM for AI**.
- **Govern your data** → Unified Catalog, Data Lifecycle Management, Records Management.
- **Manage insider & communication risk** → Insider Risk Management, Communication Compliance.
- **Investigate & respond** → eDiscovery, Audit.
- **Privacy** → Microsoft Priva (separate product family).

## Approach
1. **Start with discovery** — You cannot protect or govern what you cannot see; begin with the
   Data Map / classification.
2. **Confirm roles** — Use Purview role groups (least privilege); many solutions have dedicated
   role groups. Avoid over-assigning Compliance/Org Management.
3. **Confirm licensing** — Many advanced features require Microsoft 365 E5 Compliance or specific
   add-ons; validate before designing.
4. **Sequence** — Classification → labels → DLP/lifecycle → insider risk → DSPM for AI.

## Guardrails
- Don't deploy enforcement (DLP block, auto-labelling) before classification maturity exists.
- Scope by data sensitivity and regulatory drivers, not by feature availability.

## Microsoft Learn
- Purview overview: https://learn.microsoft.com/purview/purview
- Purview portal: https://learn.microsoft.com/purview/purview-portal
- Roles and permissions: https://learn.microsoft.com/purview/purview-permissions
- Licensing guidance: https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance
