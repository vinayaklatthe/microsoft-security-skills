---
name: azure-policy
description: "Guidance for Azure Policy — enforcing and auditing governance and security guardrails at scale across Azure with definitions, initiatives, assignments, and remediation. Covers effects, management group scope, compliance, and deployIfNotExists remediation. WHEN: Azure Policy, governance guardrails, enforce compliance, policy initiative, deny resource, audit configuration, remediation task, deployIfNotExists, management group policy, security baseline enforcement."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Policy

Azure Policy enforces organisational standards and assesses compliance at scale — auditing or
preventing non-compliant resource configurations and remediating drift automatically.

## When to use
Implementing preventive and detective governance/security guardrails across subscriptions and
management groups.

## Approach
1. **Definitions & effects** — Use built-in or custom policy definitions with the right **effect**:
   `Audit`, `Deny` (prevent), `Append`/`Modify`, `DeployIfNotExists` (auto-configure),
   `AuditIfNotExists`. Prefer built-ins where they exist.
2. **Initiatives** — Group related policies into **initiatives** (policy sets), e.g., a security
   baseline or a regulatory standard, for manageable assignment.
3. **Scope via management groups** — Assign at **management group** level for inheritance across
   subscriptions; use exclusions sparingly and deliberately.
4. **Roll out safely** — Start in **Audit**, review compliance, then move critical controls to
   **Deny**. Communicate impact to workload owners.
5. **Remediate** — Use **remediation tasks** for `DeployIfNotExists`/`Modify` to bring existing
   resources into compliance; managed identities perform the changes.
6. **Report** — Track compliance state; integrate with Defender for Cloud (which uses policy).

## Guardrails
- Test Deny policies in audit first — a broad Deny can block legitimate deployments and pipelines.
- Use parameters to make policies reusable across environments.
- Don't over-exclude; each exclusion weakens the guardrail and should be justified.

## Example prompts
- `Create an Azure Policy initiative to enforce a security baseline.`
- `How do I deny non-compliant resources and auto-remediate with deployIfNotExists?`
- `Apply governance guardrails at the management group scope.`
- `Audit resource configuration before switching policies to deny.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/governance/policy/overview
- Effects: https://learn.microsoft.com/azure/governance/policy/concepts/effects
- Initiatives (policy sets): https://learn.microsoft.com/azure/governance/policy/concepts/initiative-definition-structure
- Remediation: https://learn.microsoft.com/azure/governance/policy/how-to/remediate-resources
