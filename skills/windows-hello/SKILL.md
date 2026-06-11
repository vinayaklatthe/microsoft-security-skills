---
name: windows-hello
description: "Guidance for Windows Hello for Business — phishing-resistant, passwordless authentication using a PIN or biometric backed by asymmetric keys or certificates. Covers deployment models (cloud Kerberos trust recommended), prerequisites, and rollout. WHEN: Windows Hello for Business, passwordless Windows sign-in, phishing-resistant authentication, cloud Kerberos trust, WHfB deployment, biometric sign-in, replace passwords Windows, PIN authentication."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Windows Hello for Business

Windows Hello for Business (WHfB) replaces passwords with strong, **phishing-resistant**,
two-factor authentication on Windows devices: a credential (asymmetric key pair or certificate)
bound to the device and unlocked by a **PIN or biometric**.

## When to use
Delivering passwordless sign-in on Windows as part of a Zero Trust identity strategy.

## Approach
1. **Choose a deployment/trust model** — For hybrid environments, **cloud Kerberos trust** is the
   recommended, simplest model (uses Entra Kerberos for on-prem resource access). Other models:
   key trust and certificate trust. Cloud-only (Entra-joined) is straightforward.
2. **Prerequisites** — Validate Entra join/hybrid join, MFA registration, supported Windows
   versions, and (for cloud Kerberos trust) Entra Kerberos enabled for on-prem AD.
3. **Provisioning** — Configure the WHfB policy via Microsoft Intune (recommended) or Group
   Policy; users enroll a PIN/biometric after MFA at first sign-in.
4. **Strengthen** — Layer **multi-factor unlock**, and require WHfB/passkeys via Conditional
   Access authentication strengths for privileged access.
5. **Rollout** — Pilot by ring; provide user guidance on PIN reset and fallback.

## Guardrails
- Cloud Kerberos trust requires Microsoft Entra Kerberos for on-prem resource access — validate
  before broad deployment.
- The PIN is **device-bound** and never leaves the device — it is not a password, so it is not
  replayable.
- Plan credential recovery (PIN reset) and shared-device scenarios.

## Example prompts
- `Deploy Windows Hello for Business with cloud Kerberos trust.`
- `How do I enable passwordless, phishing-resistant sign-in on Windows?`
- `Plan biometric and PIN authentication to replace passwords.`
- `Choose a WHfB trust/deployment model for a hybrid environment.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/
- Deployment models: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/deploy/
- Cloud Kerberos trust: https://learn.microsoft.com/windows/security/identity-protection/hello-for-business/deploy/hybrid-cloud-kerberos-trust
- Configure with Intune: https://learn.microsoft.com/mem/intune/protect/windows-hello
