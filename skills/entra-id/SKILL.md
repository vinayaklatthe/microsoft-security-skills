---
name: entra-id
description: "Guidance for Microsoft Entra ID (formerly Azure AD) — cloud identity and access management. Covers tenant and identity model, authentication methods, hybrid identity, application registration/SSO, groups, and Zero Trust identity foundations. WHEN: Microsoft Entra ID, Azure AD, identity provider setup, SSO, hybrid identity, Entra Connect, authentication methods, passwordless, app registration, enterprise application, identity foundation."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra ID

Microsoft Entra ID (formerly Azure Active Directory) is the cloud identity and access
management service that authenticates users, devices, and workloads and is the control plane
for Zero Trust.

## When to use
Establishing the identity foundation: tenants, users/groups, authentication, SSO for apps, and
hybrid identity with on-premises Active Directory.

## Design approach
1. **Tenant & identity model** — Define users, groups (assigned vs dynamic), and administrative
   units. Use cloud-only identities where possible; otherwise plan hybrid.
2. **Hybrid identity** — Use **Microsoft Entra Connect** (or Cloud Sync) with the right sign-in
   method: password hash sync (recommended baseline), pass-through authentication, or federation.
   Enable Seamless SSO.
3. **Authentication methods** — Move to **phishing-resistant, passwordless** (Windows Hello for
   Business, FIDO2, passkeys, certificate-based) and manage methods via the Authentication
   methods policy. Register users for MFA.
4. **Applications** — Use enterprise applications / app registrations for SSO (SAML/OIDC);
   prefer the gallery and apply least-privilege API permissions and admin consent governance.
5. **Self-service** — Enable Self-Service Password Reset (SSPR) with writeback for hybrid.
6. **Foundation for Zero Trust** — Pair with Conditional Access, Identity Protection, and
   Privileged Identity Management (separate skills).

## Guardrails
- Protect break-glass / emergency access accounts (cloud-only, excluded from CA, strongly
  protected and monitored).
- Avoid legacy authentication; block it with Conditional Access.
- Govern app consent to prevent illicit consent grants.

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/fundamentals/whatis
- Hybrid identity: https://learn.microsoft.com/entra/identity/hybrid/
- Authentication methods: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-methods
- Passwordless: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-passwordless
- Zero Trust identity: https://learn.microsoft.com/security/zero-trust/deploy/identity
