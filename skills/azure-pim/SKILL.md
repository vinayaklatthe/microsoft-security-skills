---
name: azure-pim
description: "Guidance for Microsoft Entra Privileged Identity Management (PIM) — just-in-time, time-bound, approval-based, audited elevation for Entra roles, Azure resource roles, and privileged groups. Covers eligible vs active assignments, activation controls (MFA + approval + justification + ticket), access reviews, PIM for Groups, and removing standing access. WHEN: Privileged Identity Management, PIM, just-in-time access, time-bound role, eligible assignment, require approval to activate, privileged role activation, PIM for groups, access review privileged roles, reduce standing access, how do I remove permanent admin rights, temporary admin access, admins should not have standing Global Admin, JIT access for Azure roles, PIM activation alert, role activation audit. DO NOT USE for entitlement management of resource access packages (use entra-id-governance) or risk detection (use entra-id-protection)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra Privileged Identity Management (PIM)

PIM provides just-in-time, time-bound, approval-based, and audited elevation for privileged
roles - eliminating standing administrative access and reducing the attack surface for
high-value accounts. Requires **Entra ID P2**.

## When to use
Governing privileged access to Entra roles, Azure RBAC roles, and privileged groups. Use this
skill for moving permanent assignments to eligible, configuring activation controls, and
running recurring access reviews.

**Do not use this skill** for resource access packages (`entra-id-governance`) or risk
detection (`entra-id-protection`).

## Pick activation controls by role tier

| Role tier | Examples | Approval | MFA strength | Max activation duration |
|---|---|---|---|---|
| **Tier 0 - control plane** | Global Admin, Privileged Role Admin, Privileged Auth Admin | Required (2 approvers) | Phishing-resistant | 1 hour |
| **Tier 0 - Azure** | Owner on management group / root subscription | Required | Phishing-resistant | 2 hours |
| **Tier 1 - workload admin** | Exchange Admin, SharePoint Admin, Intune Admin | Required (1 approver) | Phishing-resistant | 4 hours |
| **Tier 1 - Azure** | Owner / Contributor on production subscription | Justification + ticket | MFA | 4 hours |
| **Tier 2 - operational** | Helpdesk, Reports Reader, Security Reader | Justification | MFA | 8 hours |

> **Rule of thumb:** the **two-approver requirement on Global Admin** is the single highest-
> value PIM control. It blocks self-elevation and forces a witness for every tenant-wide
> change.

## Approach

1. **Inventory permanent assignments** — Use `Get-MgRoleManagementDirectoryRoleAssignment` and
   the Azure portal `Assignments` view per subscription. Categorise by tier. Target: zero
   standing assignments outside break-glass.
   *Verify: `PIM → Entra roles → Assignments → Active` shows only break-glass accounts for
   Global Admin.*

2. **Convert to eligible in waves** — Tier 2 first (low blast radius if activation flow
   breaks), then Tier 1, then Tier 0. Give admins 7 days notice + a walkthrough video.
   *Verify: weekly activation count rises as expected; no admin complaints about lost access.*

3. **Configure activation settings per role** — Match the tier table above. Phishing-resistant
   MFA = require the authentication strength, not generic MFA.
   *Verify: Global Admin activation requires 2 approvers and phishing-resistant strength.*

4. **PIM for Groups** — Use for privileged groups that aren't Entra roles (e.g. "Tier 0
   Admins" group with multiple role assignments, AD-synced groups holding sensitive RBAC).
   Activate the group, not each role individually.

5. **PIM for Azure resources** — Onboard subscriptions and management groups. Convert Owner
   and User Access Administrator to eligible. Scope time-bound assignments narrowly (resource
   group, not subscription, where possible).

6. **Recurring access reviews** — Quarterly for Tier 0, bi-annually for Tier 1. Reviewer is
   the role assignee's manager, not the admin team. "No response" defaults to remove (with
   24-hour grace period notification).
   *Verify: review completion rate > 90%; removed assignments captured in audit log.*

7. **Alerts and audit** — Enable: "Too many global admins", "Roles activated outside PIM",
   "Activation doesn't require approval". Stream PIM audit (`AuditLogs` table) to Sentinel.

## Guardrails
- **Two break-glass accounts with permanent Global Admin, excluded from PIM.** Monitored on
  every sign-in. If PIM has an outage, you still have a way in.
- **Two approvers for Global Admin activation.** A single approver = self-approval if both
  approvers are admins. Two breaks that loop.
- **Phishing-resistant MFA for Tier 0 activation.** SMS MFA at Global Admin elevation is
  unacceptable in 2026.
- **Time-bound, narrow scope for Azure RBAC.** Resource group > subscription > management
  group. Tighter scope = lower blast radius if compromised.
- **Don't use "I just need it for a moment" as a justification.** Audit the justifications -
  if they're meaningless, the control isn't working.
- **Access reviews quarterly minimum.** Annual reviews allow 12 months of accumulated stale
  access.

## Common anti-patterns
- **"Standing Global Admin for the IT team"** - The exact attack surface PIM exists to
  eliminate. Move to eligible with approval.
- **"Approval optional - admins are trusted"** - Removes the witness requirement and the
  audit trail. Always require approval for Tier 0.
- **"One approver"** - Self-approval loop if the approver is also an admin. Two minimum.
- **"PIM for Entra roles only, Azure RBAC stays standing"** - Cloud subscription Owner is
  the biggest blast radius in many tenants. Cover Azure too.
- **"Reviews once a year"** - 12 months of drift. Quarterly for Tier 0.
- **"Justification field optional"** - Without justification, the audit log loses context.
  Required everywhere.
- **"Use PIM for shared service accounts"** - Service accounts can't approve interactively.
  Use managed identities + RBAC, not PIM.

## Example prompts
- `Inventory standing admin assignments in our tenant and target zero outside break-glass.`
- `Configure PIM activation for Global Admin with 2 approvers and phishing-resistant MFA.`
- `Set up PIM for Azure resource roles (Owner on production subscription).`
- `Configure quarterly access reviews for Tier 0 roles with auto-remove on no response.`
- `Alert when a Global Admin is added outside PIM or activated more than 5 times a week.`
- `Migrate our "Privileged Admins" security group to PIM for Groups.`

## Microsoft Learn
- PIM overview: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-configure
- Assign eligible Entra roles: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-how-to-add-role-to-user
- Activation settings: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-how-to-change-default-settings
- PIM for Groups: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/concept-pim-for-groups
- PIM for Azure resources: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-resource-roles-configure-role-settings
- Access reviews for PIM: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-create-roles-and-resource-roles-review
- PIM alerts: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-how-to-configure-security-alerts
- Emergency access accounts: https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access
