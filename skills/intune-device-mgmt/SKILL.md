---
name: intune-device-mgmt
description: "Guidance for Microsoft Intune device management — enrollment, configuration, compliance, and security baselines across Windows, macOS, iOS/iPadOS, and Android. Covers Autopilot vs corporate-vs-BYOD enrollment, compliance policies that feed Conditional Access, Intune security baselines, update rings / Autopatch, and using filters and ring-based rollouts to avoid lockouts. WHEN: Microsoft Intune, MDM, device enrollment, Autopilot, Apple ABM, Android Enterprise, compliance policy, security baseline, configuration profile, settings catalog, manage devices, device compliance for Conditional Access, endpoint management, Windows Autopatch, update rings. DO NOT USE for app-only protection on BYOD (use intune-app-protection), endpoint detection / EDR (use defender-for-endpoint), or disk encryption only (use bitlocker-design)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Intune - Device Management

Microsoft Intune is the cloud-based endpoint management service for enrolling, configuring,
securing, and monitoring devices across Windows, macOS, iOS/iPadOS, Android, and Linux. It is
the source of device compliance signal that Conditional Access uses for access decisions.

## When to use
Managing corporate and BYOD device fleets and producing the compliance signal Conditional
Access depends on. Use this skill to plan enrollment, compliance, baselines, and rollout rings.

**Do not use this skill** for app-only protection on personal devices (`intune-app-protection`),
EDR (`defender-for-endpoint`), or disk encryption (`bitlocker-design`).

## Pick the enrollment method by platform and ownership

| Platform | Corporate-owned | Personal (BYOD) |
|---|---|---|
| **Windows** | **Autopilot** + Entra join (pre-provisioned or user-driven) | Entra registration + MAM or co-managed |
| **macOS** | **Apple Business Manager (ABM)** + ADE enrollment | User-enrolled (limited management) |
| **iOS/iPadOS** | ABM + ADE supervised | User enrollment (account-driven preferred) |
| **Android** | **Android Enterprise** fully managed (corporate) | Android Enterprise **work profile** |

> **Rule of thumb:** if the device is corporate-owned, full MDM via Autopilot / ABM / Android
> Enterprise fully managed. If personal, prefer **work profile (Android)** or **user enrollment
> (iOS)** for clean separation of corporate and personal data. Never enroll personal devices
> into full MDM - users push back and you carry liability for personal data.

## Approach

1. **Enrollment** — Configure platform-specific enrollment (Autopilot deployment profiles,
   ABM token + ADE profiles, Android Enterprise binding). Block personal-platform enrollment
   for corporate users if that's the policy (enrollment restrictions).
   *Verify: an Autopilot device hits the Out-of-Box Experience and lands joined + Intune-
   enrolled in one pass without IT touch.*

2. **Configuration profiles** — Use the **settings catalog** (not legacy templates). Deploy
   Wi-Fi / VPN / certificate profiles, OS hardening, browser policies. One profile per
   purpose; don't bundle unrelated settings.

3. **Compliance policies feed Conditional Access** — Define compliance per platform:
   encryption, OS version, secure boot, Defender signals, jailbreak/root detection. The
   compliance status drives CA grant control "Require device to be marked as compliant".
   *Verify: a non-compliant device is blocked by CA What If; a compliant one is allowed.*

4. **Apply security baselines** — Start from Intune **security baselines** (Windows, Defender
   for Endpoint, Edge). They're a hardened starting point - then tune deltas. Don't author
   security settings from scratch.
   *Verify: baseline applied and reported as compliant on the pilot ring; deltas documented.*

5. **Rollout with rings and filters** — Pilot ring (5%) → fast ring (20%) → broad ring (75%).
   Use **filters** to target policies precisely across device types (e.g. only Windows 11,
   only corporate-owned).
   *Verify: policy reports show staged rollout; pilot ring 2 weeks ahead of broad.*

6. **Updates** — Windows: **Autopatch** or update rings. iOS/macOS: managed software updates.
   Plan update deferral per ring; don't push the same day Microsoft releases.

7. **Monitor + remediate** — Encryption / compliance / configuration reports daily. Drift on
   compliance is a CA-blocking event - act fast.

## Guardrails
- **Pilot configuration and compliance with rings; avoid org-wide day-one enforcement.** A
  bad compliance policy at org scale locks everyone out of email by lunchtime.
- **Set a compliance grace period and clear user remediation guidance to avoid lockouts.**
  24-72 hour grace; tell users what to fix and where.
- **Use filters to target policies precisely across device types.** A Windows-only policy
  hitting iOS reports failures forever.
- **Enrollment restrictions matter.** Allow only the platforms / ownership types you
  actually manage; otherwise users self-enroll personal devices and you inherit them.
- **Baseline first, custom settings second.** Custom-from-scratch security policies drift
  from Microsoft guidance immediately.
- **Don't put Defender for Endpoint EDR onboarding in a config profile.** Use the Defender
  endpoint security policy or MDE integration path.

## Common anti-patterns
- **"Enable compliance policies tenant-wide on Day 1"** - Day 2 lockout incident.
- **"All settings in one giant Windows configuration profile"** - Unmaintainable; one
  setting failure marks the whole profile as failed.
- **"Compliance policy with no grace period"** - Single network blip = user blocked.
  Grace period required.
- **"Enroll iPhones into full MDM for BYOD"** - User outrage; data-protection exposure.
  User enrollment instead.
- **"Skip security baselines, write our own"** - Slower, less secure, immediately outdated.
- **"No filters - target all devices"** - macOS and iOS reports failures on Windows-only
  policies and vice versa. Targeted with filters.

## Example prompts
- `Plan device enrollment with Autopilot for Windows and ABM for macOS.`
- `Create compliance policies for Windows, iOS, and Android that feed Conditional Access.`
- `Apply Intune security baselines and tune deltas for our environment.`
- `Set up update rings with Windows Autopatch and a pilot-fast-broad cadence.`
- `Use filters to scope an iOS-only configuration profile.`
- `Roll out a new compliance policy with grace period and ring strategy.`

## Microsoft Learn
- Intune overview: https://learn.microsoft.com/mem/intune/fundamentals/what-is-intune
- Device enrollment: https://learn.microsoft.com/mem/intune/enrollment/device-enrollment
- Windows Autopilot: https://learn.microsoft.com/autopilot/overview
- Compliance policies: https://learn.microsoft.com/mem/intune/protect/device-compliance-get-started
- Security baselines: https://learn.microsoft.com/mem/intune/protect/security-baselines
- Settings catalog: https://learn.microsoft.com/mem/intune/configuration/settings-catalog
- Windows Autopatch: https://learn.microsoft.com/windows/deployment/windows-autopatch/overview/windows-autopatch-overview
- Filters: https://learn.microsoft.com/mem/intune/fundamentals/filters
