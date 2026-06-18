---
name: azure-ddos-protection
description: "Guidance for Azure DDoS Protection — Network Protection (per-VNet) and IP Protection (per public IP) tiers built on the same always-on Microsoft platform. Covers tier selection vs free Basic infrastructure protection, scope (VNet vs single IP), traffic profiling and mitigation policy auto-tuning, attack analytics and metrics, attack alerts to Sentinel, DDoS Rapid Response engagement, integration with Azure WAF and Front Door, cost-protection guarantee, mitigation reports for compliance, and per-region capacity planning. WHEN: Azure DDoS Protection, DDoS Network Protection, DDoS IP Protection, layer 3/4 DDoS, attack analytics Azure, DDoS rapid response, cost protection DDoS, DDoS metrics, mitigation report, simulate DDoS Azure. DO NOT USE for layer 7 / app-layer attack mitigation alone (use azure-waf), Azure Firewall design (use azure-firewall), or hybrid network DDoS via on-prem appliances."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure DDoS Protection

Azure DDoS Protection sits on the Microsoft global network and absorbs **layer 3/4
volumetric and protocol attacks** before they reach your workloads. The free
**Infrastructure Protection** layer protects Azure as a platform; the paid
**DDoS Protection** plans give you dedicated, profile-tuned mitigation, attack analytics,
post-incident reports, cost protection, and Rapid Response support for your resources.

## When to use
Public-facing workloads with a non-trivial cost-of-downtime: e-commerce, regulated
financial APIs, multiplayer gaming, public-sector services, internet-facing AI APIs,
streaming, and any campaign exposed to politically or commercially motivated DDoS.

**Do not use this skill** for application-layer (HTTP) attack mitigation alone
(`azure-waf`), Azure Firewall design (`azure-firewall`), or third-party DDoS appliance
patterns.

## Tier selection

| Tier | Scope | Best for |
|---|---|---|
| **Infrastructure Protection** | Free, platform-level, no SLA, no analytics | Default for every workload |
| **DDoS Network Protection** | Per VNet, all public IPs in scope | Multi-IP workloads, large estates |
| **DDoS IP Protection** | Per public IP, granular | Small estates, cost-conscious, specific high-risk IP |

Pricing model differs: Network Protection is a flat fee per plan covering many resources;
IP Protection is per-IP. Estate size flips the economics — model both before choosing.

## Approach

1. **Decide tier per workload.**
   - 50+ public IPs across multiple VNets → Network Protection on the relevant VNets.
   - Specific internet-facing app on a single Standard public IP → IP Protection.
   - Mixed → both, scoped appropriately.

2. **Enable on the VNet (Network Protection)** at deployment time. The platform begins
   **traffic profiling** immediately; it learns normal patterns over ~7 days and
   auto-tunes the per-IP mitigation policy. Mitigation accuracy improves the longer the
   profile runs.

3. **Static thresholds are not a thing**, by design. Mitigation is adaptive. Don't
   architect on the assumption of a fixed Mbps cap.

4. **Configure alerts.** DDoS metrics and alerts are first-class:
   - "Under DDoS attack or not" boolean per public IP.
   - Inbound packets dropped by DDoS Protection.
   - Inbound TCP/UDP packets to be triggered for DDoS.
   Wire to Sentinel via Log Analytics + activity-log alerts.

5. **Simulate before incident.** BreakingPoint Cloud and Red Button are Microsoft-
   approved simulation partners. Simulate quarterly on non-prod public IPs to validate
   mitigation engagement and runbook execution.

6. **Attack analytics + post-incident reports.** During and after an attack, the
   product produces a **mitigation report** with attack vectors, traffic volume, top
   sources, and mitigation actions — useful evidence for board/regulator
   communications.

7. **DDoS Rapid Response (DRR).** Plan on Network Protection includes engagement with
   Microsoft's DDoS response team during active attacks. Pre-stage:
   - DRR contact info in your IR runbook.
   - Customer support contract type that allows DRR (usually Premier/Unified or
     Pro Direct) — verify.
   - Designated owner who is authorized to engage Microsoft.

8. **Cost protection.** A successful DDoS attack can balloon scale-out costs (autoscaled
   App Service, additional bandwidth, CDN egress). Network Protection includes service-
   credit cost protection — file the claim post-incident with the mitigation report.

9. **Combine with WAF and Front Door.** DDoS Protection covers L3/L4. L7 attacks (HTTP
   floods, slow loris, business-logic abuse) need WAF on Front Door / Application
   Gateway in front of your workload. Architect both.

## Guardrails
- **Infrastructure Protection (free) is not nothing, but is not enough for high-value
  public workloads.** No SLA, no analytics, no cost protection.
- **Don't enable Network Protection on a VNet with no internet-facing public IP.** No
  effect, full price.
- **Mitigation needs profile time.** A brand-new public IP enabled minutes before an
  attack benefits less than one with 7+ days of baseline.
- **WAF and DDoS are complementary, not substitutes.** L7 attacks bypass L3/L4
  mitigation entirely.
- **Test in non-prod, never live customer endpoints.** Simulation partners only on
  approved IPs in approved windows.
- **Standard public IP only.** Basic public IPs aren't supported for IP Protection (and
  Basic SKU is being retired).
- **CDN-fronted workloads** are partially shielded by the CDN's own DDoS posture; still
  consider DDoS Protection on the origin.
- **Don't use Azure DDoS as your DR plan.** Mitigation reduces impact; it does not
  guarantee zero impact.

## Common anti-patterns
- **"Free Infrastructure Protection is enough"** — until the first targeted attack,
  then no analytics, no Rapid Response, no cost protection, no audit evidence.
- **"IP Protection on 200 IPs"** — bill larger than Network Protection plan would
  have been. Model the math.
- **"Activated DDoS Protection during the attack"** — profile is empty; less effective.
  Always pre-enable.
- **"Skipped simulation, never tested runbook"** — first real engagement is fumbled.
- **"DRR not pre-arranged"** — incident response wastes 60 minutes finding the right
  Microsoft contract path.
- **"Architected without WAF in front"** — L7 attacks succeed through L3/L4
  mitigation.
- **"Customer support tier doesn't permit DRR"** — surprise during incident.

## Example prompts
- `Plan DDoS Protection coverage for a 6-region public-API estate with 80 public IPs.`
- `Compare Network vs IP Protection cost for a tenant with 25 public IPs in 3 VNets.`
- `Build the DDoS attack runbook including DRR engagement steps and stakeholder comms
  templates.`
- `Quarterly DDoS simulation with BreakingPoint Cloud — scope, success criteria,
  rollback.`
- `Wire DDoS metrics + alerts to Sentinel with detections for sustained mitigation
  events.`
- `Architect Front Door + WAF + DDoS Network Protection for a regulated e-commerce
  workload.`
- `File the cost protection claim after a 14-hour mitigated attack — what evidence and
  process.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/ddos-protection/ddos-protection-overview
- Tier comparison: https://learn.microsoft.com/azure/ddos-protection/ddos-protection-sku-comparison
- Enable Network Protection: https://learn.microsoft.com/azure/ddos-protection/manage-ddos-protection
- Enable IP Protection: https://learn.microsoft.com/azure/ddos-protection/manage-ddos-protection
- Metrics and alerts: https://learn.microsoft.com/azure/ddos-protection/diagnostic-logging
- Simulation testing: https://learn.microsoft.com/azure/ddos-protection/test-through-simulations
- Rapid Response: https://learn.microsoft.com/azure/ddos-protection/ddos-rapid-response
- Cost protection / SLA: https://learn.microsoft.com/azure/ddos-protection/ddos-protection-overview
- Reference architectures: https://learn.microsoft.com/azure/ddos-protection/ddos-protection-reference-architectures
