# ENGINEERING_RULES.md
Last Updated: 2026-04-10

============================================================
GAFAIG — ENGINEERING RULES (CANONICAL)
============================================================

This document defines the non-negotiable engineering rules for building, modifying, and maintaining GAFAIG.

These rules are derived from:
- System architecture requirements
- Snowflake constraints
- Lessons learned from production-breaking failures

Violating these rules WILL break the system.

------------------------------------------------------------
FOUNDATIONAL PRINCIPLE
------------------------------------------------------------

SNOWFLAKE IS THE SOURCE OF TRUTH

- All data originates in Snowflake
- All computation occurs in Snowflake
- All outputs must come from Snowflake views or procedures

The application layer MUST NOT:
- Compute scores
- Derive certification logic
- Invent or assume fields

------------------------------------------------------------
SYSTEM ARCHITECTURE (LOCKED)
------------------------------------------------------------

Pipeline:

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEW
→ API
→ UI

Each step must be:
- Deterministic
- Traceable
- Append-only where applicable

------------------------------------------------------------
RULE 1 — NO ASSUMED FIELDS
------------------------------------------------------------

NEVER reference a field in TypeScript unless it exists in Snowflake.

Before using any column:
✔ Confirm with:
  DESC VIEW <view>
  OR
  SELECT * LIMIT 1

Violations cause:
- Runtime Snowflake errors
- TypeScript failures
- Broken UI

------------------------------------------------------------
RULE 2 — QUERY LAYER = CONTRACT
------------------------------------------------------------

The query layer is the ONLY interface between Snowflake and the application.

Files:
- lib/queries/registry.ts
- lib/queries/explorer.ts
- lib/queries/registry-ai-systems.ts

Rules:
- Must EXACTLY match Snowflake schema
- Must NOT include unused or speculative fields
- Must NOT perform business logic
- Must NOT reshape data beyond simple mapping

------------------------------------------------------------
RULE 3 — NO BUSINESS LOGIC IN API OR UI
------------------------------------------------------------

API routes must:
- Fetch data
- Return data

UI must:
- Render data

They must NOT:
- Compute certification status
- Derive scores
- Interpret governance logic

------------------------------------------------------------
RULE 4 — APPEND-ONLY REGISTRY
------------------------------------------------------------

CORE.REGISTRY_SNAPSHOTS is immutable.

- NEVER update existing rows
- NEVER delete rows (except controlled seed reset)
- ALWAYS insert new snapshot via procedure

------------------------------------------------------------
RULE 5 — PUBLISH VIA PROCEDURE ONLY
------------------------------------------------------------

ONLY use:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

DO NOT:
- Insert directly into REGISTRY_SNAPSHOTS
- Modify registry data manually

The procedure guarantees:
- Deterministic registry ID
- Proper lifecycle state
- Snapshot integrity

------------------------------------------------------------
RULE 6 — SCORING IS DETERMINISTIC
------------------------------------------------------------

Scoring must:
- Come from CORE.V_CASE_SCORE_ENTERPRISE
- Be written to CASE_SCORE_SNAPSHOTS_V2

DO NOT:
- Compute scores in API
- Compute scores in UI
- Modify scoring output manually

------------------------------------------------------------
RULE 7 — ID NORMALIZATION
------------------------------------------------------------

All IDs must be:

- Uppercase
- Trimmed
- Deterministic

Examples:
- CASE-0001
- APP-0001
- GAFAIG-00000001

All comparisons must use:

UPPER(TRIM(field))

------------------------------------------------------------
RULE 8 — SNOWFLAKE AUTHENTICATION
------------------------------------------------------------

MFA is enforced.

Application MUST use:
- SNOWFLAKE_JWT (key-pair authentication)

DO NOT:
- Rely on password authentication
- Attempt to bypass MFA

Required env:
- SNOWFLAKE_PRIVATE_KEY or PRIVATE_KEY_PATH

------------------------------------------------------------
RULE 9 — SEED DATA MUST BE MINIMAL
------------------------------------------------------------

Seed files must:
- Be deterministic
- Be idempotent
- Use minimal dependencies

Canonical seed:
GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

DO NOT:
- Reintroduce complex multi-table seeds
- Depend on optional tables
- Insert inconsistent data

------------------------------------------------------------
RULE 10 — STABILIZE BEFORE ENRICH
------------------------------------------------------------

If system breaks:

STEP 1:
Reduce to minimal working schema

STEP 2:
Fix all errors

STEP 3:
Rebuild enrichment cleanly

DO NOT:
- Patch frontend to compensate
- Add fake data
- Guess missing fields

------------------------------------------------------------
RULE 11 — VIEW REBUILDS MUST BE EXPLICIT
------------------------------------------------------------

When rebuilding views:

✔ List all source tables
✔ Select each column explicitly
✔ Validate every column exists
✔ Test with SELECT before using in app

DO NOT:
- Use SELECT *
- Assume column presence
- Copy legacy SQL blindly

------------------------------------------------------------
RULE 12 — TYPESCRIPT MUST MATCH REALITY
------------------------------------------------------------

Types must reflect actual data.

If Snowflake changes:
→ Types must change
→ Query layer must change

DO NOT:
- Add fields to satisfy UI
- Use optional chaining to hide errors

------------------------------------------------------------
RULE 13 — ERROR SIGNALS ARE TRUTH
------------------------------------------------------------

Do NOT ignore errors like:
- "invalid identifier"
- "property does not exist"
- "type mismatch"

These are signals of:
→ schema mismatch
→ contract violation

Fix at the source, not the symptom.

------------------------------------------------------------
RULE 14 — DO NOT RE-ARCHITECT
------------------------------------------------------------

The architecture is locked.

DO NOT:
- Move logic out of Snowflake
- Introduce alternate data pipelines
- Duplicate registry logic in API

------------------------------------------------------------
RULE 15 — ONE SOURCE PER CONCEPT
------------------------------------------------------------

Each concept must have one canonical source:

- Registry → REGISTRY_SNAPSHOTS
- Score → V_CASE_SCORE_ENTERPRISE
- Decision → DECISIONS
- Public data → V_REGISTRY_PUBLIC

DO NOT:
- Duplicate logic across views
- Mix multiple sources inconsistently

------------------------------------------------------------
CURRENT OPERATING MODE
------------------------------------------------------------

MODE: MINIMAL REGISTRY

Active fields:
- REGISTRY_ID
- APPLICATION_ID
- CASE_ID
- ENTITY_NAME
- COUNTRY

Removed fields:
- ENTITY_TYPE
- CERTIFIED_*
- VALID_*

Reason:
System stabilization

------------------------------------------------------------
NEXT ENGINEERING OBJECTIVE
------------------------------------------------------------

Rebuild:

CORE.V_REGISTRY_PUBLIC (ENRICHED)

Then:
- Update query layer
- Remove placeholders
- Restore full UI functionality

------------------------------------------------------------
FINAL PRINCIPLE
------------------------------------------------------------

Correctness > Completeness

A minimal correct system is better than a broken “full” system.

------------------------------------------------------------
END OF FILE
------------------------------------------------------------