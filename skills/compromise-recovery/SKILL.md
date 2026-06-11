---
name: compromise-recovery
description: "Guidance for responding to and recovering from a significant identity/tenant compromise - regaining administrative control, evicting the adversary in a single coordinated action, and hardening to prevent reentry. Covers trusted foundation (PAW), containment, eviction, identity recovery (krbtgt, federation), and post-eviction hardening. WHEN: compromise recovery, incident response, regain control after breach, evict attacker, tenant compromise, rebuild trust, ransomware recovery, post-breach hardening, kick out adversary, emergency response, attacker is in our tenant right now, ransomware hit our organisation, regain admin access after a breach, adversary has domain admin or Global Admin. DO NOT USE for routine SOC investigation (use defender-xdr / sentinel) or for preventive hardening with no active compromise (use security-architecture / entra-id)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Compromise Recovery

Compromise recovery is the disciplined process of regaining administrative control of an
environment during or after a significant breach, **evicting the adversary in a single
coordinated action**, and re-establishing a trustworthy security posture so the attacker
cannot return.

## When to use
Responding to a confirmed widespread compromise - tenant-wide Entra/AD compromise, ransomware,
persistent adversary with Global Admin or Domain Admin - where normal remediation is
insufficient and the existing infrastructure cannot be trusted.

**Do not use this skill** for:
- Routine alert triage or single-host malware (use `defender-xdr`)
- Pre-incident architecture hardening (use `security-architecture`, `entra-id`, `paw-design`)
- Sentinel hunting and detection engineering (use `sentinel`)

## Decide what stage you are at

| Situation | Stage | First action |
|---|---|---|
| Anomalies detected, not yet confirmed scope | **Investigate** | Hunt + preserve evidence, do not tip off |
| Adversary confirmed, scope still expanding | **Contain** | Stand up trusted foundation (PAW), protect crown jewels |
| Adversary scope known, ready to remove | **Evict** | Single coordinated action across all persistence |
| Adversary removed, validating no re-entry | **Recover** | Reset krbtgt, federation secrets, privileged creds |
| Stable, hardening to prevent recurrence | **Harden** | MFA-everywhere, PIM, PAW, monitoring expansion |
| Hardening complete, back to BAU | **Transition** | Hand off to sustained SecOps + improvement |

> **Rule of thumb:** **Never start eviction from the compromised environment.** Stand up a
> trusted foundation first - dedicated admin workstations (PAW), out-of-band communications,
> a clean Entra tenant or cleanly-rebuilt admin accounts. Acting from untrusted infrastructure
> hands the adversary your response plan in real time.

## Approach

1. **Engage qualified incident responders immediately** - For major incidents, engage Microsoft
   Incident Response or a qualified DFIR partner. The cost of delay (re-entry, ransomware
   double-extortion, regulator timelines) dwarfs the engagement cost.
   *Verify: an IR partner is engaged within the first 24 hours of confirmed compromise.*
2. **Establish a trusted foundation** - Stand up out-of-band communications (separate Teams
   tenant, signal/voice), secure admin devices (**PAWs**), and a clean admin identity path.
   Assume existing infrastructure - mail, chat, jump hosts, admin accounts - may be untrusted
   or monitored by the adversary.
   *Verify: incident bridge is on out-of-band channel; responders authenticate from PAW or
   equivalent isolated workstation; no compromised admin account is used.*
3. **Preserve forensic evidence before remediating** - Snapshot affected systems, export sign-
   in logs, audit logs, mail items, and Entra/AD changes. Once you remediate you lose
   evidence; regulators and insurers will ask for it.
   *Verify: forensic acquisitions are stored on isolated, write-protected media with chain of
   custody documented.*
4. **Contain without tipping off** - Limit the adversary's ability to act: protect crown
   jewels (privileged accounts, federation/signing keys, backup credentials), tighten
   Conditional Access in stealth mode where possible, monitor known adversary accounts without
   blocking them yet. **Partial eviction warns the adversary** and invites re-entrenchment
   under a new identity.
   *Verify: containment actions are recorded in a sequenced runbook, not ad-hoc; nothing
   visible to the adversary has changed unless deliberate.*
5. **Evict in a single coordinated action** - Plan a sequenced removal across all known
   persistence: compromised accounts (disable + reset), app registrations and consent grants
   (review and revoke), mailbox rules and forwarding (delete), scheduled tasks / startup
   items, golden/forged Kerberos tickets, federation/SAML tokens, any added admin roles. Aim
   for one decisive action window rather than **piecemeal** changes.
   *Verify: an eviction runbook lists every persistence artefact with owner, time, and
   verification step; rehearsed before execution.*
6. **Reset identity trust** - Reset the **krbtgt** account (twice, with sufficient interval
   for replication), reset all privileged credentials, rotate federation/SAML signing
   certificates, rotate Entra Connect sync account, and reset any service principal secrets
   the adversary could have touched.
   *Verify: krbtgt reset is logged twice; federation cert rollover is complete; sign-in logs
   show no remaining sessions from compromised tokens.*
7. **Harden to prevent reentry** - Enforce **phishing-resistant** MFA on all privileged and
   high-risk users, move privileged roles into **PIM** with just-in-time activation and
   approvals, deploy or expand PAW for admin work, expand Defender + Sentinel monitoring with
   detections tuned to the observed adversary TTPs, and apply the **least privilege** model
   across the privileged tier.
   *Verify: 100% of privileged accounts in PIM and behind phishing-resistant MFA; named PAW
   estate for admin work; new detections deployed for the specific TTPs seen.*
8. **Transition to BAU** - Hand off to a sustained security operations and improvement
   programme with a 90-day watch period, a documented lessons-learned, and committed
   investment in the gaps that allowed initial compromise.

## Guardrails
- **Engage qualified incident responders** (e.g. Microsoft Incident Response) for any major
  incident. This is not a self-service exercise above a certain threshold.
- **Sequence eviction carefully** - partial eviction warns the adversary and invites re-
  entrenchment. Plan, rehearse, then execute as one action.
- **Preserve forensic evidence before remediating** where investigation, regulatory, or
  insurance obligations apply. Wiping is destruction of evidence.
- **Never act from compromised infrastructure** - establish a **trusted foundation** and
  **PAW** before touching the adversary's territory.
- **Reset krbtgt twice** with replication interval between resets - a single reset still
  leaves valid golden tickets in flight.
- **MFA without phishing-resistant factors is not enough** post-AiTM-era. Move privileged
  users to FIDO2 / Windows Hello for Business / certificate-based auth.
- **PIM and least privilege are post-eviction non-negotiables** - if the adversary got in via
  standing privilege, removing standing privilege is the eviction.

## Common anti-patterns
- **Piecemeal eviction.** Disabling one compromised account tips off the adversary, who pivots
  to the next persistence and digs deeper. Plan and execute as one coordinated action.
- **Acting from the compromised admin workstation.** The adversary watches the response in
  real time and adapts. Always operate from PAW or equivalent.
- **Skipping krbtgt reset** because "the password changed". krbtgt is the AD trust root - if
  it was harvested, every Kerberos ticket is forged-capable until reset (twice).
- **Forgetting service principals and app registrations.** Modern Entra compromises persist
  via consent grants and app secrets long after user accounts are reset.
- **Declaring victory too early.** Without a 90-day watch period and new detections tuned to
  the observed TTPs, you will not see the re-entry attempt.
- **No lessons learned, no investment commitment.** The compromise will recur if the root
  cause (weak MFA, no PIM, flat network, no PAW) is not funded for remediation.

## Example prompts
- `An attacker has Global Admin in our tenant right now. Walk me through evicting them.`
- `Walk me through the Microsoft incident response process for a ransomware attack.`
- `How do I evict an adversary from an Entra ID tenant without tipping them off?`
- `What should I do in the first 24 hours after discovering a tenant compromise?`
- `How do I harden the tenant after eviction so the attacker cannot return?`
- `How do I rebuild trust in our admin accounts after a breach?`

## Microsoft Learn
- Incident response playbooks: https://learn.microsoft.com/security/operations/incident-response-playbooks
- Protect against ransomware: https://learn.microsoft.com/security/ransomware/
- Privileged access strategy: https://learn.microsoft.com/security/privileged-access-workstations/overview
- Microsoft Incident Response: https://www.microsoft.com/security/business/microsoft-incident-response
- Phishing-resistant MFA methods: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths
