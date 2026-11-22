# Changelog

## 0.1.1 — 2026-11-22

- Published via GitHub Actions with npm provenance (required for n8n verification since 2026-05-01).
- Example workflow `examples/weekly-watch.json` now shipped in the package (uses both operations: List Leaderboard + Get Brand Mention).
- Pinned `@n8n/node-cli` to `>=0.23.0` (was `*`).

## 0.1.0 — 2026-11-21

- Initial release: GeoSeen community node with two read-only operations.
- Get Brand Mention (`GET /api/public/brands?q=<name>`).
- List Leaderboard (`GET /api/public/leaderboard`, optional limit, default 50, max 50).
- No credentials, no runtime dependencies. Public API only (120 requests/hour/IP).
