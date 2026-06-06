---
name: azure-site-recovery
description: "Guidance for Azure Site Recovery (ASR) — disaster recovery as a service that replicates workloads to a secondary region for failover, supporting business continuity and ransomware resilience. Covers replication, recovery plans, failover testing, and RPO/RTO. WHEN: Azure Site Recovery, disaster recovery, DR replication, failover, recovery plan, business continuity, RPO RTO, test failover, region failover, ransomware resilience DR."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Site Recovery

Azure Site Recovery (ASR) is Disaster-Recovery-as-a-Service that replicates Azure VMs (and
on-premises machines) to a secondary region, orchestrating failover and failback to keep
workloads available during outages — a key part of business continuity and ransomware resilience.

## When to use
Providing regional disaster recovery for critical workloads and a tested, orchestrated failover
capability.

## Approach
1. **Define objectives** — Establish **RPO** (data-loss tolerance) and **RTO** (downtime
   tolerance) per workload; tier applications by criticality.
2. **Set up replication** — Create a Recovery Services vault; enable replication for Azure VMs to
   a target region (or on-prem to Azure). ASR maintains continuous, crash-consistent and
   app-consistent recovery points.
3. **Build recovery plans** — Group machines and order start-up, add scripts/runbooks and manual
   actions to orchestrate multi-tier application failover.
4. **Test regularly** — Run **test failover** into an isolated network without affecting
   production; validate and document results.
5. **Operate failover/failback** — Execute planned/unplanned failover when needed and fail back
   when the primary recovers.

## Guardrails
- DR is not backup — pair ASR with **Azure Backup** for point-in-time restore and ransomware
  recovery (immutable/soft-deleted recovery points).
- Test failover on a schedule; an untested DR plan is an assumption, not a capability.
- Account for dependencies (identity, DNS, networking, Key Vault) in the recovery region.

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/site-recovery/site-recovery-overview
- Azure-to-Azure DR: https://learn.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-enable-replication
- Recovery plans: https://learn.microsoft.com/azure/site-recovery/recovery-plan-overview
- Test failover: https://learn.microsoft.com/azure/site-recovery/azure-to-azure-tutorial-dr-drill
