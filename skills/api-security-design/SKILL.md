---
name: api-security-design
description: "Guidance for designing secure APIs on Azure - authentication, authorization, gateway controls, input validation, rate limiting, secret management, and runtime threat detection - aligned to OWASP API Security Top 10 and Azure API Management. WHEN: API security design, secure API, OWASP API Top 10, API authentication, API gateway security, rate limiting, validate JWT, protect backend API, API Management security policies, secure API architecture, BOLA, BFLA. DO NOT USE for general application security or web app design (use security-architecture / threat-modelling) or for API runtime detection only (use defender-for-apis)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# API Security Design

Secure API design protects backend services and data from abuse and the **OWASP API Security
Top 10** risks - broken object-level authorization (BOLA), broken authentication, broken
function-level authorization (BFLA), unrestricted resource consumption, server-side request
forgery, and more. On Azure, **Azure API Management (APIM)** is the primary policy enforcement
point, paired with WAF, Entra ID, Key Vault, and Defender for APIs.

## When to use
Designing or reviewing the security of APIs - especially external-facing, partner-facing, or
sensitive-data APIs - before they go live or as part of a recurring design review.

**Do not use this skill** for:
- General application or web app security (use `security-architecture`, `threat-modelling`)
- API runtime detection and posture only (use `defender-for-apis`)
- Front-end / SPA design (use web app security guidance)

## Pick the right control per OWASP API risk

| OWASP API Top 10 risk | Primary control | Where it lives |
|---|---|---|
| API1 - **BOLA** (object-level auth) | Per-object authorization check | **Backend code** (gateway cannot fully cover) |
| API2 - Broken authentication | OAuth 2.0 / OIDC with Entra ID, `validate-jwt` | Gateway + Entra |
| API3 - Broken object property auth | Schema validation + response filtering | Backend + gateway |
| API4 - Unrestricted resource consumption | Rate limit, quota, payload size, timeout | Gateway (APIM) |
| API5 - **BFLA** (function-level auth) | Role/scope check on each operation | Backend code |
| API6 - Unrestricted access to sensitive flows | Step-up auth, anti-abuse rules | Entra + gateway |
| API7 - SSRF | Outbound URL allow-list + egress controls | Backend + network |
| API8 - Security misconfiguration | IaC + APIM policy templates | DevOps + gateway |
| API9 - Improper inventory management | API catalog + lifecycle in APIM | APIM + governance |
| API10 - Unsafe consumption of third-party APIs | Validate upstream responses, timeouts | Backend |

> **Rule of thumb:** **BOLA and BFLA are the top two API risks** and **cannot be fully fixed
> at the gateway** - the backend must enforce per-object and per-function authorization. The
> gateway is necessary but not sufficient.

## Approach

1. **Authentication at the gateway with Entra ID** - Require OAuth 2.0 / OpenID Connect via
   **Microsoft Entra ID**; validate JWTs at APIM with the **`validate-jwt`** policy (issuer,
   audience, signing key, expiration, required claims). Avoid static API keys as the only
   control - rotate them aggressively if used at all.
   *Verify: a request with an invalid or expired JWT is rejected at the gateway; logs show the
   rejection reason.*
2. **Authorization in the backend** - Enforce least-privilege scopes/roles in the JWT, then
   check **object-level** and **function-level** authorization in the backend on every call.
   The gateway sees the caller; only the backend knows whether the caller owns the object.
   *Verify: a test JWT for user A returns 403 when requesting user B's data, even though the
   gateway lets the call through.*
3. **Apply gateway protections (APIM)** - Configure: rate-limit and quota policies per
   subscription/IP/identity, IP filtering for allow-lists, **request and response validation**
   against the OpenAPI schema, payload size limits, timeouts, and CORS scoped to known
   origins.
   *Verify: a request exceeding the rate limit returns 429; an oversized payload is rejected;
   a request not matching the OpenAPI schema is rejected.*
4. **Transport and secrets** - Enforce TLS 1.2+ on every endpoint, use **mTLS** to backends
   where threat model requires it, and store all secrets (backend credentials, signing keys)
   in **Azure Key Vault** referenced via APIM named values with a managed identity. No
   secrets in policy XML, no secrets in code.
   *Verify: no secret literal appears in APIM policies or source repo; APIM uses managed
   identity to fetch Key Vault references at runtime.*
5. **Exposure and network controls** - Front public APIs with **WAF** (Application Gateway or
   Azure Front Door) for L7 protection (OWASP Core Rule Set), and use **Private Endpoints** to
   keep backends off the public internet. Internal APIs should not have a public route.
   *Verify: a port scan of the public IP reaches WAF/APIM only; backends are not reachable
   directly from the internet.*
6. **Validate input rigorously** - Validate against the OpenAPI schema at the gateway; reject
   unexpected fields, oversized payloads, and malformed types. Backend code re-validates
   business invariants - never trust the gateway alone.
   *Verify: fuzz testing on the API produces 4xx responses, not 5xx; no input class causes a
   crash or stack trace leak.*
7. **Add runtime threat detection** - Enable **Microsoft Defender for APIs** for APIM-fronted
   APIs to detect runtime threats (suspicious access patterns, sensitive-data exposure,
   reconnaissance, OWASP-aligned attacks).
   *Verify: a deliberately abusive test client triggers a Defender for APIs alert.*
8. **Catalog and lifecycle the APIs** - Inventory every API in APIM (or your gateway), tag by
   sensitivity and ownership, and retire deprecated versions on a schedule. **Shadow APIs**
   - undocumented, unmonitored - are the most common breach path.

## Guardrails
- **BOLA/BFLA are the top API risks** - authorization must be enforced server-side per object
  and per function. The gateway can see the caller but not which objects they may touch.
- **Don't rely on the gateway alone** - defence in depth across gateway + backend. Single
  layers fail; layered controls mean a misconfiguration in one place does not equal breach.
- **Validate input** against a schema; reject unexpected fields and oversized payloads. The
  most common API CVE is "we accepted what we did not expect".
- **No static API keys as sole authentication.** Move to OAuth 2.0 + Entra ID. If keys remain
  for partner compatibility, rotate aggressively and rate-limit hard.
- **Treat the API inventory as an asset** - shadow APIs are unmanaged risk. Discovery + catalog
  is part of API security, not just operations.
- **Backend re-validation is not duplication** - it is the only place per-object authorization
  can land safely.

## Common anti-patterns
- **"We have JWT validation at the gateway, we are secure."** Missing BOLA/BFLA checks in the
  backend - the most common API breach pattern.
- **Static API keys with no rate limit and no rotation.** Single credential leak = full
  exposure with no detection.
- **No schema validation at the gateway.** Backends crash on malformed input and leak stack
  traces; fuzzing finds bugs in production rather than in test.
- **Secrets in APIM policy XML or repo.** First credential rotation incident exposes them
  permanently in history.
- **Public backend even with APIM in front.** Anyone who finds the backend URL bypasses the
  gateway. Use Private Endpoints / VNet integration.
- **No API catalog.** Shadow APIs are the dominant external API breach pattern. If you cannot
  list them you cannot secure them.

## Example prompts
- `Design a secure API on Azure API Management aligned to the OWASP API Security Top 10.`
- `How do I validate JWTs at the gateway instead of relying on static API keys?`
- `Configure rate limiting and payload validation to protect a backend API.`
- `Review my API authentication and authorization design for least privilege.`
- `What controls cover BOLA and BFLA on Azure API Management?`

## Microsoft Learn
- API Management security baseline: https://learn.microsoft.com/azure/api-management/security-baseline
- Protect a backend with Entra ID: https://learn.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad
- `validate-jwt` policy: https://learn.microsoft.com/azure/api-management/validate-jwt-policy
- Mitigate OWASP API threats: https://learn.microsoft.com/azure/api-management/mitigate-owasp-api-threats
- Defender for APIs: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-introduction
- APIM landing zone accelerator: https://learn.microsoft.com/azure/cloud-adoption-framework/scenarios/app-platform/api-management/landing-zone-accelerator
