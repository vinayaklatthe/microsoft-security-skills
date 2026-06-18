---
name: defender-tvm
description: "Guidance for Microsoft Defender Threat Intelligence (Defender TI) and Microsoft Defender Vulnerability Management (MDVM) — the threat-and-vulnerability layer of Defender XDR. Covers MDVM exposure score, CVE prioritization with threat insights and active campaigns, security baselines (CIS/STIG), browser-extension and certificate inventory, network share assessment, hardware/firmware inventory, security recommendations and remediation tasks (Intune integration), and Defender TI for adversary-tracked indicators, intel profiles, infrastructure pivoting, and MDTI APIs. WHEN: Defender Vulnerability Management, MDVM, MDVM add-on, exposure score, threat-aware vulnerability prioritization, CIS benchmark CVEs, security baselines assessment, browser extension inventory, firmware vuln, Microsoft Defender Threat Intelligence, MDTI, intel profiles, threat actor tracking, IOC pivoting, MDTI API, threat hunting with intel. DO NOT USE for endpoint EDR config (use defender-for-endpoint), Sentinel detections (use sentinel-detection-engineering), or external asset discovery (use defender-easm)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender TI & Vulnerability Management

This skill covers two complementary capabilities:

- **Microsoft Defender Vulnerability Management (MDVM)** — risk-based vulnerability
  management for endpoints (Windows, macOS, Linux, mobile), firmware, browser extensions,
  certificates, and security baselines.
- **Microsoft Defender Threat Intelligence (Defender TI / MDTI)** — Microsoft's
  finished-intel and raw-IOC product for adversary tracking, infrastructure pivoting, and
  threat hunting enrichment.

Both feed Defender XDR and Sentinel.

## When to use
- Prioritizing patching/remediation across a large endpoint estate.
- Measuring exposure score and security baseline drift.
- Hunting and responding to threats with adversary intel and infrastructure data.
- Enriching SIEM alerts with intel profiles and indicator context.

**Do not use this skill** for endpoint policy/onboarding (`defender-for-endpoint`), SIEM
detection rules (`sentinel-detection-engineering`), or outside-in attack surface
(`defender-easm`).

## MDVM — what's in core MDE Plan 2 vs the add-on

| Capability | MDE Plan 2 | MDVM Add-on |
|---|---|---|
| CVE-based vulnerability inventory | ✅ | ✅ |
| Exposure score, recommendations | ✅ | ✅ |
| Threat-aware prioritization | ✅ | ✅ |
| Security baselines assessment (CIS, STIG) | — | ✅ |
| Browser extension inventory | — | ✅ |
| Digital certificate inventory | — | ✅ |
| Network share configuration assessment | — | ✅ |
| Hardware & firmware inventory | — | ✅ |
| Block vulnerable applications | — | ✅ |
| Authenticated scan for unmanaged Windows | — | ✅ |

> **Rule of thumb:** If you're already on MDE P2 and your audit team asks for CIS-aligned
> evidence, you need the **MDVM add-on**.

## Approach

### MDVM workflow

1. **Triage by exposure score, not CVE count.** Exposure score weights
   exploitability + asset criticality + active threat campaigns. A 5,000-CVE backlog
   sorted by exposure becomes a 50-task action list.

2. **Use threat insights filters.** Microsoft tags CVEs with: *Public Exploit*,
   *Verified by Microsoft*, *Active Threat Campaign*, *Exploit Available in Kit*. Patch
   Active Threat Campaign first, regardless of CVSS.

3. **Wire remediation to Intune.** "Create remediation request" pushes a task to Intune
   admin queue with the affected device list — the patch lifecycle stays in one place.

4. **Security baselines** (Plan 2 add-on). Pick CIS or STIG, scope to a device group,
   review compliance per setting, prioritize the *security-impacting* settings.

5. **Block vulnerable apps** (add-on). Use sparingly: blocks Adobe Reader 21.x,
   Chrome <120, etc. across the estate. Pilot on a small group; some users have
   legitimate version pins.

6. **Cadence.** Weekly review of top-10 exposure-reducing actions; monthly executive
   exposure-score trend; quarterly baseline drift report.

### Defender TI workflow

1. **Intel profiles** — track named adversaries (e.g., Storm-####), threat tools, CVEs,
   campaigns. Subscribe relevant ones; updates surface in Defender XDR.

2. **Infrastructure pivoting.** Given an indicator (IP, domain, hash), Defender TI shows
   pDNS, WHOIS history, certificate associations, related infrastructure — pivot to find
   adversary infrastructure your SIEM hasn't seen yet.

3. **Bring intel into hunting.**
   - Defender XDR advanced hunting: indicators are first-class joinable entities.
   - Sentinel: connect MDTI via the **Threat Intelligence Premium** data connector;
     `ThreatIntelligenceIndicator` and articles populate.

4. **MDTI API for automation.** Pull articles/indicators into a SOAR playbook for
   auto-enrichment of incidents.

5. **Free vs Premium.** Defender TI portal has a free tier (limited articles,
   pivots/day); Premium unlocks unlimited pivots, full intel-profile catalogue, and API
   throughput. Most enterprise SOC use needs Premium.

## Guardrails
- **Don't drown in CVE counts.** Exposure score + threat insight is the actionable view.
  Counting CVEs is a vanity metric.
- **MDVM remediation needs an owner.** Surfacing 200 recommendations in a dashboard with
  no Intune integration / patch owner produces no patches.
- **Block-vulnerable-apps is invasive.** Pilot. Communicate. Some apps must be pinned for
  business reasons.
- **Security baselines are a journey.** 100% CIS compliance is rarely achievable or
  desirable; pick the security-impacting subset.
- **Intel without context is noise.** Don't ingest every MDTI indicator into a Sentinel
  watchlist as a "match-and-alert" — match-rate × low fidelity = alert fatigue.
- **Confirm licensing.** MDTI Premium and the MDVM add-on are separately licensed;
  customers often think they're included in M365 E5 — they aren't.
- **Scan results lag** by hours; don't expect minute-by-minute vuln status.

## Common anti-patterns
- **"Patched 1,000 medium CVEs while a critical exploited CVE sat for 60 days"** — sort
  by threat campaign, not CVSS bucket.
- **"Bought MDVM add-on for the exposure score we already had in MDE P2"** — overlap.
  Map features before buying.
- **"All MDTI indicators auto-blocked at the firewall"** — false-positive blast.
  Pivot/validate first.
- **"Security baseline 'Compliance' score treated as security score"** — they're not the
  same; many baseline settings are operational hardening, some are not security-critical.
- **"Intel profile subscriptions = no triage"** — articles need analyst triage to
  translate to detections/blocks.
- **"Authenticated scan on every unmanaged Windows host without scoping"** — generates
  service-account auth events at scale; coordinate with identity team.

## Example prompts
- `Top 10 actions to reduce our exposure score by 20% this quarter.`
- `Patch prioritization runbook: how to use threat insights to triage 8,000 open CVEs.`
- `Roll out CIS Windows baseline assessment across 30,000 endpoints.`
- `Wire MDVM remediation requests to Intune and an ITSM ticket queue.`
- `Pivot from a suspicious domain to related adversary infrastructure using MDTI.`
- `Connect MDTI Premium to Sentinel and build a hunting workbook.`
- `Pilot block-vulnerable-apps for outdated Java runtimes on dev machines.`
- `Build a quarterly executive exposure-score and intel-profile briefing.`

## Microsoft Learn
- MDVM overview: https://learn.microsoft.com/defender-vulnerability-management/defender-vulnerability-management
- MDVM capabilities by SKU: https://learn.microsoft.com/defender-vulnerability-management/defender-vulnerability-management-capabilities
- Exposure score: https://learn.microsoft.com/defender-vulnerability-management/tvm-exposure-score
- Threat insights & prioritization: https://learn.microsoft.com/defender-vulnerability-management/tvm-weaknesses
- Security baselines assessment: https://learn.microsoft.com/defender-vulnerability-management/tvm-security-baselines
- Block vulnerable apps: https://learn.microsoft.com/defender-vulnerability-management/tvm-block-vuln-apps
- Defender TI overview: https://learn.microsoft.com/defender/threat-intelligence/what-is-microsoft-defender-threat-intelligence-defender-ti
- Intel profiles: https://learn.microsoft.com/defender/threat-intelligence/using-tags
- MDTI in Sentinel: https://learn.microsoft.com/azure/sentinel/understand-threat-intelligence
