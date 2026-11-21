# Changelog

## 0.1.0 — 2026-11-21

- Initial release: GeoSeen community node with two read-only operations.
- Get Brand Mention (`GET /api/public/brands?q=<name>`).
- List Leaderboard (`GET /api/public/leaderboard`, optional limit, default 50, max 50).
- No credentials, no runtime dependencies. Public API only (120 requests/hour/IP).
