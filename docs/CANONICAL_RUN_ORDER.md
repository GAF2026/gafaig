# CANONICAL_RUN_ORDER.md
Last Updated: 2026-04-16

---

## PURPOSE

This document defines the canonical execution order for all GAFAIG Snowflake SQL files.

It ensures:
- Deterministic system behavior
- Proper dependency resolution
- Correct pipeline execution
- Elimination of data drift

This run order is mandatory.

---

## CORE PRINCIPLE

The GAFAIG system must be executed in strict sequence.

No file may be run out of order.

Snowflake must be rebuilt and executed deterministically from base → tables → views → procedures → seed → scoring → decision → publish.

---

## FULL CANONICAL PIPELINE

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEWS

---

## STEP 0 — ENVIRONMENT RESET

Run:

01_REBUILD_ENVIRONMENT_CANONICAL.sql

Purpose:
- Reset schema
- Clear prior data
- Ensure deterministic state

---

## STEP 1 — CORE TABLES

Run ALL table files in this order:

11_TABLES_APPLICATIONS.sql
13_TABLES_FINDINGS.sql
14_TABLES_EVIDENCE.sql
16_TABLES_CASE_SCORE_SNAPSHOTS.sql
17_TABLES_DECISIONS.sql
18_TABLES_REGISTRY_ENTITIES.sql
REGISTRY_AI_SYSTEMS.sql

Rules:
- Do not skip
- Do not reorder
- Must match live schema

---

## STEP 2 — CORE VIEWS (FOUNDATION)

Run:

21_VIEWS_PUBLIC_REGISTRY.sql

Purpose:
- Define V_REGISTRY_LATEST_APPROVED
- Define V_REGISTRY_PUBLIC

CRITICAL:
- Must correctly separate Approved vs Certified
- Must define correct lifecycle and certification semantics

---

## STEP 3 — AI SYSTEMS VIEW

Run:

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Purpose:
- Build public AI systems surface
- Join REGISTRY_AI_SYSTEMS → V_REGISTRY_PUBLIC

Rules:
- No fabricated fields
- No scoring logic

---

## STEP 4 — EXPLORER STATS

Run:

22_VIEWS_EXPLORER_STATS.sql

Purpose:
- Aggregate:
  - total records
  - certified
  - approved
  - countries
  - tiers
  - bands

CRITICAL:
- Must align with actual public data
- Must not double count
- Must not misclassify trust states

---

## STEP 5 — SCORE BREAKDOWN (PUBLIC)

Run:

GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql

Purpose:
- Build:
  - V_SCORE_BREAKDOWN_PUBLIC
  - V_SCORE_DIMENSIONS_PUBLIC

Rules:
- Must use Snowflake scoring outputs only
- No recomputation

---

## STEP 6 — PROCEDURES

Run:

23_SP_CREATE_CASE_FROM_APPLICATION.sql
24_SP_SCORE_CASE_ENTERPRISE.sql
APPROVE_CASE_V1.sql
CORE.REGISTRY_PUBLISH.sql

Purpose:
- Enable full pipeline execution

---

## STEP 7 — SEED DATA

Run:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Purpose:
- Seed full dataset across:
  - Applications
  - Cases
  - Findings
  - Evidence
  - Events
  - Systems

Rules:
- Only seed file allowed
- Must follow full pipeline structure

---

## STEP 8 — SCORING

Run:

CALL CORE.SP_SCORE_CASE_ENTERPRISE(<CASE_ID>);

OR batch scoring procedure if implemented.

Purpose:
- Generate score snapshots

Validation:
- Rows must be inserted into CASE_SCORE_SNAPSHOTS_V2
- If 0 rows inserted → FAILURE

---

## STEP 9 — DECISION

Run:

CALL CORE.APPROVE_CASE_V1(<CASE_ID>);

Purpose:
- Generate decision outcome

Rules:
- Must follow scoring
- Must not be manually inserted

---

## STEP 10 — REGISTRY PUBLISH

Run:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(<CASE_ID>);

Purpose:
- Insert into REGISTRY_SNAPSHOTS
- Create public trust record

Rules:
- Must enforce approval → certification gating
- Must reuse registryId
- Must not duplicate records

---

## STEP 11 — VALIDATION

Run:

SELECT * FROM CORE.V_REGISTRY_PUBLIC;
SELECT * FROM CORE.V_REGISTRY_LATEST_APPROVED;

SELECT
  DECISION_STATUS,
  CERTIFICATION_STATUS,
  COUNT(*) AS RECORDS
FROM CORE.V_REGISTRY_PUBLIC
GROUP BY 1,2;

SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;

SELECT * FROM CORE.V_REGISTRY_STATS_GLOBAL;
SELECT * FROM CORE.V_REGISTRY_STATS_BY_COUNTRY;

---

## VALIDATION REQUIREMENTS

System is valid only if:

- Certified records appear correctly
- Approved records do NOT appear as certified
- Counts match seed expectations
- No duplicate registry entries
- Lifecycle fields are correct
- Explorer stats align with actual data

---

## FAILURE CONDITIONS

STOP if:

- V_GOVERNANCE_SCORE_CASE returns no rows
- CASE_SCORE_SNAPSHOTS_V2 is empty
- REGISTRY_SNAPSHOTS has no new entries
- V_REGISTRY_PUBLIC misclassifies records
- Counts do not match expectations

Fix root cause before proceeding.

---

## CRITICAL RULES

- Never skip steps
- Never manually insert into downstream tables
- Never patch UI to hide backend issues
- Always validate after each major stage

---

## CURRENT PRIORITY (APRIL 2026)

1. Fix 21_VIEWS_PUBLIC_REGISTRY.sql
2. Fix 22_VIEWS_EXPLORER_STATS.sql
3. Validate seed integrity
4. Restore deterministic pipeline
5. Align UI after Snowflake is correct

---

## FINAL RULE

If run order is broken:
- Data becomes inconsistent
- Trust surface becomes invalid
- System loses determinism

Always follow this exact sequence.

---

END OF FILE