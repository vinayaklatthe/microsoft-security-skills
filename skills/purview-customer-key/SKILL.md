---
name: purview-customer-key
description: "Guidance for Microsoft Purview Customer Key and Double Key Encryption (DKE) — customer-controlled encryption for service-side data (Customer Key for Exchange/SharePoint/OneDrive/Teams/Purview) and client-side double encryption for highly sensitive documents (DKE via sensitivity labels and a customer-hosted key service). Covers Azure Key Vault setup (HSM-backed, recoverable, soft-delete, purge protection, redundant regions), data encryption policies (DEPs) for M365 services, key rotation and revocation, DKE service deployment (containerized key release service), DKE label authoring, end-user experience trade-offs (no eDiscovery into DKE content), and decision criteria vs Microsoft-managed encryption. WHEN: Customer Key M365, BYOK Exchange, DKE Microsoft, double key encryption, customer-managed keys SharePoint OneDrive Teams, key rotation Customer Key, HYOK alternative, sovereignty encryption, regulator-controlled encryption, sensitivity label DKE. DO NOT USE for Azure resource CMK (use azure-key-vault), general sensitivity labels (use purview-information-governance), or non-encryption compliance (use compliance-manager)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Customer Key & Double Key Encryption

Microsoft already encrypts M365 data at rest with Microsoft-managed keys. These additional
controls let regulated or sovereignty-sensitive customers hold the keys themselves:

- **Customer Key** — customer-supplied root keys (in Azure Key Vault HSM) wrap service
  data-encryption keys for Exchange, SharePoint, OneDrive, Teams (chats/files), and
  Purview. Revoke the key → Microsoft can no longer decrypt → service-data path crypto-
  shredded.
- **Double Key Encryption (DKE)** — sensitivity-label-driven *client-side* encryption
  where one key is customer-held in a self-hosted key release service. Microsoft never
  sees that key; service-side features (search, eDiscovery, Copilot) cannot read the
  content.

This skill covers both — when to use which, the architectures, and the operational
realities.

## When to use
- Regulatory mandate to hold encryption keys (financial sector sovereignty, defense,
  certain EU public sector).
- Crypto-shredding requirement (provable destruction by key revocation).
- The highest-sensitivity documents that must not be readable by Microsoft or by any
  service-side process even temporarily.

**Do not use this skill** for Azure resource encryption (`azure-key-vault`), generic
sensitivity-label rollout (`purview-information-governance`), or GRC frameworks
(`compliance-manager`).

## Customer Key vs DKE — pick consciously

| Feature | Customer Key | DKE |
|---|---|---|
| Scope | All data in selected M365 services | Per-document, label-driven |
| Encryption point | Service-side, transparent | Client-side, before upload |
| Microsoft can read for service features? | Yes (until key revoked) | No |
| eDiscovery, Search, Copilot, DLP work on content? | Yes | No |
| Key custody | Azure Key Vault HSM (customer subscription) | Customer-hosted key release service (on-prem or your cloud) |
| Crypto-shred via revocation? | Yes (service-wide) | Per-document by destroying key |
| Use case | Sovereignty, blanket regulator demand | Crown-jewel docs only |

> **Rule of thumb:** Customer Key for tenant-wide sovereignty. DKE for the
> 0.1% of documents that must remain opaque even to internal cross-tenant features
> (board minutes, M&A drafts, weapon designs).

## Approach

### Customer Key

1. **Provision Azure Key Vault** in two **separate Azure subscriptions/regions** (paired).
   Mandatory settings:
   - HSM-backed key (RSA 2048+).
   - Soft-delete **on**, purge protection **on** (Customer Key onboarding will refuse
     otherwise).
   - Recovery level: Recoverable+ProtectedSubscription.
   - Diagnostic logs to a dedicated, long-retention Log Analytics workspace.

2. **Create two root keys per service** — one per region. M365 needs both available for
   wrap/unwrap. Losing one is recoverable; losing both is unrecoverable
   crypto-shredding.

3. **Create Data Encryption Policies (DEPs)** per service (Exchange/SharePoint/etc.),
   referencing the two root keys. Assign DEPs to tenant or per-mailbox/site
   (Exchange supports per-mailbox; SharePoint is tenant-wide for the geo).

4. **Rotate keys** annually (or per policy) by adding a new key version; Microsoft
   automatically re-wraps. Never delete the old version while it might be in use.

5. **Revocation runbook (the whole point).** Document exactly: who authorizes, what
   command, who is notified, what the customer-facing impact is. Practice the revocation
   in a non-prod tenant. **A real revocation is the only path to crypto-shredding** —
   ensure governance.

6. **Monitor.** Alert on any change to the Key Vault access policy, key permissions, or
   M365 service principal assignments.

### Double Key Encryption

1. **Decide the document population.** DKE breaks search, DLP, Copilot, eDiscovery on
   those documents. Limit to a small, well-defined set.

2. **Stand up the DKE service.**
   - Containerized .NET service (Microsoft-published image).
   - Hosted in **your** environment (on-prem, AWS, GCP, or Azure outside the M365 tenant).
   - Reachable from end-user clients via HTTPS; client-cert or OAuth to your IdP for
     authorization.
   - HA: at least two regions/AZs. Outage = users can't open DKE-protected documents.

3. **Generate and load keys.** Each DKE label points at a key in the service. Plan for
   per-classification keys, not per-document keys (operational burden).

4. **Author the DKE sensitivity label** in Purview with DKE encryption option and the
   service endpoint URL.

5. **Publish the label** to the target user group (legal, M&A, board, etc.). Users see
   a new label option in Office; applying it triggers client-side encryption via the
   DKE service.

6. **Communicate the trade-offs to users in writing.** No search results, no Copilot
   summaries, no third-party scanning, no automatic transcription of DKE-labeled
   documents.

7. **Backup the DKE keys** with strict custody. Loss of DKE keys = permanent loss of all
   documents protected by that key.

## Guardrails
- **Customer Key + losing both root keys = data loss.** Microsoft cannot recover. Treat
  the keys with the same custody you'd give an HSM root.
- **Soft-delete + purge protection are mandatory and irreversible.** Plan Key Vault
  governance up front.
- **DKE breaks service-side features by design.** Do not promise eDiscovery or Copilot
  on DKE content.
- **DKE service is a hard availability dependency.** Outage = document access outage.
  HA, monitoring, on-call.
- **Customer Key does not encrypt the data on Microsoft's wire any differently** — TLS
  remains the transport. Customer Key is a wrapping-key control, not a transport-
  encryption change.
- **Crypto-shredding via Customer Key revocation affects the whole DEP scope.** It's a
  blunt instrument; coordinate with Legal and customers if multi-tenant.
- **Both controls are premium-licensed.** Confirm SKUs and add-ons before scoping.
- **HYOK (Hold Your Own Key, AD RMS-based)** is the legacy ancestor of DKE; Microsoft's
  forward-looking guidance is DKE. Don't architect new HYOK.

## Common anti-patterns
- **"Customer Key with one Key Vault in one region"** — single failure = service outage.
  Always two regions.
- **"Revoked Customer Key in prod 'to test'"** — caused a tenant-wide service-data
  outage; recovery requires Microsoft engagement. Practice in test tenant only.
- **"DKE on every executive's mailbox"** — eDiscovery requests fail across an entire
  population. Use sparingly.
- **"DKE service in a single VM"** — outage = users can't open the most sensitive docs.
- **"Customer Key marketed internally as 'extra encryption'"** — it's a *key custody*
  control, not stronger crypto. Communicate the actual value (revocation, sovereignty).
- **"DKE keys backed up to an admin's OneDrive"** — defeats the entire model.
- **"Confused Customer Key with Customer Lockbox"** — different products. Customer
  Lockbox = approval for Microsoft engineer access; Customer Key = key custody.

## Example prompts
- `Plan Customer Key rollout for Exchange Online and SharePoint across a multi-geo
  tenant — Key Vault topology and DEP design.`
- `Document the Customer Key revocation runbook with authorization steps and customer
  impact.`
- `Design DKE for board meeting minutes used by 12 directors — service architecture,
  HA, and user comms.`
- `Compare Customer Key vs DKE for a sovereignty requirement from a financial
  regulator.`
- `Key rotation plan for Customer Key with audit evidence for ISO 27001.`
- `Author the DKE label and pilot with 5 users in legal; identify broken workflows.`
- `Cost and operational impact estimate for adopting DKE on 1% of SharePoint content.`

## Microsoft Learn
- Customer Key overview: https://learn.microsoft.com/purview/customer-key-overview
- Customer Key setup: https://learn.microsoft.com/purview/customer-key-set-up
- Data encryption policies: https://learn.microsoft.com/purview/customer-key-manage
- Roll/rotate Customer Key: https://learn.microsoft.com/purview/customer-key-availability-key-roll
- Revoke Customer Key: https://learn.microsoft.com/purview/customer-key-overview
- DKE overview: https://learn.microsoft.com/purview/double-key-encryption
- DKE deploy service: https://learn.microsoft.com/purview/double-key-encryption-setup
- Customer Lockbox (distinct): https://learn.microsoft.com/purview/customer-lockbox-requests
- Service encryption (Microsoft-managed baseline): https://learn.microsoft.com/purview/office-365-service-encryption
