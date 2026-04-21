# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-21

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

---

### TABLES

- 11_TABLES_APPLICATIONS.sql  
- 12_TABLES_PARTICIPANTS.sql  
- 13_TABLES_FINDINGS.sql  
- 14_TABLES_EVIDENCE.sql  
- 15_TABLES_EVENTS.sql  
- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql  
- 17_TABLES_DECISIONS.sql  
- 18_TABLES_REGISTRY_ENTITIES.sql  
- REGISTRY_AI_SYSTEMS.sql  

Purpose:
- canonical storage layer
- must match production schema exactly

---

### SCORING ENGINE

- GAFAIG - Governance Scoring (Enterprise v1.2).sql  

Creates:
- CORE.V_GOVERNANCE_SCORE_CASE  

Purpose:
- single authoritative scoring engine

Outputs:
- FINAL_SCORE  
- TIER  
- BAND  
- MODEL_VERSION  
- RENEWAL_STATUS  

RULE:
No duplicate scoring logic anywhere else.

---

### SCORING SUPPORT VIEWS

- V_CASE_SCORE_ENTERPRISE  
- V_FINDING_RESULT_NORMALIZED  
- V_FINDING_UNMAPPED_CONTROLS  

Purpose:
- feed canonical scoring engine

---

### PROCEDURES

- 23_SP_CREATE_CASE_FROM_APPLICATION.sql  
- 24_SP_SCORE_CASE_ENTERPRISE.sql  
- APPROVE_CASE_V1.sql  
- UNAPPROVE_CASE_V1.sql  
- GAFAIG - CORE.REGISTRY_PUBLISH.sql  

Purpose:
- deterministic workflow transitions

---

### DECISION / LIFECYCLE

- 26_VIEWS_CASE_RENEWAL_STATUS.sql  

Creates:
- CORE.V_CASE_RENEWAL_STATUS  

Purpose:
- governs:
  - renewal status
  - validity
  - publishability

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
- expose only public certified registry records
- enforce:
  - latest decision
  - approved only
  - valid lifecycle
  - no revoked/expired leakage

THIS FILE CONTROLS:
- registry UI
- explorer trust surface
- API outputs

---

### 2. AI SYSTEMS PUBLIC VIEW

- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

Creates:
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

Status:
- ACTIVE
- STRUCTURALLY CORRECT

Responsibilities:
- one row per public system
- join:
  - REGISTRY_AI_SYSTEMS
  - V_REGISTRY_PUBLIC

Rules:
- ONLY public systems allowed
- MUST inherit certification fields from registry
- MUST NOT expose workflow-only systems (TMP IDs)

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

Rule:
- must match registry truth exactly
- must not double count

---

### 4. SCORE BREAKDOWN PUBLIC

- GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql  

Creates:
- CORE.V_SCORE_BREAKDOWN_PUBLIC  
- CORE.V_SCORE_DIMENSIONS_PUBLIC  

Purpose:
- expose scoring transparency layer

Rule:
- no recomputation
- snapshot-derived only

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
  - registry records
  - AI systems

Rule:
- ONLY seed file allowed

---

### ARCHIVED (DO NOT USE)

- CANONICAL_DEMO_SEED_MASTER.sql  
- FINAL_CANONICAL_CASE_0001_SEED.sql  
- SAFE_MULTI_CASE_EXPANSION V2.sql  
- Demo dataset files  

Reason:
- cause drift
- break determinism

---

## EXECUTION ORDER (MANDATORY)

1. 01_REBUILD_ENVIRONMENT_CANONICAL.sql  
2. TABLES  
3. VIEWS  
4. PROCEDURES  
5. FINAL_CANONICAL_MULTI_SEED.sql  
6. SP_SCORE_CASE_ENTERPRISE  
7. APPROVE_CASE_V1  
8. SP_PUBLISH_CASE_TO_REGISTRY_V3  

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