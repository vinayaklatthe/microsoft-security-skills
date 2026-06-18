---
name: purview-ai-hub
description: "Guidance for Microsoft Purview AI Hub (now part of Data Security Posture Management for AI) — discover, govern, and protect sensitive data flowing into AI applications (Microsoft 365 Copilot, Copilot Studio agents, ChatGPT, Gemini, third-party generative AI). Covers AI app discovery via Defender for Cloud Apps + endpoint signals, sensitive data risk surface, ready-to-use policies for Copilot oversharing and risky AI usage, DLP for generative AI endpoints (browser blocking), prompt/response auditing, integration with IRM (risky AI usage), Sentinel reporting, and difference vs Defender for Cloud AI workload protection. WHEN: Purview AI Hub, DSPM for AI, AI app discovery, ChatGPT data leakage, Gemini DLP, generative AI risk, prompt audit, Copilot Studio agent governance, sensitive data to AI, shadow AI, agent data risk. DO NOT USE for Defender for Cloud's AI workload protection (use defender-for-cloud-ai), Azure AI Content Safety (use azure-ai-content-safety), or Microsoft 365 Copilot rollout (use copilot-for-m365-readiness)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview AI Hub (DSPM for AI)

Purview AI Hub — re-cast as **Microsoft Purview Data Security Posture Management (DSPM)
for AI** — is the cross-AI visibility layer: which AI apps are being used, by whom, with
what sensitive content, and what policies are protecting that content. It covers
**Microsoft Copilot products**, **Copilot Studio agents**, and **third-party generative
AI** (ChatGPT, Gemini, Claude, Perplexity, and ~600 catalogued AI apps).

## When to use
You need visibility into AI usage across the organization (sanctioned and shadow), with
policies that prevent sensitive data leaving for unsanctioned AI and that audit prompts
into sanctioned AI.

**Do not use this skill** for AI workload-side posture (`defender-for-cloud-ai`), Azure
AI Content Safety prompt filtering (`azure-ai-content-safety`), or the Copilot rollout
playbook (`copilot-for-m365-readiness`).

## What you see and control

| Surface | Visibility | Policy |
|---|---|---|
| Microsoft 365 Copilot | Prompts, responses, sensitivity context | DLP for Copilot, sensitivity-label restrictions |
| Copilot Studio agents | Agent interactions per user | Same DLP + label model |
| Third-party AI (ChatGPT, Gemini, etc.) | Discovery via Defender for Cloud Apps + Edge for Business endpoint signals | Browser DLP block/warn; collection of prompt evidence on Edge |
| Custom AI apps (your own) | Via Purview SDK / Microsoft Graph (preview) | Custom labels and DLP integration |

## Approach

1. **Prereqs.** Defender for Cloud Apps with cloud discovery; Microsoft Edge for
   Business deployed for the prompt-capture story; Purview E5 / Compliance E5; Audit
   Premium recommended.

2. **Turn on AI app discovery.** AI Hub uses your cloud discovery logs (Defender for
   Cloud Apps from firewall/proxy/MDE) to populate the catalog. Within 7 days you see
   what AI apps people are using, by user count and traffic volume.

3. **Categorize the AI app catalog.**
   - **Sanctioned**: corporate-approved (Microsoft 365 Copilot, your Copilot Studio
     agents, paid enterprise ChatGPT/Gemini with DPA).
   - **Tolerated**: not approved but not blocked (yet).
   - **Unsanctioned/blocked**: shadow consumer AI without enterprise terms.

4. **Use ready-to-use policies.**
   - **"Detect risky AI usage"** — surfaces sensitive content being pasted into
     unsanctioned AI via Edge.
   - **"Detect unethical behavior in AI"** — pattern-matches harmful prompts.
   - **"Microsoft Copilot oversharing"** — flags Copilot responses sourced from
     over-permissioned content.
   Start in monitor; tune; promote to block.

5. **DLP for generative AI**. Author Purview DLP rules with the **generative AI** family
   of conditions:
   - Block pasting credit-card/SSN/source-code into ChatGPT/Gemini/etc. in Edge.
   - Warn on company-confidential labeled content being copied to AI prompts.
   Browser DLP requires Edge for Business + endpoint DLP agent on the device.

6. **Prompt/response audit.** For Microsoft Copilot products, prompts and responses
   land in the unified audit log. Build Sentinel queries and dashboards:
   - Top prompts by sensitivity hit count.
   - Users with elevated AI-risk score (paired with IRM).
   - Anomalous after-hours prompt volume.

7. **IRM integration** — turn on the *Risky AI usage* IRM policy template. AI Hub
   signals feed the user risk score that Adaptive Protection then uses to tighten DLP.

8. **Sentinel / Defender XDR.** Forward AI Hub findings; correlate with endpoint and
   identity signals for full-context incidents.

## Guardrails
- **Browser-based AI controls only work in Edge for Business** with endpoint DLP. Chrome
  and Firefox bypass the prompt-capture and DLP unless layered with proxy or network
  controls.
- **Discovery quality depends on cloud discovery data.** No proxy/firewall logs = no
  shadow AI visibility.
- **Don't block all third-party AI on day one.** Without sanctioned alternatives, users
  pivot to personal devices and you lose visibility entirely.
- **Prompt content can itself be sensitive.** Audit logs of prompts containing PII are
  PII. Restrict audit log access; consider pseudonymization in IRM.
- **DSPM for AI is a Purview governance tool, not a content-safety guardrail.** It
  doesn't filter LLM outputs in real time. That's `azure-ai-content-safety`.
- **Microsoft Copilot honors sensitivity labels; third-party AI does not.** Label
  encryption protects against Copilot but not against a user copy-paste into ChatGPT —
  hence the browser DLP layer.
- **AI app catalog has gaps.** New AI apps appear weekly; manual additions sometimes
  needed.

## Common anti-patterns
- **"Discovery without categorization"** — interesting dashboard, no action.
- **"Block all unsanctioned AI day one"** — workforce revolts; uses personal phones.
  Provide sanctioned path first.
- **"Browser DLP without Edge for Business"** — Chrome users bypass everything.
- **"Audit prompts but never review them"** — risk persists invisibly. Wire to SOC and
  IRM.
- **"AI Hub used for Azure OpenAI workload protection"** — wrong product. That's
  Defender for Cloud AI workload protection.
- **"Treating AI Hub findings as alerts to triage"** — they're posture + DLP; route
  most to risk-score / IRM, escalate only the high-severity to SOC.
- **"Skipped IRM integration"** — DSPM signals stranded from the user risk story.

## Example prompts
- `Roll out Purview DSPM for AI: discovery, catalog, ready-to-use policies, browser DLP
  for third-party AI.`
- `Author a DLP policy that blocks pasting credit-card data into ChatGPT and Gemini in
  Edge for Business.`
- `Build a Sentinel workbook on Copilot prompts hitting confidential-label sensitive
  info types.`
- `Integrate AI Hub signals with IRM "Risky AI usage" template and Adaptive Protection.`
- `Categorize a 600-app AI catalog into sanctioned / tolerated / blocked and define
  the cutover plan.`
- `Compare AI Hub coverage for Microsoft Copilot vs third-party AI vs custom apps.`
- `Sentinel queries for top users by sensitive-prompt volume across all AI surfaces.`

## Microsoft Learn
- DSPM for AI overview: https://learn.microsoft.com/purview/ai-microsoft-purview
- Get started with DSPM for AI: https://learn.microsoft.com/purview/dspm-for-ai-considerations
- Discover AI apps (Defender for Cloud Apps): https://learn.microsoft.com/defender-cloud-apps/risk-score
- DLP for generative AI: https://learn.microsoft.com/purview/dlp-learn-about-dlp
- Ready-to-use AI policies: https://learn.microsoft.com/purview/ai-microsoft-purview-considerations
- Audit Copilot: https://learn.microsoft.com/purview/audit-copilot
- IRM risky AI usage: https://learn.microsoft.com/purview/insider-risk-management-policies#risky-ai-usage
- Browser DLP / Edge for Business: https://learn.microsoft.com/purview/endpoint-dlp-using
