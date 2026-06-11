---
name: m365-govern-manage
description: "Guidance for governing and managing Microsoft 365 collaboration sprawl — Teams/group lifecycle, sharing and guest access governance, and SharePoint Advanced Management — to keep the data estate secure and Copilot-ready. WHEN: Microsoft 365 governance, Teams sprawl, group lifecycle, guest access governance, external sharing controls, SharePoint Advanced Management, site lifecycle, manage collaboration sprawl, container governance."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft 365 Governance & Management

Uncontrolled collaboration sprawl - orphaned Teams, broad sharing, stale guests, overshared
sites - increases data risk and is the #1 blocker to a safe Microsoft 365 Copilot rollout.
This skill governs the Microsoft 365 collaboration estate without strangling productivity.

## When to use
Use this skill when the user is preparing for Copilot, dealing with sprawl from years of
open-by-default Teams creation, or building a long-term collaboration governance programme.

**Do not use this skill** for:
- DLP policy design (use `purview-dlp-policy`)
- Sensitivity label classification (use `purview-data-classification`)
- Copilot-specific oversharing remediation (use `purview-copilot-oversharing`)
- Entra access reviews for app/role access (use `entra-id-governance`)

## Pick the right control for the symptom

| Symptom | Control | Required licence |
|---|---|---|
| Anyone can create Teams; hundreds of orphaned groups | M365 group **creation restriction** + naming + expiration policy | Entra ID P1 (for expiration) |
| Guests added years ago still in groups | Entra **access reviews** for guests | Entra ID P2 |
| Sites shared with "Everyone except external users" by default | SharePoint **default sharing link** = People in org | M365 E3+ |
| Site contains sensitive data + open sharing | **Restricted Access Control (RAC)** + sensitivity label | SAM (E5 + SAM add-on) |
| Cannot see which sites overshare sensitive data | SAM **Data Access Governance reports** | SAM (E5 + SAM add-on) |
| Inactive sites cluttering tenant | SAM **inactive-site policy** + site lifecycle | SAM (E5 + SAM add-on) |
| Teams chat retention going forever | **Retention policy** (forward-only) | M365 E3 + |
| Need to block Copilot from indexing a site | **Restricted Content Discovery (RCD)** | SAM (E5 + SAM add-on) |

> **Rule of thumb:** governance for sprawl follows **discover → tighten defaults → clean up
> existing → maintain**. Skip discovery and you tighten the wrong controls.

## Approach

1. **Measure the sprawl first** — Run the **SharePoint Admin → Active sites** report and the
   **SAM Data Access Governance** reports to quantify:
   - Sites > 12 months inactive
   - Sites with > 1000 unique permissions
   - Sites shared with "Everyone except external users" or anonymous links
   - Teams without an owner

   Use the numbers to size the programme and pick first targets.
   *Verify: you can name your top 20 oversharing sites and your orphan-team count before
   designing any policy.*
2. **Tighten defaults before cleaning up** — Otherwise sprawl regrows.
   - **Default sharing link** = *People in your organisation* (not *Anyone with the link*)
   - **External sharing** = *Existing guests* or *New and existing guests* (not *Anyone*)
   - **Group creation** = restricted to a security group of approved owners (everyone else
     requests via a form)
   - **Naming policy** = prefix/suffix by department, blocked words list
   - **Expiration policy** = 365 days with owner renewal
   *Verify: a test user without rights cannot create a new M365 group; default link on a new
   site is *People in your organisation*.*
3. **Apply container labels** — Sensitivity labels at the site/team/group container level
   enforce privacy, external sharing, unmanaged-device access, and conditional access
   automatically. Critical for sites Copilot will see.
   *Verify: a labelled site rejects guest sharing if the label forbids it; CA policy fires
   on access from unmanaged device.*
4. **Clean up existing sprawl in waves** — Do not bulk-revoke; user backlash kills the
   programme. Sequence:
   - Wave 1: archive inactive sites (no edits in 18+ months) - read-only first, delete after
     90-day grace
   - Wave 2: review oversharing on sites containing labelled sensitive data
   - Wave 3: guest access reviews per group, owner-driven
   - Wave 4: ownerless groups assigned or archived
   *Verify: per-wave dashboard shows targets reduced > 50% with < 5% legitimate appeals.*
5. **Run a permanent review cadence** — Once-and-done fails. Schedule:
   - Quarterly: guest access reviews on sensitive groups
   - Monthly: ownerless-group sweep
   - On expiration: owner reaffirms or group deletes
6. **Report on posture** — Build a SharePoint Admin + SAM workbook showing oversharing trend,
   guest count, ownerless-group count. Make sprawl visible to leadership monthly.

## Guardrails
- **Governance underpins Copilot readiness.** Uncontrolled sharing = Copilot oversharing.
  Roll governance ahead of any Copilot deployment, not alongside.
- **Balance control with productivity.** Blocking group creation outright drives shadow IT
  (WhatsApp groups, personal OneDrives, third-party SaaS). Use the request-via-form pattern
  instead.
- **Test policies in a pilot OU first.** A global naming or expiration policy in error
  blocks legitimate work tenant-wide on day one.
- **Expiration deletes data.** Set a 90-day soft-delete recovery window and ensure owners
  receive renewal notices 30/15/1 days out; otherwise legitimate teams disappear.
- **SAM is a separate add-on.** Plan licensing - several powerful controls (RAC, RCD, DAG
  reports, inactive-site policy) all live behind SAM.
- **Guest access reviews need owners, not admins.** Admins approving en masse defeats the
  purpose. Configure owner-driven reviews with admin fallback only after timeout.

## Common anti-patterns
- **"Tighten defaults without cleaning up."** New sites are tidy; ten years of existing
  oversharing remains. Symptom unchanged, Copilot still leaks.
- **"Clean up without tightening defaults."** Sprawl regrows in weeks. Both must happen.
- **"Block all group creation."** Users go to unmanaged tools; you lose audit, DLP, and
  retention coverage entirely.
- **"Skip container labels because item labels exist."** Container labels enforce conditions
  the item label cannot (e.g. block guest sharing at site level). Both are needed.
- **"Run access reviews quarterly with no owner accountability."** Owners click *approve all*
  without checking. Pair reviews with reminder emails and removal-after-no-response.
- **"Treat governance as a one-time project."** Sprawl is a flow problem, not a stock problem.
  Without ongoing cadence, posture decays in 6 months.

## Example prompts
- `Control Microsoft 365 group and Teams sprawl with lifecycle policies.`
- `Govern guest access and external sharing across Microsoft 365.`
- `Use SharePoint Advanced Management for site lifecycle governance.`
- `How do I prepare Microsoft 365 governance for a Copilot rollout?`
- `What is the right default sharing link for a tenant?`
- `Build a guest access review programme that owners actually do.`

## Microsoft Learn
- Microsoft 365 group expiration: https://learn.microsoft.com/entra/identity/users/groups-lifecycle
- External collaboration settings: https://learn.microsoft.com/entra/external-id/external-collaboration-settings-configure
- SharePoint Advanced Management: https://learn.microsoft.com/sharepoint/advanced-management
- Data Access Governance reports: https://learn.microsoft.com/sharepoint/data-access-governance-reports
- Restricted Access Control: https://learn.microsoft.com/sharepoint/restricted-access-control
- Access reviews: https://learn.microsoft.com/entra/id-governance/access-reviews-overview
- Container sensitivity labels: https://learn.microsoft.com/purview/sensitivity-labels-teams-groups-sites
