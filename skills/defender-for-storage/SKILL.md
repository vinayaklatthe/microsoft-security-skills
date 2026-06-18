---
name: defender-for-storage
description: "Guidance for Microsoft Defender for Storage — threat protection for Azure Storage accounts (Blob, Files, Data Lake Gen2). Covers the v2 (per-storage-account) plan, on-upload malware scanning powered by Defender Antivirus, sensitive data threat detection (integrated with Purview classification), activity-based threat detection, override per storage account, exclusion of high-volume accounts, Event Grid integration for scan results, and cost controls (per-GB scan cap). WHEN: Defender for Storage, Azure Storage malware scan, Blob malware scanning, sensitive data threat detection, on-upload scan, Defender for Storage v2, Storage account threat protection, scan results Event Grid, Purview classification storage, malicious blob upload, exfiltration alert storage, untrusted upload scan. DO NOT USE for SQL/Cosmos DB protection (use defender-for-cloud-hardening), VM disk malware (use defender-for-servers agentless scan), or M365 SharePoint/OneDrive (use defender-for-office-365)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Storage

Defender for Storage protects Azure Blob Storage, Azure Files, and Azure Data Lake Storage
Gen2 against malicious uploads, sensitive data exfiltration, and suspicious access patterns.
The current generation is **Defender for Storage v2**, billed per storage account, with
optional add-ons for **on-upload malware scanning** and **sensitive data threat detection**.

## When to use
Protecting Azure Storage accounts that receive uploads from untrusted or partner sources,
host application content (web apps, ML datasets), or contain sensitive data classified by
Purview. Use this skill for plan rollout, malware-scan tuning, and incident response on
storage alerts.

**Do not use this skill** for SQL/Cosmos data plane protection (`defender-for-cloud-hardening`),
VM disk-level malware (`defender-for-servers`), or M365 file workloads
(`defender-for-office-365`).

## Plan and add-ons

| Component | What it does | Cost model |
|---|---|---|
| **Defender for Storage v2 (base)** | Activity monitoring: anomalous access, suspicious extraction, unusual deletion | Per storage account / month |
| **On-upload malware scanning** | Defender AV scans every uploaded blob up to 2 GB; result tag + Event Grid event | Per GB scanned (capped per-account configurable) |
| **Sensitive data threat detection** | Integrates with Purview sensitive-info-types; alerts when sensitive blobs are accessed by suspicious principals | Included in v2 (no extra fee) |

> **v1 (per-transaction) is deprecated.** Migrate any v1-enabled accounts to v2 — it's
> cheaper and predictable.

## Approach

1. **Enable Defender for Storage v2 at subscription scope** with malware scanning **on**
   and a per-account monthly GB cap (default 5,000 GB). Cap prevents runaway costs on
   high-throughput accounts.
   *Verify: Defender for Cloud → Environment settings → Subscription → Storage shows v2 plan
   On with malware scanning enabled.*

2. **Override per storage account** for outliers:
   - **Disable malware scan** on append-only logging accounts, large telemetry sinks, or
     accounts already scanning at the application layer.
   - **Disable plan entirely** on tenant-scoped diagnostic accounts (Activity Logs export,
     NSG flow logs) where threat detection adds no value.

3. **Wire scan results to Event Grid.** Set up an Event Grid system topic per protected
   account; subscribe a Function/Logic App that:
   - Moves malicious blobs to a quarantine container (or deletes).
   - Writes the verdict to the blob's index tag (`Malware-Scanning-scan-result-tag`).
   - Notifies the SOC.
   *Verify: upload an EICAR test file; within 2 minutes the blob is tagged Malicious and the
   quarantine workflow fires.*

4. **Sensitive data threat detection** — turn on after Purview classifies the accounts.
   Without classification, this just runs on file extensions/header heuristics. Pair with
   Purview Data Map for full value (see `purview-data-map`).

5. **Tune alerts.** Baseline 7 days then suppress noisy ones (e.g., expected SAS-token use
   from CDN edge IPs). Send remaining alerts into Sentinel via the Defender for Cloud
   connector.

6. **Block public anonymous access at the storage account.** Defender alerts on suspicious
   anonymous reads, but the right control is `allowBlobPublicAccess = false` and Azure Policy
   to enforce. Defender is detection, not prevention.

7. **Response runbook for "Malicious blob uploaded" alert:**
   1. Confirm the verdict tag on the blob.
   2. Move to quarantine container; revoke any SAS/keys for the upload identity.
   3. Hunt sibling uploads from same principal in the past 24h via KQL on
      `StorageBlobLogs`.
   4. Notify owner; close the alert with evidence.

## Guardrails
- **Always set a per-account GB cap** on malware scanning. Without it, a misbehaving client
  uploading the same 50 GB file 1,000 times can produce a six-figure scan bill.
- **Files > 2 GB are not scanned.** Compensate with application-layer scanning or block
  uploads above 2 GB on untrusted endpoints.
- **Malware scan is asynchronous.** Do not architect a "scan-then-let-the-app-read" flow on
  the assumption of <1s latency; scans typically take seconds to minutes. Use Event Grid to
  gate downstream processing.
- **Don't enable on diagnostic-export accounts.** They're append-only system telemetry;
  scanning is wasteful and noisy.
- **Sensitive data alerts depend on Purview.** Without Purview classification, you'll get
  weak heuristic-only signal.
- **Public anonymous access is a configuration problem, not a Defender problem.** Block it
  at the platform layer.

## Common anti-patterns
- **"Enabled on every storage account in the subscription, no exclusions"** — diagnostic and
  log accounts blow up cost. Override.
- **"Relied on the malware verdict tag without Event Grid"** — the bad blob still exists and
  is readable until something acts on the tag.
- **"Application reads blob immediately after upload"** — race with async scan. Gate on the
  scan-complete event.
- **"Scan cap left at unlimited"** — bill shock incident in week one.
- **"Migrated from v1 by re-enabling alongside v1"** — disable v1 first; double-billing.
- **"Used Defender for Storage instead of Purview DLP for SharePoint/OneDrive"** — wrong
  workload. SharePoint is M365, not Azure Storage.

## Example prompts
- `Enable Defender for Storage v2 across 50 subscriptions with malware scanning capped at
  3 TB/account/month.`
- `Wire the malware scan Event Grid event to a Logic App that quarantines malicious blobs.`
- `Exclude diagnostic-export storage accounts from Defender for Storage via Azure Policy.`
- `Alert on sensitive data threat detection and route to Sentinel — what's needed from
  Purview first?`
- `Build the IR runbook for "Malicious file uploaded to blob" alerts.`
- `Estimate monthly cost for 200 storage accounts averaging 500 GB ingest each.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-storage-introduction
- Enable plan: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-storage-introduction
- Malware scanning: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-storage-malware-scan
- Sensitive data threat detection: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-storage-data-sensitivity
- Event Grid response: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-storage-configure-malware-scan
- Migration from v1: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-storage-classic-migrate
- Alerts reference: https://learn.microsoft.com/azure/defender-for-cloud/alerts-reference#alerts-azurestorage
