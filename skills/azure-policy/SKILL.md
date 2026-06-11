---
name: azure-policy
description: "Guidance for Azure Policy — enforcing and auditing governance and security guardrails at scale across Azure with definitions, initiatives, assignments, and remediation tasks. Covers effects (Audit, Deny, Append, Modify, DeployIfNotExists, AuditIfNotExists), management group inheritance, audit-first rollout, parameterised reusable policies, and exclusion discipline. Powers Defender for Cloud regulatory compliance. WHEN: Azure Policy, governance guardrails, enforce compliance, policy initiative, deny resource, audit configuration, remediation task, deployIfNotExists, management group policy, security baseline enforcement, MCSB initiative, regulatory compliance Azure. DO NOT USE for resource RBAC role choice (use azure-role-selector), Defender posture only (use defender-for-cloud-hardening), or Bicep / IaC templating."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Policy

Azure Policy enforces organisational standards and assesses compliance at scale, auditing or
preventing non-compliant resource configurations and remediating drift automatically. It's the
preventive control plane for an Azure estate and the engine behind Defender for Cloud
regulatory compliance.

## When to use
Implementing preventive and detective governance / security guardrails across subscriptions
and management groups. Use this skill to pick effects, design initiatives, and roll out safely.

**Do not use this skill** for RBAC role choice (`azure-role-selector`), Defender posture
(`defender-for-cloud-hardening`), or Bicep / IaC templating.

## Pick the policy effect by goal

| Goal | Effect | Notes |
|---|---|---|
| Surface non-compliant resources without blocking | **Audit** | Reporting only; default starting point |
| Block creation / update of non-compliant resources | **Deny** | Preventive; test in Audit first |
| Add a required tag / property automatically | **Modify** (or `Append`) | Mutates the request |
| Deploy a missing related resource (e.g. diagnostic settings) | **DeployIfNotExists** (DINE) | Managed identity required |
| Surface a missing related resource | **AuditIfNotExists** (AINE) | Reporting only |
| Conditional logic across many resources | **Initiative** | Group multiple policies |
| Block guest user creation / specific SKUs | Deny + parameter | Parameterise allowed SKUs |
| Enforce Defender for Cloud baseline | Built-in **MCSB initiative** | Don't author your own |

> **Rule of thumb:** start with **Audit** on every new policy for 14-30 days. Review
> compliance. Move critical controls to **Deny**. Use **DeployIfNotExists** for things
> that should "just be there" (diagnostic settings, defender agents). Never start with Deny
> tenant-wide.

## Approach

1. **Use built-in initiatives where they exist** — **Microsoft Cloud Security Benchmark
   (MCSB)** is the default. Add regulatory initiatives (CIS, ISO 27001, NIST 800-53, PCI
   DSS, HIPAA) per compliance scope.
   *Verify: MCSB initiative assigned at root management group; compliance state visible in
   Defender for Cloud.*

2. **Author custom definitions only where built-ins don't exist** — Custom policy as ARM
   JSON: `policyRule` (condition + effect), `parameters` (reusable inputs), `metadata`
   (category). Keep policies single-purpose; group via initiatives.

3. **Initiatives = grouped policies** — Bundle related policies (e.g. "Enterprise security
   baseline" initiative containing 30 policies). Assign initiatives, not individual policies,
   for manageability.

4. **Scope at management group** — Assign at **management group** for inheritance across
   child subscriptions. Use exclusions sparingly with documented justification.
   *Verify: assignment scope visible in policy compliance; child subscriptions inherit.*

5. **Roll out: Audit → review → Deny** — Assign as **Audit** first. Wait 14-30 days, pull
   non-compliance list, work with workload owners to remediate or document exceptions. Then
   switch the assignment to **Deny**.
   *Verify: non-compliance count down to acceptable baseline before the Deny switch;
   workload owners notified.*

6. **Remediate existing resources with remediation tasks** — `DeployIfNotExists` and
   `Modify` policies only act on new / updated resources. Use **remediation tasks** to bring
   existing resources into compliance. The policy assignment's **managed identity** performs
   the change.
   *Verify: remediation task created post-assignment; success rate > 95%; failures triaged.*

7. **Monitor + integrate with Defender for Cloud** — Compliance state is the daily dashboard.
   Defender for Cloud uses policies for its recommendations - failing recommendation = failing
   policy.

## Guardrails
- **Test Deny policies in audit first - a broad Deny can block legitimate deployments and
  pipelines.** First Deny at midnight = production deployment blocked at 09:00.
- **Use parameters to make policies reusable across environments.** Hard-coded regions / SKUs
  / tag values = one policy per environment, drift guaranteed.
- **Don't over-exclude; each exclusion weakens the guardrail and should be justified.**
  Exclusions are an exception list - document the why, expire them.
- **DeployIfNotExists needs a managed identity with the right role.** Without the right RBAC
  on the assignment's identity, remediation silently fails.
- **Don't author what's already built in.** MCSB / regulatory initiatives are maintained;
  custom copies drift from Microsoft guidance.
- **Policy != RBAC.** Policy controls resource configuration; RBAC controls who can act.
  Both layers needed.

## Common anti-patterns
- **"Deploy Deny tenant-wide on day one"** - First production deployment fails. Audit
  first.
- **"One policy per environment, copy-paste"** - Hard-coded params, maintenance hell.
  Parameterise + one assignment per env.
- **"Skip the MCSB initiative - we have our own"** - Yours drifts; MCSB is Microsoft-
  maintained.
- **"Exclude the subscription that fails compliance"** - Hides the problem. Fix or
  formally accept the risk.
- **"DeployIfNotExists without remediation task"** - Existing resources stay non-compliant
  forever; only new ones get the configuration.
- **"Custom JSON without testing"** - First assignment of a syntax-error policy = no
  effect, no warning. Test in a sandbox subscription first.

## Example prompts
- `Create an Azure Policy initiative to enforce a security baseline at the management group scope.`
- `How do I deny non-compliant resources and auto-remediate with DeployIfNotExists?`
- `Apply governance guardrails at the management group scope with inheritance.`
- `Audit resource configuration before switching policies to Deny.`
- `Parameterise an allowed-locations policy for reuse across dev / test / prod.`
- `Build a remediation task to bring existing resources into compliance.`

## Microsoft Learn
- Azure Policy overview: https://learn.microsoft.com/azure/governance/policy/overview
- Policy effects: https://learn.microsoft.com/azure/governance/policy/concepts/effects
- Initiatives (policy sets): https://learn.microsoft.com/azure/governance/policy/concepts/initiative-definition-structure
- Remediation tasks: https://learn.microsoft.com/azure/governance/policy/how-to/remediate-resources
- Management group scope: https://learn.microsoft.com/azure/governance/management-groups/overview
- Microsoft Cloud Security Benchmark: https://learn.microsoft.com/security/benchmark/azure/overview
- DeployIfNotExists pattern: https://learn.microsoft.com/azure/governance/policy/how-to/programmatically-create
- Policy compliance: https://learn.microsoft.com/azure/governance/policy/how-to/get-compliance-data
