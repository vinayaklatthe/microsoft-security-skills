---
name: azure-key-vault
description: "Guidance for Azure Key Vault — securely storing and managing secrets, keys, and certificates with access control, network isolation, and rotation. Covers RBAC vs access policies, soft delete/purge protection, managed identity access, and Managed HSM. WHEN: Azure Key Vault, store secrets, manage certificates, encryption keys, secret rotation, Key Vault RBAC, purge protection, private endpoint Key Vault, managed identity access secrets, Managed HSM."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Key Vault

Azure Key Vault centrally and securely stores **secrets, keys, and certificates**, controlling
access and providing logging, so applications never embed credentials.

## When to use
Managing application secrets, encryption keys (incl. customer-managed keys), and TLS certificates.

## Approach
1. **Access model** — Prefer **Azure RBAC** for the data plane over legacy access policies; assign
   least-privilege roles (e.g., Key Vault Secrets User) to **managed identities**, not users.
2. **App access** — Have apps authenticate with a **managed identity** and retrieve secrets at
   runtime (or via App Service/AKS Key Vault references / CSI driver) — no secrets in code/config.
3. **Data protection** — Enable **soft delete** and **purge protection** to prevent accidental or
   malicious loss; set retention.
4. **Network isolation** — Restrict with **private endpoints** and firewall (disable public access)
   for sensitive vaults.
5. **Lifecycle** — Automate **rotation** (keys/certificates), set expiry, and monitor near-expiry.
6. **Tiering & HSM** — Use **Managed HSM** for FIPS 140-3 Level 3 single-tenant key control where
   required; separate vaults per app/environment for blast-radius isolation.
7. **Monitor** — Log to Log Analytics/Sentinel; enable Defender for Key Vault.

## Guardrails
- One vault per app per environment limits blast radius and simplifies access control.
- Purge protection is irreversible once on — required for CMK and many compliance scenarios.
- Never store secrets in source/config; use managed identity + Key Vault references.

## Example prompts
- `Set up Azure Key Vault with RBAC, purge protection, and a private endpoint.`
- `How do I rotate secrets and let a managed identity read them securely?`
- `When should I use Managed HSM instead of standard Key Vault?`
- `Review my Key Vault access model for least privilege.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/key-vault/general/overview
- Security: https://learn.microsoft.com/azure/key-vault/general/security-features
- RBAC: https://learn.microsoft.com/azure/key-vault/general/rbac-guide
- Soft delete & purge protection: https://learn.microsoft.com/azure/key-vault/general/soft-delete-overview
