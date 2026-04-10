# GAFAIG — REGISTRY ID RESOLUTION (LOCKED) — 2026-04-10

## PURPOSE
Defines how REGISTRY_ID resolves to CASE_ID.

---

## RESOLUTION RULE

REGISTRY_ID → CASE_ID via:

CORE.V_REGISTRY_PUBLIC

---

## FALLBACK

If needed:

CORE.REGISTRY_SNAPSHOTS
WHERE latest approved record

---

## RULES

- Always use latest approved snapshot
- Never use stale data
- Never resolve from UI
- Never guess mapping

---

## API IMPLEMENTATION

1. Input REGISTRY_ID
2. Query V_REGISTRY_PUBLIC
3. Extract CASE_ID
4. Use CASE_ID for all downstream queries

---

## FAILURE CONDITIONS

- REGISTRY_ID not found → return 404
- Multiple matches → system error

---

## FINAL RULE

All downstream data must originate from resolved CASE_ID.