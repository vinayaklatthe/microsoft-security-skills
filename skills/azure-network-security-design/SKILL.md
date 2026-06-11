---
name: azure-network-security-design
description: "Guidance for designing secure Azure network architecture — hub-spoke topology, segmentation with NSGs/ASGs, private endpoints, DDoS protection, and egress control, aligned to Zero Trust network pillar. WHEN: Azure network security, hub spoke, network segmentation, NSG ASG design, private endpoint, DDoS protection, secure virtual network, egress control, Zero Trust network, private connectivity design."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Network Security Design

Secure Azure networking applies Zero Trust to the **network** pillar: segment, control traffic
explicitly, prefer private connectivity, and inspect/filter egress — assuming the network is
hostile.

## When to use
Designing the network topology and controls for an Azure landing zone or workload.

## Approach
1. **Topology** — Use a **hub-spoke** (or Virtual WAN) model: shared services (firewall, DNS,
   gateways) in the hub; workloads isolated in spokes with peering.
2. **Segmentation** — Apply **NSGs** at subnet level with **Application Security Groups (ASGs)** to
   group workloads; default-deny and allow only required flows. Microsegment tiers (web/app/data).
3. **Private connectivity** — Use **Private Endpoints / Private Link** for PaaS so traffic stays on
   the backbone; restrict or disable public network access on PaaS resources.
4. **Egress control** — Route outbound through **Azure Firewall** (FQDN/app rules) to control and
   log egress; avoid uncontrolled outbound from workloads.
5. **DDoS & edge** — Enable **Azure DDoS Protection** on public-facing VNets and front L7 apps with
   WAF on Front Door/Application Gateway.
6. **DNS** — Centralise DNS (private DNS zones) and protect resolution.

## Guardrails
- Prefer private endpoints over service endpoints for sensitive PaaS data planes.
- Default-deny NSGs; document every allow rule's purpose.
- Don't expose management ports (RDP/SSH) to the internet — use Bastion / just-in-time access.

## Example prompts
- `Design a hub-and-spoke network with segmentation and private endpoints.`
- `How do I apply Zero Trust principles to an Azure virtual network?`
- `Plan NSG and ASG rules plus DDoS protection for a secure VNet.`
- `Control egress traffic and private connectivity across spokes.`

## Microsoft Learn
- Network security best practices: https://learn.microsoft.com/azure/security/fundamentals/network-best-practices
- Hub-spoke topology: https://learn.microsoft.com/azure/architecture/networking/architecture/hub-spoke
- Private Link: https://learn.microsoft.com/azure/private-link/private-link-overview
- Zero Trust network: https://learn.microsoft.com/security/zero-trust/deploy/networks
