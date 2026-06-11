---
name: purview-copilot-oversharing
description: "Guidance for assessing and remediating oversharing before and during Microsoft 365 Copilot adoption, using SharePoint Advanced Management, sensitivity labels, and DLP so Copilot only surfaces content users should access. WHEN: Copilot oversharing, prepare data for Copilot, restrict Copilot access, SharePoint Advanced Management, data access governance, oversharing remediation, Copilot readiness data security, limit Copilot content, Copilot is surfacing files users should not see, too many people have access to SharePoint sites, tighten up permissions before Copilot rollout, how do I make SharePoint Copilot-ready. DO NOT USE when the goal is monitoring what sensitive data users are actively sending in AI prompts (use purview-dspm-ai)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft 365 Copilot Oversharing Controls

Microsoft 365 Copilot honours existing permissions — so if content is **overshared**, Copilot can
surface it to users who technically have access but shouldn't. This skill covers reducing that
blast radius before and during Copilot rollout.

## When to use
Preparing a tenant for Microsoft 365 Copilot and continuously controlling what Copilot can reach.

## Approach
1. **Assess** — Use **SharePoint Advanced Management (SAM)** data access governance reports to find
   oversharing: "everyone/EEEU" access, broadly shared sites, sharing links, and permissioned but
   sensitive content.
2. **Classify & label** — Apply sensitivity labels to sensitive content; labels can encrypt and
   restrict, and Copilot respects label permissions.
3. **Restrict** — Use restricted access control / restricted content discovery on sensitive sites,
   tighten "everyone except external users" grants, and clean up sharing links.
4. **Apply DLP for Copilot** — Use DLP for Microsoft 365 Copilot to exclude labelled content from
   Copilot processing where required.
5. **Govern lifecycle** — Apply site lifecycle/access reviews to prevent regression.
6. **Monitor with DSPM for AI** — Continuously surface unlabelled sensitive files Copilot can access.

## Guardrails
- Remediate oversharing **before** broad Copilot enablement; a pilot can proceed on a scoped, clean
  set of sites.
- Sensitivity-label encryption is the strongest control — Copilot can't use content the user can't
  decrypt/extract.
- Oversharing control is ongoing governance, not a one-time cleanup.

## Example prompts
- `Make SharePoint Copilot-ready by remediating oversharing.`
- `Use SharePoint Advanced Management to tighten site permissions before Copilot.`
- `How do I stop Copilot surfacing files users should not see?`
- `Run data access governance to limit Copilot content.`

## Microsoft Learn
- Copilot data protection (Purview): https://learn.microsoft.com/purview/ai-microsoft-purview-considerations
- SharePoint Advanced Management: https://learn.microsoft.com/sharepoint/advanced-management
- Restricted content discovery: https://learn.microsoft.com/sharepoint/restricted-content-discovery
- Prepare for Copilot: https://learn.microsoft.com/copilot/microsoft-365/microsoft-365-copilot-requirements
