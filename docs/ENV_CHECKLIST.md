# GAFAIG — Environment / Vercel Checklist (Names Only)

Last updated: 2026-02-23

## Local: .env.local (required names)
DO NOT commit secrets. Values are local-only.

Required (Snowflake):
- SNOWFLAKE_ACCOUNT
- SNOWFLAKE_USERNAME
- SNOWFLAKE_PASSWORD
- SNOWFLAKE_ROLE
- SNOWFLAKE_WAREHOUSE
- SNOWFLAKE_DATABASE (expected: GAFAIG_DB)
- SNOWFLAKE_SCHEMA (expected: CORE)

Site URL:
- NEXT_PUBLIC_SITE_URL
  - local: http://localhost:3000
  - prod: https://www.gafaig.com

Admin demo (if used by your auth helper; keep names consistent with your repo):
- (If present in your codebase) ADMIN_DEMO_SECRET or similar
- (If present) SESSION_SECRET or similar

## Vercel env vars
In Vercel Project → Settings → Environment Variables, add the same names for:
- Production
- Preview (optional)
- Development (optional)

## Safety rules
- Never paste passwords into docs.
- Store secrets only in:
  - .env.local (local)
  - Vercel env vars (prod)