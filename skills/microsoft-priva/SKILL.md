---
name: microsoft-priva
description: "Guidance for Microsoft Priva — privacy risk management and subject rights requests. Covers Priva Privacy Risk Management and Priva Subject Rights Requests to find privacy risks and fulfill data subject requests (GDPR/CCPA). WHEN: Microsoft Priva, privacy risk management, subject rights request, DSAR, data subject request, GDPR fulfillment, privacy risk policies, data minimization, overexposed personal data."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Priva

Microsoft Priva helps organisations manage privacy risk and fulfil data subject (privacy) rights
requests for personal data held in Microsoft 365 and beyond. Priva is a **separate SKU** from
Purview - confirm licensing before designing.

## When to use
Use this skill when the user has a privacy programme obligation (GDPR, CCPA, LGPD, UK DPA) and
needs to reduce personal-data risk or respond to subject rights requests at scale.

**Do not use this skill** for security DLP (use `purview-dlp-policy`), eDiscovery for litigation
(use `purview-ediscovery`), or AI prompt data (use `purview-dspm-ai`).

## Pick the right Priva solution

Priva is two distinct solutions sold under one brand. Pick the row that matches the trigger.

| If the goal is... | Solution | Typical first policy |
|---|---|---|
| Find and reduce personal data overexposure across SPO/OneDrive | **Privacy Risk Management — Overexposure** | All-org overexposure of high-confidence personal SITs |
| Stop personal data transfers across borders or departments | **Privacy Risk Management — Transfer** | Cross-region transfer of personal data outside EU |
| Reduce data hoarding (long-retained personal data) | **Privacy Risk Management — Minimisation** | Inactive personal data older than retention obligation |
| Respond to GDPR Article 15 / CCPA Right to Know requests | **Subject Rights Requests (SRR)** | Access request workflow with redaction |
| Fulfil deletion / erasure requests | **SRR (Delete request type)** | Erasure with reviewer approval |
| Send privacy nudges to users producing risky behaviour | **Privacy Risk Management — user notifications** | Inline tip when sharing personal data externally |

> **Rule of thumb:** start with **Privacy Risk Management - overexposure** before SRR. You will
> get more SRRs than you can handle if your tenant is already leaking personal data; fix the
> leak first, then operationalise the request flow.

## Approach

Order matters. Each step gates the next.

1. **Classification prerequisite** — Priva detects personal data using Purview SITs and trainable
   classifiers. Confirm at least the built-in personal-data SITs (national ID, passport, IBAN,
   driving licence, email, phone) match real items in your tenant via *Purview → Content
   Explorer*. Without this, Priva policies fire on nothing or on noise.
   *Verify: Content Explorer shows non-zero hits for at least 3 personal-data SITs relevant to
   your region (e.g. UK NINO, EU national ID, IBAN).*
2. **Confirm licensing** — Priva Privacy Risk Management and Priva Subject Rights Requests are
   **separate add-on SKUs**, not bundled in M365 E5 Compliance. SRR is licensed **per request**
   (paid bundles); Privacy Risk Management is **per-user per-month**. Buy before you build.
   *Verify: portal shows Priva tile under Microsoft 365 admin centre with active SKU.*
3. **Privacy Risk Management — pilot in audit mode** — Create your first overexposure policy in
   *Test mode* on a small site collection for 7-14 days. Review match volume and false-positive
   rate before turning on user notifications or remediation.
4. **User notifications carefully** — When you flip from Test to Active, notifications go to
   users who shared the data. This is your privacy programme talking to your workforce - get
   comms and HR sign-off on the wording first.
5. **Subject Rights Requests workflow** — Configure the SRR template: data sources (Exchange,
   SPO, OneDrive, Teams), reviewers, conflict-of-interest exclusions, redaction reviewer role,
   and secure delivery method. Test with a fake request before publishing the intake form.
   *Verify: a dry-run SRR for a test user returns expected items and the reviewer can redact and
   approve before delivery.*
6. **Report & operate** — Track SRR SLAs (GDPR = 30 days, extendable by 60), policy match
   trends, and user-notification dismissal rate. Feed insights back to the classification team.

## Guardrails
- **Priva depends on classification accuracy.** Deploy after at least basic Purview SITs are
  validated; otherwise policies are noise.
- **Coordinate with legal and privacy office before going live.** SRR fulfilment is a regulated
  process - inadvertent disclosure of third-party personal data inside a response is a breach.
- **Apply least privilege.** SRR content is highly sensitive (the most sensitive in the tenant
  during the request window). Use scoped *Privacy Management* role groups, not Compliance
  Administrator.
- **Reviewer separation of duties.** The reviewer who approves redaction should not be the
  requester or the data subject's manager.
- **SRR delivery format matters.** Default PDF includes metadata; confirm the export format
  meets your regulator's expectations.
- **Test-mode first, always.** Privacy Risk Management policies in Active mode send user
  notifications - false positives erode trust in the privacy programme fast.

## Common anti-patterns
- **"Turn on SRR before classification."** Requests return either nothing or the wrong items;
  you fail SLA on the first real request.
- **"Skip Test mode to ship faster."** First wave of user notifications fires on false
  positives; users learn to dismiss them and the programme dies.
- **"Use Compliance Administrator for the privacy team."** Grants tenant-wide compliance rights
  beyond Priva scope. Use *Privacy Management* role groups.
- **"Build the SRR intake form before testing end-to-end."** First real request exposes a
  reviewer-permission gap or a source-system missing scenario.

## Example prompts
- `Set up Microsoft Priva to manage subject rights requests (DSARs).`
- `Configure privacy risk policies for overexposed personal data.`
- `What licence do I need for Priva Subject Rights Requests?`
- `How do I support GDPR fulfilment and data minimisation with Priva?`
- `Which Priva solution should I roll out first?`
- `Automate DSAR collection and review with Priva.`

## Microsoft Learn
- Priva overview: https://learn.microsoft.com/privacy/priva/priva-overview
- Privacy Risk Management policies: https://learn.microsoft.com/privacy/priva/risk-management-policies
- Subject Rights Requests: https://learn.microsoft.com/privacy/priva/subject-rights-requests
- Get started / setup: https://learn.microsoft.com/privacy/priva/priva-setup
- Roles and permissions: https://learn.microsoft.com/privacy/priva/priva-permissions
- Licensing (Priva & Purview): https://learn.microsoft.com/microsoft-365/solutions/data-privacy-protection
