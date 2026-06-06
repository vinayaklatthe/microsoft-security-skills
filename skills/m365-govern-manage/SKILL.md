---
name: m365-govern-manage
description: "Guidance for governing and managing Microsoft 365 collaboration sprawl — Teams/group lifecycle, sharing and guest access governance, and SharePoint Advanced Management — to keep the data estate secure and Copilot-ready. WHEN: Microsoft 365 governance, Teams sprawl, group lifecycle, guest access governance, external sharing controls, SharePoint Advanced Management, site lifecycle, manage collaboration sprawl, container governance."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft 365 Governance & Management

Uncontrolled collaboration sprawl (orphaned teams, broad sharing, stale guests, overshared sites)
increases data risk and undermines Copilot readiness. This skill covers governing the Microsoft
365 collaboration estate.

## When to use
Bringing Teams/groups/SharePoint under lifecycle and sharing governance to reduce attack surface
and oversharing.

## Approach
1. **Group/Team lifecycle** — Apply Microsoft 365 group **expiration policies**, naming policies,
   creation restrictions, and ownership/access reviews to control proliferation and orphans.
2. **Sharing & guest governance** — Set tenant and site-level external sharing controls; use
   **Microsoft Entra access reviews** for guests and B2B collaboration settings.
3. **SharePoint Advanced Management (SAM)** — Use data access governance reports, restricted
   access control, site lifecycle management, and inactive-site policies to find and fix
   oversharing and sprawl.
4. **Container labels** — Apply sensitivity labels to sites/teams/groups to enforce privacy,
   external sharing, and access conditions.
5. **Review cadence** — Schedule recurring access reviews and report on posture.

## Guardrails
- Governance underpins Copilot readiness — uncontrolled sharing means Copilot oversharing.
- Balance control with productivity; over-restriction drives shadow IT.
- Use access reviews to remove stale guest and broad access continuously.

## Microsoft Learn
- Microsoft 365 group expiration: https://learn.microsoft.com/entra/identity/users/groups-lifecycle
- External collaboration settings: https://learn.microsoft.com/entra/external-id/external-collaboration-settings-configure
- SharePoint Advanced Management: https://learn.microsoft.com/sharepoint/advanced-management
- Access reviews: https://learn.microsoft.com/entra/id-governance/access-reviews-overview
