# GAFAIG — SNOWFLAKE SQL FILE SUMMARY — 2026-04-07

## OVERVIEW
This document provides the canonical mapping of all Snowflake SQL files used in the GAFAIG system. These files define the full deterministic verification engine, including tables, procedures, views, and pipeline logic. Snowflake is the single source of truth, and all system behavior must originate from these files.

## CORE DATABASE CONTEXT
- ACCOUNT: duglhtd-cm14952
- DATABASE: GAFAIG_DB
- SCHEMA: CORE
- WAREHOUSE: GAFAIG_WH

All SQL files operate within this context.

## INPUT LAYER

### 11_TABLES_APPLICATIONS.sql
Purpose:
- Creates CORE.APPLICATIONS table
- Stores incoming application records
- Defines APPLICATION_ID and REQUEST_ID as ingestion identifiers
Notes:
- Entry point into GAFAIG pipeline
- Must support deterministic mapping to CASE

## CASE LAYER

### 20_TABLES_VERIFICATION_CASES.sql
Purpose:
- Creates CORE.VERIFICATION_CASES
- Stores canonical case records
- Defines CASE_ID as deterministic identifier
Notes:
- Central entity of system
- All downstream pipeline stages depend on CASE_ID

## WORKFLOW LAYER

### 15_TABLES_EVENTS.sql
Purpose:
- Creates CORE.VERIFICATION_EVENTS
- Append-only event log
- Tracks full lifecycle of a case
Examples:
- case_created
- findings_added
- evidence_linked
- scoring_completed
- decision_made
Notes:
- No updates allowed
- Events represent system history

## ASSESSMENT LAYER

### 12_TABLES_FINDINGS.sql
Purpose:
- Creates CORE.FINDINGS
- Stores assessment findings for each case

### 13_TABLES_EVIDENCE.sql
Purpose:
- Creates CORE.EVIDENCE
- Stores evidence records

### 14_TABLES_FINDING_EVIDENCE_LINKS.sql
Purpose:
- Links findings to evidence
- Enables traceability

## SCORING LAYER

### 16_TABLES_CASE_SCORE_SNAPSHOTS.sql
Purpose:
- Stores scoring outputs per case
- Append-only snapshots

### 24_SP_SCORE_CASE_ENTERPRISE.sql
Purpose:
- Computes FINAL_SCORE
- Produces TIER and BAND
- Writes to CASE_SCORE_SNAPSHOTS

### V_GOVERNANCE_SCORE_CASE
Purpose:
- Canonical scoring view
- Provides deterministic scoring output
Notes:
- API/UI must read from this view only

## DECISION LAYER

### 17_TABLES_DECISIONS.sql
Purpose:
- Creates CORE.VERIFICATION_DECISIONS
- Stores certification outcomes

### 25_PROCEDURES_APPROVAL.sql
Purpose:
- Inserts approval decisions
- Sets DECISION_STATUS
- Locks certification state

## REGISTRY LAYER

### GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql
Purpose:
- Creates CORE.REGISTRY_SNAPSHOTS
- Append-only public certification records

### CORE.REGISTRY_PUBLISH.sql
Purpose:
- Publishes approved cases to registry
- Generates or reuses REGISTRY_ID
- Inserts new snapshot

## PUBLIC VIEWS

### 21_VIEWS_PUBLIC_REGISTRY.sql
Purpose:
- Defines public registry views
Includes:
- V_REGISTRY_LATEST_APPROVED
- V_REGISTRY_PUBLIC
- V_REGISTRY_PUBLIC_SEARCH

## AI SYSTEMS

### 14_TABLES_REGISTRY_AI_SYSTEMS.sql
Purpose:
- Creates CORE.REGISTRY_AI_SYSTEMS

### V_REGISTRY_AI_SYSTEMS_PUBLIC
Purpose:
- Public view of AI systems linked to registry

## CORE PIPELINE PROCEDURES

### 23_SP_CREATE_CASE_FROM_APPLICATION.sql
Purpose:
- Converts APPLICATION → CASE
- Resolves APPLICATION_ID or REQUEST_ID
- Generates deterministic CASE_ID
- Inserts into VERIFICATION_CASES
- Inserts initial workflow event into VERIFICATION_EVENTS
- Returns structured VARIANT response
Status:
- Compiles and executes
- Current blocker at APPLICATION lookup stage

## PIPELINE FLOW (CANONICAL)

APPLICATION (CORE.APPLICATIONS)
→ CASE (CORE.VERIFICATION_CASES)
→ FINDINGS (CORE.FINDINGS)
→ EVIDENCE (CORE.EVIDENCE)
→ EVENTS (CORE.VERIFICATION_EVENTS)
→ SCORING (CASE_SCORE_SNAPSHOTS / V_GOVERNANCE_SCORE_CASE)
→ DECISION (CORE.VERIFICATION_DECISIONS)
→ REGISTRY (CORE.REGISTRY_SNAPSHOTS)
→ PUBLIC VIEWS (V_REGISTRY_PUBLIC)

## CURRENT STATE

WORKING:
- All core tables exist
- All major procedures compile
- Deterministic ID logic implemented
- Event model implemented
- Registry architecture defined

BLOCKER:
- APPLICATION → CASE conversion failing at lookup stage
- SP_CREATE_CASE_FROM_APPLICATION cannot resolve APPLICATION_ID / REQUEST_ID reliably
- No rows inserted into VERIFICATION_CASES
- No rows inserted into VERIFICATION_EVENTS

ROOT CAUSE:
- Input mismatch or normalization issue in CORE.APPLICATIONS lookup
- Possible case sensitivity, trimming, or environment mismatch

## NEXT ACTION

- Fix lookup condition in SP_CREATE_CASE_FROM_APPLICATION using:
  UPPER(TRIM(APPLICATION_ID)) and UPPER(TRIM(REQUEST_ID))
- Validate APPLICATIONS table contents
- Confirm correct DB/SCHEMA context
- Re-run procedure and verify inserts

## FINAL NOTE

The GAFAIG Snowflake system is structurally complete.
The only active issue is application resolution at the ingestion boundary.
Once resolved, the full governance pipeline will execute deterministically end-to-end.