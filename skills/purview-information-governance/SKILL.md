---
name: purview-information-governance
description: "Guidance for an end-to-end Microsoft Purview information governance / information protection strategy - sequencing classification, labelling, protection, lifecycle, and risk into a coherent program aligned to the Zero Trust data pillar. Covers maturity-based rollout sequencing, ownership, and metrics. WHEN: information governance, information protection strategy, data protection program, sequence Purview rollout, MIP strategy, protect and govern data end to end, Zero Trust data pillar program, Purview roadmap, data security maturity."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Information Governance (Strategy)

Information governance ties Purview classification, protection, lifecycle, and insider risk into
one coherent program so sensitive data is **known, protected, governed, and defensibly retained** -
anchored to the Zero Trust **Data** pillar. This skill is about sequencing, not feature deep-dives.

## When to use
Planning a multi-workstream Purview rollout, building a maturity roadmap, or rationalising an
in-flight deployment that is delivering features in isolation rather than outcomes.

Do not use this skill for individual feature configuration - jump to the specific Purview skill
(labels, DLP, lifecycle, IRM, DSPM for AI) once the sequencing question is settled.

## Pick the right entry point for the program
| Current state | Start here |
|---|---|
| No classification, no labels | Phase 1: Know - SITs + sensitivity label taxonomy in audit mode |
| Labels exist but adoption is low | Phase 1.5: auto-labelling in simulation + user training |
| Labels adopted, no DLP | Phase 2: Protect - DLP per workload in simulation, then enforce |
| DLP live, no retention | Phase 3: Govern - retention policies + records (file plan) |
| All of the above, Copilot rolling out | Phase 4: Manage AI risk - DSPM for AI + oversharing remediation |
| All above + insider concerns | Phase 5: IRM + Adaptive Protection |

Rule of thumb: each phase requires the previous one to be at "audit/simulation works" maturity.
You cannot block what you cannot classify.

## Approach
1. **Know your data** - Deploy classification: SITs, trainable classifiers, EDM, and use
   Content/Activity Explorer to understand what sensitive data exists and where.
   *Verify: Content Explorer shows non-trivial counts for your top SITs across SharePoint/OneDrive/Exchange.*
2. **Protect your data** - Roll out a **sensitivity label** taxonomy with marking/encryption,
   then layer **DLP** to prevent exfiltration of labelled/SIT content.
   *Verify: top-tier label adoption visible; DLP audit-mode policies producing real (not noise) matches.*
3. **Govern your data** - Apply **retention and records** policies for defensible retain/delete;
   prefer adaptive scopes so policies stay current.
   *Verify: retention policies show coverage stats per workload; disposition review running.*
4. **Manage risk** - Add Insider Risk Management and Communication Compliance for people-centric
   risk; add DSPM for AI as Copilot/genAI adoption grows.
   *Verify: IRM alerts being triaged; DSPM for AI recommendations being actioned.*
5. **Operate as a program** - Establish stewardship per business unit, monthly review cadences,
   and a metrics dashboard (coverage, label adoption, DLP incident trends, time-to-disposition).
   *Verify: a named exec owner reviews metrics quarterly and approves the next-phase scope.*

## Guardrails
- Don't start with enforcement - classification maturity must precede DLP blocking and
  auto-labelling; otherwise you will tune false positives in production.
- Govern by data sensitivity and regulation, not by what's licensed - inventory regulatory
  obligations first (GDPR, HIPAA, PCI, sector rules) and map controls back.
- Treat it as a program with owners and change management, not a one-off configuration - feature
  toggles without business sponsorship will stall at pilot.
- Pair every label/DLP rollout with user-facing communication; silent enforcement breeds
  workarounds.
- Resist scope creep: ship Phase 1 before designing Phase 4. A working Phase 1 unlocks everything.

## Common anti-patterns
- Buying E5, enabling everything, and calling that a "strategy".
- Building a 9-tier label taxonomy nobody can apply correctly.
- Deploying DLP in block mode on day one - generates incidents and political damage.
- Treating Purview as IT-owned with no business data owners or stewards.
- Skipping metrics; without coverage data, leadership cannot fund the next phase.

## Example prompts
- `Sequence a Microsoft Purview information protection rollout.`
- `Design a data protection program for the Zero Trust data pillar.`
- `How do I protect and govern data end to end with Purview?`
- `Plan an MIP strategy across classify, protect, and govern.`
- `What is the right Purview phase to start if we have no labels today?`

## Microsoft Learn
- Protect & govern data with Purview: https://learn.microsoft.com/purview/purview
- Information protection: https://learn.microsoft.com/purview/information-protection
- MIP deployment guidance: https://learn.microsoft.com/purview/information-protection-solution
- Zero Trust data pillar: https://learn.microsoft.com/security/zero-trust/deploy/data
- Data lifecycle management: https://learn.microsoft.com/purview/data-lifecycle-management
- Insider Risk Management: https://learn.microsoft.com/purview/insider-risk-management
