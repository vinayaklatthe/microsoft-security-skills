---
name: azure-pim
description: "Guidance for Microsoft Entra Privileged Identity Management (PIM) — just-in-time, time-bound, approval-based elevation for Entra roles, Azure resource roles, and PIM for Groups. Covers eligible vs active assignments, activation settings, and access reviews. WHEN: Privileged Identity Management, PIM, just-in-time access, time-bound role, eligible assignment, require approval to activate, privileged role activation, PIM for groups, access review privileged roles, reduce standing access, how do I remove permanent admin rights, temporary admin access, admins should not have standing Global Admin, JIT access for Azure roles."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra Privileged Identity Management (PIM)

PIM provides **just-in-time**, time-bound, approval-based, and audited elevation for privileged
roles — eliminating standing administrative access and reducing the attack surface for
high-value accounts.

## When to use
Governing privileged access to Microsoft Entra roles, Azure resource (RBAC) roles, and privileged
groups (requires Entra ID P2).

## Approach
1. **Make assignments eligible** — Convert standing admin assignments to **eligible** so admins
   **activate** just-in-time, only when needed, for a limited duration.
2. **Activation controls** — Require **MFA / authentication strength**, **justification**,
   **ticket info**, and **approval** for sensitive roles; set max activation duration.
3. **Scope** — Use PIM for Entra roles, **Azure resource roles**, and **PIM for Groups** (to
   broker just-in-time membership of privileged groups).
4. **Review** — Configure recurring **access reviews** of eligible/active assignments; remove
   stale access.
5. **Alert & audit** — Enable alerts (e.g., too many admins, roles activated outside PIM) and
   review the PIM audit log; stream to Sentinel.

## Guardrails
- Keep at least two **break-glass** accounts with permanent access, excluded from just-in-time and
  strongly monitored.
- Require approval and phishing-resistant MFA for the most privileged roles (e.g., Global Admin).
- Aim to remove standing access for all high-privilege roles.

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-configure
- Assign eligible roles: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-how-to-add-role-to-user
- Activation settings: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-how-to-change-default-settings
- PIM for Groups: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/concept-pim-for-groups
