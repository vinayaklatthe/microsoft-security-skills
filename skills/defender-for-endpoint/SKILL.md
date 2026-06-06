---
name: defender-for-endpoint
description: "Guidance for Microsoft Defender for Endpoint (MDE) — enterprise endpoint security with EDR, next-gen antivirus, attack surface reduction, vulnerability management, and automated investigation. Covers onboarding, policy design, ASR rules, and EDR in block mode. WHEN: Defender for Endpoint, MDE onboarding, endpoint EDR, attack surface reduction rules, next-gen antivirus policy, device isolation, endpoint vulnerability management, EDR block mode, onboard devices to Defender."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Endpoint

Microsoft Defender for Endpoint (MDE) is an enterprise endpoint security platform providing
prevention (next-gen AV, attack surface reduction), detection and response (EDR),
threat & vulnerability management (Defender Vulnerability Management), and automated
investigation and remediation.

## When to use
Protecting Windows, macOS, Linux, iOS, and Android endpoints and feeding endpoint signal into
Defender XDR.

## Design approach
1. **Licensing/plan** — Confirm Plan 1 vs Plan 2 (P2 adds EDR, AIR, threat & vuln management,
   advanced hunting). Defender Vulnerability Management add-on extends posture features.
2. **Onboard devices** — Use Microsoft Intune / Configuration Manager / Group Policy / scripts.
   Prefer Intune-based onboarding and security settings management for cloud-managed estates.
3. **Next-gen AV** — Configure real-time protection, cloud-delivered protection, PUA blocking,
   and tamper protection (enable tamper protection everywhere).
4. **Attack Surface Reduction (ASR)** — Deploy ASR rules in **audit** first, review impact in
   reports, then move to **block**. Combine with controlled folder access and network protection.
5. **EDR in block mode** — Enable so EDR remediates post-breach detections even when a
   non-Microsoft AV is primary.
6. **TVM** — Use vulnerability management to prioritise remediation by exposure and threat.

## Guardrails
- Always pilot ASR rules in audit mode; some rules can break line-of-business apps.
- Enable tamper protection to prevent attackers disabling protection.
- Use device groups and RBAC to scope response actions (isolate, restrict, live response).

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-endpoint/microsoft-defender-endpoint
- Onboarding: https://learn.microsoft.com/defender-endpoint/onboarding
- ASR rules: https://learn.microsoft.com/defender-endpoint/attack-surface-reduction
- EDR in block mode: https://learn.microsoft.com/defender-endpoint/edr-in-block-mode
- Vulnerability management: https://learn.microsoft.com/defender-vulnerability-management/defender-vulnerability-management
