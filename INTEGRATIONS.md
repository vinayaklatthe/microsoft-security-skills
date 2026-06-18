# Integrations: bringing skills to life on real tenant data

Skills in this repo teach an AI agent **how** to do Microsoft Security work. To do it on a real tenant, the agent also needs **live data**: incidents from Microsoft Defender XDR, KQL on a Microsoft Sentinel workspace, sign-in and risky-user data from Microsoft Graph, and unified audit log from Microsoft Purview.

The companion repo [`microsoft-security-agent-toolkit`](https://github.com/vinayaklatthe/microsoft-security-agent-toolkit) provides that **action layer** - MCP servers, KQL snippet packs, Logic Apps templates, and end-to-end demos. Together:

```
microsoft-security-skills          microsoft-security-agent-toolkit
        (brain)                              (hands)
   "how to do BEC IR"           +    "run KQL, read incidents,
   "when to revoke sessions"         revoke sessions, query Audit"
```

## Three deployment shapes

| Shape | Audience | Data layer |
|---|---|---|
| **1. Security Copilot user** | Existing Microsoft Security Copilot customer | Security Copilot first-party plugins |
| **2. IDE-native analyst** | Cursor / Claude Code / Copilot CLI / Gemini CLI users | MCP servers from the toolkit |
| **3. Custom SOC agent** | Copilot Studio, AutoGen, LangGraph, Semantic Kernel builders | MCP or REST APIs (Defender XDR, Sentinel, Graph, Purview) |

See [the toolkit's deployment-shapes guide](https://github.com/vinayaklatthe/microsoft-security-agent-toolkit/blob/main/docs/deployment-shapes.md) for setup.

## Tools each skill can call

Tier-3 onward, skills declare what live-data tools they need via `tools_required` in front-matter. Hosts route those declarations to whichever MCP server, plugin, or REST client is mounted:

| Tool ID | What it does | Provider |
|---|---|---|
| `sentinel.run_kql` | Run KQL on Log Analytics workspace | `sentinel-mcp` / Microsoft Sentinel MCP (preview) |
| `defender_xdr.get_incident` | Fetch a Defender XDR incident with evidence | `defender-xdr-mcp` / Defender XDR REST |
| `defender_xdr.run_advanced_hunting` | Advanced hunting query across XDR tables | `defender-xdr-mcp` |
| `graph.signins` | Entra sign-in logs | `graph-security-mcp` / Microsoft Graph |
| `graph.risky_users` | Identity Protection risky users | `graph-security-mcp` |
| `graph.revoke_sessions` (write) | Revoke refresh tokens | `graph-security-mcp` |
| `purview_audit.search` | Unified audit log search | `purview-audit-mcp` / Audit Log Search API |

The full skill <-> tool matrix lives in [the toolkit's `INTEGRATIONS.md`](https://github.com/vinayaklatthe/microsoft-security-agent-toolkit/blob/main/INTEGRATIONS.md).

## When tools are not registered

If a host has not registered any tools that satisfy a skill's `tools_required`, the agent **must fall back to read-only knowledge mode**: explain what it would do, list the queries it would run, and stop. It must not invent data.

## Permissions and safety

- Skills with write actions (containment, revocation, isolation, deletion) require **explicit human approval** in their workflow. The toolkit enforces this with a `confirm: true` parameter on every write tool.
- Use a **dedicated, least-privilege Entra app registration** for the agent. See [the toolkit's permissions guide](https://github.com/vinayaklatthe/microsoft-security-agent-toolkit/blob/main/docs/permissions-required.md).
- Never wire write tools directly into a fully autonomous loop in production.

## Quick start

1. Install this plugin into your AI host (see main [README](README.md)).
2. Pick a deployment shape from the toolkit's [deployment-shapes guide](https://github.com/vinayaklatthe/microsoft-security-agent-toolkit/blob/main/docs/deployment-shapes.md).
3. For IDE-native or custom-agent shapes: clone the toolkit, configure `.env`, run an MCP server, register it with your host.
4. Ask the agent something like *"Pull XDR incident 12847 and investigate as BEC"* - the matching skill drives the workflow, the toolkit provides the data.
