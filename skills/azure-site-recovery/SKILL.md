---
name: azure-site-recovery
description: "Guidance for Azure Site Recovery (ASR) — disaster-recovery-as-a-service that replicates Azure VMs and on-premises machines to a secondary region for orchestrated failover. Covers RPO / RTO design, replication setup, recovery plans with start-up ordering and scripts, test failover discipline, and the separation between DR (ASR) and backup (Azure Backup) for ransomware resilience. WHEN: Azure Site Recovery, ASR, disaster recovery, DR replication, failover, recovery plan, business continuity, RPO RTO, test failover, region failover, ransomware resilience DR, paired region, failover and failback. DO NOT USE for point-in-time backup / restore (use Azure Backup), database HA / geo-replication only (use SQL geo-replication), or general BCDR design without an Azure tilt."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Site Recovery

Azure Site Recovery (ASR) is Disaster-Recovery-as-a-Service that replicates Azure VMs and
on-premises machines to a secondary region, orchestrating failover and failback to keep
workloads available during regional outages. It's a critical piece of business continuity -
distinct from, and complementary to, backup.

## When to use
Providing regional disaster recovery for critical workloads with a tested, orchestrated
failover capability. Use this skill to set RPO / RTO, design recovery plans, and run test
failovers.

**Do not use this skill** for point-in-time backup (`use Azure Backup`), database-only HA,
or generic BCDR strategy without Azure-specific design.

## Tier workloads by RPO / RTO

| Workload tier | RPO target | RTO target | Strategy |
|---|---|---|---|
| **Tier 0 - mission critical** | < 1 minute | < 15 minutes | Active-active multi-region (not ASR alone); ASR as warm fallback |
| **Tier 1 - business critical** | < 15 minutes | < 1 hour | **ASR continuous replication** + automated recovery plan |
| **Tier 2 - important** | < 1 hour | < 4 hours | ASR replication + manual failover |
| **Tier 3 - standard** | < 24 hours | < 24 hours | Azure Backup + restore in secondary region |
| **Tier 4 - dev / test** | 7 days | 7 days | Azure Backup only; no DR |

> **Rule of thumb:** if RPO is sub-minute or RTO is sub-15-minute, ASR alone isn't enough
> - design active-active. ASR is the right answer for Tier 1 and Tier 2 (RPO minutes,
> RTO < 4 hours).

## Approach

1. **Define RPO and RTO per workload** — Workload owners + business sign-off, not IT
   guessing. Tier per the table. Document the assumption that "Tier 3 = backup-restore,
   not failover".
   *Verify: RPO / RTO documented and signed off per Tier 1 / Tier 2 workload.*

2. **Set up the Recovery Services vault in the paired region** — Use Azure **paired
   region** (e.g. North Europe ↔ West Europe) for latency, billing, and Microsoft-
   coordinated patching. One vault per region pair per business unit.
   *Verify: vault in the secondary region; replication policy created (e.g. 24-hour
   retention, 4-hour app-consistent snapshots).*

3. **Enable replication on Tier 1 / Tier 2 VMs** — Replication is per-VM. Choose target
   region, target VNet, target storage, and **Availability Zone** alignment if used in
   source. Initial replication can take hours - plan bandwidth.
   *Verify: replication health = healthy on all in-scope VMs; latest recovery point time
   stamp within the RPO target.*

4. **Build recovery plans with ordered start-up** — Group VMs by application; specify
   start-up order (DB tier first, then app, then web). Add **pre / post scripts**
   (Automation runbooks) for DNS update, IP changes, app warm-up. Add **manual action
   pauses** where a human must validate.
   *Verify: recovery plan dry-runs in test failover; documented runbook for the on-call
   team.*

5. **Account for dependencies in the recovery region** — Identity (Entra is global; AD DCs
   need a regional DC or DR DC), DNS (private DNS zones), Key Vault (regional or geo-
   replicated), Storage accounts (GRS or RA-GRS), networking (peerings, gateways, firewall),
   licences.
   *Verify: dependency map; recovery region has working DNS, DC reachability, Key Vault,
   gateway connectivity.*

6. **Test failover on a schedule** — Run **test failover** into an **isolated network** in
   the secondary region at least every 6 months for Tier 1 (quarterly is better). Validate
   app functionality, document timing vs RTO target, capture issues.
   *Verify: test failover report shows actual RTO ≤ documented RTO; issues triaged within
   30 days.*

7. **Plan failover / failback procedure** — Planned failover (with sync) for graceful;
   unplanned (data-loss-bounded by last recovery point) for outage. Failback procedure
   tested as part of the test failover lifecycle.

## Guardrails
- **DR is not backup - pair ASR with Azure Backup for point-in-time restore and ransomware
  recovery (immutable / soft-deleted recovery points).** ASR replicates the corruption too;
  you need immutable backup for ransomware.
- **Test failover on a schedule; an untested DR plan is an assumption, not a capability.**
  First real failover with no test = it doesn't work.
- **Account for dependencies (identity, DNS, networking, Key Vault) in the recovery
  region.** App fails over fine; can't reach DC or Key Vault = still down.
- **Paired regions matter.** Microsoft coordinates patching across pairs - non-paired pairs
  can patch the same week and both go offline.
- **Recovery plans, not just replication.** Replication keeps the data; recovery plan starts
  the app in the right order.
- **Cost: ASR is per-VM-month + storage.** Tier carefully - DR for everything is wasteful;
  DR for nothing is negligent.

## Common anti-patterns
- **"We have ASR, so we don't need backup"** - ASR replicates ransomware encryption.
  Backup with immutability is the only ransomware recovery.
- **"Replicate everything to be safe"** - 10x cost, slower failover, more test scope.
  Tier by RPO / RTO.
- **"Never test the failover - it's risky in prod"** - Test failover is isolated; it does
  not affect prod. The risk is not testing.
- **"Run DR drill once, two years ago, never again"** - Architecture has drifted. Quarterly
  test for Tier 1.
- **"Forgot the DC / DNS / Key Vault in the DR region"** - VM is up, app can't auth or
  resolve. Dependency map.
- **"Single global vault for all regions"** - Vault is regional; vault in primary lost = no
  DR. One per region pair.

## Example prompts
- `Design a disaster recovery plan with Azure Site Recovery and clear RPO / RTO targets.`
- `How do I run a test failover without affecting production?`
- `Set up region-to-region replication and a recovery plan with ordered start-up.`
- `Plan DR alongside Azure Backup for ransomware resilience.`
- `Map dependencies (identity, DNS, Key Vault) for failover to the paired region.`
- `Tier our workloads for RPO / RTO and decide which get ASR vs backup-only.`

## Microsoft Learn
- Site Recovery overview: https://learn.microsoft.com/azure/site-recovery/site-recovery-overview
- Azure-to-Azure DR: https://learn.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication
- Recovery plans: https://learn.microsoft.com/azure/site-recovery/recovery-plan-overview
- Test failover: https://learn.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-dr-drill
- Azure Backup vs ASR: https://learn.microsoft.com/azure/backup/backup-overview
- Paired regions: https://learn.microsoft.com/azure/reliability/regions-paired
- Azure-to-Azure replication architecture: https://learn.microsoft.com/azure/site-recovery/azure-to-azure-architecture
- Failover and failback: https://learn.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-failover-failback
