# GAFAIG CANONICAL RUN ORDER
Last Updated: 2026-04-13

This document defines the authoritative execution order for rebuilding, seeding, and validating the GAFAIG platform.

Snowflake is the source of truth.
Do not deviate from this sequence.
Do not use archive or legacy files.

---

## CORE PRINCIPLE

The GAFAIG system is strictly deterministic and follows this locked pipeline:

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

---

## CANONICAL EXECUTION ORDER

### 1. Core Environment Setup
- Set role, warehouse, database, schema
- Confirm:
  - GAFAIG_DB
  - CORE schema
  - GAFAIG_WH

---

### 2. Core Tables (Foundation Layer)
Run all core table creation files:
- Verification tables
- Evidence tables
- Findings tables
- Events tables
- Applications table
- Registry snapshot table
- Registry AI systems table

Critical tables include:
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_EVENTS
- CORE.APPLICATIONS
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

---

### 3. Verification Workflow Schema
Run:
- GAFAIG - Verification Workflow Schema.sql

This ensures:
- proper case lifecycle
- event tracking integrity
- canonical pipeline structure

---

### 4. Scoring Engine
Run:
- GAFAIG - Governance Scoring (Enterprise v1.2).sql

This enables:
- deterministic scoring
- dimension scoring
- enterprise scoring logic

Primary procedure:
- CORE.SP_SCORE_CASE_ENTERPRISE

---

### 5. Approval Layer
Run:
- GAFAIG - APPROVE_CASE_V1 Canonical.sql

Rules:
- DO NOT manually insert into DECISIONS
- Approval must flow through procedure

---

### 6. Registry Publish Layer
Run:
- GAFAIG - CORE.REGISTRY_PUBLISH.sql

This enables:
- REGISTRY_ID assignment
- snapshot creation (append-only)
- certification persistence

Primary procedure:
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3 (or latest canonical)

---

### 7. Public Registry Views

#### 7.1 Latest Approved Snapshot View
- V_REGISTRY_LATEST_APPROVED

Rule:
- MUST return exactly ONE ROW per CASE_ID
- Uses ROW_NUMBER() partition

---

#### 7.2 Public Registry View
- 21_VIEWS_PUBLIC_REGISTRY.sql

Rule:
- ONE ROW per CASE_ID
- Enriched with:
  - DECISIONS
  - APPLICATIONS
  - CERTIFICATION STATUS
  - LIFECYCLE STATUS

---

#### 7.3 AI Systems Public View
- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Rule:
- One-to-many allowed (multiple systems per case)
- Must join through REGISTRY_ID
- Must NOT multiply registry rows

---

#### 7.4 Score Dimensions Public View
- GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql

Provides:
- dimension-level transparency
- explorer + registry detail support

---

### 8. Canonical Demo Seed
Run:
- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql

Critical rules:
- MUST follow pipeline: seed → score → approve → publish
- MUST NOT set REGISTRY_AI_SYSTEMS.REGISTRY_ID to NULL
- MUST NOT bypass approval or publish procedures

---

### 9. Validation Queries

Registry (must return exactly 1 row):
SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = 'CASE-0001';

AI Systems (multiple rows expected):
SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC WHERE CASE_ID = 'CASE-0001';

Score Dimensions:
SELECT * FROM CORE.V_SCORE_DIMENSIONS_PUBLIC WHERE CASE_ID = 'CASE-0001' ORDER BY SCORE_DIMENSION;

---

## HARD RULES (DO NOT BREAK)

- Never compute scores in API or UI
- Never bypass stored procedures
- Never insert directly into DECISIONS
- Never modify REGISTRY_SNAPSHOTS manually
- Never allow duplicate rows in V_REGISTRY_LATEST_APPROVED
- Never allow duplicate rows in V_REGISTRY_PUBLIC
- Snowflake is always the source of truth

---

## COMMON FAILURE MODES

Duplicate registry rows
Cause:
- V_REGISTRY_LATEST_APPROVED not deduped
Fix:
- enforce ROW_NUMBER() = 1

Missing application_id
Cause:
- seed did not resolve APPLICATION_ID correctly
Fix:
- ensure COALESCE logic in V_REGISTRY_PUBLIC

Registry AI systems error (NULL registry_id)
Cause:
- seed script setting REGISTRY_ID = NULL
Fix:
- remove REGISTRY_ID update in seed

Score missing
Cause:
- scoring procedure not executed
Fix:
- ensure SP_SCORE_CASE_ENTERPRISE is called before approval

---

## FINAL STATE (SUCCESS)

When correct, system will produce:
- 1 registry row per case
- multiple AI systems per case
- full certification data
- lifecycle + renewal status
- explorer + registry pages aligned
- deterministic, reproducible results

---

## CANONICAL EXECUTION FLOW (LOCKED)

seed → score → approve → publish → snapshot → public views → API → UI

DO NOT CHANGE THIS ORDER.