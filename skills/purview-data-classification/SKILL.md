---
name: purview-data-classification
description: "Guidance for Microsoft Purview data classification and sensitivity labels - sensitive information types (SITs), trainable classifiers, exact data match, and sensitivity label taxonomy with auto-labelling. Covers building a label taxonomy, picking detection methods, and rolling out auto-labelling in simulation. WHEN: data classification, sensitivity labels, sensitive information types, SIT, trainable classifier, exact data match EDM, auto-labelling, label taxonomy, classify data, information protection labels, MIP labels."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Data Classification & Sensitivity Labels

Classification identifies sensitive content; **sensitivity labels** apply persistent protection
(visual marking, encryption, access, and downstream DLP/lifecycle controls). Together they are
the foundation of Microsoft Information Protection and every Purview enforcement story.

## When to use
Defining what data is sensitive and applying a consistent label taxonomy across Microsoft 365,
Power BI/Fabric, and (via Purview Data Map) the broader estate.

Do not use this skill for AI prompt visibility (use `purview-dspm-ai`) or for full strategy
sequencing (use `purview-information-governance`).

## Pick the right detection method
| Use case | Method |
|---|---|
| Well-known regulated patterns (credit card, NI, SSN, IBAN) | **Sensitive Information Types (SITs)** - built-in |
| Org-specific keywords / regex | **Custom SITs** with confidence tuning |
| Concept-based ("this looks like a contract") | **Trainable classifiers** (built-in or custom) |
| Match against your own customer/HR list | **Exact Data Match (EDM)** - hashed structured data |
| Hybrid - regex + supporting evidence | SIT with **named entities** + proximity |

Rule of thumb: SITs for patterns, classifiers for concepts, EDM for "is this row from our actual
customer table". Don't try to make one method do all three jobs.

## Approach
1. **Inventory regulatory and business drivers** - List the data types you must detect (GDPR PII,
   PCI, IP, HR) and map each to a detection method.
   *Verify: each detection candidate has a named business owner.*
2. **Choose detection methods** - Pick SITs, trainable classifiers, or EDM per data type; build
   or tune confidence levels.
   *Verify: a test corpus of true and false positives is prepared per detector.*
3. **Design a label taxonomy** - Keep it simple (e.g., Public / General / Confidential /
   Highly Confidential) with sub-labels; define markings, encryption, and scope per label.
   *Verify: ≤4 top-level labels, ≤3 sub-labels each, named with business language not jargon.*
4. **Publish labels** - Use label policies to scope labels to users; set defaults and mandatory
   labelling where appropriate; configure mandatory-label justification.
   *Verify: pilot users see the label menu in Word/Outlook with the correct default.*
5. **Auto-labelling** - Use **client-side** (recommended/automatic in apps) and **service-side**
   auto-labelling (SharePoint/OneDrive/Exchange) based on SITs/classifiers; always start in
   simulation.
   *Verify: simulation reports show match counts per label and per source; review false-positive sample.*
6. **Roll out in waves** - Pilot department -> business unit -> tenant; pair every wave with
   training and a feedback channel.
   *Verify: label adoption metric per wave > target before promoting.*
7. **Extend** - Labels flow into DLP, Data Lifecycle, DSPM for AI, and Defender for Cloud Apps -
   confirm downstream policies key off the new labels.

## Guardrails
- Tune SIT confidence levels and run auto-labelling in **simulation** to control false positives
  before enforcement.
- Plan label encryption carefully - it affects external sharing, co-authoring, search, and some
  third-party tools; do not encrypt the top tier on day one without a recovery plan.
- Train users; mandatory labelling without guidance causes friction and mislabelling - publish a
  short visual guide and the "when do I use Confidential vs Highly Confidential" rule.
- Keep the taxonomy short - a 9-tier taxonomy is unusable; users default to General.
- Confirm Power BI/Fabric, Office mobile, and Mac apps support the labels and protections you
  choose - capability varies.

## Common anti-patterns
- Inventing 12 labels then wondering why adoption stalls at 4%.
- Enabling auto-label in enforce mode on day one and breaking external sharing.
- Building custom SITs without a test corpus, then tuning in production.
- Encrypting the default label "to be safe" - now every shared file fails for external partners.
- Treating classification as IT's job with no data-owner sign-off on the taxonomy.

## Example prompts
- `Design a sensitivity label taxonomy with auto-labelling.`
- `Create sensitive information types (SITs) and trainable classifiers.`
- `How do I use Exact Data Match (EDM) for precise classification?`
- `Classify data before applying protection and DLP.`
- `Pilot auto-labelling in simulation and measure false positives.`

## Microsoft Learn
- Sensitivity labels: https://learn.microsoft.com/purview/sensitivity-labels
- Sensitive information types: https://learn.microsoft.com/purview/sensitive-information-type-learn-about
- Trainable classifiers: https://learn.microsoft.com/purview/trainable-classifiers-learn-about
- Auto-labelling: https://learn.microsoft.com/purview/apply-sensitivity-label-automatically
- Exact Data Match: https://learn.microsoft.com/purview/sit-learn-about-exact-data-match-based-sits
- Label encryption considerations: https://learn.microsoft.com/purview/encryption-sensitivity-labels
