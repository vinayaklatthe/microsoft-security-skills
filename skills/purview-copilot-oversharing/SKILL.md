---
name: purview-copilot-oversharing
description: "Guidance for assessing and remediating oversharing before and during Microsoft 365 Copilot adoption, using SharePoint Advanced Management (SAM), sensitivity labels, restricted content discovery, and DLP for Copilot so Copilot only surfaces content users should access. Covers data access governance reports, EEEU cleanup, and ongoing governance. WHEN: Copilot oversharing, prepare data for Copilot, restrict Copilot access, SharePoint Advanced Management, data access governance, oversharing remediation, Copilot readiness data security, limit Copilot content, Copilot is surfacing files users should not see, too many people have access to SharePoint sites, tighten up permissions before Copilot rollout, how do I make SharePoint Copilot-ready. DO NOT USE when the goal is monitoring what sensitive data users are actively sending in AI prompts (use purview-dspm-ai)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft 365 Copilot Oversharing Controls

Microsoft 365 Copilot honours existing permissions - so if content is **overshared**, Copilot can
surface it to users who technically have access but shouldn't. This skill covers reducing that
blast radius before and during Copilot rollout using SharePoint Advanced Management, sensitivity
labels, restricted content discovery, and DLP for Copilot.

## When to use
Preparing a tenant for Microsoft 365 Copilot and continuously controlling what Copilot can reach
across SharePoint, OneDrive, and Teams.

Do not use this skill to monitor sensitive data in prompts (use `purview-dspm-ai`) or to design a
broader DLP program (use `purview-dlp-policy`).

## Pick the right oversharing lever
| Symptom | Lever |
|---|---|
| "Everyone except external users" (EEEU) on too many sites | SAM **data access governance** report + permission cleanup |
| Sensitive content in broadly shared sites | **Sensitivity labels** (encrypt) + container labels for sites |
| Site shows up in Copilot results when it shouldn't | **Restricted content discovery (RCD)** on the site |
| Labelled content should be excluded from Copilot grounding | **DLP for Microsoft 365 Copilot** |
| Sharing links sprawl | SAM sharing link report + cleanup policies |

Rule of thumb: assess (DAG report) -> classify (labels) -> restrict (RCD, link policy) ->
exclude (DLP for Copilot) -> govern (site lifecycle). Skipping the assess step is the most common
failure.

## Approach
1. **Assess** - Use **SharePoint Advanced Management (SAM)** data access governance reports to
   find oversharing: "everyone/EEEU" access, broadly shared sites, sharing links, and permissioned
   but sensitive content.
   *Verify: DAG report identifies top-N risky sites with owners.*
2. **Engage site owners** - Notify owners of risky sites with the remediation expected; do not
   remediate centrally without owner context.
   *Verify: owner remediation tickets/issues opened with deadline.*
3. **Classify & label** - Apply sensitivity labels to sensitive content; container labels for
   sites; labels can encrypt and restrict, and Copilot respects label permissions.
   *Verify: top-tier label encrypts and Copilot cannot surface the file to unauthorised test user.*
4. **Restrict** - Use **restricted access control / restricted content discovery (RCD)** on
   sensitive sites, tighten "everyone except external users" grants, and clean up sharing links.
   *Verify: RCD-flagged site no longer appears in test user's Copilot answers.*
5. **Apply DLP for Copilot** - Use DLP for Microsoft 365 Copilot to exclude labelled content from
   Copilot processing where required.
   *Verify: a test prompt referencing labelled content is excluded or warned.*
6. **Govern lifecycle** - Apply site lifecycle/access reviews to prevent regression; set inactive
   site policies in SAM.
   *Verify: inactive sites archived or owners re-attested per cadence.*
7. **Monitor with DSPM for AI** - Continuously surface unlabelled sensitive files Copilot can
   access; loop back to label + restrict.
   *Verify: weekly DSPM for AI report shrinks unlabelled-sensitive count.*

## Guardrails
- Remediate oversharing **before** broad Copilot enablement; a pilot can proceed on a scoped,
  clean set of sites but tenant-wide turn-on without assessment generates user complaints fast.
- Sensitivity-label encryption is the strongest control - Copilot can't use content the user
  can't decrypt/extract; reserve for genuinely sensitive content.
- Oversharing control is ongoing governance, not a one-time cleanup - new sites are created daily
  and sharing links sprawl without policy.
- Coordinate with site owners; bulk permission stripping from the centre breaks legitimate
  collaboration and erodes trust in the program.
- SAM is licensed separately (E5 / standalone SKU) - confirm before assuming reports are
  available.

## Common anti-patterns
- Enabling Copilot tenant-wide and then trying to remediate oversharing - users have already seen
  the wrong files.
- Running the DAG report once, fixing the top 20 sites, and declaring done.
- Encrypting everything with the top label "to be safe" - breaks external collaboration and
  Copilot grounding alike.
- Restricted content discovery applied to half the tenant - users complain Copilot is useless.
- Ignoring sharing links because the report is long.

## Example prompts
- `Make SharePoint Copilot-ready by remediating oversharing.`
- `Use SharePoint Advanced Management to tighten site permissions before Copilot.`
- `How do I stop Copilot surfacing files users should not see?`
- `Run data access governance to limit Copilot content.`
- `Apply restricted content discovery to a sensitive site.`

## Microsoft Learn
- Copilot data protection considerations: https://learn.microsoft.com/purview/ai-microsoft-purview-considerations
- SharePoint Advanced Management: https://learn.microsoft.com/sharepoint/advanced-management
- Data access governance reports: https://learn.microsoft.com/sharepoint/data-access-governance-reports
- Restricted content discovery: https://learn.microsoft.com/sharepoint/restricted-content-discovery
- Prepare for Copilot: https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-requirements
- DLP for Microsoft 365 (overview): https://learn.microsoft.com/purview/dlp-learn-about-dlp
