---
name: entra-id
description: "Guidance for Microsoft Entra ID (formerly Azure AD) — cloud identity and access management and the control plane for Zero Trust. Covers tenant and identity model, authentication methods (passkeys, FIDO2, certificate-based), hybrid identity with Entra Connect or Cloud Sync, app registrations and consent governance, groups and administrative units, break-glass accounts, and Zero Trust identity foundations. WHEN: Microsoft Entra ID, Azure AD, identity provider setup, SSO, hybrid identity, Entra Connect, Cloud Sync, authentication methods, passwordless, passkey, FIDO2, certificate-based auth, app registration, enterprise application, illicit consent grant, break-glass account, emergency access, administrative units, SSPR, password writeback. DO NOT USE for risk-based detection (use entra-id-protection), Conditional Access design (use conditional-access-mfa), PIM (use azure-pim), or identity governance lifecycle (use entra-id-governance)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra ID

Microsoft Entra ID (formerly Azure Active Directory) is the cloud identity and access
management service that authenticates users, devices, and workloads. It is the control plane
for Zero Trust and the foundation every other Microsoft security control assumes is healthy.

## When to use
Establishing the identity foundation: tenants, users/groups, authentication methods, SSO for
apps, and hybrid identity with on-premises Active Directory. Use this skill **before**
configuring Conditional Access, Identity Protection, or PIM - they all assume a clean Entra
ID baseline.

**Do not use this skill** for risk-based sign-in detection (`entra-id-protection`), policy
enforcement (`conditional-access-mfa`), just-in-time admin roles (`azure-pim`), or lifecycle
workflows (`entra-id-governance`).

## Map the identity goal to the right Entra control

| If the goal is... | Use | Notes |
|---|---|---|
| Sync on-prem AD users to cloud | **Entra Cloud Sync** (preferred new) or **Entra Connect Sync** | Cloud Sync is lighter, no server farm |
| Federate sign-in to on-prem | **AD FS** (legacy) or **Pass-Through Authentication** | Avoid new AD FS deployments; prefer PHS + WHfB |
| Replace passwords | **Passkeys (FIDO2)** > Windows Hello for Business > Microsoft Authenticator passwordless | Phishing-resistant only |
| Single sign-on to SaaS | **Enterprise Applications** (gallery or non-gallery) | OIDC > SAML where supported |
| Self-service password reset | **SSPR** with cloud writeback (hybrid) | Requires Entra ID P1 |
| Delegated admin scoped to a region/BU | **Administrative Units** | Combine with custom roles for least privilege |
| App calls Microsoft Graph or another API | **App Registration** + delegated/application permissions | Require admin consent workflow for risky scopes |
| Emergency tenant access if MFA breaks | **Break-glass accounts** (2x cloud-only, excluded from CA) | Hardware FIDO2 only; alerted on every sign-in |

> **Rule of thumb:** if you are about to type a username and password into a Microsoft service
> in 2026, stop. Move to passkeys or WHfB. Password reuse + phishing is still the #1 root
> cause in identity incident response.

## Approach

1. **Tenant & identity model** — Decide cloud-only vs hybrid. Define naming conventions for
   users, groups (assigned vs dynamic), and administrative units. Block guest invites at
   tenant level by default; allow per-collaboration scenario.
   *Verify: `Get-MgPolicyAuthorizationPolicy` shows `allowedToCreateApps = false` for default
   users; admin consent workflow is enabled.*

2. **Hybrid identity** — Choose **Entra Cloud Sync** for new deployments (agent-based,
   lightweight, supports disconnected forests). Use **Entra Connect Sync** only if you need
   PHS + write-back features Cloud Sync doesn't yet support. Avoid new AD FS - it adds an
   on-prem dependency and an attack surface (MDI sensor required).
   *Verify: `Get-MgDirectoryOnPremisesSynchronization` shows healthy sync; password hash sync
   enabled.*

3. **Authentication methods - move to phishing-resistant** — Manage via the **Authentication
   methods policy** (replaces legacy MFA + SSPR registration policies). Roll out in this
   order: Authenticator (push + number matching) → WHfB on managed devices → FIDO2 passkeys
   for admins → broad passkey rollout. Disable SMS as a primary method.
   *Verify: `User Registration Details` report shows > 90% of users with at least one
   phishing-resistant method.*

4. **Applications & consent governance** — Use the gallery for SSO where available. Enable
   **admin consent workflow** so users request high-risk permissions instead of granting them.
   Run the **Risky Apps** report monthly. Apply least-privilege Graph permissions and review
   app credentials (secrets vs certs vs federated identity).
   *Verify: no consented apps with `Application.ReadWrite.All` or `Directory.ReadWrite.All`
   outside the approved list.*

5. **Self-service & lifecycle** — Enable SSPR with writeback for hybrid users. Configure My
   Account / My Apps. Use dynamic groups for attribute-driven membership (department, country,
   employeeType).

6. **Break-glass accounts** — Create **two** cloud-only emergency access accounts. Exclude
   from all Conditional Access policies. Authenticate only with FIDO2 hardware keys stored
   physically separately. Alert on every sign-in via Sentinel.
   *Verify: monthly sign-in test from each break-glass account; alert fires within 5 minutes.*

7. **Block legacy auth and weak methods** — Use Conditional Access (separate skill) to block
   legacy authentication protocols (POP, IMAP, SMTP AUTH, basic auth). Disable SMS / voice
   as primary MFA methods.

## Guardrails
- **Break-glass accounts are sacred.** Two of them, cloud-only, hardware FIDO2, excluded from
  every CA policy, monitored on every sign-in. Test monthly. If you skip this, you can lose
  the tenant in a CA misconfiguration.
- **Avoid new AD FS deployments.** It's an on-prem identity dependency, an attack surface,
  and a maintenance burden. PHS + WHfB covers nearly every requirement.
- **Block legacy authentication.** POP, IMAP, SMTP AUTH, basic auth bypass MFA. Block via
  Conditional Access, then monitor the sign-in logs for stragglers for 30 days.
- **Govern app consent.** Illicit consent grants are how attackers stay resident after
  password reset. Enable the admin consent workflow and review the Risky Apps report.
- **Don't use group-based licensing as the only assignment mechanism for admin accounts.** If
  the group sync breaks, admins lose their licence and access. Direct-assign for break-glass
  and tier-0 admins.
- **Cloud Sync is preferred over Connect Sync for new builds.** Lighter, no server farm, fewer
  failure modes.

## Common anti-patterns
- **"We use SMS for MFA - it's good enough"** - SMS is phishable and SIM-swappable. Treat as
  recovery factor only, never as primary.
- **"One break-glass account in Keepass"** - Single point of failure and not auditable. Two
  hardware-key accounts with separated custody.
- **"Federated sign-in via AD FS because that's how we always did it"** - In 2026 this adds
  cost and risk. Move to PHS + Conditional Access unless there's a specific federation
  requirement.
- **"Allow user app consent for all permissions"** - Tenant gets cluttered with risky
  consented apps. Enable admin consent workflow.
- **"Don't bother with Administrative Units, just use global admin"** - Breaks separation of
  duties and bypasses RBAC. Scope helpdesk and regional admins to AUs.
- **"Disable security defaults but skip Conditional Access for a week"** - Tenant is wide
  open during that gap. Enable CA policies before disabling defaults.

## Example prompts
- `Design a hybrid identity model with Entra Cloud Sync and password hash sync.`
- `Plan a rollout from passwords to passkeys for 5,000 users.`
- `Configure break-glass accounts for our Entra tenant and the monitoring alert.`
- `Move users off SMS MFA - what's the migration path?`
- `Prevent illicit consent grants in our Entra ID tenant.`
- `Configure SSPR with writeback for a hybrid environment.`
- `When should I use Administrative Units vs custom roles for delegated admin?`

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/fundamentals/whatis
- Entra Cloud Sync: https://learn.microsoft.com/entra/identity/hybrid/cloud-sync/what-is-cloud-sync
- Authentication methods policy: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-methods
- Passkeys (FIDO2): https://learn.microsoft.com/entra/identity/authentication/concept-authentication-passwordless
- Break-glass accounts: https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access
- Admin consent workflow: https://learn.microsoft.com/entra/identity/enterprise-apps/configure-admin-consent-workflow
- Administrative Units: https://learn.microsoft.com/entra/identity/role-based-access-control/administrative-units
- Block legacy authentication: https://learn.microsoft.com/entra/identity/conditional-access/policy-block-legacy-authentication
- Zero Trust identity: https://learn.microsoft.com/security/zero-trust/deploy/identity
