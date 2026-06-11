---
name: paw-design
description: "Guidance for designing Privileged Access Workstations (PAW) and the Microsoft privileged access strategy (enterprise access model, clean source principle, tiered admin isolation). Covers when to use Enterprise vs Specialized vs Privileged device profiles, hardening (Entra-join, Intune, app allowlisting, Credential Guard), Conditional Access enforcement, and rollout. WHEN: privileged access workstation, PAW, secure admin workstation, enterprise access model, privileged access strategy, admin isolation, secured workstation, clean source principle, tier 0 protection, control plane, dedicated admin device, hardened workstation, Credential Guard, FIDO2 admin. DO NOT USE for general endpoint hardening (use defender-for-endpoint) or device compliance policy (use intune-device-mgmt)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Privileged Access Workstation (PAW) Design

A Privileged Access Workstation (PAW) is a hardened, dedicated device used **only** for
privileged tasks - isolating sensitive accounts from browsing, email, and arbitrary apps.
PAWs are the device pillar of Microsoft's privileged access strategy and the enforcement
point for the **clean source principle**.

## When to use
Protecting administrators of high-value systems (Entra control plane, Azure root, domain
controllers, identity infrastructure - "Tier 0") from credential theft, browser exploit, and
supply-chain attack. Use this skill to choose the device tier, harden the build, and enforce
PAW-only access via CA.

**Do not use this skill** for general endpoint hardening (`defender-for-endpoint`) or
device compliance baseline (`intune-device-mgmt`).

## Pick the device profile by admin tier

The enterprise access model maps admin roles to three device profiles. Wrong tier = either
over-spending or under-protecting.

| Tier | Roles in scope | Device profile | What's allowed |
|---|---|---|---|
| **Privileged (PAW)** | Global Admin, Privileged Auth Admin, Tier 0 Azure Owner, Domain Admin, DC operators | Dedicated hardened device | Admin portals only; no email, no browsing |
| **Specialized** | Workload admins (Exchange, SharePoint, Intune, SQL DBA), Tier 1 Azure Contributor | Hardened build; some productivity | Admin portals + curated productivity (Office) |
| **Enterprise** | Help desk, Tier 2 ops, Reports Reader, Security Reader | Standard managed device + strong baseline | Full productivity with MDE + ASR + tamper protection |

> **Rule of thumb:** the test for "needs a PAW" is **can this account log into a domain
> controller, modify Conditional Access, or assume the root Azure subscription**? If yes,
> PAW. If only managing one workload, Specialized. The PAW population should be small
> (typically < 1% of admins).

## Approach

1. **Adopt the enterprise access model** — Map every privileged role to control / management
   / data plane. Tier 0 = control plane (identity, cloud control plane, on-prem AD). Tier 1
   = workload admins. Tier 2 = ops / read-only. Devices, accounts, and access paths must
   match the tier.
   *Verify: tier mapping document signed off; Tier 0 role count documented.*

2. **Apply the clean source principle** — Any security dependency must be as trustworthy as
   the object it secures. Tier 0 administered only from Tier 0 devices. No "I'll just RDP
   from my laptop this once" - that breaks the model.

3. **Build the PAW image** — Entra-joined (not hybrid where possible), Intune-managed,
   hardware root of trust (TPM 2.0 + UEFI Secure Boot), **app allowlisting** (WDAC or
   AppLocker), **Credential Guard** + **Memory Integrity** on, BitLocker, Defender for
   Endpoint with all ASR rules in block mode, no inbound RDP, restrictive outbound firewall.
   *Verify: WDAC policy enforced (not audit); Credential Guard running (msinfo32).*

4. **Lock down user experience** — No local admin, no email client, no general browsing
   (block via DNS / firewall to non-admin endpoints), Edge restricted to admin portal URLs
   only. No USB storage. No app installs by user.

5. **Enforce via Conditional Access** — CA policy: Tier 0 roles can sign in only from a
   compliant device with the **PAW device filter** (custom attribute). Anything else =
   block. This is the control that makes the PAW non-optional.
   *Verify: CA policy in enforce mode; What If a Tier 0 sign-in from a non-PAW = blocked.*

7. **Pair PAW with PIM, phishing-resistant MFA, and dedicated admin accounts** — PAWs run
   with non-privileged accounts day-to-day; admin credential is FIDO2 + PIM-eligible,
   activated just-in-time for the task.

7. **Pilot 5 PAWs first** — Tier 0 admins are vocal. Hand-deliver, walk through, gather
   friction reports, iterate. Then scale.

## Guardrails
- **A PAW used for productivity is no longer a PAW.** No email, no browsing, no Teams
  chat. Provide a separate Enterprise device for productivity if needed (yes, two devices).
- **Protect the management chain.** Intune and the imaging pipeline are part of the clean
  source. If Intune is administered from non-PAW devices, the PAW model is broken at the
  root.
- **No shared local accounts.** Each admin has their own credential; no shared "PAW user"
  account.
- **CA enforcement is the control.** Without "Tier 0 sign-in requires PAW", admins will
  use their laptops "just this once" and the model collapses.
- **Don't skip Credential Guard.** Without it, Mimikatz-class credential theft is trivial
  on a privileged session.
- **Phishing-resistant MFA only.** SMS / push MFA for PAW sign-in defeats the point.

## Common anti-patterns
- **"We'll use VDI as a PAW"** - VDI hosts that allow productivity workloads are not PAWs.
  The principle is dedicated, not virtual.
- **"PAW deployment in 2 weeks for 200 admins"** - You'll get pushback, miss tier mapping,
  and produce shelf-ware. 5 admins first, iterate, scale over months.
- **"Admins administer Intune from their regular laptop"** - Breaks clean source at the
  root. Intune admin from PAW.
- **"One device for both productivity and admin"** - Single browser exploit = credential
  theft. Two devices for Tier 0.
- **"CA policy in report-only forever"** - Not enforced = not real. Move to On after pilot.
- **"PAW user has local admin so they can install tools"** - Defeats app allowlisting.
  Tools are managed via Intune.

## Example prompts
- `Map our admin roles to PAW, Specialized, and Enterprise device tiers.`
- `Design the PAW image - Entra join, WDAC allowlist, Credential Guard, restricted browsing.`
- `Author the Conditional Access policy that requires PAW for Tier 0 role sign-ins.`
- `Plan a 5-admin PAW pilot before scaling to all Tier 0 roles.`
- `How do I enforce clean source when our imaging server runs on a regular laptop?`
- `Should our Exchange admins get PAWs or Specialized devices?`

## Microsoft Learn
- Privileged access strategy: https://learn.microsoft.com/security/privileged-access-workstations/overview
- Enterprise access model: https://learn.microsoft.com/security/privileged-access-workstations/privileged-access-access-model
- Secured workstation devices: https://learn.microsoft.com/security/privileged-access-workstations/privileged-access-devices
- Deploy a PAW: https://learn.microsoft.com/security/privileged-access-workstations/privileged-access-deployment
- WDAC for PAW: https://learn.microsoft.com/windows/security/application-security/application-control/app-control-for-business/appcontrol
- Credential Guard: https://learn.microsoft.com/windows/security/identity-protection/credential-guard/
- Conditional Access device filters: https://learn.microsoft.com/entra/identity/conditional-access/concept-condition-filters-for-devices
