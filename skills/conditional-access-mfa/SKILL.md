---
name: conditional-access-mfa
description: "Guidance for Microsoft Entra Conditional Access and multifactor authentication — the Zero Trust policy engine that enforces access controls based on user, device, location, app, and risk signals. Covers policy design, MFA, device compliance grants, and rollout. WHEN: Conditional Access, MFA enforcement, require compliant device, block legacy authentication, Zero Trust access policy, phishing-resistant MFA, session controls, CA policy design, require MFA for admins."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Conditional Access & MFA

Microsoft Entra Conditional Access is the Zero Trust policy engine. It evaluates signals
(user/group, device state, location, application, sign-in risk) and enforces decisions —
grant, block, or grant **with controls** such as MFA or a compliant device.

## When to use
Enforcing adaptive, identity-centric access controls across Microsoft 365 and any Entra-
integrated application.

## Design approach
1. **Establish a baseline** — Start from Microsoft's recommended policies / security defaults,
   then build named policies. Cover: require MFA for **all users**, require MFA for **admins**,
   **block legacy authentication**, require **compliant or hybrid-joined device**, and risk-based
   policies (with Identity Protection).
2. **Prefer phishing-resistant MFA** — Use authentication strengths to require FIDO2/passkeys/
   Windows Hello for Business/certificate-based auth for privileged access.
3. **Scope carefully** — Target users/groups and apps explicitly; always **exclude break-glass
   accounts** from every policy.
4. **Use report-only mode** — Validate impact with report-only and the **What If** tool before
   enforcing.
5. **Session controls** — Apply sign-in frequency, persistent browser, and Conditional Access
   App Control where needed.
6. **Document & version** — Maintain a policy register with intent and exclusions.

## Guardrails
- Never deploy a new policy directly to **All users** in enforce mode without report-only first.
- Always keep at least two excluded emergency access accounts, monitored via alerts.
- Block legacy auth — it bypasses MFA.

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/identity/conditional-access/overview
- Recommended/template policies: https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-policy-common
- Authentication strengths: https://learn.microsoft.com/entra/identity/authentication/concept-authentication-strengths
- Report-only mode: https://learn.microsoft.com/entra/identity/conditional-access/concept-conditional-access-report-only
