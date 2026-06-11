---
name: purview-dlp-policy
description: "Guidance for designing baseline Microsoft Purview Data Loss Prevention (DLP) policies across Exchange, SharePoint, OneDrive, Teams, and Endpoint. Covers locations, conditions (SITs/labels/classifiers), severity-tiered actions, simulation mode, exception handling, Endpoint DLP onboarding, and tuning. WHEN: Purview DLP, data loss prevention policy, prevent data exfiltration, Endpoint DLP, DLP rule conditions, DLP simulation mode, block sensitive sharing, policy tips, DLP across Microsoft 365, tune DLP false positives."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview DLP Policy

Microsoft Purview Data Loss Prevention (DLP) detects and prevents risky sharing, transfer, or
use of sensitive data across Microsoft 365 services and Windows/macOS endpoints - anchored to the
Zero Trust **Data** pillar.

## When to use
Stopping exfiltration of sensitive content (PII, financial, IP, regulated data) across email,
collaboration, and endpoints with a defensible, tunable policy set.

Do not use this skill for risk-adaptive DLP keyed to Insider Risk (use `purview-advanced-dlp`)
or for Copilot-specific exclusion (use `purview-copilot-oversharing`).

## Pick the right starting policy per workload
| Workload | Start with | Notes |
|---|---|---|
| Exchange Online | Block external send of high-volume SIT matches | Policy tips + override + justification |
| SharePoint / OneDrive | Warn on external sharing of labelled content | Service-side detection |
| Teams | Warn on chat/channel post containing SITs | Applies post-creation only |
| Endpoint (Windows/Mac) | Audit USB copy, then warn, then block | Needs onboarded devices + E5 Compliance |
| All | Simulation mode for 7-14 days first | No exceptions |

Rule of thumb: one policy per workload, severity-tiered actions, simulation always, exceptions
defined before block.

## Approach
1. **Locations** - Choose locations explicitly: Exchange, SharePoint, OneDrive, Teams, and
   **Endpoint** (a single policy does not cover all locations by default). Endpoint DLP requires
   onboarded devices and E5 Compliance.
   *Verify: each policy lists only the locations it intends to cover; Endpoint shows onboarded device count > 0.*
2. **Conditions** - Match on **SITs**, **sensitivity labels**, trainable classifiers, and content
   volume thresholds (e.g., 5+ credit-card numbers); combine for precision.
   *Verify: a test document matches the rule with expected confidence and volume.*
3. **Actions by severity** - Low = audit only; Medium = warn with override + justification;
   High = block + notify. Configure policy tips and incident reports.
   *Verify: each severity branch fires the intended action in a test event.*
4. **Simulation first** - Run in **simulation mode** (7-14 days), review matches in Activity
   Explorer, tune false positives, then promote to enforcement.
   *Verify: simulation report shows match volume and false-positive rate within target before enforcement.*
5. **Exceptions** - Define trusted recipients/domains and business-justification overrides so
   legitimate processes aren't blocked.
   *Verify: documented exception list reviewed by data owner; override workflow tested.*
6. **Endpoint DLP onboarding** - Onboard devices via Defender for Endpoint or Intune, confirm
   policy reaches them, and start in audit before warn/block.
   *Verify: endpoint policy status shows successful sync per device.*
7. **Operate** - Route incidents to a shared compliance mailbox; review override justifications
   weekly; tune monthly.
   *Verify: incident triage SLA defined and met; tuning log maintained.*

## Guardrails
- Never enable **block** without exception handling and a simulation period - blocks without
  exceptions produce business escalations in hours.
- DLP precedence: policies evaluate in priority order; the most restrictive action wins -
  document priorities and review when adding new policies.
- Complete data classification first - DLP without classification generates excessive noise
  and tunes-out the team.
- Teams DLP applies only to messages posted **after** the policy is created (not retroactive) -
  set expectations accordingly.
- Endpoint DLP needs onboarded devices and E5 Compliance per user - confirm licensing before
  designing the policy.

## Common anti-patterns
- Single tenant-wide policy covering all locations with the same conditions - either too noisy
  or too narrow somewhere.
- Skipping simulation "because it's an obvious rule" - then breaking finance month-end.
- No exception path - business overrides the policy by emailing files to personal accounts.
- Block actions on day one of Endpoint DLP - users disable the agent in protest.
- Reviewing matches monthly instead of weekly - false positives bloom unchecked.

## Example prompts
- `Help me build a Purview DLP policy to protect financial data in Exchange and SharePoint.`
- `How do I configure Endpoint DLP to block USB copy of sensitive files?`
- `What DLP simulation mode steps should I follow before enforcing a new policy?`
- `Design a DLP policy for GDPR that covers personal data across Microsoft 365.`
- `How do I tune a DLP rule to reduce false positives on credit card numbers using volume thresholds and Activity Explorer matches?`

## Microsoft Learn
- Create & deploy a DLP policy: https://learn.microsoft.com/purview/dlp-create-deploy-policy
- Endpoint DLP: https://learn.microsoft.com/purview/endpoint-dlp-learn-about
- DLP policy reference: https://learn.microsoft.com/purview/dlp-policy-reference
- Test DLP policies (simulation): https://learn.microsoft.com/purview/dlp-test-dlp-policies
- Activity Explorer: https://learn.microsoft.com/purview/data-classification-activity-explorer
- DLP for Microsoft Teams: https://learn.microsoft.com/purview/dlp-microsoft-teams
