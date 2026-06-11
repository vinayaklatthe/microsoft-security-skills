---
name: defender-for-apis
description: "Guidance for Microsoft Defender for APIs — a Defender for Cloud plan that discovers, prioritizes by risk, and protects APIs published in Azure API Management against threats and abuse. Covers onboarding, security findings, and threat detection. WHEN: Defender for APIs, API threat protection, secure APIs in API Management, API security posture, detect API abuse, onboard APIs to Defender, API attack detection, sensitive data exposure in APIs."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Defender for APIs

Defender for APIs is a Microsoft Defender for Cloud plan that provides visibility into the
security posture of APIs published in **Azure API Management**, prioritises them by risk, and
detects active threats and abuse. It is **detection and posture**, not a WAF or API gateway.

## When to use
Use this skill when securing APIs that are **already published through Azure API Management**
and you need risk-based prioritisation plus runtime threat detection.

**Do not use this skill** for:
- Designing API security from scratch (use `api-security-design` for OWASP API Top 10)
- APIs fronted by Application Gateway / Front Door without APIM (out of scope today)
- WAF tuning or rate-limiting design (APIM policies, not Defender)

## Triage which APIs to protect first

Defender for APIs onboards everything in APIM by default. The work is **prioritisation**.
Use this table to rank your inventory:

| Risk signal | Priority | Why it matters first |
|---|---|---|
| Externally exposed + unauthenticated | **P0 - this week** | Already an attack surface; one bad request from internet |
| Externally exposed + handles sensitive data (PII, payment, health) | **P0 - this week** | Sensitive-data exposure (OWASP API3) and BOLA risk |
| Externally exposed + authenticated | **P1 - this month** | Auth bypass / token abuse risk |
| Internal + handles sensitive data | **P2 - this quarter** | Insider risk; lateral movement scenarios |
| Inactive or unused for >90 days | **Decommission** | Free attack surface reduction |
| Internal + non-sensitive | **P3 - monitor only** | Low immediate risk |

> **Rule of thumb:** if Defender for APIs surfaces more than 50 findings on day one, do not
> try to fix all of them. Filter to *externally exposed + sensitive-data* first - that is
> usually 5-15 APIs and 80% of real risk.

## Approach

1. **Enable the plan at subscription scope** — Defender for APIs is a per-API priced plan inside
   Defender for Cloud (billed per million API calls). Enable on the subscription containing your
   APIM instances. The first 30 days are free for evaluation.
   *Verify: Defender for Cloud → Environment settings → Defender plans shows "APIs: On".*
2. **Onboard APIs into the plan** — From *Defender for Cloud → Workload protections → Defender
   for APIs → Onboard*, select APIM instances. Onboarding does not require redeploying APIs.
   *Verify: API inventory populates within ~1 hour; each API shows a risk score and findings.*
3. **Triage by the risk table above** — Filter inventory to *External + Unauthenticated* and
   *External + Sensitive data* findings. Treat these as P0.
4. **Remediate at the APIM layer** — Defender does not fix; APIM policies do.
   - Unauthenticated → add `<validate-jwt>` or subscription-key policy
   - Sensitive data exposure → review `set-body` / response-mask policies
   - Excessive enumeration → add `<rate-limit-by-key>` policy
   - Inactive APIs → deprecate or revoke product visibility
   *Verify: re-scan finding clears within 24 hours of APIM policy publish.*
5. **Wire detections to your SOC** — Defender alerts flow into Defender for Cloud, Defender XDR,
   and Sentinel via the Microsoft Defender XDR connector. Build automation rules for
   unauthenticated-access spikes and credential-stuffing patterns.
   *Verify: a test malicious request (e.g. enumeration burst from one IP) generates an alert
   within 15 minutes in the Defender XDR portal.*
6. **Iterate monthly** — New APIs appear; old ones go inactive. Re-run the triage table monthly
   so risk priority stays current.

## Guardrails
- **APIM-only scope.** Defender for APIs only sees APIs fronted by Azure API Management. APIs
  on Application Gateway, Front Door, or direct App Service exposure are invisible to it -
  route them through APIM or use other controls.
- **Detection is not protection.** Defender finds the problem; APIM policies fix it. Treat
  Defender as your *prioritisation engine*, not your security perimeter.
- **Pricing scales with calls.** High-traffic APIs (hundreds of millions of calls/month) can
  generate significant Defender for APIs cost. Use the Azure Pricing Calculator before scaling.
- **Sensitive-data detection is sampled.** Defender inspects a percentage of API responses; do
  not rely on it as a complete DLP control - pair with response-masking APIM policies for
  known-sensitive fields.
- **Onboarding changes nothing in your API.** No code change, no perf impact - Defender reads
  APIM telemetry. Safe to enable in production.

## Common anti-patterns
- **"Fix every finding."** Findings flood on day one; teams burn out triaging low-risk internal
  APIs. Use the priority table.
- **"Treat Defender for APIs as a WAF."** It is not. WAF lives at Front Door / Application
  Gateway / APIM Premium. Defender is detection + posture.
- **"Skip APIM and call Defender for APIs."** Cannot - APIM is the prerequisite.
- **"Leave inactive APIs published."** Defender flags them; ignoring the flag keeps live attack
  surface for retired endpoints.
- **"Onboard, then forget."** Without monthly triage, new APIs appear unmonitored and findings
  drift.

## Example prompts
- `Onboard APIs in API Management to Microsoft Defender for APIs.`
- `Which APIs should I protect first with Defender for APIs?`
- `How do I detect API abuse and sensitive data exposure in my APIs?`
- `Review API security posture and prioritise findings.`
- `Set up API attack detection and alerting in Sentinel.`
- `Estimate the cost of Defender for APIs for 500 million calls a month.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-introduction
- Deploy and onboard: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-deploy
- Investigate findings (posture): https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-posture
- API Management - protect backend: https://learn.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad
- API Management - rate limit policy: https://learn.microsoft.com/azure/api-management/rate-limit-by-key-policy
- Defender for APIs pricing: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-deploy#prerequisites
