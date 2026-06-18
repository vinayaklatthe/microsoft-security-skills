---
name: sentinel-detection-engineering
description: "Guidance for detection engineering in Microsoft Sentinel — building, testing, deploying, and maintaining analytics rules, hunting queries, and SOAR automation. Covers the Content Hub solution model, MITRE ATT&CK mapping, scheduled vs near-real-time (NRT) vs Fusion vs anomalies analytics, KQL detection patterns (joins, summarize, bin, materialize), entity mapping and incident enrichment, custom detections from Defender XDR vs Sentinel-only, automation rules, playbooks (Logic Apps), watchlists, threat intel matching, content as code with Azure DevOps / GitHub repositories integration, and detection lifecycle (validate → tune → version). WHEN: Sentinel analytics rule, KQL detection, MITRE mapping, Sentinel content hub, scheduled analytics, NRT rule, hunting query, Sentinel automation rule, Logic App playbook, custom detection, repositories Sentinel CI/CD, detection-as-code, watchlist, threat intel matching analytics, fusion alerts, anomalies, incident enrichment, entity mapping. DO NOT USE for Sentinel architecture/onboarding (use sentinel), Defender XDR custom detections only (overlap—use the side that owns the data), or generic KQL training."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Sentinel Detection Engineering

Sentinel detection engineering is the discipline of building **high-fidelity, well-tuned,
maintainable detections and response automation**. This skill covers the lifecycle —
content sourcing, authoring, validating, automating, and versioning detections — not the
broader SIEM architecture.

## When to use
Authoring or maturing analytics rules, hunting queries, automation rules, and playbooks in
Microsoft Sentinel. Use for KQL detection patterns, MITRE alignment, content-hub vs custom
choices, and detection-as-code rollout.

**Do not use this skill** for Sentinel onboarding/architecture (`sentinel`), Defender XDR
custom detections in isolation (`defender-xdr`), or generic KQL learning unrelated to
detection.

## Sources of content (use in this order)

1. **Content Hub solutions** — Microsoft- and partner-published, versioned bundles of
   data connectors, analytics rules, hunting queries, workbooks, playbooks. Always start
   here. Install the solution; enable rules in **Active**.

2. **Microsoft Sentinel GitHub** — community-contributed queries that haven't (yet) made
   it into a solution. Vet, then promote into your repo.

3. **Custom detections** — domain-specific, authored against your own data sources or
   specific business logic.

> **Rule of thumb:** If a Microsoft solution covers 80% of the use case, install the
> solution and override the 20% in your repo — don't fork from scratch.

## Choose the analytics rule type

| Rule type | When to use | Latency |
|---|---|---|
| **Scheduled** | Most cases; KQL window-based | 5 min – 24 h |
| **Near-real-time (NRT)** | High-priority, single-event detections (e.g., privileged role assignment) | <1 min |
| **Microsoft Security** (legacy) | Forward Defender alerts as Sentinel incidents | Immediate |
| **Fusion** | Multi-stage attack correlation (built-in ML) | Variable |
| **Anomalies** | Behavior baselines (built-in ML) | Hourly |
| **Threat Intelligence** | TI-indicator → log match | Schedule |

NRT has constraints (single table, no joins to most reference tables) — verify before
choosing.

## Approach

1. **Start from a use case, not a query.** Phrase the detection as: *"Detect <attacker
   behavior> on <data source> with <expected fidelity>."* Map to MITRE ATT&CK technique
   IDs before opening the KQL editor.

2. **Confirm data coverage.** Does the connector emit the fields you need? Run a
   `take 100` first, look at the schema, and check ingestion latency for that table.

3. **Author the KQL with detection patterns:**
   - Filter early, project late.
   - Use `summarize` + `bin(TimeGenerated, 5m)` for rate-based detections.
   - Use `materialize()` once for joined intermediate results.
   - For lookup-rich rules (allowlists, asset criticality), use **watchlists** via
     `_GetWatchlist("name")`.
   - Avoid `*` joins on huge tables — pre-filter both sides.

4. **Map entities.** Set User, Host, IP, FileHash, Url entities in the rule UI so the
   incident graph and investigation experience work. Without entity mapping, Sentinel
   incidents are flat blobs.

5. **Set incident creation thoughtfully.** Group alerts into a single incident using
   `Group all alerts triggered by this rule into a single incident` for high-volume
   rules with bursty behavior, or per-entity grouping for "one-incident-per-user."

6. **Validate.** Run the rule's KQL over a 7-day historical window. Look at:
   - Average alerts/day → must be triageable (target <10 for high severity).
   - False-positive samples — if 50% are FP, tune; don't ship.
   - Coverage — does it actually fire on a known attack scenario? Use **Attack
     Simulation Training** logs or replay an exported red-team event.

7. **Wire automation.**
   - **Automation rule** (no-code) for assignment, severity tweak, suppression
     windows, bulk close.
   - **Playbook (Logic App)** for actions — disable user, isolate device (via Defender
     for Endpoint), enrich from MDTI, post to Teams/Slack, open ITSM ticket.
   - Use **incident-trigger** playbooks (run once per incident) over alert-trigger for
     anything with shared context.

8. **Detection-as-code.** Connect Sentinel to a GitHub or Azure DevOps repo via the
   **Repositories** feature. Source of truth is the repo; deployments are pipelines.
   Branch protection + PR review = no more "someone tweaked the rule in the portal."

9. **Lifecycle.**
   - Tag rules with version (in metadata) and owner.
   - Re-validate quarterly: data-source schema changes break detections silently.
   - Retire rules with sustained zero alerts and no FN coverage.

## Guardrails
- **Don't ship a rule without a 7-day backtest.** "Looks right in the editor" → noise
  storm in production.
- **High-volume tables (`SecurityEvent`, `Syslog`, `CommonSecurityLog`) — filter early.**
  Whole-table scans cost LA money and run slow.
- **NRT has limits.** Don't try to bend a 5-table-join detection into NRT; use scheduled.
- **Always map entities.** No entities = no investigation graph = analyst pain.
- **Don't auto-disable users from a low-confidence rule.** SOAR power × low fidelity =
  outages. Pair with high-fidelity rules only.
- **Watchlists are not append-only logs.** They have row limits (~10 MB / 1M rows
  depending). Use Log Analytics tables for big reference data.
- **Microsoft-published rules update via solutions.** If you fork by editing in-place,
  you lose updates. Clone/rename or override in repo.
- **Defender XDR custom detections vs Sentinel rules** — author where the data lives. If
  the data is XDR-only and triage happens in XDR, do the custom detection in XDR; don't
  duplicate.

## Common anti-patterns
- **"Wrote 200 rules, all P2 severity"** — meaningless prioritization. Severity reflects
  business impact + fidelity, not count.
- **"Used `where TimeGenerated > ago(90d)` in a 5-minute scheduled rule"** — destroys
  cost. Match the lookback to the rule cadence.
- **"Authored detections only in the portal, no source control"** — change history,
  rollback, and review are gone.
- **"Group-all-alerts on a noisy rule"** — single mega-incident with thousands of alerts;
  triage impossible.
- **"Auto-isolate-device playbook on day-one detection"** — false-positive outage.
  Audit-mode SOAR first.
- **"Threat-intel match rule against every IOC"** — terabytes of indicators × millions of
  log rows. Filter by indicator type/confidence and scope tables.
- **"Skipped MITRE mapping because 'we know what it does'"** — blocks coverage analysis
  and stakeholder reporting.

## Example prompts
- `Author a Sentinel scheduled rule for impossible-travel using SigninLogs with proper
  entity mapping.`
- `Convert a noisy detection (avg 800 alerts/day) into actionable form via tuning and
  grouping.`
- `Build the playbook to isolate a Defender for Endpoint device on a Sentinel incident,
  with an approval step in Teams.`
- `Set up Sentinel Repositories to deploy analytics rules from GitHub via PR.`
- `Write an NRT rule for newly-added Global Administrator that fires within 1 minute.`
- `Map a custom detection to MITRE ATT&CK techniques and validate coverage gaps.`
- `Build a hunting workbook for living-off-the-land binary usage across endpoints.`
- `Quarterly content review: identify zero-alert rules, validate they're not silently
  broken, retire or refactor.`

## Microsoft Learn
- Detection lifecycle: https://learn.microsoft.com/azure/sentinel/threat-detection
- Analytics rule types: https://learn.microsoft.com/azure/sentinel/detect-threats-built-in
- Custom analytics rules: https://learn.microsoft.com/azure/sentinel/detect-threats-custom
- NRT rules: https://learn.microsoft.com/azure/sentinel/near-real-time-rules
- Entity mapping: https://learn.microsoft.com/azure/sentinel/map-data-fields-to-entities
- Automation rules: https://learn.microsoft.com/azure/sentinel/automate-incident-handling-with-automation-rules
- Playbooks (Logic Apps): https://learn.microsoft.com/azure/sentinel/automate-responses-with-playbooks
- Watchlists: https://learn.microsoft.com/azure/sentinel/watchlists
- Repositories (CI/CD): https://learn.microsoft.com/azure/sentinel/ci-cd
- Content hub: https://learn.microsoft.com/azure/sentinel/sentinel-solutions
- KQL reference: https://learn.microsoft.com/kusto/query/
- MITRE ATT&CK in Sentinel: https://learn.microsoft.com/azure/sentinel/mitre-coverage
