---
name: azure-role-selector
description: "Guidance for selecting the right Azure RBAC role with least privilege — mapping required actions to built-in roles, deciding when a custom role is needed, and scoping assignments correctly. Covers control vs data plane, scope levels, and assignment hygiene. WHEN: which Azure role, least privilege role, Azure RBAC role selection, built-in vs custom role, scope role assignment, role for managed identity, data plane role, assign minimal permissions, RBAC design."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Role Selector (RBAC Least Privilege)

Azure RBAC grants access through **role assignments** = security principal + role definition +
scope. The goal is **least privilege**: the minimum role at the narrowest scope that meets the
need.

## When to use
Choosing the correct role for a user, group, service principal, or managed identity.

## Approach
1. **Define the required actions** — List the exact operations (control-plane management vs
   **data-plane** access, e.g., reading blob contents needs *Storage Blob Data Reader*, not
   *Reader*).
2. **Match a built-in role** — Prefer the most specific **built-in role** whose `Actions`/
   `DataActions` cover the need. Avoid broad roles (Owner/Contributor) unless truly required.
3. **Decide custom vs built-in** — Create a **custom role** only when no built-in role fits; define
   minimal `Actions`/`DataActions` and `NotActions`.
4. **Scope narrowly** — Assign at the lowest effective scope (resource > resource group >
   subscription > management group). Avoid subscription-wide grants for narrow needs.
5. **Prefer identities & groups** — Assign to **groups** for users and **managed identities** for
   workloads; avoid per-user sprawl and credentials.
6. **Govern** — Combine with **PIM** for privileged roles and periodic access reviews.

## Guardrails
- Owner includes the ability to grant access — restrict tightly and prefer User Access
  Administrator only where delegation is needed.
- Control-plane roles (Reader/Contributor) do **not** automatically grant data-plane access —
  choose the data role explicitly.
- Review and remove unused assignments; pair high-privilege roles with PIM.

## Microsoft Learn
- RBAC overview: https://learn.microsoft.com/azure/role-based-access-control/overview
- Built-in roles: https://learn.microsoft.com/azure/role-based-access-control/built-in-roles
- Custom roles: https://learn.microsoft.com/azure/role-based-access-control/custom-roles
- Best practices: https://learn.microsoft.com/azure/role-based-access-control/best-practices
