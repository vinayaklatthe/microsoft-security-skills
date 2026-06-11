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
work inside the products security teams already use.

## When to use
Offloading repetitive, high-volume triage and remediation tasks while keeping human oversight.

## Examples of agents
- **Phishing Triage** (Defender for Office 365) — assesses user-submitted phishing.
- **Alert Triage** (Microsoft Purview, e.g., DLP/Insider Risk) — prioritises alerts.
- **Conditional Access Optimization** (Entra) — recommends CA policy improvements.
- **Vulnerability Remediation** (Intune) — helps prioritise and drive remediation.
- **Threat Intelligence Briefing** — generates tailored threat briefings.
(Plus partner-built agents in the ecosystem.)

## Design approach
1. **Provision** — Agents consume Security Copilot capacity (SCUs); confirm capacity and the
   relevant product licensing.
2. **Agent identity & permissions** — Each agent runs with an **agent identity**; grant
   least-privilege access and review what data and actions it can touch.
3. **Supervise** — Run agents with human-in-the-loop: review agent decisions, provide feedback so
   the agent improves, and define which actions are autonomous vs require approval.
4. **Measure** — Track agent outcomes (time saved, accuracy) and tune.

## Guardrails
- Keep humans in the loop for consequential actions; start in a supervised/recommendation mode.
- Govern agent identities like any privileged identity — least privilege, monitoring, lifecycle.
- Review agent activity logs regularly.

## Microsoft Learn
- Agents overview: https://learn.microsoft.com/copilot/security/agents-overview
- Security Copilot: https://learn.microsoft.com/security-copilot/microsoft-security-copilot
- Manage agent identities (Entra Agent ID): https://learn.microsoft.com/entra/identity/
