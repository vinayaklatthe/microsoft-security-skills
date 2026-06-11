---
name: insider-risk-baseline
description: "Guidance for establishing a Microsoft Purview Insider Risk Management baseline — detecting and managing risky insider activity (data theft, leaks, policy violations) with privacy-by-design. Covers policy templates, indicators, triage, and Adaptive Protection integration. WHEN: Insider Risk Management, IRM, detect data theft by departing employee, insider threat, risky user activity, IRM policy templates, pseudonymization, Adaptive Protection, insider risk indicators."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Insider Risk Management (Baseline)

Insider Risk Management (IRM) uses signals across Microsoft 365 and connected sources to detect,
investigate, and act on risky insider activity — data theft, leaks, and policy violations — with
**privacy-by-design** controls.

## When to use
Standing up an insider-risk program: departing-employee data theft, sensitive-data leaks, and
security-policy violations.

## Approach
1. **Configure prerequisites** — Set IRM settings, enable required indicators, and connect HR
   data (e.g., Microsoft 365 HR connector) for events like resignation/termination.
2. **Choose policy templates** — Start with templates: **data theft by departing users**,
   **data leaks**, **security policy violations**, and risky AI usage.
3. **Privacy by design** — Enable **pseudonymisation** of usernames, scope analyst/reviewer roles
   tightly (RBAC, separation of duties), and configure anonymisation per legal/works-council needs.
4. **Triage & investigate** — Review alerts, build cases, examine the user activity timeline, and
   escalate (e.g., to eDiscovery) as needed.
5. **Adaptive Protection** — Feed IRM risk levels into **Adaptive Protection** so DLP/Conditional
   Access tighten dynamically for elevated-risk users.

## Guardrails
- Engage legal/HR/privacy stakeholders before deployment; insider risk monitoring is sensitive.
- Use pseudonymisation and least-privilege reviewers by default.
- Tune indicator thresholds to avoid alert overload; start with a focused scope.

## Example prompts
- `Stand up an Insider Risk Management policy for departing-employee data theft.`
- `How do I configure pseudonymisation and least-privilege reviewers in IRM?`
- `Connect HR data so resignation/termination events trigger IRM signals.`
- `Feed IRM risk levels into Adaptive Protection.`

## Microsoft Learn
- IRM overview: https://learn.microsoft.com/purview/insider-risk-management
- Plan & configure: https://learn.microsoft.com/purview/insider-risk-management-configure
- Policy templates: https://learn.microsoft.com/purview/insider-risk-management-policies
- Adaptive Protection: https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection
