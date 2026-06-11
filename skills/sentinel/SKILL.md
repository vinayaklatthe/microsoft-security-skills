---
name: sentinel
description: "Guidance for designing and operating Microsoft Sentinel, the cloud-native SIEM and SOAR delivered through the Defender portal. Covers workspace design, data connectors, ingestion tiers (Analytics/Basic/Auxiliary/ADX), analytics rules, hunting, watchlists, automation playbooks, and cost/commitment-tier optimisation. WHEN: deploy Microsoft Sentinel, design SIEM, onboard data connectors, write analytics rule, KQL detection, Sentinel playbook, SOAR automation, Sentinel cost optimization, log ingestion tiers, commitment tier, Sentinel workspace design, how do I set up a SIEM, collect logs from third-party tools, ingest firewall or Linux syslog into Azure, write a detection rule, automate incident response, how much does Sentinel cost, Auxiliary logs, Basic logs, ADX archive, codeless connector. DO NOT USE when the goal is correlating Microsoft 365 XDR alerts into incidents (use defender-xdr) or onboarding Sentinel into the unified Defender portal (use unified-secops-platform)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Sentinel

Microsoft Sentinel is a cloud-native SIEM + SOAR built on a Log Analytics workspace and
delivered through the Microsoft Defender portal as part of the unified SecOps platform. It
ingests logs from Microsoft and third-party sources, runs scheduled and near-real-time
detections in KQL, correlates alerts into incidents, and orchestrates response via Logic Apps
playbooks.

## When to use
Centralising security logs from Microsoft and third-party sources, building detections,
hunting across data, and automating response. Use Sentinel when you need a single SIEM across
clouds, on-prem, and SaaS - not only Microsoft 365.

**Do not use this skill** when the goal is only correlating M365 alerts (use `defender-xdr`)
or onboarding the existing Sentinel workspace into the unified Defender portal (use
`unified-secops-platform`).

## Route the log source to the right ingestion tier

Pick the tier first, then the connector. Tier choice drives cost more than anything else.

| If the log is... | Send to | Retention default | Cost shape |
|---|---|---|---|
| High-fidelity security log used in detections (sign-ins, audit, EDR) | **Analytics** | 90 days free, then paid | Pay per GB (commitment tier) |
| Verbose but query-occasionally (CDN, custom app, firewall info) | **Basic logs** | 30 days, no analytics rules | ~1/5th of Analytics |
| High-volume, low-fidelity, search-only (NetFlow, DNS, proxy) | **Auxiliary logs** | 30 days hot + 12 mo long-term | ~1/8th of Analytics |
| Long-term archive for compliance / rare investigation | **Azure Data Explorer (ADX)** | Years | ADX cluster cost |
| Microsoft 365 / Defender XDR alerts only | Free via M365 Defender connector | N/A | Free |

> **Rule of thumb (2026 pricing):** if a table averages > 50 GB/day and analytics rules don't
> query it, it does not belong in the Analytics tier. Moving DNS or proxy logs to Auxiliary
> typically cuts Sentinel bills by 30-50%.

## Approach

1. **Estimate volume and pick commitment tier** — Run the **Sentinel pricing calculator** with a
   30-day sample (use `Usage | summarize sum(Quantity) by bin(TimeGenerated, 1d), DataType`).
   Commitment tiers start at 100 GB/day and drop the per-GB rate ~50% vs Pay-As-You-Go.
   *Verify: daily ingestion stable within ±20% of estimate before committing.*

2. **Workspace design** — Default to a **single, central Log Analytics workspace per tenant**.
   Use Azure RBAC + table-level RBAC for scoping instead of splitting workspaces. Co-locate
   the workspace in the region where most data is generated to reduce egress and latency.
   *Verify: cross-workspace queries are not needed for primary detections - if they are, you
   over-sharded.*

3. **Connect data sources in priority order** — Top 5 connectors that cover ~80% of M365
   tenants: **Entra ID** (sign-in + audit), **Office 365** (Exchange + SharePoint), **Defender
   XDR** (alerts + raw advanced hunting), **Azure Activity**, **Microsoft Threat Intelligence**.
   For third-party: **Codeless Connector Platform** > AMA/syslog/CEF > Logstash.
   *Verify: `union withsource=Tbl * | summarize count() by Tbl, bin(TimeGenerated, 1h)` shows
   continuous ingestion - no flat-lines.*

4. **Enable solutions, not raw rules** — Install from **Content Hub** (Entra solution, MDE
   solution, etc.). You get the connector, parser, workbook, hunting queries, and analytics
   rules in one install. Tune the templates; don't write from scratch.

5. **Analytics rules - start broad, tune fast** — Enable all built-in templates for installed
   solutions in **near-real-time** or scheduled mode. Expect 10-20 false-positive rules in the
   first week; tune entity mappings and thresholds rather than disabling. Group related alerts
   into incidents via incident-grouping settings.

6. **Hunting and UEBA** — Enable UEBA on Entra + on-prem AD data (`IdentityInfo`, `BehaviorAnalytics`
   tables). Use built-in hunting queries weekly; promote useful hunts to scheduled rules.

7. **Automation** — Use **automation rules** for triage (assign, tag, close noisy true-positives)
   and **Logic Apps playbooks** for response (notify Teams, enrich with TI, isolate device,
   disable user). Map every rule to MITRE ATT&CK for coverage reporting.

8. **Cost review monthly** — Check `Usage` table for top tables by volume; move low-value tables
   to Basic/Auxiliary; set table-level retention deliberately. Watch for connector misconfig
   (debug logging left on).

## Guardrails
- **Estimate before committing.** Commitment tiers are billed minimum daily; over-committing
  by 30% is more expensive than PAYG. Start PAYG for 30 days, then commit.
- **Avoid duplicate ingestion.** Don't ingest Defender XDR raw events *and* advanced hunting
  unless a specific detection needs both - you pay twice.
- **Use table-level RBAC, not multiple workspaces.** Workspace splits double connector cost,
  break cross-source detections, and complicate incident response.
- **Set retention per table.** Default 90 days applies to all Analytics tables; rare-use tables
  (e.g. `AzureActivity`) can drop to 30 days, hot tables (`SigninLogs`) extend to 1 year.
- **Don't disable a noisy rule - tune it.** Disabling removes the detection. Adjust entity
  mappings, threshold, or scope first.
- **Auxiliary logs cannot drive scheduled analytics rules.** Don't move a table to Auxiliary if
  detections depend on it.

## Common anti-patterns
- **"One workspace per business unit for isolation"** - Doubles cost, breaks correlation. Use
  resource-context RBAC instead.
- **"We commit to 500 GB/day on day one"** - Tier locks you in for 31 days. Always run PAYG
  baseline first.
- **"Ingest everything in case we need it"** - Sentinel bills grow linearly with GB. Tier
  decision per table is the single biggest cost lever.
- **"We disabled the noisy detection rules"** - Removed coverage instead of tuning. Use
  per-entity exclusions or threshold adjustment.
- **"All analytics rules at 5-minute schedule"** - Burns query units and creates duplicate
  alerts. Match schedule to detection window (auth attacks 5 min, lateral movement 1 hour).
- **"Playbook on every rule"** - Most rules need triage automation, not response. Reserve
  response playbooks for high-confidence detections.

## Example prompts
- `Estimate Sentinel monthly cost for 200 GB/day across Entra ID, Defender XDR, and Azure firewall.`
- `Should I split my Sentinel workspace by business unit or use table-level RBAC?`
- `Move DNS and proxy logs from Analytics to Auxiliary - what breaks?`
- `Which connectors should I enable first for a new M365 tenant?`
- `Write a near-real-time analytics rule for impossible travel sign-ins.`
- `Build a playbook that isolates a device and notifies Teams when MDE flags ransomware behaviour.`
- `Audit my workspace - top 10 tables by ingestion and which can drop tier or retention.`

## Microsoft Learn
- Data connectors: https://learn.microsoft.com/azure/sentinel/connect-data-sources
- Costs & ingestion tiers: https://learn.microsoft.com/azure/sentinel/billing
- Commitment tiers: https://learn.microsoft.com/azure/sentinel/billing-pre-purchase-plan
- Auxiliary logs: https://learn.microsoft.com/azure/sentinel/basic-logs-use-cases
- Workspace design: https://learn.microsoft.com/azure/sentinel/design-your-workspace-architecture
- Automation & playbooks: https://learn.microsoft.com/azure/sentinel/automation/automation
- UEBA: https://learn.microsoft.com/azure/sentinel/identify-threats-with-entity-behavior-analytics
- Content Hub: https://learn.microsoft.com/azure/sentinel/sentinel-solutions-deploy
