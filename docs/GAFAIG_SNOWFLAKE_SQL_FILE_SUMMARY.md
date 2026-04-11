# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-10

============================================================
GAFAIG — SNOWFLAKE SQL FILE SUMMARY (CANONICAL)
============================================================

This document provides a complete, canonical summary of all active Snowflake SQL files used in the GAFAIG system, aligned to the current stabilized architecture.

All files listed here reflect:
- Current working schema
- Active pipeline usage
- Verified compatibility with the application layer

Snowflake remains the single source of truth.

------------------------------------------------------------
CORE PRINCIPLES
------------------------------------------------------------

- All data originates and is computed in Snowflake
- All tables are idempotent (safe to re-run)
- All registry data is append-only (snapshots)
- All scoring is deterministic
- API/UI layers are read-only consumers

------------------------------------------------------------
TABLE DEFINITIONS
------------------------------------------------------------

11_TABLES_APPLICATIONS.sql
Purpose:
- Canonical ingestion table for applications
- Generates stable APPLICATION_ID
- Normalizes REQUEST_ID → APPLICATION_ID
Key Columns:
APPLICATION_ID, REQUEST_ID, TYPE, STATUS, ORG_NAME, EMAIL, ORG_TYPE, COUNTRY, CREATED_AT, UPDATED_AT

------------------------------------------------------------

13_TABLES_FINDINGS.sql
Purpose:
- Stores governance findings linked to applications
Key Columns:
FINDING_ID, APPLICATION_ID, PARTICIPANT_ID, CONTROL_CODE, CONTROL_DOMAIN, STATUS, SEVERITY, CREATED_AT, UPDATED_AT

------------------------------------------------------------

14_TABLES_EVIDENCE.sql
Purpose:
- Stores evidence and links evidence to findings
Objects:
- VERIFICATION_EVIDENCE
- VERIFICATION_FINDING_EVIDENCE
- V_EVIDENCE_UI (view)
Key Columns:
EVIDENCE_ID, CASE_ID, EVIDENCE_TYPE, TITLE, SOURCE_URL, SUBMITTED_BY, CREATED_AT

------------------------------------------------------------

15_TABLES_EVENTS.sql
Purpose:
- Audit log of verification lifecycle
Key Columns:
EVENT_ID, APPLICATION_ID, FINDING_ID, EVENT_TYPE, ACTOR_TYPE, EVENT_DETAILS, CREATED_AT

------------------------------------------------------------

16_TABLES_CASE_SCORE_SNAPSHOTS.sql
Purpose:
- Stores deterministic scoring outputs
Key Columns:
SNAPSHOT_ID, CASE_ID, APPLICATION_ID, TOTAL_SCORE, TIER, BAND, SCORE_COMPONENTS, CALCULATED_AT

NOTE:
- Legacy table exists alongside V2 snapshot table used by scoring procedure

------------------------------------------------------------

17_TABLES_DECISIONS.sql
Purpose:
- Stores final certification decisions
Key Columns:
DECISION_ID, CASE_ID, APPLICATION_ID, DECISION_STATUS, CERTIFICATION_TIER, CERTIFICATION_BAND, VALID_FROM, VALID_TO, CREATED_AT

------------------------------------------------------------

GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql
Purpose:
- Canonical append-only registry storage
- Source of truth for all published registry data
Key Columns:
REGISTRY_SNAPSHOT_ID, REGISTRY_ID, CASE_ID, ORG_ID, ENTITY_NAME, VERIFICATION_TYPE, SCORE, TIER, BAND, CERTIFIED_SCORE, CERTIFIED_TIER, CERTIFIED_BAND, CERTIFIED_AT, DECISION_STATUS, APPROVED_AT, PUBLISHED_AT, CREATED_AT

Includes:
- V_REGISTRY_LATEST_APPROVED (latest snapshot per case)

------------------------------------------------------------
VIEW DEFINITIONS
------------------------------------------------------------

GAFAIG — PUBLIC REGISTRY VIEW (CANONICAL FINAL)
File defines:
CORE.V_REGISTRY_PUBLIC

Purpose:
- Public registry surface for API/UI
- Joins snapshots + decisions + applications

CURRENT STATE:
⚠ Running in MINIMAL MODE

Active Columns:
REGISTRY_ID, APPLICATION_ID, CASE_ID, ENTITY_NAME, COUNTRY, DECISION_STATUS

Missing (to be rebuilt):
ENTITY_TYPE, CERTIFIED_*, VALID_*

------------------------------------------------------------

20_VIEWS_VERIFICATION_CASE_DETAIL.sql
Purpose:
- Unified case-level admin view
- Aggregates:
  applications, submissions, scoring, decisions, findings, evidence, events
Key Outputs:
application_id, total_score, decision_status, certified_at, last_activity_at, counts

------------------------------------------------------------

GAFAIG - Registry AI Systems Registry View.sql
Defines:
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Purpose:
- Public AI systems registry
- Joins AI systems with latest registry snapshot
Key Outputs:
SYSTEM_ID, REGISTRY_ID, ENTITY_NAME, SCORE, CERTIFIED_TIER, CERTIFIED_BAND, APPROVED_AT

------------------------------------------------------------
PROCEDURES
------------------------------------------------------------

23_SP_CREATE_CASE_FROM_APPLICATION.sql
Procedure:
CORE.SP_CREATE_CASE_FROM_APPLICATION

Purpose:
- Converts application → verification case
- Generates deterministic CASE_ID
- Inserts initial workflow event

------------------------------------------------------------

SP_SCORE_CASE_ENTERPRISE (file name varies)
Procedure:
CORE.SP_SCORE_CASE_ENTERPRISE

Purpose:
- Deterministic scoring engine
- Reads V_CASE_SCORE_ENTERPRISE
- Writes CASE_SCORE_SNAPSHOTS_V2

------------------------------------------------------------

GAFAIG — PROCEDURES APPROVAL (Publish)
Procedure:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Purpose:
- Validates approved case
- Reads governance score
- Generates/reuses REGISTRY_ID
- Inserts registry snapshot
- Syncs AI systems

CRITICAL RULE:
This is the ONLY path to publish registry data

------------------------------------------------------------
SEED FILES
------------------------------------------------------------

GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql
Purpose:
- Minimal deterministic demo dataset
- Builds:
  CASE → SCORE → DECISION → REGISTRY

Characteristics:
- Single case (CASE-0001)
- Idempotent
- No dependency on legacy structures

------------------------------------------------------------
DEPRECATED / LEGACY (DO NOT USE)
------------------------------------------------------------

- Multi-file seed systems (fragmented)
- Legacy snapshot tables without V2 alignment
- Views referencing UPDATED_AT incorrectly
- Any SQL referencing non-existent fields in APPLICATIONS

------------------------------------------------------------
CURRENT SYSTEM ALIGNMENT
------------------------------------------------------------

✔ All active SQL files compile
✔ All procedures execute successfully
✔ Registry publish flow is operational
✔ Query layer aligned to Snowflake schema
✔ Minimal registry view is stable

------------------------------------------------------------
NEXT REQUIRED ACTION (CRITICAL)
------------------------------------------------------------

Rebuild CORE.V_REGISTRY_PUBLIC (ENRICHED)

Add back:

FROM REGISTRY_SNAPSHOTS:
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT

FROM DECISIONS:
- VALID_FROM
- VALID_TO
- DECISION_STATUS (canonical)

FROM APPLICATIONS:
- ENTITY_TYPE
- COUNTRY normalization

------------------------------------------------------------
FINAL NOTE
------------------------------------------------------------

This file represents the authoritative SQL layer for GAFAIG.

Any frontend or API change must:
→ originate from changes in these SQL files
→ not bypass Snowflake logic

============================================================
END OF FILE
============================================================