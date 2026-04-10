# GAFAIG — SNOWFLAKE SQL FILE SUMMARY (CANONICAL) — 2026-04-10

## OVERVIEW
This document defines all active Snowflake SQL files used to operate the GAFAIG platform.

GAFAIG is a deterministic, append-only, Snowflake-native verification and registry system.

All computation, scoring, certification, and registry publishing occur in Snowflake.

The SQL layer is the core of the system. The API and UI are read-only projections.

---

## CORE PRINCIPLES

- Snowflake is the source of truth
- Append-only architecture (no updates, only inserts)
- Deterministic computation
- Procedures control all state transitions
- Views power all public surfaces
- No business logic outside Snowflake

---

## FILE GROUPING

The SQL files are grouped into:

1) TABLES (Data storage)
2) VIEWS (Computation + projection)
3) PROCEDURES (Workflow + state transitions)
4) PUBLIC TRUST LAYER (Safe exposure)

---

## TABLE FILES

### 01_TABLES_APPLICATIONS.sql
Creates:
CORE.APPLICATIONS

Purpose:
Stores inbound applications submitted to GAFAIG.

Key Fields:
- APPLICATION_ID
- REQUEST_ID
- CREATED_AT

---

### 02_TABLES_VERIFICATION_CASES.sql
Creates:
CORE.VERIFICATION_CASES

Purpose:
Creates deterministic CASE_ID tied to applications.

Key Fields:
- CASE_ID
- APPLICATION_ID
- STATUS
- CREATED_AT

---

### 03_TABLES_VERIFICATION_EVENTS.sql
Creates:
CORE.VERIFICATION_EVENTS

Purpose:
Append-only lifecycle log of case progression.

Key Fields:
- EVENT_ID
- CASE_ID
- EVENT_TYPE
- EVENT_DATA (VARIANT)
- CREATED_AT

---

### 04_TABLES_FINDINGS.sql
Creates:
CORE.VERIFICATION_FINDINGS

Purpose:
Stores structured reviewer findings.

---

### 05_TABLES_EVIDENCE.sql
Creates:
CORE.VERIFICATION_EVIDENCE

Purpose:
Stores supporting evidence for findings.

---

### 06_TABLES_FINDING_EVIDENCE_LINKS.sql
Creates:
CORE.FINDING_EVIDENCE_LINKS

Purpose:
Maps findings to evidence.

---

### 16_TABLES_CASE_SCORE_SNAPSHOTS.sql
Creates:
CORE.CASE_SCORE_SNAPSHOTS

Purpose:
Stores deterministic scoring outputs.

Key Fields:
- CASE_ID
- FINAL_SCORE
- TIER
- BAND
- CREATED_AT

---

### 17_TABLES_DECISIONS.sql
Creates:
CORE.VERIFICATION_DECISIONS

Purpose:
Stores certification decisions.

Key Fields:
- CASE_ID
- DECISION_STATUS
- DECIDED_AT

---

### GAFAIG – CORE.REGISTRY_SNAPSHOTS.sql
Creates:
CORE.REGISTRY_SNAPSHOTS

Purpose:
Append-only public certification records.

Key Fields:
- REGISTRY_ID
- CASE_ID
- ENTITY_NAME
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT

---

### 14_TABLES_REGISTRY_AI_SYSTEMS.sql
Creates:
CORE.REGISTRY_AI_SYSTEMS

Purpose:
Stores AI systems associated with registry entries.

---

## VIEW FILES

### 21_VIEWS_PUBLIC_REGISTRY.sql

Creates:

#### CORE.V_REGISTRY_LATEST_APPROVED
- Latest approved snapshot per case

#### CORE.V_REGISTRY_PUBLIC
- Canonical public registry view

#### CORE.V_REGISTRY_PUBLIC_SEARCH
- Search-optimized registry view

Purpose:
These views power all registry APIs and UI.

---

### V_GOVERNANCE_SCORE_CASE (Defined in scoring files)

Purpose:
Canonical scoring output.

Outputs:
- FINAL_SCORE
- TIER
- BAND

RULE:
This is the ONLY valid scoring source.

---

### V_CONTROL_SCORE_COMPONENTS

Purpose:
Control-level scoring components used internally.

Feeds:
- Score breakdown layer

---

### V_CASE_TIER_BAND

Purpose:
Maps scores into tiers and bands.

---

### V_CASE_RENEWAL_STATUS

Purpose:
Determines certification validity / renewal timing.

---

### V_REGISTRY_AI_SYSTEMS_PUBLIC

Purpose:
Public projection of AI systems linked to registry entries.

---

## PROCEDURE FILES

### 23_SP_CREATE_CASE_FROM_APPLICATION.sql

Procedure:
CORE.SP_CREATE_CASE_FROM_APPLICATION

Purpose:
Creates CASE_ID from application.

Responsibilities:
- Normalize input IDs
- Resolve latest application
- Insert case if not exists
- Insert lifecycle event

---

### 24_SP_SCORE_CASE_ENTERPRISE.sql

Procedure:
CORE.SP_SCORE_CASE_ENTERPRISE

Purpose:
Computes deterministic governance score.

Outputs:
- FINAL_SCORE
- TIER
- BAND

Writes to:
CORE.CASE_SCORE_SNAPSHOTS

---

### 25_PROCEDURES_APPROVAL.sql

Procedure:
Approval procedure

Purpose:
Insert certification decision.

---

### CORE.REGISTRY_PUBLISH.sql

Procedure:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3 / V4

Purpose:
Publishes approved cases to registry.

Responsibilities:
- Validate approval
- Generate or reuse REGISTRY_ID
- Insert append-only snapshot

---

## PUBLIC TRUST LAYER (CRITICAL)

### GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql

Creates:

#### CORE.V_SCORE_BREAKDOWN_PUBLIC
- Control-level normalized output

#### CORE.V_SCORE_DIMENSIONS_PUBLIC
- Dimension-level aggregation (PUBLIC SAFE)

Purpose:
Transforms internal scoring into public-safe trust explanation.

---

## SCORE BREAKDOWN CONTRACT

REQUIRED OUTPUT:

CORE.V_SCORE_BREAKDOWN_PUBLIC
- CASE_ID
- DIMENSION
- COMPONENT_NAME
- COMPONENT_SCORE

CORE.V_SCORE_DIMENSIONS_PUBLIC
- CASE_ID
- DIMENSION
- DIMENSION_SCORE
- CONTROLS_COUNT

---

## GOVERNANCE DIMENSIONS (CANONICAL — LOCKED)

ALL scoring must map to exactly FIVE dimensions:

1) Transparency
2) Accountability
3) Safety & Risk Management
4) Human Oversight
5) Data Governance

RULE:
- No variation (NOT 3, NOT 12)
- Must remain consistent across all views and UI

---

## DATA FLOW CONNECTION

TABLES → VIEWS → PROCEDURES → SNAPSHOTS → PUBLIC VIEWS → API → UI

Specifically:

FINDINGS + EVIDENCE  
→ V_CONTROL_SCORE_COMPONENTS  
→ V_GOVERNANCE_SCORE_CASE  
→ CASE_SCORE_SNAPSHOTS  
→ VERIFICATION_DECISIONS  
→ REGISTRY_SNAPSHOTS  
→ V_REGISTRY_PUBLIC  
→ API  
→ UI  

Score Breakdown:

V_CONTROL_SCORE_COMPONENTS  
→ V_SCORE_BREAKDOWN_PUBLIC  
→ V_SCORE_DIMENSIONS_PUBLIC  
→ API  
→ UI  

---

## SNOWFLAKE RULES (CRITICAL)

- Use INSERT ... SELECT for VARIANT fields
- Use :variable binding in procedures
- Avoid TRY_CAST misuse (strict numeric casting)
- Avoid REGEXP_LIKE (use LIKE for compatibility)
- All identifiers must be uppercase and trimmed
- Never mutate existing records
- Always append new snapshots

---

## CURRENT SYSTEM STATUS (2026-04-10)

STABLE:
✔ Core tables  
✔ Scoring pipeline  
✔ Decision pipeline  
✔ Registry publish  
✔ Public registry views  
✔ AI systems registry  

NEW:
✔ Public trust explanation layer  
✔ Score breakdown views  
✔ Dimension normalization to 5  

FIXED:
✔ TRY_CAST errors  
✔ REGEXP_LIKE incompatibility  
✔ Column mismatches  
✔ Dimension inconsistency  

---

## FINAL NOTE

This SQL layer IS GAFAIG.

Everything else (API, UI, badge, verification) is a projection.

If it is not in Snowflake, it does not exist.