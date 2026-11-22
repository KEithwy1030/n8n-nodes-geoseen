# n8n-nodes-geoseen

Check how often AI assistants mention your brand, inside n8n.
Read-only access to GeoSeen's public brand-visibility leaderboard
(https://auditlab.site/leaderboard). Free, no API key, no account.

## Installation

In n8n, go to **Settings → Community Nodes**, enter
`n8n-nodes-geoseen`, and install. Or install from npm:

```bash
npm install n8n-nodes-geoseen
```

Self-hosted n8n only: community nodes are not available on n8n Cloud
unless the node is verified. Until this node is verified, n8n 3.0
requires `N8N_UNVERIFIED_PACKAGES_ENABLED=true` to install or load it.

## Authentication

None. The GeoSeen public API is read-only and needs no key.
The node sends GET requests only. Fair-use limit: 120 requests
per hour per IP.

## Operations

- **Get Brand Mention** — look up one brand by name
  (`GET /api/public/brands?q=<name>`). Returns mentions, answered
  questions, missing answers, mention rate, engines, and sources.
- **List Leaderboard** — fetch the ranked leaderboard
  (`GET /api/public/leaderboard`), with an optional limit
  (default 50, max 50; the leaderboard currently holds 49 brands).

## Example

Weekly watch: Schedule Trigger (Mondays 09:00) → GeoSeen
List Leaderboard (top 10) → GeoSeen Get Brand Mention
(`q=Ghost`) → IF Ghost's mention rate fell below 1.0 → Slack
message. See the example workflow in `examples/weekly-watch.json`
(shipped in the package since 0.1.1).

Manual lookup: Manual Trigger → GeoSeen Get Brand Mention
(`q=Ghost`) → Ghost mentioned 4 out of 4 answered questions,
mention rate 1.0.

## Data notes

- One observation = one brand × one question × one engine, with an
  answer. A failed engine call (HTTP 429/503) counts as missing,
  never as zero mentions.
- The public data covers 49 brands (snapshot 2026-11-19).
  It cannot audit a brand that is not on the leaderboard.
  To audit your own site, use the free scan at https://auditlab.site.

## Links

- API docs: https://auditlab.site/methodology (Public API section)
- Leaderboard: https://auditlab.site/leaderboard
- Issues: https://github.com/KEithwy1030/n8n-nodes-geoseen/issues
