---
name: entra-workload-identity
description: "Guidance for Microsoft Entra workload identities — managed identities, service principals, and workload identity federation. Covers system-assigned vs user-assigned managed identity, federated credentials (GitHub Actions, Azure DevOps, Kubernetes, other OIDC issuers) to eliminate secrets, Workload Identities Premium (Conditional Access for workloads, risk detection, lifecycle reviews), credential hygiene (no client secrets where federation works), least-privilege RBAC, and integration with Defender for Cloud / Microsoft Entra Permissions Management. WHEN: managed identity, system-assigned identity, user-assigned identity, service principal hardening, workload identity federation, GitHub OIDC to Azure, Azure DevOps OIDC, AKS workload identity, kill client secrets, federated credential, Workload Identities Premium, Conditional Access for workloads, non-human identity governance, NHI, app registration hardening. DO NOT USE for user/human identity (use entra-id), permissions discovery across clouds (use entra-permissions-management), or end-to-end NHI governance (use agent-identity-governance)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra Workload Identity

Workload identities are the **non-human identities** that apps, services, scripts, and
pipelines use to access Microsoft Entra-protected resources. They are the #1 source of
cloud breach in recent post-incident reports — usually because of leaked client secrets,
over-privileged service principals, or unmanaged certificate expiry.

This skill covers picking the right identity type, eliminating secrets via federation,
hardening service principals, and applying Workload Identities Premium controls.

## When to use
Designing how an Azure resource, GitHub Action, Azure DevOps pipeline, AKS pod, or
external workload authenticates to Entra-protected APIs (Azure Resource Manager,
Microsoft Graph, Key Vault, Storage, etc.).

**Do not use this skill** for human identity (`entra-id`), multi-cloud entitlement
analysis (`entra-permissions-management`), or AI agent identity governance specifically
(`agent-identity-governance`).

## Pick the right identity

| Workload | Best identity |
|---|---|
| Azure-hosted resource (App Service, Function, VM, AKS pod, Container Apps) | **Managed identity** (system-assigned if 1:1, user-assigned if shared / lifecycle decoupled) |
| GitHub Actions / GitLab CI / Azure DevOps / Jenkins | **Workload identity federation** to a user-assigned MI or app registration |
| Workload outside Azure with an OIDC issuer (Kubernetes, AWS, GCP) | **Workload identity federation** |
| Legacy on-prem service with no OIDC | App registration with **certificate** (never secret) |
| Anything authenticating to Microsoft Graph only | App registration + federation/cert |

> **Rule of thumb:** if a client secret is in your design doc, you missed a federation
> opportunity. Start by trying federation; fall back to certificates; never client
> secrets for new builds.

## Approach

1. **Inventory existing service principals and credentials.** Use Microsoft Graph
   (`servicePrincipals`, `applications`) to list every app reg, its key/secret
   credentials, expiry dates, and assigned roles. Most tenants find expired secrets,
   ten-year-old test apps, and unowned admin-consented apps.

2. **Eliminate secrets where federation works:**
   - **GitHub Actions → Azure**: configure a federated credential on a user-assigned MI
     (or app reg) with subject `repo:org/repo:environment:prod`. No secret in GitHub.
   - **AKS workload identity**: enable on cluster, annotate service account, project the
     token; pod authenticates as the user-assigned MI it's bound to.
   - **Azure DevOps**: use the *Workload Identity federation* service connection.
   - **External OIDC issuer** (GCP, AWS, Okta): add federated credential with the
     issuer URL and subject claim.

3. **Where you must keep a credential, use a certificate** rotated by Key Vault, not a
   client secret. Set short expiries (≤180 days) and automate rotation.

4. **Apply least-privilege RBAC.** Default to scoped role assignments at the resource
   or RG level — never Subscription Owner unless justified. Avoid Microsoft Graph
   `.All` permissions (e.g., `Files.ReadWrite.All`) when scoped or per-app-collection
   permissions exist (Sites.Selected, Mail.Send specific mailboxes via app access
   policy).

5. **Workload Identities Premium** (separate SKU). Unlocks:
   - **Conditional Access for workloads** — block service principal sign-ins from
     unexpected IP ranges, require named locations, restrict by client app.
   - **Workload identity risk detection** — leaked credentials, anomalous sign-in,
     suspicious admin activity.
   - **Access reviews for workload identities** — periodic owner review of SP roles.
   Apply to externally-facing or high-privilege workload identities; doesn't need to
   be every SP in the tenant.

6. **Lifecycle:** every app registration must have an owner (not a person who left,
   not an empty list). Quarterly review unowned and unused apps; disable then delete.

7. **Monitor.** Stream `ServicePrincipalSignInLogs` to Sentinel. Alert on:
   - Sign-in from a country/IP outside expected baseline.
   - New credential added (especially by a different identity than the owner).
   - Token issuance for a high-privilege role outside business hours.

## Guardrails
- **No client secrets in new designs.** Federation > certificate > secret.
- **System-assigned MI is tied to the resource lifecycle.** Delete the resource and the
  identity (and its role assignments) vanish — usually good, sometimes surprising.
- **User-assigned MI shared across resources** is convenient but breaks blast-radius
  isolation. Share only when lifecycle and trust boundary truly match.
- **Federated credentials must be specific.** Subject `repo:org/repo:*` accepts every
  branch and PR — including attacker forks. Pin to environment or protected branch.
- **No `.All` Graph permission without a clear justification.** Use Sites.Selected, mail
  app access policies, or app-only RBAC scoping.
- **Don't create an app reg per environment.** One app per workload, multiple federated
  credentials (one per env) — keeps role inventory clean.
- **Owner = a person + a group.** Single-owner apps go orphaned on leavers.
- **CA for workloads is a separate, premium policy type.** Make sure it's enabled if you
  rely on it for compliance.

## Common anti-patterns
- **"GitHub Action stores AZURE_CREDENTIALS as a JSON secret"** — leaked-secret risk.
  Switch to OIDC federation.
- **"One mega service principal for the entire DevOps platform with Owner on every
  sub"** — single compromise = total tenant. Per-pipeline identity, scoped.
- **"Client secret expires in 2099"** — long-lived bearer secrets defeat any rotation
  story. Cap at 180 days, automate.
- **"AKS pod uses node-pool MSI for app data access"** — every pod on the node has the
  same identity. Use AKS workload identity per service account.
- **"Federated credential subject = repo:org/repo:**"** — accepts any branch incl. PRs.
  Pin to `environment:prod`.
- **"Service principal granted Global Administrator to run a reporting script"** —
  read-only Graph permission, scoped, would have been enough.
- **"App registration owners list is empty"** — no one to review or rotate. Orphaned
  apps are an audit finding.

## Example prompts
- `Replace client secret in our GitHub Actions Azure deployment with workload identity
  federation.`
- `Migrate 12 AKS workloads from kiam/pod-identity to AKS workload identity.`
- `Inventory all app registrations with secrets expiring in 30 days and prioritize
  certificate rotation.`
- `Apply Conditional Access to a payroll integration service principal restricting IPs
  to a partner CIDR.`
- `Design federated credentials for Azure DevOps with environment-scoped subject claims
  for prod vs dev.`
- `Audit service principals with Microsoft Graph .All permissions and propose scoped
  alternatives.`
- `Roll out quarterly access reviews for high-privilege workload identities using
  Workload Identities Premium.`
- `Hunt anomalous service principal sign-ins in Sentinel — KQL detections.`

## Microsoft Learn
- Workload identities overview: https://learn.microsoft.com/entra/workload-id/workload-identities-overview
- Managed identities: https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview
- Workload identity federation: https://learn.microsoft.com/entra/workload-id/workload-identity-federation
- GitHub Actions OIDC: https://learn.microsoft.com/entra/workload-id/workload-identity-federation-create-trust?pivots=identity-wif-apps-methods-azp
- AKS workload identity: https://learn.microsoft.com/azure/aks/workload-identity-overview
- Azure DevOps workload identity: https://learn.microsoft.com/azure/devops/pipelines/library/connect-to-azure?view=azure-devops#create-an-azure-resource-manager-service-connection-that-uses-workload-identity-federation
- Conditional Access for workload identities: https://learn.microsoft.com/entra/identity/conditional-access/workload-identity
- Workload identity risk: https://learn.microsoft.com/entra/id-protection/concept-workload-identity-risk
- Microsoft Graph application permissions reference: https://learn.microsoft.com/graph/permissions-reference
