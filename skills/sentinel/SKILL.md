---
name: sentinel
description: "Guidance for designing and operating Microsoft Sentinel, the cloud-native SIEM and SOAR. Covers workspace design, data connectors, analytics rules, hunting, watchlists, automation (playbooks), and cost/commitment-tier optimisation. WHEN: deploy Microsoft Sentinel, design SIEM, onboard data connectors, write analytics rule, KQL detection, Sentinel playbook, SOAR automation, Sentinel cost optimization, log ingestion tiers, Sentinel workspace design."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Sentinel

Microsoft Sentinel is a cloud-native SIEM + SOAR built on a Log Analytics workspace and now
delivered through the Microsoft Defender portal as part of the unified SecOps platform.

## When to use
Centralising security logs from Microsoft and third-party sources, building detections,
hunting across data, and automating response.

## Design approach
1. **Workspace design** — Prefer a single, central Log Analytics workspace per tenant where
   possible; use Azure RBAC and resource-context / table-level RBAC for scoping. Co-locate the
   workspace in the region where most data is generated to reduce egress and latency.
2. **Data connectors** — Onboard first-party sources (Entra ID, Microsoft 365, Defender XDR,
   Azure activity) via the Content Hub; bring third-party data via Codeless Connector Platform,
   AMA/syslog/CEF, or Logstash. Enable the relevant solutions from the Content Hub rather than
   building from scratch.
3. **Ingestion tiers** — Route high-value security logs to the **Analytics** tier; route
   high-volume, low-fidelity logs to **Auxiliary/Basic logs** or an **Azure Data Explorer**
   archive to control cost. Set table retention deliberately.
4. **Analytics rules** — Start from built-in scheduled and Microsoft Security analytics rule
   templates; tune thresholds and entity mappings; group alerts into incidents.
5. **Hunting & UEBA** — Use built-in hunting queries and enable UEBA for behavioural baselining.
6. **Automation** — Use automation rules to triage incidents and Logic Apps **playbooks** for
   response (notify, enrich, contain). Map to MITRE ATT&CK.

## Guardrails
- Estimate ingestion volume first; choose **Commitment Tiers** once daily volume is predictable.
- Avoid duplicate ingestion (e.g., don't ingest Defender XDR raw + advanced hunting unless needed).
- Use table-level RBAC instead of multiple workspaces when isolation is the only driver.

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/sentinel/overview
- Workspace design best practices: https://learn.microsoft.com/azure/sentinel/best-practices-workspace-architecture
- Data connectors: https://learn.microsoft.com/azure/sentinel/connect-data-sources
- Costs & ingestion tiers: https://learn.microsoft.com/azure/sentinel/billing
- Automation & playbooks: https://learn.microsoft.com/azure/sentinel/automation/automation
