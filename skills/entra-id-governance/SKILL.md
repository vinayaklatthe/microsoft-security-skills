---
name: entra-id-governance
description: "Guidance for Microsoft Entra ID Governance — managing identity lifecycle and access with entitlement management, access reviews, lifecycle workflows, and separation of duties. Covers access packages, joiner-mover-leaver automation, and recurring certification. WHEN: Entra ID Governance, entitlement management, access packages, access reviews, lifecycle workflows, joiner mover leaver, certify access, separation of duties, govern guest access, identity lifecycle automation."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra ID Governance

Entra ID Governance ensures the **right identities have the right access to the right resources**
at the right time — automating identity lifecycle and access governance for employees, partners,
and guests (requires Entra ID Governance / P2 licensing).

## When to use
Automating access requests/approvals, recurring access certification, and joiner-mover-leaver
lifecycle.

## Approach
1. **Entitlement management** — Bundle resources (groups, apps, SharePoint sites) into **access
   packages** with policies (who can request, approval workflow, expiration, separation of duties).
   Ideal for self-service and **guest** access governance.
2. **Access reviews** — Run recurring **access reviews** to recertify group/app/role membership and
   guest access; auto-remove on no response/denial.
3. **Lifecycle workflows** — Automate **joiner-mover-leaver**: pre-hire provisioning, attribute
   changes, and timely deprovisioning to remove orphaned access.
4. **Separation of duties** — Configure incompatible access packages to prevent toxic combinations.
5. **Integrate with PIM** — Govern privileged role eligibility and reviews together.

## Guardrails
- Prioritise leaver/deprovisioning automation — orphaned access is a common breach vector.
- Use access packages for guests to enforce expiration and sponsorship.
- Set review reviewers and fallback actions carefully so "no response" doesn't auto-remove
  critical access unintentionally.

## Microsoft Learn
- ID Governance overview: https://learn.microsoft.com/entra/id-governance/identity-governance-overview
- Entitlement management: https://learn.microsoft.com/entra/id-governance/entitlement-management-overview
- Access reviews: https://learn.microsoft.com/entra/id-governance/access-reviews-overview
- Lifecycle workflows: https://learn.microsoft.com/entra/id-governance/what-are-lifecycle-workflows
