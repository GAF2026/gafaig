# GAFAIG — CURRENT FOCUS — 2026-04-07

## CURRENT PHASE
Application → Case Pipeline Stabilization (Core Engine Activation)

## OBJECTIVE
Stabilize and fully validate the canonical entry point into the GAFAIG verification pipeline:
APPLICATION → CASE via SP_CREATE_CASE_FROM_APPLICATION

This is the gateway into the entire governance system and must be deterministic, reliable, and fully aligned with Snowflake as the source of truth.

## PRIMARY COMPONENT UNDER DEVELOPMENT
23_SP_CREATE_CASE_FROM_APPLICATION.sql

This procedure is responsible for:
- Resolving input (APPLICATION_ID or REQUEST_ID)
- Matching against CORE.APPLICATIONS
- Generating deterministic CASE_ID
- Inserting into CORE.VERIFICATION_CASES
- Writing initial workflow event into CORE.VERIFICATION_EVENTS
- Returning structured VARIANT response

## CURRENT STATUS
- Procedure compiles successfully
- Procedure executes successfully
- Deterministic CASE_ID generation confirmed
- Insert logic structurally correct
- Event insertion logic implemented
- Idempotency logic working

## ACTIVE BLOCKER
Application lookup failure within CORE.APPLICATIONS

Symptoms:
- Procedure returns "Application not found"
- No rows inserted into CORE.VERIFICATION_CASES
- No rows inserted into CORE.VERIFICATION_EVENTS

Root Cause (confirmed):
- Input mismatch between procedure input and stored APPLICATION_ID / REQUEST_ID
- Case sensitivity, whitespace, or normalization inconsistencies
- Potential environment mismatch (schema / database context)

## REQUIRED FIX
Inside SP_CREATE_CASE_FROM_APPLICATION:

Replace lookup condition with normalized comparison:

WHERE UPPER(TRIM(REQUEST_ID)) = UPPER(:V_INPUT_ID)
   OR UPPER(TRIM(APPLICATION_ID)) = UPPER(:V_INPUT_ID)

Ensure:
- All input IDs are trimmed
- All comparisons are case-insensitive
- IDs are consistent across Snowflake, API, and UI

## VALIDATION STEPS
1) Confirm application exists:
SELECT APPLICATION_ID, REQUEST_ID FROM CORE.APPLICATIONS ORDER BY CREATED_AT DESC;

2) Execute procedure with exact APPLICATION_ID:
CALL CORE.SP_CREATE_CASE_FROM_APPLICATION('APP-XXXXXXXX', 'PART-XXXXXXXX', 'admin');

3) Verify case creation:
SELECT * FROM CORE.VERIFICATION_CASES ORDER BY CREATED_AT DESC;

4) Verify event creation:
SELECT * FROM CORE.VERIFICATION_EVENTS ORDER BY CREATED_AT DESC;

## SUCCESS CRITERIA
- Procedure returns ok: true
- CASE row exists in CORE.VERIFICATION_CASES
- EVENT row exists in CORE.VERIFICATION_EVENTS
- CASE_ID is deterministic and consistent
- No duplicate inserts on re-run

## WHAT WAS COMPLETED
- Fixed procedure compilation issues
- Fixed insert column mismatches
- Implemented deterministic CASE_ID logic
- Implemented event insertion logic
- Confirmed idempotent behavior
- Isolated failure to APPLICATION lookup only

## WHAT IS NOT BROKEN
- Snowflake architecture
- Table schemas
- Procedure execution
- Insert logic
- Event model
- Overall pipeline design

## NEXT STEP (IMMEDIATE)
Fix APPLICATION lookup normalization and confirm successful case creation.

## NEXT PHASE (AFTER FIX)
Move to:
CASE → FINDINGS → EVIDENCE

This includes:
- Creating FINDINGS table population logic
- Linking EVIDENCE to FINDINGS
- Establishing canonical assessment structure

## UPCOMING PIPELINE
CASE → FINDINGS → EVIDENCE → SCORING → DECISION → REGISTRY

## CRITICAL RULES
- Snowflake is the source of truth
- No logic in API/UI
- No re-architecture
- Maintain deterministic pipeline
- Maintain append-only model

## FINAL NOTE
The system is fully built at the structural level.
Only input resolution remains to unlock the entire GAFAIG pipeline.
Once resolved, development immediately progresses into the governance engine (Findings + Evidence).