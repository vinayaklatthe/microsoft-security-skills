---
name: windows-hello
description: "Guidance for Windows Hello for Business (WHfB) — passwordless, phishing-resistant authentication using a PIN or biometric backed by an asymmetric key or certificate. Covers trust model selection (cloud Kerberos trust default for hybrid; key trust legacy; certificate trust niche), prerequisites (Entra join, MFA registration, Entra Kerberos for cloud Kerberos trust), Intune-based provisioning, multi-factor unlock, and Conditional Access authentication strengths. WHEN: Windows Hello for Business, WHfB, passwordless Windows, biometric sign-in, PIN sign-in, cloud Kerberos trust, key trust, certificate trust, hybrid sign-in, Entra Kerberos, multi-factor unlock, FIDO2 vs Hello, Hello provisioning. DO NOT USE for FIDO2 security keys (use entra-id), CA policy authoring (use conditional-access-mfa), or Intune compliance baseline (use intune-device-mgmt)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Windows Hello for Business

Windows Hello for Business (WHfB) replaces passwords on Windows with a phishing-resistant
2-factor credential: a PIN or biometric (something you know/are) that unlocks a per-device
asymmetric key (something you have, bound to TPM). The credential never leaves the device and
is not replayable.

## When to use
Eliminating password sign-in on Windows endpoints and meeting phishing-resistant MFA
requirements for users on Windows. Use this skill to choose the trust model, satisfy
prerequisites, and roll out provisioning.

**Do not use this skill** for FIDO2 keys on shared devices (`entra-id`), CA policy
(`conditional-access-mfa`), or device compliance (`intune-device-mgmt`).

## Pick the trust model

WHfB has three trust models. The choice depends on whether on-prem AD SSO is needed and the
state of the AD environment.

| Scenario | Trust model | Why |
|---|---|---|
| Cloud-only (Entra-joined, no on-prem AD) | **Cloud-only** (default) | No on-prem trust needed |
| Hybrid (Entra-joined / hybrid-joined, AD SSO needed) | **Cloud Kerberos trust** (recommended) | Simplest hybrid model; requires Entra Kerberos server objects |
| Hybrid, can't deploy Entra Kerberos | **Key trust** | Legacy; needs Windows Server 2016+ DCs + cert on each DC |
| Hybrid with strict cert-based environment | **Certificate trust** | Requires AD CS + NDES + Intune cert connector; most complex |

> **Rule of thumb:** **cloud Kerberos trust is the default for hybrid in 2026** unless there
> is a specific blocker (no Entra Connect Sync, regulated environment forbidding new auth
> models). Don't deploy key trust or certificate trust on new tenants - both are legacy.

## Approach

1. **Verify prerequisites** — Devices: Windows 10 1903+ / Windows 11; TPM 2.0 (TPM 1.2 in
   limited cases). Users: Entra-joined or hybrid-joined; MFA registered; supported license.
   For cloud Kerberos trust: deploy **Entra Kerberos** server objects in AD (`Set-AzureADKerberosServer`).
   *Verify: `dsregcmd /status` shows AzureAdJoined = YES; `Get-AzureADKerberosServer` returns
   one object per AD forest.*

2. **Provision via Intune** — Use Intune **Account Protection** policy (preferred) or the
   legacy WHfB Identity Protection profile. Set tenant-wide WHfB off, then target-on via
   Intune profile for the pilot ring; don't enable tenant-wide WHfB on day one.
   *Verify: pilot device shows the WHfB provisioning experience at first sign-in; PIN
   complexity matches policy.*

3. **PIN complexity and biometric policy** — Minimum 6 digits (6-8 typical); allow biometric
   (Windows Hello face / fingerprint) on supported hardware. Don't require special characters
   in PIN - it's not a password, it's a local unlock.

4. **Disable convenience PIN** — Some legacy estates have "convenience PIN" enabled (a PIN
   for password fill, not WHfB). Disable it explicitly; otherwise users may end up with the
   wrong credential type and think they're using WHfB.

5. **Conditional Access - authentication strength** — Create a CA policy that requires
   **phishing-resistant MFA** authentication strength for sensitive apps. WHfB satisfies it;
   password+SMS does not. Combine with PIM and PAW for Tier 0.
   *Verify: CA What If on a sensitive app with a password-only sign-in = blocked.*

6. **Multi-factor unlock for shared / kiosk** — On devices accessed by multiple users (lab,
   shared kiosk), configure multi-factor unlock (PIN + biometric, or PIN + trusted signal).

7. **Plan credential recovery (PIN reset) and shared-device scenarios** — Configure
   **Microsoft PIN reset service** so users self-recover without help desk; alternative is
   destructive reset (re-provision WHfB credential from scratch). Plan and communicate
   before rollout.
   *Verify: PIN reset tested end-to-end by pilot user.*

## Guardrails
- **PIN is not a password.** It's local-only, device-bound, backed by TPM. Don't enforce
  password-style complexity (rotation, special chars) - it discourages adoption without
  improving security.
- **TPM-bound is the security property.** A device without TPM (or with TPM disabled in BIOS)
  gets software fallback - much weaker. Verify TPM presence before counting WHfB as phishing-
  resistant.
- **WHfB credentials are per device, per user.** A user with 3 devices has 3 WHfB credentials.
  Lost device = revoke that credential, others unaffected.
- **Don't deploy certificate trust on new tenants.** Operational complexity vastly exceeds
  cloud Kerberos trust. Pick certificate trust only with explicit justification.
- **CA authentication strength is the lever.** Without "require phishing-resistant MFA" CA
  policy, users can still use password+SMS for sensitive apps; WHfB rollout alone doesn't
  block weak auth.
- **Plan PIN reset before rollout.** Forgotten PINs on day 2 of rollout, no recovery, = ticket
  storm and rollback.

## Common anti-patterns
- **"Enable WHfB tenant-wide and roll forward"** - Forced enablement breaks shared devices,
  non-TPM devices, and edge cases. Intune-target rings.
- **"Require 14-character complex PIN"** - Users hate it, write it down, adopt slower. 6
  digits is the recommendation.
- **"Deploy key trust for the new tenant"** - Legacy. Cloud Kerberos trust unless blocked.
- **"WHfB rollout - we're done with MFA"** - WHfB is great for Windows sign-in; CA policy
  still required to extend the phishing-resistant property to apps.
- **"Disable TPM to make troubleshooting easier"** - Strips the security property; WHfB
  becomes software-only. Re-enable.
- **"Convenience PIN is the same as WHfB"** - Different credential type, weaker. Disable
  convenience PIN explicitly.

## Example prompts
- `Choose between cloud Kerberos trust and key trust for our hybrid deployment.`
- `Roll out Windows Hello for Business via Intune to a 50-device pilot ring.`
- `Configure phishing-resistant MFA authentication strength in Conditional Access for SharePoint admin.`
- `Set up the PIN reset service so users can self-recover.`
- `Why do my hybrid users still get prompted for password after WHfB enrollment?`
- `Plan multi-factor unlock on shared lab devices.`

## Microsoft Learn
- WHfB overview: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/
- Plan a deployment: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/deploy/
- Cloud Kerberos trust: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/deploy/hybrid-cloud-kerberos-trust
- Prerequisites: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/deploy/requirements
- Intune Account Protection policy: https://learn.microsoft.com/mem/intune/protect/endpoint-security-account-protection-policy
- Authentication strengths in CA: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths
- PIN reset: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/hello-feature-pin-reset
- Multi-factor unlock: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/feature-multifactor-unlock
