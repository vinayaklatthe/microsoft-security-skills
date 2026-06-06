---
name: purview-data-classification
description: "Guidance for Microsoft Purview data classification and sensitivity labels — sensitive information types (SITs), trainable classifiers, exact data match, and sensitivity label taxonomy with auto-labeling. Covers building a label taxonomy and classification strategy. WHEN: data classification, sensitivity labels, sensitive information types, SIT, trainable classifier, exact data match EDM, auto-labeling, label taxonomy, classify data, information protection labels."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Data Classification & Sensitivity Labels

Classification identifies sensitive content; **sensitivity labels** apply persistent protection
(visual marking, encryption, access, and downstream DLP/lifecycle controls). Together they are
the foundation of Microsoft Information Protection.

## When to use
Defining what data is sensitive and applying a consistent label taxonomy across Microsoft 365
and beyond.

## Approach
1. **Classification methods** — Choose the right detector:
   - **Sensitive Information Types (SITs)** — pattern/keyword/checksum (e.g., credit card, NI).
   - **Trainable classifiers** — ML categories (e.g., contracts, source code) from samples.
   - **Exact Data Match (EDM)** — match against a hashed copy of your own structured data.
2. **Design a label taxonomy** — Keep it simple (e.g., Public / General / Confidential /
   Highly Confidential) with sub-labels; define markings, encryption, and scope per label.
3. **Publish labels** — Use label policies to scope labels to users; set defaults and mandatory
   labelling where appropriate.
4. **Auto-labeling** — Use **client-side** (recommended/automatic in apps) and **service-side**
   auto-labeling (SharePoint/OneDrive/Exchange) based on SITs/classifiers — start in simulation.
5. **Extend** — Labels flow into DLP, Data Lifecycle, DSPM for AI, and Defender for Cloud Apps.

## Guardrails
- Tune SIT confidence levels and run auto-labeling in **simulation** to control false positives.
- Plan label encryption carefully — it affects external sharing, co-authoring, and search.
- Train users; mandatory labelling without guidance causes friction and mislabelling.

## Microsoft Learn
- Sensitivity labels: https://learn.microsoft.com/purview/sensitivity-labels
- Sensitive information types: https://learn.microsoft.com/purview/sensitive-information-type-learn-about
- Trainable classifiers: https://learn.microsoft.com/purview/trainable-classifiers-learn-about
- Auto-labeling: https://learn.microsoft.com/purview/apply-sensitivity-label-automatically
