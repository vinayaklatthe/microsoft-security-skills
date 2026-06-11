---
name: conditional-access-mfa
description: "Guidance for Microsoft Entra Conditional Access (CA) and multifactor authentication — the Zero Trust policy engine that enforces grant/block decisions based on user, device, location, app, and risk signals. Covers a baseline 6-policy set, authentication strengths for phishing-resistant MFA, report-only rollout, break-glass exclusions, session controls, and policy lifecycle. WHEN: Conditional Access, MFA enforcement, require compliant device, block legacy authentication, Zero Trust access policy, phishing-resistant MFA, FIDO2, passkey, session controls, sign-in frequency, CA policy design, require MFA for admins, baseline CA policies, report-only mode, What If tool, exclude break-glass, named locations, app protection policy grant, terms of use. DO NOT USE for risk-based detection signal sources (use entra-id-protection) or PIM activation (use azure-pim)."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Conditional Access & MFA

Conditional Access (CA) is the Zero Trust policy engine in Entra. It evaluates signals - user
/group, device state, location, application, sign-in risk - and enforces grant, block, or
grant-with-controls (MFA, compliant device, session controls). MFA without CA is rare; the
two are designed together.

## When to use
Enforcing adaptive, identity-centric access controls across Microsoft 365 and any Entra-
integrated app. Use this skill for the baseline policy set and any new policy rollout.

**Do not use this skill** for risk detection (`entra-id-protection`), just-in-time admin
elevation (`azure-pim`), or app-side OAuth permissions (`entra-id`).

## The baseline 6-policy set

Every Entra tenant in 2026 should have these six policies as the minimum, in this order.

| # | Policy | Scope | Grant control |
|---|---|---|---|
| 1 | **Require MFA for admins** | All Entra admin roles | MFA + phishing-resistant strength |
| 2 | **Require MFA for all users** | All users (excl. break-glass) | MFA |
| 3 | **Block legacy authentication** | All users | Block |
| 4 | **Require compliant device for M365** | All users, M365 apps | Compliant OR hybrid-joined |
| 5 | **Risk-based CA - sign-in risk High** | All users | MFA (requires EID P2) |
| 6 | **Risk-based CA - user risk High** | All users | Secure password change (requires EID P2) |

> **Rule of thumb:** if a tenant doesn't have all 6, it is below the 2026 Microsoft baseline.
> Policies 5 and 6 require Entra ID P2; substitute with risk-based authentication strength
> on E3 if needed.

## Approach

1. **Inventory before authoring** — Export current sign-in logs to understand baseline:
   per-app MFA usage, legacy auth volume, device compliance, named locations in use.
   Don't author policies on assumed traffic patterns.
   *Verify: `Sign-ins` workbook shows per-app MFA % and legacy auth count.*

2. **Use authentication strengths, not just "Require MFA"** — Authentication strengths let
   you require **phishing-resistant** methods (FIDO2 passkey, Windows Hello for Business,
   certificate-based) for high-value scopes. Plain "Require MFA" accepts SMS - still phishable.
   *Verify: admin policy grant control uses the built-in **Phishing-resistant MFA**
   authentication strength, not generic MFA.*

3. **Always report-only first** — New policies in **report-only** mode for at least 7 days.
   Use **What If** to model specific user + app scenarios. Promote to On only after the
   report-only results show no surprises.
   *Verify: policy report-only impact > 0 sign-ins evaluated (otherwise policy isn't matching
   anything - bad scope).*

4. **Exclude break-glass on every policy** — Two cloud-only emergency accounts excluded from
   every policy, monitored on every sign-in. Document the exclusion list and review monthly.
   *Verify: `Conditional Access Insights workbook` shows break-glass exclusion applied to all
   enforcing policies.*

5. **Session controls where needed** — Sign-in frequency for sensitive apps, persistent
   browser block on shared devices, app-enforced restrictions for Exchange/SharePoint,
   Conditional Access App Control for in-session monitoring.

6. **Policy register** — Maintain a register (CSV or Sentinel watchlist) with policy intent,
   owner, exclusions, last review. CA policies drift without this.

## Guardrails
- **Never enforce a new policy on All users without report-only first.** Most production CA
  incidents come from this single mistake.
- **Two break-glass accounts excluded from every policy, monitored on every sign-in.**
  Without this, a CA misconfiguration can lock out the tenant.
- **Block legacy auth, then monitor sign-ins for 30 days.** Some apps still use it -
  surface them and remediate before complaints arrive.
- **Phishing-resistant strength for admins, not generic MFA.** SMS-based MFA for Global Admin
  is the 2026 equivalent of a password sticky note.
- **Don't stack 30+ policies.** Each evaluation costs latency. Consolidate where conditions
  overlap; aim for < 20 active policies.
- **Test changes with What If, not with a colleague's account.** What If tests against the
  policy engine without a real sign-in.

## Common anti-patterns
- **"New policy direct to On for All users"** - Lockout. Report-only 7 days minimum.
- **"Require MFA = phishing-resistant"** - It accepts SMS. Use authentication strengths.
- **"One break-glass account in a password manager"** - Single point of failure. Two
  hardware-key accounts, separated custody.
- **"No exclusions because exclusions are insecure"** - Without break-glass exclusions, you
  can't recover from a CA misconfiguration.
- **"Block all of Russia / China at named location"** - Attackers use proxies in your
  allowed countries. Use risk signals + device compliance instead.
- **"CA policies in production with no register"** - 6 months later no one knows why policy
  17 exists.

## Example prompts
- `Author the baseline 6-policy Conditional Access set for a new Entra tenant.`
- `Require phishing-resistant MFA (FIDO2/WHfB) for all Entra admin roles.`
- `Block legacy authentication and report on which apps still use it.`
- `Roll out a new "require compliant device for Exchange" policy safely with report-only.`
- `Why are users getting MFA-prompted constantly - tune sign-in frequency.`
- `Exclude our break-glass accounts from every CA policy and alert on their sign-ins.`

## Microsoft Learn
- Conditional Access overview: https://learn.microsoft.com/entra/identity/conditional-access/overview
- Authentication strengths: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths
- Report-only mode: https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-report-only
- What If tool: https://learn.microsoft.com/entra/identity/conditional-access/what-if-tool
- Block legacy authentication: https://learn.microsoft.com/entra/identity/conditional-access/policy-block-legacy-authentication
- Recommended policies: https://learn.microsoft.com/entra/identity/conditional-access/plan-conditional-access
- Break-glass accounts: https://learn.microsoft.com/entra/identity/role-based-access-control/security-emergency-access
- CA Insights workbook: https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-insights-reporting
