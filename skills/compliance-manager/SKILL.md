---
name: compliance-manager
description: "Guidance for Microsoft Purview Compliance Manager — continuous compliance posture across Microsoft and non-Microsoft assets, mapped to 360+ regulatory templates (ISO 27001/27018/27701, SOC 2, NIST 800-53/171/CSF, PCI DSS, HIPAA, GDPR, FedRAMP, IRAP, Essential Eight, DORA, EU AI Act, etc.). Covers compliance score, improvement actions (Microsoft-managed vs customer-managed), evidence collection, assessment authoring (custom templates from CSV), multi-assessment grouping, automated testing of technical controls via Microsoft 365 / Defender for Cloud / Entra, evidence repository, audit-ready reports, and continuous assessment vs point-in-time. WHEN: Compliance Manager, compliance score, regulatory assessment Purview, NIST 800-53 assessment, ISO 27001 evidence, FedRAMP assessment, custom compliance template, improvement action, technical control automation, audit evidence M365, DORA assessment, EU AI Act assessment. DO NOT USE for Defender for Cloud regulatory dashboard (use defender-for-cloud-hardening), Records Management (use purview-records-management), or M365 secure score only."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Compliance Manager

Compliance Manager is a posture and evidence platform. It maps Microsoft cloud controls,
your tenant configuration, and your manual evidence to **regulatory templates** (ISO, NIST,
SOC 2, PCI, HIPAA, GDPR, FedRAMP, IRAP, Essential Eight, DORA, EU AI Act, and more), gives
you a **compliance score**, and tracks **improvement actions** with audit-ready evidence
collection.

## When to use
- Authoring or maintaining one or more regulatory assessments.
- Producing audit evidence packages (SOC 2, ISO 27001 surveillance audits).
- Tracking compliance score over time as a leadership metric.
- Mapping a custom internal framework into a Compliance Manager assessment.

**Do not use this skill** for Defender for Cloud's regulatory dashboard
(`defender-for-cloud-hardening`), Records Management (`purview-records-management`), or
M365 Secure Score (general security telemetry).

## Concept map

| Concept | What it is |
|---|---|
| **Template** | A regulation/standard (e.g., "ISO/IEC 27001:2022") |
| **Assessment** | An instance of a template scoped to a product/group (e.g., "M365 ISO 27001") |
| **Improvement action** | A discrete control task (Microsoft-managed or customer-managed) |
| **Microsoft-managed action** | Microsoft maintains; you inherit credit — no work needed |
| **Customer-managed action** | You must implement, document, and provide evidence |
| **Evidence** | Files, links, or automated test results attached to an action |
| **Assessment group** | Logical bundle (e.g., all in-scope assessments for a business unit) |
| **Continuous assessment** | Automatic re-test of supported technical actions |

## Approach

1. **Map your obligations to templates first.** List the regulations the business is
   accountable for, then match to Compliance Manager templates. Coverage is broad — but
   not every internal framework is pre-built. Custom templates fill the gap.

2. **Start with one anchor assessment**, not ten. Usually ISO 27001 or NIST CSF, scoped to
   "Microsoft 365" or "Microsoft 365 + Azure." Demonstrate value before expanding.

3. **Walk Microsoft-managed actions first.** They auto-credit. The remaining
   customer-managed actions are the real work.

4. **For each customer-managed action:**
   - Assign an owner with a due date.
   - Define implementation status (Not implemented → Partial → Implemented).
   - Attach **evidence** (policy doc, screenshot, config export, Defender for Cloud
     compliance report, audit log query).
   - For technical actions with automated testing supported, configure the test so it
     re-runs continuously (M365, Entra, Defender for Cloud).

5. **Assessment grouping.** Multi-regulation environments get duplicate control work
   (NIST AC-2 and ISO 27001 A.9.2 are largely the same). Use shared improvement actions
   across grouped assessments so a single implementation credits everywhere.

6. **Author custom templates** for internal frameworks: build the template via the
   CSV/Excel import (control ID, family, title, description, test procedure, action
   type). Useful for industry frameworks not yet in Microsoft's catalog and for an
   internal compliance overlay.

7. **Evidence repository discipline.** Centralize evidence storage (SharePoint folder
   per assessment). Versioned, dated, owner-tagged. Audit time is not the moment to
   chase a screenshot from 8 months ago.

8. **Reporting.**
   - Compliance score trend per assessment (monthly to leadership).
   - Open improvement actions by owner and aging.
   - Evidence freshness (anything older than 12 months flagged).
   - Export to PDF/Excel for auditors and GRC tools.

9. **Continuous re-assessment.** Schedule a quarterly internal review per assessment.
   Don't wait for the external audit to discover drift.

## Guardrails
- **Compliance Manager score is not your audit verdict.** It's a posture indicator
  Microsoft computes from action status. An auditor still wants the evidence; the score
  helps prioritize work, not pass the audit.
- **Don't mark customer-managed actions "Implemented" without evidence.** That's the
  audit failure case. Score inflation now = embarrassment later.
- **Microsoft-managed credit is for the Microsoft service.** Your tenant configuration
  inside that service is still your responsibility (e.g., MS-managed encryption ≠ your
  CMK configuration).
- **Custom templates lack continuous testing.** Built-in templates with technical action
  automation re-test; custom templates rely on manual evidence updates.
- **Don't duplicate work across assessments.** Use grouping; otherwise the same
  control gets implemented 5 times.
- **Compliance Manager is a Purview-licensed feature.** Some templates are premium add-
  ons (specific regional/industry templates). Confirm template availability per SKU.
- **Evidence in Compliance Manager is not a legal record-retention store.** Combine with
  Records Management for actual record-keeping.

## Common anti-patterns
- **"Score 92% → we're compliant"** — score is an internal metric; auditors test
  controls, not Microsoft's score.
- **"Marked actions complete without uploading evidence"** — fails audit instantly.
- **"Authored 15 assessments in week one"** — none get evidence-maintained; all decay.
- **"Compliance Manager evidence in personal OneDrive folders"** — succession risk;
  unfindable at audit time.
- **"Ignored Microsoft-managed action context"** — claimed Microsoft credit without
  configuring the customer-side option (e.g., "encryption" credit without enabling
  Customer Key when the audit asks).
- **"Custom template authored in the UI by hand"** — slow, no versioning. Use CSV
  import, source-control the CSV.
- **"Continuous assessment ignored — manual screenshot evidence for technical controls
  that auto-test"** — wasted effort.

## Example prompts
- `Plan a Compliance Manager rollout: SOC 2 Type II, ISO 27001, and HIPAA grouped for
  a healthcare M365 + Azure tenant.`
- `Author a custom assessment template from our internal control framework CSV.`
- `Build the evidence repository structure and tagging convention for ISO 27001
  surveillance audit prep.`
- `Identify duplicate customer-managed actions across NIST 800-53 and ISO 27001 and
  merge into shared actions.`
- `Quarterly internal review SOP: how to validate evidence freshness, re-test status,
  and reassign aging actions.`
- `Compare Compliance Manager's NIST CSF coverage to our current GRC tool and propose
  migration.`
- `Wire automated technical testing for Entra, M365, and Defender for Cloud actions in
  a FedRAMP Moderate assessment.`

## Microsoft Learn
- Compliance Manager overview: https://learn.microsoft.com/purview/compliance-manager
- Templates list: https://learn.microsoft.com/purview/compliance-manager-templates-list
- Assessments: https://learn.microsoft.com/purview/compliance-manager-assessments
- Improvement actions: https://learn.microsoft.com/purview/compliance-manager-improvement-actions
- Continuous assessment: https://learn.microsoft.com/purview/compliance-manager-setup#turn-on-automatic-testing
- Custom templates (CSV import): https://learn.microsoft.com/purview/compliance-manager-templates
- Evidence: https://learn.microsoft.com/purview/compliance-manager-improvement-actions#how-to-export-an-improvement-action-report
- Compliance score calculation: https://learn.microsoft.com/purview/compliance-score-calculation
- Role permissions: https://learn.microsoft.com/purview/compliance-manager-setup#set-user-permissions-and-assign-roles
