---
name: entra-permissions-management
description: "Guidance for Microsoft Entra Permissions Management (CIEM) — discovers, right-sizes, and monitors permissions across Microsoft Azure, AWS, and Google Cloud. Covers cloud onboarding, the Permission Creep Index (PCI), generating least-privilege policies from observed activity, on-demand permission grants, and workload identity coverage. WHEN: Entra Permissions Management, CIEM, multicloud permissions, Permission Creep Index, PCI, right-size permissions, unused permissions, least privilege across AWS GCP Azure, cloud entitlement management, over-privileged workload identity, IAM right-sizing, multicloud IAM posture. DO NOT USE for Azure-only RBAC role choice (use azure-role-selector) or Defender for Cloud security posture (use defender-for-cloud-hardening)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra Permissions Management

Microsoft Entra Permissions Management is a Cloud Infrastructure Entitlement Management (CIEM)
solution that provides visibility and control over permissions for identities, actions, and
resources across **Microsoft Azure, AWS, and Google Cloud** in a single pane.

## When to use
Discovering and reducing excessive, unused, and over-privileged cloud permissions across a
multicloud estate, driving toward least privilege. Use this skill when the estate spans
multiple clouds; for Azure-only RBAC choice use `azure-role-selector`.

## Map the goal to the right CIEM action

| If the goal is... | Use | Notes |
|---|---|---|
| Quantify how over-privileged each identity is | **Permission Creep Index (PCI)** | 0-100; > 65 = high risk |
| Find unused permissions per identity | **Activity-based right-sizing report** | Compares granted vs used over 90 days |
| Generate a least-privilege policy from observed activity | **Auto-generated policy** (right-sizing) | Per identity per cloud |
| Grant elevated permission temporarily | **On-demand permissions request** | Approval-based, time-bound |
| Detect anomalous permission usage | **Anomaly detection alerts** | First-time-seen action, mass action |
| Catch over-privileged workload identity | **Non-human identity report** | Service principals, IAM roles, GCP SAs |

> **Rule of thumb:** start with PCI > 65 identities and the **non-human identity report**.
> Service principals and machine identities typically hold the largest gap between granted
> and used permissions and rarely fight back when you right-size them.

## Approach

1. **Onboard each cloud** — Connect Azure subscriptions (single or multiple), AWS accounts
   (per-account or AWS Organizations), and GCP projects. Permissions Management collects
   entitlement and activity data via read-only roles.
   *Verify: data collector status = green for each cloud account; activity events flowing
   within 24 hours.*

2. **Baseline for 90 days** — Don't right-size based on 7 days of activity. Quarterly business
   cycles (month-end close, audit) need full coverage.
   *Verify: "data collection period" shows ≥ 90 days before remediation work.*

3. **Sort by PCI - top 20 first** — Start with the 20 highest-PCI identities, not the longest
   list of unused permissions. PCI prioritises by risk (granted breadth + privilege weight),
   not just count.
   *Verify: top 20 PCI list reduced by ≥ 50 points cumulative after first sprint.*

4. **Tackle non-human identities first** — Service principals, AWS IAM roles, GCP service
   accounts. They don't complain when you remove unused permissions and they're often the
   most over-privileged.
   *Verify: non-human identity PCI distribution shifts left (lower) month over month.*

5. **Right-size with auto-generated policies** — Use the activity-based policy generator
   instead of writing JSON manually. Review the diff, apply to a test workload, then
   production.

6. **Enable on-demand permissions** — For high-privilege but rarely-needed permissions,
   convert standing access to on-demand request flow. Reduces standing risk dramatically.

7. **Monitor + alert** — Anomaly detection on first-time-seen action and mass actions.
   Stream alerts to Sentinel for SOC correlation.

## Guardrails
- **Validate activity baselines cover a representative period (90 days minimum) before
  aggressively right-sizing.** Anything less misses quarterly or month-end-only workflows
  and causes outages.
- **Test in a non-production workload first.** A right-sized policy that breaks a CI/CD
  pipeline at 02:00 is worse than the over-privilege.
- **Treat machine/workload identities explicitly - they often hold the largest unused
  permission gap and rarely fight back when you right-size them.** Address them first.
- **Coordinate remediation with workload owners.** Right-sizing without informing the owner
  of the service account causes outages and erodes trust in the programme.
- **Don't right-size break-glass / emergency access roles.** Document the exceptions.
- **PCI is a risk score, not a permissions count.** Don't compare identities on permission
  count alone - 5 high-privilege unused beats 50 low-privilege unused.

## Common anti-patterns
- **"Right-size after 2 weeks of data"** - Misses month-end. Outage.
- **"Start with the easiest report"** - Many small wins, no risk reduction. Sort by PCI.
- **"Right-size humans first because there are more of them"** - Humans push back; non-humans
  don't. Non-humans usually carry the highest unused privilege.
- **"Apply auto-generated policies directly to production"** - Test workload first.
- **"Onboard only one cloud at a time over months"** - Loses the multicloud visibility that
  is the entire point. Onboard all clouds in the same sprint.
- **"PCI dashboard only - no remediation"** - Visibility without action. Track PCI delta
  monthly as the KPI.

## Example prompts
- `Onboard our Azure, AWS, and GCP environments to Entra Permissions Management.`
- `Show the top 20 identities by Permission Creep Index and propose a remediation order.`
- `Generate a least-privilege policy for our CI/CD service principal based on 90 days of activity.`
- `Find non-human identities with PCI > 65 and right-size the top 5.`
- `Set up on-demand permission requests for elevated AWS roles.`
- `Stream Permissions Management anomaly alerts into Sentinel.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/permissions-management/overview
- Onboard Azure: https://learn.microsoft.com/entra/permissions-management/onboard-azure
- Onboard AWS: https://learn.microsoft.com/entra/permissions-management/onboard-aws
- Onboard GCP: https://learn.microsoft.com/entra/permissions-management/onboard-gcp
- Permission Creep Index: https://learn.microsoft.com/entra/permissions-management/ui-dashboard
- Right-size permissions: https://learn.microsoft.com/entra/permissions-management/product-permissions-analytics-reports
- Anomaly detection: https://learn.microsoft.com/entra/permissions-management/product-statistical-anomalies
