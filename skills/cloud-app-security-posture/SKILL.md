---
name: cloud-app-security-posture
description: "Guidance for cloud and SaaS security posture management - combining Defender for Cloud CSPM (IaaS/PaaS) and Defender for Cloud Apps SSPM (SaaS) to assess and harden posture across cloud and SaaS apps. Covers Secure Score, MCSB, attack-path analysis, SSPM recommendations, and governance. WHEN: cloud security posture, SaaS security posture management, SSPM, CSPM, secure cloud apps, posture recommendations, harden SaaS configuration, app security posture, multicloud and SaaS hardening, harden Microsoft 365 SaaS settings, find misconfigured Salesforce or ServiceNow settings, SaaS app misconfiguration. DO NOT USE for IaaS/PaaS workload threat protection plans (use defender-for-cloud-hardening) or for SaaS threat detection only (use defender-for-cloud-apps)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Cloud & App Security Posture

Security posture management spans two complementary layers: **CSPM** for cloud infrastructure
(IaaS/PaaS) via Microsoft Defender for Cloud, and **SSPM** for SaaS applications via Microsoft
Defender for Cloud Apps. Together they continuously reduce misconfiguration risk across the
cloud and SaaS estate.

## When to use
Assessing and continuously hardening configuration posture across both cloud infrastructure and
SaaS applications - especially when remediation has stalled or when you cannot answer "what
should we fix next?".

**Do not use this skill** for:
- IaaS/PaaS workload threat protection plans (use `defender-for-cloud-hardening`)
- SaaS threat detection or shadow-IT discovery only (use `defender-for-cloud-apps`)
- DSPM for AI (use `purview-dspm-ai`)

## Pick the right posture lens

| You need to harden... | Use this | Surface |
|---|---|---|
| Azure subscriptions, AWS accounts, GCP projects | **Defender for Cloud CSPM** | Defender for Cloud → Recommendations |
| Internet-exposed VMs / data with toxic combinations | **Defender CSPM (paid) + attack-path** | Defender for Cloud → Attack path analysis |
| Microsoft 365, Salesforce, ServiceNow, GitHub config | **Defender for Cloud Apps SSPM** | Defender XDR → Cloud apps → Posture |
| Container / Kubernetes posture | **Defender CSPM container plan** | Defender for Cloud → Cloud security graph |
| Code / IaC misconfiguration | **DevOps security in Defender for Cloud** | Defender for Cloud → DevOps |
| Identity hygiene gaps in the cloud | **Identity recommendations (CIEM)** | Defender for Cloud + Entra Permissions Mgmt |

> **Rule of thumb:** Foundation CSPM is free with the Defender for Cloud plan and gives you
> Secure Score + MCSB recommendations. The paid **Defender CSPM** plan adds attack-path
> analysis, the cloud security graph, agentless scanning, and DevOps - enable it for any
> environment where you need to prioritise by exploitability, not by count.

## Approach

1. **Enable foundation CSPM everywhere** - Turn on Defender for Cloud across all Azure
   subscriptions, connect AWS accounts and GCP projects, and confirm **Microsoft Cloud Security
   Benchmark (MCSB)** recommendations and **Secure Score** are populating.
   *Verify: Defender for Cloud → Inventory shows all subscriptions/accounts; Secure Score is
   non-zero per scope.*
2. **Turn on Defender CSPM (paid) for high-value scopes** - Enable the paid plan on
   subscriptions/accounts holding internet-exposed workloads or sensitive data to unlock
   **attack-path analysis** and the **cloud security graph**. Foundation CSPM alone tells you
   what is misconfigured; Defender CSPM tells you which misconfigurations form an exploitable
   chain.
   *Verify: Attack path analysis page lists at least one path; you can trace a path from
   internet to sensitive data.*
3. **Enable SSPM in Defender for Cloud Apps** - Connect each SaaS app (Microsoft 365,
   Salesforce, ServiceNow, GitHub, Okta, etc.) via API connector. SSPM recommendations cover
   admin controls, MFA settings, sharing exposure, and inactive privileged users per app.
   *Verify: Defender XDR → Cloud apps → Posture shows recommendations per connected app, not
   just discovery.*
4. **Prioritise by exposure and impact** - Rank remediations by: internet exposure, sensitive
   data, privileged identity, and attack-path criticality. Use the cloud security graph to
   group recommendations that break the same path.
   *Verify: top 10 remediation list is not the top 10 by recommendation count but the top 10
   by risk-weighted impact.*
5. **Assign owners and SLAs** - Recommendations without an owner do not get fixed. Route by
   workload (subscription tag, resource group, SaaS app owner) into your ticketing system with
   a remediation SLA based on severity.
   *Verify: ticket count per workload owner is visible; aging report shows median time to
   close per severity.*
6. **Enforce and automate where safe** - Use **Azure Policy** to prevent regression of fixed
   configurations (deny new resources without encryption, block public IP creation in tagged
   scopes). Use Defender for Cloud workflow automation to route recommendations to Logic Apps
   for auto-remediation where reversible.
   *Verify: at least one Azure Policy denies a previously-common misconfiguration; auto-
   remediation logs show successful fixes for one recommendation class.*
7. **Monitor drift continuously** - Re-baseline as the estate changes (new subscriptions, new
   SaaS apps, new accounts). Posture is not a one-time project; it is an operating model.
   *Verify: Secure Score trend over 90 days is flat or improving, not erratic.*

## Guardrails
- **Posture management is preventive**; pair with threat detection (Defender for Cloud workload
  plans, Defender for Cloud Apps threat policies). Posture without detection misses live
  attacks; detection without posture lets the same hole be exploited repeatedly.
- **Don't chase score for its own sake** - fix exploitable, high-impact issues first. A 95%
  Secure Score with an open attack path to crown-jewel data is worse than a 70% score with no
  paths.
- **Coordinate remediation** with app/workload owners to avoid breakage. Disabling public
  access on a storage account that a partner depends on is an outage, not a fix.
- **Free CSPM is the floor, not the ceiling.** Foundation CSPM lacks attack-path and graph
  features - in high-risk scopes, the paid Defender CSPM plan is the right baseline.
- **Each connected SaaS app costs governance attention** - connect the ones you actually
  manage, not every connector that exists.
- **Treat posture findings as code** - fix the root template (Bicep, Terraform, IaC), not just
  the deployed resource, so the fix survives the next deployment.

## Common anti-patterns
- **"Enable everything and let analysts triage the noise."** Without scope, ownership, and
  prioritisation, posture becomes a 10,000-item backlog and nothing moves.
- **Chasing Secure Score number** while ignoring attack paths. A clean score plus an
  exploitable path is worse than a messy score with no exploitable path.
- **SSPM as a checkbox** - connecting SaaS apps but never reviewing the recommendations. The
  value is the recurring review cadence.
- **No Azure Policy backstop.** Fixed recommendations regress because nothing prevents the next
  deployment from re-introducing the same misconfiguration.
- **Treating SSPM and CSPM as separate worlds.** Many exploit chains cross the boundary
  (compromised SaaS admin → cloud workload). Review both lenses together for high-risk users.

## Example prompts
- `Harden our Microsoft 365 SaaS settings and review posture recommendations.`
- `Find misconfigured Salesforce or ServiceNow settings with SSPM.`
- `How do I improve SaaS security posture across multiple cloud apps?`
- `Use attack-path analysis to prioritise CSPM remediations.`
- `Review and remediate the top 10 cross-cloud posture issues.`

## Microsoft Learn
- Defender for Cloud CSPM: https://learn.microsoft.com/azure/defender-for-cloud/concept-cloud-security-posture-management
- SaaS security posture (SSPM): https://learn.microsoft.com/defender-cloud-apps/security-saas
- Attack path analysis: https://learn.microsoft.com/azure/defender-for-cloud/concept-attack-path
- Cloud security graph: https://learn.microsoft.com/azure/defender-for-cloud/concept-attack-path
- Secure Score: https://learn.microsoft.com/azure/defender-for-cloud/secure-score-security-controls
- Microsoft Cloud Security Benchmark: https://learn.microsoft.com/security/benchmark/azure/
