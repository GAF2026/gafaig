# GAFAIG — FAILURE MODES — 2026-04-10

## PURPOSE
Defines known failure scenarios.

---

## COMMON FAILURES

1. Missing dimensions
→ Cause: improper LEFT JOIN

2. TRY_CAST errors
→ Cause: type mismatch

3. Empty registry
→ Cause: publish not executed

4. Wrong registryId
→ Cause: normalization failure

5. Signature invalid
→ Cause: message mismatch

---

## DEBUG ORDER

1. Check Snowflake views
2. Check API output
3. Check UI rendering

---

## FINAL RULE

Always debug from Snowflake outward.