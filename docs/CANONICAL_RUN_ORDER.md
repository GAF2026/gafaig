# CANONICAL_RUN_ORDER.md — Last Updated: 2026-04-19

## PURPOSE

This document defines the exact canonical execution order for rebuilding and running the GAFAIG system in Snowflake.

It ensures:
- Deterministic system initialization
- Correct dependency sequencing
- Zero schema drift
- Full pipeline integrity

This is the ONLY valid execution order.

Any deviation is a system violation.

---

## CORE PRINCIPLE

Execution must follow strict dependency order:

Tables → Views → Procedures → Seed → Pipeline Execution → Validation

No step may be skipped.  
No step may be reordered.  
No partial execution allowed when performing a full rebuild.

---

## EXECUTION MODES

GAFAIG supports two execution modes:

### 1. FULL REBUILD MODE (PRIMARY)

Used for:
- Initial system setup
- Full system reset
- End-to-end validation

This mode executes ALL files in canonical order.

---

### 2. INCREMENTAL MODE (ADVANCED)

Used for:
- Targeted updates
- Minor fixes

Rules:
- Only allowed after FULL REBUILD has been validated
- Must not break pipeline integrity
- Must not skip dependencies

---

## FULL REBUILD ORDER (CANONICAL)

### STEP 0 — ENVIRONMENT SETUP

Run:

00_CORE_SETUP.sql

Purpose:
- Set role
- Set warehouse
- Set database
- Set schema

---

### STEP 1 — APPLICATION LAYER

Run:

11_TABLES_APPLICATIONS.sql

Purpose:
- Create CORE.APPLICATIONS
- Establish ingestion layer

---

### STEP 2 — PARTICIPANTS (ENTITY LAYER)

Run:

12_TABLES_PARTICIPANTS.sql

Purpose:
- Create CORE.PARTICIPANTS
- Normalize entity/participant data
- Ensure deterministic PARTICIPANT_ID

Important:
- If Snowflake DDL/DML conflict occurs, run backfill updates separately

---

### STEP 3 — REGISTRY AI SYSTEMS

Run:

14_TABLES_REGISTRY_AI_SYSTEMS.sql

Purpose:
- Create CORE.REGISTRY_AI_SYSTEMS
- Define system-level registry records

---

### STEP 4 — EVENTS (COMPATIBILITY LAYER)

Run:

15_TABLES_EVENTS.sql

Purpose:
- Create CORE.EVENTS
- Mirror CORE.VERIFICATION_EVENTS for compatibility

Rules:
- Must NOT replace VERIFICATION_EVENTS
- Must remain aligned to canonical workflow

---

### STEP 5 — SCORING SNAPSHOTS

Run:

16_TABLES_CASE_SCORE_SNAPSHOTS.sql

Purpose:
- Create CORE.CASE_SCORE_SNAPSHOTS
- Store deterministic scoring outputs

---

### STEP 6 — DECISION LAYER

Run:

17_TABLES_DECISIONS.sql

Purpose:
- Create CORE.DECISIONS
- Store approval/rejection outcomes

---

### STEP 7 — REGISTRY ENTITIES

Run:

18_TABLES_REGISTRY_ENTITIES.sql

Purpose:
- Define registry entity relationships
- Support registry-level joins

---

### STEP 8 — PUBLIC REGISTRY VIEWS

Run:

21_VIEWS_PUBLIC_REGISTRY.sql

Purpose:
- Create V_REGISTRY_PUBLIC
- Create V_REGISTRY_LATEST_APPROVED
- Define public registry contract

---

### STEP 9 — AI SYSTEMS PUBLIC VIEW

Run:

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Purpose:
- Create V_REGISTRY_AI_SYSTEMS_PUBLIC
- Join systems to registry records

---

### STEP 10 — PROCEDURES

Run:

25_PROCEDURES_APPROVAL.sql

Purpose:
- Create SP_CREATE_CASE_FROM_APPLICATION
- Create SP_SCORE_CASE_ENTERPRISE
- Create SP_PUBLISH_CASE_TO_REGISTRY_V3

---

### STEP 11 — SEED DATA

Run:

GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

Purpose:
- Populate APPLICATIONS
- Populate CASES
- Populate FINDINGS
- Populate EVIDENCE
- Populate EVENTS
- Populate SYSTEMS

Rules:
- Only seed file allowed
- Must be deterministic
- Must not use manual inserts

---

## PIPELINE EXECUTION ORDER

After seed is complete:

### STEP 12 — CREATE CASES (IF NEEDED)

Run:

CALL CORE.SP_CREATE_CASE_FROM_APPLICATION('<APPLICATION_ID>');

---

### STEP 13 — RUN SCORING

Run:

CALL CORE.SP_SCORE_CASE_ENTERPRISE('<CASE_ID>');

---

### STEP 14 — ISSUE DECISION

Decision is inserted into:

CORE.DECISIONS

Must include:
- DECISION_STATUS
- VALID_FROM
- VALID_TO

---

### STEP 15 — PUBLISH TO REGISTRY

Run:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3('<CASE_ID>');

---

## VALIDATION CHECKS

After full pipeline execution, run:

### APPLICATION → CASE

SELECT COUNT(*) FROM CORE.APPLICATIONS;
SELECT COUNT(*) FROM CORE.VERIFICATION_CASES;

---

### CASE → FINDINGS

SELECT COUNT(*) FROM CORE.VERIFICATION_FINDINGS;

---

### FINDINGS → EVIDENCE

SELECT COUNT(*) FROM CORE.VERIFICATION_EVIDENCE;

---

### EVENTS

SELECT COUNT(*) FROM CORE.VERIFICATION_EVENTS;

---

### SCORING

SELECT COUNT(*) FROM CORE.CASE_SCORE_SNAPSHOTS;

---

### DECISIONS

SELECT COUNT(*) FROM CORE.DECISIONS;

---

### REGISTRY

SELECT COUNT(*) FROM CORE.REGISTRY_SNAPSHOTS;
SELECT COUNT(*) FROM CORE.V_REGISTRY_PUBLIC;

---

## SUCCESS CRITERIA

System is valid when:

- All tables exist
- All views return expected data
- No null critical fields
- All joins resolve correctly
- Scores exist for approved cases
- Decisions exist for scored cases
- Registry snapshots exist for approved cases
- Public views reflect certified records

---

## FAILURE CONDITIONS

System is invalid if:

- Any step is skipped
- Tables are missing
- Views return empty unexpectedly
- IDs are non-deterministic
- Registry snapshot missing
- Signature cannot be generated

---

## NON-NEGOTIABLE RULES

- Must follow exact order
- Must not run archive/legacy files
- Must not mix canonical and non-canonical files
- Must not manually alter data outside procedures
- Must not skip validation

---

## ENFORCEMENT

This document defines the canonical execution order for GAFAIG.

Any deviation:
- breaks pipeline integrity
- breaks determinism
- invalidates system trust

All execution must follow this sequence exactly.

---

END OF FILE