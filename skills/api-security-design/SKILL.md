---
name: api-security-design
description: "Guidance for designing secure APIs on Azure — authentication, authorization, gateway controls, input validation, rate limiting, and secret management, aligned to OWASP API Security Top 10 and Azure API Management. WHEN: API security design, secure API, OWASP API Top 10, API authentication, API gateway security, rate limiting, validate JWT, protect backend API, API Management security policies, secure API architecture."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# API Security Design

Secure API design protects backend services and data from abuse and the **OWASP API Security
Top 10** risks (broken object/function-level authorization, broken authentication, unrestricted
resource consumption, etc.). On Azure, **API Management (APIM)** is the primary enforcement point.

## When to use
Designing or reviewing the security of APIs, especially external-facing or sensitive-data APIs.

## Approach
1. **Authentication** — Require OAuth 2.0 / OpenID Connect via Microsoft Entra ID; validate JWTs
   at the gateway (`validate-jwt` policy). Avoid static API keys as the only control.
2. **Authorization** — Enforce least-privilege scopes/roles; check **object-level** and
   **function-level** authorization in the backend (the gateway can't fully cover BOLA).
3. **Gateway controls (APIM)** — Apply rate limiting/quotas, IP filtering, request/response
   validation against the OpenAPI schema, and payload size limits.
4. **Transport & secrets** — Enforce TLS, mTLS to backends where needed, and store secrets in
   **Azure Key Vault** (referenced by APIM named values / managed identity).
5. **Exposure** — Front with WAF (Application Gateway/Front Door) for L7 protection; use Private
   Endpoints to keep backends off the public internet.
6. **Monitor** — Enable logging, and add **Defender for APIs** for threat detection.

## Guardrails
- BOLA/BFLA are the top API risks — authorization must be enforced server-side per object/function.
- Don't rely on the gateway alone; defence in depth across gateway + backend.
- Validate input against a schema; reject unexpected fields and oversized payloads.

## Example prompts
- `Design a secure API on Azure API Management aligned to the OWASP API Security Top 10.`
- `How do I validate JWTs at the gateway instead of relying on static API keys?`
- `Configure rate limiting and payload validation to protect a backend API.`
- `Review my API authentication and authorization design for least privilege.`

## Microsoft Learn
- API Management security baseline: https://learn.microsoft.com/azure/api-management/security-baseline
- Protect backend with Entra ID: https://learn.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad
- validate-jwt policy: https://learn.microsoft.com/azure/api-management/validate-jwt-policy
- Mitigate OWASP API threats: https://learn.microsoft.com/azure/api-management/mitigate-owasp-api-threats
