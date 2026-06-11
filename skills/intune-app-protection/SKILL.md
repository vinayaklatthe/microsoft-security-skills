---
name: intune-app-protection
description: "Guidance for Microsoft Intune app protection policies (MAM) — protecting corporate data inside mobile apps with or without device enrollment. Covers MAM-WE for BYOD vs APP on managed devices, data-relocation controls (cut/copy/paste, Save As, encryption), app PIN/biometric and offline grace, selective wipe of corporate data, and pairing with Conditional Access grant control 'Require app protection policy'. WHEN: Intune app protection policy, app protection policy, APP, MAM, MAM-WE, MAM without enrollment, protect data in mobile apps, BYOD data protection, selective wipe, restrict copy paste, app-based Conditional Access, manage apps without enrollment, Intune SDK apps. DO NOT USE for full device management (use intune-device-mgmt) or disk encryption (use bitlocker-design)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Intune - App Protection Policies (MAM)

Intune **app protection policies (APP / MAM)** protect organisational data **inside** apps at
the application layer, with or without device enrollment. They make BYOD safe by isolating
corporate data inside managed apps and enabling selective wipe of org data without touching
personal content.

## When to use
Protecting Microsoft 365 and Intune-SDK-enabled app data on mobile devices, especially
unmanaged / personal devices (MAM without enrollment, **MAM-WE**). Use this skill when full
device enrollment is undesirable or impractical.

**Do not use this skill** for full device management (`intune-device-mgmt`) or disk
encryption (`bitlocker-design`).

## Pick the protection model

| Scenario | Model | Notes |
|---|---|---|
| BYOD - no enrollment | **MAM without enrollment (MAM-WE)** | Default for personal devices |
| Corporate-owned, managed | **APP on managed devices** | Layered on top of MDM |
| Mix of corporate + BYOD | Both | Same APP, different deployment scope |
| Frontline / shared device | App protection + Shared Device mode | Per-user data isolation |
| Strict regulated data | APP + Conditional Access app filter | CA-enforced gating |

> **Rule of thumb:** if you want the user to keep their personal data and the device, but
> the company to keep its data, MAM-WE. APP without CA enforcement is optional; APP with CA
> "Require app protection policy" is enforced.

## Approach

1. **Choose the model and target audience** — MAM-WE for BYOD, APP on managed devices for
   corporate. Both target users and groups, not devices. Per platform: iOS/iPadOS and
   Android.
   *Verify: APP assignment shows the right user groups; status report shows policy delivered
   to the target population.*

2. **Data protection settings** — Restrict cut/copy/paste to managed apps; prevent "Save As"
   to personal locations; restrict backup to iCloud/Google Drive; require **encryption** of
   org data at rest in the app.
   *Verify: testing on a personal device shows paste from Outlook → personal Notes is
   blocked.*

3. **Access requirements** — Require app **PIN** (6 digits min) or biometric to open managed
   apps; set **offline grace period** (typically 12-48 hours); block jailbroken / rooted
   devices; minimum OS version.

4. **Selective wipe** — Use "wipe corporate data only" to remove org data from the app while
   leaving personal data intact. Critical for BYOD departures.
   *Verify: pilot wipe on a personal device removes Outlook/OneDrive corp data, keeps photos
   and personal apps untouched.*

5. **Combine with Conditional Access for enforcement** — APP alone doesn't gate sign-in.
   Create a CA policy with grant control **Require app protection policy** for the target
   cloud apps (Exchange Online, SharePoint, Teams). This is the enforcement.
   *Verify: CA What If on Exchange from an unprotected app = blocked.*

6. **App configuration** — Pair APP with **app configuration policies** for managed app
   settings (Outlook signature, allowed account types).

## Guardrails
- **MAM-WE protects data in supported apps only.** Confirm the app is on the Intune-SDK /
  approved-app list. An unsupported app = no protection.
- **Communicate the user experience (PIN, restrictions) before rollout to reduce friction.**
  Users on BYOD will uninstall if surprised by a new PIN prompt.
- **Combine with Conditional Access for enforcement; APP alone doesn't gate sign-in.**
  Without CA, users can use unmanaged Outlook and bypass APP.
- **Offline grace period is a trade-off.** Too short = users locked out on a flight; too
  long = stale data stays on a lost device. 24-48 hours typical.
- **Selective wipe is queued.** Wipe initiates next time the user opens the app online. Not
  instant - revoke sessions in parallel for high-risk departures.
- **Don't run APP without app configuration.** Default Outlook on BYOD allows personal
  account; APP doesn't stop that. Configuration policy restricts to corp account only.

## Common anti-patterns
- **"Deploy APP, expect data protection"** - Without CA enforcement users sign into the
  unmanaged version of Outlook and bypass APP entirely.
- **"Block jailbroken devices but don't communicate"** - First-time users on rooted
  devices = ticket storm. Communicate before enforcement.
- **"No offline grace period"** - First poor-signal day = mass lockout.
- **"Same policy iOS and Android"** - Platform-specific knobs (e.g. iOS managed open-in,
  Android work profile interaction) need per-platform tuning.
- **"Wipe = device wipe"** on BYOD - Wipes personal data; legal exposure. Selective wipe
  only on BYOD.
- **"Skip app configuration policies"** - Outlook on personal account = data leaks
  outside scope of APP.

## Example prompts
- `Create an Intune app protection policy for BYOD without enrollment (MAM-WE).`
- `Restrict copy/paste and enable selective wipe in mobile apps for iOS and Android.`
- `Set up Conditional Access "Require app protection policy" for Exchange Online and SharePoint.`
- `Configure Outlook app configuration policy alongside APP.`
- `Plan offline grace period and PIN requirements for our mobile workforce.`
- `Wipe corporate data from a departing contractor's personal phone without touching personal data.`

## Microsoft Learn
- APP overview: https://learn.microsoft.com/mem/intune/apps/app-protection-policy
- APP settings - iOS: https://learn.microsoft.com/mem/intune/apps/app-protection-policy-settings-ios
- APP settings - Android: https://learn.microsoft.com/mem/intune/apps/app-protection-policy-settings-android
- MAM without enrollment: https://learn.microsoft.com/mem/intune/apps/app-protection-policies
- Supported apps: https://learn.microsoft.com/mem/intune/apps/apps-supported-intune-apps
- CA - Require app protection policy: https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-grant
- Selective wipe: https://learn.microsoft.com/mem/intune/apps/apps-selective-wipe
