---
name: passkeys-fido2
description: "Guidance for rolling out passkeys (device-bound and synced) and FIDO2 security keys in Microsoft Entra ID as the primary phishing-resistant authentication method. Covers passkey types (device-bound in Microsoft Authenticator, synced passkeys via platform providers, hardware security keys), Conditional Access authentication strength, registration campaigns, Temporary Access Pass (TAP) bootstrapping, lifecycle (lost device, attestation), Conditional Access requiring phishing-resistant MFA, decommissioning legacy methods (SMS, voice, weaker app push), and integration with Windows Hello for Business. WHEN: passkey rollout, FIDO2 keys, phishing-resistant MFA, Microsoft Authenticator passkey, device-bound passkey, synced passkey, Temporary Access Pass, TAP, Conditional Access authentication strength, kill SMS MFA, retire voice MFA, passwordless rollout, FIDO2 attestation, security key registration. DO NOT USE for general CA policy authoring (use conditional-access-mfa), Windows desktop sign-in design end-to-end (use windows-hello), or Verified ID issuance (use entra-verified-id)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Passkeys and FIDO2 in Microsoft Entra ID

Passkeys and FIDO2 security keys are the **only** Entra ID authentication methods that are
genuinely phishing-resistant. This skill covers a pragmatic rollout: pick the right
passkey types for your population, bootstrap via Temporary Access Pass, enforce via
Conditional Access authentication strength, then retire legacy methods.

## When to use
Moving an Entra tenant from password+SMS/app-push toward passwordless, phishing-resistant
authentication. Use for method selection, registration campaigns, CA enforcement, and
legacy-method retirement planning.

**Do not use this skill** for generic CA policy authoring (`conditional-access-mfa`), full
Windows Hello for Business desktop design (`windows-hello`), or Verified ID credential
issuance (`entra-verified-id`).

## Passkey types — pick per population

| Type | Where it lives | Best for |
|---|---|---|
| **Device-bound passkey in Microsoft Authenticator** | iOS/Android app, hardware-bound, not synced | BYOD-heavy workforces, frontline workers |
| **Synced passkey (Apple iCloud Keychain, Google, Windows Hello via 1Password etc.)** | OS keychain, syncs across user's devices | Knowledge workers with managed iOS/macOS/Windows |
| **Hardware FIDO2 security key (YubiKey, Feitian, etc.)** | Removable, attested | Privileged admins, shared workstation users, regulated roles |
| **Windows Hello for Business** | Per-device, TPM-bound | Windows workstation primary sign-in (see `windows-hello`) |

> **Rule of thumb:** Default population = device-bound Authenticator passkey. Admins and
> tier-0 = hardware key. Mac/iPhone users where MDM/policy permits = synced passkey from
> the OS keychain.

## Approach

1. **Enable the authentication methods.** In Entra → Authentication methods, enable:
   - **Passkey (FIDO2)** with explicit attestation enforcement decisions (see below).
   - **Microsoft Authenticator** including passkey capability.
   - **Temporary Access Pass**.
   Scope rollout to a pilot group first.

2. **Attestation policy.** Decide whether to require attestation for FIDO2 registrations:
   - **Enforce attestation = Yes**: only AAGUIDs (authenticator models) you allowlist can
     register. Strong control; logistics-heavy because new device models need allowlisting.
   - **Enforce attestation = No**: any FIDO2 authenticator (incl. synced passkeys from
     platform providers) can register. Lower friction; less control.
   For privileged populations: enforce + allowlist hardware keys. For workforce:
   permissive.

3. **Bootstrap with Temporary Access Pass.** Every user needs a way to register their
   first passkey without using a password. TAP gives a time-bound, single-use (or
   limited-use) code:
   - New hires: TAP issued by HR/onboarding flow.
   - Existing users in registration campaign: TAP issued by help desk on verification.
   - Lost-device recovery: re-issue TAP after identity proofing (consider Verified ID).

4. **Registration campaign.** Use the built-in **registration campaign** to nudge users
   to set up Authenticator passkeys at sign-in. Run for 60–90 days; measure adoption.
   Pair with comms: 3 emails + a Teams banner.

5. **Conditional Access — authentication strength.** Create a CA policy requiring
   **Phishing-resistant MFA** authentication strength for:
   - All admin roles (Global Admin, Privileged Role Admin, etc.).
   - Privileged applications (Azure portal, Entra admin center, Exchange admin, GitHub
     Enterprise sign-in).
   - High-impact data apps (SAP, HR, finance).
   Roll out per-app, not tenant-wide, to limit blast radius.

6. **Retire weak methods.**
   - **SMS and voice** — disable as MFA methods in Authentication methods policy. They
     remain available for SSPR only if you must.
   - **Authenticator push without number-matching** — number-matching is now default;
     confirm enforced.
   - **Legacy MFA registration page** — move to combined registration (long since
     default).
   Sequence: weaken first (mark "secondary"), monitor sign-in logs for users still
   relying on the method, then disable.

7. **Lifecycle.**
   - Lost device: revoke the registered authenticator in user's authentication methods,
     issue new TAP, user re-registers.
   - Job change: passkey persists — it's bound to the user identity. Re-evaluation of
     CA strength happens on next sign-in.
   - Termination: standard offboarding revokes the identity; passkey becomes useless.

8. **Reporting.** In Entra → Monitoring → Authentication methods activity, track:
   - % users with at least one phishing-resistant method registered.
   - % sign-ins using phishing-resistant methods.
   - Method usage by application.
   Target: 100% of admins on phishing-resistant within 60 days; 90% of workforce within
   12 months.

## Guardrails
- **Don't enforce phishing-resistant CA before registration coverage is high enough.**
  Lockouts at 9 a.m. Monday. Phase: registration campaign first, then enforcement per
  group.
- **TAP must be issued by an identity-verified channel** (help desk with strong
  verification, Verified ID, in-person). A leaked TAP is a passwordless bypass.
- **Synced passkeys cross device trust boundaries.** A user signing in from a personal
  Mac uses the same passkey as their corporate Mac. If that's not your threat model,
  use device-bound passkeys or hardware keys for the sensitive personas.
- **Attestation allowlist requires lifecycle management.** New YubiKey model = new
  AAGUID. Bake into procurement.
- **Number-matching MFA is not phishing-resistant.** It defeats MFA-fatigue spam but a
  real-time AiTM proxy still succeeds. Don't conflate them.
- **SMS as a fallback "just in case" defeats the program.** Attackers will target the
  fallback. Remove it for the populations under phishing-resistant CA.
- **Don't ship Conditional Access "authentication strength: phishing-resistant" with
  break-glass accounts in scope.** Always exclude break-glass.

## Common anti-patterns
- **"Mandatory passkeys for admins on day one with no registration campaign"** —
  admins locked out at the worst moment.
- **"SMS allowed as MFA backup for everyone, forever"** — SIM-swap and lure attacks
  hit the weakest method. Remove for tier-0 day one.
- **"TAP issued via email to user's mailbox they can't access without MFA"** —
  chicken-and-egg. Use help-desk channel with identity proofing.
- **"Attestation enforced + brand-new YubiKey model not allowlisted"** —
  procurement-day surprise. Maintain the allowlist.
- **"Synced passkeys for Global Admins on personal iCloud"** — admin credential on a
  personal phone. Use hardware key + device-bound for admins.
- **"Number-matching MFA called phishing-resistant"** — it isn't. AiTM defeats it.
- **"Disabled password sign-in tenant-wide before workforce coverage hit 95%"** —
  unregistered users locked out. Use CA per-app + monitor first.

## Example prompts
- `Plan a 12-month passkey rollout for 25,000 users: pilot, campaign, CA enforcement,
  legacy retirement.`
- `Issue hardware FIDO2 keys to 300 admins with attestation enforced; build the AAGUID
  allowlist.`
- `Author a Conditional Access policy requiring phishing-resistant MFA for Global
  Administrators and the Azure portal.`
- `Replace SMS MFA with Authenticator passkey for a regulated population in 90 days.`
- `Bootstrap new hires with a Temporary Access Pass via the HR onboarding flow.`
- `Build a passkey registration campaign with success metrics and rollback plan.`
- `Recover a user who lost their phone and their only FIDO2 key — runbook with identity
  verification.`
- `Compare device-bound vs synced passkeys for a Mac-heavy creative workforce.`

## Microsoft Learn
- Passkey overview in Entra: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-passwordless
- Microsoft Authenticator passkeys: https://learn.microsoft.com/entra/identity/authentication/how-to-enable-authenticator-passkey
- FIDO2 security keys: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-passwordless#fido2-security-keys
- Attestation and AAGUIDs: https://learn.microsoft.com/entra/identity/authentication/concept-fido2-compatibility
- Temporary Access Pass: https://learn.microsoft.com/entra/identity/authentication/howto-authentication-temporary-access-pass
- Authentication strengths in CA: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths
- Registration campaign: https://learn.microsoft.com/entra/identity/authentication/how-to-mfa-registration-campaign
- Number-matching MFA: https://learn.microsoft.com/entra/identity/authentication/how-to-mfa-number-match
- Retire SMS/voice: https://learn.microsoft.com/entra/identity/authentication/how-to-authentication-methods-manage
