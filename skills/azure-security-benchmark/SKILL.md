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
Microsoft's canonical, prescriptive set of cloud security best practices, with controls mapped to
industry frameworks (CIS, NIST SP 800-53, PCI DSS) and monitored natively in Microsoft Defender
for Cloud.

## When to use
Establishing a cloud security baseline and measuring posture against a recognised, framework-mapped
control set.

## Control domains (selected)
Network security, Identity management, Privileged access, Data protection, Asset management,
Logging & threat detection, Incident response, Posture & vulnerability management, Endpoint
security, Backup & recovery, DevOps security, and Governance & strategy.

## Approach
1. **Adopt MCSB in Defender for Cloud** — MCSB is the default initiative; review your
   **Secure Score** and recommendations mapped to its controls.
2. **Use service baselines** — Apply per-service security baselines that translate MCSB controls
   into concrete service configuration.
3. **Remediate by priority** — Address high-impact recommendations first; track Secure Score.
4. **Add regulatory standards** — Layer additional compliance standards (e.g., CIS, NIST, PCI) in
   Defender for Cloud's Regulatory Compliance dashboard.
5. **Govern** — Enforce with **Azure Policy**; assign owners and remediation timelines.

## Guardrails
- MCSB is a baseline, not a substitute for workload-specific threat modelling.
- Map MCSB to your obligated frameworks rather than treating each separately.
- Secure Score is directional — validate that recommended fixes suit each workload.

## Example prompts
- `Map my Azure controls to the Microsoft Cloud Security Benchmark (MCSB).`
- `How does MCSB align to CIS and NIST controls?`
- `Use the Defender for Cloud regulatory compliance dashboard against MCSB.`
- `Which security baseline controls should I prioritise first?`

## Microsoft Learn
- MCSB overview: https://learn.microsoft.com/security/benchmark/azure/overview
- Introduction & controls: https://learn.microsoft.com/security/benchmark/azure/introduction
- Security baselines: https://learn.microsoft.com/security/benchmark/azure/security-baselines-overview
- Regulatory compliance in Defender for Cloud: https://learn.microsoft.com/azure/defender-for-cloud/regulatory-compliance-dashboard
