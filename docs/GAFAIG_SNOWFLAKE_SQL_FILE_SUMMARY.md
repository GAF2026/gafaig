# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-16

---

## PURPOSE

This document defines the canonical Snowflake SQL file structure for GAFAIG.

It establishes:
- Which files are ACTIVE (canonical)
- Which files are ARCHIVED (legacy)
- Which files must be FIXED before production
- The correct execution order of the system

This file is the source of truth for Snowflake structure.

---

## CORE PRINCIPLE

Snowflake is the single source of truth.

ALL:
- scoring
- certification logic
- registry publication
- trust state

must originate from Snowflake.

No logic is allowed in:
- API
- UI

---

## CANONICAL DATA FLOW

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

## ACTIVE CANONICAL FILES

### ENVIRONMENT

- 00_CORE_SETUP.sql
- 01_REBUILD_ENVIRONMENT_CANONICAL.sql

Purpose:
- Initialize database, schema, roles
- Reset environment deterministically

---

### TABLES

- 11_TABLES_APPLICATIONS.sql
- 13_TABLES_FINDINGS.sql
- 14_TABLES_EVIDENCE.sql
- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql
- 17_TABLES_DECISIONS.sql
- 18_TABLES_REGISTRY_ENTITIES.sql
- REGISTRY_AI_SYSTEMS.sql

Purpose:
- Define canonical storage layer
- Must match production schema exactly

---

### VIEWS (CRITICAL TRUST LAYER)

#### 1. REGISTRY CONTRACT (FOUNDATIONAL)

- 21_VIEWS_PUBLIC_REGISTRY.sql

Status:
- ACTIVE
- REQUIRES FIX

Responsibilities:
- Define V_REGISTRY_LATEST_APPROVED
- Define V_REGISTRY_PUBLIC

Critical Requirements:
- Approved ≠ Certified
- CERTIFIED_AT must represent certification, not approval
- DECISION_STATUS must be correct
- LIFECYCLE_STATUS must be correct
- Only published/certified records exposed

THIS FILE CONTROLS:
- Registry UI
- Explorer trust state
- API outputs
- Score exposure

---

#### 2. AI SYSTEMS PUBLIC SURFACE

- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Status:
- ACTIVE
- CORRECT STRUCTURE

Responsibilities:
- One row per system
- Join to V_REGISTRY_PUBLIC on CASE_ID
- Expose system metadata + trust metadata

Rules:
- Do NOT compute scoring here
- Do NOT fabricate fields
- Use only:
  - REGISTRY_AI_SYSTEMS
  - V_REGISTRY_PUBLIC

Depends on:
- Correct V_REGISTRY_PUBLIC semantics

---

#### 3. EXPLORER STATS

- 22_VIEWS_EXPLORER_STATS.sql

Status:
- ACTIVE
- REQUIRES FIX

Responsibilities:
- Aggregate:
  - total records
  - certified
  - approved
  - countries
  - tiers
  - bands
  - entity types

Current Issues:
- Derived only from V_REGISTRY_PUBLIC (too narrow)
- Misaligned with Explorer surface
- Causes incorrect UI summary pills

Must be corrected to:
- Align with actual public system surface
- Avoid double counting
- Correct trust-state classification

---

#### 4. SCORE BREAKDOWN (PUBLIC)

- GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql

Status:
- ACTIVE
- DEPENDENT ON REGISTRY FIX

Responsibilities:
- Provide:
  - V_SCORE_BREAKDOWN_PUBLIC
  - V_SCORE_DIMENSIONS_PUBLIC

Rules:
- No recomputation of scores
- Only expose values from CASE_SCORE_SNAPSHOTS
- Respect registry trust boundaries

Depends on:
- Correct V_REGISTRY_PUBLIC semantics

---

### PROCEDURES

- 23_SP_CREATE_CASE_FROM_APPLICATION.sql
- 24_SP_SCORE_CASE_ENTERPRISE.sql
- APPROVE_CASE_V1.sql
- CORE.REGISTRY_PUBLISH.sql

Purpose:
- Drive workflow execution
- Ensure deterministic transitions:
  - Application → Case
  - Case → Score
  - Score → Decision
  - Decision → Registry

Critical:
- REGISTRY_PUBLISH must:
  - Enforce approval → certification gating
  - Reuse registry IDs
  - Prevent duplicates

---

## CANONICAL SEED FILE

### ACTIVE

- GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Purpose:
- Seed full deterministic dataset:
  - Applications
  - Cases
  - Findings
  - Evidence
  - Events
  - Scores
  - Decisions
  - Registry entries
  - AI systems

Rules:
- This is the ONLY active seed file
- Must follow full pipeline
- Must produce consistent counts

---

### ARCHIVED (DO NOT USE)

- CANONICAL_DEMO_SEED_MASTER.sql
- FINAL_CANONICAL_CASE_0001_SEED.sql
- SAFE_MULTI_CASE_EXPANSION V2.sql
- Canonical Demo Seed.sql
- Demo Dataset files
- Any experimental or partial seed scripts

Reason:
- Cause data drift
- Create inconsistent trust surfaces

---

## EXECUTION ORDER (MANDATORY)

Run in this exact order:

1. 01_REBUILD_ENVIRONMENT_CANONICAL.sql
2. All TABLES files
3. All VIEW files (including registry + AI systems)
4. PROCEDURES
5. FINAL_CANONICAL_MULTI_SEED.sql
6. SCORING procedure
7. APPROVAL procedure
8. REGISTRY publish procedure

---

## VALIDATION QUERIES

After execution:

SELECT * FROM CORE.V_REGISTRY_PUBLIC;
SELECT * FROM CORE.V_REGISTRY_LATEST_APPROVED;

SELECT
  DECISION_STATUS,
  CERTIFICATION_STATUS,
  COUNT(*) AS RECORDS
FROM CORE.V_REGISTRY_PUBLIC
GROUP BY 1,2;

SELECT * FROM CORE.V_REGISTRY_STATS_GLOBAL;
SELECT * FROM CORE.V_REGISTRY_STATS_BY_COUNTRY;
SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;

---

## CURRENT ISSUES (IN PROGRESS)

- V_REGISTRY_PUBLIC incorrectly conflates Approved and Certified
- Explorer stats not aligned with system truth
- Summary counts incorrect
- Legacy seed files causing conflicts
- Public trust surface not deterministic

---

## CURRENT PRIORITY

1. Fix 21_VIEWS_PUBLIC_REGISTRY.sql
2. Fix 22_VIEWS_EXPLORER_STATS.sql
3. Re-run canonical seed
4. Validate pipeline
5. Align UI with corrected data
6. Archive non-canonical files

---

## FINAL TARGET STATE

System must produce:

- Deterministic outputs
- Correct trust classification
- Accurate counts across:
  - Explorer
  - Registry
  - API
- Zero ambiguity between:
  - Approved
  - Certified
- Clean, minimal SQL file set

---

## DO NOT BREAK

- Snowflake as source of truth
- Canonical data flow
- Single seed system
- No duplicate registry logic
- No UI-derived values
- No mixing of trust states

---

END OF FILE