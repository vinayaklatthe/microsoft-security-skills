---
name: threat-modelling
description: "Guidance for threat modelling using STRIDE and the Microsoft Security Development Lifecycle (SDL). Covers data-flow diagrams, trust boundaries, the STRIDE categories, mitigation mapping, and tooling (Microsoft Threat Modeling Tool). WHEN: threat modeling, STRIDE, data flow diagram, trust boundary, identify threats, SDL threat modeling, security design review, threat model a system, mitigation mapping, Microsoft Threat Modeling Tool, secure design review, design-time security. DO NOT USE for org-wide security architecture (use security-architecture) or for runtime detection (use sentinel / defender-xdr)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Threat Modelling (STRIDE / SDL)

Threat modelling is a structured Microsoft Security Development Lifecycle (SDL) practice for
identifying, communicating, and mitigating threats early in design - before code is written, and
re-applied whenever the design materially changes.

## When to use
Designing a new system, significantly changing an existing one, evaluating an architecture for
security, or running a formal security design review.

**Do not use this skill** for:
- Org-wide security architecture or roadmap (use `security-architecture`)
- Runtime detection or incident response (use `sentinel` / `defender-xdr`)
- Code-level vulnerability scanning (use SAST/DAST tooling)

## STRIDE - the six categories at a glance

| Letter | Threat | Security property it breaks | Typical mitigation |
|---|---|---|---|
| **S** | Spoofing | Authentication | MFA, mutual TLS, signed tokens |
| **T** | Tampering | Integrity | Signing, hashing, write-protected stores |
| **R** | Repudiation | Non-repudiation | Audit logging, signed transactions |
| **I** | Information disclosure | Confidentiality | Encryption (rest+transit), authorization |
| **D** | Denial of service | Availability | Rate limiting, quotas, autoscale, WAF |
| **E** | Elevation of privilege | Authorization | Least privilege, input validation, sandboxing |

> **Rule of thumb:** walk each element of the data-flow diagram against **all six** STRIDE
> categories. Skipping categories because "they don't apply here" is the most common way real
> threats are missed.

## Approach

1. **Define scope and assumptions** - State what is in scope, what is out, the trust model
   (who you trust to do what), and the assets being protected. A threat model without scope is
   an opinion.
   *Verify: a one-page scope statement names assets, actors, in-scope components, and explicit
   out-of-scope items.*
2. **Build the data-flow diagram (DFD)** - Draw external entities, processes, data stores, data
   flows, and **trust boundaries**. Trust boundaries are where authority/data crosses between
   principals - that is where most threats live.
   *Verify: every data flow crossing a trust boundary is highlighted; no boundary-crossing
   flow is missing.*
3. **Enumerate threats with STRIDE per element** - For each element/flow, walk through all six
   STRIDE categories. For each applicable threat, write a one-line description.
   *Verify: every element has been evaluated against all six letters; you can show the
   coverage matrix.*
4. **Rank threats by risk** - Use DREAD or a simple high/medium/low based on likelihood and
   impact. Triage so the team works the top tier first.
   *Verify: top 10 threat list is risk-ranked, not order-of-discovery.*
5. **Map each threat to a concrete mitigation** - Mitigation = a specific control (MFA, input
   validation, signing, encryption, rate limiting, least privilege) plus an owner and a target
   date. Abstract "we should secure that" is not a mitigation.
   *Verify: every top-tier threat has a named mitigation, an owner, and an implementation
   target.*
6. **Validate mitigations are implemented** - During build, confirm each mitigation lands in
   code, configuration, or process. During review, test that the mitigation actually blocks
   the threat (negative test).
   *Verify: mitigation tests exist in the test suite or in a security review checklist.*
7. **Re-model on material change** - Treat threat modelling as **iterative**. Every new trust
   boundary, new external integration, new data classification, or major refactor is a trigger
   to re-model the affected slice.
   *Verify: the team has a written trigger list and the model is updated after the most recent
   trigger event.*
8. **Use tooling where it helps** - The **Microsoft Threat Modeling Tool** generates STRIDE
   threats per DFD element automatically. Threat-modelling cards / templates work well for
   workshops without tooling.

## Guardrails
- Threat modelling is **iterative** - revisit each major design change, not once at project
  start. A model frozen at design time has no relationship to the shipped system.
- Capture assumptions and out-of-scope items **explicitly** - undocumented assumptions are the
  next year's security incidents.
- Tie threats to **actionable** mitigations with owners and dates, not abstract risks.
- **Walk all six STRIDE letters per element** - skipping categories is the most common gap.
- Threat modelling is **not** a substitute for code review, dependency scanning, or pen
  testing. It complements them by shaping what to test.
- The output is the **shared understanding**, not the document. If the dev team cannot explain
  the top threats verbally, the model has not landed.

## Common anti-patterns
- **"We did a threat model at project kickoff"** - and never updated it. The system being
  threat-modelled no longer exists.
- **A 200-threat spreadsheet with no ranking.** Nothing gets fixed because everything looks
  equal. Triage is the deliverable.
- **STRIDE letters skipped because "they don't apply."** Force the walk; document why a
  category genuinely does not apply rather than skipping silently.
- **Mitigation = "use TLS".** Not a mitigation. Mitigation = TLS 1.2+ enforced on the gateway
  with cipher suite X, validated by test Y, owned by Z.
- **Threat model as a security-team artefact** that engineering never reads. The dev team must
  own the model; security facilitates.

## Example prompts
- `Run a STRIDE threat model with a data flow diagram and trust boundaries.`
- `Use the Microsoft Threat Modeling Tool for a design review.`
- `How do I identify threats and map mitigations for a new system?`
- `Conduct an SDL threat modelling session.`
- `What does the E in STRIDE cover and how is it mitigated?`

## Microsoft Learn
- Microsoft Threat Modeling Tool: https://learn.microsoft.com/azure/security/develop/threat-modeling-tool
- Threat Modeling Tool threats reference: https://learn.microsoft.com/azure/security/develop/threat-modeling-tool-threats
- Threat Modeling Tool mitigations: https://learn.microsoft.com/azure/security/develop/threat-modeling-tool-mitigations
- Microsoft SDL: https://www.microsoft.com/securityengineering/sdl
- SDL practices: https://www.microsoft.com/securityengineering/sdl/practices
