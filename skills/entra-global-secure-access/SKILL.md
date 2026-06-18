---
name: entra-global-secure-access
description: "Guidance for Microsoft Entra Global Secure Access (GSA) — Microsoft's Security Service Edge (SSE) combining Entra Internet Access (SWG/Secure Web Gateway) and Entra Private Access (ZTNA replacement for VPN). Covers client deployment (Windows, macOS, iOS, Android), traffic forwarding profiles (Microsoft, Internet, Private), Conditional Access for network traffic, source IP restoration, app discovery, Quick Access and per-app access for Private Access, connector deployment, branch site connectivity (IPSec), TLS inspection, and Universal CA integration. WHEN: Entra Global Secure Access, GSA, Microsoft SSE, Entra Internet Access, Entra Private Access, ZTNA Microsoft, replace VPN with ZTNA, secure web gateway Entra, Conditional Access on network, source IP restoration, Quick Access app, Private Access connector, branch IPSec to Microsoft, GSA client rollout. DO NOT USE for general Conditional Access policy design (use conditional-access-mfa), Azure VPN/ExpressRoute design, or third-party SSE (Zscaler/Netskope) configuration."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra Global Secure Access

Global Secure Access (GSA) is Microsoft's Security Service Edge (SSE) platform delivered
through the Entra control plane. It has two products that share one client, one policy
surface, and one identity model:

- **Entra Internet Access** — secure web gateway (SWG) for internet and Microsoft 365
  traffic with Conditional Access applied to network flows.
- **Entra Private Access** — ZTNA replacement for traditional VPN, fronting on-prem and
  IaaS apps through Entra-authenticated connectors (evolution of Entra App Proxy).

## When to use
Replacing VPN with ZTNA, applying Conditional Access to outbound internet traffic,
restoring source IP for M365 sign-ins from the GSA client, or providing remote-worker
access to TCP/UDP apps that aren't HTTPS.

**Do not use this skill** for generic CA policy authoring (`conditional-access-mfa`),
hybrid network design (`azure-network-security-design`), or competing SSE products.

## Traffic forwarding profiles

| Profile | Traffic captured | Use case |
|---|---|---|
| **Microsoft profile** | Entra ID + M365 traffic | Source IP restoration, CA on network for M365 |
| **Internet Access profile** | All internet egress | SWG, web filtering, CA on internet traffic |
| **Private Access profile** | Defined private apps (on-prem, IaaS) | ZTNA, VPN replacement |

Each profile is assigned to users/groups; user can be in all three concurrently.

## Approach

1. **Start with the Microsoft profile**, even if you're not buying full SSE yet. It's
   included with Entra ID P1/P2 (in preview/GA per region). Benefits:
   - Source IP restoration → CA policies that "require trusted network" actually work
     for remote users on the GSA client.
   - Compliant network check in CA: only requests through GSA satisfy the condition.

2. **Pilot the GSA client** on a small group (50–200 users). Validate:
   - Latency to top apps (M365, internal HR, SAP) ≤ baseline + 30 ms.
   - Captive portals still work (hotel/airport Wi-Fi).
   - Conflict check with existing VPN clients, third-party endpoint protection, and
     personal firewalls.

3. **Roll out Private Access in parallel with VPN, not as a flag-day cutover.**
   - **Quick Access** = the "easy migration" app: a wildcard FQDN/IP segment per site,
     pre-authenticated by Entra. Use for legacy back-end services.
   - **Per-app access** = define one Entra app per service with explicit FQDN/port/protocol
     and CA assignment. Use for high-value apps (SAP, file shares, RDP jump hosts).
   - Deploy **Private Access connectors** in HA pairs per region/site (same model as
     App Proxy connectors).

4. **Internet Access** — start in **monitor-only** for 14 days. Build the baseline of
   destinations before turning on web-category blocks. Apply TLS inspection only to
   selected categories (don't break banking/healthcare per local law).

5. **Conditional Access on network** — author CA policies that include
   `All Compliant Network locations`. Combine with device compliance + user risk for a
   real "Zero Trust" posture, not just "VPN with new branding."

6. **Branch / site connectivity** — for office locations, terminate IPSec tunnels from the
   site router/SD-WAN to GSA so guest devices and IoT still get filtered without the
   client.

7. **Migration off VPN** — once 80%+ of users are stable on GSA Private Access for the
   target app set, decommission VPN concentrators. Keep one for break-glass and
   third-party-managed devices.

## Guardrails
- **GSA client and a third-party SSE/VPN client coexist poorly.** Network stack hooks
  collide. Pick one tunnel per machine; pilot before mass rollout.
- **Source IP restoration only works for traffic through the Microsoft profile.** Direct
  M365 access (split tunnel disabled) bypasses GSA → CA "trusted network" fails.
- **Don't deny-all on Internet Access on day one.** Baseline first; finance teams visit
  obscure SEC URLs you've never seen.
- **TLS inspection requires CA distribution.** Without the Microsoft CA installed in the
  trust store, every HTTPS site breaks. Plan rollout via Intune/MDM.
- **Private Access connectors need outbound 443 only.** No inbound NAT/firewall holes —
  that's the whole point.
- **Quick Access is a stepping stone, not a destination.** Wide wildcards mean
  excessive trust. Migrate to per-app access.
- **Licensing is segmented.** Microsoft profile features are bundled with Entra P1/P2;
  Internet Access and Private Access are separate add-ons. Confirm SKUs before scope.

## Common anti-patterns
- **"Flag-day VPN cutover"** — a connector misconfig affects 30,000 users. Parallel run.
- **"Quick Access for everything, forever"** — wildcard trust = ZTNA in name only.
- **"Allowed split-tunnel exceptions for M365 to fix latency"** — now CA can't see the
  traffic; "trusted network" condition silently false.
- **"TLS inspection on banking/healthcare categories"** — regulatory violation in some
  jurisdictions. Exclude.
- **"Deployed Internet Access in block mode on day one"** — global outage of unexpected
  SaaS dependencies.
- **"GSA client + persistent always-on VPN coexisting"** — routing conflict; client
  fights itself. Pick one tunnel.
- **"Connectors in a single AZ"** — site outage = app outage. Always HA pair across AZ.

## Example prompts
- `Roll out GSA Microsoft profile to 30,000 users for source IP restoration and CA
  trusted-network policies.`
- `Replace Cisco AnyConnect VPN with Entra Private Access for 12 internal apps and
  3 jump hosts.`
- `Design Private Access connectors for 4 regions with HA and capacity sizing.`
- `Pilot Internet Access in monitor mode for finance; identify blockable web
  categories vs allow-list.`
- `Plan TLS inspection rollout with Microsoft CA distribution via Intune.`
- `Build Conditional Access policy: require compliant device + compliant network for
  privileged users.`
- `Branch-site IPSec to GSA from a Meraki edge — design and routing.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/global-secure-access/overview-what-is-global-secure-access
- Internet Access: https://learn.microsoft.com/entra/global-secure-access/concept-internet-access
- Private Access: https://learn.microsoft.com/entra/global-secure-access/concept-private-access
- Traffic forwarding profiles: https://learn.microsoft.com/entra/global-secure-access/concept-traffic-forwarding
- GSA client: https://learn.microsoft.com/entra/global-secure-access/how-to-install-windows-client
- Source IP restoration: https://learn.microsoft.com/entra/global-secure-access/how-to-source-ip-restoration
- Conditional Access for network: https://learn.microsoft.com/entra/global-secure-access/how-to-compliant-network
- Connectors: https://learn.microsoft.com/entra/global-secure-access/how-to-configure-connectors
- Branch (IPSec): https://learn.microsoft.com/entra/global-secure-access/concept-remote-network-connectivity
- Licensing: https://learn.microsoft.com/entra/global-secure-access/overview-what-is-global-secure-access#licensing
