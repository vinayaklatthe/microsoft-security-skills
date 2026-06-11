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
detects active threats and abuse.

## When to use
Protecting APIs (especially external-facing and sensitive-data APIs) fronted by Azure API
Management.

## Approach
1. **Onboard** — Enable the Defender for APIs plan and onboard APIM-published APIs so they are
   inventoried and monitored.
2. **Assess posture** — Review security findings: unauthenticated/externally exposed APIs, APIs
   handling sensitive data, and inactive/unused APIs. Prioritise by risk.
3. **Threat detection** — Get alerts on suspicious/anomalous API access, enumeration, and abuse
   patterns; correlate in Defender for Cloud and Sentinel/Defender XDR.
4. **Remediate** — Harden authentication, rate limiting, and exposure via APIM policies; remove
   unused APIs.
5. **Integrate** — Combine with API gateway controls and broader CSPM/CWPP posture.

## Guardrails
- Defender for APIs currently focuses on APIs published through Azure API Management — confirm
  your APIs are fronted by APIM to be in scope.
- Pair detection with preventive APIM controls (auth, throttling, validation) — detection alone
  isn't protection.
- Prioritise externally exposed, sensitive-data, and unauthenticated APIs first.

## Example prompts
- `Onboard APIs in API Management to Microsoft Defender for APIs.`
- `How do I detect API abuse and sensitive data exposure in my APIs?`
- `Review API security posture and prioritise findings.`
- `Set up API attack detection and alerting.`

## Microsoft Learn
- Overview: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-introduction
- Deploy/onboard: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-deploy
- Investigate findings: https://learn.microsoft.com/azure/defender-for-cloud/defender-for-apis-posture
- API Management security: https://learn.microsoft.com/azure/api-management/api-management-howto-protect-backend-with-aad
