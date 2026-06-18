---
name: entra-external-id
description: "Guidance for Microsoft Entra External ID — the unified customer identity and access management (CIAM) and external collaboration platform that replaces Azure AD B2C (for new tenants) and consolidates B2B guest scenarios. Covers external tenant creation, user flows (sign-up/sign-in, password reset), custom branding, identity providers (Google, Facebook, Apple, SAML/OIDC), email OTP and passkey support, custom attributes, custom authentication extensions (replaces B2C custom policies), API connectors, Conditional Access for external users, self-service sign-up in workforce tenants, B2B collaboration vs B2B direct connect, cross-tenant access settings, and migration considerations from Azure AD B2C. WHEN: Entra External ID, CIAM Microsoft, customer identity, replace Azure AD B2C, B2B guest user, B2B direct connect, cross-tenant access settings, external tenant, self-service sign-up, custom authentication extension, social identity provider, partner collaboration Entra, external user lifecycle, guest user expiration. DO NOT USE for workforce identity (use entra-id), workforce governance (use entra-id-governance), or workforce CA (use conditional-access-mfa)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra External ID

Entra External ID is Microsoft's unified platform for **identities outside your
workforce**:

- **Customer identity (CIAM)** in a dedicated **external tenant** — successor to Azure AD
  B2C for new deployments.
- **Business partner collaboration (B2B)** in your **workforce tenant** — guests, B2B
  direct connect, cross-tenant access settings.

Both are managed in the same admin surface and use the same Conditional Access engine.

## When to use
- Authenticating customers / consumers into your apps with social or email sign-up.
- Replacing Azure AD B2C (Microsoft's stated path for new CIAM deployments).
- Inviting and governing external partners as B2B guests with Conditional Access.
- Configuring cross-tenant access for federated partner organizations.

**Do not use this skill** for employee identity (`entra-id`), workforce lifecycle
governance (`entra-id-governance`), or workforce CA policy authoring
(`conditional-access-mfa`).

## External tenant vs workforce tenant — choose first

| Scenario | Tenant type |
|---|---|
| Public-facing consumer app, social/email sign-up, custom-branded sign-in | **External tenant** (CIAM) |
| Partner companies' employees collaborating in Teams/SharePoint/Apps | **Workforce tenant** (B2B guests, cross-tenant access) |
| Both | **Separate** external tenant + your existing workforce tenant |

> **Rule of thumb:** never mix customers and employees in the same workforce tenant —
> licensing, branding, lifecycle, and CA scoping all diverge fast.

## Approach

### External tenant (CIAM)

1. **Create the external tenant** (separate from your workforce tenant). Pick region;
   data residency is tenant-fixed.

2. **Register your customer app** in the external tenant. SDKs: MSAL for web/SPA/mobile,
   plus native integrations.

3. **Author user flows.** Built-in flows cover the common cases: sign-up/sign-in, password
   reset, profile edit. Configure:
   - Identity providers (email + password, email OTP, Google, Facebook, Apple, generic
     OIDC, SAML).
   - **Passkey support** (preview/GA per region) — passwordless from day one.
   - Custom attributes you want to collect.
   - Branding (logo, colors, custom CSS/HTML for sign-in page).

4. **Custom authentication extensions** replace the old B2C custom-policy XML model.
   Two flavors:
   - **Token issuance start** — call an external API at sign-in to enrich claims
     (e.g., look up loyalty tier from your CRM).
   - **Attribute collection / submit** — call an API during sign-up to validate or
     enrich the new user (e.g., third-party identity verification).

5. **Conditional Access for external users.** Apply CA policies in the external tenant
   — risk-based MFA, device platform restrictions, blocked countries. CA for external
   tenants is included.

6. **Migration from Azure AD B2C** — there's no in-place upgrade. Plan:
   - Re-create app registrations and user flows in External ID.
   - Bulk migrate users via Microsoft Graph (passwords cannot be exported; users
     reset on first sign-in or you stage migration via just-in-time JIT migration).
   - Run B2C and External ID in parallel during migration; cut over per app.

### Workforce tenant (B2B collaboration)

1. **Cross-tenant access settings** — for each partner tenant decide:
   - **B2B collaboration**: invite their users as guests in your tenant.
   - **B2B direct connect**: their users access via Teams Shared Channels without being
     guests in your tenant (today: Teams + selected resources).
   - Inbound MFA trust: trust the partner's MFA claim, don't re-prompt.
   - Outbound restrictions: limit what your users can do in their tenant.

2. **Default policy is permissive.** Tighten the **default** cross-tenant access to
   block, then allowlist trusted partner tenants.

3. **Guest lifecycle.** Set:
   - Inactive guest detection + auto-cleanup (Entra ID Governance access reviews).
   - Guest invitation restrictions — who in your org can invite (default: anyone, set
     to specific roles).
   - Email domain allowlist / denylist for invitations.

4. **Self-service sign-up + user flow in the workforce tenant** is supported for B2B
   self-service collaboration — useful for partner-self-onboarding portals.

5. **Apply CA to guests** explicitly. By default CA "All users" includes guests, but
   most orgs need separate, often stricter, policies (MFA always, no device compliance
   check because guest devices aren't managed).

## Guardrails
- **Don't put customers and employees in the same tenant.** Branding, licensing, CA
  scope, and lifecycle all conflict.
- **External ID is the path forward; Azure AD B2C is in maintenance for new tenants.**
  For new CIAM builds, External ID is the default choice.
- **Custom authentication extensions are HTTP webhooks.** They run in your auth path —
  must be HA, low-latency, and idempotent.
- **Cross-tenant access defaults are permissive.** Out of the box, anyone from any
  tenant can be invited and may access shared content. Tighten on day one.
- **B2B direct connect bypasses the guest object** — different governance model. Don't
  apply guest access reviews and expect to catch direct-connect users.
- **Guest passwords aren't in your tenant.** MFA enforcement requires explicit CA
  policy or trusted inbound MFA from partner.
- **Email OTP is not MFA.** It's a sign-up convenience for users without an MSA/social
  account. Layer real MFA on top.
- **Passkeys in External ID are the strongest customer auth.** Promote passkeys over
  password+OTP as the primary path.

## Common anti-patterns
- **"Customers as guests in the workforce tenant"** — license confusion, branding
  conflicts, governance impossible at scale.
- **"Migrated B2C custom policies by trying to import the XML"** — External ID doesn't
  use them. Re-author with extensions.
- **"Cross-tenant access left at default"** — any partner can invite, any user can be
  invited, no MFA harmonization. Configure explicitly.
- **"Guest inactivity = 365 days"** — auditors flag, breach blast-radius bloats. 90 or
  180.
- **"Webhook for custom auth extension hosted on a single-region App Service"** — sign-in
  outage. Multi-region + health probe.
- **"Same CA policies applied to guests as employees"** — device compliance fails for
  guests; they're blocked. Author separate guest policies.
- **"Built customer auth on workforce Entra ID with self-service sign-up"** — works for
  small partner cases, doesn't scale to CIAM volumes or branding.

## Example prompts
- `Stand up an Entra External ID tenant for a consumer mobile app with email+passkey
  and Google sign-in.`
- `Migrate 200,000 users and 3 apps from Azure AD B2C to Entra External ID with minimal
  customer disruption.`
- `Author a custom authentication extension to enrich the token with CRM loyalty tier
  during sign-in.`
- `Lock down cross-tenant access defaults and allowlist 12 partner tenants with inbound
  MFA trust.`
- `Roll out Conditional Access for guests requiring MFA every sign-in and blocking
  legacy auth.`
- `Set up B2B direct connect for Teams Shared Channels with two strategic partners.`
- `Quarterly guest access review for 8,000 partner users — workflow and Graph automation.`

## Microsoft Learn
- External ID overview: https://learn.microsoft.com/entra/external-id/external-identities-overview
- External tenants (CIAM): https://learn.microsoft.com/entra/external-id/customers/overview-customers-ciam
- B2B collaboration overview: https://learn.microsoft.com/entra/external-id/what-is-b2b
- Cross-tenant access settings: https://learn.microsoft.com/entra/external-id/cross-tenant-access-overview
- B2B direct connect: https://learn.microsoft.com/entra/external-id/b2b-direct-connect-overview
- Custom authentication extensions: https://learn.microsoft.com/entra/identity-platform/custom-extension-overview
- User flows: https://learn.microsoft.com/entra/external-id/customers/how-to-user-flow-sign-up-sign-in-customers
- Passkeys in External ID: https://learn.microsoft.com/entra/external-id/customers/concept-authentication-methods-customers
- Azure AD B2C to External ID migration: https://learn.microsoft.com/entra/external-id/customers/concept-planning-your-solution
- Conditional Access in external tenants: https://learn.microsoft.com/entra/external-id/customers/how-to-multifactor-authentication-customers
