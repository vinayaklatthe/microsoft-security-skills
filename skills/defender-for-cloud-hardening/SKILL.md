---
name: defender-for-cloud-hardening
description: "Guidance for Microsoft Defender for Cloud — cloud security posture management (CSPM) and cloud workload protection (CWPP) across Azure, AWS, and GCP. Covers Secure Score, Defender plans, agentless scanning, attack path analysis, and recommendations remediation. WHEN: Defender for Cloud, CSPM, cloud workload protection, Secure Score, harden cloud posture, Defender plans, attack path analysis, multicloud security, remediate recommendations, cloud security hardening, how do I improve my Azure Secure Score, harden my Azure subscription, protect VMs and containers in Defender for Cloud, multicloud CSPM across AWS and GCP. DO NOT USE for SaaS application posture (use cloud-app-security-posture) or extending Azure management to on-premises servers (use azure-arc)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Cloud (Hardening)

Microsoft Defender for Cloud is a cloud-native application protection platform (CNAPP) combining
**CSPM** (posture, Secure Score, attack paths) and **CWPP** (threat protection for servers,
containers, databases, storage, APIs, AI) across Azure, AWS, and GCP.

## When to use
Assessing and improving cloud security posture and enabling workload threat protection across a
multicloud estate.

## Approach
1. **Foundational CSPM (free)** — Get Secure Score, recommendations (mapped to MCSB), and asset
   inventory across connected clouds; connect AWS/GCP via connectors.
2. **Enable Defender plans** — Turn on workload plans where risk warrants (Servers, Storage,
   Containers, Databases, App Service, Key Vault, APIs, AI). **Defender CSPM** adds agentless
   scanning, **attack path analysis**, and the cloud security graph.
3. **Remediate by attack path** — Prioritise recommendations that break real **attack paths** to
   critical assets, not just raw recommendation count.
4. **Enforce** — Use Azure Policy and governance rules to drive and assign remediation with SLAs.
5. **Operate** — Stream alerts to Sentinel/Defender XDR; use workflow automation for response.

## Guardrails
- Start with foundational CSPM everywhere; enable paid plans where workload risk justifies cost.
- Use attack path analysis to focus effort — Secure Score alone can mislead prioritisation.
- Tag critical assets so the cloud security graph weights them appropriately.

## Example prompts
- `Improve my Azure Secure Score in Defender for Cloud.`
- `Which Defender plans should I enable to protect VMs and containers?`
- `Use attack path analysis to prioritise remediation.`
- `Extend CSPM across AWS and GCP with Defender for Cloud.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction
- Secure Score: https://learn.microsoft.com/azure/defender-for-cloud/secure-score-security-controls
- Defender CSPM & attack paths: https://learn.microsoft.com/azure/defender-for-cloud/concept-attack-path
- Connect AWS/GCP: https://learn.microsoft.com/azure/defender-for-cloud/multicloud
