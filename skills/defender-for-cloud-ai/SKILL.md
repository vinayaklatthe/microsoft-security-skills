---
name: defender-for-cloud-ai
description: "Guidance for Microsoft Defender for Cloud — AI workload protection (AI-SPM and runtime threat detection for generative AI). Covers AI Security Posture Management (discovery of Azure OpenAI / Azure AI Foundry / Amazon Bedrock / Google Vertex AI resources, identification of grounding data exposure, model deployment posture), runtime threat detection on Azure OpenAI (prompt injection / jailbreak attempts, sensitive data leakage in prompts/responses, wallet abuse, credential leakage), integration with Azure AI Content Safety Prompt Shields, attack path analysis for AI workloads, alert investigation in Defender XDR, and pairing with Purview DSPM for AI (user side) and Azure AI Content Safety (model side). WHEN: Defender for Cloud AI, AI-SPM, AI workload protection, Azure OpenAI threat detection, prompt injection alert, jailbreak alert Azure OpenAI, AI wallet abuse, AI workload posture, Amazon Bedrock posture, Vertex AI posture, generative AI security Azure. DO NOT USE for end-user AI usage governance (use purview-ai-hub), content moderation API (use azure-ai-content-safety), or M365 Copilot rollout (use copilot-for-m365-readiness)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Cloud — AI Workload Protection

Defender for Cloud's AI plan protects the **AI workloads themselves** — the Azure OpenAI,
Azure AI Foundry, Amazon Bedrock, and Google Vertex AI deployments your organization runs.
Two capabilities:

- **AI Security Posture Management (AI-SPM)**: agentless discovery and posture (where AI
  is deployed, what grounding data is exposed, what misconfigurations exist).
- **Runtime threat protection for AI workloads**: detections on Azure OpenAI for prompt
  injection, jailbreaks, sensitive-data leakage, wallet abuse, and credential leakage,
  integrating Azure AI Content Safety **Prompt Shields**.

## When to use
You build or operate generative AI applications on Azure OpenAI / Azure AI Foundry (and
optionally Bedrock/Vertex), and need posture + runtime detection on the workload side.

**Do not use this skill** for end-user-side AI governance (`purview-ai-hub`), Content
Safety policy authoring (`azure-ai-content-safety`), or M365 Copilot rollout
(`copilot-for-m365-readiness`).

## What you get

| Capability | Scope |
|---|---|
| Multicloud AI discovery | Azure (OpenAI, Foundry), AWS Bedrock, GCP Vertex AI (via existing multicloud connectors) |
| Sensitive grounding data exposure | Identifies grounding storage with sensitive data + public/over-permissive access |
| Attack path analysis | "Internet-exposed AI endpoint with sensitive grounding + over-privileged identity" |
| Runtime detections (Azure OpenAI) | Prompt injection, jailbreak, sensitive data leakage in prompts/responses, suspicious access patterns, wallet abuse |
| Prompt Shields integration | Detections leverage Content Safety prompt-shield signals |
| Alerts in Defender XDR | Correlated incidents alongside cloud and identity signals |

## Approach

1. **Prereqs.** Defender for Cloud enabled at subscription scope. **Defender CSPM**
   plan on (provides AI-SPM via attack path analysis). **Defender for AI Services**
   runtime plan on for Azure OpenAI workloads. For non-Microsoft clouds, the AWS/GCP
   connector must already be in place.

2. **Discover AI assets.** Within 24 hours of enablement, Defender for Cloud inventory
   shows Azure OpenAI, Foundry, Bedrock, and Vertex resources. Review the **AI Security
   posture** dashboard:
   - Which AI resources are public-network-exposed.
   - Which use Microsoft Entra (good) vs API key (warns).
   - Which grounding stores (Azure AI Search, Blob, Cosmos) contain sensitive data
     classified by Purview, and whether they're over-permissioned.

3. **Triage attack paths first.** The high-value paths are typically:
   - *Internet-exposed Azure OpenAI endpoint + grounding store with sensitive data +
     identity with broad RBAC.*
   - *Foundry hub with public networking + customer-managed grounding data + no Content
     Safety filter.*
   Fix the path (private endpoint, scope identity, enable Content Safety) rather than
   triaging each finding in isolation.

4. **Enable runtime detection (Azure OpenAI).** Single toggle per subscription. The
   service samples prompts/responses (subject to your data privacy configuration) and
   evaluates against Microsoft's threat models plus Prompt Shields.

5. **Wire Content Safety Prompt Shields** in your application's Azure OpenAI call
   chain. Defender alerts gain higher fidelity when Prompt Shields are active because
   the workload itself has rejected the attempt — Defender now alerts the SOC.

6. **Alert response runbook.**
   - **Prompt injection / jailbreak detected**: enrich with caller identity, source
     IP, repeat rate; if persistent, revoke API key / disable user.
   - **Sensitive data leakage in response**: investigate grounding data; tighten
     RBAC on grounding store; add Content Safety output filter.
   - **Wallet abuse** (high cost from a single principal): rate-limit, revoke,
     investigate compromised credential.
   - **Credential leakage in prompt**: rotate the leaked secret, hunt for prior
     exposure in logs.

7. **Defender XDR / Sentinel integration.** Alerts surface under "Microsoft Defender
   for AI Services" / "Cloud" categories. Build cross-product correlations
   (e.g., AI alert + Defender for Cloud Apps anomalous user activity).

8. **Continuous posture review.** Weekly: new AI deployments without private endpoint,
   new grounding stores with sensitive data, new identities with broad AI RBAC.

## Guardrails
- **Runtime protection samples prompts/responses.** Validate data privacy posture and
  customer-facing disclosures; in some regulated industries this requires customer
  consent.
- **Public endpoints are the dominant risk.** AI services default to public unless you
  configure private endpoints; bake into landing-zone policy.
- **API key auth is the second dominant risk.** Force Entra-based authentication; rotate
  any keys quarterly minimum.
- **Grounding data is the new database.** Same crown-jewel treatment — sensitivity
  labels, RBAC scoping, Defender for Storage on the source.
- **Content Safety is separate from Defender.** You need both: Content Safety blocks at
  the model call, Defender detects/alerts on the security incident.
- **Defender for AI does not protect against business-logic abuse of your AI app.** That
  remains your application's responsibility (input validation, rate limits, auth).
- **Multicloud AI runtime detection is staged rollout.** Verify what's GA vs preview for
  Bedrock/Vertex in your region.

## Common anti-patterns
- **"AI workload deployed with public endpoint + API key for 'developer velocity'"** —
  becomes a permanent attack surface and the #1 alert source.
- **"Grounding data store with sensitive data and 'Reader' to AAD-everyone'"** —
  exposure surfaces in Copilot-of-your-app the same way M365 Copilot oversharing
  does.
- **"Enabled Content Safety Prompt Shields, skipped Defender for AI"** — you reject
  attacks but don't see the campaign or correlate with identity.
- **"Enabled Defender for AI without Defender CSPM"** — lose attack path analysis,
  alerts arrive without context.
- **"Treated wallet-abuse alerts as cost management problem only"** — usually a
  compromised credential. Investigate as a security incident.
- **"Sentinel alert routing not configured"** — alerts pile in DfC console, no SOC
  triage.
- **"API key 'temporarily' in code"** — leaked credentials trigger detections, but
  you've already paid the cost.

## Example prompts
- `Enable Defender for Cloud AI plan across 12 subscriptions with Azure OpenAI and AI
  Foundry deployments.`
- `Inventory AI workloads and grounding stores; identify top-10 attack paths.`
- `Build runbook for "Prompt injection detected" alerts: triage, containment, hunt.`
- `Integrate Azure AI Content Safety Prompt Shields with our Foundry chat app and
  enable Defender runtime detection.`
- `Posture pipeline: Azure Policy to require private endpoint + Entra auth on all
  Azure OpenAI resources.`
- `Connect AWS Bedrock and GCP Vertex AI usage into Defender AI-SPM.`
- `Sentinel detection correlating Defender AI wallet-abuse alert with sign-in risk on
  the calling identity.`

## Microsoft Learn
- AI plan overview: https://learn.microsoft.com/azure/defender-for-cloud/ai-threat-protection
- AI-SPM: https://learn.microsoft.com/azure/defender-for-cloud/ai-security-posture
- Enable threat protection for AI: https://learn.microsoft.com/azure/defender-for-cloud/ai-threat-protection
- Alerts reference (AI): https://learn.microsoft.com/azure/defender-for-cloud/alerts-reference#alerts-ai
- Attack path: https://learn.microsoft.com/azure/defender-for-cloud/concept-attack-path
- Azure AI Content Safety Prompt Shields: https://learn.microsoft.com/azure/ai-services/content-safety/concepts/jailbreak-detection
- Azure OpenAI Entra auth: https://learn.microsoft.com/azure/ai-services/openai/how-to/managed-identity
- Multicloud connectors: https://learn.microsoft.com/azure/defender-for-cloud/multicloud
