---
name: azure-network-security-design
description: "Guidance for designing secure Azure network architecture — hub-spoke topology (or Virtual WAN), segmentation with NSGs/ASGs, private endpoints / Private Link for PaaS, egress through Azure Firewall, DDoS protection, WAF on Front Door/App Gateway, and centralised private DNS. Aligned to the Zero Trust network pillar. WHEN: Azure network security, hub spoke, Virtual WAN, network segmentation, NSG ASG design, private endpoint, Private Link, DDoS protection, secure virtual network, egress control, Zero Trust network, private connectivity design, Bastion, JIT VM access. DO NOT USE for the firewall itself (use azure-firewall), VM-level hardening (use defender-for-cloud-hardening), or Key Vault networking only (use azure-key-vault)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Network Security Design

Secure Azure networking applies Zero Trust to the **network** pillar: segment, control traffic
explicitly, prefer private connectivity, and inspect / filter egress, assuming the network is
hostile. The output is a hub-spoke (or Virtual WAN) topology with NSG microsegmentation,
private endpoints, and a single controlled egress path.

## When to use
Designing the network topology and controls for an Azure landing zone or workload. Use this
skill to pick topology, design segmentation, and place controls.

**Do not use this skill** for the firewall product itself (`azure-firewall`), VM hardening
(`defender-for-cloud-hardening`), or single-service networking (`azure-key-vault`).

## Pick the topology

| Estate shape | Topology | Notes |
|---|---|---|
| Single region, few subscriptions | **Hub-spoke (single region)** | Default for most |
| Multi-region with many spokes / branch sites | **Virtual WAN** | Microsoft-managed transit |
| Greenfield enterprise-scale | **Azure Landing Zones (CAF) - VWAN or hub-spoke** | Use CAF blueprints |
| Heavy on-prem + Azure | Hub-spoke + ExpressRoute / VPN gateway | Hub holds gateway + firewall |
| Small / single-workload | Single VNet, no hub | Don't over-engineer |

> **Rule of thumb:** hub-spoke for most enterprises, Virtual WAN at multi-region branch
> scale. The hub holds shared services (firewall, gateway, DNS, Bastion); workloads sit in
> spokes. Don't put workloads in the hub.

## Approach

1. **Topology and address plan** — Pick hub-spoke or Virtual WAN. Allocate non-overlapping RFC
   1918 ranges per region / spoke; reserve gateway subnet, firewall subnet, Bastion subnet in
   the hub.
   *Verify: address plan documented; no overlap with on-prem ranges; no overlap between
   regions.*

2. **Segmentation with NSGs and ASGs** — NSG at **subnet** level (preferred over per-NIC).
   Group workloads with **Application Security Groups (ASGs)** instead of static IP lists -
   ASGs survive scale events. Microsegment by tier: web / app / data.
   *Verify: NSG flow logs enabled to a Log Analytics workspace; default-deny rule present;
   ASGs used instead of IP-based source/dest for VM groups.*

3. **Private endpoints for PaaS** — Use **Private Endpoints / Private Link** for sensitive
   PaaS (Storage, SQL, Key Vault, Cosmos DB). Traffic stays on Microsoft backbone. Disable
   public network access on the PaaS resource itself.
   *Verify: `publicNetworkAccess = Disabled` on the resource; private endpoint resolves to a
   private IP via private DNS zone.*

4. **Centralise egress through Azure Firewall** — UDR on spokes: `0.0.0.0/0` next hop =
   firewall private IP. All outbound goes through the firewall for FQDN filtering and
   logging.
   *Verify: effective routes on a spoke NIC show next-hop = firewall; no spoke has its own
   public IP egress.*

5. **DDoS + WAF for public-facing** — Enable **Azure DDoS Network Protection** on VNets
   with public IPs. Place public web apps behind **Front Door** or **Application Gateway
   with WAF** in Prevention mode.
   *Verify: DDoS plan associated; WAF rules in Prevention (not Detection) for prod.*

6. **Centralised DNS** — Private DNS zones linked from the hub; spokes auto-resolve PaaS
   private endpoints via the zones. Don't let each spoke run its own DNS.

7. **Block management plane on the internet** — No direct RDP / SSH from internet to VMs.
   Use **Azure Bastion** (in the hub) or **Defender for Cloud just-in-time VM access**.
   *Verify: NSGs block 3389 / 22 from internet on all VM subnets; Bastion deployed in hub.*

## Guardrails
- **Prefer private endpoints over service endpoints for sensitive PaaS data planes.** Service
  endpoints leave the PaaS resource public; private endpoints make it truly private.
- **Default-deny NSGs; document every allow rule's purpose.** Allow lists drift to "allow
  everything" without discipline. Use ASGs + comments.
- **Don't expose management ports (RDP/SSH) to the internet - use Bastion / just-in-time
  access.** Internet-exposed 3389 / 22 = compromise within hours.
- **DNS is part of network security.** Untrusted DNS resolution undermines private endpoint
  isolation.
- **DDoS Network Protection is per-VNet, billed monthly.** Cheap insurance for public-facing
  VNets; don't blanket-enable on every VNet.
- **NSG flow logs to a workspace.** Without them, an incident has no network forensics.

## Common anti-patterns
- **"Workloads in the hub - it's just one VNet"** - Hub holds shared services only. Workloads
  in spokes for blast radius.
- **"Service endpoints because they're cheaper than private endpoints"** - Service endpoint
  doesn't make the PaaS private; only the routing. Private endpoint for sensitive data.
- **"NSG per NIC for every VM"** - Unmanageable. Subnet NSGs + ASGs.
- **"WAF in Detection forever"** - Logs attacks; doesn't block them. Move to Prevention
  after tuning.
- **"Each spoke has its own egress public IP"** - No central inspection, no egress logging.
  Force through hub firewall.
- **"Bastion later - we'll RDP through the VPN for now"** - VPN credential theft = lateral
  movement. Bastion + JIT from day one.

## Example prompts
- `Design a hub-and-spoke network with segmentation and private endpoints for an Azure landing zone.`
- `How do I apply Zero Trust principles to an Azure virtual network?`
- `Plan NSG and ASG rules plus DDoS protection for a secure VNet.`
- `Control egress traffic and private connectivity across spokes.`
- `Replace internet-exposed RDP with Bastion and just-in-time VM access.`
- `Should I use hub-spoke or Virtual WAN for our multi-region estate?`

## Microsoft Learn
- Network security best practices: https://learn.microsoft.com/azure/security/fundamentals/network-best-practices
- Hub-spoke topology: https://learn.microsoft.com/azure/architecture/networking/architecture/hub-spoke
- Virtual WAN: https://learn.microsoft.com/azure/virtual-wan/virtual-wan-about
- Private Link: https://learn.microsoft.com/azure/private-link/private-link-overview
- Zero Trust network: https://learn.microsoft.com/security/zero-trust/deploy/networks
- DDoS Protection: https://learn.microsoft.com/azure/ddos-protection/ddos-protection-overview
- Azure Bastion: https://learn.microsoft.com/azure/bastion/bastion-overview
- NSG flow logs: https://learn.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview
