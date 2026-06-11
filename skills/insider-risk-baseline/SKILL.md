---
name: insider-risk-baseline
description: "Guidance for establishing a Microsoft Purview Insider Risk Management (IRM) baseline - detecting and managing risky insider activity (data theft, leaks, policy violations) with privacy-by-design. Covers prerequisites, HR connector, policy templates, indicators, pseudonymisation, triage workflow, and Adaptive Protection integration. WHEN: Insider Risk Management, IRM, detect data theft by departing employee, insider threat, risky user activity, IRM policy templates, pseudonymization, Adaptive Protection, insider risk indicators, HR connector, departing user, separation of duties."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Insider Risk Management (Baseline)

Insider Risk Management (IRM) uses signals across Microsoft 365 and connected sources to detect,
investigate, and act on risky insider activity - data theft, leaks, and policy violations - with
**privacy-by-design** controls (pseudonymisation, RBAC, separation of duties).

## When to use
Standing up an insider-risk program: departing-employee data theft, sensitive-data leaks, and
security-policy violations - with legal/HR/privacy sponsorship in place.

Do not use this skill for risk-adaptive DLP design after IRM is running (use
`purview-advanced-dlp`) or for general communication compliance (use
`purview-communication-compliance` if available).

## Pick the right starting policy template
| Concern | Template |
|---|---|
| Employees leaving with data | **Data theft by departing users** (needs HR connector for resignation/termination) |
| Sensitive-content leaks to unauthorised recipients | **Data leaks** (general / by priority users / by disgruntled users) |
| Security-policy violations (malware, AV disable, etc.) | **Security policy violations** |
| Risky AI usage | **Risky AI usage** (preview/GA as available) |
| Patient data / healthcare scenarios | **Patient data leaks** (sector-specific) |

Rule of thumb: pick **one** template per quarter, tune it to acceptable signal-to-noise, then
add the next. Multiple templates active simultaneously without tuning swamps reviewers.

## Approach
1. **Engage stakeholders** - Bring legal, HR, privacy, and (where applicable) works councils to
   the design table; document the lawful basis for monitoring.
   *Verify: signed-off scope document specifying data sources, retention, reviewer roles.*
2. **Configure prerequisites** - Set IRM settings, enable required indicators (Office, device,
   physical badging via connectors), and connect HR data via the **Microsoft 365 HR connector**
   for events like resignation/termination.
   *Verify: HR connector status is healthy and a test resignation event appears within 24 hours.*
3. **Choose policy templates** - Start with templates: **data theft by departing users**,
   **data leaks**, **security policy violations**, and risky AI usage; configure scope.
   *Verify: policy is in place with a defined user scope (pilot first) and indicator set.*
4. **Privacy by design** - Enable **pseudonymisation** of usernames, scope analyst/reviewer roles
   tightly (RBAC, separation of duties), and configure anonymisation per legal/works-council
   needs.
   *Verify: reviewers see pseudonymised identifiers by default; un-anonymise requires elevated role.*
5. **Triage & investigate** - Review alerts, build cases, examine the user activity timeline, and
   escalate (e.g., to eDiscovery / HR) per the documented workflow.
   *Verify: case management workflow exists with stages, owners, SLAs.*
6. **Tune indicators and thresholds** - Adjust thresholds to acceptable signal-to-noise; document
   tuning decisions for audit.
   *Verify: alert volume per reviewer per week within the agreed range.*
7. **Adaptive Protection** - Feed IRM risk levels into **Adaptive Protection** so DLP/Conditional
   Access tighten dynamically for elevated-risk users.
   *Verify: an elevated-risk test user triggers the stricter DLP branch.*

## Guardrails
- Engage legal/HR/privacy stakeholders before deployment; insider risk monitoring is sensitive
  and getting governance wrong damages employee trust and creates legal risk.
- Use pseudonymisation and least-privilege reviewers by default; separate IRM analyst from
  investigator roles.
- Tune indicator thresholds to avoid alert overload; start with a focused scope (one BU or
  priority-user group) before tenant-wide.
- HR connector is mandatory for departing-user detection - resignation/termination events drive
  the highest-confidence signal; without it the template is half-blind.
- Document retention for IRM signals/cases per legal/regulatory requirements; do not retain
  longer than justified.

## Common anti-patterns
- Switching on every template tenant-wide on day one - reviewer fatigue within a week.
- No HR connector - departing-user template fires on weak signal and misses real cases.
- Pseudonymisation off because "we trust our analysts" - works council and legal disagree later.
- Single role group with full IRM permissions - no separation of duties.
- No defined escalation path to HR/legal - cases die in the queue.

## Example prompts
- `Stand up an Insider Risk Management policy for departing-employee data theft.`
- `How do I configure pseudonymisation and least-privilege reviewers in IRM?`
- `Connect HR data so resignation/termination events trigger IRM signals.`
- `Feed IRM risk levels into Adaptive Protection.`
- `Tune IRM indicator thresholds to reduce alert overload.`

## Microsoft Learn
- IRM overview: https://learn.microsoft.com/purview/insider-risk-management
- Plan & configure IRM: https://learn.microsoft.com/purview/insider-risk-management-configure
- Policy templates: https://learn.microsoft.com/purview/insider-risk-management-policies
- Adaptive Protection: https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection
- HR connector: https://learn.microsoft.com/purview/import-hr-data
- Permissions & role groups: https://learn.microsoft.com/purview/insider-risk-management-permissions
