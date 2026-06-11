---
name: azure-app-service-security
description: "Guidance for securing Azure App Service web apps — managed identity, authentication (Easy Auth), network isolation (private endpoints, VNet integration), TLS, and secret management with Key Vault. WHEN: App Service security, secure web app on Azure, Easy Auth, App Service managed identity, private endpoint web app, VNet integration, App Service TLS, Key Vault references, harden App Service."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure App Service Security

Azure App Service hosts web apps and APIs as a managed PaaS. Securing it means protecting
identity, network exposure, secrets, and transport while leveraging built-in platform features.

## When to use
Hardening web apps/APIs hosted on Azure App Service.

## Approach
1. **Identity** — Enable a **managed identity** for the app and use it to access Azure resources
   (SQL, Storage, Key Vault) instead of credentials.
2. **Authentication** — Use built-in **App Service authentication (Easy Auth)** with Microsoft
   Entra ID to require sign-in without app code, or implement OIDC in-app.
3. **Secrets** — Store secrets in **Azure Key Vault** and reference them via **Key Vault
   references** in app settings; never hardcode secrets.
4. **Network isolation** — Use **VNet integration** for outbound, **private endpoints** for inbound
   to remove public exposure, and access restrictions/service tags where public is required.
5. **Transport** — Enforce HTTPS-only, minimum TLS 1.2+, and FTPS/disable FTP; use managed
   certificates.
6. **Front-end protection** — Place **Front Door/Application Gateway with WAF** in front and lock
   the app to accept traffic only from it.
7. **Monitor** — Enable diagnostic logs, Defender for App Service, and App Insights.

## Guardrails
- Remove public inbound exposure with private endpoints for sensitive apps; pair with WAF for
  public apps.
- Use managed identity + Key Vault references to eliminate secrets in config.
- Enforce HTTPS-only and modern TLS; disable legacy protocols and FTP.

## Example prompts
- `Harden an Azure App Service web app with Easy Auth, managed identity, and TLS.`
- `How do I lock down App Service with private endpoints and VNet integration?`
- `Use Key Vault references for App Service secrets instead of plain app settings.`
- `Review my App Service network and authentication configuration for security gaps.`

## Microsoft Learn
- App Service security: https://learn.microsoft.com/azure/app-service/overview-security
- Authentication (Easy Auth): https://learn.microsoft.com/azure/app-service/overview-authentication-authorization
- Key Vault references: https://learn.microsoft.com/azure/app-service/app-service-key-vault-references
- Networking & private endpoints: https://learn.microsoft.com/azure/app-service/networking-features
