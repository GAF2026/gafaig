CANONICAL_RUN_ORDER.md

Last Updated: 2026-04-30

PURPOSE

This document defines the exact deterministic execution order of all GAFAIG Snowflake files and procedures.

This is the ONLY valid run sequence.

Do not reorder.
Do not skip.
Do not parallelize.

Snowflake is the source of truth.
All computation must occur in Snowflake.
All downstream systems (API/UI/Widget) are read-only projections.

GLOBAL EXECUTION RULES

Always run in ACCOUNTADMIN (or appropriate elevated role)

Always execute:

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

Never modify table contracts outside canonical files
Never introduce derived logic in API/UI
Registry is append-only
IDs must be deterministic and stable
All joins must use TRIM(UPPER(...)) normalization
All scoring must originate from Snowflake views only

CRITICAL (PHASE 6.4 ADDITION):

All fields used for messageString must remain deterministic
Field ordering must NEVER change once in use
No conditional field omission for signed payload inputs
Any change impacting messageString = cryptographic breaking change

🔴 CRITICAL PRE-RUN CHECKS (MANDATORY)

Before running ANY rebuild:

12_TABLES_PARTICIPANTS.sql must compile without errors
15_TABLES_EVENTS.sql must compile without errors

If either fails:

STOP. DO NOT PROCEED.

These files:

break canonical run order
block deterministic rebuild
can silently corrupt downstream workflow

This is STEP ZERO.

CANONICAL EXECUTION ORDER

00 — ENVIRONMENT SETUP

00_CORE_SETUP.sql

01 — FULL RESET (OPTIONAL BUT RECOMMENDED)

01_REBUILD_ENVIRONMENT_CANONICAL.sql

Purpose:

full deterministic rebuild
eliminates residual state
ensures reproducibility

CRITICAL ADDITION:

This is the ONLY valid method to reset registry state.
DO NOT manually delete registry tables.

10 — CORE TABLES (FOUNDATION)

10_TABLES_SUBMISSIONS.sql
11_TABLES_APPLICATIONS.sql
12_TABLES_PARTICIPANTS.sql
13_TABLES_VERIFICATION_CASES.sql
14_TABLES_VERIFICATION_FINDINGS.sql
14_TABLES_VERIFICATION_EVIDENCE.sql
14_TABLES_VERIFICATION_FINDING_EVIDENCE.sql
15_TABLES_EVENTS.sql
16_TABLES_CASE_SCORE_SNAPSHOTS.sql
17_TABLES_DECISIONS.sql
18_TABLES_REGISTRY_SNAPSHOTS.sql
19_TABLES_REGISTRY_AI_SYSTEMS.sql

Rules:

all tables must compile clean
no missing columns
no schema drift
no assumptions

CRITICAL ADDITIONS:

All ID columns must originate in Snowflake only
No derived IDs allowed
Referential integrity must be enforced before downstream steps

20 — CORE VIEWS (READ LAYER)

20_VIEWS_VERIFICATION_CASE_DETAIL.sql

26_VIEWS_CASE_RENEWAL_STATUS.sql
Defines: CORE.V_CASE_RENEWAL_STATUS

21_VIEWS_PUBLIC_REGISTRY.sql
Defines:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_LATEST_APPROVED

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
Defines:

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

22_VIEWS_EXPLORER_STATS.sql
Defines:

CORE.V_EXPLORER_STATS

Rules:

views are projection only
no recomputation of scoring
no mutation
lifecycle must be enforced here
certification filtering must be enforced here

CRITICAL ADDITIONS:

V_REGISTRY_PUBLIC is the canonical public contract
This view defines the payload basis for messageString
Field order stability is REQUIRED

🔴 CRITICAL (NEW — BLOCKER FIX):

NO VIEW may reference:

SCORE
V_CASE_SCORE_ENTERPRISE
V_GOVERNANCE_SCORE_CASE
ANY scoring-derived column

Score is PRIVATE and must NEVER leak into public or registry-layer views

If found → REMOVE immediately

23 — CORE PROCEDURES (PIPELINE ENGINE)

23_SP_CREATE_CASE_FROM_APPLICATION.sql
APPLICATION → CASE

24_SP_SCORE_CASE_ENTERPRISE.sql
CASE → SCORE

25_PROCEDURES_APPROVAL.sql
Defines:

CORE.APPROVE_CASE_V1
CORE.UNAPPROVE_CASE_V1

Rules:

deterministic transitions only
no partial state
no implicit assumptions

30 — SCORING ENGINE (AUTHORITATIVE)

GAFAIG - Governance Scoring (Enterprise v1.2).sql

Defines:

CORE.V_GOVERNANCE_SCORE_CASE

Rules:

single source of score/tier/band
no duplicate scoring logic
must execute AFTER tables and BEFORE publishing

CRITICAL:

This layer is PRIVATE ONLY
No downstream dependency allowed outside scoring + decisions

REGISTRY PUBLISH (CRITICAL)

GAFAIG - CORE.REGISTRY_PUBLISH.sql

Defines:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Purpose:

CASE → REGISTRY_SNAPSHOTS → REGISTRY_ID

Rules:

append-only
reuse REGISTRY_ID if exists
never overwrite records
align REGISTRY_AI_SYSTEMS
use Snowflake lifecycle + scoring only
never rely on API/UI

CRITICAL ADDITIONS:

Publish output must be deterministic
Publish output must support messageString generation
Any change to publish structure = versioning required

🔴 CRITICAL:

DO NOT:

INSERT INTO CORE.REGISTRY_SNAPSHOTS
INSERT INTO CORE.REGISTRY_AI_SYSTEMS
DELETE FROM registry tables

Procedure owns ALL registry writes

40 — SEED (DETERMINISTIC DATA)

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

🔴 THIS IS THE ONLY CANONICAL SEED FILE

This file is the single source of truth for all demo and validation data.

DO NOT:

Create additional seed files
Use archived seed files
Split seed logic across multiple files

DO:

Extend this file only
Maintain deterministic execution order inside this file
Preserve pipeline integrity

Rules:

single source of seed truth
no auxiliary seed files
must produce full pipeline:

APPLICATION
CASE
FINDINGS
EVIDENCE
LINKS
EVENTS
SCORING
DECISION
PUBLISH

CRITICAL ADDITIONS:

Seed must NOT:

INSERT into registry tables
DELETE from registry tables

Seed must rely on:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(...)

END-TO-END PIPELINE EXECUTION

MANDATORY ORDER:

INSERT INTO CORE.APPLICATIONS
CALL CORE.SP_CREATE_CASE_FROM_APPLICATION
CALL CORE.SP_SCORE_CASE_ENTERPRISE
CALL CORE.APPROVE_CASE_V1
CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

CRITICAL ADDITIONS:

No step may be skipped
No parallel execution allowed
No API-level execution of pipeline

VALIDATION QUERIES

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.CASE_SCORE_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.DECISIONS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.REGISTRY_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_EXPLORER_STATS;

TRUST SURFACE LAYER

VERIFY ENDPOINT

/api/verify/[registryId]

Source:
CORE.V_REGISTRY_PUBLIC

Rules:

no computation
no mutation
deterministic message
ISO timestamps

Must return:

record
proof
messageString

CRITICAL ADDITIONS:

messageString is the ONLY valid verification input
Never reconstruct payload
Never verify from JSON

PUBLIC KEY ENDPOINT

/api/.well-known/gafaig-public-key

Must expose:

kty: OKP
crv: Ed25519
alg: EdDSA
kid
publicKey

REGISTRY ENDPOINT

/api/registry

Source:
CORE.V_REGISTRY_PUBLIC

Rules:

projection only
no derived logic

EXPLORER ENDPOINT

/api/explorer

Sources:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
CORE.V_EXPLORER_STATS

Rules:

no workflow data
no temporary IDs
no derived trust logic

CRYPTO RULES

Algorithm: Ed25519
Signing: server-side only
Private key NEVER exposed
Public key must be accessible
Signature must match messageString EXACTLY

CRITICAL ADDITIONS:

messageString must be deterministic
messageString must not be reconstructed
Verification MUST fail closed on any mismatch

NON-NEGOTIABLE RULES

DO NOT:

recompute score outside Snowflake
generate registry records in API
mutate registry snapshots
introduce non-deterministic IDs
expose workflow data publicly

ALWAYS:

use Snowflake as source of truth
use append-only registry
enforce deterministic joins
follow this run order EXACTLY

PHASE 7 ADDITION — PROCEDURE-ONLY WRITE ENFORCEMENT (LOCKED)

All writes in the pipeline MUST occur through stored procedures.

Applies to:

APPLICATION → CORE.SP_CREATE_APPLICATION
CASE → CORE.SP_CREATE_CASE_FROM_APPLICATION
FINDINGS → CORE.SP_CREATE_FINDING
EVIDENCE → CORE.SP_CREATE_EVIDENCE
LINKS → CORE.SP_LINK_FINDING_EVIDENCE

Do NOT:

insert directly into tables from API
use JSON or filesystem storage
generate IDs outside Snowflake

CRITICAL:

Pipeline integrity depends on procedure-only execution.

CURRENT SYSTEM STATE (AS OF 2026-04-30)

🔴 CANONICAL SEED STATUS (LOCKED)

✔ GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql is WORKING
✔ Produces:

26 cases
26 decisions
14 public registry records
28 AI system records
✔ Fully drives:
/registry
/explorer
/verify
admin workflow

This file is now LOCKED as the canonical seed baseline.

Any future expansion must MODIFY this file — not replace it.

✔ Full pipeline operational
✔ Scoring engine stable
✔ Decision lifecycle enforced
✔ Registry publishing deterministic
✔ REGISTRY_ID reuse enforced
✔ CORE.V_REGISTRY_PUBLIC Phase 6 updated
✔ Lifecycle + eligibility fields introduced
✔ API /verify operational
✔ Ed25519 signing validated
✔ Public key endpoint operational
✔ SDK operational (v1.3.0)
✔ UI aligned
✔ Verification protocol (Phase 6.4) enforced

✔ Phase 7 workflow partially operational
✔ Application → Case working
✔ Evidence pipeline working
✔ Finding procedures implemented
✔ Linking procedures implemented

🔴 Run-order files still critical validation point
🔴 Findings pipeline visibility issue (active debug)

NEXT PHASE

SYSTEM HARDENING + PRIVATE WORKFLOW COMPLETION

Goals:

fix findings pipeline
activate linking
enable scoring dependency
badge lifecycle enforcement
widget fail-closed behavior
SDK failure handling
strict API contract enforcement
full system validation

FINAL PRINCIPLE

GAFAIG is not an application.

GAFAIG is a deterministic, cryptographically verifiable governance protocol.

All engineering must reinforce this.

END OF FILE