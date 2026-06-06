---
name: entra-permissions-management
description: "Guidance for Microsoft Entra Permissions Management — a CIEM solution that discovers, right-sizes, and monitors permissions across Azure, AWS, and GCP. Covers the Permission Creep Index, right-sizing, and remediation. WHEN: Entra Permissions Management, CIEM, multicloud permissions, Permission Creep Index, right-size permissions, unused permissions, least privilege across AWS GCP Azure, cloud entitlement management."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra Permissions Management

Microsoft Entra Permissions Management is a Cloud Infrastructure Entitlement Management (CIEM)
solution that provides visibility and control over permissions for identities, actions, and
resources across **Microsoft Azure, AWS, and Google Cloud**.

## When to use
Discovering and reducing excessive, unused, and over-privileged cloud permissions in a
multicloud estate, driving toward least privilege.

## Design approach
1. **Onboard clouds** — Connect Azure subscriptions, AWS accounts, and GCP projects so
   Permissions Management can collect entitlement and activity data.
2. **Measure with PCI** — Use the **Permission Creep Index (PCI)** to quantify the gap between
   permissions **granted** and permissions **used** per identity, and prioritise high-risk gaps.
3. **Right-size** — Remediate by removing unused permissions, generating least-privilege policies
   based on observed activity, and granting permissions on-demand.
4. **Monitor** — Use alerts and anomaly detection for permission usage; report on posture trends.
5. **Operationalise** — Establish a recurring review cadence and integrate findings into IAM
   governance.

## Guardrails
- Validate activity baselines cover a representative period before aggressively right-sizing.
- Coordinate remediation with workload owners to avoid breaking automation/service identities.
- Treat machine/workload identities explicitly — they often hold the largest unused permissions.

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/permissions-management/overview
- Onboard Azure/AWS/GCP: https://learn.microsoft.com/entra/permissions-management/onboard-azure
- Permission Creep Index: https://learn.microsoft.com/entra/permissions-management/ui-dashboard
- Right-size permissions: https://learn.microsoft.com/entra/permissions-management/product-permissions-analytics-reports
