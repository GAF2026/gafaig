# CURRENT_FOCUS.md
Last Updated: 2026-04-16

---

## PURPOSE

This document defines the current execution focus for GAFAIG.

It acts as:
- The active control layer for development
- The priority list for all work
- The guardrail against drift

All work must align with this document.

---

## CURRENT PHASE

SNOWFLAKE CANONICALIZATION PHASE

This is the most critical phase of the system build.

Goal:
- Eliminate all ambiguity
- Establish deterministic data outputs
- Lock the public trust contract

No UI work should proceed ahead of this phase.

---

## PRIMARY OBJECTIVE

Stabilize the Snowflake layer so that:

- All public views are correct
- All counts are accurate
- All trust states are deterministic
- All downstream layers (API, UI) become passive

---

## CORE PROBLEM

The system currently has:

- Mixed seed data sources (now consolidated but must validate)
- Incorrect registry semantics
- Explorer stats misalignment
- Approved vs Certified conflation
- Non-deterministic public outputs

These must be resolved before proceeding.

---

## ACTIVE WORKSTREAMS

---

### 1. REGISTRY CONTRACT FIX (HIGHEST PRIORITY)

File:
- 21_VIEWS_PUBLIC_REGISTRY.sql

Issues:
- Approved incorrectly treated as Certified
- CERTIFIED_AT mapped incorrectly
- Lifecycle states unclear

Actions:
- Separate Approved vs Certified
- Correct CERTIFIED_AT logic
- Ensure only certified records appear in V_REGISTRY_PUBLIC
- Preserve correct DECISION_STATUS and LIFECYCLE_STATUS

This is the root of all system issues.

---

### 2. AI SYSTEMS PUBLIC SURFACE VALIDATION

File:
- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Status:
- Structurally correct

Action:
- Re-validate after registry contract fix
- Ensure:
  - correct trust fields
  - correct country mapping
  - no duplicated or missing rows

---

### 3. EXPLORER STATS CORRECTION

File:
- 22_VIEWS_EXPLORER_STATS.sql

Issues:
- Counts do not match seed data
- Incorrect aggregation source
- Misclassification of trust states

Actions:
- Align with canonical registry and system views
- Ensure accurate:
  - total records
  - certified count
  - approved count
  - country count
- Remove any incorrect assumptions

---

### 4. SCORE BREAKDOWN VALIDATION

File:
- GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql

Status:
- Dependent on registry fix

Actions:
- Ensure:
  - no recomputation of scores
  - aligns with CASE_SCORE_SNAPSHOTS
  - respects trust boundaries
- Confirm correct exposure of scoring dimensions

---

### 5. SEED SYSTEM VALIDATION

File:
- GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Actions:
- Confirm full pipeline execution:
  APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY → SYSTEMS
- Ensure:
  - no missing relationships
  - no duplicates
  - stable counts

---

### 6. PIPELINE VALIDATION

Re-run full system:

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEWS

Verify:
- deterministic outputs
- no null propagation
- correct joins
- correct lifecycle transitions

---

### 7. FILE SYSTEM CLEANUP

Actions:
- Keep only canonical SQL files
- Archive all legacy/demo/duplicate files
- Ensure one source per:
  - seed
  - registry logic
  - scoring logic

---

## TEMPORARILY PAUSED

The following are paused until Snowflake is correct:

- Explorer UI fixes
- Registry UI updates
- Layout refinements
- Badge improvements
- Widget enhancements

Reason:
- UI depends on correct data
- Fixing UI now causes rework

---

## SUCCESS CRITERIA

This phase is complete when:

- V_REGISTRY_PUBLIC is correct
- Explorer stats match seed data exactly
- Approved vs Certified is clearly separated
- Counts match across:
  - Snowflake
  - API
  - UI
- No duplicate or conflicting SQL files remain

---

## NEXT PHASE (AFTER COMPLETION)

Once canonicalization is complete:

1. UI alignment pass
2. Explorer page refinement
3. Registry page authority enhancements
4. Verification UX improvements
5. Widget + external integration polish

---

## WORKING RULES

- Do not re-architect
- Do not introduce new data flows
- Do not create duplicate SQL files
- Do not compute logic in UI or API
- Do not proceed to UI before Snowflake is correct

---

## FINAL DIRECTIVE

Everything depends on Snowflake correctness.

If Snowflake is wrong:
- Explorer is wrong
- Registry is wrong
- Verification is wrong

Fix Snowflake first.

---

END OF FILE