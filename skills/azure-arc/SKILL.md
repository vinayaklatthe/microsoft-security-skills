---
name: azure-arc
description: "Guidance for Azure Arc — extending Azure management, governance, and security to on-premises, multicloud, and edge servers, Kubernetes, and data services. Covers Arc-enabled servers, Azure Policy/Defender for Cloud across hybrid, and access. WHEN: Azure Arc, manage on-prem servers from Azure, hybrid management, Arc-enabled servers, Arc Kubernetes, extend Defender for Cloud to on-prem, govern multicloud machines, Arc agent, hybrid security posture."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Arc

Azure Arc projects on-premises, multicloud, and edge resources into Azure so they can be governed,
secured, and managed with the same control plane (Azure Resource Manager) — extending Azure
Policy, Microsoft Defender for Cloud, and Azure Monitor to hybrid estates.

## When to use
Bringing non-Azure servers, Kubernetes clusters, and data services under consistent Azure
governance and security.

## Approach
1. **Onboard resources** — Install the **Azure Connected Machine agent** on servers (Windows/Linux,
   on-prem or other clouds) to create **Arc-enabled servers**; connect **Arc-enabled Kubernetes**
   clusters via agents.
2. **Govern** — Apply **Azure Policy** (incl. guest configuration/machine configuration) to audit
   and enforce settings on Arc machines, just like Azure VMs.
3. **Secure** — Extend **Microsoft Defender for Cloud** (CSPM + Defender for Servers) to Arc
   machines for posture and threat protection across hybrid/multicloud.
4. **Operate** — Use Azure Monitor, Update Manager, Machine Configuration, and extensions
   centrally; access via Azure RBAC.
5. **Identity** — Arc machines get a **managed identity** for secure access to Azure resources.

## Guardrails
- Secure the Connected Machine agent and its outbound connectivity; scope its managed identity to
  least privilege.
- Plan network/proxy and firewall requirements before broad onboarding.
- Use Arc to unify security posture — don't leave hybrid servers outside Defender for Cloud.

## Microsoft Learn
- Azure Arc overview: https://learn.microsoft.com/azure/azure-arc/overview
- Arc-enabled servers: https://learn.microsoft.com/azure/azure-arc/servers/overview
- Defender for Cloud + Arc: https://learn.microsoft.com/azure/defender-for-cloud/quickstart-onboard-machines
- Azure Policy for Arc: https://learn.microsoft.com/azure/azure-arc/servers/security-overview
