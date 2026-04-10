# GAFAIG — ENVIRONMENT PARITY RULES — 2026-04-10

## PURPOSE
Ensure consistency between local and production environments.

---

## BASE URL RULE

ALL URLs must be derived from:

process.env.NEXT_PUBLIC_BASE_URL

---

## EXAMPLES

Correct:
https://www.gafaig.com/api/verify/GAFAIG-XXXX

Incorrect:
http://localhost:3000/api/verify/...

---

## ENV VARIABLES

LOCAL:
.env.local

PRODUCTION:
Vercel environment variables

---

## RULES

- Never hardcode URLs
- Never mix environments
- Always test production endpoints

---

## FINAL RULE

Environment mismatch = broken verification.