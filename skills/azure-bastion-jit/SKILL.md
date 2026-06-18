---
name: azure-bastion-jit
description: "Guidance for secure remote VM management in Azure using Azure Bastion combined with Defender for Cloud just-in-time (JIT) VM access. Covers Bastion SKU selection (Developer / Basic / Standard / Premium), IP-based and shareable-link connections, native client (RDP/SSH from local machine via az CLI), session recording (Premium), private-only deployment, JIT request workflow and policy, RBAC for connect operations, integration with Conditional Access (via Bastion + Entra login on the VM), Azure Policy enforcement to require Bastion + JIT and prohibit public IP on VMs, and migration off VPN/jump-box patterns. WHEN: Azure Bastion design, Bastion SKU comparison, JIT VM access, just-in-time access Azure, Bastion shareable link, native client Bastion, session recording Bastion, eliminate public IP on VMs, replace jump host with Bastion, secure RDP SSH Azure, Bastion Premium recording. DO NOT USE for hybrid/SD-WAN VPN design, GSA Private Access (use entra-global-secure-access), or cluster-only K8s access."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Bastion + Just-In-Time VM Access

The combination of **Azure Bastion** (managed, browser/native-client jump service) and
**Defender for Cloud just-in-time (JIT) VM access** (time-limited NSG allow-rules for
management ports) eliminates the two most common Azure VM compromise paths:
internet-exposed RDP/SSH and standing-open management ports.

## When to use
Designing or hardening administrative access to Azure IaaS VMs and VMSS. Use this skill
for SKU selection, JIT policy, public-IP elimination, and the operational workflow.

**Do not use this skill** for hybrid VPN/SD-WAN design, ZTNA replacement of VPN
(`entra-global-secure-access`), or AKS-only access.

## Bastion SKUs — pick by feature need

| SKU | Capabilities |
|---|---|
| **Developer** | Free, ad-hoc, browser-only RDP/SSH to a single VM, single VNet, no scale, no shareable links |
| **Basic** | RDP/SSH via portal, private-IP-only VMs supported, single-instance scale |
| **Standard** | + Native client, shareable links, IP-based connection, Kerberos, Linux file copy, custom port, scale up to 50 instances |
| **Premium** | + Session recording, private-only deployment, additional admin features |

> **Rule of thumb:** Standard for most enterprise; Premium where session recording or
> private-only deployment is required (regulated industries). Developer is for
> non-production / sandbox personal use.

## Approach

1. **Architecture.** One Bastion per hub VNet (or per spoke if traffic isolation
   requires). Required subnet: `AzureBastionSubnet` /26 minimum. NSG on the subnet
   follows the documented allow rules — don't write "deny all from internet" without
   the documented allow exceptions or Bastion breaks.

2. **Eliminate VM public IPs.** Azure Policy: *Public IP addresses should not be
   associated with virtual machines* — set to Deny in production scopes. New VMs are
   private-only; admin access is via Bastion + JIT.

3. **Bastion + Entra login on the VM.** Combine with `Microsoft Entra login for
   Windows/Linux VM` extension so RDP/SSH authenticates with Entra credentials,
   honoring Conditional Access (MFA, device compliance, named locations) on the VM
   sign-in itself. This is the missing leg most "Bastion-only" deployments forget.

4. **Configure JIT for every VM that's allowed RDP/SSH.**
   - Default ports: RDP 3389, SSH 22, WinRM 5985/5986.
   - Max request window: **3 hours**.
   - Source: **Requestor's IP** (or Bastion subnet, since requests come from there).
   - Approval: implicit by RBAC, or add a manual approval step for tier-0 VMs.

5. **RBAC on Bastion connect.** Bastion connect is *not* the same as VM RBAC. Required
   roles:
   - `Reader` on the Bastion + the VM + its NIC + its VNet.
   - `Virtual Machine User Login` (Linux) / `Virtual Machine Administrator Login`
     for Entra-based VM sign-in.
   - JIT request: `Microsoft.Security/locations/jitNetworkAccessPolicies/initiate/action`.
   Bake into a custom role per persona to avoid over-granting.

6. **Native client + IP-based + shareable links** (Standard+).
   - **Native client** (`az network bastion rdp/ssh`): admins use local mstsc/SSH
     tooling; better UX than browser tab. CA still applies via VM sign-in.
   - **IP-based connection**: Bastion to peered on-prem VMs over ExpressRoute/VPN.
   - **Shareable links**: time-bound URL for break-glass to a contractor. Disable
     unless explicitly needed; audit usage.

7. **Session recording** (Premium). Records video of administrator sessions to a Log
   Analytics workspace / Storage. Required for some regulated industries; review
   retention and access controls.

8. **JIT request workflow.** Document for admins:
   - Open Defender for Cloud → JIT VM access → Request access → port + window.
   - Connect via Bastion within window.
   - NSG rules auto-revert on expiry.

9. **Monitor.** Stream Bastion diagnostic logs (BastionAuditLogs) and JIT
   activity-log events to Sentinel. Detect: requests outside business hours from
   unexpected IPs, rapid sequential VMs by one principal.

## Guardrails
- **Don't write a deny-all NSG on the AzureBastionSubnet.** It must allow specific
  service tags / ports; the documented rules are required for the service to work.
- **JIT changes NSG rules, not Azure Firewall / NVA rules.** If management traffic
  flows through a firewall, JIT alone won't open it. Either layer firewall policy or
  route management traffic via Bastion only.
- **Bastion alone is not Conditional Access.** Without Entra login on the VM, you've
  removed public exposure but a stolen VM credential still works. Combine.
- **Shareable links bypass MFA on the originating user** unless paired with Entra VM
  login. Avoid for sensitive VMs.
- **Premium session recording is a heavy storage commitment.** Plan retention and
  cost.
- **Don't deploy Bastion in every spoke VNet "for convenience."** One per hub with
  peering is usually right; the per-instance cost adds up.
- **JIT request from a shared NAT IP** opens the port for everyone behind that NAT
  during the window. Combine with named locations and CA.
- **Public IP on a VM and Bastion peer access "as backup"** — defeats the model. Pick
  one path.

## Common anti-patterns
- **"Bastion + public IP on VMs left in place 'just for break-glass'"** — break-glass
  is a procedure, not an unmonitored open RDP port.
- **"JIT request window = 8 hours, source = any"** — that's an open port for a working
  day from the internet.
- **"Bastion without Entra VM login"** — local admin password compromise is still
  game-over.
- **"Shareable links shared by email forever"** — turn into permanent backdoors. Time-
  bound + audit.
- **"Recorded all sessions to a workspace anyone can read"** — recording reveals
  privileged actions and credentials.
- **"Standalone Bastion per dev VM"** — uneconomical and noisy. One per hub.
- **"Skipped Sentinel/log integration"** — Bastion sessions invisible to SOC.
- **"Used Bastion for AKS API server access"** — wrong tool; use private cluster + GSA
  Private Access or jumpbox + kube-config.

## Example prompts
- `Design Bastion + JIT for a 3-hub multi-region landing zone with a 2,000-VM estate.`
- `Migrate from a self-managed Windows jump host to Bastion + Entra VM login + JIT.`
- `Eliminate public IP on Linux VMs via Azure Policy and roll out private-only access.`
- `Configure session recording on Bastion Premium with 1-year retention to Storage.`
- `Build a custom RBAC role for "VM Operator via Bastion" combining Bastion connect +
  Entra login + JIT request only.`
- `Sentinel detections: JIT request out-of-hours, rapid sequential VM access by one
  principal, shareable link creation.`
- `Compare Bastion shareable link vs Entra Private Access for occasional contractor
  access.`

## Microsoft Learn
- Bastion overview: https://learn.microsoft.com/azure/bastion/bastion-overview
- SKUs and features: https://learn.microsoft.com/azure/bastion/configuration-settings
- Bastion subnet NSG requirements: https://learn.microsoft.com/azure/bastion/bastion-nsg
- Native client connection: https://learn.microsoft.com/azure/bastion/connect-native-client-windows
- Shareable links: https://learn.microsoft.com/azure/bastion/shareable-link
- Session recording (Premium): https://learn.microsoft.com/azure/bastion/session-recording
- Just-in-time VM access: https://learn.microsoft.com/azure/defender-for-cloud/just-in-time-access-overview
- Entra login for Linux VMs: https://learn.microsoft.com/entra/identity/devices/howto-vm-sign-in-azure-ad-linux
- Entra login for Windows VMs: https://learn.microsoft.com/entra/identity/devices/howto-vm-sign-in-azure-ad-windows
- Azure Policy — disallow public IP: https://learn.microsoft.com/azure/governance/policy/samples/built-in-policies#network
