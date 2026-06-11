---
name: paw-design
description: "Guidance for designing Privileged Access Workstations (PAW) and the Microsoft privileged access strategy / enterprise access model. Covers secured workstation tiers, clean source principle, and admin isolation. WHEN: privileged access workstation, PAW, secure admin workstation, enterprise access model, privileged access strategy, admin isolation, secured workstation, clean source, tier 0 protection."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Privileged Access Workstation (PAW) Design

A Privileged Access Workstation (PAW) is a hardened, dedicated device used **only** for
privileged/administrative tasks, isolating sensitive accounts from the risks of everyday
browsing and email. PAWs are a core part of Microsoft's privileged access strategy.

## When to use
Protecting administrators of high-value systems (identity, cloud control planes, domain
controllers — "Tier 0" / control plane) from credential theft and supply-chain risk.

## Approach
1. **Adopt the enterprise access model** — Classify access into planes (control, management,
   data/workload) and protect privileged access end to end (devices, accounts, interfaces,
   intermediaries).
2. **Apply the clean source principle** — Any security dependency must be as trustworthy as the
   object it secures; administer secure systems only from equally secure devices.
3. **Define security levels** — Map roles to **Enterprise**, **Specialized**, and **Privileged**
   device profiles; privileged admins get a dedicated PAW.
4. **Harden the PAW** — Entra-joined, Intune-managed, hardware root of trust, app allowlisting,
   no internet/email browsing, restricted inbound/outbound, credential isolation
   (Windows Hello/FIDO2, Credential Guard).
5. **Enforce with policy** — Use Conditional Access to require the secured device for privileged
   roles; combine with PIM for just-in-time elevation.

## Guardrails
- A PAW must not be used for productivity tasks (email/web) — that defeats its purpose.
- Protect the management and provisioning chain (clean source) — Intune/imaging must be trusted.
- Pair PAW with PIM, phishing-resistant MFA, and dedicated admin accounts.

## Example prompts
- `Design a privileged access workstation (PAW) strategy with the enterprise access model.`
- `How do I isolate admins and protect Tier 0 with secured workstations?`
- `Plan a clean-source PAW deployment for privileged roles.`
- `Sequence a privileged access strategy rollout.`

## Microsoft Learn
- Privileged access strategy: https://learn.microsoft.com/security/privileged-access-workstations/overview
- Enterprise access model: https://learn.microsoft.com/security/privileged-access-workstations/privileged-access-access-model
- Secured workstation devices: https://learn.microsoft.com/security/privileged-access-workstations/privileged-access-devices
- Deploy a PAW: https://learn.microsoft.com/security/privileged-access-workstations/privileged-access-deployment
