---
name: azure-monitor-security
description: "Guidance for the security-side use of Azure Monitor and Log Analytics — designing the workspace strategy that feeds Microsoft Sentinel and Defender for Cloud, choosing analytics vs basic vs auxiliary log tiers, retention and archive, table-level transformations to drop noise pre-ingestion, Data Collection Rules (DCRs) and Azure Monitor Agent (AMA), workspace topology (single vs regional vs sovereign), commitment tiers and cost control, customer-managed keys for the workspace, RBAC including table-level RBAC, integration with Sentinel (workspace requirements), and decommissioning legacy MMA. WHEN: Log Analytics workspace design, Azure Monitor security data, Sentinel workspace, log tier basic auxiliary, AMA Azure Monitor Agent, DCR data collection rule, drop columns ingestion transform, log retention archive, workspace CMK, table-level RBAC, log ingestion cost control. DO NOT USE for Sentinel detection authoring (use sentinel-detection-engineering), App Insights instrumentation (use appinsights-instrumentation), or non-security observability."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Monitor & Log Analytics for Security

Microsoft Sentinel runs on a Log Analytics workspace. Defender for Cloud, Defender XDR
hunting tables, Activity logs, and Diagnostic settings also flow there. The workspace
strategy decides whether your security telemetry is **complete, compliant, and
affordable** — or two of three.

This skill covers the security-side decisions in workspace design: tiering, retention,
DCRs, RBAC, and cost.

## When to use
Designing or refactoring the Log Analytics workspace(s) that back Sentinel and the
broader security telemetry estate.

**Do not use this skill** for Sentinel detection authoring
(`sentinel-detection-engineering`), App Insights instrumentation
(`appinsights-instrumentation`), or non-security observability.

## Log table tiers — pick per table

| Tier | Query latency | Retention max | Use case |
|---|---|---|---|
| **Analytics** | Sub-second | 730 days interactive | Detections, hunting, dashboards |
| **Basic** | Seconds (KQL with limits) | 30 days interactive + archive | High-volume "search if needed" logs |
| **Auxiliary** | Slower / async | 12 months interactive | Low-touch compliance archive feeds |
| **Archive** (any tier) | Search-job recall | up to 12 years | Long-tail evidence, regulatory hold |

Microsoft has been re-naming/re-shaping these — verify current naming and pricing in your
region before commit.

## Approach

1. **Workspace topology.**
   - **Default**: one Sentinel workspace per tenant for security signal — keeps
     correlation easy.
   - **Regional / sovereign**: separate workspaces where data residency or sovereignty
     requires.
   - **Multi-workspace Sentinel**: only when business reasons (M&A boundary, MSSP
     model) force it. Cross-workspace queries work but add complexity.
   - Don't split per-team; that fragments correlation.

2. **Use Azure Monitor Agent (AMA) for everything new.** The Microsoft Monitoring Agent
   (MMA / Log Analytics agent) is **retired**. Migration paths via Defender for Cloud
   auto-provisioning and Sentinel solutions.

3. **Define DCRs per data class.**
   - One DCR per data source family (Windows security events, Linux Syslog, custom
     logs).
   - Use **transformKql** to drop noisy columns or whole event IDs at ingest. A 30%
     pre-ingest reduction beats any post-ingest tuning.
   - Validate transformations against detection KQL — don't drop a column a Sentinel
     analytic relies on.

4. **Tier per table.**
   - **Analytics**: SecurityEvent (filtered), SigninLogs, AuditLogs, DeviceLogonEvents
     (Defender XDR), Sentinel-driven detection sources.
   - **Basic**: AzureDiagnostics for chatty resources, NSG flow logs, web server access
     logs (where you need them only for incident search).
   - **Auxiliary**: long-retention compliance feeds (e.g., raw firewall logs for 12
     months).
   Tier choice changes ingestion + retention costs significantly.

5. **Retention and archive.**
   - Interactive retention: 90 days default — extend to align with detection lookback
     windows (often 180–730 days).
   - Archive (cold) for compliance and IR replay (12-year max for some scenarios).
   - **Search jobs** rehydrate archived data when needed.

6. **Cost control.**
   - **Commitment tier** at the workspace (100 GB/day → 5,000 GB/day) cuts per-GB
     price ~15–30%.
   - Identify and cap top sources (DNS, NSG flow, Linux Syslog) — usually 80% of cost.
   - **Daily cap** as a guardrail (drops data above cap; alert on hit).
   - Review monthly: top tables, top resources, ingest trend.

7. **Customer-managed keys (CMK)** on the workspace if your data classification
   requires. Plan for the dedicated cluster requirement and the operational complexity.

8. **RBAC.**
   - **Workspace-level**: Log Analytics Reader, Log Analytics Contributor.
   - **Table-level RBAC**: scope analyst access to specific tables (e.g., HR mailbox
     audit visible only to insider-risk team).
   - Sentinel: separate Sentinel Reader / Responder / Contributor roles.
   - Avoid Owner on the workspace for SOC analysts.

9. **Cross-workspace and cross-tenant.**
   - **Sentinel workspace manager** (preview/GA per region) for MSSP-style multi-tenant.
   - **Cross-workspace queries** via union for federated estates.

## Guardrails
- **Default 90-day retention is rarely enough for security investigations.** APT
  dwell-time medians exceed that. Plan 180–730 days for primary detection sources.
- **Don't ingest everything in Analytics tier "to be safe."** Cost spirals; add Basic
  for "store and search-if-needed."
- **Transformations are powerful and dangerous.** A column drop today breaks a
  detection tomorrow. Source-control DCRs and review changes.
- **Daily cap as a cost control drops data — including security data.** Pair with
  alerting; never set a cap below high-water mark for security tables.
- **Don't deploy MMA in 2025+.** Use AMA. Existing MMA workloads need a migration plan.
- **CMK on workspace requires dedicated cluster and ≥500 GB/day commitment.** Big
  operational and cost step.
- **Multi-workspace Sentinel = harder hunting.** Justify per business reason, not per
  team preference.
- **Archive recall is search jobs, not native query.** SLA assumptions for IR change.
- **Diagnostic settings are per resource; per-subscription policy is what scales.**
  Enforce via Azure Policy.

## Common anti-patterns
- **"Per-team workspace because each team wants 'their data'"** — correlation breaks,
  cost balloons.
- **"Analytics tier for everything"** — 5x cost vs Basic for tables you query
  reactively.
- **"NSG flow logs full-fidelity to Sentinel forever"** — top cost driver. Sample,
  transform, or Basic-tier.
- **"30-day retention to keep cost down"** — incidents discovered in week 6 have no
  data.
- **"Daily cap below normal volume"** — silent data loss, missed detections.
- **"DCRs hand-edited in the portal across 50 subs"** — drift, no audit. Bicep + Azure
  Policy.
- **"Sentinel + Defender XDR in two separate workspaces"** — cross-product hunting
  pain. Unify.
- **"Upgraded to dedicated cluster for CMK without volume justification"** — cost
  surprise.

## Example prompts
- `Design the Log Analytics workspace strategy for a 100,000-employee multi-region
  Sentinel deployment with sovereignty constraints in EU and APAC.`
- `Migrate 6,000 servers from MMA to AMA via Defender for Cloud auto-provisioning;
  identify gaps in detection coverage during cutover.`
- `Author DCRs that drop high-noise columns from SecurityEvent and Syslog with 35%
  expected ingest reduction.`
- `Tier plan: which tables go Analytics vs Basic vs Auxiliary for a Sentinel + DfC
  workload, with retention.`
- `Cost optimization: identify top 10 cost drivers in our 12 TB/day workspace and
  propose targeted reductions.`
- `Configure table-level RBAC so insider-risk analysts see EmailEvents but not
  DeviceProcessEvents.`
- `Customer-managed key rollout for the security workspace — dedicated cluster, key
  rotation, recovery runbook.`
- `Daily cap and ingestion alerting strategy that protects budget without dropping
  detection-critical tables.`

## Microsoft Learn
- Log Analytics workspace design: https://learn.microsoft.com/azure/azure-monitor/logs/workspace-design
- Table tiers (Analytics / Basic / Auxiliary): https://learn.microsoft.com/azure/azure-monitor/logs/data-platform-logs#table-plans
- Retention and archive: https://learn.microsoft.com/azure/azure-monitor/logs/data-retention-archive
- Azure Monitor Agent: https://learn.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-overview
- Data collection rules: https://learn.microsoft.com/azure/azure-monitor/essentials/data-collection-rule-overview
- Ingestion-time transformations: https://learn.microsoft.com/azure/azure-monitor/essentials/data-collection-transformations
- Commitment tiers and pricing: https://learn.microsoft.com/azure/azure-monitor/logs/cost-logs
- Workspace customer-managed keys: https://learn.microsoft.com/azure/azure-monitor/logs/customer-managed-keys
- Table-level RBAC: https://learn.microsoft.com/azure/azure-monitor/logs/manage-access#table-level-azure-rbac
- Sentinel + workspace requirements: https://learn.microsoft.com/azure/sentinel/prerequisites
- MMA retirement guidance: https://learn.microsoft.com/azure/azure-monitor/agents/azure-monitor-agent-migration
