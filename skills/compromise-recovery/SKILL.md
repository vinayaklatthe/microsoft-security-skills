---
name: compromise-recovery
description: "Guidance for responding to and recovering from a significant identity/tenant compromise — regaining administrative control, evicting the adversary, and hardening to prevent reentry. Covers containment, eviction, and rebuild of trust. WHEN: compromise recovery, incident response, regain control after breach, evict attacker, tenant compromise, rebuild trust, ransomware recovery, post-breach hardening, kick out adversary, emergency response, we got hacked, attacker is in our tenant right now, how do I kick out an attacker, ransomware hit our organisation, how do I regain admin access after a breach, adversary has domain admin."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Compromise Recovery

Compromise recovery is the disciplined process of regaining administrative control of an
environment during/after a significant breach, **evicting the adversary**, and re-establishing a
trustworthy security posture so the attacker cannot return.

## When to use
Responding to a confirmed widespread compromise (e.g., domain/tenant-wide, ransomware, persistent
adversary) where normal remediation is insufficient.

## Approach
1. **Establish a trusted foundation** — Stand up secure communications and admin devices (PAWs);
   assume existing infrastructure may be untrusted.
2. **Contain** — Limit the adversary's ability to act: protect/rotate privileged credentials,
   tighten Conditional Access, disable suspicious accounts and tokens, and revoke sessions.
3. **Evict** — Coordinate a decisive removal of attacker persistence (accounts, app registrations/
   consent grants, mailbox rules, scheduled tasks, golden/forged tickets) — ideally in a
   coordinated action rather than piecemeal, to avoid tipping off the adversary.
4. **Recover identity** — Reset the **krbtgt** account, privileged credentials, and federation/
   signing secrets as applicable; rebuild trust in identity systems.
5. **Harden (prevent reentry)** — Enforce MFA/phishing-resistant auth, least privilege/PIM, secure
   admin workstations, and deploy/expand Defender + Sentinel monitoring.
6. **Transition to BAU** — Hand off to a sustained security operations and improvement program.

## Guardrails
- Engage qualified incident responders (e.g., Microsoft Incident Response) for major incidents.
- Sequence eviction carefully — partial eviction warns the adversary and invites re-entrenchment.
- Preserve forensic evidence before remediating where investigation is required.

## Example prompts
- `We believe an attacker has Global Admin in our tenant — what are the immediate steps?`
- `Walk me through the Microsoft incident response process for a ransomware attack.`
- `How do I evict an adversary from an Entra ID tenant without tipping them off?`
- `What should I do in the first 24 hours after discovering a tenant compromise?`
- `How do I rebuild trust in our admin accounts after a breach?`

## Microsoft Learn
- Recover from systemic identity compromise: https://learn.microsoft.com/security/operations/incident-response-playbooks
- Protect against ransomware: https://learn.microsoft.com/security/ransomware/
- Privileged access strategy: https://learn.microsoft.com/security/privileged-access-workstations/overview
