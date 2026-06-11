---
name: threat-modelling
description: "Guidance for threat modelling using STRIDE and the Microsoft Security Development Lifecycle (SDL). Covers data-flow diagrams, trust boundaries, the STRIDE categories, mitigation mapping, and tooling. WHEN: threat modeling, STRIDE, data flow diagram, trust boundary, identify threats, SDL threat modeling, security design review, threat model a system, mitigation mapping, Microsoft Threat Modeling Tool."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Threat Modelling (STRIDE / SDL)

Threat modelling is a structured practice in the Microsoft Security Development Lifecycle (SDL)
for identifying, communicating, and mitigating threats early in design — before code is written.

## When to use
Designing or significantly changing a system, evaluating architecture security, or running a
security design review.

## Approach
1. **Define scope & diagram** — Build a **data-flow diagram (DFD)**: external entities,
   processes, data stores, data flows, and **trust boundaries**.
2. **Enumerate threats with STRIDE** — For each element/flow, ask which apply:
   - **S**poofing → authentication
   - **T**ampering → integrity
   - **R**epudiation → non-repudiation / logging
   - **I**nformation disclosure → confidentiality
   - **D**enial of service → availability
   - **E**levation of privilege → authorization
3. **Rank & mitigate** — Prioritise by risk and map each threat to a concrete mitigation
   (e.g., MFA, input validation, signing, encryption, rate limiting, least privilege).
4. **Validate** — Confirm mitigations are implemented and re-model when the design changes.
5. **Tooling** — Use the Microsoft Threat Modeling Tool, or Threat Modeling cards / templates.

## Guardrails
- Threat modelling is iterative — revisit each major design change, not once.
- Capture assumptions and out-of-scope items explicitly.
- Tie threats to **actionable** mitigations and owners, not abstract risks.

## Microsoft Learn
- Threat modelling (SDL): https://learn.microsoft.com/azure/security/develop/threat-modeling-tool
- Microsoft SDL: https://www.microsoft.com/securityengineering/sdl
- STRIDE / Threat Modeling Tool: https://learn.microsoft.com/azure/security/develop/threat-modeling-tool
- Threat Modeling Tool threats: https://learn.microsoft.com/azure/security/develop/threat-modeling-tool-threats
