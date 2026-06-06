---
name: cloud-app-security-posture
description: "Guidance for cloud and SaaS security posture management — combining Defender for Cloud CSPM (IaaS/PaaS) and Defender for Cloud Apps SSPM (SaaS) to assess and harden posture across cloud and SaaS apps. WHEN: cloud security posture, SaaS security posture management, SSPM, CSPM, secure cloud apps, posture recommendations, harden SaaS configuration, app security posture, multicloud and SaaS hardening."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Cloud & App Security Posture

Security posture management spans two complementary layers: **CSPM** for cloud infrastructure
(IaaS/PaaS) via Microsoft Defender for Cloud, and **SSPM** for SaaS applications via Microsoft
Defender for Cloud Apps. Together they reduce misconfiguration risk across the app estate.

## When to use
Assessing and continuously hardening configuration posture across both cloud infrastructure and
SaaS applications.

## Approach
1. **CSPM (infrastructure)** — Use Defender for Cloud Secure Score, recommendations (MCSB), the
   cloud security graph, and attack path analysis across Azure/AWS/GCP.
2. **SSPM (SaaS)** — Use Defender for Cloud Apps SaaS security posture recommendations for
   connected apps (e.g., misconfigured admin controls, weak MFA settings, exposed sharing).
3. **Prioritise** — Rank by exposure and impact; focus on internet-exposed and sensitive-data
   assets/apps and on remediations that break attack paths.
4. **Enforce & automate** — Use Azure Policy (infrastructure) and governance/workflow automation;
   assign owners and SLAs.
5. **Monitor drift** — Treat posture as continuous; re-baseline as the estate changes.

## Guardrails
- Posture management is preventive; pair with threat detection (CWPP, MDA threat policies).
- Don't chase score for its own sake — fix exploitable, high-impact issues first.
- Coordinate remediation with app/workload owners to avoid breakage.

## Microsoft Learn
- Defender for Cloud CSPM: https://learn.microsoft.com/azure/defender-for-cloud/concept-cloud-security-posture-management
- SaaS security posture (SSPM): https://learn.microsoft.com/defender-cloud-apps/security-saas
- Attack path analysis: https://learn.microsoft.com/azure/defender-for-cloud/concept-attack-path
- Secure Score: https://learn.microsoft.com/azure/defender-for-cloud/secure-score-security-controls
