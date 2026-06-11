---
name: entra-id-protection
description: "Guidance for Microsoft Entra ID Protection — risk-based identity security that detects user and sign-in risk and automates remediation. Covers risk detections, risk-based Conditional Access, self-remediation via MFA / secure password change, risky-user investigation, and streaming risk to Sentinel. WHEN: Entra ID Protection, identity risk policy, risky users, risky sign-ins, user risk policy, sign-in risk policy, risk-based Conditional Access, leaked credentials, anonymous IP detection, atypical travel, automate identity remediation, alert about leaked credentials, user flagged as risky, force password reset for compromised accounts, block sign-in when identity risk is high, EID P2 risk policy. DO NOT USE for on-prem AD attack detection (use defender-for-identity), CA policy authoring without risk signals (use conditional-access-mfa), or PIM activation (use azure-pim)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra ID Protection

Microsoft Entra ID Protection uses Microsoft's threat intelligence and ML to detect identity
risk (user risk and sign-in risk), automate remediation, and surface a queue of risky users
and sign-ins for investigation. Requires **Entra ID P2** to enable risk policies.

## When to use
Adding risk-based, adaptive protection on top of Entra ID and Conditional Access. Use this skill
to choose risk thresholds, decide between self-remediation and SOC investigation, and stream
signals to Sentinel.

**Do not use this skill** for on-prem AD attack detection (`defender-for-identity`), authoring
plain CA policies (`conditional-access-mfa`), or PIM activation (`azure-pim`).

## Map the risk signal to the response

| Risk type | Examples | Recommended response |
|---|---|---|
| **Sign-in risk** (this request) | Anonymous IP, atypical travel, malware-linked IP, unfamiliar sign-in properties | Risk-based CA → require MFA |
| **User risk** (this identity) | Leaked credentials (TI feeds), Microsoft / partner-reported compromise | Risk-based CA → require secure password change |
| Both medium+ on same user | Active session takeover indicators | Block + force secure password change + analyst review |

> **Rule of thumb:** start risk policies at **High** threshold, run for 30 days, then expand to
> **Medium** once user registration and remediation flows are proven. Starting at Medium without
> SSPR + MFA registration causes lockouts.

## Approach

1. **Confirm prerequisites** — Entra ID P2 licensing, MFA + SSPR registration enforced for the
   target user scope (registration policy in Authentication methods).
   *Verify: `Authentication methods activity` report shows > 95% of in-scope users registered
   for at least one strong method.*

2. **Use risk-based Conditional Access, not legacy built-in risk policies** — Author CA
   policies with **Sign-in risk** and **User risk** conditions. Legacy "User risk policy" /
   "Sign-in risk policy" toggles are deprecated in favour of CA.
   *Verify: no legacy risk policies enabled; risk conditions appear in CA What-If results.*

3. **Tier 1 - High risk only** — First policy set: High sign-in risk → require MFA; High user
   risk → require secure password change. Exclude break-glass accounts from every risk policy.
   *Verify: report-only for 14 days shows < 5 false positives per 1,000 sign-ins before
   enforcing.*

4. **Tier 2 - Medium expansion** — After 30 days of clean Tier 1 metrics, expand to Medium
   sign-in risk → MFA. Don't extend user risk to Medium without an analyst review queue.

5. **Investigate the queue** — Triage **Risky users**, **Risky sign-ins**, **Risk detections**
   daily. Confirm compromise (forces remediation + trains the model) or dismiss false positives.
   Never bulk-dismiss without review - dismisses teach the model wrong signal.
   *Verify: weekly risky-user queue < 1% of monthly active users in a healthy tenant.*

6. **Stream to Sentinel** — Diagnostic settings → send `RiskyUsers`, `UserRiskEvents`,
   `RiskyServicePrincipals` to a Log Analytics workspace. Correlate with MDI and MDE in
   Defender XDR incidents.

## Guardrails
- **Break-glass accounts excluded from every risk policy.** A leaked-credential detection on
  the wrong account can lock you out of the tenant.
- **MFA + SSPR registration first.** Self-remediation only works when users can complete it.
  Without registration, risk policies become lockouts.
- **Start at High, expand to Medium.** Medium thresholds without tuning generate noise and
  user friction.
- **Don't dismiss bulk false positives.** Dismiss = "this was safe" which trains the model.
  Use confirm-safe / confirm-compromise deliberately, not as a queue cleanup tool.
- **Workload identity risk is separate.** Service principals have their own risk detections
  - cover them with a parallel policy.

## Common anti-patterns
- **"Use the legacy User risk / Sign-in risk policy toggles"** - Deprecated. Use CA risk
  conditions which support broader controls and exclusions.
- **"Risk policy on All users at Medium on day one"** - Lockout event. Pilot at High first.
- **"Bulk-dismiss the risky user queue weekly to clear noise"** - Trains the detector
  incorrectly and erodes future precision.
- **"Risk events stay in Entra portal"** - No SOC correlation. Stream to Sentinel and
  Defender XDR.

## Example prompts
- `Configure risk-based Conditional Access for sign-in risk and user risk in Entra ID Protection.`
- `Set up self-remediation - MFA for sign-in risk, secure password change for user risk.`
- `Investigate a user flagged as risky and confirm compromise or dismiss safely.`
- `Stream Entra ID Protection risk events to Sentinel for SOC correlation.`
- `Why are we getting too many medium-risk alerts - how do I tune?`

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/id-protection/overview-identity-protection
- Risk policies (deprecation note): https://learn.microsoft.com/entra/id-protection/concept-identity-protection-policies
- Risk-based Conditional Access: https://learn.microsoft.com/entra/id-protection/howto-identity-protection-configure-risk-policies
- Investigate risk: https://learn.microsoft.com/entra/id-protection/howto-identity-protection-investigate-risk
- Risk detections reference: https://learn.microsoft.com/entra/id-protection/concept-identity-protection-risks
- Stream to Sentinel: https://learn.microsoft.com/entra/id-protection/howto-export-risk-data
