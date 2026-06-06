---
name: purview-dspm-ai
description: "Guidance for Microsoft Purview Data Security Posture Management for AI (DSPM for AI) — discovering, monitoring, and protecting sensitive data interactions with generative AI apps like Microsoft 365 Copilot and third-party AI. Covers AI usage visibility, policies, and oversharing risk. WHEN: DSPM for AI, AI data security posture, Copilot data risk, monitor AI prompts, sensitive data in AI, generative AI data protection, third-party AI usage visibility, secure Copilot data, what sensitive data is being sent to AI, monitor what users are putting into Copilot prompts, detect sensitive data in AI responses, ChatGPT data leakage risk. DO NOT USE when the goal is remediating overshared SharePoint content before Copilot rollout (use purview-copilot-oversharing)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview DSPM for AI

Data Security Posture Management for AI (DSPM for AI) gives visibility and control over how
sensitive data is used in **generative AI** — Microsoft 365 Copilot, Security Copilot, Copilot
Studio agents, and third-party/consumer AI apps (e.g., ChatGPT) — and recommends protections.

## When to use
Securing and governing data interactions with AI as Copilot and genAI adoption grows.

## Approach
1. **Get visibility** — Enable DSPM for AI to discover AI usage and surface prompts/responses
   containing sensitive data across Microsoft and third-party AI.
2. **Run recommendations** — Action one-click policies: extend sensitivity labels and DLP to AI,
   detect risky AI interactions, and find unlabelled sensitive files Copilot can access.
3. **Control oversharing** — Identify and remediate oversharing so Copilot can't surface content
   users shouldn't see (pairs with the copilot-oversharing skill).
4. **Govern interactions** — Use Communication Compliance / DLP for AI to detect prompt injection,
   sensitive data in prompts, and policy violations.
5. **Audit** — Use Activity Explorer and audit to investigate AI interactions.

## Guardrails
- DSPM for AI surfaces risk but depends on classification and label maturity to act on it.
- Address oversharing **before** broad Copilot rollout, not after.
- Apply privacy controls when monitoring user prompts; communicate policy to users.

## Microsoft Learn
- DSPM for AI: https://learn.microsoft.com/purview/dspm-for-ai
- Considerations & setup: https://learn.microsoft.com/purview/dspm-for-ai-considerations
- Secure Copilot with Purview: https://learn.microsoft.com/purview/ai-microsoft-purview
- Oversharing assessment: https://learn.microsoft.com/purview/sharepoint-advanced-management
