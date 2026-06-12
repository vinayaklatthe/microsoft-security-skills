---
name: microsoft-agent-365
description: "Guidance for managing AI agents at enterprise scale with Microsoft Agent 365 - the control plane that lets admins observe, govern, and secure every agent (Microsoft, Copilot Studio, and third-party) from a single registry, using Microsoft Entra Agent ID for identity, Microsoft Purview for data security, and Microsoft Defender for runtime threat protection. WHEN: Microsoft Agent 365, Agent 365, manage agents at scale, agent control plane, agent registry, agent map, observe govern secure agents, Entra Agent ID, agent identity lifecycle, third-party agent governance, secure AI agents tenant-wide, agent sprawl, agent inventory. DO NOT USE for Purview-only data controls on a single agent (use purview-agent-365-security) or end-user Copilot oversharing (use purview-copilot-oversharing)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Managing AI Agents with Microsoft Agent 365

Microsoft Agent 365 is the **control plane for agents** - it extends the infrastructure you
use to manage people (identity, access, data protection, threat defense) to AI agents,
regardless of where they originate (Microsoft, Copilot Studio, partner/third-party, or
custom-built). It organises the work into three pillars: **observe, govern, and secure**.
Generally available for Commercial since 1 May 2026, licensed per user, with Microsoft E5 as
the recommended prerequisite.

## When to use
Standing up enterprise-wide management for a growing fleet of AI agents - when you need a single
inventory, consistent lifecycle and access controls, and unified security across agents built
on different platforms. Use it as the orchestration layer that ties together Entra, Purview,
and Defender for agents.

Do not use this skill for Purview data-security controls on a single agent in isolation (use
`purview-agent-365-security`), or to remediate Microsoft 365 Copilot oversharing of end-user
content (use `purview-copilot-oversharing` / `m365-oversharing`).

## Pick the right pillar for the problem
| Goal | Pillar | Primary surface |
|---|---|---|
| Know how many agents exist, who owns them, how they're used | **Observe** | Agent registry + Agent Map in Microsoft 365 admin center |
| Onboard, approve, review, and retire agents with policy | **Govern** | Agent management in M365 admin center + Microsoft Purview |
| Give each agent a managed identity and risk-based access | **Secure** | Microsoft Entra Agent ID + Conditional Access |
| Stop agents leaking or over-accessing sensitive data | **Secure** | Microsoft Purview (DSPM for AI, DLP, sensitivity labels, IRM) |
| Detect malicious or unsafe agent behaviour at runtime | **Secure** | Microsoft Defender for Cloud Apps (real-time agent protection) |

Rule of thumb: treat every agent as a **first-class, governed identity** - not a feature of an
app. The more autonomous the agent, the more it must be managed like a privileged account.

## Approach
1. **Observe - build the inventory** - Use the Agent 365 **agent registry** in the Microsoft 365
   admin center to get a single, centralised view of every agent (Microsoft, Copilot Studio,
   third-party), its owner, adoption, activity, and health. Use **Agent Map** to see
   relationships and access.
   *Verify: the registry lists agents from more than one build platform with named owners.*
2. **Assign identity (Entra Agent ID)** - Ensure each agent has a managed **Microsoft Entra
   Agent ID** so it can be authenticated, authorised, and governed like any other directory
   identity - not a shared secret or anonymous app.
   *Verify: each production agent resolves to a distinct Entra Agent ID with an owner.*
3. **Govern lifecycle & access** - Onboard agents intentionally with IT oversight, apply
   least-privilege access to resources/data, require approvals, and run periodic access reviews;
   retire low-value or ownerless agents on a cadence.
   *Verify: an agent cannot reach a data source it was not explicitly granted.*
4. **Secure the data (Purview)** - Bring agent instances into Microsoft Purview: DSPM for AI for
   visibility, data classification + sensitivity labels, DLP, Insider Risk Management, and
   Communication Compliance. New Agent 365 agent instances are auto-enabled for audit and
   sensitive-data detection.
   *Verify: DSPM for AI's AI observability page shows the agent instance and its data risks.*
5. **Apply risk-based access (Conditional Access)** - Use Entra Conditional Access so agents and
   the users they act for meet consistent, risk-based access conditions.
   *Verify: a risky context blocks or steps up the agent's access as policy dictates.*
6. **Defend at runtime (Defender)** - Use Microsoft Defender for Cloud Apps real-time agent
   protection to detect and block unsafe behaviour, prompt-injection, and malicious activity
   while the agent runs.
   *Verify: a simulated unsafe action raises a Defender alert / is blocked.*
7. **Audit & meet regulations** - Confirm agent interactions land in Purview Audit / Activity
   Explorer and use Compliance Manager AI-regulation assessments to track obligations.
   *Verify: an agent prompt/response appears in unified audit search with agent + user metadata.*

## Guardrails
- Agent 365 is an orchestration layer over Entra, Purview, and Defender - its protection is only
  as strong as the underlying classification, labelling, and oversharing posture. Fix the data
  estate first; agents amplify every gap.
- Treat agent identities as governed, least-privilege identities with owners and renewal
  cadences. Permanent broad permissions on an agent identity is a future incident.
- Require security review before tenant-wide publish of any agent, including pre-integrated
  third-party agents from the admin center.
- Don't assume capability parity: Purview support varies by capability (for example, encryption
  without sensitivity labels is not supported for Agent 365 AI interactions). Check the supported
  matrix before relying on a control.
- Agent 365 works best with E5 and requires at least one qualifying Agent 365 license - confirm
  licensing before planning a rollout.
- Communicate to users that agent interactions are logged and reviewed; get legal/HR sign-off on
  monitoring scope.

## Common anti-patterns
- No agent inventory - nobody knows how many agents are in production or who owns them.
- Letting agents run as shared app registrations instead of distinct Entra Agent IDs.
- Onboarding third-party agents tenant-wide with no DLP, no access scoping, and no review.
- Skipping runtime detection (Defender) and relying only on build-time policy.
- Leaving ownerless or low-value agents running - cost and permission-sprawl risk.

## Example prompts
- `Set up Microsoft Agent 365 to manage all our AI agents at scale.`
- `How do I observe, govern, and secure agents from one control plane?`
- `Give each agent an Entra Agent ID and least-privilege access.`
- `Use Purview and Defender to secure Agent 365 agents.`
- `Build an agent inventory and retire ownerless agents.`

## Microsoft Learn
- Microsoft Agent 365 overview: https://learn.microsoft.com/en-us/microsoft-agent-365/overview
- Agent management in Microsoft 365 admin center: https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-365-overview
- Agent registry: https://learn.microsoft.com/en-us/microsoft-365/admin/manage/agent-registry
- Purview for Microsoft Agent 365: https://learn.microsoft.com/en-us/purview/ai-agent-365
- Real-time agent protection (Defender for Cloud Apps): https://learn.microsoft.com/en-us/defender-cloud-apps/real-time-agent-protection-during-runtime
- Microsoft Entra licensing (incl. Entra Agent ID): https://learn.microsoft.com/en-us/entra/fundamentals/licensing
- Responsible AI FAQ for Agent 365: https://learn.microsoft.com/en-us/microsoft-agent-365/admin/responsible-ai-faq
