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

## Microsoft Learn
- Overview: https://learn.microsoft.com/purview/communication-compliance
- Plan & configure: https://learn.microsoft.com/purview/communication-compliance-configure
- Policies: https://learn.microsoft.com/purview/communication-compliance-policies
- Privacy / pseudonymization: https://learn.microsoft.com/purview/communication-compliance-feature-reference
