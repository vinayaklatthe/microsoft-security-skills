---
name: security-architecture
description: "Guidance for designing security architecture using Zero Trust, the Microsoft Cybersecurity Reference Architectures (MCRA), Cloud Adoption Framework Secure methodology, and Well-Architected Security pillar. Covers the six Zero Trust pillars, defense-in-depth, and reference architecture alignment. WHEN: security architecture, Zero Trust design, MCRA, defense in depth, security reference architecture, CAF secure methodology, Well-Architected security pillar, end-to-end security design, security strategy, target state. DO NOT USE for tactical product configuration (use the product-specific skill) or for SOC tooling design (use sentinel / unified-secops-platform)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Security Architecture (Zero Trust & MCRA)

Security architecture defines how identity, endpoints, data, apps, infrastructure, and network
controls combine to protect an organisation - anchored to **Zero Trust** and the **Microsoft
Cybersecurity Reference Architectures (MCRA)**, with delivery scaffolding from the **Cloud
Adoption Framework Secure methodology** and workload-level rigour from the **Well-Architected
Framework Security pillar**.

## When to use
Designing an end-to-end security target state, aligning a multi-year roadmap to a recognised
framework, or reviewing an architecture for gaps before a major programme of work.

**Do not use this skill** for:
- Tactical product configuration (use the product-specific skill, e.g. `defender-xdr`, `sentinel`)
- SOC tooling architecture only (use `unified-secops-platform`)
- Single-workload code review (use `threat-modelling`)

## Pick the right framework for the conversation

| Question being asked | Use this framework | Output |
|---|---|---|
| What is our **3-year security target state**? | MCRA + CAF Secure | Capability map + roadmap |
| What capabilities cover **identity / endpoints / data / apps / infra / network**? | Zero Trust six pillars | Pillar maturity heatmap |
| How do we deliver the programme (strategy → operate)? | CAF Secure methodology | Workstream plan |
| Is this **single workload** designed securely? | Well-Architected Security pillar | Workload review |
| What threats apply to a **specific design**? | STRIDE / SDL (use `threat-modelling`) | Threat model |
| Are we meeting a **regulatory baseline**? | Microsoft Cloud Security Benchmark | Compliance evidence |

> **Rule of thumb:** Zero Trust is the **principles** layer. MCRA is the **capability** layer.
> CAF Secure is the **delivery** layer. Well-Architected is the **workload** layer. A real
> architecture uses all four - do not try to substitute one for another.

## Approach

1. **Anchor on Zero Trust principles first** - *Verify explicitly*, *use least-privilege
   access*, *assume breach*. Every later decision must trace back to one of these.
   *Verify: every control in your design can be tagged to one of the three principles. If it
   cannot, ask why it exists.*
2. **Map the six Zero Trust pillars** - **identity, endpoints, data, apps, infrastructure,
   network**, with visibility/analytics and automation across all. Score current maturity per
   pillar (Traditional / Advanced / Optimal) so investment lands where the gap is widest.
   *Verify: pillar heatmap shows clear deltas; you can name the top two pillars to invest in.*
3. **Validate identity is the primary control plane** - if identity is weak, no other pillar
   compensates. Confirm MFA coverage, privileged access design (PIM, PAW), and Conditional
   Access posture before investing heavily in network, data, or endpoint pillars.
   *Verify: % of human accounts behind phishing-resistant MFA and % of privileged accounts in
   PIM are baselined and on a roadmap.*
4. **Anchor capabilities to MCRA** - Use the Microsoft Cybersecurity Reference Architectures to
   map Microsoft products (Defender, Sentinel, Entra, Purview, Intune, Defender for Cloud) to
   the functions they cover and to validate no capability is missing or duplicated.
   *Verify: MCRA poster overlaid with your current/planned products shows zero unaddressed
   functions in your scope.*
5. **Build defense in depth** - layer preventive, detective, and responsive controls so no
   single control failure equals a breach. For each asset class, name at least one preventive
   and one detective control.
   *Verify: removing any one control still leaves a detection or compensating control in place.*
6. **Sequence the roadmap by risk and dependency** - Current state → target state per pillar,
   ordered so prerequisites land first (e.g. identity hygiene before data classification, log
   ingestion before XDR, posture management before automation).
   *Verify: roadmap shows ordered milestones with named owners and risks; not a flat backlog.*
7. **Build monitoring and response in, not on** - the SIEM/XDR architecture is part of the
   design, not a follow-up project. Confirm log sources, retention, and response handoffs.
   *Verify: every pillar produces signals into a documented detection pipeline.*

## Guardrails
- **Architecture must be driven by business risk and data sensitivity** - not product
  inventory, vendor pressure, or "what we already own". Start from the threat and the asset,
  then pick the control.
- **Identity is non-negotiable.** No Zero Trust architecture works if MFA, privileged access,
  and Conditional Access are weak. Fix this pillar first.
- **Visibility and automation are cross-cutting** - they are not a seventh pillar but a
  prerequisite for all six. Design log ingestion and orchestration up front.
- **Defense in depth, not defence in expense** - layered controls only count if each layer
  detects/blocks a different class of failure. Two SIEMs are not defence in depth.
- **A roadmap without owners is a wish list.** Every milestone needs a named owner and a
  measurable exit criterion.
- **Re-baseline annually.** MCRA, CAF Secure, and the Zero Trust pillars all evolve - last
  year's reference architecture is not this year's.

## Common anti-patterns
- **"We bought Defender / Sentinel so we are Zero Trust."** Products do not equal architecture.
  Without the principles, pillars, and operating model, you have shelfware.
- **Investing in network or data pillars while identity remains weak.** Adversaries pivot
  through the weakest pillar; identity is almost always it.
- **Treating the SIEM as an afterthought.** Detection retrofitted to an existing design has
  blind spots that are expensive to close later.
- **A 60-page architecture document with no roadmap.** Architecture without sequencing is not
  actionable. Pair every target state with the next 90 days of work.
- **Using Well-Architected as the org-wide framework.** WAF is workload-level; use CAF Secure
  for the programme view.

## Example prompts
- `Design a Zero Trust security architecture aligned to MCRA.`
- `Apply the Cloud Adoption Framework secure methodology to our 3-year roadmap.`
- `How do I build defence in depth across identity, network, and data?`
- `Review my workload design against the Well-Architected security pillar.`
- `Score our current state across the six Zero Trust pillars.`

## Microsoft Learn
- Zero Trust overview: https://learn.microsoft.com/security/zero-trust/zero-trust-overview
- MCRA (Microsoft Cybersecurity Reference Architectures): https://learn.microsoft.com/security/adoption/mcra
- CAF Secure methodology: https://learn.microsoft.com/azure/cloud-adoption-framework/secure/
- Well-Architected Security pillar: https://learn.microsoft.com/azure/well-architected/security/
- Microsoft Cloud Security Benchmark: https://learn.microsoft.com/security/benchmark/azure/
- Zero Trust deployment guides: https://learn.microsoft.com/security/zero-trust/deploy/overview
