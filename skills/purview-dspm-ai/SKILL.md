---
name: purview-dspm-ai
description: "Guidance for Microsoft Purview Data Security Posture Management for AI (DSPM for AI) - discovering, monitoring, and protecting sensitive data interactions with generative AI apps like Microsoft 365 Copilot, Security Copilot, Copilot Studio agents, and third-party AI (ChatGPT, Gemini). Covers AI usage visibility, one-click recommendations, oversharing risk surfaced to AI, and DLP for AI. WHEN: DSPM for AI, AI data security posture, Copilot data risk, monitor AI prompts, sensitive data in AI, generative AI data protection, third-party AI usage visibility, secure Copilot data, what sensitive data is being sent to AI, monitor what users are putting into Copilot prompts, detect sensitive data in AI responses, ChatGPT data leakage risk. DO NOT USE when the goal is remediating overshared SharePoint content before Copilot rollout (use purview-copilot-oversharing) or building IRM policies for departing users (use insider-risk-baseline)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview DSPM for AI

DSPM for AI gives visibility and control over how sensitive data is used in generative AI -
Microsoft 365 Copilot, Security Copilot, Copilot Studio agents, and third-party/consumer AI apps
(ChatGPT, Gemini, Claude) - and recommends protections you can apply in one click.

## When to use
Securing and governing data interactions with AI as Copilot and genAI adoption grows in the
tenant, especially before broad rollout.

Do not use this skill when the goal is to clean up SharePoint permissions ahead of Copilot
(use `purview-copilot-oversharing`) or to investigate insider activity (use `insider-risk-baseline`).

## Pick the right starting lens
| Concern | Start here |
|---|---|
| Are users pasting sensitive data into ChatGPT? | DSPM for AI - **Activity Explorer** + Edge browser extension / Defender for Cloud Apps signals |
| What sensitive data is Copilot retrieving? | DSPM for AI - **Data assessments** + interaction reports |
| Are prompts/responses violating policy? | **Communication Compliance for Copilot** + DLP for AI |
| Files Copilot can reach but shouldn't | DSPM for AI - unlabelled sensitive files report (then `purview-copilot-oversharing`) |

Rule of thumb: turn on DSPM for AI first to see the risk surface, then action the one-click
recommendations rather than building bespoke policies from scratch.

## Approach
1. **Onboard DSPM for AI** - Activate from the Purview portal; consent to the analytics it needs
   and confirm Audit is enabled tenant-wide.
   *Verify: the DSPM for AI overview shows interaction counts within 24-48 hours.*
2. **Run the data assessments** - Execute the **oversharing assessment** and **Copilot interactions
   assessment** to scope risk before enforcement.
   *Verify: assessment results identify top sites/users by sensitive interaction volume.*
3. **Action one-click recommendations** - Apply the recommended policies: detect risky AI
   interactions, extend sensitivity labels to AI, and protect data referenced by Copilot.
   *Verify: each accepted recommendation creates a corresponding Purview policy in audit mode.*
4. **Govern third-party AI** - Pair with Defender for Cloud Apps to discover ChatGPT/Gemini/Claude
   use; apply Endpoint DLP rules to block paste of labelled content into unsanctioned AI apps.
   *Verify: Cloud App Catalog shows AI app risk scores and DLP blocks appear in Activity Explorer.*
5. **Apply DLP for AI** - Use **DLP policies for Microsoft 365 Copilot** to exclude labelled
   content from Copilot processing or restrict by group; use Communication Compliance for prompt
   review.
   *Verify: a test prompt referencing a labelled document is excluded or flagged.*
6. **Operate** - Review Activity Explorer weekly, tune false positives, and report metrics
   (interactions classified, recommendations accepted, blocks) to leadership.

## Guardrails
- DSPM for AI surfaces risk but depends on classification and label maturity to act on it - if
  nothing is labelled, recommendations have nothing to enforce.
- Address oversharing **before** broad Copilot rollout, not after - users will notice when Copilot
  starts returning HR files.
- Apply privacy controls when monitoring user prompts; pseudonymise where works councils require
  it and publish an AI acceptable-use policy.
- Audit must be on tenant-wide before DSPM for AI can show interactions - confirm in the Purview
  portal first.
- Endpoint DLP for third-party AI requires onboarded Windows/Mac devices and Edge for Business.

## Common anti-patterns
- Enabling Copilot for all users before running the oversharing assessment.
- Treating DSPM for AI as a one-off audit instead of an ongoing program.
- Blocking ChatGPT outright with no sanctioned alternative - users move to mobile/personal devices.
- Skipping DLP for Copilot and assuming sensitivity labels alone will stop oversharing.
- Ignoring third-party AI because "we only allow Copilot" - Edge telemetry usually proves otherwise.

## Example prompts
- `Use DSPM for AI to monitor what sensitive data users send to Copilot.`
- `How do I detect sensitive data in AI prompts and responses?`
- `Gain visibility into third-party AI usage like ChatGPT.`
- `Run the Copilot oversharing assessment and action the recommendations.`
- `Block paste of Highly Confidential content into ChatGPT on managed endpoints.`

## Microsoft Learn
- DSPM for AI overview: https://learn.microsoft.com/purview/dspm-for-ai
- Considerations & setup: https://learn.microsoft.com/purview/dspm-for-ai-considerations
- Secure & govern AI with Purview: https://learn.microsoft.com/purview/ai-microsoft-purview
- Copilot data protection considerations: https://learn.microsoft.com/purview/ai-microsoft-purview-considerations
- DLP for Microsoft 365 (overview): https://learn.microsoft.com/purview/dlp-learn-about-dlp
- SharePoint Advanced Management (oversharing): https://learn.microsoft.com/sharepoint/advanced-management
