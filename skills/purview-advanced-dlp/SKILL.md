---
name: purview-advanced-dlp
description: "Guidance for advanced Microsoft Purview DLP capabilities - Adaptive Protection (risk-based DLP driven by Insider Risk), Exact Data Match, contextual conditions, and advanced Endpoint DLP egress controls. Covers dynamic, risk-adaptive enforcement and high-precision matching for mature programs. WHEN: advanced DLP, Adaptive Protection, risk-based DLP, Exact Data Match DLP, dynamic DLP enforcement, Insider Risk driven DLP, advanced Endpoint DLP, contextual DLP conditions, dynamic block actions."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Advanced DLP

Advanced DLP extends baseline policies with **risk-adaptive** and high-precision controls,
notably **Adaptive Protection**, which dynamically adjusts DLP enforcement based on a user's
**Insider Risk** level - so low-risk users get light controls and elevated-risk users get
stricter actions automatically.

## When to use
Moving from static DLP to dynamic, context-aware enforcement and high-precision matching for
mature data security programs that already have classification and baseline DLP working.

Do not use this skill to design a first DLP policy from scratch (use `purview-dlp-policy`) or to
stand up Insider Risk Management (use `insider-risk-baseline`).

## Pick the right advanced capability
| Goal | Use |
|---|---|
| Dynamic enforcement keyed to user risk | **Adaptive Protection** (IRM-driven) |
| High-precision match against your own records | **Exact Data Match (EDM)** SITs |
| Context-aware rules (label + recipient + volume) | **Contextual conditions** in DLP rules |
| Block USB / unsanctioned cloud / clipboard | **Advanced Endpoint DLP** egress controls |
| Stop paste into ChatGPT / unsanctioned AI | Endpoint DLP + DSPM for AI |

Rule of thumb: pick one advanced capability per quarter; layering Adaptive Protection, EDM, and
new Endpoint controls simultaneously makes failure attribution impossible.

## Approach
1. **Confirm prerequisites** - Baseline DLP in enforce mode for at least one workload; Insider
   Risk Management running with tuned indicators (for Adaptive Protection).
   *Verify: IRM is producing meaningful risk levels for a pilot population.*
2. **Adaptive Protection** - Integrate Insider Risk Management risk levels (minor/moderate/
   elevated) with DLP so low-risk users get light controls and elevated-risk users get stricter
   actions (e.g., block) automatically - minimising friction while focusing protection.
   *Verify: a test user moved to elevated triggers the stricter DLP rule branch.*
3. **Exact Data Match (EDM)** - Use EDM SITs to match against a hashed copy of your structured
   data (e.g., customer records) for high-precision, low-false-positive detection.
   *Verify: EDM schema definition uploaded, hash refresh succeeded, and test sample matches.*
4. **Contextual conditions** - Combine sensitivity labels, classifiers, content volume,
   recipient, and access scope for precise rules (e.g., "Confidential + external recipient +
   ≥5 SIT matches").
   *Verify: test events show the rule fires only on the intended combinations.*
5. **Endpoint egress controls** - Restrict copy to USB, upload to unsanctioned cloud/AI apps,
   network share, clipboard, and printing on managed endpoints.
   *Verify: a test paste of labelled content into an unsanctioned AI app is blocked or flagged.*
6. **Tune continuously** - Use Activity Explorer and alerts to refine; review override
   justifications weekly.
   *Verify: false-positive rate trends down month over month.*

## Guardrails
- Adaptive Protection requires Insider Risk Management configured and consented - plan privacy
  and pseudonymisation with legal/works councils before enabling.
- EDM requires schema definition, a hashed data upload, and a dedicated upload role - this is
  not a quick win and needs data-engineering ownership.
- Validate dynamic enforcement in audit/simulation before enabling block actions - dynamic block
  in production with no audit phase is a guaranteed incident.
- Endpoint DLP advanced controls (clipboard, USB, network share) need onboarded devices and
  E5 Compliance; mac and Windows behaviour can differ.
- Keep an exception path - business processes break; an override workflow with justification is
  required.

## Common anti-patterns
- Turning Adaptive Protection straight to "block on elevated" before IRM thresholds are tuned -
  blocks innocent users on noisy indicators.
- EDM with a 50-column schema and no refresh job - matches go stale silently.
- Stacking contextual conditions until nothing matches, then declaring DLP "doesn't work".
- Blocking clipboard tenant-wide without piloting on knowledge workers.
- No metrics on override frequency - tuning becomes guesswork.

## Example prompts
- `Configure risk-based DLP driven by Insider Risk Adaptive Protection.`
- `Set up Exact Data Match (EDM) for precise DLP detection.`
- `How do I add contextual conditions to advanced Endpoint DLP?`
- `Validate dynamic DLP enforcement in simulation before blocking.`
- `Block clipboard paste of Highly Confidential into unsanctioned AI on managed endpoints.`

## Microsoft Learn
- Adaptive Protection: https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection
- Exact Data Match: https://learn.microsoft.com/purview/sit-learn-about-exact-data-match-based-sits
- Endpoint DLP settings: https://learn.microsoft.com/purview/endpoint-dlp-learn-about
- DLP policy reference: https://learn.microsoft.com/purview/dlp-policy-reference
- Activity Explorer: https://learn.microsoft.com/purview/data-classification-activity-explorer
- Adaptive Protection in DLP: https://learn.microsoft.com/purview/dlp-adaptive-protection-learn
