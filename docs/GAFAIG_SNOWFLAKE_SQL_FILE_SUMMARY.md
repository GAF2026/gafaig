# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
# GAFAIG — Global Authority for AI Governance
# Snowflake SQL File Summary (Canonical)
# Last Updated: 2026-04-12

## OVERVIEW

This document defines the canonical Snowflake SQL file structure for GAFAIG.  
All platform logic, scoring, certification, registry publishing, and public outputs are defined and executed in Snowflake.

Snowflake is the **single source of truth**.

All files are organized by function:
- Core tables
- Workflow tables
- Scoring engine
- Registry publishing
- Public views
- Demo seed (canonical)

---

## CORE TABLES (FOUNDATIONAL)

### 10_TABLES_VERIFICATION_CASES.sql
Defines:
- CORE.VERIFICATION_CASES

Purpose:
- Entry point for all certification workflows
- Case-first architecture anchor

---

### 11_TABLES_VERIFICATION_FINDINGS.sql
Defines:
- CORE.VERIFICATION_FINDINGS

Purpose:
- Stores governance findings per case
- Drives scoring inputs

---

### 12_TABLES_VERIFICATION_EVIDENCE.sql
Defines:
- CORE.VERIFICATION_EVIDENCE

Purpose:
- Stores evidence supporting findings
- Links to findings via mapping table

---

### 13_TABLES_VERIFICATION_FINDING_EVIDENCE.sql
Defines:
- CORE.VERIFICATION_FINDING_EVIDENCE

Purpose:
- Many-to-many relationship between findings and evidence
- Critical for scoring validation

---

### 14_TABLES_VERIFICATION_EVENTS.sql
Defines:
- CORE.VERIFICATION_EVENTS

Purpose:
- Immutable audit trail of workflow actions
- Used for operational scoring signals

---

### 15_TABLES_CASE_SCORE_SNAPSHOTS.sql
Defines:
- CORE.CASE_SCORE_SNAPSHOTS_V2

Purpose:
- Stores deterministic scoring outputs
- Snapshot-based scoring model

---

### 17_TABLES_DECISIONS.sql
Defines:
- CORE.DECISIONS

Purpose:
- Stores certification decision outcomes
- Defines VALID_FROM / VALID_TO

---

### GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql
Defines:
- CORE.REGISTRY_SNAPSHOTS

Purpose:
- Append-only public certification records
- Immutable registry history

---

## AI SYSTEMS REGISTRY

### 14_TABLES_REGISTRY_AI_SYSTEMS.sql
Defines:
- CORE.REGISTRY_AI_SYSTEMS

Purpose:
- Stores AI system metadata linked to registry entries

---

## SCORING ENGINE (CANONICAL)

### GAFAIG - Governance Scoring (Enterprise v1.0).sql
Defines:
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CONTROL_SCORE_COMPONENTS
- Supporting scoring views

Purpose:
- Deterministic enterprise scoring engine
- Computes:
  - SCORE
  - SUBSCORES
  - EVENTS_90D

---

### V_CASE_TIER_BAND (defined within scoring files)
Purpose:
- Maps numeric score → TIER + BAND

---

### SP_SCORE_CASE_ENTERPRISE.sql
Defines:
- CORE.SP_SCORE_CASE_ENTERPRISE

Purpose:
- Executes scoring for a given CASE_ID
- Inserts into CASE_SCORE_SNAPSHOTS_V2

---

## REGISTRY PUBLISHING

### CORE.REGISTRY_PUBLISH.sql
Defines:
- SP_PUBLISH_CASE_TO_REGISTRY_V3 (canonical)

Purpose:
- Validates case readiness
- Creates registry snapshot
- Reuses REGISTRY_ID for existing entities
- Enforces append-only registry model

---

## PUBLIC REGISTRY VIEWS

### 21_VIEWS_PUBLIC_REGISTRY.sql
Defines:
- CORE.V_REGISTRY_LATEST_APPROVED
- CORE.V_REGISTRY_PUBLIC

Purpose:
- Canonical public registry projection
- Used by:
  - /registry
  - /registry/[registryId]

---

### V_REGISTRY_PUBLIC_SEARCH (same file or extension)
Purpose:
- Normalized search view
- Used by /api/registry/search

---

## AI SYSTEMS PUBLIC VIEW

### V_REGISTRY_AI_SYSTEMS_PUBLIC.sql
Defines:
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Purpose:
- Public projection of AI systems
- Used by:
  - /registry/ai-systems
  - /explorer/systems

---

## SCORE BREAKDOWN (PUBLIC)

### GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql
Defines:
- CORE.V_SCORE_DIMENSIONS_PUBLIC
- CORE.V_SCORE_COMPONENTS_PUBLIC

Purpose:
- Exposes scoring breakdown for UI
- Used by:
  - /api/registry/[registryId]/score-breakdown

---

## CANONICAL DEMO SEED

### GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql (LOCKED)

Purpose:
- Single canonical demo seed file
- Rebuilds full deterministic demo dataset

Responsibilities:
- Seed verification cases (if included)
- Rebuild workflow:
  - VERIFICATION_FINDINGS
  - VERIFICATION_EVIDENCE
  - VERIFICATION_FINDING_EVIDENCE
  - VERIFICATION_EVENTS
- Execute scoring:
  - SP_SCORE_CASE_ENTERPRISE
- Validate system state

Rules:
- Must be deterministic
- Must be idempotent
- Must not depend on temp tables
- Must use INSERT ... SELECT patterns
- Must not rely on external files

---

## RETIRED / ARCHIVED FILES

### GAFAIG - DEMO_CERTIFICATION_WORKFLOW_REBUILD.sql
Status:
- RETIRED

Reason:
- Caused drift and duplication
- Replaced by canonical seed master

Rule:
- Do NOT execute
- Do NOT depend on

---

## EXECUTION ORDER (CANONICAL)

1. Core table definitions
2. Scoring engine views
3. Registry snapshot logic
4. Public views
5. AI systems views
6. Canonical demo seed file

---

## CURRENT SYSTEM STATE (2026-04-12)

Working:
- Public registry views operational
- Explorer pages operational
- AI systems registry operational
- API layer operational

In Progress:
- Canonical demo workflow rebuild inside seed file

Issue:
- Workflow tables not fully populated:
  - VERIFICATION_FINDINGS
  - VERIFICATION_EVIDENCE
  - VERIFICATION_FINDING_EVIDENCE

Focus:
- Fix deterministic INSERT patterns in canonical seed file

---

## FINAL RULE

All Snowflake logic must:
- originate from canonical SQL files
- follow deterministic patterns
- remain aligned with system architecture

No logic may be moved to API or UI.

---

## END OF FILE