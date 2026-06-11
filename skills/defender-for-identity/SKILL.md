---
name: defender-for-identity
description: "Guidance for Microsoft Defender for Identity (MDI) — identity threat detection across on-premises Active Directory, Entra Connect, and AD CS/FS using sensors. Covers sensor deployment, posture recommendations, and lateral-movement detection. WHEN: Defender for Identity, MDI sensors, detect lateral movement, on-prem AD threat detection, identity security posture, AD CS monitoring, domain controller sensor, detect Kerberoasting, identity ITDR."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Identity

Microsoft Defender for Identity (MDI) is a cloud-based identity threat detection and response
(ITDR) solution that uses sensors on domain controllers and other identity infrastructure to
detect reconnaissance, credential theft, lateral movement, and domain dominance.

## When to use
Detecting identity-based attacks against on-premises Active Directory (and hybrid identity
infrastructure) and surfacing identity posture recommendations.

## Approach
1. **Plan sensors** — Deploy MDI sensors on all **domain controllers**, and on **AD CS**,
   **AD FS**, and **Entra Connect** servers for full coverage.
2. **Prerequisites** — Validate connectivity to the cloud service, a Directory Service Account
   (gMSA recommended), and capture requirements.
3. **Tune detections** — Review and tune alerts (e.g., suspected Kerberoasting, DCSync,
   pass-the-ticket, suspicious LDAP). Map to Defender XDR incidents.
4. **Identity posture** — Action **Identity security posture assessments** (e.g., unsecure
   accounts, legacy protocols, risky configurations) shown in Microsoft Secure Score.
5. **Integrate** — Signals correlate into Defender XDR and enrich Entra ID Protection.

## Guardrails
- Use a group Managed Service Account (gMSA) for the Directory Service Account.
- Ensure sensors are deployed on **every** DC — gaps create blind spots for lateral movement.
- Use honeytoken accounts to catch reconnaissance.

## Example prompts
- `Deploy Defender for Identity sensors on domain controllers and AD CS/AD FS.`
- `How do I detect lateral movement and Kerberoasting on-prem?`
- `Review identity security posture recommendations from MDI.`
- `Plan sensor coverage for full on-prem AD threat detection.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-for-identity/what-is
- Deploy/architecture: https://learn.microsoft.com/defender-for-identity/deploy/deploy-defender-identity
- Sensor on AD CS/FS/Entra Connect: https://learn.microsoft.com/defender-for-identity/deploy/active-directory-federation-services
- Posture assessments: https://learn.microsoft.com/defender-for-identity/security-assessment
