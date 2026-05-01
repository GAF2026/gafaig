GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md

Last Updated: 2026-04-30

PURPOSE

This file summarizes all active Snowflake SQL files, objects, and execution logic used in GAFAIG (Global Authority for AI Governance). It serves as the canonical reference for Snowflake as the system of truth and execution for the GAFAIG platform.

GAFAIG is a deterministic governance verification system. All scoring, certification, lifecycle state, and public trust outputs originate in Snowflake and are exposed through controlled public views.

NON-NEGOTIABLE RULES
Snowflake is the ONLY source of truth
No scoring, certification, lifecycle, or eligibility logic exists outside Snowflake
API, UI, SDK must NOT compute or override Snowflake outputs
All IDs originate in Snowflake:
APPLICATION_ID
CASE_ID
REGISTRY_ID
FINDING_ID
EVIDENCE_ID
EVENT_ID
REGISTRY_SNAPSHOT_ID
Published registry snapshots are IMMUTABLE
Registry tables are APPEND-ONLY
Public views are projection layers only (no heavy logic)

CRITICAL (Verification Contract Enforcement):

messageString MUST be deterministic and stable
Field ordering MUST NEVER change
Timestamp format MUST remain ISO 8601
No conditional omission of fields used in messageString
messageString is the ONLY valid payload for signature verification

CRITICAL ADDITION:

Verification MUST NEVER be performed using parsed JSON fields
Verification MUST NEVER be performed using reconstructed payloads
proof.message is informational only and MUST NOT be used for verification
GLOBAL TRUST INVARIANTS (PHASE 6.4 — SNOWFLAKE ALIGNMENT)
VERIFY API IS THE PROTOCOL CONTRACT
Snowflake output feeds /api/verify, which is the canonical external verification interface
MESSAGESTRING IS THE ONLY VERIFICATION INPUT
Snowflake output must support deterministic messageString generation
NEVER VERIFY FROM JSON
JSON fields must not be relied on for cryptographic validation
DETERMINISTIC PAYLOAD GUARANTEE
Field order must remain stable across:
Snowflake → API → messageString → signature
SIGNATURE VS LIFECYCLE SEPARATION
Signature = authenticity
Lifecycle = current trust state
FAIL-CLOSED SYSTEM
Any failure → NOT TRUSTED
CANONICAL EXECUTION FLOW

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEW

CRITICAL RUN ORDER FILES (MUST BE STABLE)

🔴 IMMEDIATE BLOCKERS (STEP ZERO)

12_TABLES_PARTICIPANTS.sql
15_TABLES_EVENTS.sql

These files:

Break canonical run order if incorrect
Block deterministic rebuilds
Risk silent corruption of downstream tables

These MUST be fixed before ANY pipeline execution.

CORE TABLE CREATION FILES
APPLICATION LAYER
CORE.APPLICATIONS

Defines organization-level intake data

Includes:

APPLICATION_ID
REQUEST_ID
TYPE
STATUS
ORG_NAME
EMAIL
ORG_TYPE
COUNTRY
CASE LAYER
CORE.VERIFICATION_CASES

Defines each verification case

Includes:

CASE_ID
APPLICATION_ID
PARTICIPANT_ID
STATUS
CREATED_AT
UPDATED_AT
FINDINGS LAYER
CORE.VERIFICATION_FINDINGS

Structured evaluation outputs tied to CASE_ID

Fields:

FINDING_ID
CASE_ID
CONTROL_ID
CONTROL_TITLE
RESULT
RATIONALE
SEVERITY
EVIDENCE_IDS
CREATED_AT
UPDATED_AT
ORG_ID
EVIDENCE LAYER
CORE.VERIFICATION_EVIDENCE

Stores supporting materials for findings

Fields:

EVIDENCE_ID
CASE_ID
EVIDENCE_TYPE
TITLE
DESCRIPTION
SOURCE_URL
STORAGE_REF
SUBMITTED_BY
SUBMITTED_AT
CREATED_AT
UPDATED_AT
ORG_ID
FINDING ↔ EVIDENCE LINK
CORE.VERIFICATION_FINDING_EVIDENCE

Mapping table between findings and evidence

Fields:

FINDING_ID
EVIDENCE_ID
CASE_ID
CREATED_AT
EVENTS LAYER
CORE.VERIFICATION_EVENTS

Tracks actions, timestamps, workflow transitions

SCORING LAYER
CORE.CASE_SCORE_SNAPSHOTS

Stores deterministic scoring outputs per case

⚠️ NOTE:
Scores exist ONLY internally and MUST NOT be exposed in public views.

DECISION LAYER
CORE.DECISIONS

Final governance decisions

Includes:

DECISION_STATUS
VALID_FROM
VALID_TO
CERTIFICATION_STATUS
CERTIFIED_AT
REGISTRY LAYER
CORE.REGISTRY_SNAPSHOTS

Canonical public certification records

Includes:

REGISTRY_SNAPSHOT_ID
REGISTRY_ID
CASE_ID
ENTITY_NAME
VERIFICATION_TYPE
APPROVED_AT
PUBLISHED_AT
RENEWAL_STATUS
ENTITY TABLES
CORE.REGISTRY_ENTITIES
CORE.REGISTRY_AI_SYSTEMS
CORE VIEWS
PRIMARY PUBLIC VIEW

CORE.V_REGISTRY_PUBLIC

This is the canonical public contract.

Includes:

certificationStatus
certifiedAt
validFrom
validTo
lifecycleStatus
renewalStatus

Excludes:

score
tier
band
internal decision logic

CRITICAL:

Deterministic output required for messageString
Field order must never change
AI SYSTEMS PUBLIC VIEW

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Rules:

MUST JOIN on CASE_ID
MUST depend only on:
CORE.V_REGISTRY_PUBLIC
CORE.REGISTRY_AI_SYSTEMS
MUST NOT include:
score
decision internals
SUPPORTING VIEWS
CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_GOVERNANCE_SCORE_CASE
CORE.V_SCORE_DIMENSIONS_PUBLIC
CORE.V_FINDING_UNMAPPED_CONTROLS
STORED PROCEDURES
APPLICATION INTAKE

CORE.SP_CREATE_APPLICATION

CASE CREATION

CORE.SP_CREATE_CASE_FROM_APPLICATION

FINDING CREATION (CRITICAL)

CORE.SP_CREATE_FINDING

Uses sequence: CORE.SEQ_FINDING_ID
Inserts into CORE.VERIFICATION_FINDINGS
Maps:
TITLE → CONTROL_TITLE
STATUS → RESULT
CATEGORY → CONTROL_ID
EVIDENCE CREATION

CORE.SP_CREATE_EVIDENCE

Uses sequence: CORE.SEQ_EVIDENCE_ID
FINDING ↔ EVIDENCE LINK

CORE.SP_LINK_FINDING_EVIDENCE
CORE.SP_UNLINK_FINDING_EVIDENCE

SCORING

CORE.SP_SCORE_CASE_ENTERPRISE

⚠️ Output must flow ONLY into snapshots → decisions → registry

APPROVAL

CORE.SP_APPROVE_CASE (or equivalent)

PUBLISH (CRITICAL OWNER)

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

RULE:

ALL registry writes MUST go through this procedure
NEVER manually:
INSERT into registry tables
DELETE from registry tables
SEED FILE POLICY (CRITICAL)

Primary (ONLY allowed seed file):

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql
STRICT RULES
❌ NEVER create additional seed files
❌ NEVER insert directly into:
CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS
❌ NEVER delete from registry tables
ALLOWED
✅ Modify master seed file
✅ Expand dataset
✅ Add lifecycle realism:
expired records
revoked records
REQUIRED SEED FLOW

Seed MUST:

Insert APPLICATIONS
Create CASES
Insert FINDINGS
Insert EVIDENCE
Link findings ↔ evidence
Insert EVENTS
Run scoring
Create decisions
CALL publish procedure
CANONICAL RUN ORDER
Tables
Applications
Cases
Findings
Evidence
Link findings/evidence
Events
Scoring
Decisions
Publish
🔴 REQUIRED NEXT FILE
CANONICAL VALIDATION RUNNER

File to create:

99_RUN_CANONICAL_PIPELINE.sql

Purpose:

Execute ALL SQL files in canonical order
Validate:
Tables
Views
Procedures
End-to-end pipeline

Must include:

Smoke tests
Insert → select validation
Procedure execution checks
CURRENT SYSTEM STATE

✔ Full Snowflake-controlled pipeline operational
✔ Verification contract enforced (messageString + signature)
✔ Registry append-only enforced
✔ AI systems public view aligned to contract
✔ Seed file corrected to avoid registry mutation

FINAL SYSTEM DEFINITION

Snowflake is:

Governance engine
Certification authority
Registry publisher
Lifecycle authority
Cryptographic payload source

GAFAIG is:

A deterministic AI governance registry
A public trust infrastructure
A certification record system
A verifiable global standard
END OF FILE