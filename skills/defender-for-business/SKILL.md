---
name: defender-for-business
description: "Guidance for Microsoft Defender for Business (MDB) — the SMB-segment endpoint security product (≤300 employees), bundled with Microsoft 365 Business Premium and available as a standalone SKU. Covers what's included vs MDE Plan 1/2 (next-gen AV, EDR with simplified configuration, ASR, automated investigation and response, vulnerability management, web content filtering, attack surface reduction, mobile threat defense add-on), wizard-driven onboarding, server add-on for SMB servers, the simplified portal experience vs full Defender XDR, transition path to MDE P2 / E5 as the org grows, and integration with Microsoft 365 Lighthouse for MSP delivery. WHEN: Defender for Business, MDB, SMB endpoint security, M365 Business Premium security, MDB server add-on, simplified EDR small business, MSP Defender for Business, M365 Lighthouse Defender, SMB upgrade to MDE Plan 2. DO NOT USE for enterprise EDR (use defender-for-endpoint), Defender XDR cross-product investigation (use defender-xdr), or Defender for Servers / Cloud (use defender-for-servers)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Business

Defender for Business (MDB) is endpoint security packaged for the **small-and-medium-
business (SMB) segment** — up to 300 employees. It includes most of MDE Plan 2's protective
power (next-gen AV, EDR, ASR, automated investigation, vulnerability management) with a
**simplified, wizard-driven configuration** so a small IT team or an MSP can deploy and
operate it without a dedicated SOC.

It's bundled with **Microsoft 365 Business Premium** and available as a standalone SKU.
For MSPs, it's delivered through **Microsoft 365 Lighthouse** for multi-tenant management.

## When to use
You're an SMB up to ~300 employees, or an MSP delivering security to SMB customers, and
you need real endpoint protection without an enterprise SOC budget.

**Do not use this skill** for enterprise EDR (`defender-for-endpoint`), Defender XDR
cross-product investigation (`defender-xdr`), or Azure server protection
(`defender-for-servers`).

## What's in MDB

| Capability | MDB | MDE P1 | MDE P2 |
|---|---|---|---|
| Next-gen AV | ✅ | ✅ | ✅ |
| Attack surface reduction | ✅ | ✅ | ✅ |
| Web content filtering | ✅ | ✅ | ✅ |
| EDR | ✅ (simplified) | — | ✅ |
| Automated investigation & remediation (AIR) | ✅ | — | ✅ |
| Vulnerability management | ✅ (subset) | — | ✅ |
| Threat intel & advanced hunting (Defender XDR) | Limited | — | ✅ |
| Mobile threat defense (iOS/Android) | Add-on / via Intune | — | Yes |
| Server protection | **MDB Servers** add-on (≤60 servers) | via DfC | via DfC |

> **Rule of thumb:** MDB stops where you need a SOC analyst doing advanced hunting in
> raw tables. At ~300 users / multi-site / regulated, plan migration to MDE P2 + E5.

## Approach

1. **License path.** Most SMBs get MDB via **Microsoft 365 Business Premium** —
   bundled with Entra P1, Intune, and DLP basics. Check seat count: MDB is hard-capped
   at 300 users; once you exceed, you must move to enterprise SKUs.

2. **Onboard via the simplified setup wizard** in security.microsoft.com → Assets →
   Devices. Three default device groups: workstations, mobile, servers (servers via
   add-on). Wizard pre-configures sensible defaults for AV, ASR, EDR.

3. **Default policies are usable as shipped, but tune two things:**
   - **ASR rules** — review the audit-mode hits in the first 14 days; promote rules
     to block one at a time.
   - **Web content filtering** — turn on the categories that match your use (block
     gambling, adult, illegal). Don't be aggressive on day one.

4. **AIR remediation level.** Default is *Semi* (require approval). For workstations,
   move to *Full* once the team has confidence. Servers stay *Semi*.

5. **Vulnerability management.** Surfaces top exposures and pushes patch tasks. Pair
   with Intune patch management (where licensed) to actually deploy.

6. **Mobile devices.** MDB on iOS and Android is delivered via the Defender app
   (Intune-managed deployment, recommended). Provides web protection, network
   protection, and app risk detection. Real-time AV on Android.

7. **Servers add-on.** *MDB Servers* protects up to 60 Windows or Linux servers per
   tenant — adequate for SMB but not enterprise. Onboard via the same simplified
   model. Once you exceed 60 or need DfC posture/JIT/FIM, switch to Defender for
   Servers (`defender-for-servers`).

8. **MSP / multi-tenant delivery.** Microsoft 365 Lighthouse aggregates MDB across
   customer tenants for an MSP:
   - Cross-tenant device inventory and threat dashboard.
   - Baseline policy templates pushed to multiple tenants.
   - Multi-tenant alert triage.
   Pair with delegated admin (GDAP) — never DAP — for secure access.

9. **Transition path to enterprise.** Trigger criteria for moving to MDE P2 / E5:
   - Crossing 300 users.
   - Regulated industry needing advanced hunting / KQL / 30+ day raw telemetry.
   - Multi-site SOC operation.
   - Need for Sentinel integration with rich Defender XDR data.
   Migration is a license/configuration change, not a re-deployment — devices stay
   onboarded.

## Guardrails
- **300-user cap is enforced.** Don't architect MDB into a tenant trending toward
  enterprise scale; plan E5 / MDE P2 in advance.
- **Don't turn ASR rules to block on day one.** Same as enterprise — audit, tune,
  block.
- **AIR Full mode is fine for workstations, not servers** without approval — server
  AIR autoremediation can take down apps.
- **Mobile MDB needs Intune for proper rollout.** Without MDM, you rely on user
  self-install; coverage is patchy.
- **Servers add-on is capped at 60.** Past that, MDB Servers isn't sized for you;
  transition.
- **Lighthouse + MDB for MSPs requires GDAP**, not the legacy DAP — partner relationship
  must be migrated.
- **Advanced hunting is limited in MDB.** If your IR practice depends on KQL across raw
  Defender tables, you need MDE P2.
- **Web content filtering is not a SWG.** It's category-based, not full inspection.
  For real SWG, look at `entra-global-secure-access` Internet Access.
- **Don't dual-onboard MDB and a third-party AV in active mode.** Set the third-party
  to passive + EDR block mode (same rule as enterprise).

## Common anti-patterns
- **"Stayed on MDB at 350 users"** — license violation, missing capabilities.
- **"All ASR rules block on day one"** — Office macro and installer breakage.
- **"AIR Full on servers"** — automatic isolation of an LOB app server during a false
  positive.
- **"Mobile rolled out without Intune"** — half the fleet unprotected.
- **"MSP using DAP for tenant access"** — should be GDAP; security and audit issue.
- **"Treated MDB as a permanent solution despite scaling beyond 300"** — find out
  during audit that the SKU's capped.
- **"Skipped vulnerability management because 'we patch on Patch Tuesday'"** — vuln
  prioritization makes Patch Tuesday actually-prioritized.
- **"Configured advanced policies via Defender XDR portal expecting MDE P2 features"**
  — features simply aren't available; UI doesn't always make this obvious.

## Example prompts
- `Onboard a 120-user professional services firm to Defender for Business via M365
  Business Premium — wizard, ASR rollout, AIR, vuln management.`
- `Plan migration from MDB to MDE Plan 2 + E5 for an SMB approaching 300 users with
  multi-site operations.`
- `Deploy MDB to 60 servers via the servers add-on; identify gaps requiring Defender
  for Servers later.`
- `MSP delivery model: 50 SMB customers, baseline MDB policy + Lighthouse multi-
  tenant operation with GDAP.`
- `Mobile defense rollout: Defender for iOS and Android via Intune for 200 users.`
- `Web content filtering categories: build a starter blocklist that won't break
  business use.`
- `Compare MDB capabilities to MDE P1 for a customer evaluating Microsoft 365 Business
  Premium vs Microsoft 365 E3 + MDE P1.`

## Microsoft Learn
- MDB overview: https://learn.microsoft.com/defender-business/mdb-overview
- MDB vs MDE Plans: https://learn.microsoft.com/defender-business/mdb-overview
- Set up MDB: https://learn.microsoft.com/defender-business/mdb-setup-configuration
- Default policies and settings: https://learn.microsoft.com/defender-business/mdb-policy-order
- Servers add-on: https://learn.microsoft.com/defender-business/mdb-onboard-devices
- Mobile threat defense: https://learn.microsoft.com/defender-business/mdb-mtd
- Vulnerability management: https://learn.microsoft.com/defender-business/mdb-view-tvm-dashboard
- Microsoft 365 Lighthouse: https://learn.microsoft.com/microsoft-365/lighthouse/m365-lighthouse-overview
- GDAP: https://learn.microsoft.com/partner-center/gdap-introduction
- Microsoft 365 Business Premium: https://learn.microsoft.com/microsoft-365/business-premium/
