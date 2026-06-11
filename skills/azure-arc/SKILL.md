---
name: azure-arc
description: "Guidance for Azure Arc — projecting on-premises, multicloud (AWS/GCP), and edge servers, Kubernetes, and data services into Azure Resource Manager for unified governance, security, and management. Covers Arc-enabled servers onboarding, extending Defender for Cloud and Azure Policy to non-Azure machines, and Arc-enabled Kubernetes. WHEN: Azure Arc, manage on-prem servers from Azure, hybrid management, Arc-enabled servers, Arc Kubernetes, extend Defender for Cloud to on-prem, govern multicloud machines, Connected Machine agent, Arc agent, hybrid security posture, machine configuration, guest configuration. DO NOT USE for Azure-native VMs only (use Azure Resource Manager directly), Intune-managed endpoints (use intune-device-mgmt), or Azure Stack HCI specifically (separate product)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Arc

Azure Arc projects on-premises, multicloud, and edge resources into Azure Resource Manager so
they can be governed, secured, and managed with the same control plane as Azure-native
resources, extending Azure Policy, Microsoft Defender for Cloud, and Azure Monitor to hybrid
estates.

## When to use
Bringing non-Azure servers, Kubernetes clusters, and data services under consistent Azure
governance and security. Use this skill when you need one pane of glass and policy plane
across hybrid / multicloud machines.

**Do not use this skill** for Azure-native VMs (use ARM directly), Intune-managed endpoints
(`intune-device-mgmt`), or Azure Stack HCI deployment.

## Pick the Arc capability by resource type

| Resource type | Arc service | What you get |
|---|---|---|
| On-prem / AWS / GCP server | **Arc-enabled servers** | Defender for Cloud, Policy, Update Manager, Monitor, RBAC |
| Non-AKS Kubernetes (on-prem, EKS, GKE) | **Arc-enabled Kubernetes** | GitOps via Flux, Policy, Monitor, Defender for Containers |
| SQL Server on-prem / other cloud | **Arc-enabled SQL Server** | Inventory, best-practice assessment, Defender |
| PostgreSQL / SQL MI at edge | **Arc-enabled data services** | Managed PaaS-like experience at edge |
| Hybrid app platform (containerised) | **Arc-enabled App Services / Functions** | PaaS runtime on Arc-enabled K8s |

> **Rule of thumb:** start with **Arc-enabled servers** for hybrid posture - it's the
> highest-value, lowest-friction step. The Connected Machine agent gives you Defender for
> Cloud and Azure Policy across the hybrid estate for the price of an outbound HTTPS connection.

## Approach

1. **Plan the onboarding scope and identity** — Decide which subscriptions / resource groups
   own the Arc resources. Define the **target resource group per region / per business unit**.
   Pre-create service principals if onboarding at scale via script.
   *Verify: target RG exists with the `Azure Connected Machine Onboarding` role assigned to
   the onboarding identity.*

2. **Plan network and proxy requirements** — Connected Machine agent needs outbound HTTPS
   (443) to a defined list of Microsoft endpoints. If servers are behind a corporate proxy,
   configure the agent for proxy + auth. Some endpoints require firewall allowlisting.
   *Verify: a pilot server can reach `*.his.arc.azure.com`, `*.guestconfiguration.azure.com`,
   `*.dp.kubernetesconfiguration.azure.com` (for K8s); agent install completes.*

3. **Onboard servers at scale** — Pilot 5-10 servers manually (one Windows, one Linux).
   Then script the rollout: GPO / Ansible / Configuration Manager for Windows; cloud-init /
   Ansible for Linux. The agent script accepts service principal + tags.
   *Verify: Arc resource appears in the target RG; `Connected` status; tags applied.*

4. **Govern with Azure Policy + machine configuration** — Assign Azure Policy initiatives
   (e.g. Azure Security Benchmark) at the RG / subscription scope. **Machine configuration
   (formerly guest configuration)** audits in-OS settings on Arc machines just like Azure
   VMs.
   *Verify: ASB initiative shows compliance state for Arc machines; in-OS audit returns
   results (e.g. password complexity).*

5. **Extend Defender for Cloud** — Enable **Defender for Servers Plan 2** on the subscription
   that contains the Arc resources. Defender deploys MDE, file integrity monitoring, and
   adaptive controls to the Arc machines.
   *Verify: Defender for Servers shows Arc machines as protected; MDE shows them onboarded.*

6. **Unify monitoring + updates** — Send Arc machines' logs to Log Analytics via Azure
   Monitor Agent (extension). Use **Azure Update Manager** to assess and deploy updates from
   Azure across the hybrid fleet.

7. **Grant access via Azure RBAC** — Arc machines are ARM resources. Use Azure RBAC + PIM
   for who can manage them. The Arc agent also enables a **managed identity** on the machine
   for outbound calls to Azure services.

## Guardrails
- **Secure the Connected Machine agent and its outbound connectivity; scope its managed
  identity to least privilege.** A compromised agent identity = lateral path into Azure.
- **Plan network/proxy and firewall requirements before broad onboarding.** Failed agents
  silently never report - looks like the estate is healthy when it's blind.
- **Use Arc to unify security posture - don't leave hybrid servers outside Defender for
  Cloud.** A "we'll get to hybrid later" gap is where ransomware lives.
- **Arc Policy = on-prem Policy.** Same policies you apply to Azure VMs should hit Arc
  machines. Assign at the management group / subscription level for inheritance.
- **Tag Arc resources consistently with Azure-native ones.** Otherwise cost reports,
  ownership, and Defender prioritisation break.
- **Defender for Servers Plan 2 is per-machine-billed.** Cost-aware onboarding; pilot first.

## Common anti-patterns
- **"Onboard servers without firewall planning"** - Agents fail silently; estate looks
  unmanaged. Allowlist first.
- **"Manual onboarding for 5,000 servers"** - Not maintainable. Script with SP + tags.
- **"Defender for Servers Plan 1 only"** - Plan 1 lacks MDE / vuln management /file
  integrity. Plan 2 for production.
- **"Use Arc agent as a remote-execution back door"** - Tempting but breaks the security
  model. Use Run Command via ARM, governed by RBAC.
- **"Tag Arc machines differently from Azure VMs"** - Reports diverge. Same tagging
  scheme.
- **"Don't onboard servers in legacy DCs because they're going away"** - They're not going
  away as fast as you think; unmanaged DCs are the breach origin.

## Example prompts
- `Onboard on-premises servers to Azure with Arc and extend Defender for Cloud to them.`
- `How do I govern multicloud machines from Azure using Azure Arc?`
- `Deploy the Azure Arc agent at scale via service principal and apply security policy.`
- `Bring Arc-enabled Kubernetes clusters under central governance with Flux GitOps.`
- `Apply the Azure Security Benchmark initiative to Arc-enabled servers.`
- `Plan network and proxy requirements before broad Arc onboarding.`

## Microsoft Learn
- Azure Arc overview: https://learn.microsoft.com/azure/azure-arc/overview
- Arc-enabled servers: https://learn.microsoft.com/azure/azure-arc/servers/overview
- Defender for Cloud + Arc: https://learn.microsoft.com/azure/defender-for-cloud/quickstart-onboard-machines
- Arc network requirements: https://learn.microsoft.com/azure/azure-arc/servers/network-requirements
- Onboard at scale: https://learn.microsoft.com/azure/azure-arc/servers/onboard-service-principal
- Arc-enabled Kubernetes: https://learn.microsoft.com/azure/azure-arc/kubernetes/overview
- Azure Update Manager: https://learn.microsoft.com/azure/update-manager/overview
- Machine configuration: https://learn.microsoft.com/azure/governance/machine-configuration/overview
