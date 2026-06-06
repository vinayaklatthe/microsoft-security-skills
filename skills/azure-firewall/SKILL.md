---
name: azure-firewall
description: "Guidance for Azure Firewall — a managed, cloud-native network firewall for centralized egress/ingress control, with Firewall Policy, threat intelligence, IDPS (Premium), and forced tunneling. Covers SKU selection, rule design, and hub deployment. WHEN: Azure Firewall, network firewall, egress filtering, FQDN filtering, Firewall Policy, IDPS, TLS inspection, forced tunneling, central network control, firewall SKU Premium Standard."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Firewall

Azure Firewall is a managed, highly available, cloud-native stateful **network firewall** used to
centrally govern and log traffic — typically deployed in the **hub** of a hub-spoke network.

## When to use
Centralising egress (and east-west/ingress) traffic control and inspection across an Azure
network estate.

## Approach
1. **Choose a SKU** — **Standard** (L3-L7 filtering, FQDN tags, threat intelligence) vs
   **Premium** (adds **TLS inspection**, **IDPS**, URL filtering, web categories) for regulated/
   high-assurance needs. **Basic** suits small/SMB.
2. **Use Firewall Policy** — Manage rules centrally with **Azure Firewall Policy** (hierarchical:
   parent/base policy + child policies) for consistency across firewalls/regions.
3. **Rule design** — Order rule collection groups; use **application rules** (FQDN/URL),
   **network rules** (IP/port/protocol), and **DNAT** for inbound. Default-deny; allow least.
4. **Threat intel & IDPS** — Enable threat-intelligence-based filtering (alert/deny); enable IDPS
   in Premium for signature-based detection/prevention.
5. **Routing** — Force spoke egress through the firewall with **UDRs**; consider forced tunneling
   to on-prem where required.
6. **Monitor** — Send logs to Log Analytics/Sentinel; use the structured firewall logs/workbook.

## Guardrails
- Azure Firewall complements, not replaces, NSGs (subnet/NIC microsegmentation) and WAF (L7 web).
- TLS inspection (Premium) requires certificate/PKI planning.
- Plan capacity and availability zones for resilient hub deployments.

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/firewall/overview
- Firewall Policy: https://learn.microsoft.com/azure/firewall/policy-rule-sets
- Premium features (IDPS/TLS): https://learn.microsoft.com/azure/firewall/premium-features
- Deploy in hub-spoke: https://learn.microsoft.com/azure/firewall/protect-azure-virtual-desktop
