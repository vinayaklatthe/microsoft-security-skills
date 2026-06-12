# Baseline capture sheet (no skill loaded)

Open a **clean chat window with NO security skill loaded** - ideally a
*different* model from the one that wrote the skills. Paste each prompt below,
then save the answer as the matching filename **in this folder**
(`validation/answers/baseline/`).

When done, score and compare:

```bash
node validation/run-evals.mjs --answers --dir validation/answers/baseline --report
npm run eval:answers:report   # the with-skill scores, to compare against
```

If baseline scores lower than with-skill, that gap is the skill's value.

---

## Prompts -> save answer as

| Save as | Prompt |
|---|---|
| `compromise-recovery__0.txt` | An attacker has Global Admin in our tenant right now. Walk me through evicting them. |
| `compromise-recovery__1.txt` | How do we harden the tenant after eviction so the attacker cannot return? |
| `azure-key-vault__0.txt` | Set up Azure Key Vault so an app can read secrets securely. |
| `azure-key-vault__1.txt` | How should I isolate vaults and keep secrets fresh? |
| `azure-pim__0.txt` | Remove standing Global Admin and require just-in-time elevation. |
| `azure-pim__1.txt` | What activation controls should I set for privileged roles? |
| `defender-xdr__0.txt` | Walk me through investigating a multi-stage attack across endpoint and identity. |
| `defender-xdr__1.txt` | What should I configure before enabling Defender XDR broadly? |
| `entra-id__0.txt` | Design the identity foundation for a new Entra ID tenant. |
| `entra-id__1.txt` | Set up hybrid identity with our on-premises Active Directory. |
| `defender-for-endpoint__0.txt` | Onboard endpoints to Defender for Endpoint and roll out ASR safely. |
| `defender-for-endpoint__1.txt` | How do I respond to a compromised device and reduce future exposure? |
| `threat-modelling__0.txt` | Run a threat model for a new system design. |
| `threat-modelling__1.txt` | What does the E in STRIDE cover and how is it mitigated? |
| `conditional-access-mfa__0.txt` | Design a Conditional Access baseline and roll it out safely without locking users out. |
| `conditional-access-mfa__1.txt` | How do I require phishing-resistant MFA for all Global Admins? |
| `sentinel__0.txt` | How do I design a Microsoft Sentinel workspace and control ingestion cost? |
| `sentinel__1.txt` | Automate incident response in Sentinel. |
| `purview-dlp-policy__0.txt` | Help me build a Purview DLP policy to stop sensitive data leaving via email and endpoints. |
| `purview-dlp-policy__1.txt` | Help me tune a DLP rule to reduce false positives on credit card numbers. |
| `microsoft-agent-365__0.txt` | Set up Microsoft Agent 365 to manage all our AI agents at scale. |
| `microsoft-agent-365__1.txt` | How do I govern and secure third-party and Copilot Studio agents from one control plane? |
| `m365-oversharing__0.txt` | Remediate oversharing across Microsoft 365 before we roll out a new data program. |
| `m365-oversharing__1.txt` | Set up enforceable guardrails so oversharing does not creep back in SharePoint. |

## Tips for a fair test

- Do **not** load any SKILL.md or this repo into the baseline window.
- Use the same model settings for all 20 so the comparison is clean.
- Save the raw answer text only (no need to format).
- A skill "wins" when its with-skill answer scores higher than the baseline
  answer for the same prompt.
