---
name: security-copilot
description: "Guidance for Microsoft Security Copilot - the generative-AI security platform that helps analysts investigate, hunt, summarise, and respond using natural language, plugins, promptbooks, and embedded experiences. Covers SCU provisioning, plugins, promptbooks, governance, and the standalone vs embedded experience choice. WHEN: Microsoft Security Copilot, AI for SOC, security copilot units SCU, promptbooks, Copilot plugins, natural language investigation, summarise incident with AI, Copilot for Security setup, how do I use AI in my SOC, explain a KQL query with AI, summarise an alert for a stakeholder. DO NOT USE when the goal is configuring autonomous triage or remediation agents (use security-copilot-agents)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Security Copilot

Microsoft Security Copilot is a generative-AI security platform that helps security and IT
teams investigate incidents, hunt threats, summarise findings, and respond at machine speed
using natural language, grounded in your security data and Microsoft threat intelligence.

## When to use
Accelerating SOC investigation, reporting, and analyst productivity across Microsoft and
third-party security data using natural-language workflows.

**Do not use this skill** for:
- Configuring autonomous triage/remediation agents (use `security-copilot-agents`)
- Building a SIEM analytics rule (use `sentinel`)
- Configuring Defender XDR investigations or actions (use `defender-xdr`)

## Pick the right experience for the task

| Task | Use this experience | Why |
|---|---|---|
| Multi-step investigation across products | **Standalone portal** | Cross-plugin reasoning, promptbooks |
| Summarise this specific incident | **Embedded in Defender XDR** | Context already loaded |
| Explain or translate a KQL query | **Embedded in Sentinel** | Inline in the query editor |
| Explain a Conditional Access policy | **Embedded in Entra** | Policy already in scope |
| Repeatable investigation pattern | **Promptbook** | Saved, shareable, parameterised |
| Daily ad-hoc analyst question | **Standalone or embedded** | Either; pick by where you start |

> **Rule of thumb:** start **embedded** for single-product questions, switch to **standalone**
> the moment you need to correlate across two or more products. Promptbook anything you do
> more than twice.

## Approach

1. **Provision capacity** - Set up **Security Compute Units (SCUs)** in Azure (provisioned
   capacity model), assign the Azure subscription and resource group, choose the geographic
   region, and configure overage settings. SCUs are the meter; underprovisioning throttles,
   overprovisioning wastes spend.
   *Verify: Security Copilot → Owner settings → Capacity shows SCUs reserved and the region
   matches your data residency requirement.*
2. **Assign roles** - Configure Security Copilot **owner** and **contributor** roles in Entra,
   align to least privilege, set the default environment, and decide on the data sharing toggle
   (model improvement opt-in/out).
   *Verify: a non-owner test account can use Copilot but cannot change capacity settings.*
3. **Enable plugins** - Turn on the Microsoft plugins you need (Defender XDR, Sentinel, Intune,
   Entra, Threat Intelligence, Purview, Defender for Cloud) and add non-Microsoft or custom
   plugins where you have third-party data. Copilot respects the **underlying product RBAC of
   the calling user** - it never elevates privilege.
   *Verify: a query that requires Sentinel data from a user without Sentinel access returns a
   permission error, not an answer.*
4. **Choose the experience per workflow** - Use the **standalone** portal for multi-step
   cross-product investigations, and the **embedded** experiences inside Defender XDR,
   Sentinel, Intune, Entra, and Purview for single-product context.
   *Verify: analysts know which surface to start in for their top 5 daily tasks.*
5. **Build promptbooks** - Identify your top 5 repeatable workflows (incident summary for exec,
   reverse-engineer a script, KQL explanation, phishing email triage, CA policy explanation)
   and turn each into a **promptbook** with parameters.
   *Verify: each promptbook runs end-to-end on a sample input without manual editing.*
6. **Govern usage and consumption** - Monitor SCU consumption per workload, audit Copilot
   activity, and set alerts on SCU utilisation > 80% to control cost. Review prompt logs for
   sensitive data exposure.
   *Verify: a usage dashboard exists; alerting fires when SCUs trend high.*
7. **Measure value** - Track time-to-first-answer, analyst satisfaction, and SCU per resolved
   incident before and after rollout. If the metric does not move, the promptbooks or plugins
   are wrong, not the platform.

## Guardrails
- Treat AI output as **assistive** - analysts must validate findings before acting. Copilot is
  not the source of truth; the underlying product is.
- Apply **least-privilege plugin** access; Copilot inherits the user's product RBAC, so over-
  permissioning a user over-permissions Copilot for that user.
- Monitor SCU **consumption** to control cost; tune capacity to demand and set utilisation
  alerts. Surprises in capacity bills are a configuration problem, not a platform problem.
- **Data residency** is set at capacity creation - changing region later means rebuild. Decide
  up front based on regulatory scope.
- **Sensitive prompts are still data.** Treat the prompt history as audit-relevant; do not
  paste credentials, customer PII, or unsanitised raw data into prompts.
- **Promptbooks are code.** Version-control them, review changes, and remove unused ones.

## Common anti-patterns
- **"Buy SCUs, give everyone access, see what happens."** Burns budget, produces no measurable
  value, and trains analysts to distrust AI output.
- **Skipping promptbooks.** Without them, every investigation is a snowflake and the platform
  feels like a chatbot, not a workflow.
- **Treating Copilot as a fact source.** It synthesises from the products' data - if the data
  is wrong, the answer is wrong. Always pivot to the source product for action.
- **Pasting raw incident data into the standalone prompt** when the embedded experience
  already has it. Wastes SCUs and adds risk.
- **No SCU utilisation alerts.** First sign of a problem is the invoice.

## Example prompts
- `Set up Microsoft Security Copilot and provision SCUs.`
- `Use promptbooks to summarise an incident for a stakeholder.`
- `How do I use AI to speed up incident investigation in my SOC?`
- `Explain a KQL query with Security Copilot.`
- `Pick between standalone and embedded experiences for my analysts.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/security-copilot/microsoft-security-copilot
- Get started / provision SCUs: https://learn.microsoft.com/security-copilot/get-started-security-copilot
- Plugins: https://learn.microsoft.com/security-copilot/manage-plugins
- Promptbooks: https://learn.microsoft.com/security-copilot/using-promptbooks
- Manage usage and capacity: https://learn.microsoft.com/security-copilot/manage-usage
- Authentication and access: https://learn.microsoft.com/security-copilot/authentication
