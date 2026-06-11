---
name: azure-firewall
description: "Guidance for Azure Firewall — managed cloud-native L3-L7 stateful network firewall for centralised egress, east-west, and ingress control. Covers SKU choice (Basic vs Standard vs Premium), Firewall Policy hierarchy, application/network/DNAT rules, threat intelligence and IDPS, TLS inspection, hub-spoke deployment with UDRs, and forced tunneling. WHEN: Azure Firewall, network firewall, egress filtering, FQDN filtering, Firewall Policy, IDPS, TLS inspection, forced tunneling, central network control, firewall SKU Premium Standard Basic, hub spoke firewall, UDR through firewall, DNAT inbound. DO NOT USE for L7 web application protection (use Front Door / Application Gateway WAF), subnet microsegmentation (use NSGs in azure-network-security-design), or third-party NVA design."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Firewall

Azure Firewall is a managed, highly available, cloud-native stateful **network firewall** used
to centrally govern and log traffic, typically deployed in the **hub** of a hub-spoke network.
It is the choke point that enforces a default-deny egress posture across an Azure estate.

## When to use
Centralising egress (and east-west / ingress) traffic control and inspection across an Azure
network estate. Use this skill to pick the SKU, design rules, and deploy in the hub.

**Do not use this skill** for L7 web app protection (WAF on Front Door / App Gateway), subnet
microsegmentation (NSGs - see `azure-network-security-design`), or third-party NVA design.

## Pick the SKU by capability need

| Requirement | SKU | Notes |
|---|---|---|
| SMB / dev / small estate, < 250 Mbps | **Basic** | Cost-optimised; no threat intel deny |
| Standard egress filtering, FQDN, threat intel | **Standard** | Default for most enterprise hubs |
| TLS inspection, IDPS signatures, URL filtering, web categories | **Premium** | Regulated / high-assurance |
| Multi-hub global deployment | **Premium + Firewall Manager + Virtual WAN** | Centralised policy at scale |

> **Rule of thumb:** Standard SKU is right for most enterprise hubs in 2026. Move to Premium
> only when you have a concrete TLS-inspection or IDPS requirement - the certificate /
> PKI overhead of TLS inspection is real and breaks some apps. Basic only for SMB or sandbox.

## Approach

1. **Deploy in the hub** — Single firewall per region in the hub VNet (with at least two
   availability zones for resilience). All spokes peer to the hub; egress and east-west
   traffic flows through.
   *Verify: firewall has public IP for egress, deployed across ≥ 2 AZs, capacity baseline
   established.*

2. **Use Firewall Policy (not classic rules)** — Author rules in **Azure Firewall Policy** with
   **hierarchical** parent + child policies (e.g. parent = enterprise baseline, child =
   region-specific). Don't author rules per firewall.
   *Verify: policy hierarchy mapped; one base policy reused across regional firewalls.*

3. **Default-deny + structured rule collections** — Order: **DNAT** (inbound) → **Network
   rules** (IP/port/protocol) → **Application rules** (FQDN/URL). Inside each collection group,
   priority controls evaluation. Default action = deny.
   *Verify: a probe from a spoke to an unallowed FQDN is logged as deny.*

4. **Application rules with FQDN tags** — Use built-in **FQDN tags** (WindowsUpdate,
   AzureKubernetesService, Office365) for Microsoft service egress instead of hand-curated
   lists. Custom FQDNs for third-party SaaS.

5. **Force spoke egress through firewall via UDRs** — User-defined routes on spoke subnets:
   `0.0.0.0/0` next hop = firewall private IP. Without UDRs, traffic bypasses the firewall.
   *Verify: `Get-AzEffectiveRouteTable` on a spoke NIC shows next hop = firewall.*

6. **Enable threat intel + IDPS (Premium)** — Threat-intel-based filtering in **Deny** mode
   for known-bad IPs / FQDNs. Premium: enable **IDPS** in Alert+Deny for high-severity
   signatures; tune false positives.

7. **Stream logs and monitor capacity** — Send to Log Analytics / Sentinel using **structured
   firewall logs**. Use the workbook for top denied flows, capacity / throughput.
   *Verify: firewall workbook populated; alert on > 80% throughput sustained for 15 minutes.*

## Guardrails
- **Azure Firewall complements, not replaces, NSGs (subnet/NIC microsegmentation) and WAF
  (L7 web).** Layered defence; each does a different job.
- **TLS inspection (Premium) requires certificate / PKI planning.** Internal CA cert chain
  trusted on clients; some apps (cert-pinning, mTLS) break under inspection. Pilot first.
- **Plan capacity and availability zones for resilient hub deployments.** Single-zone =
  single zone outage takes the hub down.
- **UDRs are the enforcement.** Without `0.0.0.0/0 → firewall` on spokes, traffic doesn't go
  through. Audit UDRs as part of landing zone.
- **Firewall Policy is hierarchical for a reason.** Don't author per-firewall rules at scale -
  they drift.
- **Don't enable Premium features speculatively.** Cost is meaningfully higher; only enable
  when there's a use case.

## Common anti-patterns
- **"Allow `*` for outbound to start"** - Defeats the firewall. Default-deny + named FQDN
  rules from day one.
- **"Premium SKU for everyone"** - Cost without value if no IDPS / TLS inspection in scope.
- **"TLS inspection on day one for all traffic"** - Breaks half the apps. Pilot per workload.
- **"No UDR - we assume traffic goes through the firewall"** - It doesn't. Routes are the
  enforcement.
- **"One single firewall, single zone"** - AZ outage = hub down. Multi-AZ from day one.
- **"Don't log - it's noisy"** - First incident, no forensics. Structured logs + Sentinel
  always.

## Example prompts
- `Design Azure Firewall egress filtering with FQDN and application rules in a hub-spoke topology.`
- `When should I choose Firewall Premium with IDPS and TLS inspection?`
- `Set up Firewall Policy hierarchy and force spoke egress through UDRs.`
- `How do I protect Azure Virtual Desktop traffic with Azure Firewall?`
- `Build a Sentinel workbook for top denied flows from Azure Firewall logs.`
- `Plan capacity, availability zones, and DNS proxy for the hub firewall.`

## Microsoft Learn
- Azure Firewall overview: https://learn.microsoft.com/azure/firewall/overview
- Firewall Policy: https://learn.microsoft.com/azure/firewall/policy-rule-sets
- Premium features (IDPS / TLS): https://learn.microsoft.com/azure/firewall/premium-features
- Hub-spoke + firewall: https://learn.microsoft.com/azure/architecture/networking/architecture/hub-spoke
- FQDN tags: https://learn.microsoft.com/azure/firewall/fqdn-tags
- Threat intelligence: https://learn.microsoft.com/azure/firewall/threat-intel
- Structured logs: https://learn.microsoft.com/azure/firewall/firewall-structured-logs
- Forced tunneling: https://learn.microsoft.com/azure/firewall/forced-tunneling
