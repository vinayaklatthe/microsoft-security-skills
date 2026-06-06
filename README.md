# Microsoft Security Skills

Practical, task-oriented **skills** that help AI agents (GitHub Copilot, Claude, and other
agentic tools) give accurate, opinionated guidance on Microsoft Security products.

Every skill is grounded in **public [Microsoft Learn](https://learn.microsoft.com/security/)
documentation** — there is no proprietary or customer content here. Each skill is a single
`SKILL.md` file with a focused scope, "when to use" triggers, a concise delivery approach,
guardrails, and links back to the authoritative Microsoft Learn articles.

> This collection is inspired by, and follows the same packaging conventions as,
> [microsoft/azure-skills](https://github.com/microsoft/azure-skills).

## What's inside

The skills span the Microsoft Security portfolio, organised by theme:

### Modern SecOps — detection, identity & endpoint
Microsoft Sentinel, the unified SecOps platform (Defender portal), Microsoft Defender XDR
and its workloads (Endpoint, Identity, Office 365, Cloud Apps), Microsoft Entra ID and
Identity Protection, Conditional Access, Microsoft Intune, Microsoft Security Copilot,
threat modelling, privileged access workstations, Windows Hello for Business, and recovery.

### Data Security & Governance — Microsoft Purview
Data Map and catalog, classification and sensitivity labels, data lifecycle and records
management, DLP, Insider Risk Management, Communication Compliance, eDiscovery, Audit,
DSPM for AI, Copilot oversharing controls, Microsoft Priva, and BitLocker.

### Protect Cloud & AI Apps — Azure platform security
Microsoft Defender for Cloud, Defender for APIs, cloud app security posture, API security
design, App Service security, network security and Azure Firewall, Key Vault, Azure Policy,
Privileged Identity Management, RBAC role selection, Entra ID Governance, Azure Arc, and PKI.

## How to use

Point your agent tooling at the `skills/` directory. Each subfolder contains one `SKILL.md`
whose front matter `description` includes `WHEN:` triggers the agent uses to decide when the
skill is relevant.

```
skills/
  sentinel/SKILL.md
  defender-xdr/SKILL.md
  purview-dlp-policy/SKILL.md
  ...
```

## Skill format

```markdown
---
name: <skill-slug>
description: "<what it does>. WHEN: <trigger>, <trigger>, <trigger>."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

<concise, public-knowledge guidance, with Microsoft Learn links>
```

## Contributing

Contributions are welcome. Keep every skill:
- **Public-knowledge only** — cite Microsoft Learn; no proprietary methodology or customer data.
- **Focused** — one product or task per skill.
- **Concise** — guidance an agent can act on, not a full product manual.

This project welcomes contributions and suggestions. Most contributions require you to agree
to a Contributor License Agreement (CLA). For details, visit https://cla.opensource.microsoft.com.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized
use of Microsoft trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).

## License

[MIT](LICENSE)
