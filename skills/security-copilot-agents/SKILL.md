---
name: security-copilot-agents
description: "Guidance for Microsoft Security Copilot agents — autonomous, purpose-built AI agents (e.g., phishing triage, alert triage, conditional access optimization, vulnerability remediation) that work within Security Copilot. Covers available agents, identity/permissions, and supervision. WHEN: Security Copilot agents, autonomous SOC agent, phishing triage agent, alert triage agent, agent identity, supervise AI agent, agentic security, Copilot agent permissions, automate phishing triage, AI agent for SOC, autonomous alert triage, hands-off triage of high-volume alerts. DO NOT USE for basic Security Copilot setup, SCU provisioning, or promptbooks (use security-copilot)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Security Copilot Agents

Security Copilot **agents** are purpose-built, semi-autonomous AI agents that operate within
Security Copilot to take on high-volume security workflows, learn from analyst feedback, and
act inside the Microsoft Security products. Each agent has its own **Entra Agent ID**, scoped
permissions, and a supervision model.

## When to use
Use this skill when the user wants to offload a **high-volume, repetitive** triage or
remediation workflow to an agent and is ready to govern an autonomous workload identity.

**Do not use this skill** for:
- Basic Security Copilot setup, SCU provisioning, promptbooks (use `security-copilot`)
- General Entra Agent ID design (use `entra-id` + Entra Agent ID guidance)
- Building a custom agent from scratch (this skill is operating built-in agents)

## Pick the right agent for the job

| If the team is drowning in... | Agent | Owning product | Recommended first mode |
|---|---|---|---|
| User-reported phishing tickets | **Phishing Triage** | Defender for Office 365 | Recommendation - human approves verdicts for 2 weeks |
| DLP / Insider Risk alert backlog | **Alert Triage (Purview)** | Purview | Recommendation - measure precision before autonomy |
| Stale or duplicate Conditional Access policies | **Conditional Access Optimization** | Entra ID | Recommendation only - never autonomous in production |
| Patch / vuln backlog for endpoints | **Vulnerability Remediation** | Intune + Defender Vuln Mgmt | Recommendation; deploy patches via existing change control |
| Threat-landscape briefings for leadership | **Threat Intelligence Briefing** | Defender Threat Intelligence | Autonomous (read-only) |
| SOC analyst onboarding / context lookups | **Conditional Access / IR partner agents** | Partner ecosystem | Recommendation - third-party data path |

> **Rule of thumb:** start every agent in **Recommendation mode** for 2-4 weeks. Measure
> agreement rate between agent verdict and human verdict. Only graduate to autonomous when
> agreement > 90% on the relevant queue.

## Approach

1. **Provision capacity and licensing first** — Each agent consumes **Security Copilot Compute
   Units (SCUs)**. Most built-in agents need ~1-2 SCUs per concurrent workflow. Confirm SCU
   commitment and the owning product licence (e.g. Phishing Triage needs Defender for Office
   365 P2). Without both, the agent surfaces in UI but fails at execution.
   *Verify: Security Copilot → Owner settings → Capacity shows enough SCUs reserved for the
   agents you plan to enable.*
2. **Set up the agent identity** — Each agent has its own Entra Agent ID (workload identity).
   Treat it as a privileged service principal: name it predictably (e.g.
   `sc-agent-phishingtriage-prod`), document its owner, register it in your identity
   inventory, and enable sign-in monitoring.
   *Verify: Entra → Enterprise applications shows the agent identity with the expected
   API permissions and no extras.*
3. **Scope permissions to least privilege** — Built-in agents request a set of Graph / product
   permissions. Review and **remove anything not needed** for your scenario. For example,
   Alert Triage does not need *Mail.Send* even if the consent flow offers it.
   *Verify: a test action in the agent succeeds; a deliberately out-of-scope action (e.g.
   sending mail when only triage is intended) fails.*
4. **Configure supervision mode per action** — Each agent has actions with different blast
   radius. Set the mode per action, not per agent:
   - **Recommendation** = agent suggests, human approves (always for blocking, deleting,
     password reset, MFA reset, policy change)
   - **Autonomous** = agent acts without approval (acceptable for labelling, classification,
     read-only enrichment, briefing generation)
   *Verify: an irreversible action in test data prompts for human approval; a reversible
   action proceeds without.*
5. **Pilot on a slice** — Scope the agent to one team, one mailbox, one site, or one device
   group for 2-4 weeks. Measure: agreement rate, time-to-decision, false positive/negative
   count, override rate.
   *Verify: pilot dashboard shows >90% agent-human agreement before expanding scope.*
6. **Wire to your SOC tooling** — Agent activity logs flow to Defender XDR and Sentinel via
   the **AuditLogs** and agent-specific tables. Build a workbook tracking agent decisions vs
   human overrides so drift is visible.
7. **Lifecycle the agent identity** — When you decommission an agent (or a workflow), disable
   the Entra Agent ID, revoke its API permissions, and remove it from your privileged
   identity inventory. Agent identities that outlive their use case are tomorrow's blast
   radius.

## Guardrails
- **Human-in-the-loop for consequential actions, always.** Password reset, MFA reset, account
  disable, message purge, policy change, device wipe - never autonomous.
- **Govern agent identities like privileged service principals.** They are not service accounts
  to forget. Apply Conditional Access (where supported), monitor sign-ins, review API
  permissions quarterly, rotate any agent secrets, and audit consented permissions.
- **Measure agreement rate before graduating to autonomous.** A high-volume agent acting at
  85% accuracy is a 15% incident factory at scale. Use the 90% threshold or higher.
- **Watch SCU consumption.** Agents can burn through SCU capacity unexpectedly during incident
  spikes; set alerts on SCU utilisation > 80%.
- **Do not pile agents on the same identity.** Each built-in agent has its own Entra Agent ID;
  consolidating is not supported and breaks the audit chain.
- **Agent prompts can be poisoned.** Phishing-Triage reads user-submitted email content;
  treat agent inputs as untrusted. Microsoft has built-in mitigations - do not add your own
  unsanitised data sources.

## Common anti-patterns
- **"Enable in autonomous mode on day one."** No baseline of accuracy; first false positive
  becomes a real outage (blocked exec mailbox, disabled VIP account).
- **"Use Global Admin for the agent identity."** Catastrophic blast radius. Use the agent's
  default scoped permissions and trim further.
- **"Treat the agent as the SOC analyst."** Agents augment, not replace. Without a human
  review loop you lose the feedback that improves the agent.
- **"Forget to disable retired agent identities."** Inactive agent IDs sit in Entra with
  consented Graph permissions - prime supply-chain target.
- **"Skip the pilot."** Org-wide rollout exposes a queue-specific failure mode you would have
  caught in a 2-week pilot.

## Example prompts
- `Deploy the Phishing Triage agent in Security Copilot.`
- `Which Security Copilot agent should I pilot first for my SOC?`
- `How do I supervise an autonomous alert triage agent and set permissions?`
- `What permissions does the Conditional Access Optimization agent need?`
- `Configure agent identity for an agentic SOC.`
- `Measure the accuracy of the Alert Triage agent before going autonomous.`

## Microsoft Learn
- Agents overview: https://learn.microsoft.com/copilot/security/agents-overview
- Security Copilot platform: https://learn.microsoft.com/security-copilot/microsoft-security-copilot
- Discover agents (catalog): https://learn.microsoft.com/copilot/security/discover-agents
- Configure and manage agents: https://learn.microsoft.com/copilot/security/agents-manage
- Entra Agent ID and identity for AI: https://learn.microsoft.com/entra/identity/
- Manage SCU capacity: https://learn.microsoft.com/security-copilot/manage-usage
