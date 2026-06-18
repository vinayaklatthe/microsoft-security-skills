---
name: azure-ai-content-safety
description: "Guidance for Azure AI Content Safety — programmatic content moderation for text, images, multimodal, and generative AI guardrails. Covers Content Safety categories (hate, violence, sexual, self-harm) with severity levels, Prompt Shields for jailbreak and indirect prompt injection detection, groundedness detection (hallucination check vs grounding sources), protected material detection (text and code), custom categories, blocklists, Content Safety Studio for tuning, integration with Azure OpenAI as input/output filters (built-in plus custom), latency/cost trade-offs, agent guardrails, and deployment patterns (sidecar in app, integrated with Azure OpenAI). WHEN: Azure AI Content Safety, prompt shields, jailbreak detection, indirect prompt injection, groundedness check, protected material detection, content moderation, generative AI guardrails, harmful content categories, custom blocklist AI, agent guardrail. DO NOT USE for AI workload threat detection / SOC alerts (use defender-for-cloud-ai), end-user AI usage governance (use purview-ai-hub), or general AI app design unrelated to safety."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure AI Content Safety

Azure AI Content Safety is the platform for **real-time content moderation and generative
AI safety**. It analyzes text, images, and multimodal content for harm categories, blocks
prompt-injection / jailbreak attempts (Prompt Shields), detects ungrounded responses
(Groundedness), and flags protected text/code reproduction.

It pairs with Azure OpenAI as built-in **content filters** (default safety net) and as
configurable guardrails for any AI/LLM application (including non-Microsoft models).

## When to use
Building or hardening any generative AI application — chat assistant, agent, RAG app,
multimodal product — that needs guardrails on inputs and outputs.

**Do not use this skill** for SOC threat detection on AI workloads
(`defender-for-cloud-ai`), end-user AI usage governance (`purview-ai-hub`), or generic AI
application architecture.

## Capability map

| Capability | What it does | Where to apply |
|---|---|---|
| **Text moderation** | Classifies text into hate, violence, sexual, self-harm (severity 0–7) | Input + output |
| **Image moderation** | Same categories on images | User uploads, generated images |
| **Multimodal moderation** | Text+image combined context | Multimodal chat |
| **Prompt Shields — User Prompt** | Detects jailbreak attempts in the user prompt | Input |
| **Prompt Shields — Indirect** | Detects injection in untrusted grounding content (RAG, tool results, web pages) | Pre-grounding step |
| **Groundedness detection** | Checks LLM response against grounding sources for hallucination | Output |
| **Protected material — text** | Detects verbatim copyrighted text | Output |
| **Protected material — code** | Detects reproduction of public-repo code | Code-generation output |
| **Custom categories** | Customer-defined harm categories (e.g., off-brand topics) | Input + output |
| **Blocklists** | Exact-match + regex blocklists | Input + output |

## Approach

1. **Start with default Azure OpenAI content filters.** Every Azure OpenAI deployment
   has a default Content Safety filter at *medium severity* across all four harm
   categories. Don't deploy without it.

2. **Tune severity thresholds per use case.**
   - Children's product: low threshold (block at severity 2).
   - Adult creative app: high threshold (block only at severity 6).
   Author a custom content filter in Azure OpenAI Studio; assign to deployment.

3. **Enable Prompt Shields for any user-facing chat or agent.**
   - **User Prompt Shield** on the incoming prompt.
   - **Indirect Prompt Shield** on grounding content (RAG document chunks, tool
     outputs, fetched web pages) **before** they hit the model. Indirect injection is
     the higher-impact, lower-visibility risk.

4. **Groundedness detection for RAG apps.** After the model produces a response, call
   groundedness detection with the source chunks. Flag/reject ungrounded claims. Adds
   latency (one extra model call) but is the main defense against hallucination in
   high-stakes apps (medical, legal, financial).

5. **Protected material detection** for products that generate text or code at scale:
   - Text: SaaS copywriting tools.
   - Code: developer assistants (Copilot-style).
   Flag and either suppress or annotate the output.

6. **Custom categories + blocklists** for brand- or domain-specific risks (competitor
   mentions, regulated disclosure language, internal codenames). Train custom
   categories via Content Safety Studio with ~100 examples per category.

7. **Architecture pattern (sidecar / middleware).**
   - Request → Prompt Shield → (LLM call) → Output classifiers (harm, groundedness,
     protected material) → Response.
   - Fail-closed: if Content Safety call errors, do not return uncontrolled LLM output.
   - Log every decision (allowed/blocked/flagged) for audit and tuning.

8. **Performance.** Each guardrail adds 50–300ms. Parallelize input and output checks;
   short-circuit on first hard block. Budget for the latency in user expectation.

9. **Operate.** Weekly review of blocked-content samples (with privacy controls).
   Tune thresholds, custom categories, and blocklists. Track false positive / false
   negative rates per category.

## Guardrails
- **Default filters are baseline, not a complete safety strategy.** Prompt Shields,
  groundedness, and custom categories close the real gaps.
- **Don't expose harm-category scores to end users.** A "you said X violence score 6"
  message helps attackers tune jailbreaks.
- **Fail-closed on Content Safety errors.** A 500 from the service should not result in
  unmoderated LLM output reaching users.
- **Indirect prompt injection is the under-appreciated risk.** A user's prompt is
  visible; a malicious string in a fetched web page or document is not. Always shield
  grounding content.
- **Groundedness detection requires you to send the grounding sources.** RAG apps
  natively have them; pure chat apps don't.
- **Custom categories are not a substitute for product policy.** They detect; they
  don't prevent the user from generating harmful content with another tool.
- **Protected material detection is best-effort.** Copyright/IP review is a legal
  process, not an API result.
- **Content Safety is per-call billed.** High-traffic apps need cost modeling; not all
  features run on every call (groundedness is expensive — gate on use case).
- **Pair with Defender for Cloud AI** for SOC-side detection of attempts and patterns
  (`defender-for-cloud-ai`).

## Common anti-patterns
- **"Default filter is enough"** — no jailbreak/injection protection.
- **"Indirect prompt shield skipped because 'all our sources are trusted'"** — they're
  trusted to be there; not trusted to be uncompromised. RAG corpora get poisoned.
- **"Groundedness on every chat call regardless of grounding"** — burns cost on pure
  chat without grounding sources to check against.
- **"Logged user prompts in plaintext for tuning"** — privacy/PII exposure. Pseudonymize.
- **"Returned the Content Safety severity score in error messages"** — gives attacker
  a tuning oracle.
- **"Custom categories trained on 5 examples"** — no model lift. Need ~100 minimum.
- **"Blocklists used as the main strategy"** — misses paraphrases. Combine with
  classifier categories.
- **"Content Safety only on output"** — input attacks (jailbreaks) reach the model.

## Example prompts
- `Architect Content Safety guardrails for a RAG-based customer support assistant on
  Azure OpenAI.`
- `Configure Prompt Shields for a Foundry agent with internet-grounded tools.`
- `Tune content filter severity thresholds for a teen-audience product.`
- `Add groundedness detection to flag hallucinations in our medical Q&A assistant.`
- `Train a custom category for "competitor mention" and integrate as output blocklist.`
- `Cost and latency model: Content Safety calls per chat turn on a 10K-user app.`
- `IR runbook: how SOC handles "prompt shield blocked attempted jailbreak" pattern
  (paired with Defender for Cloud AI alert).`

## Microsoft Learn
- Content Safety overview: https://learn.microsoft.com/azure/ai-services/content-safety/overview
- Text moderation: https://learn.microsoft.com/azure/ai-services/content-safety/concepts/harm-categories
- Image moderation: https://learn.microsoft.com/azure/ai-services/content-safety/quickstart-image
- Prompt Shields: https://learn.microsoft.com/azure/ai-services/content-safety/concepts/jailbreak-detection
- Groundedness detection: https://learn.microsoft.com/azure/ai-services/content-safety/concepts/groundedness
- Protected material: https://learn.microsoft.com/azure/ai-services/content-safety/concepts/protected-material
- Custom categories: https://learn.microsoft.com/azure/ai-services/content-safety/concepts/custom-categories
- Azure OpenAI content filtering: https://learn.microsoft.com/azure/ai-services/openai/concepts/content-filter
- Content Safety Studio: https://learn.microsoft.com/azure/ai-services/content-safety/studio-quickstart
