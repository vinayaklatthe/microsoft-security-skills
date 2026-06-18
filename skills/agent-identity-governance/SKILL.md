---
name: agent-identity-governance
description: "Guidance for governing the identities of AI agents and non-human identities (NHIs) — Microsoft 365 Copilot Studio agents, Microsoft Foundry agents, custom AI agents, and traditional service principals/managed identities — through their full lifecycle. Covers ownership and tagging, scoped permissions and consent (delegated vs application; Sites.Selected; mailbox-scoped Graph), credential hygiene (federated credentials, certificates, no secrets), Conditional Access for workloads, agent-level access reviews via Entra ID Governance, lifecycle workflows for agent decommissioning, audit (agent prompts, agent actions, agent identity sign-ins), incident response when an agent is compromised, and integration with Purview AI Hub for usage signals. WHEN: AI agent identity governance, non-human identity governance, NHI lifecycle, Copilot Studio agent identity, Foundry agent governance, agent service principal, scoped Graph permissions agent, agent access review, decommission AI agent, agent credential rotation, compromised agent response. DO NOT USE for workload identity federation patterns alone (use entra-workload-identity), Entra ID Governance for humans (use entra-id-governance), or Copilot Studio agent build guidance unrelated to security."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# AI Agent & Non-Human Identity Governance

AI agents — Microsoft 365 Copilot Studio agents, Microsoft Foundry agents, custom-built
ones, plus traditional service principals and managed identities — are now the
fastest-growing identity population in most tenants. They authenticate, hold permissions,
act on behalf of users (or themselves), and are usually under-governed.

This skill is the lifecycle governance layer for those identities: ownership, scoping,
credential hygiene, reviews, decommissioning, and incident response.

## When to use
Establishing or maturing governance for the agent / NHI population — Copilot Studio
agents, Foundry agents, custom LLM agents, and the service principals that back them.

**Do not use this skill** for workload identity federation patterns alone
(`entra-workload-identity`), human identity governance (`entra-id-governance`), or
generic agent build guidance.

## Agent identity inventory — know what you're governing

| Class | Identity model | Surface |
|---|---|---|
| **Copilot Studio agent (M365)** | Tenant-scoped agent identity + per-user delegated permissions | M365 admin center / Copilot Studio |
| **Microsoft Foundry agent** | Service principal + managed identity + per-user OBO | Azure portal / Foundry |
| **Custom AI agent (your code)** | App registration + workload identity federation / managed identity | Entra admin center |
| **Plugin / connector** | Service principal + delegated/app Graph permissions | Entra admin center |
| **Legacy automation service principal** | App registration, often with secret | Entra admin center |

## Approach

1. **Inventory and tag.** Pull every app registration, service principal, and Copilot
   Studio / Foundry agent. Tag each with:
   - **Owner** (person + group).
   - **Sponsor / business owner**.
   - **Purpose** (one sentence).
   - **Data scope** (which tenants/sites/mailboxes/resources).
   - **Lifecycle stage** (pilot / production / sunset).
   - **Criticality** (tier 0 / 1 / 2).
   Orphaned identities → freeze them; require owner re-claim.

2. **Scope permissions tightly.**
   - Microsoft Graph: prefer **Sites.Selected** over `Sites.Read.All`, **mailbox
     scoping via Application Access Policy** over `Mail.Send`, custom security
     attributes over broad directory roles.
   - Azure: scope role assignments at RG or resource, never subscription Owner unless
     truly required.
   - Copilot Studio agent knowledge sources: explicit site/library lists, not "All
     SharePoint."
   - Foundry agent tools: only the tools needed; remove `http` plugin unless
     necessary.

3. **Credential hygiene.** No client secrets in new builds — federated credentials
   (GitHub Actions, Azure DevOps, AKS, external OIDC) or certificates with auto-rotation
   via Key Vault. Existing secrets: inventory, cap expiry at 180 days, rotate via
   automation, plan migration to federation.

4. **Conditional Access for workloads** (Workload Identities Premium). Apply to
   tier-0 agents and externally-callable agents:
   - Restrict source IP ranges.
   - Block legacy auth.
   - Require named locations.
   Don't try to apply to every SP in the tenant — focus on high-blast-radius identities.

5. **Access reviews for agents** via Entra ID Governance. Owner reviews per quarter:
   - Still needed?
   - Still the right scope?
   - Credential rotation up to date?
   - Owner / sponsor still in role?
   Auto-disable on owner non-response.

6. **Lifecycle workflows.** Build automation for:
   - **Provisioning**: owner-initiated request → approval → SP created with template
     permissions, tagged, owner assigned.
   - **Modification**: scope change requires re-approval.
   - **Decommissioning**: 30-day disable window, then delete; remove role
     assignments, federated credentials, knowledge-source attachments.

7. **Audit and monitoring.**
   - Stream `ServicePrincipalSignInLogs` and `AuditLogs` to Sentinel.
   - For Copilot Studio agents: interaction audit logs via Purview Audit.
   - Detections:
     - New high-privilege role assignment to an agent identity.
     - Agent sign-in from unexpected IP/country.
     - Sudden spike in Graph API calls per agent.
     - Sensitive data access by agent outside business hours.
     - New credential added to an agent by an identity other than its owner.

8. **Incident response when an agent is compromised.**
   1. **Disable the identity** (block sign-in on the app registration / SP).
   2. **Rotate credentials**, revoke refresh tokens.
   3. **Hunt actions** taken by the agent identity in the past 7–30 days
      (Graph audit, resource activity).
   4. **Notify data owners** for the resources the agent had access to.
   5. **Root cause** (leaked secret? OAuth consent phishing? supply chain?).
   6. **Restore with tightened scope** or retire.

9. **Couple with usage signals.** Purview AI Hub / DSPM for AI shows *what the agent
   does* (sensitive data flowing through prompts). Pair with identity audit to get a
   complete view.

## Guardrails
- **Every agent identity has a named human owner.** Empty owners list = orphan =
  audit/security risk.
- **No client secrets for new identities.** Federation > certificate > secret.
- **Sites.Selected (and similar) is mandatory where it exists.** "Quick start with
  `.All` and we'll scope later" never scopes later.
- **Conditional Access for workloads is a separate license.** Confirm SKU before
  designing.
- **OAuth consent for new agents must be admin-reviewed.** End-user consent for high-
  privilege scopes is the agent equivalent of a phishing onboarding.
- **Decommissioned ≠ deleted in 1 day.** 30-day disable window catches "wait, that was
  in use somewhere."
- **Agent credentials are not for human use.** Don't share an agent's secret with the
  team for "easier debugging."
- **Tag agents with data scope and tier.** Without it, IR and reviews are guesswork.

## Common anti-patterns
- **"Copilot Studio agent grounded on 'All SharePoint'"** — same oversharing problem as
  Copilot itself, scaled. Use site-scoped knowledge sources.
- **"Agent SP granted Mail.Send Application permission tenant-wide"** — can email as
  anyone. Use app access policies to scope to specific mailboxes.
- **"Owner field set to a leaver's account"** — orphaned, no review, no rotation.
- **"Long-lived client secret in agent code"** — git history forever; leak detection
  too late.
- **"All agents in tier-0 because 'they're all important'"** — review and IR effort
  becomes uniform but is uniformly low quality. Real tiering.
- **"Decommissioned by deleting the app reg, leaving role assignments behind"** —
  dangling principal IDs in RBAC; restore-with-same-id risk.
- **"No audit on Copilot Studio agent interactions"** — compromised agent acts
  invisibly.
- **"Treated agent identity governance as identical to human IGA"** — different
  lifecycle, different controls, different reviews.

## Example prompts
- `Inventory all Copilot Studio agents, Foundry agents, and service principals in the
  tenant and produce an owner + scope + tier report.`
- `Roll out access reviews for 600 agent identities via Entra ID Governance quarterly.`
- `Scope a Copilot Studio agent for HR from "All SharePoint" to 4 specific knowledge
  sites.`
- `Build a decommissioning workflow: 30-day disable, owner notification, full cleanup of
  RBAC and federated credentials.`
- `Sentinel detections for agent identity compromise: new credential, anomalous sign-in,
  spike in Graph calls.`
- `IR runbook: compromised Foundry agent that called Microsoft Graph for 48 hours —
  containment, hunt, notification.`
- `Replace client secrets across 120 legacy automation SPs with workload identity
  federation or Key Vault certificates.`
- `Apply Conditional Access for workload identities to all tier-0 agents.`

## Microsoft Learn
- Workload identities overview: https://learn.microsoft.com/entra/workload-id/workload-identities-overview
- Entra ID Governance overview: https://learn.microsoft.com/entra/id-governance/identity-governance-overview
- Access reviews for service principals: https://learn.microsoft.com/entra/id-governance/create-access-review
- Conditional Access for workload identities: https://learn.microsoft.com/entra/identity/conditional-access/workload-identity
- Application access policies (Graph mailbox scoping): https://learn.microsoft.com/graph/auth-limit-mailbox-access
- Sites.Selected: https://learn.microsoft.com/sharepoint/dev/solution-guidance/security-apponly-azuread
- Copilot Studio security and governance: https://learn.microsoft.com/microsoft-copilot-studio/security-and-governance
- Microsoft Foundry agent security: https://learn.microsoft.com/azure/ai-foundry/concepts/ai-resources
- Audit (unified) for Copilot: https://learn.microsoft.com/purview/audit-copilot
- Workload identity federation: https://learn.microsoft.com/entra/workload-id/workload-identity-federation
