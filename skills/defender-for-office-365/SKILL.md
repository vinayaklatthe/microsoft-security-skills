---
name: defender-for-office-365
description: "Guidance for Microsoft Defender for Office 365 (MDO) — protection for email and collaboration (Teams, SharePoint, OneDrive) against phishing, malware, spoofing, and business email compromise. Covers Plan 1 vs Plan 2 selection, preset security policies (Standard/Strict), Safe Links, Safe Attachments, anti-phishing impersonation protection, configuration analyzer drift detection, Submissions portal triage, Threat Explorer hunting, AIR, and attack simulation training. WHEN: Defender for Office 365, MDO, email security policy, Safe Links, Safe Attachments, anti-phishing, anti-spoofing, impersonation protection, preset security policies, Standard preset, Strict preset, configuration analyzer, phishing protection, attack simulation training, Threat Explorer, Submissions portal, tenant allow block list, BEC, business email compromise, DMARC, MDO Plan 1 vs Plan 2. DO NOT USE for endpoint protection (use defender-for-endpoint) or M365 oversharing (use purview-copilot-oversharing)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Office 365

Microsoft Defender for Office 365 (MDO) protects email and collaboration workloads against
phishing, malware, spoofing, and business email compromise. It provides preset policies,
detonation (Safe Attachments), time-of-click URL protection (Safe Links), post-delivery
detection and hunting (Threat Explorer + AIR), and attack simulation training.

## When to use
Securing Exchange Online mail flow and Microsoft 365 collaboration (Teams, SharePoint,
OneDrive). Use this skill for plan/preset decisions, control configuration, drift detection,
and SOC operations on email incidents.

**Do not use this skill** for endpoint protection (`defender-for-endpoint`), broader
cross-workload investigation (`defender-xdr`), or SharePoint oversharing before Copilot
rollout (`purview-copilot-oversharing`).

## Pick the plan, then the preset

| If you need... | Plan / SKU | Notes |
|---|---|---|
| Safe Links, Safe Attachments, anti-phish, anti-spam, anti-malware | **MDO Plan 1** | Bundled with M365 Business Premium and E3 add-on |
| Threat Explorer, Real-time detections, AIR, attack simulation training, automated investigation | **MDO Plan 2** | Bundled with M365 E5 / MDO P2 |
| Cross-tenant secure collaboration (B2B/B2C with MDO) | MDO P1 or P2 | Apply preset to guest senders too |

| Posture | Preset to apply | Who it fits |
|---|---|---|
| Default healthy baseline, low admin overhead | **Standard preset** | Most enterprises - apply to all users |
| High-target, regulated, or executive-heavy estate | **Strict preset** | Tier-0 admins, finance, exec mailboxes |
| Custom carve-out (e.g. vendor with broken SPF) | **Custom policy** with priority above preset | Use sparingly - documents drift risk |

> **Rule of thumb:** apply **Standard preset to all users** as the floor, **Strict preset to
> high-risk groups** (executives, finance, IT admins, legal) as the ceiling. Custom policies
> only where presets genuinely don't fit - every custom policy is a future drift source.

## Approach

1. **Confirm licensing and mail flow** — Verify MDO P1 vs P2 in admin centre. Confirm
   Exchange Online accepts mail directly (or via an upstream gateway). MDO with a third-party
   secure email gateway (SEG) in front is a common pattern but reduces some detections - use
   **Enhanced Filtering for Connectors** to preserve original sender IP.
   *Verify: `Get-EnhancedFilteringConfig` shows your inbound connector configured.*

2. **Enable email authentication** — SPF, DKIM, and DMARC for every sending domain.
   DMARC starts at `p=none` (monitor), moves to `quarantine`, then `reject`. Without DMARC,
   spoofing detections are weaker.
   *Verify: DMARC at `p=reject` with aggregate reports flowing for 30+ days.*

3. **Apply preset security policies** — Standard preset to all users. Strict preset to a
   targeted group (executives, finance, IT admins). Presets auto-update to Microsoft's
   recommendations; custom policies do not.
   *Verify: Preset policy report shows ≥ 95% of users covered by Standard or Strict.*

4. **Configure impersonation protection** — In the anti-phishing policy (Strict preset
   includes this), add the **specific** users (executives, CFO, exec assistants) and **domains**
   (your own, partner domains often impersonated) to impersonation protection. Mailbox
   intelligence on automatically learns the rest.
   *Verify: anti-phishing policy shows 5-15 protected users (don't list everyone - dilutes
   detection) and 1-3 trusted domains.*

5. **Tenant allow/block lists (TABL) - block first, allow rarely** — Use TABL to block
   confirmed bad senders/URLs/files. Allow entries are temporary (30-day max) and override
   detections, so use sparingly and review weekly.
   *Verify: allow list has < 20 entries and no permanent allows for high-risk domains.*

6. **Configuration analyzer monthly** — In security.microsoft.com → Email & collaboration →
   Policies & rules → Configuration analyzer. Shows drift vs Standard/Strict. Apply
   recommendations or document why not.
   *Verify: drift score = 0 against the preset you target.*

7. **Operate via Submissions and Threat Explorer** — User-reported phish flows into the
   **Submissions** portal. Triage daily, mark false positives, update tenant allow/block
   lists. Use **Threat Explorer** (P2) for ad-hoc hunts (e.g. all messages from a sender
   domain in past 7 days).

8. **AIR + automated triage** — Enable AIR for user-reported phish. The investigation
   playbook auto-pulls similar messages, soft-deletes them, and creates an incident if
   warranted.

9. **Attack simulation training** — Run quarterly campaigns matched to current threat
   intelligence (e.g. payroll-themed in pay-week, vendor-themed in procurement cycle).
   Assign training only to clickers and credential submitters - blanket training erodes
   engagement.

## Guardrails
- **Presets > custom policies.** Presets get Microsoft's tuning updates automatically. Every
  custom policy is a maintenance commitment.
- **Don't disable Safe Links rewriting for "user experience".** The rewrite is the
  detection - removing it removes Safe Links entirely. Use the `Do not rewrite` list for
  specific allow-listed services instead.
- **Impersonation protection on a small specific list.** Listing every user dilutes the
  detection. 5-15 named protected users; let mailbox intelligence handle the rest.
- **Allow entries in TABL are temporary.** They override detections. 30-day max, review
  weekly, remove or replace with a proper exclusion.
- **DMARC reject is the goal, not p=none.** `p=none` is a 30-day monitor stop, not a destination.
- **MDO + third-party SEG = configure Enhanced Filtering.** Otherwise MDO sees the SEG IP as
  the sender and detections degrade.
- **Don't bypass MDO with mail flow rules.** Exception rules ("skip filtering for messages
  from X") are how attackers slip through. Use TABL or impersonation exclusions instead.

## Common anti-patterns
- **"Use only custom policies because preset is too strict"** - Locks you out of Microsoft's
  automatic tuning. Apply preset; carve out specific exclusions.
- **"Disable Safe Links rewriting because it breaks the helpdesk link"** - Removes the
  detection. Add the specific URL to `Do not rewrite`.
- **"Allow this vendor domain in TABL permanently"** - Permanent allow = permanent bypass.
  Fix the underlying SPF/DKIM/DMARC issue at the sender or use a connector-level allow.
- **"Add all 5,000 users to impersonation protection"** - Detection becomes noise. Target the
  top-impersonated 10-50 named users.
- **"DMARC at p=none indefinitely"** - You're collecting reports but never enforcing.
  Quarantine within 60 days, reject within 90.
- **"User-reported phish goes to a shared mailbox we check weekly"** - Use the **Submissions**
  portal so AIR and Threat Explorer fire. Shared mailbox loses the tooling.
- **"Attack simulation training assigned to everyone every quarter"** - Engagement collapses.
  Target clickers and credential submitters only.
- **"MDO behind a third-party SEG with default config"** - All inbound looks like it's from
  the SEG IP. Enable Enhanced Filtering for Connectors.

## Example prompts
- `Apply the Standard preset to all users and Strict preset to executives and finance.`
- `Configure DMARC for our domain - go from p=none to p=reject in 90 days.`
- `Set up impersonation protection for our CFO and partner domains.`
- `Compare current MDO settings against the Strict preset using configuration analyzer.`
- `Plan MDO Plan 1 vs Plan 2 - what hunting and AIR capabilities do we lose without P2?`
- `Triage user-reported phish via the Submissions portal and update tenant allow/block list.`
- `Run a payroll-themed attack simulation in pay-week and assign training to clickers only.`
- `Configure Enhanced Filtering for Connectors - we have a third-party SEG in front of EXO.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-office-365/mdo-about
- Plan 1 vs Plan 2: https://learn.microsoft.com/defender-office-365/mdo-deployment-guide
- Preset security policies: https://learn.microsoft.com/defender-office-365/preset-security-policies
- Recommended settings (Standard/Strict): https://learn.microsoft.com/defender-office-365/recommended-settings-for-eop-and-office365
- Configuration analyzer: https://learn.microsoft.com/defender-office-365/configuration-analyzer-for-security-policies
- Safe Links: https://learn.microsoft.com/defender-office-365/safe-links-about
- Safe Attachments: https://learn.microsoft.com/defender-office-365/safe-attachments-about
- Anti-phishing & impersonation: https://learn.microsoft.com/defender-office-365/anti-phishing-mdo-impersonation-insight
- Tenant Allow/Block Lists: https://learn.microsoft.com/defender-office-365/tenant-allow-block-list-about
- DMARC: https://learn.microsoft.com/defender-office-365/email-authentication-dmarc-configure
- Submissions portal: https://learn.microsoft.com/defender-office-365/submissions-admin
- Attack simulation training: https://learn.microsoft.com/defender-office-365/attack-simulation-training-get-started
