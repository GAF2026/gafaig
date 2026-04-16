# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-15

## PURPOSE
This file is the **canonical summary of all active Snowflake SQL files** used in the GAFAIG platform.

It defines:
- what each file does
- how files relate to each other
- where the system is currently blocked
- which files are authoritative vs deprecated vs diagnostic

This file must reflect the **REAL LIVE SYSTEM**, not assumptions.

Snowflake is the source of truth.

---

## 🚨 CRITICAL RULES

- Do NOT compute scores in API or UI
- Do NOT bypass publish procedures
- Do NOT create alternate registry logic
- Do NOT invent schema fields
- Always align with live `DESC TABLE` output
- Always follow `CANONICAL_RUN_ORDER.md`

---

## 🧠 CANONICAL EXECUTION FLOW

The system MUST execute in this order:

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  

If any step fails, everything downstream fails.

---

## 🧩 CORE TABLE FILES

### Verification Cases
- `10_TABLES_VERIFICATION_CASES.sql`
  → Creates `CORE.VERIFICATION_CASES`
  → Core entry point for all workflows

---

### Verification Findings
- `11_TABLES_VERIFICATION_FINDINGS.sql`
  → Creates `CORE.VERIFICATION_FINDINGS`

⚠️ LIVE SCHEMA (CONFIRMED):
- CONTROL_ID (NOT RAW_CONTROL_ID)
- CONTROL_TITLE
- RESULT (NOT RESULT_RAW)
- RATIONALE
- SEVERITY
- EVIDENCE_IDS (ARRAY)

---

### Verification Evidence
- `12_TABLES_VERIFICATION_EVIDENCE.sql`
  → Creates `CORE.VERIFICATION_EVIDENCE`

---

### Verification Events
- `13_TABLES_VERIFICATION_EVENTS.sql`
  → Creates `CORE.VERIFICATION_EVENTS`
  → Drives lifecycle state:
    - submitted
    - review_started
    - evidence_reviewed
    - approved

---

### Decisions
- `17_TABLES_DECISIONS.sql`
  → Creates `CORE.DECISIONS`

⚠️ IMPORTANT FIELDS:
- CERTIFICATION_TIER
- CERTIFICATION_BAND
- DECISION_STATUS
- VALID_FROM / VALID_TO

---

### Score Snapshots (LIVE)
- `16_TABLES_CASE_SCORE_SNAPSHOTS.sql` (legacy reference)
- LIVE TABLE: `CORE.CASE_SCORE_SNAPSHOTS_V2`

⚠️ CONFIRMED STRUCTURE:
- CASE_ID
- MODEL_VERSION
- SCORE
- SUBSCORE_CONTROLS
- SUBSCORE_COVERAGE
- SUBSCORE_FRESHNESS
- SUBSCORE_OPERATIONAL
- TIER
- BAND
- RENEWAL_STATUS
- EVENTS_90D
- SCORED_AT
- CREATED_AT

⚠️ NOTE:
- `SNAPSHOT_AT` does NOT exist
- Using it causes failure

---

## 🧩 SCORING ENGINE FILES (CRITICAL)

### Enterprise Scoring Engine
- `GAFAIG - Governance Scoring (Enterprise v1.2).sql`

Defines:
- scoring logic
- scoring dependencies
- supporting views

---

### Stored Procedure
- `CORE.SP_SCORE_CASE_ENTERPRISE`

Purpose:
- executes scoring pipeline for a case

Current Behavior:
- returns ok = true
- returns rowsInserted = 0 ❌

Meaning:
- procedure runs
- but no score rows are produced

---

### Governance Score View (CRITICAL)
- `CORE.V_GOVERNANCE_SCORE_CASE`

Purpose:
- canonical score output
- required by publish procedure

Current Issue:
- rebuilt demo cases DO NOT appear here ❌
- publish depends on this → system blocked

---

### Supporting Scoring Views
- `CORE.V_CASE_SCORE_ENTERPRISE`
- `CORE.V_CASE_TIER_BAND`
- `CORE.V_CASE_RENEWAL_STATUS`
- `CORE.V_FINDING_UNMAPPED_CONTROLS`

Use:
- scoring diagnostics
- scoring decomposition

---

## 🧩 REGISTRY FILES

### Registry Snapshots
- `GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql`

Defines:
- `CORE.REGISTRY_SNAPSHOTS` (append-only)
- `CORE.V_REGISTRY_LATEST_APPROVED`

---

### Publish Procedure
- `GAFAIG - CORE.REGISTRY_PUBLISH.sql`

Contains:
- `SP_PUBLISH_CASE_TO_REGISTRY_V3`
- `SP_PUBLISH_CASE_TO_REGISTRY_V4`

Purpose:
- converts scored + approved case into registry record

Dependency:
- requires valid row in `V_GOVERNANCE_SCORE_CASE`

---

## 🧩 PUBLIC REGISTRY FILES

### Public Registry View
- `21_VIEWS_PUBLIC_REGISTRY.sql`

Defines:
- `CORE.V_REGISTRY_PUBLIC`

Purpose:
- canonical public dataset
- consumed by API + UI

---

### Public Search View
- `GAFAIG - Public Registry Search View.sql`

Defines:
- `CORE.V_REGISTRY_PUBLIC_SEARCH`

Purpose:
- search normalization
- uppercase + concatenated fields

---

## 🧩 AI SYSTEM REGISTRY FILES

### Table
- `14_TABLES_REGISTRY_AI_SYSTEMS.sql`

Creates:
- `CORE.REGISTRY_AI_SYSTEMS`

---

### Public View
- `V_REGISTRY_AI_SYSTEMS_PUBLIC`

Purpose:
- expose AI systems tied to registry records

---

## 🧩 DEMO / SEED FILES

### Primary Seed File
- `GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql`

Purpose:
- builds demo dataset end-to-end

Status:
- PARTIALLY WORKING
- loads data
- FAILS at scoring/publish

---

### Master Seed Orchestration
- `GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql`

Purpose:
- orchestrates seed execution

---

### Multi-Case Validation
- `GAFAIG - MULTI-CASE DEMO SCORE + PUBLISH + VALIDATION.sql`

Purpose:
- debug scoring + publish chain

---

### Run Order
- `GAFAIG - CANONICAL RUN ORDER.sql`

Purpose:
- defines correct execution sequence

---

### Backfill (Optional)
- `DATA_BACKFILL_DEMO_DECISIONS.sql`

Purpose:
- patch decisions if needed

⚠️ DO NOT USE to bypass scoring unless explicitly required

---

## 🔥 CURRENT SYSTEM FAILURE

The system currently behaves as:

1. CASES inserted ✅  
2. FINDINGS inserted ✅  
3. EVIDENCE inserted ✅  
4. EVENTS inserted ✅  
5. DECISIONS inserted ✅  
6. SCORING runs but produces 0 rows ❌  
7. V_GOVERNANCE_SCORE_CASE empty ❌  
8. PUBLISH produces nothing ❌  
9. V_REGISTRY_PUBLIC empty ❌  

---

## 🎯 ROOT CAUSE

NOT schema anymore  
NOT UI  
NOT API  

The issue is:

→ **SCORING INPUT CONTRACT FAILURE**

Meaning:
- seed data does NOT meet requirements expected by:
  - `SP_SCORE_CASE_ENTERPRISE`
  - `V_GOVERNANCE_SCORE_CASE`

---

## 🎯 ACTIVE DEBUG TARGET

Focus ONLY on:

- `SP_SCORE_CASE_ENTERPRISE`
- `V_GOVERNANCE_SCORE_CASE`

We must determine:
- required input fields
- required event states
- required relationships
- required control mappings

---

## ⚠️ DO NOT MODIFY WITHOUT CARE

- `GAFAIG - CORE.REGISTRY_PUBLISH.sql`
- `GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql`
- `21_VIEWS_PUBLIC_REGISTRY.sql`
- `GAFAIG - Governance Scoring (Enterprise v1.2).sql`

---

## SUMMARY

- Snowflake system is structurally correct
- Live schemas are now understood
- Seed file corrected for schema mismatches
- System is blocked at scoring layer
- Publish fails because scoring fails
- Fixing scoring visibility into `V_GOVERNANCE_SCORE_CASE` is the ONLY priority