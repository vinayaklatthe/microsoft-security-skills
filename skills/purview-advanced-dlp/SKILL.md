---
name: purview-advanced-dlp
description: "Guidance for advanced Microsoft Purview DLP capabilities — Adaptive Protection (risk-based DLP driven by Insider Risk), Exact Data Match, contextual conditions, and Endpoint DLP egress controls. Covers dynamic, risk-adaptive enforcement. WHEN: advanced DLP, Adaptive Protection, risk-based DLP, Exact Data Match DLP, dynamic DLP enforcement, Insider Risk driven DLP, advanced Endpoint DLP, contextual DLP conditions."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Advanced DLP

Advanced DLP extends baseline policies with **risk-adaptive** and high-precision controls,
notably **Adaptive Protection**, which dynamically adjusts DLP enforcement based on a user's
**Insider Risk** level.

## When to use
Moving from static DLP to dynamic, context-aware enforcement and high-precision matching for
mature data security programs.

## Approach
1. **Adaptive Protection** — Integrate Insider Risk Management risk levels (minor/moderate/
   elevated) with DLP so low-risk users get light controls and elevated-risk users get stricter
   actions (e.g., block) automatically — minimising friction while focusing protection.
2. **Exact Data Match (EDM)** — Use EDM SITs to match against a hashed copy of your structured
   data (e.g., customer records) for high-precision, low-false-positive detection.
3. **Contextual conditions** — Combine sensitivity labels, classifiers, content volume, recipient,
   and access scope for precise rules.
4. **Endpoint egress controls** — Restrict copy to USB, upload to unsanctioned cloud/AI apps,
   network share, clipboard, and printing on managed endpoints.
5. **Tune continuously** — Use Activity Explorer and alerts to refine.

## Guardrails
- Adaptive Protection requires Insider Risk Management configured and consented — plan privacy
  and pseudonymisation.
- EDM requires schema definition, a hashed data upload, and a dedicated upload role.
- Validate dynamic enforcement in audit/simulation before enabling block actions.

## Example prompts
- `Configure risk-based DLP driven by Insider Risk Adaptive Protection.`
- `Set up Exact Data Match (EDM) for precise DLP detection.`
- `How do I add contextual conditions to advanced Endpoint DLP?`
- `Validate dynamic DLP enforcement in simulation before blocking.`

## Microsoft Learn
- Adaptive Protection: https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection
- Exact Data Match: https://learn.microsoft.com/purview/sit-learn-about-exact-data-match-based-sits
- Endpoint DLP settings: https://learn.microsoft.com/purview/endpoint-dlp-learn-about
- DLP policy reference: https://learn.microsoft.com/purview/dlp-policy-reference
