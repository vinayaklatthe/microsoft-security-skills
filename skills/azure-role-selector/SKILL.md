---
name: azure-role-selector
description: "Guidance for selecting the right Azure RBAC role with least privilege - mapping required actions to built-in roles, deciding when a custom role is needed, scoping assignments correctly, and choosing between control-plane and data-plane roles. Covers scope levels (management group → resource), groups vs direct assignment, and PIM for privileged roles. WHEN: which Azure role, least privilege role, Azure RBAC role selection, built-in vs custom role, scope role assignment, role for managed identity, data plane role, assign minimal permissions, RBAC design, control plane vs data plane, Storage Blob Data Reader vs Reader. DO NOT USE for Entra ID directory roles (use entra-id) or for Microsoft 365 admin roles (use m365-govern-manage)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Role Selector (RBAC Least Privilege)

Azure RBAC grants access through **role assignments** = security principal + role definition +
scope. The goal is **least privilege**: the minimum role at the narrowest scope that meets the
need, assigned to the right kind of principal (group for humans, managed identity for
workloads), and time-bound via PIM where it is privileged.

## When to use
Choosing the correct role for a user, group, service principal, or managed identity - or
reviewing existing assignments for excess privilege.

**Do not use this skill** for:
- Entra ID **directory** roles (Global Admin, User Admin, etc.) (use `entra-id`)
- Microsoft 365 admin roles (use `m365-govern-manage`)
- Activating privileged roles or designing access reviews (use `azure-pim`)
- Multicloud entitlement management (use `entra-permissions-management`)

## Pick the right role family

| Caller needs to... | Look at | Avoid |
|---|---|---|
| Read storage **account properties** | Control-plane: *Reader* / *Storage Account Contributor* | Owner |
| Read **blob contents** | Data-plane: **Storage Blob Data Reader** | Reader alone (no data access) |
| Write **blob contents** | Data-plane: **Storage Blob Data Contributor** | Owner / Contributor |
| Read **Key Vault secrets** (RBAC mode) | Data-plane: **Key Vault Secrets User** | Key Vault Administrator |
| Manage Key Vault itself | Control-plane: *Key Vault Contributor* | Owner |
| Run an Azure Function with managed identity | Data role on target resource only | Subscription Contributor |
| Delegate role assignment to others | **User Access Administrator** at narrow scope | Owner |
| Read everything in a subscription | *Reader* at subscription | Owner / Contributor |
| Manage one resource group only | *Contributor* at the resource group | Subscription Contributor |

> **Rule of thumb:** **Control-plane roles do not automatically grant data-plane access.**
> *Reader* lets you see a storage account exists; it does **not** let you read a blob. Pick
> the right plane explicitly. This is the single most common RBAC mistake.

## Approach

1. **Define the required actions precisely** - List the exact operations the principal must
   perform. Distinguish **control plane** (manage the resource: create, delete, list, configure)
   from **data plane** (read or write the data inside: blobs, secrets, queue messages, rows).
   *Verify: requirements are written as verbs and resource types, e.g. "read blob contents in
   container X" rather than "access storage".*
2. **Match the most specific built-in role** - Prefer the most specific **built-in role** whose
   `Actions` and `DataActions` cover the need. Built-in roles are maintained by Microsoft and
   evolve as services add capability. Avoid broad roles (*Owner*, *Contributor*) unless
   genuinely required.
   *Verify: the chosen built-in role's `Actions`/`DataActions` cover every required operation
   and nothing more (use `az role definition show`).*
3. **Decide custom vs built-in** - Create a **custom role** only when no built-in role fits.
   Define minimal `Actions`/`DataActions` and `NotActions`, version the JSON in source
   control, and pin assignable scopes.
   *Verify: a custom role exists only after confirming no built-in role covers the need; the
   JSON is in repo with a change history.*
4. **Scope narrowly** - Assign at the lowest effective scope: resource > resource group >
   subscription > management group. A *Storage Blob Data Reader* at one container is safer
   than at the storage account, which is safer than at the subscription.
   *Verify: the assignment scope is the smallest that satisfies the requirement; subscription-
   wide grants for a single resource are flagged.*
5. **Prefer identities and groups** - Assign to **Entra groups** for users (not direct user
   assignments) and **managed identities** for workloads (not service principals with secrets
   where avoidable). Group-based assignment scales; per-user assignment does not.
   *Verify: zero direct user assignments at subscription scope; workloads use managed
   identities, not user accounts.*
6. **Combine with PIM for privileged roles** - For *Owner*, *User Access Administrator*,
   *Contributor* at broad scopes, and any custom role with write at subscription scope,
   require **PIM** activation (just-in-time, MFA, approval where appropriate, time-bound).
   *Verify: privileged role assignments are *Eligible*, not *Active*; activation requires MFA
   and produces an audit log.*
7. **Govern continuously** - Run **access reviews** quarterly on privileged scopes, **remove
   unused assignments** detected by Entra Permissions Management or PIM activity reports, and
   re-baseline when ownership changes.
   *Verify: an access-review cadence is documented; unused-assignment report is reviewed and
   actioned.*

## Guardrails
- **Owner includes the ability to grant access** - restrict tightly and prefer *User Access
  Administrator* only where delegation is actually needed. Owner is rarely the right answer.
- **Control-plane roles (Reader / Contributor) do not automatically grant data-plane access** -
  choose the data role explicitly. *Reader* + *Storage Blob Data Reader* is the correct combo
  for "see the account and read the blobs".
- **Review and remove unused assignments**; pair high-privilege roles with PIM and access
  reviews. Standing privilege is the attack surface that compounds over time.
- **Custom roles are a maintenance burden** - every Microsoft change to the action catalog can
  break them. Pick built-in unless you genuinely cannot.
- **Group-based, not user-based.** Direct user assignments do not scale, do not survive joiner/
  mover/leaver, and become orphaned permissions.
- **Managed identity over service principal with secret** wherever the target service supports
  it - no secret to rotate, no secret to leak.
- **Scope at the smallest unit that meets the need.** A role at subscription "because it's
  simpler" is the lazy answer that becomes next year's incident.

## Common anti-patterns
- **"They need Owner because Reader does not work for blob data."** No - they need
  *Storage Blob Data Reader* (data plane). Adding Owner solves the wrong problem.
- **Custom role that mirrors a built-in** with one extra action. Build a follow-up assignment
  for that one action instead of forking a built-in role you now own forever.
- **Per-user assignments at subscription scope.** Joiner/mover/leaver leaves orphans; one
  audit later, the cleanup is a project.
- **Owner / Contributor at subscription for an automation service principal.** Blast radius
  equals the subscription. Scope to the resource group and the data role on the target
  resources only.
- **Standing Owner roles.** If a role is genuinely needed permanently, it usually is not Owner -
  it is a narrower role. If Owner is genuinely required, it must be in PIM.
- **No access review cadence.** Permissions never get smaller without a forcing function.

## Example prompts
- `Which built-in Azure role gives least-privilege access to read blob data?`
- `Should I use a built-in or custom role for this scenario?`
- `Pick the minimal role for a managed identity to access a specific Key Vault secret.`
- `How do I scope a role assignment correctly for least privilege?`
- `Move privileged Owner assignments into PIM.`

## Microsoft Learn
- RBAC overview: https://learn.microsoft.com/azure/role-based-access-control/overview
- Built-in roles: https://learn.microsoft.com/azure/role-based-access-control/built-in-roles
- Custom roles: https://learn.microsoft.com/azure/role-based-access-control/custom-roles
- RBAC best practices: https://learn.microsoft.com/azure/role-based-access-control/best-practices
- Understand role assignments: https://learn.microsoft.com/azure/role-based-access-control/role-assignments
- Storage data plane roles: https://learn.microsoft.com/azure/storage/blobs/authorize-access-azure-active-directory
