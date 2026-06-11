---
name: azure-security-benchmark
description: "Guidance for the Microsoft Cloud Security Benchmark (MCSB) — Microsoft's canonical set of cloud security best-practice controls mapped to industry frameworks and monitored in Microsoft Defender for Cloud. Covers control domains, applying the benchmark, and compliance tracking. WHEN: Microsoft Cloud Security Benchmark, MCSB, Azure Security Benchmark, security baseline controls, CIS NIST mapping, Defender for Cloud regulatory compliance, cloud security best practices, security controls framework."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Cloud Security Benchmark (MCSB)

The Microsoft Cloud Security Benchmark (MCSB, successor to the Azure Security Benchmark) is
Microsoft's canonical, prescriptive set of cloud security best practices, with controls mapped
to CIS, NIST SP 800-53, PCI DSS, and ISO 27001, and monitored natively in Microsoft Defender
for Cloud. MCSB is the **default initiative** in Defender for Cloud - you are already being
scored against it.

## When to use
Use this skill when the user wants a recognised, framework-mapped cloud security baseline,
needs to translate compliance obligations into concrete Azure controls, or is trying to
prioritise where to start with Defender for Cloud recommendations.

**Do not use this skill** for:
- Tactical Defender for Cloud remediation work (use `defender-for-cloud-hardening`)
- Azure Policy authoring details (use `azure-policy`)
- Workload-specific threat modelling (use `threat-modelling`)

## Pick the right MCSB control domain first

MCSB has 12 control domains. Do not try to fix them in parallel - pick by **risk + dependency**:

| Priority | Domain | Why this order | Typical first action |
|---|---|---|---|
| **P0** | Identity Management + Privileged Access | Identity is the new perimeter; admin compromise = game over | Enforce MFA, remove standing Global Admin via PIM |
| **P0** | Logging & Threat Detection | Cannot respond without visibility | Enable diagnostic settings on subscriptions + Sentinel/Defender |
| **P1** | Network Security | Reduces blast radius of compromised identities | Default-deny NSGs, private endpoints for PaaS |
| **P1** | Data Protection | Encryption, key management, classification | Customer-managed keys for crown-jewel data, sensitivity labels |
| **P1** | Asset Management | Cannot protect what you cannot see | Tag policy + resource inventory |
| **P2** | Posture & Vulnerability Management | Continuous improvement loop | Onboard Defender for Servers, weekly Secure Score review |
| **P2** | Endpoint Security + Backup & Recovery | Resilience baseline | Defender for Endpoint + Azure Backup with immutable vault |
| **P2** | Incident Response | Process maturity | Runbook + tabletop with Defender XDR / Sentinel |
| **P3** | DevOps Security | Shift-left controls | GitHub Advanced Security or Azure DevOps with Defender for DevOps |
| **P3** | Governance & Strategy | Sustains the others | Azure Policy + management group structure |

> **Rule of thumb:** an MCSB Secure Score of **65-75%** is a realistic working target for a
> mature tenant; **>85%** typically means you are auditing recommendations that do not apply
> to your workloads. Validate before chasing 100%.

## Approach

1. **Confirm MCSB is the active baseline** — In Defender for Cloud → Regulatory compliance,
   MCSB is enabled by default but a tenant may have disabled it. Re-enable if missing.
   *Verify: Regulatory compliance dashboard shows "Microsoft cloud security benchmark" as an
   active standard with current pass/fail percentages.*
2. **Baseline your Secure Score** — Note current score per subscription and per control domain.
   This is the number you will move; without a baseline you cannot prove progress to leadership.
   *Verify: screenshot or export of Secure Score per subscription before remediation starts.*
3. **Map MCSB to the frameworks you are obligated to** — Do not treat CIS, NIST, ISO, PCI as
   separate workstreams. Use MCSB as the **canonical implementation** and the per-framework
   mappings to evidence compliance. Reduces 4 audits worth of work to 1.
   *Verify: Regulatory compliance dashboard shows your obligated frameworks alongside MCSB
   with overlap visible.*
4. **Triage by the priority table above** — Work P0 domains across all subscriptions first.
   Within each domain, sort recommendations by **Secure Score impact** (descending) and
   **affected resources** (descending). Top 5 per domain = quarter's work for most teams.
5. **Use service baselines for the implementation detail** — MCSB controls are abstract
   ("Enable encryption in transit"). The per-service **security baselines** translate to
   concrete Azure config (e.g. App Service: TLS 1.2 minimum, HTTPS-only on). Always read the
   service baseline before designing the fix.
   *Verify: a deployed resource passes its service baseline check in Defender for Cloud.*
6. **Enforce with Azure Policy** — Recommendations alone do not prevent regression. Promote
   each remediated control to a policy in **Audit** mode for 2 weeks, then **Deny** or
   **DeployIfNotExists**. This is what stops the next deployment breaking your score.
   *Verify: a test deployment that violates the policy is blocked (Deny) or auto-remediated
   (DeployIfNotExists).*
7. **Govern the programme** — Assign a domain owner per MCSB control domain. Monthly
   Secure Score review at security council. Quarterly framework-mapping reconciliation when
   compliance audits approach.

## Guardrails
- **MCSB is a baseline, not a workload threat model.** A 100% Secure Score does not mean
  your application is secure - it means your platform configuration meets defaults. Pair
  with `threat-modelling` for workload-specific risk.
- **Secure Score is directional, not gospel.** Some recommendations do not apply to all
  workloads (e.g. "Enable Microsoft Defender for SQL" is irrelevant for a tenant with no
  SQL). Use the "Not applicable" workflow rather than ignoring.
- **Recommendations affect cost.** Enabling Defender plans, Customer-Managed Keys, and
  immutable backup vaults add real Azure spend. Cost-model before mass-enabling.
- **Do not rely on Quick Fix for production.** Defender for Cloud's auto-remediate Quick Fix
  is great for dev/test; in production review the underlying Bicep/ARM change first.
- **Map first, remediate second.** Walking into a remediation sprint without the
  framework-mapping work means duplicating effort the next time an auditor walks in.
- **Service baselines lag the platform.** Treat baselines as a strong default, but check the
  service's own "Security best practices" doc for newer guidance.

## Common anti-patterns
- **"Chase 100% Secure Score."** Diminishing returns past ~75-85%; teams burn out auditing
  recommendations that do not apply.
- **"Treat MCSB and CIS as separate projects."** Doubles effort; MCSB *is* the implementation
  layer, CIS is one of many output mappings.
- **"Enable all Defender plans without budgeting."** Bill surprise next month, then a
  scramble to disable - which destroys your score and the programme credibility.
- **"Recommendations without policies."** Fix today, new deployment regresses tomorrow.
  Policy is what makes the fix stick.
- **"Ignore Not Applicable."** Score gets dragged down by recommendations that should be
  formally excluded, masking the real gaps.

## Example prompts
- `Map my Azure controls to the Microsoft Cloud Security Benchmark (MCSB).`
- `How does MCSB align to CIS and NIST controls?`
- `Use the Defender for Cloud regulatory compliance dashboard against MCSB.`
- `Which MCSB control domains should I prioritise first?`
- `What is a realistic Secure Score target for my tenant?`
- `Enforce MCSB controls with Azure Policy.`

## Microsoft Learn
- MCSB overview: https://learn.microsoft.com/security/benchmark/azure/overview
- Introduction & controls: https://learn.microsoft.com/security/benchmark/azure/introduction
- Service security baselines: https://learn.microsoft.com/security/benchmark/azure/security-baselines-overview
- Regulatory compliance dashboard: https://learn.microsoft.com/azure/defender-for-cloud/regulatory-compliance-dashboard
- Secure Score in Defender for Cloud: https://learn.microsoft.com/azure/defender-for-cloud/secure-score-security-controls
- Quick Fix remediation: https://learn.microsoft.com/azure/defender-for-cloud/implement-security-recommendations
