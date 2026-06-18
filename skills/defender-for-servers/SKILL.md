---
name: defender-for-servers
description: "Guidance for Microsoft Defender for Servers (Plan 1 and Plan 2) — server-specific protection in Microsoft Defender for Cloud. Covers plan selection, agentless vs agent-based scanning, MDE for Servers integration, file integrity monitoring (FIM via MDE), just-in-time VM access, vulnerability assessment, adaptive application controls, network hardening, and free data ingestion to Sentinel/Log Analytics. Applies to Azure VMs, Azure Arc-enabled servers (on-prem, AWS EC2, GCP Compute), and Azure VMSS. WHEN: Defender for Servers, MDE for Servers, server EDR, FIM, file integrity monitoring, JIT VM access, just-in-time access, agentless scanning servers, vulnerability assessment for VMs, hybrid server protection, Arc-enabled servers security, AWS EC2 in Defender for Cloud, GCP Compute in Defender for Cloud, server hardening Azure, Plan 1 vs Plan 2 servers. DO NOT USE for endpoint client devices (use defender-for-endpoint), generic Azure resource posture (use defender-for-cloud-hardening), or container hosts (use defender-for-containers)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Servers

Defender for Servers is the server-focused plan inside Microsoft Defender for Cloud. It extends
**Microsoft Defender for Endpoint (MDE)** to Azure VMs, Azure Arc-enabled machines (on-prem,
AWS EC2, GCP Compute), and VM Scale Sets, and adds server-specific controls: just-in-time VM
access, file integrity monitoring, agentless disk scanning, and vulnerability assessment.

## When to use
Designing or hardening protection for **server workloads** — IaaS VMs, hybrid/multicloud
servers via Arc, jump hosts, domain controllers, line-of-business servers. Use this skill for
plan selection, MDE-for-Servers onboarding, FIM, JIT, and agentless vs agent-based scanning
trade-offs.

**Do not use this skill** for client endpoints (`defender-for-endpoint`), AKS/container hosts
(`defender-for-containers`), Azure storage accounts (`defender-for-storage`), or generic
Defender for Cloud posture (`defender-for-cloud-hardening`).

## Pick the plan

| If you need... | Plan |
|---|---|
| Free foundational CSPM only (no server EDR) | **Defender CSPM** (no server plan) |
| MDE Plan 2 EDR, threat detection, free 500 MB/day Log Analytics ingestion | **Defender for Servers Plan 1** (per-server) |
| Everything in P1 plus FIM, JIT, agentless scanning, vuln assessment, adaptive app controls, network hardening, regulatory compliance, 500 MB free ingestion | **Defender for Servers Plan 2** |

> **Rule of thumb:** Plan 1 = "I just need EDR everywhere." Plan 2 = "I need EDR + posture +
> compliance + FIM." Most enterprises pick **P2 for production, P1 for dev/test**.

## Onboarding paths

| Estate | Path |
|---|---|
| Azure VMs | Enable plan at subscription scope; auto-provisioning deploys MDE + Azure Monitor Agent |
| On-prem / VMware servers | **Azure Arc** onboarding, then enable plan |
| AWS EC2 / GCP Compute | Connect AWS account / GCP project to Defender for Cloud; auto-provisioning via Arc |
| VMSS (uniform) | Plan applies; agentless scan covers ephemeral instances |

## Approach

1. **Inventory and connect first.** Onboard non-Azure servers via Arc before enabling the
   plan; otherwise you pay per-server but get no coverage on hybrid estate.
   *Verify: Defender for Cloud → Inventory shows all expected resources with a Defender plan
   column = Plan 1/2.*

2. **Enable Plan 2 at subscription scope** (not resource group) so new VMs inherit
   automatically. Use Azure Policy *Configure Microsoft Defender for Servers to be enabled*
   at the management group for multi-sub estates.

3. **Turn on auto-provisioning of MDE integration.** This pushes the MDE sensor via the
   unified solution; do **not** also onboard servers directly through Intune or local script —
   it causes telemetry duplication and double billing.
   *Verify: a sample VM appears in security.microsoft.com → Device inventory within 1 hour.*

4. **Enable agentless disk scanning.** Reads VM disk snapshots to find malware, secrets, and
   vulnerabilities without any agent — runs once per 24h, no performance impact.
   *Verify: Recommendations → "Machines should have a vulnerability assessment solution" green
   for VMs without MDE Vulnerability Management agent.*

5. **Configure JIT VM access** for any VM with management ports (RDP 3389, SSH 22, WinRM
   5985/5986). Default to 3-hour max request, source IP = requestor only.
   *Verify: NSGs show JIT-managed deny rules for the protected ports; access requests show in
   activity log.*

6. **File Integrity Monitoring** via MDE (the Log Analytics-based FIM is being retired).
   Enable on tier-0 servers (DCs, PKI, jump hosts) first. Tune the rule set — default
   includes Windows system files; add your app's config paths.
   *Verify: FIM events appear in MDE advanced hunting `DeviceFileEvents` with
   ActionType = FileCreated/Modified on the monitored paths.*

7. **Adaptive application controls** (Plan 2). Run in audit for 14 days to learn the app
   baseline per VM group, then enforce. Skip on highly dynamic workloads (CI build agents).

8. **Free 500 MB/day Log Analytics ingestion.** Stream the security event set to a workspace
   you can query from Sentinel — but keep the volume budget in mind; high-volume DCs blow past
   500 MB easily.

9. **Review the regulatory compliance dashboard** (PCI, ISO 27001, NIST 800-53, CIS) monthly
   and turn failed controls into Azure Policy assignments.

## Guardrails
- **Onboard hybrid via Arc, not local MDE script.** Direct MDE onboarding bypasses Defender
  for Cloud billing/posture and you lose JIT, FIM, agentless scan.
- **Do not enable both Plan 1 and Plan 2 in the same scope.** P2 supersedes P1; configure at
  the highest scope and let inheritance work.
- **JIT changes NSG rules, not Azure Firewall / NVA rules.** If management traffic flows
  through a firewall, JIT alone won't protect — add firewall policy.
- **Agentless scan is point-in-time.** It catches drift every 24h, not real-time. Keep MDE
  on for runtime detection.
- **FIM via MDE is the supported path.** The legacy Log Analytics-agent FIM is deprecated —
  do not architect new deployments around it.
- **Do not run two AV engines active.** If a third-party AV is primary, set Defender to
  passive + EDR in block mode (see `defender-for-endpoint`).

## Common anti-patterns
- **"We turned on Plan 1 everywhere to save money" then asked for FIM/JIT** — those are P2
  features. Move prod to P2.
- **"MDE onboarded directly through GPO on Arc servers"** — bypasses DfC, loses billing
  integration, double-onboarded. Always via DfC auto-provisioning.
- **"JIT request window = 24 hours, any source IP"** — defeats the point. Cap at 3h, source
  IP locked.
- **"FIM enabled on every file path on every server"** — alert fatigue. Tier-0 systems +
  app-specific config paths only.
- **"Adaptive application controls enforce on day one"** — blocks legitimate admin tooling.
  14 days audit, then enforce.
- **"Skipped agentless scan because we already run MDE Vulnerability Management"** — they're
  complementary; agentless catches unmanaged disks and stopped VMs.

## Example prompts
- `Plan Defender for Servers P1 vs P2 for a 2,000-VM estate split 70/30 prod/dev.`
- `Onboard 500 on-prem Windows Servers via Arc and enable P2.`
- `Roll out JIT VM access to all production Linux jump hosts with a 2-hour max window.`
- `Configure FIM via MDE on tier-0 domain controllers — which paths and registry keys?`
- `Stream Defender for Servers events into Sentinel using the 500 MB free allowance — what
  do we ingest?`
- `Connect an AWS account with 300 EC2 instances and enable Defender for Servers P2.`
- `Tune adaptive application controls for a fleet of IIS web servers.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-servers-introduction
- Plan features: https://learn.microsoft.com/azure/defender-for-cloud/plan-defender-for-servers-select-plan
- MDE integration: https://learn.microsoft.com/azure/defender-for-cloud/integration-defender-for-endpoint
- Just-in-time VM access: https://learn.microsoft.com/azure/defender-for-cloud/just-in-time-access-overview
- File Integrity Monitoring: https://learn.microsoft.com/azure/defender-for-cloud/file-integrity-monitoring-overview
- Agentless scanning for machines: https://learn.microsoft.com/azure/defender-for-cloud/concept-agentless-data-collection
- Adaptive application controls: https://learn.microsoft.com/azure/defender-for-cloud/adaptive-application-controls
- Connect AWS / GCP: https://learn.microsoft.com/azure/defender-for-cloud/multicloud
- Azure Arc onboarding: https://learn.microsoft.com/azure/azure-arc/servers/overview
