# CURRENT_FOCUS.md
Last Updated: 2026-04-15

## PURPOSE
This document defines the **current execution focus** of the GAFAIG platform. It is the single source of truth for what we are working on RIGHT NOW. It must stay tightly aligned with MASTER_STATE.md and ENGINEERING_RULES.md. This is not a roadmap. This is the active execution state.

---

## CURRENT PHASE
System Phase: **SCORING → PUBLISH BLOCK RESOLUTION**

All frontend surfaces, APIs, and proof/signature systems are sufficiently stable for this phase. The platform is now blocked entirely within Snowflake at the scoring layer.

---

## PRIMARY OBJECTIVE
Restore full canonical pipeline execution:

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → PUBLISH → REGISTRY → PUBLIC VIEW

Specifically:

Fix:
SP_SCORE_CASE_ENTERPRISE → V_GOVERNANCE_SCORE_CASE → SP_PUBLISH_CASE_TO_REGISTRY_V3

---

## CURRENT BLOCKER

### Observed Behavior

- Cases inserted into CORE.VERIFICATION_CASES ✅  
- Findings inserted into CORE.VERIFICATION_FINDINGS ✅  
- Evidence inserted into CORE.VERIFICATION_EVIDENCE ✅  
- Events inserted into CORE.VERIFICATION_EVENTS ✅  
- Decisions inserted into CORE.DECISIONS ✅  
- SP_SCORE_CASE_ENTERPRISE executes successfully but returns rowsInserted = 0 ❌  
- V_GOVERNANCE_SCORE_CASE returns no rows for new cases ❌  
- SP_PUBLISH_CASE_TO_REGISTRY_V3 produces no registry snapshots ❌  
- V_REGISTRY_PUBLIC does not include new cases ❌  

---

## ROOT CAUSE (WORKING THEORY)

The system is experiencing a **SCORING INPUT CONTRACT FAILURE**.

Meaning:
- Seed data is structurally correct
- But does NOT meet the exact required inputs expected by the scoring engine
- Therefore scoring emits no rows
- Therefore publish has no valid input

---

## CONFIRMED NON-ISSUES

Do NOT waste time on:

- UI layout
- API endpoints
- registry page rendering
- explorer page rendering
- verify page rendering
- widget behavior
- signature/proof system
- Snowflake table existence
- basic schema mismatches (already resolved)

These are all functioning correctly.

---

## CRITICAL FILES IN SCOPE

### Snowflake (Primary Focus)

- GAFAIG - Governance Scoring (Enterprise v1.2).sql
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CASE_TIER_BAND
- CORE.V_CASE_RENEWAL_STATUS
- CORE.V_FINDING_UNMAPPED_CONTROLS
- CORE.CASE_SCORE_SNAPSHOTS_V2
- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql

---

## REQUIRED INVESTIGATION

We must determine EXACTLY:

### 1. Scoring Entry Conditions
- What conditions must be true for SP_SCORE_CASE_ENTERPRISE to insert rows?
- Required CASE status?
- Required EVENTS?
- Required timestamps?

---

### 2. Findings Requirements
- Required CONTROL_ID values?
- Required RESULT values?
- Required mapping to scoring framework?

---

### 3. Evidence Requirements
- Minimum evidence per finding?
- Required linkage via EVIDENCE_IDS array?

---

### 4. Event Requirements
- Required event types?
- Required sequence (submitted → review → approved)?
- Required timestamps?

---

### 5. Decision Dependencies
- Must decision exist BEFORE scoring?
- Or AFTER scoring?
- Does scoring depend on DECISION_STATUS?

---

### 6. Application / Org Linkage
- Does scoring require APPLICATION_ID?
- Does it require ORG_ID alignment across tables?

---

## DIAGNOSTIC STRATEGY

### Step 1
Identify a **known working legacy case** that successfully:
- appears in V_GOVERNANCE_SCORE_CASE
- was published to registry

---

### Step 2
Compare working case vs new seed case across:

- VERIFICATION_CASES
- VERIFICATION_FINDINGS
- VERIFICATION_EVIDENCE
- VERIFICATION_EVENTS
- DECISIONS

---

### Step 3
Identify missing or mismatched fields

---

### Step 4
Update seed file to match required contract

---

### Step 5
Re-run:

CALL CORE.SP_SCORE_CASE_ENTERPRISE('CASE-XXXX')

---

### Step 6
Verify:

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = 'CASE-XXXX';

---

### Step 7
Publish:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3('CASE-XXXX');

---

## SUCCESS CRITERIA

The system is considered unblocked when:

- SP_SCORE_CASE_ENTERPRISE inserts rows for new cases
- V_GOVERNANCE_SCORE_CASE returns rows for those cases
- SP_PUBLISH_CASE_TO_REGISTRY_V3 creates registry snapshots
- CORE.REGISTRY_SNAPSHOTS contains new rows
- CORE.V_REGISTRY_PUBLIC reflects new cases
- UI surfaces show expanded dataset

---

## DO NOT DO

- Do NOT modify registry views
- Do NOT bypass scoring
- Do NOT insert directly into REGISTRY_SNAPSHOTS
- Do NOT fabricate scores
- Do NOT change UI to “fake” data presence
- Do NOT create alternate pipelines

---

## NEXT STEP (IMMEDIATE)

Run side-by-side comparison:

Working CASE vs New CASE

Focus on:
- EVENTS
- FINDINGS (CONTROL_ID + RESULT)
- STATUS fields
- TIMESTAMPS

---

## AFTER BLOCK IS RESOLVED

Next phase:

**Registry Expansion + Market Readiness**

- expand demo dataset
- refine explorer UX
- enhance registry detail richness
- prepare investor-facing narrative
- finalize trust signaling

---

## SUMMARY

The GAFAIG platform is structurally complete and publicly functional. The only blocker is within Snowflake at the scoring layer. Fixing scoring restores the entire downstream system including publishing, registry growth, and certification issuance. All focus must remain on satisfying the scoring input contract.