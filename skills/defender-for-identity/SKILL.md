---
name: defender-for-identity
description: "Guidance for Microsoft Defender for Identity (MDI) — identity threat detection (ITDR) across on-premises Active Directory, AD CS, AD FS, and Entra Connect using sensors. Covers sensor placement, prerequisites, posture assessments, and lateral-movement detection. WHEN: Defender for Identity, MDI, MDI sensors, detect lateral movement, on-prem AD threat detection, identity security posture, AD CS monitoring, ADCS abuse, domain controller sensor, detect Kerberoasting, DCSync, Golden Ticket, identity ITDR, honeytoken, gMSA Directory Service Account, suspicious LDAP, ESC1 ESC8. DO NOT USE when the goal is cloud identity protection in Entra ID (use entra-id-protection) or correlating cross-workload incidents (use defender-xdr)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Identity

Microsoft Defender for Identity (MDI) is a cloud-based identity threat detection and response
(ITDR) solution. Lightweight sensors on domain controllers and other identity infrastructure
parse network traffic, ETW events, and AD object reads to detect reconnaissance, credential
theft, lateral movement, and domain dominance. Signals correlate into Defender XDR incidents.

## When to use
Detecting identity-based attacks against **on-premises Active Directory**, **AD CS**, **AD FS**,
and **Entra Connect** — and surfacing identity posture issues (legacy protocols, unsecure
accounts, risky delegations) that lead to those attacks.

**Do not use this skill** for cloud-only Entra ID risk detection — that is **Entra ID
Protection** (`entra-id-protection`). MDI sees on-prem and hybrid identity infrastructure.

## Map the attack to a detection source

Pick the row that matches the attacker behaviour to confirm MDI is the right control and
which sensor surface produces the signal.

| If the attacker is... | MDI detection family | Sensor surface |
|---|---|---|
| Enumerating users, groups, SPNs | Reconnaissance | DC sensor (LDAP, SAMR) |
| Cracking service-account TGS tickets offline | Kerberoasting | DC sensor (Kerberos) |
| Replicating directory secrets (DCSync) | Domain dominance | DC sensor (DRSUAPI RPC) |
| Forging Kerberos tickets | Golden / Silver Ticket | DC sensor (Kerberos anomalies) |
| Abusing AD CS misconfig (ESC1–ESC8) | Certificate-based privilege escalation | AD CS sensor |
| Hijacking the AD FS sign-in flow | Token / SAML forgery | AD FS sensor |
| Stealing Entra Connect sync account creds | Hybrid identity compromise | Entra Connect sensor |
| Probing risky configurations (legacy SMB, weak SPNs) | Identity Security Posture (ISPM) | All sensors + cloud assessments |

> **Rule of thumb:** if the attacker touches an on-prem identity service for any step, MDI
> should see it. A gap in any sensor (one un-instrumented DC, AD CS, or AD FS) is a blind
> spot for the whole kill chain.

## Approach

1. **Map identity infrastructure** — Inventory every domain controller (including RODCs),
   every AD CS Enterprise CA, every AD FS server, and every Entra Connect / Cloud Sync host.
   This list is the sensor target list — gaps here become attack paths later.
   *Verify: `Get-ADDomainController -Filter *` count equals the deployed sensor count in the
   MDI portal under Settings → Sensors.*

2. **Confirm prerequisites before deploy** — Each sensor host needs outbound HTTPS to the MDI
   cloud service, the MDI sensor MSI, a Directory Service Account (DSA), and (on DCs) the
   Advanced Audit Policy settings + Object Access SACLs that MDI requires.
   *Verify: run the **MDI sizing tool** and confirm CPU/RAM headroom; sensors should add
   < 10% sustained CPU on a DC.*

3. **Use a gMSA for the Directory Service Account** — Group Managed Service Accounts rotate
   passwords automatically and remove the worst class of credential exposure. Never use a
   plaintext-password service account.
   *Verify: `Get-ADServiceAccount mdi-gmsa$ -Properties PrincipalsAllowedToRetrieveManagedPassword`
   returns the sensor host group, nothing wider.*

4. **Deploy sensors in waves** — DC sensors first (highest signal), then AD CS, AD FS, Entra
   Connect. Wait 24 hours between waves to baseline traffic and avoid drowning the SOC in
   first-time-seen activity alerts.

5. **Tune alerts, then act on posture** — Acknowledge benign first-week alerts (admin tooling
   noise), then work the **Identity Security Posture Assessments** (Secure Score panel). Posture
   issues (e.g. *Unsecure account attributes*, *Legacy protocols*, *Dormant accounts*) are the
   weak links attackers exploit before alerts ever fire.
   *Verify: posture score baseline captured at week 1; track delta monthly, not daily.*

6. **Deploy honeytokens** — Plant 1-2 fake high-privilege accounts (e.g. `svc-legacy-backup`)
   that no human should ever touch. Any auth attempt is high-confidence malicious.

7. **Correlate in Defender XDR** — MDI alerts auto-correlate with MDE and Entra ID Protection
   into a single XDR incident. Investigate from the **incident**, not the standalone alert.

## Guardrails
- **Every DC must have a sensor.** A single un-instrumented DC is the lateral-movement landing
  pad attackers will find. RODCs included.
- **Sensor on AD CS is not optional in 2026.** AD CS abuse (ESC1-ESC8) is the most common
  privilege-escalation path in current incident response cases - without the AD CS sensor you
  see the result (Domain Admin) but not the cause.
- **Use a gMSA for the DSA.** Never a regular service account with a static password - it
  becomes the next Kerberoasting target.
- **Tune, don't suppress.** Disabling an alert class to silence noise removes the detection.
  Suppress per-source instead and review monthly.
- **Honeytokens require care.** Place them where reconnaissance tools see them (group
  memberships, descriptions) but document them so the SOC doesn't waste cycles investigating
  legitimate test triggers.

## Common anti-patterns
- **"We'll cover the most important DCs first"** - Attackers pick the un-instrumented one. All
  DCs or none.
- **"We use a domain admin account as the DSA for simplicity"** - Hands attackers a domain
  admin if the sensor host is compromised. Always use gMSA with least privilege.
- **"Posture alerts are not real alerts so we ignore them"** - Posture issues are *pre-attack*
  signals. Working them down is cheaper than responding to the incident they enable.
- **"We didn't deploy the AD CS sensor - we don't issue many certs"** - Issuance volume is
  irrelevant. ESC1/ESC8 misconfigs exist in stock AD CS installs and need monitoring.
- **"MDI alerts go straight to the legacy SIEM, we don't use Defender XDR"** - Loses cross-
  workload correlation. Even if SIEM is primary, keep XDR for the attack graph.

## Example prompts
- `Plan Defender for Identity sensor coverage across DCs, AD CS, AD FS, and Entra Connect.`
- `Which Defender for Identity detections cover the Kerberoasting kill chain?`
- `How do I configure a gMSA Directory Service Account for MDI?`
- `Which Identity Security Posture assessments should I fix first?`
- `Show me how to deploy a honeytoken account in MDI.`
- `Why am I seeing high CPU on a DC after installing the MDI sensor - how do I size it?`

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-for-identity/what-is
- Plan capacity (sizing tool): https://learn.microsoft.com/defender-for-identity/deploy/capacity-planning
- Sensor on AD CS: https://learn.microsoft.com/defender-for-identity/deploy/active-directory-federation-services
- Directory Service Account (gMSA): https://learn.microsoft.com/defender-for-identity/deploy/directory-service-accounts
- Identity Security Posture Assessments: https://learn.microsoft.com/defender-for-identity/security-assessment
- Honeytoken accounts (entity tags): https://learn.microsoft.com/defender-for-identity/entity-tags
- Alerts reference (Kerberoasting, DCSync, Golden Ticket): https://learn.microsoft.com/defender-for-identity/alerts-overview
