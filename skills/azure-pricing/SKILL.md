---
name: azure-pricing
description: "Guidance for estimating and reasoning about the cost of Azure security services — using the Azure Pricing Calculator, understanding key cost drivers (Sentinel ingestion, Defender plans, Key Vault operations), and cost-optimization levers. WHEN: Azure security pricing, estimate cost, Sentinel cost, Defender for Cloud pricing, pricing calculator, cost drivers, optimize security spend, ingestion cost, licensing vs consumption, budget for security."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Security Pricing & Cost Estimation

Security services on Azure mix **consumption-based** (e.g., data ingestion, transactions) and
**per-resource/seat** pricing. This skill helps reason about and estimate costs and identify
optimisation levers. Always confirm current rates on official pricing pages.

## When to use
Producing a cost estimate or optimising spend for a security solution.

## Key cost drivers
- **Microsoft Sentinel** — Driven mainly by **data ingestion** (per GB) and retention. Use
  **Commitment Tiers**, route low-value logs to **Auxiliary/Basic logs** or ADX, and avoid
  duplicate ingestion.
- **Defender for Cloud** — Foundational **CSPM is free**; **Defender plans** are per-resource
  (e.g., per server/hour, per 10K transactions, per vCore). Enable plans where risk justifies.
- **Microsoft Defender XDR / Purview / Entra ID P2** — Largely **per-user licensing** (E5 /
  add-ons) rather than consumption.
- **Key Vault** — Per-operation (secrets/keys/certs) and HSM pool charges (Managed HSM).
- **Azure Firewall / Front Door / DDoS** — Deployment + data processing charges.

## Approach
1. **List components** and identify which are consumption vs licensed.
2. **Estimate quantities** — e.g., Sentinel daily GB, number of protected servers/resources.
3. **Use the Pricing Calculator** to model the estimate; add it to the workload TCO.
4. **Apply optimisation** — commitment tiers, log tiering, right-size Defender plan coverage,
   remove unused resources.
5. **Validate licensing** — Confirm whether E5/add-ons already cover a capability before adding
   consumption cost.

## Guardrails
- Pricing changes — always verify against the live pricing page and your agreement (EA/MCA/CSP).
- Sentinel ingestion is the most common cost surprise — plan log tiering up front.
- Don't disable needed protection purely for cost; optimise scope instead.

## Microsoft Learn
- Azure Pricing Calculator: https://azure.microsoft.com/pricing/calculator/
- Sentinel pricing/billing: https://learn.microsoft.com/azure/sentinel/billing
- Defender for Cloud pricing: https://azure.microsoft.com/pricing/details/defender-for-cloud/
- Cost management: https://learn.microsoft.com/azure/cost-management-billing/costs/
