# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-22

---

## PURPOSE

This document defines the canonical Snowflake SQL file structure for GAFAIG.

It establishes:
- Active canonical SQL files
- Execution order
- Trust-layer view responsibilities
- Procedure behavior
- System invariants

This file is the authoritative map of Snowflake as the GAFAIG governance engine.

---

## CORE PRINCIPLE

Snowflake is the single source of truth.

ALL:
- scoring
- certification logic
- lifecycle state
- registry publication
- trust classification

must originate from Snowflake.

NO logic is allowed in:
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
→ API  
→ UI  

---

## ACTIVE CANONICAL FILES

### ENVIRONMENT

- 00_CORE_SETUP.sql  
- 01_REBUILD_ENVIRONMENT_CANONICAL.sql  

Purpose:
- deterministic environment setup
- schema + role initialization
- full reset capability for reproducibility

---

### TABLES

- 11_TABLES_APPLICATIONS.sql  
- 12_TABLES_PARTICIPANTS.sql  ⚠️ (previous errors — must be validated before rebuild)
- 13_TABLES_FINDINGS.sql  
- 14_TABLES_EVIDENCE.sql  
- 15_TABLES_EVENTS.sql  ⚠️ (previous errors — must be validated before rebuild)
- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql  
- 17_TABLES_DECISIONS.sql  
- 18_TABLES_REGISTRY_ENTITIES.sql  
- REGISTRY_AI_SYSTEMS.sql  

Purpose:
- canonical storage layer
- must exactly match production schema
- supports append-only lifecycle behavior

---

### SCORING ENGINE (PRIMARY)

- GAFAIG - Governance Scoring (Enterprise v1.2).sql  

Creates:
- CORE.V_GOVERNANCE_SCORE_CASE  

Purpose:
- single authoritative scoring engine

Outputs:
- FINAL_SCORE  
- CERTIFIED_TIER  
- CERTIFIED_BAND  
- MODEL_VERSION  
- RENEWAL_STATUS  
- VALIDITY SIGNALS  

RULE:
No duplicate scoring logic anywhere else.

---

### SCORING SUPPORT VIEWS

- CORE.V_CASE_SCORE_ENTERPRISE  
- CORE.V_FINDING_RESULT_NORMALIZED  
- CORE.V_FINDING_UNMAPPED_CONTROLS  
- CORE.V_CASE_FINDING_AGG_ENTERPRISE  
- CORE.V_CASE_EVIDENCE_AGG_ENTERPRISE  
- CORE.V_CASE_EVENT_AGG_ENTERPRISE  

Purpose:
- normalize workflow inputs
- feed scoring engine deterministically

---

### PROCEDURES

- 23_SP_CREATE_CASE_FROM_APPLICATION.sql  
- 24_SP_SCORE_CASE_ENTERPRISE.sql  
- APPROVE_CASE_V1.sql  
- UNAPPROVE_CASE_V1.sql  
- GAFAIG - CORE.REGISTRY_PUBLISH.sql  

Purpose:
- deterministic workflow transitions
- enforce lifecycle correctness

---

### DECISION / LIFECYCLE

- 26_VIEWS_CASE_RENEWAL_STATUS.sql  

Creates:
- CORE.V_CASE_RENEWAL_STATUS  

Purpose:
- governs:
  - renewal status
  - lifecycle validity
  - publishability

Rule:
- lifecycle must be derived from decisions, not workflow state

---

## PUBLIC TRUST LAYER (CRITICAL)

### 1. REGISTRY CONTRACT

- 21_VIEWS_PUBLIC_REGISTRY.sql  

Creates:
- CORE.V_REGISTRY_PUBLIC  
- CORE.V_REGISTRY_LATEST_APPROVED  

Status:
- ACTIVE
- STABILIZED

Responsibilities:
- expose ONLY certified public registry records
- enforce:
  - latest decision row
  - approved status only
  - valid lifecycle (renewal aware)
  - no revoked records
  - no expired records

THIS FILE CONTROLS:
- registry UI
- explorer pages
- API outputs

---

### 2. AI SYSTEMS PUBLIC VIEW

- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

Creates:
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

Status:
- ACTIVE
- MUST BE STRICTLY ENFORCED

Responsibilities:
- one row per PUBLIC AI system
- join:
  - REGISTRY_AI_SYSTEMS
  - V_REGISTRY_PUBLIC

Rules:
- ONLY systems tied to public registry records
- MUST inherit:
  - certification status
  - tier
  - band
- MUST NOT expose:
  - TMP systems
  - workflow-only systems
  - non-certified systems

---

### 3. EXPLORER STATS

- 22_VIEWS_EXPLORER_STATS.sql  

Creates:
- CORE.V_EXPLORER_STATS  

Status:
- ACTIVE
- ALIGNED

Responsibilities:
- aggregate:
  - public records
  - certified records
  - organizations
  - countries

Rules:
- must match V_REGISTRY_PUBLIC exactly
- must not double count
- must not derive from workflow tables

---

### 4. SCORE TRANSPARENCY LAYER

- GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql  

Creates:
- CORE.V_SCORE_BREAKDOWN_PUBLIC  
- CORE.V_SCORE_DIMENSIONS_PUBLIC  

Purpose:
- expose scoring transparency

Rules:
- derived from snapshots only
- no recomputation allowed
- consistent with scoring engine output

---

## CANONICAL SEED

### ACTIVE

- GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql  

Purpose:
- full deterministic dataset:
  - applications
  - cases
  - findings
  - evidence
  - events
  - scores
  - decisions
  - registry snapshots
  - AI systems

Rules:
- ONLY seed file allowed
- must produce reproducible state
- must not introduce randomness

---

### ARCHIVED (DO NOT USE)

- CANONICAL_DEMO_SEED_MASTER.sql  
- FINAL_CANONICAL_CASE_0001_SEED.sql  
- SAFE_MULTI_CASE_EXPANSION V2.sql  
- all demo/test seed files  

Reason:
- introduce drift
- break determinism
- create conflicting data states

---

## EXECUTION ORDER (MANDATORY)

1. 01_REBUILD_ENVIRONMENT_CANONICAL.sql  
2. TABLES (11 → 18)  
3. SCORING SUPPORT VIEWS  
4. SCORING ENGINE  
5. LIFECYCLE VIEW (26)  
6. PUBLIC VIEWS (21, 22)  
7. PROCEDURES  
8. FINAL_CANONICAL_MULTI_SEED.sql  
9. CALL SP_SCORE_CASE_ENTERPRISE  
10. CALL APPROVE_CASE_V1  
11. CALL SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

## VALIDATION QUERIES

```sql
SELECT * FROM CORE.V_REGISTRY_PUBLIC;
SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;

SELECT
  CERTIFICATION_STATUS,
  COUNT(*) AS RECORDS
FROM CORE.V_REGISTRY_PUBLIC
GROUP BY 1;

SELECT * FROM CORE.V_EXPLORER_STATS;

SELECT
  CASE_ID,
  FINAL_SCORE,
  CERTIFIED_TIER,
  CERTIFIED_BAND
FROM CORE.V_GOVERNANCE_SCORE_CASE;

SELECT
  CASE_ID,
  RENEWAL_STATUS,
  IS_CURRENTLY_VALID,
  IS_PUBLISHABLE
FROM CORE.V_CASE_RENEWAL_STATUS;