---
name: defender-easm
description: "Guidance for Microsoft Defender External Attack Surface Management (Defender EASM) — discovers and inventories an organization's internet-facing assets (domains, hosts, IPs, SSL certs, ASNs, web pages, contacts) from the outside-in. Covers seed-based discovery, attack surface insights (CVEs, expiring certs, deprecated tech, unsanctioned cloud), labels and groups, integration with Defender for Cloud (CSPM), Defender XDR, and Sentinel, and pricing model (per asset). WHEN: Defender EASM, external attack surface management, internet-facing inventory, shadow IT discovery, expired SSL discovery, exposed RDP discovery, unknown subdomain, attack surface insights, seed-based discovery, outside-in scanning, third-party asset risk, M&A asset discovery. DO NOT USE for internal asset discovery (use defender-for-cloud-hardening / Defender XDR), endpoint vuln scan (use defender-for-endpoint MDVM), or Sentinel hunting alone."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender EASM

Defender External Attack Surface Management (EASM) builds and maintains a continuous,
**outside-in inventory** of an organization's internet-facing footprint and surfaces risks
on those assets — expired SSL certs, exposed admin interfaces, end-of-life web tech, and
known CVEs — without any agent or credentials.

## When to use
- You don't have a complete list of internet-facing assets (most orgs don't).
- M&A: rapid discovery of an acquired company's internet footprint before integration.
- Subsidiary / shadow IT discovery — assets registered to anyone, deployed anywhere.
- Continuous monitoring of certificate expiration, exposed services, deprecated software.

**Do not use this skill** for internal asset posture (`defender-for-cloud-hardening`),
endpoint vulnerability management (`defender-for-endpoint`), or generic SOC hunting
(`sentinel-detection-engineering`).

## How discovery works

EASM starts from **seeds** — known domains, IPs, ASNs, contacts (WHOIS), or organization
names — and walks outward through DNS, WHOIS, certificate transparency logs, ASN data, and
web crawling to discover related assets. Findings are placed in:

| State | Meaning |
|---|---|
| **Approved Inventory** | Confirmed yours; counts toward pricing |
| **Candidate** | Discovered but unconfirmed; review and approve/dismiss |
| **Dependency** | Used by your assets but not owned (CDN, third-party API) |
| **Monitor Only** | Tracked but not yours (e.g., a partner) |

> **Rule of thumb:** Start with 5–10 high-confidence seeds. Trust the discovery chain;
> don't try to add every domain manually — you'll miss the unknown unknowns.

## Approach

1. **Seed selection.** Start with primary brand domains, top-2 ASN numbers, and a few key
   email-domain WHOIS contacts. Avoid generic CDN domains as seeds (massive false
   positives).

2. **Initial discovery run** (24–72 hours). Review **Candidates** weekly for the first
   month. Approve real ones; dismiss false positives with a reason (used to refine
   discovery).

3. **Label and group.** Tag assets by business unit, region, criticality. Without labels,
   risk views are unactionable.

4. **Attack surface insights — fix high-impact first.**
   Priority order:
   1. **Exposed sensitive services** (RDP/3389, SMB/445, database ports) on internet IPs.
   2. **Expired or expiring SSL certs** within 30 days.
   3. **End-of-life software** (Apache 2.2, IIS 7, OpenSSL 1.0).
   4. **High/critical CVEs** with known exploits on identified versions.
   5. **Unsanctioned cloud** — assets in a CSP not in your approved list.

5. **Integrate with the rest of the portfolio.**
   - **Defender for Cloud (CSPM)** — EASM-discovered Azure assets correlate to Azure
     resources for full inside+outside view.
   - **Defender XDR** — exposed assets appear under attack-surface insights.
   - **Sentinel** — pull EASM data via REST API into a watchlist for hunting (e.g.,
     "alert if outbound C2 destination matches an EASM-known dependency owned by us").

6. **M&A workflow.** Add target-company seeds during diligence; export the candidate list
   as a tracked risk register for integration. Don't approve into inventory until close.

7. **Re-baseline quarterly.** Brand consolidation, decommissioned subs, divested BUs all
   change the seed list.

## Guardrails
- **Approve carefully — every approval = billed asset.** Treat dismiss-with-reason as
  important as approve; refines future discovery and controls cost.
- **Pricing is per asset/month** with a generous monthly free tier; understand the meter
  before mass-approving CDN dependencies.
- **EASM is detection, not response.** It tells you the exposed RDP exists; closing the
  port is a network/firewall change you must make elsewhere.
- **Do not seed competitor domains "to compare."** Discovery walks aggressively; you'll
  create attribution noise.
- **Don't expect zero-day vuln detection.** EASM matches versions to known CVEs from
  public banners — a stripped banner hides risk. Pair with internal vuln scanning.
- **WHOIS data quality varies by registrar / privacy-shielding.** Some assets won't
  attribute via WHOIS — accept some manual approval workload.
- **Re-discovery cadence is days, not minutes.** Don't expect EASM to catch a 1-hour
  exposure window; that's runtime monitoring's job.

## Common anti-patterns
- **"Approved every candidate to be safe"** — bill explosion and noise. Approve only
  yours; dismiss the rest.
- **"Seeds = every domain we've ever owned, including divested ones"** — divested assets
  show up as attack surface forever. Re-baseline.
- **"Used EASM as the only vuln scanner"** — banner-based, no auth, misses internal.
  Combine with MDVM/MDE.
- **"Skipped labelling, dashboards became unusable at 10K assets"** — label on day 1.
- **"Treated EASM findings as alerts to triage in the SOC queue"** — they're posture,
  not incidents. Route to asset-owner remediation, not L1 triage.
- **"Used internal asset names as seeds"** — they don't resolve externally; no discovery.

## Example prompts
- `Set up Defender EASM for a 3-brand global enterprise — seed strategy and labels.`
- `Run an EASM discovery for an acquisition target and produce a 30-day risk register.`
- `Surface expiring SSL certs in the next 30 days across approved inventory and assign
  to asset owners.`
- `Find exposed RDP/SSH on internet-facing assets and route findings to the network team.`
- `Integrate EASM data into Sentinel as a watchlist for hunting outbound C2 to owned
  dependencies.`
- `Identify unsanctioned cloud usage (assets in clouds outside the approved list).`
- `Estimate monthly cost for a 50,000-asset external footprint.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/external-attack-surface-management/
- Discovery and seeds: https://learn.microsoft.com/azure/external-attack-surface-management/
- Inventory states: https://learn.microsoft.com/azure/external-attack-surface-management/understanding-inventory-assets
- Attack surface insights: https://learn.microsoft.com/azure/external-attack-surface-management/understanding-dashboards
- Labels: https://learn.microsoft.com/azure/external-attack-surface-management/labeling-inventory-assets
- Defender XDR integration: https://learn.microsoft.com/azure/external-attack-surface-management/
- Pricing: https://azure.microsoft.com/pricing/details/defender-external-attack-surface-management/
