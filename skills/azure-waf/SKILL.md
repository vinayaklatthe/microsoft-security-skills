---
name: azure-waf
description: "Guidance for Azure Web Application Firewall — deployed on Azure Front Door (global, edge-tier) or Azure Application Gateway (regional, integrated with backend pools). Covers WAF policy design with managed rule sets (Microsoft Default Rule Set, Bot Manager, OWASP CRS), custom rules (rate limit, geo-block, IP allow/deny), exclusion design (the long-tail tuning task that decides whether WAF stays in Prevention), JSON challenge / CAPTCHA, log analytics integration, false-positive triage workflow, integration with Defender for Cloud and Sentinel, regional vs global trade-off, and migration from third-party WAF. WHEN: Azure WAF, Front Door WAF, Application Gateway WAF, OWASP CRS Azure, bot manager Azure, WAF custom rules, WAF rate limiting, WAF false positives, WAF exclusions, WAF prevention vs detection, JSON challenge WAF, geo-block WAF. DO NOT USE for L3/L4 DDoS (use azure-ddos-protection), Azure Firewall design (use azure-firewall), or non-HTTP workloads."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Azure Web Application Firewall (WAF)

Azure WAF is an OWASP-aligned application-layer firewall available in two host services:

- **Azure Front Door (Premium / Standard)** — global, anycast, edge-tier, ideal for
  internet-facing apps and APIs that benefit from edge presence and built-in caching.
- **Azure Application Gateway (WAF v2)** — regional, integrated with backend pools, ideal
  for app-internal or VNet-bound workloads that already terminate on App Gateway.

## When to use
Protecting public web applications and APIs from layer-7 attacks: SQLi, XSS, RCE
patterns, automated scanners, credential stuffing, scraping, and bot abuse. Use this
skill for host selection, policy authoring, exclusion tuning, and operational ownership.

**Do not use this skill** for layer 3/4 DDoS (`azure-ddos-protection`), east-west /
non-HTTP traffic (`azure-firewall`), or non-HTTP protocols.

## Pick the host

| Host | Best for |
|---|---|
| **Front Door Premium WAF** | Internet apps/APIs needing global edge, advanced bot manager, JS/JSON challenges, private-link backends |
| **Front Door Standard WAF** | Cost-sensitive internet apps with managed Default Rule Set + custom rules |
| **App Gateway WAF v2** | Regional apps already on App Gateway, VNet-internal apps, bring-your-own-cert/zonal needs |

> **Rule of thumb:** Internet-facing new build → Front Door Premium. Brownfield with
> existing App Gateway + sticky reasons → App Gateway WAF.

## Approach

1. **Start in Detection (audit) mode.** Always. Two minimum weeks of production traffic
   (more for seasonal apps) before flipping to Prevention.

2. **Apply Microsoft's Default Rule Set (DRS).** Current generation is preferred over
   the older OWASP CRS for new deployments. Enable Bot Manager rule set on Premium for
   Front Door.

3. **Authentication-aware rules first.**
   - **Rate limit** anonymous endpoints (login, search, signup) — typical 100/min/IP for
     login.
   - **Geo-block** countries you don't serve, but allowlist VPN concentrators or
     partner regions.
   - **JSON / JS challenge** on suspicious bot scores (Premium) — silently filters
     headless browsers.

4. **Tune exclusions iteratively.** This is the core operational task and the reason
   most WAFs end up "in detection forever." Process:
   1. Pull Detection-mode hits from `AzureDiagnostics` / `AGCWAFLogs`.
   2. Group by rule ID + URI + parameter.
   3. Confirm legitimate traffic (e.g., a legit SOAP body with `<` characters, an API
      that legitimately includes SQL keywords).
   4. Add scoped **exclusion** for that rule on that URI/parameter — never disable the
      whole rule globally.
   5. Re-baseline weekly.

5. **Promote to Prevention** rule by rule, not all at once. Start with high-confidence,
   low-FP rules (RCE patterns, command injection). Hold off on chatty rules (XSS,
   protocol violations) until exclusions are stable.

6. **Custom rules for business logic.** Examples:
   - Block specific user agents in pen-test campaigns.
   - Allow a partner CIDR to bypass rate limits.
   - Require a specific header on internal APIs.
   - Geo-block all but expected countries for admin paths.

7. **Logging & analytics.** Send WAF logs to Log Analytics (and Sentinel). Build:
   - Top blocked rules + top false-positive candidates (work queue).
   - Geo distribution of blocked traffic.
   - Rate-limit hits per endpoint.
   - Bot manager classification trends.

8. **Operational ownership.** WAF without a named app-team owner regresses. Monthly:
   - Review new rule set updates from Microsoft (auto-applied by default; review log
     diffs).
   - Re-baseline exclusions after app deployments that change request shapes.
   - Validate Prevention coverage (no quietly-disabled rules).

9. **Pair with DDoS Protection** on the front-door public IP / App Gateway public IP.
   WAF is L7; DDoS is L3/4. Both, always, for high-value public workloads.

## Guardrails
- **Do not deploy in Prevention on day one.** False-positive outage in business hours.
- **Don't disable rules globally to chase a single FP.** Use exclusions scoped to the
  URI / parameter / cookie / header that actually triggered.
- **Geo-block is a coarse tool.** Travelers, VPN users, mobile-carrier IPs all roam.
  Prefer rate-limit + bot manager + auth posture over hard geo-deny for end-user paths.
- **Bot manager scores aren't binary.** Use the score band model (low → JS challenge,
  medium → CAPTCHA, high → block). Hard-blocking middle bands hits real users.
- **Rate limits per IP behind shared NAT** (carrier, corporate) hit too many real users.
  Pair with cookie/session + size the limit accordingly.
- **WAF in front of an API doesn't replace API auth/authz.** It's defense-in-depth, not
  the primary control.
- **Multiple WAFs in series (third-party CDN WAF + Azure WAF)** double-tune everything
  and frustrate engineers. Pick one as authoritative.
- **Default Rule Set updates can introduce new rules.** Review changes quarterly so a
  rule update doesn't surprise-block production.

## Common anti-patterns
- **"Prevention day-one"** — outage; team disables WAF entirely; never re-enables. Now
  you have nothing.
- **"Disabled rule 942100 because one URI false-positives"** — entire rule class off.
  Use exclusion.
- **"Rate limit = 1000/min globally"** — useless on login endpoints, painful on
  static-asset endpoints. Per-endpoint tuning.
- **"Geo-block everywhere"** — cuts customers, doesn't stop motivated attackers.
- **"Bot manager set to block all 'medium' scores"** — blocks legitimate browser
  variants and partner integrations.
- **"WAF logs not in Sentinel"** — invisible.
- **"Same WAF policy for all 30 apps"** — exclusions become impossible. One policy per
  app or app family.
- **"Skipped Default Rule Set updates"** — coverage stagnates while attacks evolve.

## Example prompts
- `Migrate a public e-commerce app from a third-party WAF to Azure Front Door Premium
  WAF — design and cutover plan.`
- `Build the exclusion-tuning workflow: log queries, weekly review, app-team approval.`
- `Author custom rules: rate-limit /login 30/min/IP, JS challenge /api/search on
  bot-score medium, geo-block all but US/CA on /admin.`
- `Promote a Detection-mode WAF policy to Prevention rule-by-rule with rollback
  triggers.`
- `Sentinel workbook: top blocked rules, top FP candidates, geo distribution, bot
  manager trends.`
- `Compare Front Door WAF vs App Gateway WAF for a regional banking app.`
- `Design WAF + DDoS + private-link backend for a Foundry-hosted AI API.`

## Microsoft Learn
- WAF overview: https://learn.microsoft.com/azure/web-application-firewall/overview
- Front Door WAF: https://learn.microsoft.com/azure/web-application-firewall/afds/afds-overview
- App Gateway WAF v2: https://learn.microsoft.com/azure/web-application-firewall/ag/ag-overview
- Default Rule Set: https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-drs
- Bot Manager: https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-policy-configure-bot-protection
- Custom rules: https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-custom-rules
- Exclusions: https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-exclusion
- Rate limiting: https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-rate-limit
- WAF logs and metrics: https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-monitor
- JS / JSON challenge: https://learn.microsoft.com/azure/web-application-firewall/afds/afds-overview
