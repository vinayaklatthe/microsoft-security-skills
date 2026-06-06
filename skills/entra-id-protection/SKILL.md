---
name: entra-id-protection
description: "Guidance for Microsoft Entra ID Protection — risk-based identity security that detects user and sign-in risk and automates remediation. Covers risk detections, risk policies, integration with Conditional Access, and risk investigation. WHEN: Entra ID Protection, identity risk policy, risky users, risky sign-ins, user risk policy, sign-in risk policy, risk-based Conditional Access, leaked credentials, automate identity remediation."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Entra ID Protection

Microsoft Entra ID Protection uses machine learning and Microsoft's threat intelligence to
detect identity risk (user risk and sign-in risk) and automate detection, investigation, and
remediation of risky identities.

## When to use
Adding risk-based, adaptive protection on top of Entra ID and Conditional Access (requires
Entra ID P2).

## Design approach
1. **Understand risk** — **Sign-in risk** (likelihood a request isn't the legitimate owner,
   e.g., anonymous IP, atypical travel, malware-linked IP) vs **user risk** (likelihood the
   identity is compromised, e.g., leaked credentials, threat intelligence).
2. **Risk-based Conditional Access (recommended)** — Author Conditional Access policies that use
   **sign-in risk** and **user risk** conditions to require MFA or secure password change,
   rather than the legacy built-in risk policies.
3. **Self-remediation** — Allow risk to be remediated automatically via MFA (sign-in risk) and
   secure password change (user risk) so low-risk events don't need analyst time.
4. **Investigate** — Triage **Risky users**, **Risky sign-ins**, and **Risk detections** reports;
   confirm compromise or dismiss false positives to train the system.
5. **Export** — Stream risk detections to Microsoft Sentinel / SIEM for correlation.

## Guardrails
- Require registration for MFA and SSPR so self-remediation actually works.
- Exclude break-glass accounts from risk policies.
- Start risk thresholds at **High**, then expand to medium once tuned.

## Microsoft Learn
- Overview: https://learn.microsoft.com/entra/id-protection/overview-identity-protection
- Risk policies: https://learn.microsoft.com/entra/id-protection/concept-identity-protection-policies
- Configure risk-based CA: https://learn.microsoft.com/entra/id-protection/howto-identity-protection-configure-risk-policies
- Investigate risk: https://learn.microsoft.com/entra/id-protection/howto-identity-protection-investigate-risk
