# GAFAIG_NEXT_CHAT_STARTER_BLOCK.md

This is the continuation chat for building GAFAIG.

GAFAIG = Global Authority for AI Governance.
GAFAIG is the world’s first deterministic AI governance registry.

Load these documents as canonical system context:

* GAFAIG_CANONICAL_SUMMARY.md
* MASTER_STATE.md
* CURRENT_FOCUS.md
* ENGINEERING_RULES.md
* CANONICAL_RUN_ORDER.md
* GAFAIG_ACTIVE_FILE_MAP.md
* 99_RUN_CANONICAL_PIPELINE.sql

---

## NON-NEGOTIABLE RULES

Do NOT re-architect anything.
Do NOT move logic out of Snowflake.
Do NOT introduce computation in API/UI.

Snowflake is the source of truth.
API is pass-through only.
UI is display only.

Registry is append-only.
IDs are generated ONLY in Snowflake.

Verification MUST use:

```text
proof.messageString ONLY
```

NEVER reconstruct payloads.
NEVER verify from JSON fields.

---

## CURRENT SYSTEM STATE

✔ Deterministic pipeline complete
✔ Cryptographic verification complete
✔ Public registry working
✔ Publish V4 (controlled visibility) active
✔ PUBLISHED flag enforced in all public views
✔ AI layer tables deployed (non-authoritative)
✔ Validation runner updated

---

## CRITICAL SYSTEM RULES (LOCKED)

### Certification vs Publication

Certification is private.
Publication is optional and controlled.

Public visibility requires:

```sql
PUBLISHED = TRUE
```

---

### Visibility Enforcement

CORE.V_REGISTRY_PUBLIC MUST enforce:

```sql
WHERE PUBLISHED = TRUE
```

No unpublished records may appear anywhere public.

---

### AI Layer Rule

AI suggests.
Humans approve.
Snowflake decides.
Registry publishes.
Proof verifies.

AI MUST NEVER:

* Score
* Certify
* Publish
* Modify registry
* Modify signed payload

---

## CURRENT BLOCKERS (STEP ZERO)

Fix Snowflake run-order failures:

* 12_TABLES_PARTICIPANTS.sql
* 15_TABLES_EVENTS.sql

These block deterministic rebuild.

---

## CURRENT EXECUTION PHASE

```text
ENFORCEMENT → VALIDATION → AI FOUNDATION
```

---

## NEXT PRIORITIES (STRICT ORDER)

1. Fix run-order blockers
2. Validate full pipeline (99_RUN_CANONICAL_PIPELINE.sql)
3. Confirm visibility enforcement (PUBLISHED separation)
4. Begin AI ingestion (observations → recommendations)
5. Expand dataset (multi-case realism)

---

## WHAT MUST NOT HAPPEN

Do NOT:

* Reintroduce score into public views
* Expose unpublished records
* Allow API to compute trust
* Let AI influence certification
* Break messageString determinism

---

## GUARANTEED CONTINUITY RULE

If a response deviates from:

* Snowflake-first architecture
* Publication separation
* AI non-authoritative model

👉 STOP and correct before proceeding.

---

END OF BLOCK
