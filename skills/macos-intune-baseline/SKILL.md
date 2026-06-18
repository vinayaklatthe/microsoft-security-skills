---
name: macos-intune-baseline
description: "Guidance for hardening macOS endpoints managed by Microsoft Intune — automated device enrollment via Apple Business Manager (ABM), platform single sign-on (PSSO) with Entra ID, FileVault disk encryption escrow, security configuration profiles (Gatekeeper, XProtect, system extensions allowlist, firewall, login window, Privacy Preferences Policy Control / PPPC), Microsoft Defender for Endpoint on macOS, app management (VPP / managed apps / shell scripts via Intune), patching strategy (managed software updates / DDM), Conditional Access compliance signal, and cross-platform identity model. WHEN: Mac Intune baseline, macOS hardening Intune, FileVault escrow, ABM Apple Business Manager, Platform SSO macOS, PSSO Entra, MDE on Mac, Gatekeeper Intune, system extensions Intune, PPPC Intune, macOS compliance Conditional Access. DO NOT USE for general Intune device management end-to-end (use intune-device-mgmt), MDE config alone (use defender-for-endpoint), or iOS device management."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# macOS Hardening with Microsoft Intune

Mac fleets in Microsoft-shop enterprises are usually under-governed compared to
Windows. Intune-managed macOS with the right configuration profiles, FileVault
escrow, Defender for Endpoint, and Platform SSO with Entra ID closes most of the gap
and gives you a Conditional Access compliance signal that actually means something.

## When to use
Designing or hardening macOS endpoint management in an Intune + Entra ID environment
(workforce devices, BYOD via user-enrollment is a separate model).

**Do not use this skill** for end-to-end Intune (`intune-device-mgmt`), MDE policy
authoring (`defender-for-endpoint`), or iOS / iPadOS management.

## Capability map

| Layer | Tool / Profile |
|---|---|
| Provisioning | Apple Business Manager + Intune Automated Device Enrollment |
| Identity / SSO | Platform SSO (Entra ID), Enterprise SSO plug-in |
| Disk encryption | FileVault enabled + escrow recovery key to Intune |
| App control | Gatekeeper, XProtect (Apple-managed), notarized apps allowlist via system extensions |
| Endpoint protection | Microsoft Defender for Endpoint on macOS |
| Configuration | Settings catalog profiles (preferred), legacy templates where required |
| Privacy / kernel | Privacy Preferences Policy Control (PPPC), System Extensions, Notification Center policy |
| Updates | Managed Software Updates / Declarative Device Management (DDM) |
| Compliance | Intune compliance policy → Conditional Access |

## Approach

1. **Enroll via ABM + Automated Device Enrollment.** Manual enrollment is fine for
   pilots; production needs ABM so devices arrive supervised, can't be unenrolled by
   the user, and pick up policy at first boot.

2. **Platform SSO (PSSO) with Entra ID** is the modern macOS SSO. User signs into
   the Mac with their Entra credentials (password, smart card, or passkey-style
   secure enclave). Replaces the older Enterprise SSO plug-in for sign-in scenarios.
   Requires deployment of the Microsoft Enterprise SSO plug-in package + a PSSO
   configuration profile.

3. **FileVault** profile with **escrow** to Intune. Keys are recoverable by IT (with
   audit). Don't deploy FileVault without escrow — locked-out users brick devices.

4. **Defender for Endpoint on macOS** via Intune app deployment + onboarding profile.
   Includes:
   - Real-time AV.
   - Network protection.
   - EDR.
   - Vulnerability assessment.
   Validate via `mdatp health` post-onboarding.

5. **Configuration profiles — start with the Microsoft macOS security baseline (or
   CIS macOS benchmark)** and adapt. Critical settings:
   - **Gatekeeper**: Mac App Store + identified developers.
   - **System extensions allowlist** — required for Defender, your VPN, your DLP
     agent. Without explicit allowlist, users see prompts and may deny.
   - **Privacy Preferences Policy Control (PPPC)** — pre-approve required
     accessibility / full-disk-access for management tools (Defender, Intune
     management agent). Without this, MDE EDR coverage is partial.
   - **Firewall on** with stealth mode.
   - **Screen lock** + passcode complexity + password age aligned with policy.
   - **Disable login as root**, disable guest user, disable iCloud sync of passwords
     for managed devices (or scope by user group).
   - **Block USB mass storage** for restricted populations (Defender device
     control).

6. **App management.** Apps via VPP (Apple Volume Purchase Program) for App Store
   apps; PKG/DMG for non-store apps via Intune; shell scripts for the long tail.
   Maintain an "approved apps" catalogue.

7. **Patching: Managed Software Updates / DDM.** Apple's modern patch model uses
   Declarative Device Management — deferral windows, target OS versions, force-install
   deadlines. Replaces the older "deferral days" model. Roll out:
   - Major version: deferral 30 days, target n-1 supported.
   - Minor / security: deferral 7 days, target latest within supported.

8. **Compliance policy → Conditional Access.**
   - FileVault on.
   - System integrity protection (SIP) enabled.
   - OS version ≥ supported floor.
   - Defender threat agent healthy + real-time protection on.
   - Encryption + screen lock conformant.
   Mark non-compliant devices and enforce via CA on M365 and Azure resources.

9. **Operate.**
   - Defender for Endpoint device inventory + vulnerability management
     prioritization for Mac.
   - Quarterly review of system extensions and PPPC allowlist (apps come and go).
   - Monthly compliance trend.

## Guardrails
- **FileVault without escrow is a help-desk disaster.** Escrow first, enforce later.
- **System extensions and PPPC allowlists must be deployed *before* the agents that
  need them.** Otherwise users get prompts and click Deny — agents become
  ineffective.
- **Don't ship the Enterprise SSO plug-in and Platform SSO simultaneously without
  understanding the precedence.** PSSO is the strategic direction; coexist
  carefully.
- **Don't mix CIS and Microsoft baselines without harmonization.** Conflicting
  settings.
- **VPP apps require ABM linkage.** Without ABM, you're stuck with user Apple IDs.
- **MDE coverage on Mac depends on accessibility + full-disk-access PPPC.** Verify;
  otherwise EDR is partial.
- **Managed Software Updates needs supervised devices.** User-enrolled BYOD has
  different capabilities.
- **Compliance grace periods of 14+ days defeat the model.** Tighten as fleet
  matures.
- **Don't allow iCloud Drive personal accounts to sync corporate data.** Restrict via
  policy or BYOD-grade user enrollment for those users.

## Common anti-patterns
- **"FileVault rolled out, escrow on the to-do list"** — users locked out, IT can't
  recover.
- **"Defender installed, no PPPC profile"** — EDR sees user-mode events but not
  full-disk-access events.
- **"System extensions prompt the user; some users approved Defender, some didn't"**
  — fragmented coverage. Allowlist via profile.
- **"Compliance check skipped OS version floor"** — devices on 2-major-versions-back
  with unpatched CVEs marked compliant.
- **"Manual enrollment in production"** — users can unenroll, policy isn't
  enforced.
- **"App store apps via personal Apple IDs"** — license sprawl, no removal on
  offboard.
- **"Patching policy = trust users to update"** — fleet drifts; CVE backlog grows.
- **"Conditional Access for Mac applied 'All users + All cloud apps'"** — break-glass
  outage. Stage like Windows rollout.

## Example prompts
- `Stand up macOS management for a 5,000-device creative workforce: ABM + Intune
  ADE + PSSO + FileVault escrow + MDE + baseline.`
- `Build the system extensions and PPPC allowlist for Defender, our VPN, and our DLP
  agent.`
- `Migrate from the older Enterprise SSO plug-in to Platform SSO with Entra ID
  password / Smart Card use case.`
- `Compliance policy mapping macOS to Conditional Access for M365 and Azure portal.`
- `Patching policy with Managed Software Updates / DDM for Sonoma → Sequoia
  cutover.`
- `Compare Microsoft macOS baseline with CIS macOS benchmark and reconcile
  conflicts.`
- `BYOD user-enrollment design vs corporate-owned ADE — capability and trade-off
  table.`
- `MDE on Mac: confirm EDR coverage via PPPC, validate vulnerability assessment
  pipeline.`

## Microsoft Learn
- Intune macOS overview: https://learn.microsoft.com/intune/intune-service/configuration/device-restrictions-macos
- macOS enrollment (ABM / ADE): https://learn.microsoft.com/intune/intune-service/enrollment/device-enrollment-program-enroll-macos
- Platform SSO for Entra ID on macOS: https://learn.microsoft.com/entra/identity-platform/apple-sso-plugin
- Enterprise SSO plug-in for macOS: https://learn.microsoft.com/intune/intune-service/configuration/use-enterprise-sso-plug-in-ios-ipados-macos
- FileVault: https://learn.microsoft.com/intune/intune-service/protect/encrypt-devices-filevault
- Defender for Endpoint on macOS: https://learn.microsoft.com/defender-endpoint/microsoft-defender-endpoint-mac
- System extensions: https://learn.microsoft.com/intune/intune-service/configuration/device-features-configure#system-extensions
- Privacy Preferences Policy Control: https://learn.microsoft.com/intune/intune-service/configuration/preference-file-settings-macos
- Managed Software Updates / DDM: https://learn.microsoft.com/intune/intune-service/protect/managed-software-updates-ios-macos
- Compliance policies for macOS: https://learn.microsoft.com/intune/intune-service/protect/compliance-policy-create-mac-os
