---
name: azure-app-service-security
description: "Guidance for securing Azure App Service web apps and APIs — managed identity, Easy Auth with Microsoft Entra ID, network isolation via private endpoints + VNet integration, HTTPS / TLS hardening, Key Vault references for secrets, and front-end WAF (Front Door / App Gateway). WHEN: App Service security, secure web app on Azure, Easy Auth, App Service managed identity, private endpoint web app, VNet integration, App Service TLS, Key Vault references, harden App Service, FTP disable, WAF in front of App Service, access restrictions. DO NOT USE for Azure Functions specifics only (similar but separate), AKS workloads (different platform), or VM-hosted web apps."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure App Service Security

Azure App Service hosts web apps and APIs as a managed PaaS. Securing it means eliminating
secrets in config, removing public exposure where possible, enforcing modern transport, and
fronting it with a WAF when it has to be public.

## When to use
Hardening web apps and APIs hosted on Azure App Service. Use this skill to plan identity,
network, secrets, and transport posture for a Web App / API App.

**Do not use this skill** for Azure Functions only (similar but separate platform), AKS
workloads, or VM-hosted web apps.

## Pick the configuration by exposure pattern

| Exposure | Inbound | Outbound | Front-end |
|---|---|---|---|
| **Internal-only app** (intranet, API for VNet workloads) | Private endpoint, public access disabled | VNet integration to spoke | Internal Application Gateway |
| **Public web app, sensitive data** | Public + access restrictions to WAF only | VNet integration | Front Door or App Gateway with WAF, Prevention mode |
| **Public web app, basic** | Public, default | None / VNet integration | App Gateway with WAF |
| **API consumed by partners** | Private endpoint + APIM in front | VNet integration | APIM (with WAF on APIM if public) |
| **Background worker / no inbound** | Public access disabled | VNet integration | None |

> **Rule of thumb:** if it doesn't need to be on the internet, use a **private endpoint** and
> disable public network access. If it does need to be on the internet, put **Front Door /
> App Gateway with WAF in Prevention mode** in front and restrict the app to accept traffic
> only from the WAF's IP range or service tag.

## Approach

1. **Enable managed identity** — System-assigned managed identity by default. Grant it
   least-privilege roles on Azure SQL (`SQL DB Contributor` is wrong - use AAD auth +
   contained user), Storage (`Storage Blob Data Reader`), Key Vault (`Key Vault Secrets
   User`).
   *Verify: app has managed identity; no SQL / Storage connection strings with embedded
   passwords in config.*

2. **Easy Auth for sign-in** — Use built-in **App Service authentication (Easy Auth)** with
   Microsoft Entra ID for OIDC sign-in without writing auth code. Configure the redirect
   URI, token store, and `requireAuthentication = true` to gate the whole app.
   *Verify: anonymous request returns 302 redirect to Entra sign-in; authenticated request
   returns 200 with the user's principal claims.*

3. **Secrets via Key Vault references** — Store secrets in Key Vault; reference them in app
   settings as `@Microsoft.KeyVault(SecretUri=...)`. No code change; managed identity reads
   the secret at start / refresh.
   *Verify: app settings show `Key Vault Reference` as Resolved; no plaintext secrets in
   config.*

4. **Network isolation** — **VNet integration** for outbound (so the app can reach private
   endpoints, on-prem via gateway). **Private endpoint** for inbound on sensitive apps.
   Disable public access if private endpoint is used.
   *Verify: app outbound IP is in the integrated subnet; inbound test from public internet
   to private-endpoint-only app = 403 / connection refused.*

5. **Transport hardening** — Enforce **HTTPS-only**, minimum TLS 1.2 (TLS 1.3 preferred),
   disable FTP (use FTPS or deployment center only), enable HSTS where appropriate.
   *Verify: HTTP request 301-redirects to HTTPS; `httpsOnly = true`; `minTlsVersion = "1.2"`
   or higher; `ftpsState = "Disabled"` if no FTP needed.*

6. **WAF in front when public** — Front Door (global) or App Gateway with WAF (regional) in
   **Prevention mode**. Restrict App Service inbound to the WAF using **Access
   Restrictions** with the WAF's service tag (`AzureFrontDoor.Backend`) or IP range and the
   `X-Azure-FDID` header.
   *Verify: direct request to the App Service URL = 403; request via the WAF FQDN = 200.*

7. **Monitor + Defender** — Diagnostic logs to Log Analytics, **Defender for App Service** on
   the plan, App Insights for app telemetry. Alert on anomalous authentication failures.

## Guardrails
- **Remove public inbound exposure with private endpoints for sensitive apps; pair with WAF
  for public apps.** Apps directly on the internet without a WAF are scanned constantly.
- **Use managed identity + Key Vault references to eliminate secrets in config.** Connection
  strings in app settings are an audit finding waiting to happen.
- **Enforce HTTPS-only and modern TLS; disable legacy protocols and FTP.** TLS 1.0 / 1.1 and
  FTP are immediate audit failures.
- **Easy Auth doesn't replace authorisation.** It authenticates; you still need to check
  roles / claims in code for sensitive actions.
- **Access Restrictions are the lock on the back door.** Without restricting App Service to
  the WAF's IPs / FDID header, attackers bypass the WAF by hitting the App Service URL
  directly.
- **Defender for App Service catches things AV doesn't.** Webshell upload, anomalous app
  behaviour - enable on the plan.

## Common anti-patterns
- **"Connection string in app settings as plaintext"** - Visible to anyone with Reader on
  the app. Key Vault reference.
- **"Public App Service URL with WAF as 'recommended add-on later'"** - Attackers bypass the
  WAF on day one. Lock down access restrictions when WAF goes in.
- **"FTP enabled for legacy deployment"** - Cleartext credentials. Use FTPS or deployment
  center.
- **"HTTPS-only off because of one legacy callback"** - Fix the callback. Don't downgrade
  the whole app.
- **"Easy Auth + 'allow anonymous to /api/*'"** - Defeats the gate. Authenticate everything;
  authorise inside.
- **"VNet integration without disabling public access"** - You added security but didn't
  remove the old door.

## Example prompts
- `Harden an Azure App Service web app with Easy Auth, managed identity, and TLS.`
- `How do I lock down App Service with private endpoints and VNet integration?`
- `Use Key Vault references for App Service secrets instead of plain app settings.`
- `Put Front Door with WAF in front of App Service and lock the back door.`
- `Disable FTP, enforce HTTPS-only, and set minimum TLS 1.2.`
- `Review my App Service network and authentication configuration for security gaps.`

## Microsoft Learn
- App Service security: https://learn.microsoft.com/azure/app-service/overview-security
- Easy Auth: https://learn.microsoft.com/azure/app-service/overview-authentication-authorization
- Key Vault references: https://learn.microsoft.com/azure/app-service/app-service-key-vault-references
- Networking features: https://learn.microsoft.com/azure/app-service/networking-features
- Private endpoints: https://learn.microsoft.com/azure/app-service/networking/private-endpoint
- Access restrictions: https://learn.microsoft.com/azure/app-service/app-service-ip-restrictions
- TLS / HTTPS: https://learn.microsoft.com/azure/app-service/configure-ssl-bindings
- Defender for App Service: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-app-service-introduction
