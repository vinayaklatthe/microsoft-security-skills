---
name: microsoft-priva
description: "Guidance for Microsoft Priva and privacy operations in Microsoft 365 — Priva Privacy Risk Management (overexposure, transfer, minimisation policies) and data subject request (DSAR) fulfilment. Priva Subject Rights Requests was retired on May 9, 2026; DSARs are now handled in Microsoft Purview eDiscovery (Premium). Covers choosing the right tool, classification prerequisites, licensing, migrating off Priva SRR, and privacy-safe DSAR workflows (GDPR/CCPA). WHEN: Microsoft Priva, privacy risk management, subject rights request, DSAR, data subject request, Priva SRR retirement, migrate Priva subject rights requests, GDPR fulfillment, privacy risk policies, data minimization, overexposed personal data."
license: MIT
metadata:
  author: Microsoft
  version: "0.2.0"
---

# Microsoft Priva

Microsoft Priva helps organisations find and reduce privacy risk in personal data held in
Microsoft 365. Priva is a **separate SKU** from Purview - confirm licensing before designing.

> **Retirement notice:** **Priva Subject Rights Requests (SRR) was retired on May 9, 2026.**
> New subject rights requests can't be created in Priva. Handle data subject requests (DSARs)
> with **Microsoft Purview eDiscovery (Premium)** cases. Priva **Privacy Risk Management**
> remains available.

## When to use
Use this skill when the user has a privacy programme obligation (GDPR, CCPA, LGPD, UK DPA) and
needs to reduce personal-data risk or respond to subject rights requests at scale.

**Do not use this skill** for security DLP (use `purview-dlp-policy`), eDiscovery for litigation
(use `purview-ediscovery`), or AI prompt data (use `purview-dspm-ai`).

## Pick the right tool

| If the goal is... | Use | Typical first policy / step |
|---|---|---|
| Find and reduce personal data overexposure across SPO/OneDrive | **Priva Privacy Risk Management — Overexposure** | All-org overexposure of high-confidence personal SITs |
| Stop personal data transfers across borders or departments | **Priva Privacy Risk Management — Transfer** | Cross-region transfer of personal data outside EU |
| Reduce data hoarding (long-retained personal data) | **Priva Privacy Risk Management — Minimisation** | Inactive personal data older than retention obligation |
| Send privacy nudges to users producing risky behaviour | **Priva Privacy Risk Management — user notifications** | Inline tip when sharing personal data externally |
| Respond to GDPR Article 15 / CCPA Right to Know requests (DSAR) | **Purview eDiscovery (Premium)** case per request | Search the data subject's identifiers, review, redact, export |
| Fulfil deletion / erasure requests | **Purview eDiscovery (Premium)** to locate + retention/deletion tooling to act | Locate items, legal review, then delete under a documented process |
| Still have open requests in Priva SRR | **Migrate to eDiscovery (Premium)** | Recreate open requests as eDiscovery cases; export completed SRR evidence for records |

> **Rule of thumb:** start with **Privacy Risk Management - overexposure** before scaling DSAR
> operations. You will get more DSARs than you can handle if your tenant is already leaking
> personal data; fix the leak first, then operationalise the request flow.

## Approach

Order matters. Each step gates the next.

1. **Classification prerequisite** — Priva and eDiscovery both depend on Purview SITs and
   trainable classifiers to find personal data. Confirm at least the built-in personal-data SITs
   (national ID, passport, IBAN, driving licence, email, phone) match real items in your tenant
   via *Purview → Content Explorer*. Without this, policies and DSAR searches fire on nothing or
   on noise.
   *Verify: Content Explorer shows non-zero hits for at least 3 personal-data SITs relevant to
   your region (e.g. UK NINO, EU national ID, IBAN).*
2. **Confirm licensing** — Priva Privacy Risk Management is a **separate add-on SKU**
   (per-user per-month), not bundled in M365 E5 Compliance. DSAR handling now requires
   **eDiscovery (Premium)** licensing (Microsoft 365 E5 / E5 Compliance / eDiscovery & Audit
   add-on) for the users whose content is searched. There are no more per-request Priva SRR
   bundles. Buy before you build.
3. **Privacy Risk Management — pilot in Test mode** — Create your first overexposure policy in
   *Test mode* on a small site collection for 7-14 days. Review match volume and false-positive
   rate before turning on user notifications or remediation.
4. **User notifications carefully** — When you flip from Test to Active, notifications go to
   users who shared the data. This is your privacy programme talking to your workforce - get
   comms and HR sign-off on the wording first.
5. **DSAR workflow in eDiscovery (Premium)** — Define a case template/runbook: one case per
   request, data sources (Exchange, SPO, OneDrive, Teams), search by the data subject's
   identifiers, review set with tagging, **redaction of third-party personal data**, reviewer
   approval, and secure export/delivery. If you used Priva SRR, migrate open requests and
   archive completed request evidence before decommissioning the Priva SRR process.
   *Verify: a dry-run DSAR case for a test user returns expected items and the reviewer can
   redact and approve before export.*
6. **Report & operate** — Track DSAR SLAs (GDPR = 30 days, extendable by 60), policy match
   trends, and user-notification dismissal rate. Feed insights back to the classification team.

## Guardrails
- **Priva depends on classification accuracy.** Deploy after at least basic Purview SITs are
  validated; otherwise policies are noise.
- **Coordinate with legal and privacy office before going live.** DSAR fulfilment is a regulated
  process - inadvertent disclosure of third-party personal data inside a response is a breach.
- **Apply least privilege.** DSAR content is highly sensitive (the most sensitive in the tenant
  during the request window). Use scoped role groups (*Privacy Management* for Priva, a
  dedicated eDiscovery role group limited to DSAR cases) - not Compliance Administrator or
  eDiscovery Administrator for everyone.
- **Reviewer separation of duties.** The reviewer who approves redaction should not be the
  requester or the data subject's manager.
- **Export format matters.** Confirm the export format and metadata included meet your
  regulator's expectations before the first real response.
- **Test-mode first, always.** Privacy Risk Management policies in Active mode send user
  notifications - false positives erode trust in the privacy programme fast.

## Common anti-patterns
- **"Keep using Priva SRR."** Retired May 9, 2026 - new requests can't be created. Move DSARs to
  eDiscovery (Premium).
- **"Run DSARs before classification."** Searches return either nothing or the wrong items;
  you fail SLA on the first real request.
- **"Skip Test mode to ship faster."** First wave of user notifications fires on false
  positives; users learn to dismiss them and the programme dies.
- **"Use Compliance Administrator for the privacy team."** Grants tenant-wide compliance rights
  beyond scope. Use *Privacy Management* role groups and scoped eDiscovery role groups.
- **"Publish the DSAR intake form before testing end-to-end."** First real request exposes a
  reviewer-permission gap or a source-system missing scenario.

## Example prompts
- `Set up a DSAR (subject rights request) process now that Priva SRR is retired.`
- `Migrate our open Priva Subject Rights Requests to Purview eDiscovery (Premium).`
- `Configure privacy risk policies for overexposed personal data.`
- `What licence do I need for subject rights requests after the Priva SRR retirement?`
- `How do I support GDPR fulfilment and data minimisation with Priva and Purview?`
- `Which Priva solution should I roll out first?`

## Microsoft Learn
- Priva overview: https://learn.microsoft.com/privacy/priva/priva-overview
- Privacy Risk Management: https://learn.microsoft.com/privacy/priva/risk-management
- Privacy Risk Management policies: https://learn.microsoft.com/privacy/priva/risk-management-policies
- Get started / setup and permissions: https://learn.microsoft.com/privacy/priva/priva-setup
- eDiscovery (Premium) overview (DSAR handling): https://learn.microsoft.com/purview/edisc
- Manage eDiscovery cases: https://learn.microsoft.com/purview/edisc-cases-manage
- GDPR data subject requests for Microsoft 365: https://learn.microsoft.com/compliance/regulatory/gdpr-dsr-office365
