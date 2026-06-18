---
name: windows-11-security-baseline
description: "Guidance for the Windows 11 enterprise security baseline — Microsoft's recommended security settings deployed via Intune (Settings catalog / security baselines) or GPO. Covers core hardware-rooted controls (TPM 2.0, Secure Boot, virtualization-based security / VBS, Hypervisor-Protected Code Integrity / HVCI, Memory Integrity, Credential Guard, Local Security Authority protection), Windows LAPS (Microsoft's modern local admin password solution, replacement for legacy LAPS), Smart App Control, Personal Data Encryption (PDE), Windows Hello for Business deployment, controlled folder access, exploit protection, BitLocker baseline, app control with WDAC, removable storage controls, and integration with Intune compliance and Defender for Endpoint. WHEN: Windows 11 baseline, Windows security baseline, VBS HVCI Memory Integrity, Credential Guard, LSA protection, Windows LAPS, replace legacy LAPS, Smart App Control, WDAC, exploit protection, PDE Windows 11, Intune security baseline. DO NOT USE for endpoint EDR config (use defender-for-endpoint), Intune device management end-to-end (use intune-device-mgmt), or BitLocker design only (use bitlocker-design)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Windows 11 Security Baseline

The Windows 11 security baseline is Microsoft's curated set of recommended security
settings — hundreds of policies vetted for both security value and compatibility. The
baseline is delivered as Intune **security baselines** (settings catalog edition) or GPO
templates from the Microsoft Security Compliance Toolkit.

This skill covers what to enable, the Windows 11-specific controls (LAPS, VBS/HVCI,
Credential Guard, Smart App Control, PDE), and the rollout pattern.

## When to use
Hardening a Windows 11 fleet with Intune (or GPO for legacy estates), with focus on
the hardware-rooted and identity-protection capabilities specific to modern Windows.

**Do not use this skill** for MDE policy authoring (`defender-for-endpoint`), generic
Intune device management (`intune-device-mgmt`), or BitLocker-only design
(`bitlocker-design`).

## Core controls — turn on, in this order

| Control | Why first |
|---|---|
| **Tamper Protection** (MDE) | Without it, all other controls are advisory |
| **Secure Boot + TPM 2.0** | Foundation for VBS/HVCI/Credential Guard; required for Win11 |
| **VBS / HVCI / Memory Integrity** | Kernel-mode code integrity in a hypervisor-isolated container |
| **Credential Guard** | LSASS isolation; defeats most credential-theft tooling |
| **LSA protection** | Prevents non-protected processes from injecting into LSASS |
| **BitLocker** | Disk encryption with TPM-bound startup |
| **Personal Data Encryption (PDE)** | Per-file encryption tied to user sign-in (kicks in after first sign-in) |
| **Windows Hello for Business** | Replaces password-based local sign-in |
| **Windows LAPS (modern)** | Local admin password rotation, Entra-backed |
| **Smart App Control** | Default-deny code execution on clean-installed Win11 |
| **WDAC / App Control for Business** | Mature app-control on managed estate |
| **Controlled Folder Access + Exploit Protection** | ASR-adjacent host hardening |
| **Removable storage policies** | USB exfil control |

## Approach

1. **Apply the Microsoft security baseline via Intune** at the device level. Use the
   Settings catalog version (newer) or the named "Windows 11 security baseline" — the
   newer Settings catalog is the forward-looking option.

2. **Pilot ring methodology.**
   - Ring 0 (50 IT devices): all baseline + new controls.
   - Ring 1 (5% representative): same.
   - Ring 2 (rest): after compatibility validation.
   Don't treat the baseline as a one-shot deployment; some controls (Smart App
   Control, WDAC, PDE) need staged rollout.

3. **Hardware-rooted identity stack.**
   - Verify **TPM 2.0** + **Secure Boot** at provisioning (Autopilot precondition).
   - Enable **VBS** + **HVCI / Memory Integrity** via baseline; expect older drivers
     to break — use the Driver Compatibility tool to find blockers pre-rollout.
   - Enable **Credential Guard** + **LSA Protection** — together they end most
     Mimikatz-style attacks against managed devices.

4. **Windows LAPS** (the new built-in product, separate from legacy LAPS):
   - **Entra-joined**: passwords stored in Entra ID, rotated via Intune policy.
   - **Hybrid / AD-joined**: passwords stored in AD, schema extension required.
   Migrate off legacy LAPS (deprecated). Cap password age 30 days.

5. **Smart App Control** is **only available on clean-installed Win11** (kicks in
   after a learning phase). For existing devices, use **WDAC / App Control for
   Business** — bigger investment but works on upgraded fleets. Phase: audit-only
   policy → enforce per device group → expand.

6. **Personal Data Encryption (PDE)** requires Windows Hello for Business and
   modern auth. Roll out with WHfB; not a replacement for BitLocker — it's
   per-file encryption layered on top.

7. **Windows Hello for Business** as the local sign-in (cert-trust or cloud Kerberos
   trust). Pair with `passkeys-fido2` for the broader phishing-resistant strategy.

8. **Controlled Folder Access + Exploit Protection.** CFA in audit mode for 14 days;
   then enforce on user workstations only (not servers — breaks app file writes).
   Exploit Protection profile from Microsoft baseline applied tenant-wide.

9. **Removable storage controls.** Block writable USB by default for general
   workforce; allowlist by hardware ID for legitimate use cases (designers, AV
   teams). Combine with Defender for Endpoint device control for granular policies.

10. **Compliance + Conditional Access.** Mark devices as compliant only when:
    - BitLocker on, TPM healthy, Secure Boot on, Defender real-time on.
    - Device risk = low (MDE).
    - Baseline applied = Yes (via Intune compliance).
    Tie compliance to Conditional Access for resource access.

## Guardrails
- **Don't enable Memory Integrity / HVCI without driver compatibility check.** Old
  printer / VPN / endpoint drivers break boot.
- **Smart App Control cannot be enabled on upgraded Win11.** Use WDAC for those
  devices.
- **WDAC is high-value but operationally heavy.** Plan for the policy-management
  function; this is not "set and forget."
- **Legacy LAPS is deprecated; new Windows LAPS is the path.** Don't deploy legacy
  LAPS on greenfield Win11.
- **Credential Guard breaks some legacy auth scenarios** (Wi-Fi 802.1x with certain
  TPM configs, third-party credential providers). Validate.
- **Don't run unsupported drivers / kernel-mode software** alongside Memory Integrity.
- **PDE requires WHfB.** Without Hello, PDE doesn't engage; data isn't protected
  at the file level.
- **Intune Settings catalog vs classic baseline**: forward-looking is Settings catalog.
  Don't run both for the same setting — conflicts.
- **CFA on servers breaks workloads.** Workstations only.
- **Removable storage block-all without allowlist** breaks legitimate users; have a
  request workflow.

## Common anti-patterns
- **"Applied baseline once, never updated"** — baseline updates ship quarterly; new
  attacks add new settings. Re-baseline annually.
- **"Memory Integrity off because one driver complained"** — keep it on, replace the
  driver.
- **"Legacy LAPS still running on Win11"** — deprecated; migrate to Windows LAPS.
- **"WDAC in audit forever"** — never enforced; not protecting anything.
- **"Smart App Control on upgraded devices"** — silently does nothing.
- **"Credential Guard off because of a 2018 third-party VPN"** — replace the VPN.
- **"USB block-all, no exceptions"** — engineering revolts and finds workarounds.
  Allowlist legitimate use.
- **"Compliance signal not in Conditional Access"** — devices "compliant" but no
  enforcement at access.
- **"Settings catalog and classic baseline both targeted at the same group"** —
  policy conflicts; unpredictable enforcement.

## Example prompts
- `Roll out the Windows 11 security baseline to a 30,000-device Intune-managed
  estate with a 3-ring pilot.`
- `Migrate from legacy LAPS to Windows LAPS for a hybrid (Entra-joined + AD-joined)
  estate.`
- `Driver compatibility readiness for VBS / HVCI / Memory Integrity rollout.`
- `WDAC policy authoring strategy: managed installer vs explicit allowlist; phased
  enforcement.`
- `Personal Data Encryption rollout aligned with Windows Hello for Business and
  passkey strategy.`
- `Removable storage policy: block USB write tenant-wide, allowlist by hardware ID
  for designated groups, request workflow.`
- `Compliance policy + Conditional Access: bind the security baseline to access for
  Microsoft 365 and Azure portal.`
- `Audit Smart App Control eligibility across the fleet and identify devices where
  WDAC is the only viable path.`

## Microsoft Learn
- Windows 11 security book: https://learn.microsoft.com/windows/security/book/
- Security baselines for Windows 11: https://learn.microsoft.com/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines
- Intune security baselines: https://learn.microsoft.com/intune/intune-service/protect/security-baselines
- VBS / HVCI / Memory Integrity: https://learn.microsoft.com/windows/security/hardware-security/enable-virtualization-based-protection-of-code-integrity
- Credential Guard: https://learn.microsoft.com/windows/security/identity-protection/credential-guard/
- LSA protection: https://learn.microsoft.com/windows-server/security/credentials-protection-and-management/configuring-additional-lsa-protection
- Windows LAPS: https://learn.microsoft.com/windows-server/identity/laps/laps-overview
- Smart App Control: https://learn.microsoft.com/windows/security/application-security/application-control/app-control-for-business/
- WDAC / App Control for Business: https://learn.microsoft.com/windows/security/application-security/application-control/app-control-for-business/
- Personal Data Encryption: https://learn.microsoft.com/windows/security/operating-system-security/data-protection/personal-data-encryption/
- Controlled folder access: https://learn.microsoft.com/defender-endpoint/controlled-folders
- Microsoft Security Compliance Toolkit (GPO baselines): https://www.microsoft.com/download/details.aspx?id=55319
