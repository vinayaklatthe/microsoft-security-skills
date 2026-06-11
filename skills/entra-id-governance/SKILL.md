---
name: entra-id-governance
description: "Guidance for Microsoft Entra ID Governance — automating identity lifecycle and access with entitlement management (access packages), access reviews, lifecycle workflows for joiner-mover-leaver, separation of duties, and guest access governance. Covers when to use access packages vs direct group assignment, reviewer choice and fallback actions, and integration with PIM for privileged access. WHEN: Entra ID Governance, entitlement management, access packages, access reviews, lifecycle workflows, joiner mover leaver, JML, certify access, separation of duties, govern guest access, B2B guest expiration, identity lifecycle automation, sponsor approval, recertify access. DO NOT USE for risk-based detection (use entra-id-protection), CA policy authoring (use conditional-access-mfa), or PIM activation (use azure-pim)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra ID Governance

Entra ID Governance ensures the **right identities have the right access to the right
resources at the right time**. It automates identity lifecycle (JML) and access governance for
employees, partners, and guests. Requires the **Entra ID Governance** SKU (P2 + Governance
add-on, or M365 E5 + Governance).

## When to use
Automating access requests/approvals, recurring access certification, and joiner-mover-leaver
provisioning. Use this skill to choose between access packages and direct group assignment,
configure access reviews safely, and run lifecycle workflows.

**Do not use this skill** for risk detection (`entra-id-protection`), Conditional Access
(`conditional-access-mfa`), or PIM activation (`azure-pim`).

## Pick the right governance mechanism

| If the goal is... | Use | Notes |
|---|---|---|
| Self-service access request with approval | **Entitlement management - access package** | Includes guests; sponsor or manager approval |
| Time-bound access for a project | Access package with expiration | Auto-revokes; safer than group |
| Govern an existing privileged group | **PIM for Groups** (separate skill) | Just-in-time, not lifecycle |
| Recertify membership of a sensitive group | **Access review** on the group | Manager or self-attestation |
| Recertify access to an app | **Access review** on app assignments | Catches stale SaaS access |
| Auto-provision new joiners | **Lifecycle workflow** - joiner | Pre-hire setup, welcome email |
| Auto-revoke leaver access | **Lifecycle workflow** - leaver | Disable, group removal, license drop |
| Move to new department auto-adjust access | **Lifecycle workflow** - mover + dynamic groups | Attribute-driven |
| Catch toxic role combos (e.g. AP + AR) | **Separation of duties** on access package | Hard-block incompatible packages |

> **Rule of thumb:** if humans request the access, use an access package. If the system grants
> the access from HR attributes, use lifecycle workflows + dynamic groups. Direct group
> assignment is the legacy default and rarely correct in 2026.

## Approach

1. **Define the catalogue** — Access packages live in a **catalogue**. Catalogues map to a
   business owner (HR, Finance, Engineering platform team). Catalogue owners are accountable;
   IT facilitates.
   *Verify: each catalogue has a named non-IT owner.*

2. **Build access packages with policies** — Each package has resources (groups, apps,
   SharePoint sites), eligible requesters (internal users, specific connected orgs, all
   external), and an **assignment policy** (approval, expiration, attribute requirements).
   *Verify: every package has expiration set; no perpetual access.*

3. **Configure access reviews safely** — Set reviewer (manager > self > specific user),
   recurrence (quarterly Tier 0, bi-annually Tier 1, annually Tier 2). **Critical**: choose
   "no response" action carefully - auto-remove on no response is safer for low-risk
   resources but dangerous if the reviewer is on leave.
   *Verify: reviewer escalation enabled; "no response" defaults documented per review.*

4. **Lifecycle workflows for JML** — Build three core flows: **Pre-hire** (T-7 days),
   **Joiner** (start date), **Leaver** (last day). Use HR attributes as triggers (`employeeType`,
   `employeeHireDate`, `accountEnabled`).
   *Verify: leaver flow disables account, removes from all groups, revokes sessions, within
   1 hour of HR attribute change.*

5. **Separation of duties on access packages** — Mark incompatible packages (e.g. "Accounts
   Payable" + "Vendor Master Data Editor"). System blocks the second request with audit log.

6. **Guest governance** — All B2B guests via access packages with expiration. Run a quarterly
   review of guests with no recent activity (use `signInActivity` filter). Remove inactive
   guests automatically.
   *Verify: guests created outside an access package = 0 in monthly report.*

## Guardrails
- **Prioritise leaver/deprovisioning automation - orphaned access is a common breach root
  cause.** Leaver workflow within 1 hour of HR change, hard, not negotiable.
- **Set review reviewers and fallback actions carefully so "no response" doesn't auto-approve.**
  Default to "no response = remove" with reviewer escalation.
- **Access packages for guests, always.** B2B invitations outside packages bypass expiration
  and reviews.
- **Separation of duties only works if both packages are governed.** If one role assignment
  is direct (not via package), SoD won't see it.
- **Lifecycle workflows are triggered by attributes.** If HR doesn't push reliable attribute
  data, workflows won't fire. Validate the HR sync before relying on automation.
- **Don't put PIM-eligible roles in access packages.** Use PIM for Groups so activation is
  separate from assignment.

## Common anti-patterns
- **"Provision via Active Directory groups, deprovision via ticket"** - Asymmetric, leaks
  access. Both sides need to be automated.
- **"Access reviews once a year"** - 12 months of drift. Quarterly for sensitive resources.
- **"Reviewer = the resource owner"** - Owner has bias to approve. Manager of the user is
  better; self-review only for low-risk.
- **"Guest invitations from any user"** - Untracked guests sprawl. Restrict invitations to
  access package requests + a small invitations team.
- **"Lifecycle workflow runs on Day 1"** - Joiner needs access ready before Day 1. Pre-hire
  flow at T-7 days.
- **"Direct group assignment is faster than building a package"** - Faster once, slower
  forever after (no review, no expiration, no audit).

## Example prompts
- `Build an access package for guest contractors with sponsor approval and 90-day expiration.`
- `Set up lifecycle workflows for pre-hire, joiner, and leaver using HR attributes.`
- `Configure quarterly access reviews on our privileged group with manager review.`
- `Enforce separation of duties between "Accounts Payable" and "Vendor Master" access packages.`
- `Audit and remove inactive guests with no sign-in in 90 days.`
- `Move from direct group assignment to access packages for self-service.`

## Microsoft Learn
- ID Governance overview: https://learn.microsoft.com/entra/id-governance/identity-governance-overview
- Entitlement management: https://learn.microsoft.com/entra/id-governance/entitlement-management-overview
- Access reviews: https://learn.microsoft.com/entra/id-governance/access-reviews-overview
- Lifecycle workflows: https://learn.microsoft.com/entra/id-governance/what-are-lifecycle-workflows
- Separation of duties: https://learn.microsoft.com/entra/id-governance/entitlement-management-access-package-incompatible
- Guest access governance: https://learn.microsoft.com/entra/id-governance/entitlement-management-external-users
- Access review with PIM: https://learn.microsoft.com/entra/id-governance/privileged-identity-management/pim-create-roles-and-resource-roles-review
