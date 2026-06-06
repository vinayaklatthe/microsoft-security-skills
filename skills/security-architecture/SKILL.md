---
name: security-architecture
description: "Guidance for designing security architecture using Zero Trust principles, the Microsoft Cybersecurity Reference Architectures (MCRA), and Cloud Adoption Framework / Well-Architected security guidance. Covers the Zero Trust pillars, defense-in-depth, and reference architecture alignment. WHEN: security architecture, Zero Trust design, MCRA, defense in depth, security reference architecture, CAF secure methodology, Well-Architected security pillar, end-to-end security design, security strategy."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Security Architecture (Zero Trust & MCRA)

Security architecture defines how identity, endpoints, data, apps, infrastructure, and network
controls combine to protect an organisation — anchored to **Zero Trust** and Microsoft reference
architectures.

## When to use
Designing an end-to-end security target state, aligning a roadmap to a recognised framework, or
reviewing an architecture for gaps.

## Approach
1. **Apply Zero Trust principles** — *Verify explicitly*, *use least-privilege access*, *assume
   breach*. Design across the six pillars: **identity, endpoints, data, apps, infrastructure,
   network**, with visibility/analytics and automation across all.
2. **Anchor to MCRA** — Use the **Microsoft Cybersecurity Reference Architectures** to map
   capabilities (Defender, Sentinel, Entra, Purview, Intune, Defender for Cloud) to functions and
   to validate coverage.
3. **Align to frameworks** — Use the **Cloud Adoption Framework Secure methodology** for strategy/
   program, and the **Well-Architected Framework Security pillar** for workload-level design.
4. **Defense in depth** — Layer preventive, detective, and responsive controls; avoid single
   points of failure.
5. **Roadmap** — Sequence by risk and dependency; define a current → target maturity path.

## Guardrails
- Architecture must be driven by business risk and data sensitivity, not product inventory.
- Validate identity is the primary control plane before investing heavily elsewhere.
- Ensure monitoring/response (SIEM/XDR) is designed in, not bolted on.

## Microsoft Learn
- Zero Trust overview: https://learn.microsoft.com/security/zero-trust/zero-trust-overview
- MCRA: https://learn.microsoft.com/security/adoption/mcra
- CAF Secure methodology: https://learn.microsoft.com/azure/cloud-adoption-framework/secure/
- Well-Architected security pillar: https://learn.microsoft.com/azure/well-architected/security/
