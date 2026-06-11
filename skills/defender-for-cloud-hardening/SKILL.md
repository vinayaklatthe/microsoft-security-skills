---
name: defender-for-cloud-hardening
description: "Guidance for Microsoft Defender for Cloud — cloud security posture management (CSPM) and cloud workload protection (CWPP) across Azure, AWS, and GCP. Covers Foundational vs Defender CSPM, Secure Score, Defender plans (Servers, Storage, Containers, Databases, App Service, Key Vault, APIs, AI), agentless scanning, attack path analysis, and remediation prioritisation. WHEN: Defender for Cloud, CSPM, cloud workload protection, Secure Score, harden cloud posture, Defender plans, attack path analysis, multicloud security, remediate recommendations, cloud security hardening, improve Azure Secure Score, harden Azure subscription, protect VMs and containers, multicloud CSPM across AWS and GCP, cloud security graph. DO NOT USE for SaaS posture (use cloud-app-security-posture), Sentinel SIEM (use sentinel), or extending Azure to on-prem servers (use azure-arc)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Cloud (Hardening)

Microsoft Defender for Cloud is a cloud-native application protection platform (CNAPP)
combining **CSPM** (posture, Secure Score, attack paths) and **CWPP** (threat protection for
servers, containers, databases, storage, APIs, AI) across Azure, AWS, and GCP.

## When to use
Assessing and improving cloud security posture, and enabling workload threat protection across
a multicloud estate. Use this skill to choose which Defender plans to enable, how to prioritise
remediation, and how to operationalise findings.

**Do not use this skill** for SaaS posture (`cloud-app-security-posture`), Sentinel SIEM
(`sentinel`), or extending Azure management to on-prem (`azure-arc`).

## Pick the Defender plan by workload

| Workload | Plan | Enable when |
|---|---|---|
| Subscriptions / accounts (posture) | **Foundational CSPM** (free) | Always; everywhere |
| Multicloud + attack paths + agentless scanning | **Defender CSPM** | Tier 1+ environments |
| Windows / Linux servers (EDR, file integrity, JIT) | **Defender for Servers Plan 2** | Production servers |
| Storage accounts (malware, sensitive-data scanning) | **Defender for Storage** | Public-facing / sensitive data |
| AKS / EKS / GKE clusters | **Defender for Containers** | Any production cluster |
| SQL, Cosmos DB, open-source DBs | **Defender for Databases** | Internet-exposed or sensitive |
| App Service apps | **Defender for App Service** | Internet-facing apps |
| Key Vault | **Defender for Key Vault** | Tier 0 / regulated |
| APIs behind APIM | **Defender for APIs** | Public APIs |
| Azure AI / OpenAI workloads | **Defender for AI Services** | AI workloads handling org data |

> **Rule of thumb:** Foundational CSPM everywhere on day one (it's free). Then enable
> Defender for Servers Plan 2 + Defender CSPM in production - those two unlock the most
> value (attack paths, EDR integration). Other plans by risk and budget.

## Approach

1. **Connect all clouds** — Onboard Azure (auto), AWS (connector + CloudFormation), GCP
   (connector + service account). Without all clouds connected, attack paths can't trace
   across them.
   *Verify: AWS / GCP connectors show "Connected"; recommendations appearing within 24
   hours.*

2. **Foundational CSPM baseline** — Get Secure Score, recommendations mapped to **Microsoft
   Cloud Security Benchmark (MCSB)**, and asset inventory. Use as the universal baseline.
   *Verify: Secure Score baseline captured for each subscription; recommendation count by
   severity logged.*

3. **Enable Defender plans by workload risk** — Use the picker table. Don't enable every
   plan on day one - cost spikes and alert fatigue. Production-first.

4. **Tag critical assets** so the cloud security graph weights them appropriately —
   `criticality=high`, `environment=prod`, `data-classification=sensitive`. Attack path
   analysis uses these to rank.
   *Verify: critical assets tagged consistently; attack paths page shows them weighted.*

5. **Remediate by attack path, not by raw count** — Use **attack path analysis** to find
   chains from internet → workload → sensitive asset. Fix the chain breakers first.
   Secure Score % is a vanity metric without attack-path context.
   *Verify: top 5 attack paths reviewed weekly; chain-breaker fixes tracked separately
   from generic recommendation count.*

6. **Enforce with Azure Policy** — Drive recommendations via Azure Policy `DeployIfNotExists`
   or `Audit`. Assign workload-owner accountability with **governance rules** + SLA.

7. **Operate** — Stream alerts and recommendations to Sentinel for SOC correlation. Use
   **workflow automation** (Logic Apps) for auto-response (e.g. open ticket, notify owner).

## Guardrails
- **Start with foundational CSPM everywhere; enable paid plans where workload risk justifies
  cost.** Don't blanket-enable every Defender plan on every subscription.
- **Use attack path analysis to focus effort - Secure Score alone can mislead
  prioritisation.** A 95% Secure Score with one internet-exposed unpatched VM is worse than
  80% with no live attack path.
- **Tag critical assets so the cloud security graph weights them appropriately.** Untagged
  critical asset = invisible to attack-path prioritisation.
- **Don't enable Defender for Servers Plan 2 without Defender for Endpoint license / plan
  awareness.** Cost and EDR-policy coordination matter.
- **Recommendations without owners die.** Assign via governance rules with a named owner
  and SLA.
- **Sentinel + Defender for Cloud is the operational pair.** Posture finds, SIEM correlates
  with telemetry.

## Common anti-patterns
- **"Maximise Secure Score by exempting recommendations"** - Score goes up; risk stays.
  Fix, don't exempt.
- **"Enable every Defender plan everywhere"** - Cost explodes; alert fatigue kills SOC.
  Production-first, by risk.
- **"Remediate top 100 recommendations in order"** - Misses attack-path priority. Sort by
  attack path first.
- **"Don't connect AWS / GCP - we'll get to it later"** - Cross-cloud attack paths
  invisible. Connect day one even if you don't enable paid plans there yet.
- **"Skip tagging critical assets"** - Cloud security graph can't weight risk. Tag.
- **"Defender for Cloud is a one-time deployment"** - Posture drifts daily; treat as a
  continuous operations programme.

## Example prompts
- `Improve my Azure Secure Score in Defender for Cloud.`
- `Which Defender plans should I enable to protect VMs and containers?`
- `Use attack path analysis to prioritise remediation.`
- `Extend CSPM across AWS and GCP with Defender for Cloud.`
- `Tag critical assets and configure the cloud security graph for risk weighting.`
- `Stream Defender for Cloud alerts into Sentinel with workflow automation.`

## Microsoft Learn
- Defender for Cloud overview: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction
- Secure Score: https://learn.microsoft.com/azure/defender-for-cloud/secure-score-security-controls
- Defender CSPM + attack paths: https://learn.microsoft.com/azure/defender-for-cloud/concept-attack-path
- Connect AWS / GCP: https://learn.microsoft.com/azure/defender-for-cloud/multicloud
- Defender plans pricing: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-cloud-glossary
- Cloud security graph: https://learn.microsoft.com/azure/defender-for-cloud/concept-data-security-posture
- Governance rules: https://learn.microsoft.com/azure/defender-for-cloud/governance-rules
- Workflow automation: https://learn.microsoft.com/azure/defender-for-cloud/workflow-automation
