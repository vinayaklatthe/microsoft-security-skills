---
name: entra-verified-id
description: "Guidance for Microsoft Entra Verified ID — verifiable credentials issuance and verification platform based on open standards (W3C Verifiable Credentials, DIDs, OpenID4VC). Covers issuer setup (tenant configuration, DID registration, signing key in Key Vault), credential schema design, rules and display files, issuance flows (QR / deep link), verification flows, Face Check biometric matching, integration with Entra ID for workforce onboarding and access, integration with verification partners, and use cases (employee verification, remote onboarding, low-friction account recovery, vendor/contractor identity proofing). WHEN: Entra Verified ID, verifiable credentials, decentralized identity, DID issuance, issue credential Entra, verify credential, Face Check, remote onboarding identity proofing, account recovery with VC, contractor identity verification, vendor verification, workforce onboarding VC. DO NOT USE for B2C/CIAM (use entra-external-id), workforce identity admin (use entra-id), or PKI/certificate design (use pki-design)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra Verified ID

Entra Verified ID is Microsoft's verifiable-credentials platform built on open standards
(W3C Verifiable Credentials Data Model, Decentralized Identifiers, OpenID4VC). It lets an
organization **issue** signed digital credentials to anyone (employees, contractors,
customers) and **verify** credentials issued by others (Microsoft, governments, partners,
your own tenant) — without sharing user identity data over a backchannel.

## When to use
- High-confidence onboarding (remote new-hire identity proofing).
- Account recovery without help-desk calls.
- Cross-organization access (contractor with a VC from their employer).
- Vendor/partner identity proofing before privileged access.
- Customer scenarios needing portable, user-controlled credentials.

**Do not use this skill** for B2C consumer auth (`entra-external-id`), standard workforce
identity (`entra-id`), or X.509 PKI (`pki-design`).

## Architecture in one paragraph

Your tenant gets a **Decentralized Identifier (DID)**. A signing key in Key Vault produces
**Verifiable Credentials** following a **schema** (claims), with a **rules file** (how to
collect those claims at issuance) and a **display file** (visual presentation in the
wallet). Users hold credentials in **Microsoft Authenticator** (default wallet). A
**verifier** (any app/tenant) requests a credential via QR code or deep link, the wallet
presents it, the verifier validates the signature against the issuer's DID. Optional
**Face Check** asks the wallet to do a live selfie match against a photo claim in the VC.

## Approach

1. **Set up the issuer tenant.**
   - Verify domain ownership (linked-domain proof attached to your DID).
   - Provision a Key Vault and a signing key; grant Verified ID service permissions.
   - Choose DID method: `did:web` (linked to your domain, recommended for enterprise) or
     `did:ion`.

2. **Design the credential schema.** Start with one or two credentials, not ten:
   - *Verified Employee* (name, employee ID, business unit, issue date).
   - *Verified Trade Skill / Certification* (skill, expiry).
   Avoid over-claiming — privacy and revocation churn grow with attributes.

3. **Pick an issuance attestation flow:**
   - **ID Token (Entra)** — claims pulled from Entra ID after sign-in (fast for workforce).
   - **ID Token Hint** — claims supplied by your app (custom data store).
   - **Self-attested** — user enters claims (lowest assurance; rare).
   - **Verifiable Credential** — claims sourced from another VC (re-issuance / step-up).
   - **Identity verification partner** (e.g., LexisNexis, Onfido, IDEMIA via Microsoft
     marketplace) — for true identity proofing during remote onboarding.

4. **Define revocation strategy** before issuance. Use the **status list 2021** approach
   for bulk revocation. Plan for the lifecycle event: termination triggers a revocation
   API call.

5. **Stand up a verifier app.** A web/mobile app generates a QR code → user scans with
   Authenticator → app receives presentation. SDKs in .NET, Node.js, Java, Python.

6. **High-value use cases (start here):**
   - **Remote onboarding**: candidate verifies identity via partner → receives a
     *Verified Employee* VC → uses it for first-time TAP-less Entra ID setup, including
     passkey provisioning.
   - **Help-desk-less account recovery**: locked-out user presents Verified Employee VC →
     reset MFA without ticket.
   - **Face Check on privileged access**: high-impact admin actions trigger a Face Check
     presentation request before authorization.

7. **Integrate with Conditional Access** via the
   *Authentication context* + *Authentication strength* combination — CA can require a VC
   presentation for sensitive resources.

## Guardrails
- **Treat the issuer signing key like a CA key.** Compromise lets attackers issue fake
  VCs in your name. Key Vault HSM-backed, separate access policies, alert on key use
  outside the Verified ID service principal.
- **Don't put PII you can't justify into a credential.** VCs are long-lived in wallets;
  GDPR data-minimization applies.
- **Plan revocation before issuance.** Status-list endpoints must remain reachable
  forever; treat them like a CRL.
- **DID document is public.** Don't include sensitive endpoints or metadata.
- **Wallet is currently Microsoft Authenticator only** (third-party OpenID4VC wallets are
  emerging but not universally interoperable yet). Plan for that constraint.
- **Don't reissue on every claim change.** Use short-lived VCs or attestation refreshes
  via API; avoid revocation churn.
- **Face Check requires a photo claim in the VC.** Get the source photo provenance right
  (HR system, partner-verified) — garbage-in face match.
- **Verifier consent screens matter.** Users see what claims you're requesting; minimize.

## Common anti-patterns
- **"Issue a single 20-attribute mega-credential"** — privacy leakage and forced
  reissuance on any change. Compose multiple smaller VCs.
- **"Self-attested 'Verified Employee' for onboarding"** — no assurance; an attacker
  enters anything they want. Use Entra ID or partner attestation.
- **"Signing key in App Service config"** — bypasses HSM, no audit. Always Key Vault.
- **"No revocation"** — terminated employee retains a valid VC forever. Status list +
  termination automation, day one.
- **"Verifier accepts any DID without trust list"** — accepts spoofed issuers. Pin
  trusted issuer DIDs explicitly.
- **"Used Verified ID for daily sign-in instead of passkeys/FIDO2"** — VCs are for
  *identity proofing*, not session auth. Use FIDO2/passkeys for sign-in
  (`passkeys-fido2`).
- **"Bypassed identity verification partner to save cost on remote onboarding"** —
  weakest link is initial trust; partner attestation is the value.

## Example prompts
- `Issue Verified Employee credentials to 5,000 staff and integrate revocation with
  HR-driven termination workflow.`
- `Design a remote onboarding flow with a verification partner that issues a VC,
  followed by passkey provisioning and TAP-less first sign-in.`
- `Implement help-desk-less MFA reset by presenting a Verified Employee VC.`
- `Add Face Check to privileged access for Global Administrator activations.`
- `Schema design for a contractor credential with skill, project, and expiry claims.`
- `Stand up a verifier web app in .NET using the Verified ID Request Service.`
- `Choose did:web vs did:ion for an enterprise issuer rollout.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/verified-id/decentralized-identifier-overview
- Tenant setup: https://learn.microsoft.com/entra/verified-id/verifiable-credentials-configure-tenant
- Issuance overview: https://learn.microsoft.com/entra/verified-id/issuance-request-api
- Verification overview: https://learn.microsoft.com/entra/verified-id/presentation-request-api
- Face Check: https://learn.microsoft.com/entra/verified-id/verifiable-credentials-faq
- Rules and display files: https://learn.microsoft.com/entra/verified-id/rules-and-display-definitions-model
- Status list revocation: https://learn.microsoft.com/entra/verified-id/how-to-issuer-revoke
- Partner ecosystem: https://learn.microsoft.com/entra/verified-id/partner-gallery
- Conditional Access with Verified ID: https://learn.microsoft.com/entra/verified-id/decentralized-identifier-overview
