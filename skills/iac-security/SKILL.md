---
name: iac-security
description: "Guidance for securing Infrastructure-as-Code (Bicep, ARM, Terraform, and ACI/Container) pipelines on Azure — shift-left scanning, policy-as-code, secret hygiene, identity for pipelines, drift detection, and supply chain. Covers Microsoft Defender for Cloud DevOps Security (GitHub / Azure DevOps connectors), Microsoft Security DevOps (MSDO) extension, Bicep linter and template specs, Terraform best practices on Azure (state management, backend hardening, provider versions), Azure Policy as deploy-time and CI-time gate, GitOps with Flux/ArgoCD on AKS, secret scanning and dependency review, signed commits / artifact signing, OIDC federation for pipeline identity (no client secrets), and integration with Defender for Cloud posture. WHEN: IaC security, Bicep security, Terraform Azure security, Defender for Cloud DevOps Security, MSDO, Microsoft Security DevOps, shift-left Azure, policy as code, OIDC GitHub Actions Azure, secrets in IaC, drift detection, signed Bicep, supply chain Azure. DO NOT USE for Kubernetes admission control alone (use defender-for-containers), generic CI/CD design, or app-layer security."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Infrastructure-as-Code Security on Azure

Most cloud breaches now route through misconfigured infrastructure that was provisioned
by code. Hardening the IaC pipeline — Bicep, ARM, Terraform, and the CI/CD that runs
them — moves security left of the deploy: misconfigurations get caught at PR review
instead of in a Defender for Cloud finding three weeks later.

## When to use
Designing or hardening the IaC pipeline (GitHub Actions / Azure DevOps / GitLab) for
Azure, including scanning, policy-as-code, pipeline identity, and supply-chain controls.

**Do not use this skill** for K8s admission control alone (`defender-for-containers`),
general CI/CD architecture, or app-layer security.

## Capability stack

| Layer | Capability |
|---|---|
| **Pipeline identity** | OIDC federation (no client secrets), Workload Identities Premium |
| **Pre-commit / PR-time scanning** | Microsoft Security DevOps (MSDO) Action / Extension; Bicep linter; tflint; checkov; trivy; secret scanning |
| **Policy-as-code gate** | Azure Policy in `Audit` and `Deny` modes at deploy; CI evaluation via `az policy` what-if, Terraform `azapi` policy preview |
| **Posture connect-back** | Defender for Cloud DevOps Security connectors to GitHub / Azure DevOps |
| **Drift detection** | Defender for Cloud, Terraform plan in scheduled CI, GitOps controllers (Flux/ArgoCD) on AKS |
| **Supply chain** | Signed commits, dependency review, artifact signing (Notation/cosign), allowed module registries |

## Approach

1. **Replace pipeline secrets with OIDC federation.** Every modern Azure CI integration
   supports federated workload identity:
   - GitHub Actions → Azure: federated credential on user-assigned MI; no
     `AZURE_CREDENTIALS` JSON secret.
   - Azure DevOps → Azure: Workload Identity federation service connection.
   Pin federated credentials to **specific environments / branches**
   (`environment:prod`, not `repo:org/repo:*`). See `entra-workload-identity`.

2. **Minimum scopes for pipeline identity.** Per-pipeline service principal/MI with
   role assignments at RG / resource scope, not subscription Owner. Use deployment
   stacks (Bicep) for blast-radius containment.

3. **Adopt Microsoft Security DevOps (MSDO) Action / Extension.** Bundles open-source
   scanners (template-analyzer, checkov, terrascan, trivy, bandit, ESLint security)
   plus secret scanning (CredScan). Single integration point; fail PR on critical
   findings.

4. **Bicep specifics.**
   - Use `bicep build` + `bicep lint` in CI.
   - Use **template specs** for shared patterns; version them.
   - Use **deployment stacks** with `denySettings` to prevent humans from drifting
     stack resources outside the pipeline.
   - Use module registries (private ACR or Bicep registry) with signed modules.

5. **Terraform specifics.**
   - **Backend hardening**: state in Azure Storage with private endpoint, Customer
     Lockbox + RBAC scoped, soft-delete + versioning + locking.
   - **Provider version pinning** (~> for minor, exact for security-critical).
   - **`tflint` + `checkov`** in CI; **`tfsec` is deprecated** — replaced by trivy.
   - **`terraform plan` artifact** posted to PR for reviewer; Apply gated on approval.
   - **Drift detection** via scheduled `terraform plan` against current state.

6. **Policy-as-code gate.** Azure Policy in **Deny** mode for non-negotiable controls:
   - No public IP on VMs.
   - Private endpoint required on Storage / SQL / Key Vault.
   - Encryption + diagnostic settings + tags required.
   In CI, run `az deployment what-if` (Bicep/ARM) or evaluate against Policy via
   `Get-AzPolicyComplianceForResource` to surface deny-mode failures **before** apply.

7. **Secret hygiene.**
   - **CredScan / GitHub Advanced Security secret scanning** on every push.
   - **No secrets in `.tfvars` or `parameters.json`** — Key Vault references / GitHub
     Environments / pipeline variable groups marked secret.
   - **Block PRs introducing secrets** (push-protection on).
   - Rotate any historical leak; clean git history is hard, change the secret.

8. **Supply chain.**
   - **Pin module versions** by digest where possible (Bicep registry digests, GitHub
     Action SHA pinning).
   - **Allowed registries**: Azure Policy on subscription to restrict containers /
     Bicep modules to your private registry.
   - **Signed artifacts**: Notation / cosign for container images; verify in admission
     control on AKS (`defender-for-containers`).

9. **Defender for Cloud DevOps Security.** Connect GitHub / Azure DevOps to Defender
   for Cloud:
   - Aggregates IaC findings, secret-scanning results, code scanning, dependency
     vulns into a single Defender for Cloud view.
   - Tagging, ownership, and prioritization same as cloud findings.
   - Track posture trend per repo / per pipeline.

10. **Drift detection.** Even with policy + IaC, drift happens (humans, ClickOps).
    Detect:
    - Defender for Cloud posture findings on resources not produced by the pipeline.
    - Scheduled Terraform plan jobs alerting on non-empty diffs.
    - GitOps (Flux/ArgoCD) reconciliation alerts on AKS clusters.

## Guardrails
- **Don't store cloud credentials as long-lived pipeline secrets.** OIDC federation,
  always.
- **Don't run pipelines as Subscription Owner.** Scope tightly; use deployment stacks
  for containment.
- **Failing PRs only on `critical` is too lenient at maturity.** Move to medium+ once
  baseline noise is tuned out.
- **Bicep `what-if` is not a security review.** It shows changes; security review
  reads them.
- **Terraform state files contain secrets in cleartext.** Backend storage hardening is
  non-negotiable.
- **Don't allow `provider "azurerm" { ... features {} }` to drift unpinned across
  pipelines.** Reproducibility = security.
- **`Audit`-only Azure Policy is necessary but insufficient.** Critical controls need
  `Deny`.
- **Branch protection without required reviewers does not gate IaC merges.** Enforce
  the human review.
- **MSDO doesn't replace per-language linters.** Layer.
- **Defender DevOps Security needs the connector — and an owner per repo.** Otherwise
  findings rot.

## Common anti-patterns
- **"Service principal client secret in GitHub Actions"** — leak fueling most pipeline
  breaches.
- **"Subscription-scope Contributor on the pipeline SP"** — single mistake = whole-sub
  outage.
- **"Skipped what-if; Bicep deploy first to see what breaks"** — production change
  without preview.
- **"Terraform state in default storage account, public endpoint"** — secrets exposed.
- **"Disabled push-protection because 'we have CI scanning'"** — secrets still leak in
  history before CI catches.
- **"Pinned action @ main"** — supply-chain compromise rides through. SHA-pin or tag-
  pin verified.
- **"Terraform with random provider versions"** — same code, different result.
- **"Defender DevOps Security findings nobody owns"** — same as Defender for Cloud
  findings nobody owns.
- **"GitOps reconciliation disabled in prod for stability"** — drift becomes invisible.

## Example prompts
- `Migrate all our GitHub Actions Azure deployments from client-secret service
  principals to OIDC federation with environment-pinned subjects.`
- `Roll out Microsoft Security DevOps in 80 repos with PR-blocking on medium+ severity
  findings.`
- `Connect Azure DevOps and GitHub orgs to Defender for Cloud DevOps Security and
  build the per-repo ownership model.`
- `Harden Terraform backend storage: private endpoint, Customer Lockbox, RBAC, soft-
  delete.`
- `Author Azure Policy deny-mode policies for landing-zone non-negotiables and
  evaluate at PR time before deploy.`
- `Implement Bicep deployment stacks with denySettings for blast-radius isolation in
  production.`
- `Drift detection pipeline: scheduled Terraform plan, Defender for Cloud delta, alert
  routing.`
- `Supply-chain hardening: SHA-pin GitHub Actions, signed Bicep modules in private
  registry, container image signing with cosign.`

## Microsoft Learn
- Defender for Cloud DevOps Security: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-devops-introduction
- Microsoft Security DevOps (MSDO): https://learn.microsoft.com/azure/defender-for-cloud/azure-devops-extension
- Connect GitHub: https://learn.microsoft.com/azure/defender-for-cloud/quickstart-onboard-github
- Connect Azure DevOps: https://learn.microsoft.com/azure/defender-for-cloud/quickstart-onboard-devops
- Bicep deployment stacks: https://learn.microsoft.com/azure/azure-resource-manager/bicep/deployment-stacks
- Bicep template specs: https://learn.microsoft.com/azure/azure-resource-manager/bicep/template-specs
- Workload identity federation (GitHub OIDC): https://learn.microsoft.com/entra/workload-id/workload-identity-federation
- Azure Policy as code: https://learn.microsoft.com/azure/governance/policy/concepts/policy-as-code
- Terraform on Azure best practices: https://learn.microsoft.com/azure/developer/terraform/overview
- GitHub Advanced Security: https://learn.microsoft.com/azure/devops/repos/security/configure-github-advanced-security-features
- Bicep linter: https://learn.microsoft.com/azure/azure-resource-manager/bicep/linter
