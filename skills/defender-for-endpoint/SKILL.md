---
name: defender-for-endpoint
description: "Guidance for Microsoft Defender for Endpoint (MDE) — enterprise endpoint security with next-gen AV, EDR, attack surface reduction (ASR), Defender Vulnerability Management, automated investigation and remediation (AIR), and live response. Covers Plan 1 vs Plan 2 selection, onboarding paths (Intune, Configuration Manager, GPO, scripts), ASR rule rollout in audit→block, EDR in block mode, tamper protection, device groups and RBAC, and response actions (isolate, restrict, live response). WHEN: Defender for Endpoint, MDE, MDE onboarding, endpoint EDR, attack surface reduction rules, ASR rules audit mode, next-gen antivirus policy, device isolation, endpoint vulnerability management, EDR block mode, tamper protection, onboard devices to Defender, live response, MDE Plan 1 vs Plan 2, security settings management, MDE for Linux, MDE for macOS, controlled folder access. DO NOT USE for non-endpoint Defender workloads (use defender-xdr for cross-workload, defender-for-cloud-hardening for Azure resources)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Endpoint

Microsoft Defender for Endpoint (MDE) is the enterprise endpoint security platform providing
prevention (next-gen AV, ASR), detection and response (EDR), threat & vulnerability management
(Defender Vulnerability Management), and automated investigation and remediation (AIR). It
feeds the endpoint pillar of Defender XDR.

## When to use
Protecting Windows, macOS, Linux, iOS, and Android endpoints. This is the right skill for
onboarding decisions, policy design, ASR rollout, EDR tuning, and response action scoping.

**Do not use this skill** for cross-workload investigation (`defender-xdr`), Azure resource
hardening (`defender-for-cloud-hardening`), or identity-side detection (`defender-for-identity`).

## Pick the plan and the onboarding path

| If you need... | Plan / SKU | Notes |
|---|---|---|
| Next-gen AV, ASR, web/network protection, manual response | **MDE Plan 1** | Bundled with M365 E3 since 2022 |
| EDR, AIR, advanced hunting, custom detections, Threat & Vuln Management | **MDE Plan 2** | Bundled with M365 E5 / MDE P2 |
| Full vulnerability remediation workflows, browser extension assessments | **Defender Vulnerability Management add-on** | Adds to P2 |
| Server endpoints (Windows / Linux) | **MDE for Servers** via Defender for Cloud | Per-server billing, includes MDE P2 |

| Estate | Preferred onboarding path |
|---|---|
| Cloud-managed Windows (Intune-managed) | **Intune** + Security Settings Management |
| Co-managed (MECM + Intune) | **Configuration Manager** workload slider, then move to Intune |
| AD-joined only, no MDM | **GPO** onboarding script |
| Server (Windows/Linux) | **Defender for Cloud** auto-provisioning |
| macOS / Linux workstations | **Intune** with MDM enrollment |
| Air-gapped / one-off | **Local script** (90-day expiry) |

> **Rule of thumb:** if a device exists in Intune, onboard via Intune Security Settings
> Management - one place to manage AV + ASR + EDR. GPO is the legacy fallback, not the
> default for new builds.

## Approach

1. **Confirm plan + estate inventory** — Inventory devices by OS, management state, and current
   AV. Map to plan/onboarding path table above.
   *Verify: `Get-MpComputerStatus` on a sample Win11 device shows AMServiceEnabled = True;
   Intune shows the device as compliant.*

2. **Enable tamper protection everywhere first** — Before any other policy. Without it,
   attackers (and well-meaning admins) can disable everything else.
   *Verify: device shows tamper protection On in security.microsoft.com → Settings → Endpoints
   → Advanced features.*

3. **Onboard in waves** — 100 pilot devices for 7 days, then a representative wave (1,000 or
   10% of estate), then the rest. Watch the **Device inventory** for stuck devices (Last seen
   > 24h after onboarding).
   *Verify: device count in MDE matches Intune device count within 5%.*

4. **Next-gen AV policy** — Real-time protection on, cloud-delivered protection on (High
   block level for high-risk groups), PUA blocking in audit then block, tamper protection on,
   network protection in block, controlled folder access in audit (then block on user
   workstations only - servers break).
   *Verify: Defender configuration management report shows green on these toggles for the pilot
   group.*

5. **ASR rules - audit, measure, block** — Enable all rules in **audit** for 14 days. Use the
   ASR rules report to see which rules would have blocked what. Move noisy rules to a tighter
   scope (e.g. exclude line-of-business apps), then block the rest.
   *Verify: ASR rules report shows zero blocks for known-good apps in audit; promote to block
   one rule per week.*

6. **EDR in block mode** — Enable even if Defender AV is primary. If a non-Microsoft AV is
   primary, EDR in block mode is **mandatory** - it's the only way EDR detections result in
   automatic remediation.
   *Verify: Device health page shows EDR block mode = On.*

7. **Device groups & RBAC** — Build device groups by risk tier (workstation, server, tier-0
   admin workstation, kiosk). Scope response actions (isolate, live response) per group.
   Tier-0 admin devices = tightest policy, fewest analysts with response rights.

8. **Vulnerability management** — Prioritise by **exposure score** + **threat insight**, not
   raw CVE count. Push remediation tasks to Intune via the integration.

9. **AIR** — Configure remediation level per device group. Workstations = Full, servers =
   Semi (require analyst approval). Review pending actions in the Action Center daily.

## Guardrails
- **Tamper protection before anything else.** Without it, every other control is a suggestion.
- **Always pilot ASR rules in audit mode.** Some rules (e.g. *Block Office from creating child
  processes*) break legitimate macro workflows. 14 days minimum in audit.
- **EDR in block mode is mandatory with third-party AV.** Without it, EDR alerts fire but no
  automatic remediation happens.
- **Don't grant Live Response broadly.** It executes arbitrary commands on endpoints. Scope
  via RBAC to a small response team, audit every session.
- **Device groups drive policy and response.** Build them by risk tier, not by department.
- **Don't run dual AV with both active.** Either Defender is primary (recommended) or set
  Defender to passive mode + EDR block mode on.
- **Server onboarding flows through Defender for Cloud.** Don't dual-onboard servers via both
  MDE direct and DfC - causes telemetry duplication.

## Common anti-patterns
- **"Tamper protection off because admins need to manage AV locally"** - Local management is
  the threat model. Centralise via Intune; tamper protection on.
- **"All ASR rules to block on day one"** - Will break Office macros, legitimate scripts, and
  installers. Audit 14 days, tune, then block.
- **"We use third-party AV and skipped EDR block mode"** - Detections fire but nothing
  happens. Enable EDR block mode.
- **"Live Response for all SOC analysts"** - Live Response = remote shell. Tier-3 only, with
  audit review.
- **"Onboarded servers via Intune script instead of Defender for Cloud"** - Loses Defender for
  Servers billing/management integration. Always DfC for server onboarding.
- **"Vuln management ranked by CVE count"** - 5,000 informational CVEs hide the 3 exploited
  ones. Sort by exposure score + active threat campaigns.
- **"Controlled folder access on servers"** - Breaks application file writes. CFA is for user
  workstations only.

## Example prompts
- `Plan MDE Plan 1 vs Plan 2 for a 10,000-user M365 E3 tenant - what do we lose without P2?`
- `Onboard 5,000 Intune-managed Windows 11 devices to MDE with security settings management.`
- `Roll out ASR rules safely - audit first, then block. Which rules are safe to block immediately?`
- `Enable EDR in block mode with CrowdStrike as primary AV.`
- `Design MDE device groups for a 3-tier estate: workstations, servers, tier-0 admin devices.`
- `Configure AIR remediation levels - workstations vs servers.`
- `Prioritise vulnerability remediation using exposure score and threat insight.`
- `Scope Live Response to a 5-person response team with audit logging.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-endpoint/microsoft-defender-endpoint
- MDE Plan 1 overview: https://learn.microsoft.com/defender-endpoint/defender-endpoint-plan-1
- Onboarding: https://learn.microsoft.com/defender-endpoint/onboarding
- ASR rules: https://learn.microsoft.com/defender-endpoint/attack-surface-reduction
- ASR rules reference: https://learn.microsoft.com/defender-endpoint/attack-surface-reduction-rules-reference
- EDR in block mode: https://learn.microsoft.com/defender-endpoint/edr-in-block-mode
- Tamper protection: https://learn.microsoft.com/defender-endpoint/prevent-changes-to-security-settings-with-tamper-protection
- Device groups: https://learn.microsoft.com/defender-endpoint/machine-groups
- Vulnerability management: https://learn.microsoft.com/defender-vulnerability-management/defender-vulnerability-management
- Live response: https://learn.microsoft.com/defender-endpoint/live-response
