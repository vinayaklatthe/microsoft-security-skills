---
name: purview-insider-risk-management
description: "Guidance for Microsoft Purview Insider Risk Management (IRM) — detect, investigate, and act on risky user activity (data theft by departing employees, intellectual property leaks, security policy violations) using signals from M365, Entra, Defender, Windows endpoints, HR systems, and Adaptive Protection. Covers policy templates (data theft by departing users, data leaks, security policy violations), HRIS connector setup, indicator selection, sequence detection, anomaly detection, alerts triage, case investigation with content explorer, integration with eDiscovery and Communication Compliance, Adaptive Protection's automatic DLP policy adjustment, privacy controls (pseudonymization), role separation, and tenant-allow-list. WHEN: insider risk management, IRM policy, data theft departing user, IP leak detection, HRIS connector Purview, Adaptive Protection, insider risk indicators, sequence detection Purview, IRM case investigation, IRM privacy controls, IRM pseudonymization, insider risk Sentinel. DO NOT USE for DLP policy authoring (use purview-dlp-policy / purview-advanced-dlp), eDiscovery only (use purview-ediscovery), or generic insider risk strategy (use insider-risk-baseline)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Insider Risk Management

Insider Risk Management (IRM) correlates signals from across M365, endpoints, Defender,
Entra, and HR systems to surface risky user activity — most importantly *intent over time*
(e.g., the classic "departing employee exfiltrating customer lists 3 weeks before their
last day"). It pairs with **Adaptive Protection**, which dynamically tightens DLP and CA
policy on users whose risk score is rising.

## When to use
Operationalizing insider risk detection beyond the program-level baseline: policy
template selection, HRIS connector setup, alert tuning, case investigation, and Adaptive
Protection rollout.

**Do not use this skill** for outbound DLP authoring (`purview-dlp-policy`,
`purview-advanced-dlp`), eDiscovery (`purview-ediscovery`), or the high-level insider
risk program framing (`insider-risk-baseline`).

## Policy templates — pick by use case

| Template | What it detects |
|---|---|
| **Data theft by departing users** | Exfil-type activity in the window around resignation/termination (requires HRIS connector) |
| **General data leaks** | Risky upload/download/share/print regardless of HR signal |
| **Data leaks by priority users** | Same as above, scoped to executives, M&A team, etc. |
| **Data leaks by risky users** | Triggered by Adaptive Protection elevated risk level |
| **Security policy violations** | Defender alerts indicating user circumvention |
| **Risky browser usage** | Edge-for-Business browsing to risky sites with sensitive content |
| **Risky AI usage** | Sensitive data sent to non-sanctioned AI apps (paired with Purview AI Hub) |
| **Healthcare / patient data misuse** (HIPAA scenarios) | EMR access patterns |
| **PII unauthorized access** (financial) | Sensitive data viewing outside scope |

## Approach

1. **Get the prerequisites right.** Audit (Standard/Premium) on. Purview connectors for
   the data sources you need. Sensitivity labels and DLP at least baselined.

2. **Wire the HRIS connector.** Without it, "departing user" templates have no trigger.
   Workday and SAP SuccessFactors via Microsoft Graph connectors are the common
   patterns; custom CSV import also supported. Map the resignation date, termination
   date, job-change date.

3. **Configure privacy controls before turning on policies.**
   - **Anonymize usernames** by default in alerts/cases; reveal only on approved case
     escalation by Insider Risk Investigators role.
   - Restrict roles: Insider Risk Admin (config), Analysts (triage with masked
     identity), Investigators (full).
   - Document the legal/works-council/GDPR review before go-live in EU jurisdictions.

4. **Start with one template** (almost always **departing users**). Run in
   **analytics/insight** mode for 14 days; review baseline alert volume before enabling
   real policy.

5. **Tune indicators.** Defaults are noisy. Disable indicators that don't match your
   environment (e.g., disable "USB upload" if Intune blocks USB anyway). Adjust
   thresholds.

6. **Sequence detection** is where IRM earns its license. Single events
   (one file copy) are weak; sequences (download from SharePoint → rename → upload to
   personal OneDrive within 1 hour) are strong. Enable sequence policies after baseline.

7. **Alert triage workflow:**
   - Triage queue ≤ 24h SLA.
   - Confirm trigger event in user activity timeline.
   - Confirm context: HR signal, sensitivity labels involved, destinations.
   - Escalate to case (un-anonymize) only with documented justification.
   - Case actions: notice to manager, force training, eDiscovery hold, Communication
     Compliance escalation.

8. **Adaptive Protection.** Once policies stabilize, turn on Adaptive Protection. Risk
   levels (Minor / Moderate / Elevated) automatically tighten DLP policy enforcement
   (warn → block) and Entra CA (require MFA → block download). Keep auto-block scoped
   tight initially.

9. **Integrate with Sentinel / Defender XDR.** Forward IRM alerts to SIEM for
   cross-correlation with endpoint and identity signals.

## Guardrails
- **Privacy controls before policies.** In EU/UK/several APAC jurisdictions, IRM
  without works-council consultation and pseudonymization is a compliance violation
  before it's a security tool.
- **HRIS connector freshness matters.** A stale Workday feed means missed departing-
  user triggers. Monitor connector last-sync; alert if >48h.
- **Single-event alerts are noisy.** Default policies fire too often. Prioritize
  sequence-based and risk-score-based policies.
- **Don't auto-escalate to HR.** Always human-in-the-loop investigator review before
  any user-impacting action.
- **Adaptive Protection auto-block can lock out legitimate users.** Pilot for 30 days
  with auto-warn before auto-block.
- **IRM is for insiders, not external attackers.** Compromised account exfil looks like
  insider exfil; pair with Defender XDR identity signals to disambiguate.
- **Role separation is non-negotiable.** The same person should not configure policy,
  triage, and investigate; segregation-of-duties.
- **AI usage policies need Purview AI Hub** as the upstream signal — without it the AI
  insider risk template has nothing to score on.

## Common anti-patterns
- **"Enabled all templates day one"** — 10,000 alerts/week, none triaged. Start with
  one template, expand.
- **"Skipped HRIS connector, used 'data leaks' template instead of departing users"** —
  loses the highest-value signal in IRM.
- **"Investigators have un-anonymize-by-default access"** — privacy violation. Escalation
  must be per-case, audited.
- **"No baseline period before enabling policies"** — flooded with normal-business
  activity flagged as risky.
- **"Adaptive Protection auto-blocks on Minor risk"** — users blocked over normal
  activity. Start at Elevated only.
- **"IRM case created and acted on without legal / HR partnership"** — wrongful action
  exposure.
- **"Used IRM to monitor a single named individual"** — surveillance, not insider risk.
  Targeted investigations belong in eDiscovery + legal hold workflows.

## Example prompts
- `Plan IRM rollout for a 40,000-employee tenant with Workday HRIS — 90-day plan.`
- `Configure the departing-users policy with sequence detection and a 30-day pre/30-day
  post window.`
- `Privacy review checklist for IRM rollout in Germany — works council talking points.`
- `Tune Adaptive Protection from auto-warn to auto-block for Elevated risk on a 5,000-
  user pilot.`
- `Build the alert triage SOP including escalation to case and un-anonymization criteria.`
- `Integrate IRM alerts into Sentinel and write a hunting query that correlates IRM
  Elevated risk with Defender for Cloud Apps anomalous download.`
- `Wire AI risky usage policy with Purview AI Hub signals.`

## Microsoft Learn
- IRM overview: https://learn.microsoft.com/purview/insider-risk-management
- Policy templates: https://learn.microsoft.com/purview/insider-risk-management-policy-templates
- HRIS connector: https://learn.microsoft.com/purview/import-hr-data
- Indicators: https://learn.microsoft.com/purview/insider-risk-management-settings#indicators
- Sequence detection: https://learn.microsoft.com/purview/insider-risk-management-policies#sequence-detection
- Privacy controls / pseudonymization: https://learn.microsoft.com/purview/insider-risk-management-settings#privacy
- Adaptive Protection: https://learn.microsoft.com/purview/insider-risk-management-adaptive-protection
- Cases: https://learn.microsoft.com/purview/insider-risk-management-cases
- Role groups: https://learn.microsoft.com/purview/insider-risk-management-configure#step-1-required-enable-permissions-for-insider-risk-management
