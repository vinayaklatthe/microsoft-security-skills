---
name: m365-oversharing
description: "Guidance for remediating oversharing across Microsoft 365 (SharePoint, OneDrive, Teams, Exchange) using the Secure & Governed Data Foundation blueprint - a three-pillar program (remediate oversharing, set up guardrails, meet regulations) built on SharePoint Advanced Management data access governance, sensitivity and container labels, secure-by-default labelling, Restricted Access Control, and Microsoft Purview. WHEN: Microsoft 365 oversharing, M365 oversharing, secure and governed data foundation, oversharing blueprint, too many people have access to SharePoint, EEEU everyone except external users, tighten permissions, data access governance report, restricted content discovery, secure by default labels, prepare data foundation, reduce sharing link sprawl, governed data estate. DO NOT USE for Copilot-specific readiness framing only (use purview-copilot-oversharing) or building a broad DLP program (use purview-dlp-policy)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft 365 Oversharing Remediation

Oversharing - content shared more broadly than it should be - is the root cause of most data
exposure in Microsoft 365 and the biggest risk amplified by AI. Microsoft's **Secure & Governed
Data Foundation** blueprint structures remediation into three pillars: **remediate oversharing,
set up guardrails, and meet regulations**. The work is powered by SharePoint Advanced Management
(SAM, included with a Microsoft 365 Copilot license), sensitivity and container labels, and
Microsoft Purview.

## When to use
Building a secure, well-governed Microsoft 365 data estate - reducing who can reach what across
SharePoint, OneDrive, Teams, and Exchange, then keeping it that way with enforceable defaults.
Applies whether or not Copilot is in scope; it is the data-foundation work every AI or data
program depends on.

Do not use this skill when the question is purely Copilot rollout readiness framing (use
`purview-copilot-oversharing`), monitoring sensitive data in AI prompts (use `purview-dspm-ai`),
or designing a tenant-wide DLP program (use `purview-dlp-policy`).

## The three pillars
| Pillar | Goal | Primary levers |
|---|---|---|
| **Remediate oversharing** | Find and reduce existing over-broad access fast | SAM data access governance (DAG) reports, EEEU cleanup, sharing-link cleanup, Restricted Access Control / Restricted Content Discovery |
| **Set up guardrails** | Prevent regression with enforceable defaults | Sensitivity + container labels, secure-by-default labelling, default sharing settings, site lifecycle policies |
| **Meet regulations** | Close audit/legal and AI-regulatory gaps | Purview Audit, Compliance Manager assessments, data hygiene |

Rule of thumb: **assess -> classify -> restrict -> default-secure -> govern**. Skipping the
assess (DAG report) step is the most common failure; encrypting everything "to be safe" is the
second.

## Approach
1. **Assess (DAG reports)** - Run SharePoint Advanced Management **data access governance**
   reports to find the riskiest sites: "Everyone Except External Users" (EEEU) on too many sites,
   broadly shared sites, sharing-link sprawl, and permissioned-but-sensitive content.
   *Verify: DAG report ranks top-N risky sites with named owners.*
2. **Apply interim restrictions** - For the highest-risk sites, apply **Restricted Access
   Control** / **Restricted Content Discovery** as a fast interim guardrail while owners
   remediate.
   *Verify: a restricted site no longer surfaces in a test user's search/Copilot results.*
3. **Engage site owners** - Notify owners with the expected fix; don't strip permissions centrally
   without owner context - that breaks legitimate collaboration and erodes trust.
   *Verify: owner remediation tickets opened with deadlines.*
4. **Classify & label** - Apply sensitivity labels to sensitive content and container labels to
   sites; reserve encryption for genuinely sensitive content.
   *Verify: a top-tier label encrypts and blocks unauthorised access.*
5. **Secure by default** - Use **secure-by-default labelling** (derive labels from SharePoint
   sites) and tighten default sharing settings so new content is protected without relying on
   users to remember to label.
   *Verify: newly created content inherits a default label/sharing scope.*
6. **Govern lifecycle** - Apply site lifecycle and inactive-site policies plus access reviews so
   oversharing doesn't creep back; this is ongoing governance, not a one-time cleanup.
   *Verify: inactive sites archived or owners re-attested on cadence.*
7. **Meet regulations & monitor** - Use Purview Audit and Compliance Manager to close audit/legal
   and AI-regulatory gaps, and monitor for new oversharing continuously.
   *Verify: audit/regulatory assessment shows reducing exposure over time.*

## Guardrails
- Remediate before broad enablement of AI/Copilot; a clean, scoped pilot can proceed, but
  tenant-wide turn-on without assessment generates complaints fast.
- Assess first - running remediation without the DAG report means you fix the wrong things.
- Don't encrypt everything with the top label "to be safe" - it breaks external collaboration and
  legitimate sharing; secure-by-default labelling plus exception handling scales better.
- Coordinate with site owners; centralised bulk permission stripping breaks collaboration.
- SAM is licensed (included with Microsoft 365 Copilot, or a standalone/E5 SKU) - confirm
  availability before assuming reports exist.
- Oversharing control is continuous governance - new sites and sharing links appear daily.

## Common anti-patterns
- Running the DAG report once, fixing the top 20 sites, and declaring done.
- Enabling Copilot or a new data program tenant-wide and remediating oversharing afterwards.
- Restricted Content Discovery applied across half the tenant - users complain search is useless.
- Training users on "when to protect" instead of deriving secure-by-default labels.
- Ignoring sharing-link sprawl because the report is long.

## Example prompts
- `Remediate oversharing across Microsoft 365 using the secure and governed data foundation blueprint.`
- `Use SharePoint Advanced Management data access governance to find over-broad access.`
- `Set up secure-by-default labelling so new SharePoint content is protected automatically.`
- `Clean up "Everyone except external users" and sharing-link sprawl.`
- `Build enforceable guardrails to stop oversharing regression.`

## Microsoft Learn
- Secure & governed data foundation (oversharing blueprint): https://learn.microsoft.com/en-us/microsoft-365/copilot/secure-govern-copilot-foundational-deployment-guidance
- Configure a secure and governed foundation: https://learn.microsoft.com/en-us/microsoft-365/copilot/configure-secure-governed-data-foundation-microsoft-365-copilot
- Purview blueprint - secure by default: https://learn.microsoft.com/en-us/purview/deploymentmodels/depmod-securebydefault-intro
- SharePoint Advanced Management: https://learn.microsoft.com/sharepoint/advanced-management
- Data access governance reports: https://learn.microsoft.com/sharepoint/data-access-governance-reports
- Restricted content discovery: https://learn.microsoft.com/sharepoint/restricted-content-discovery
