---
name: defender-for-office-365
description: "Guidance for Microsoft Defender for Office 365 — protection for email and collaboration (Teams, SharePoint, OneDrive) against phishing, malware, and business email compromise. Covers Safe Links, Safe Attachments, anti-phishing policies, preset security policies, and attack simulation training. WHEN: Defender for Office 365, email security policy, Safe Links, Safe Attachments, anti-phishing, preset security policies, MDO, phishing protection, attack simulation training, Standard or Strict preset."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for Office 365

Microsoft Defender for Office 365 (MDO) protects email and collaboration workloads against
phishing, malware, spoofing, and business email compromise, and provides post-delivery
detection, hunting, and attack simulation training.

## When to use
Securing Exchange Online mail flow and Microsoft 365 collaboration (Teams, SharePoint, OneDrive)
and reducing user-reported phishing.

## Design approach
1. **Plan** — Confirm Plan 1 (Safe Links, Safe Attachments, anti-phishing) vs Plan 2 (adds
   Threat Explorer, automated investigation & response, attack simulation training).
2. **Use preset security policies** — Apply **Standard** or **Strict** presets to get
   Microsoft-recommended, auto-updated baselines instead of hand-tuning every control.
3. **Core controls** — Safe Attachments (detonation), Safe Links (time-of-click URL rewriting
   and detonation), anti-phishing with impersonation and mailbox-intelligence protection,
   anti-spam and anti-malware.
4. **Configuration analyzer** — Compare current settings against Standard/Strict and remediate drift.
5. **Operate** — Use Threat Explorer / Real-time detections, automated investigation & response,
   and the **Submissions** portal for admin/user reported messages and false positives.
6. **Attack simulation training** — Run realistic phishing simulations and assign training.

## Guardrails
- Preset policies take precedence over custom policies — understand ordering before mixing both.
- Maintain tenant allow/block lists carefully; broad allows weaken protection.
- Validate Safe Links doesn't break legitimate automated links via configuration, not blanket bypass.

## Microsoft Learn
- Overview: https://learn.microsoft.com/defender-office-365/mdo-about
- Preset security policies: https://learn.microsoft.com/defender-office-365/preset-security-policies
- Recommended settings (Standard/Strict): https://learn.microsoft.com/defender-office-365/recommended-settings-for-eop-and-office365
- Attack simulation training: https://learn.microsoft.com/defender-office-365/attack-simulation-training-get-started
