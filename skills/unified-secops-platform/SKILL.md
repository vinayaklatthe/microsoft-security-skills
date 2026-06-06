---
name: unified-secops-platform
description: "Guidance for the Microsoft unified security operations platform that brings Microsoft Sentinel, Microsoft Defender XDR, Security Copilot, Threat Intelligence, and Exposure Management together in the Microsoft Defender portal. WHEN: unified SecOps, onboard Sentinel to Defender portal, single SOC pane of glass, unified incident queue, connect Sentinel workspace to Defender XDR, exposure management, unified portal."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Unified SecOps Platform (Microsoft Defender portal)

The unified security operations platform consolidates SIEM (Microsoft Sentinel), XDR
(Microsoft Defender XDR), Microsoft Security Copilot, Threat Intelligence, and Microsoft
Security Exposure Management into a single experience in the **Microsoft Defender portal**
(security.microsoft.com).

## When to use
Standardising the SOC on one portal, unifying the incident queue across SIEM and XDR signals,
and reducing context-switching for analysts.

## Design approach
1. **Prerequisites** — A Microsoft Sentinel workspace, the required RBAC (Microsoft Entra and
   Sentinel roles), and Defender XDR onboarded.
2. **Onboard Sentinel** — Connect the Log Analytics workspace to the Defender portal. Only one
   workspace is primary in the unified portal per tenant; plan accordingly.
3. **Unified incidents** — Incidents and alerts from Sentinel and Defender XDR merge into one
   queue with shared entities, enabling single-pane triage and investigation.
4. **Advanced hunting** — Query both Sentinel and XDR tables together with KQL.
5. **Layer in capabilities** — Add Security Copilot for guided investigation, Threat Intelligence
   for IOC management, and Exposure Management for attack-surface and attack-path insight.

## Guardrails
- Some Sentinel features behave differently once onboarded to the Defender portal — review the
  feature parity and "what's changed" guidance before migrating analysts off the Azure portal.
- Validate RBAC mapping: Defender portal unified RBAC governs access to merged experiences.

## Microsoft Learn
- Unified SecOps overview: https://learn.microsoft.com/unified-secops-platform/overview-unified-security
- Connect Sentinel to the Defender portal: https://learn.microsoft.com/azure/sentinel/microsoft-sentinel-defender-portal
- Microsoft Defender portal: https://learn.microsoft.com/defender-xdr/microsoft-365-defender-portal
- Exposure Management: https://learn.microsoft.com/security-exposure-management/microsoft-security-exposure-management
