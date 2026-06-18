---
name: defender-for-iot
description: "Guidance for Microsoft Defender for IoT — agentless OT/ICS network detection and response for industrial environments, plus enterprise IoT (EIoT) protection integrated with Defender XDR. Covers OT sensor deployment (physical/virtual, SPAN/TAP), Purdue model alignment, on-premises management console, cloud-managed sensors, EIoT (printers, cameras, VoIP) discovered through MDE, asset inventory, vulnerability data, threat intelligence, and integration with Sentinel and Defender XDR. WHEN: Defender for IoT, OT security, ICS security, SCADA monitoring, Purdue model network security, OT sensor deployment, SPAN port monitoring, enterprise IoT discovery, unmanaged device protection, factory floor security, NDR for OT, ICS threat detection, IoT asset inventory. DO NOT USE for IoT Hub data-plane security (Azure platform), Azure Sphere device hardening, or generic endpoint EDR (use defender-for-endpoint)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for IoT

Defender for IoT delivers **agentless network detection and response** for two distinct
estates that legacy endpoint tools miss:

- **OT / ICS** (operational technology, SCADA, PLCs, industrial networks).
- **Enterprise IoT (EIoT)** — printers, cameras, VoIP phones, smart-building devices on the
  corporate network — discovered and protected via the Microsoft Defender for Endpoint
  sensor and surfaced in Defender XDR.

## When to use
Securing factory, utility, healthcare, or building-automation networks; or extending
visibility to unmanaged "things" on the enterprise LAN that cannot run an endpoint agent.

**Do not use this skill** for IoT Hub / IoT Central data-plane security, Azure Sphere
firmware design, or workstation/server EDR (`defender-for-endpoint`).

## OT vs Enterprise IoT — pick the right path

| Estate | Path | Sensor |
|---|---|---|
| Plant networks, ICS, SCADA, PLCs (Levels 0–3 Purdue) | **Defender for IoT — OT** | Dedicated OT network sensor (physical or virtual VM) attached to SPAN/TAP |
| Corporate LAN unmanaged devices (printers, cameras, VoIP) | **Defender for IoT — EIoT** | Existing MDE sensors on Windows endpoints; no separate appliance |

> **Rule of thumb:** if it speaks Modbus / DNP3 / S7 / EtherNet/IP, you need an **OT sensor**.
> If it's an IP camera on the office VLAN, **EIoT via MDE** is enough.

## Approach

### OT estate

1. **Network mapping by Purdue level first.** Identify Level 0/1 (controllers, sensors),
   Level 2 (SCADA HMI), Level 3 (operations management). Sensors monitor traffic between
   levels and east-west within Level 2/3.

2. **Pick sensor placement.** One sensor per OT site, attached to a SPAN port that mirrors
   the core OT switch. Aggregate multi-site sensors into a **cloud-connected** model
   (preferred for new deployments) or the legacy on-prem management console (for
   air-gapped sites).

3. **Deploy passively.** OT sensors are **fully passive** — no probing, no active scans.
   This is non-negotiable in safety-critical environments. Confirm with plant ops before
   any port turn-up.

4. **Build the asset inventory.** Within 14 days the sensor builds a baseline of devices,
   firmware versions, and protocol relationships. Validate the baseline with the OT team
   before enabling alerting.

5. **Enable alerts.** Categories: malware, network anomalies, protocol violations,
   operational (e.g. unauthorized PLC programming change). Tune to plant context — many
   "anomalies" are legitimate maintenance windows.

6. **Stream to Sentinel.** Use the Defender for IoT data connector. Build OT-specific
   workbooks and playbooks (e.g., auto-ticket on unauthorized PLC reprogram).

7. **Vulnerability program.** Sensor identifies device firmware → matched to known CVEs.
   Do **not** push patches via the same channel as IT — coordinate with OT change windows.

### Enterprise IoT estate

1. **Already have MDE deployed?** EIoT is a license toggle on top of MDE — enable in
   Defender XDR settings. Devices on the LAN segment seen by an MDE-enrolled endpoint get
   discovered.
2. **Review the device inventory** in security.microsoft.com → Assets → Devices, filtered
   to Device type = IoT.
3. **Group and tag** by function (printers, cameras, VoIP, building automation). Apply
   network access policies (NAC / NSG / firewall) per group.
4. **Vulnerability findings + threat alerts** flow into Defender XDR alongside endpoint
   detections.

## Guardrails
- **OT sensors must be passive.** Never enable active probing in production OT — risk of
  PLC reset / safety-system trip.
- **Coordinate with OT operations before any deployment change.** Changes to switches,
  VLANs, or SPAN configuration require an OT change window.
- **Don't ship OT alerts straight to the IT SOC without context.** OT analysts and IT
  analysts triage differently. Either build OT-aware playbooks or route to an OT SOC.
- **EIoT requires MDE on at least one endpoint per network segment** to see the unmanaged
  devices. Coverage gaps = blind spots.
- **Don't push patches to OT devices on IT cadence.** OT change windows are quarterly or
  annual. Use the vuln data to plan, not to auto-remediate.
- **Air-gapped sites cannot use cloud-connected mode.** Stay on the on-prem management
  console; plan for the migration once connectivity is allowed.
- **Defender for IoT ≠ Azure IoT Hub security.** Different product, different scope.

## Common anti-patterns
- **"Active scan to inventory PLCs faster"** — caused a safety-system trip in a real
  refinery. Always passive in OT.
- **"One sensor for the whole multi-site estate over the WAN"** — SPAN traffic isn't
  WAN-friendly. One sensor per site.
- **"Routed OT alerts to the standard IT incident queue"** — IT analysts close them as
  "expected legacy protocol" and miss real attacks.
- **"Skipped EIoT because we already have MDE"** — discovery of unmanaged devices is the
  whole point; turn it on.
- **"Patched OT firmware in the IT monthly window"** — production outage. Plan with OT.
- **"Used Defender for IoT to monitor IoT Hub device telemetry"** — wrong product.

## Example prompts
- `Plan Defender for IoT OT sensor placement for a 5-site manufacturing estate (1 plant
  network per site).`
- `Enable EIoT discovery via MDE in a tenant with 80,000 endpoints.`
- `Stream OT alerts into Sentinel with a workbook for unauthorized PLC programming.`
- `Build a runbook for "Suspicious S7 protocol activity" alert — who triages, what
  changes, when do we escalate.`
- `Compare cloud-connected sensors vs on-prem management console for an air-gapped
  utility.`
- `Tag and group EIoT devices by function and apply NAC quarantine policy.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/defender-for-iot/
- OT deployment guide: https://learn.microsoft.com/azure/defender-for-iot/organizations/best-practices/plan-prepare-deploy
- OT sensor architecture: https://learn.microsoft.com/azure/defender-for-iot/organizations/architecture
- Cloud-connected vs on-prem: https://learn.microsoft.com/azure/defender-for-iot/organizations/architecture-connections
- Enterprise IoT: https://learn.microsoft.com/azure/defender-for-iot/
- Sentinel integration: https://learn.microsoft.com/azure/sentinel/iot-solution
- Alert reference: https://learn.microsoft.com/azure/defender-for-iot/organizations/alert-engine-messages
