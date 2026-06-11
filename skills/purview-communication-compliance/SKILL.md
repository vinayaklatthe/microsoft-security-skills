---
name: purview-communication-compliance
description: "Guidance for Microsoft Purview Communication Compliance — detecting and remediating policy violations and risky/inappropriate messages across Exchange, Teams, Viva Engage, and connected platforms, including AI prompt risks. Covers policy design, privacy controls, and remediation workflow. WHEN: communication compliance, monitor messages, detect harassment or sensitive info in chat, code of conduct policy, regulatory communication monitoring, Teams message compliance, pseudonymization reviewers."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Communication Compliance

Communication Compliance detects, captures, and helps remediate inappropriate or risky messages
(harassment, threats, sensitive-data sharing, regulatory violations, and risky AI prompts) across
Exchange, Teams, Viva Engage, and connected third-party communications.

## When to use
Meeting regulatory communication-supervision obligations and detecting code-of-conduct or
data-leak risks in messaging.

## Approach
1. **Define policies** — Use templates (offensive language/harassment, sensitive info, regulatory
   compliance) and scope users/groups, channels, and conditions (SITs, trainable classifiers,
   keywords).
2. **Protect privacy** — Enable **pseudonymisation** of usernames for reviewers, scope reviewer
   access strictly (RBAC), and separate duties so monitoring respects worker privacy.
3. **Review & remediate** — Triage alerts, tag/resolve, escalate, notify, or take action; document
   the workflow for auditability.
4. **Tune** — Adjust classifiers/conditions to reduce noise; use intelligent features to reduce
   false positives.
5. **Integrate** — Feed signal into Insider Risk Management where appropriate.

## Guardrails
- Respect privacy and works-council/legal requirements — pseudonymisation and least-privilege
  reviewers are essential; consult legal/HR before rollout.
- Start narrow (specific risks/groups), then expand.
- Reviewer access to message content is highly sensitive — audit it.

## Common scenarios
- **Regulatory supervision (financial services).** Supervise broker-dealer and advisor
  communications for FINRA/SEC obligations: scope a policy to the regulated population, use the
  regulatory-compliance template, detect off-channel comms and undisclosed promises, and route
  matches to compliance reviewers with documented disposition for audit.
- **Code-of-conduct / harassment detection.** Detect threats, harassment, and offensive language
  across Teams and Viva Engage using the offensive-language trainable classifier; pseudonymise
  usernames so reviewers triage behaviour, not identities, and escalate confirmed cases to HR.
- **Sensitive-data oversharing in chat.** Catch credentials, PII, or financial data pasted into
  Teams or email by combining sensitive info types (SITs) and labels as policy conditions, then
  feed confirmed signals into Insider Risk Management.
- **Risky AI / Copilot prompts.** Detect inappropriate or data-leaking prompts and responses in
  AI interactions (including Microsoft 365 Copilot) so risky generative-AI usage is supervised
  alongside human messaging.
- **Connected third-party communications.** Extend supervision beyond Microsoft 365 by ingesting
  data from connected platforms (for example Bloomberg, Slack, or other sources via data
  connectors) so a single policy set covers regulated channels outside Exchange and Teams.
- **Departing-employee leak watch.** Pair a sensitive-info policy with HR-driven scope (leavers)
  to spot data being forwarded or shared externally before a departure date.

## Example prompts
- `Help me design a Communication Compliance policy for FINRA/SEC supervision of our advisors.`
- `How do I detect harassment and offensive language in Teams while protecting reviewer privacy?`
- `Set up pseudonymisation and scoped reviewer access for a Communication Compliance rollout.`
- `Which template and conditions detect sensitive data shared in Teams messages?`
- `How do I supervise risky Microsoft 365 Copilot prompts with Communication Compliance?`
- `How do I bring third-party (e.g. Slack/Bloomberg) communications into Communication Compliance?`
- `Build a triage and remediation workflow for Communication Compliance alerts that is auditable.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/purview/communication-compliance
- Plan & configure: https://learn.microsoft.com/purview/communication-compliance-configure
- Policies: https://learn.microsoft.com/purview/communication-compliance-policies
- Plan & privacy / pseudonymization: https://learn.microsoft.com/purview/communication-compliance-plan
