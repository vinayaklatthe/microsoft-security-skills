---
name: purview-records-management
description: "Guidance for Microsoft Purview Records Management — declaring, managing, and disposing records across SharePoint, OneDrive, Exchange, and Teams. Covers retention labels with record / regulatory record options, file plan import, event-based retention (employee leaves, contract expires), disposition review (single- and multi-stage), proof of deletion / records of disposition, retention label policies vs auto-apply policies (KQL/sensitive info types/trainable classifiers), label-aware DLP, integration with Information Governance vs Records Management licensing, and role separation between records managers and admins. WHEN: records management Purview, file plan, retention label record, regulatory record, event-based retention, disposition review, record declaration SharePoint, immutable records, audit-proof deletion, file plan import. DO NOT USE for non-records data lifecycle (use purview-data-lifecycle), DLP policies (use purview-dlp-policy), or eDiscovery (use purview-ediscovery)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Purview Records Management

Records Management is the formal, auditable side of data lifecycle in Microsoft 365.
Where general retention manages bulk data lifecycle, **Records Management** declares
specific content as a **record** (cannot be modified or deleted) or **regulatory record**
(immutable, no label change allowed once applied) and produces **proof of disposition** —
the artefact regulators and auditors actually ask for.

## When to use
You have legal, regulatory, or industry obligations (SEC 17a-4, GxP, GDPR Article 30,
public-sector records acts) that require provable record retention and defensible
disposition workflows.

**Do not use this skill** for general retention without record declaration
(`purview-data-lifecycle`), DLP (`purview-dlp-policy`), or eDiscovery
(`purview-ediscovery`).

## Retention label flavors — pick deliberately

| Label option | Mutability | Disposition |
|---|---|---|
| Retention only (no record) | Editable | Auto-delete or do nothing |
| **Record** | Locked from edits/deletes; admin can unlock | Disposition review optional |
| **Regulatory record** | Fully immutable; label cannot be removed even by admin | Always disposition-reviewed |
| Unlock the record (admin action) | Reverts to standard label | — |

> **Rule of thumb:** Use **regulatory record** only where the regulation truly demands
> WORM-style immutability (broker-dealer, life sciences GxP). Otherwise **record** is
> usually right — same protection, with an admin-unlock break-glass.

## Approach

1. **Get the file plan first.** Records Management without a file plan is just labels
   sprawled across SharePoint. Source the file plan from Legal/Records team — typically
   a CSV with: label name, description, retention period, trigger (creation date / last
   modified / event), record/regulatory record flag, disposition action, business unit.
   Import via file plan manager.

2. **Define events** for event-based retention. Common events:
   - Employee separation (HRIS connector or scripted Graph trigger).
   - Contract expiry (CLM system event).
   - Project closure.
   - Product end-of-life.
   Events fire via Microsoft Graph or the compliance UI; retention countdown begins on
   event date.

3. **Publish vs auto-apply retention label policies.**
   - **Publish** = label appears in user pickers; users tag content. Use for SharePoint
     document libraries with known content classes.
   - **Auto-apply** = system applies based on KQL, sensitive info types, or trainable
     classifiers. Use for high-volume / known-pattern content (invoices, contracts).

4. **Pilot in a single SharePoint site / mailbox set.** Validate that:
   - Labeled documents lock as expected.
   - Edit attempts are blocked.
   - Co-author scenarios (Teams files) still work.
   - Retention countdown matches plan.

5. **Disposition review.** For records nearing end-of-retention, the **Disposition**
   queue presents items to reviewers (single or multi-stage). Reviewers can: dispose
   (delete with audit), relabel (extend retention), or hold (pending litigation). Records
   of disposition are retained — that's the audit artefact.

6. **Role separation.**
   - **Records Management** role group: file plan, labels, disposition decisions.
   - **Compliance Administrator**: configures the service, not the records.
   - **Reviewer (Disposition)**: per-label disposition reviewers.
   Records managers should not be tenant Global Admins.

7. **Reporting + audit.** Pull disposition reports monthly. Stream to Sentinel or a
   compliance system of record. Maintain the chain of custody artefact.

8. **Integrate with eDiscovery and Information Barriers.** Records can still be subject
   to legal hold; Information Barriers don't override retention. Confirm precedence
   rules with Legal.

## Guardrails
- **Records Management is a separately licensed add-on** (Microsoft 365 E5 Compliance /
  E5 Information Protection & Governance). Confirm licensing per-user — auto-apply on
  unlicensed users silently fails.
- **Regulatory record is irreversible.** Once a doc is labeled regulatory record, no
  one — including a tenant Global Admin — can change or remove the label. Pilot with
  test content only.
- **Event-based retention needs a reliable event source.** Don't fire termination
  events from a flaky integration; you'll over-retain or under-retain forever.
- **Don't auto-apply records broadly with weak KQL.** Mass-labeling production sites as
  records bricks the user experience (no edits).
- **Co-authoring + record label combinations have caveats.** Test in Teams/SharePoint
  before mass rollout.
- **Disposition queues need owners.** Without active reviewers, items sit at end-of-
  retention indefinitely, defeating the disposition story.
- **Retention wins over deletion.** A user "deleting" a record just hides it from view;
  it's preserved in the preservation hold library. Set expectations.
- **Don't conflate retention and backup.** Retention preserves the live data in M365;
  it's not a tenant restore plan.

## Common anti-patterns
- **"Imported file plan with 800 labels"** — users see a giant picker, label nothing
  correctly. Start with the 10-20 most important records.
- **"Used regulatory record by default 'to be safe'"** — operational nightmare on first
  mistake.
- **"Auto-apply records via 'contains the word contract'"** — labels every email
  signature mentioning contracts as a record. Use sensitive info types or trainable
  classifiers.
- **"Disposition queue ignored for 12 months"** — retention extended by default; audit
  finding.
- **"Records Management admin = Global Admin"** — segregation-of-duties violation in
  regulated industries.
- **"Skipped event-based retention because 'all records use creation date'"** — over-
  retention on long-tail content; cost and risk.
- **"Records Management used for backup"** — wrong tool; restore scenarios still need
  proper backup.

## Example prompts
- `Roll out Purview Records Management for SEC 17a-4 compliance with 6-year regulatory
  record retention on broker communications.`
- `Import a 60-label file plan from the records team and pilot on 3 SharePoint sites.`
- `Configure event-based retention: employee separation from Workday triggers a 7-year
  HR records hold.`
- `Design the disposition review workflow with 2-stage approvals: business owner then
  records manager.`
- `Compare retention label, record, and regulatory record for our contract management
  scenario.`
- `Integrate Records Management with our existing eDiscovery Premium holds for active
  litigation matters.`
- `Build the audit-of-disposition export to feed our GRC system monthly.`

## Microsoft Learn
- Records Management overview: https://learn.microsoft.com/purview/records-management
- Records vs regulatory records: https://learn.microsoft.com/purview/get-started-with-records-management
- File plan: https://learn.microsoft.com/purview/file-plan-manager
- Event-based retention: https://learn.microsoft.com/purview/event-driven-retention
- Auto-apply policies: https://learn.microsoft.com/purview/apply-retention-labels-automatically
- Disposition: https://learn.microsoft.com/purview/disposition
- Disposition reviewers: https://learn.microsoft.com/purview/disposition#stages-of-disposition
- Compliance role groups: https://learn.microsoft.com/purview/microsoft-365-compliance-center-permissions
- Licensing: https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance
