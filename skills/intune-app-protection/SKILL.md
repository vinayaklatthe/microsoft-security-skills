---
name: intune-app-protection
description: "Guidance for Microsoft Intune app protection policies (MAM) — protecting corporate data inside mobile apps with or without device enrollment. Covers MAM-WE, data protection actions (encrypt, restrict copy/paste, wipe), and Conditional Access for app protection. WHEN: Intune app protection policy, MAM, MAM-WE, protect data in mobile apps, BYOD data protection, selective wipe, restrict copy paste, app-based Conditional Access, manage apps without enrollment."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Intune — App Protection Policies (MAM)

Intune **app protection policies (APP / MAM)** protect organisational data **inside** apps at
the application layer — with or without device enrollment — making them ideal for BYOD and
mobile scenarios.

## When to use
Protecting Microsoft 365 (and SDK-enabled) app data on mobile devices, especially unmanaged /
personal devices, without full MDM enrollment (**MAM without enrollment**, MAM-WE).

## Approach
1. **Choose the model** — MAM-WE for BYOD (no enrollment) vs app protection layered on managed
   devices. Policies apply per platform (iOS/iPadOS, Android).
2. **Data protection** — Configure data relocation controls: restrict cut/copy/paste to managed
   apps, prevent "Save As" to personal locations, restrict backup, and require **encryption**.
3. **Access requirements** — Require app PIN/biometric, set offline grace periods, and block
   jailbroken/rooted or non-compliant devices.
4. **Selective wipe** — Use **wipe of corporate data only** to remove org data from the app while
   leaving personal data intact.
5. **Conditional Access** — Use the **Require app protection policy** grant control so only
   protected apps can access corporate data.
6. **App configuration** — Pair with app configuration policies for managed app settings.

## Guardrails
- MAM-WE protects data in supported apps only — confirm the app supports the Intune SDK / is
  on the approved list.
- Communicate the user experience (PIN, restrictions) before rollout to reduce friction.
- Combine with Conditional Access for enforcement; APP alone doesn't gate sign-in.

## Example prompts
- `Create an Intune app protection policy for BYOD without enrollment (MAM-WE).`
- `How do I restrict copy/paste and enable selective wipe in mobile apps?`
- `Set up app-based Conditional Access for managed apps.`
- `Protect corporate data in mobile apps on personal devices.`

## Microsoft Learn
- App protection overview: https://learn.microsoft.com/mem/intune/apps/app-protection-policy
- How APP protects data: https://learn.microsoft.com/mem/intune/apps/app-protection-policy-settings-ios
- MAM without enrollment: https://learn.microsoft.com/mem/intune/apps/apps-supported-intune-apps
- App protection policy: https://learn.microsoft.com/intune/intune-service/apps/app-protection-policy
