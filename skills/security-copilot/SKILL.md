---
name: security-copilot
description: "Guidance for Microsoft Security Copilot — the generative-AI security platform that helps analysts investigate, hunt, and respond using natural language, plugins, and promptbooks. Covers SCU provisioning, plugins, promptbooks, and embedded experiences. WHEN: Microsoft Security Copilot, AI for SOC, security copilot units SCU, promptbooks, Copilot plugins, natural language investigation, summarize incident with AI, Copilot for Security setup."
license: MIT
metadata:
  author: Microsoft
  version: "0.1.0"
---

# Microsoft Security Copilot

Microsoft Security Copilot is a generative-AI security platform that helps security and IT teams
investigate incidents, hunt threats, summarise, and respond at machine speed using natural
language, grounded in your security data and Microsoft threat intelligence.

## When to use
Accelerating SOC investigation, reporting, and analyst productivity across Microsoft and
third-party security data.

## Design approach
1. **Provision capacity** — Set up **Security Compute Units (SCUs)** (provisioned capacity) in
   Azure, assign the Azure subscription/resource group, and plan overage settings.
2. **Roles & access** — Configure Security Copilot owner/contributor roles and align to
   least privilege; set the default environment and data sharing.
3. **Plugins** — Enable Microsoft plugins (Defender XDR, Sentinel, Intune, Entra, Threat
   Intelligence, Purview) and add non-Microsoft / custom plugins as needed.
4. **Experiences** — Use the **standalone** portal for multi-step investigations and the
   **embedded** experiences inside Defender, Sentinel, Intune, Entra, and Purview.
5. **Promptbooks** — Use and build **promptbooks** (saved multi-step prompt sequences) for
   repeatable tasks like incident summaries and reverse-engineering scripts.
6. **Govern** — Monitor usage/SCU consumption and audit Copilot activity.

## Guardrails
- Treat AI output as **assistive** — analysts must validate findings before acting.
- Apply least-privilege plugin access; Copilot respects the underlying product RBAC of the user.
- Monitor SCU consumption to control cost; tune capacity to demand.

## Microsoft Learn
- Overview: https://learn.microsoft.com/security-copilot/microsoft-security-copilot
- Get started / provision SCUs: https://learn.microsoft.com/security-copilot/get-started-security-copilot
- Plugins: https://learn.microsoft.com/security-copilot/manage-plugins
- Promptbooks: https://learn.microsoft.com/security-copilot/using-promptbooks
