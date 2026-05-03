# CANONICAL_RUN_ORDER.md

Last Updated: 2026-05-02

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

Always run in ACCOUNTADMIN or appropriate elevated role.

Always execute:

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

Never modify table contracts outside canonical files.
Never introduce derived logic in API/UI.
Registry is append-only.
IDs must be deterministic and stable.
All joins must use TRIM(UPPER(...)) normalization where ID matching is required.
All scoring must originate from Snowflake views only.

CRITICAL MESSAGESTRING RULES

All fields used for messageString must remain deterministic.
Field ordering must NEVER change once in use.
No conditional field omission for signed payload inputs.
Any change impacting messageString = cryptographic breaking change.
messageString is the ONLY valid external verification input.
Never reconstruct signed payloads from UI or JSON object fields.

🔴 CRITICAL PRE-RUN CHECKS (MANDATORY)

Before running ANY rebuild:

12_TABLES_PARTICIPANTS.sql must compile without errors.
15_TABLES_EVENTS.sql must compile without errors.

If either fails:

STOP.
DO NOT PROCEED.

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

All ID columns must originate in Snowflake only.
No derived IDs allowed.
Referential integrity must be enforced before downstream steps.
CORE.DECISIONS.CASE_ID must be NOT NULL.
Decision validity must be time-bounded with VALID_FROM and VALID_TO.
VALID_TO must not be NULL for approved decisions.

20 — CORE VIEWS (READ LAYER)

20_VIEWS_VERIFICATION_CASE_DETAIL.sql

26_VIEWS_CASE_RENEWAL_STATUS.sql

Defines:

CORE.V_CASE_RENEWAL_STATUS

Rules:

one row per CASE_ID
latest decision by CREATED_AT / DECISION_ID
DAYS_TO_EXPIRY must compute from VALID_TO
active validity must use:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

21_VIEWS_PUBLIC_REGISTRY.sql

Defines:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_LATEST_APPROVED

Rules:

public contract only
score-blind
no private scoring leakage
certification status comes from approved + published + valid decision state
must not reference IS_PUBLISHABLE unless the renewal view explicitly exposes it

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Defines:

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Rules:

must join on CASE_ID
must not expose score
must not expose internal decision logic
only public contract fields allowed

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

V_REGISTRY_PUBLIC is the canonical public contract.
This view defines the payload basis for messageString.
Field order stability is REQUIRED.

🔴 CRITICAL VIEW BLOCKER RULE

NO PUBLIC VIEW may expose:

private SCORE
private scoring internals
raw reviewer evidence
internal workflow-only data

Score is PRIVATE and must NEVER leak into public or registry-layer views unless explicitly authorized by a dedicated public-safe view.

23 — CORE PROCEDURES (PIPELINE ENGINE)

23_SP_CREATE_CASE_FROM_APPLICATION.sql

APPLICATION → CASE

24_PROCEDURES_APPLICATION_INTAKE.sql

Application intake procedures.

26_PROCEDURES_FINDINGS.sql

Creates:

CORE.SP_CREATE_FINDING

Rules:

generate FINDING_ID in Snowflake only
insert into CORE.VERIFICATION_FINDINGS
return canonical OBJECT payload
API must call this procedure and not insert directly

27_PROCEDURES_EVIDENCE.sql

Creates evidence procedure layer.

28_PROCEDURES_FINDING_EVIDENCE.sql

Creates finding ↔ evidence linking procedure layer.

25_SP_SCORE_CASE_ENTERPRISE.sql

CASE → SCORE SNAPSHOT

Rules:

must read from CORE.V_GOVERNANCE_SCORE_CASE
must write to CORE.CASE_SCORE_SNAPSHOTS
must return rowsInserted
must not compute score outside Snowflake scoring view

25_PROCEDURES_APPROVAL.sql

Defines:

CORE.APPROVE_CASE_V1
CORE.UNAPPROVE_CASE_V1

Rules:

deterministic transitions only
no partial state
no implicit assumptions
APPROVE_CASE_V1 must require latest score snapshot
APPROVE_CASE_V1 must attach SNAPSHOT_ID
APPROVE_CASE_V1 must create one-year VALID_FROM / VALID_TO window
APPROVE_CASE_V1 must close active or overlapping prior decisions
UNAPPROVE_CASE_V1 must close active or overlapping prior decisions
Decision windows must not overlap for the same CASE_ID

30 — SCORING ENGINE (AUTHORITATIVE)

GAFAIG - Governance Scoring (Enterprise v1.2).sql

Defines:

CORE.V_GOVERNANCE_SCORE_CASE

Rules:

single source of score/tier/band
no duplicate scoring logic
must execute AFTER tables and BEFORE publishing
cases with no findings should still resolve safely where applicable
score/tier/band remain private unless explicitly projected through approved public-safe contracts

CRITICAL:

This layer is PRIVATE ONLY.
No public downstream dependency should expose private scoring internals.

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

Publish output must be deterministic.
Publish output must support messageString generation.
Any change to publish structure = versioning required.
Publishability is derived from:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

🔴 CRITICAL:

DO NOT:

INSERT INTO CORE.REGISTRY_SNAPSHOTS
INSERT INTO CORE.REGISTRY_AI_SYSTEMS
DELETE FROM registry tables

Procedure owns ALL registry writes.

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

No step may be skipped.
No parallel execution allowed.
No API-level execution of pipeline.

VALIDATION QUERIES

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.CASE_SCORE_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.DECISIONS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.REGISTRY_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_EXPLORER_STATS;

DECISION INTEGRITY VALIDATION

SELECT COUNT(*) AS bad_decisions
FROM CORE.DECISIONS
WHERE CASE_ID IS NULL
   OR TRIM(CASE_ID) = '';

Expected:

0

Overlap check:

SELECT
  d1.CASE_ID,
  d1.DECISION_ID AS decision_id_1,
  d1.VALID_FROM AS valid_from_1,
  d1.VALID_TO AS valid_to_1,
  d2.DECISION_ID AS decision_id_2,
  d2.VALID_FROM AS valid_from_2,
  d2.VALID_TO AS valid_to_2
FROM CORE.DECISIONS d1
JOIN CORE.DECISIONS d2
  ON d1.CASE_ID = d2.CASE_ID
 AND d1.DECISION_ID < d2.DECISION_ID
WHERE d1.VALID_FROM < d2.VALID_TO
  AND d2.VALID_FROM < d1.VALID_TO
ORDER BY d1.CASE_ID;

Expected:

0 rows

RENEWAL VALIDATION

SELECT
  CASE_ID,
  DECISION_STATUS,
  VALID_FROM,
  VALID_TO,
  DAYS_TO_EXPIRY,
  RENEWAL_STATUS,
  IS_CURRENTLY_VALID
FROM CORE.V_CASE_RENEWAL_STATUS
WHERE CASE_ID = '<CASE_ID>';

Expected for active certified records:

IS_CURRENTLY_VALID = TRUE
DAYS_TO_EXPIRY is not NULL
RENEWAL_STATUS = VALID or active equivalent

PUBLIC REGISTRY VALIDATION

SELECT
  REGISTRY_ID,
  CASE_ID,
  CERTIFICATION_STATUS,
  VALID_FROM,
  VALID_TO,
  RENEWAL_STATUS,
  LIFECYCLE_STATUS
FROM CORE.V_REGISTRY_PUBLIC
WHERE CASE_ID = '<CASE_ID>';

Expected:

CERTIFICATION_STATUS = CERTIFIED
VALID_FROM populated
VALID_TO populated
LIFECYCLE_STATUS = active

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
must return record
must return proof
must return messageString

CRITICAL ADDITIONS:

messageString is the ONLY valid verification input.
Never reconstruct payload.
Never verify from JSON object order.
Any change to signed payload fields requires contract versioning.

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
no score computation
no lifecycle recomputation

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
must be null-safe
must fail closed or return controlled empty state

CRYPTO RULES

Algorithm: Ed25519
Signing: server-side only
Private key NEVER exposed
Public key must be accessible
Signature must match messageString EXACTLY

CRITICAL ADDITIONS:

messageString must be deterministic.
messageString must not be reconstructed.
Verification MUST fail closed on any mismatch.

EXTERNAL VERIFICATION VALIDATION

Node verifier:

external-tests/verify-gafaig-node.js

Python verifier:

external-tests/verify-gafaig-python.py

Tamper verifier:

external-tests/verify-gafaig-tamper.js

Expected:

Valid payload verifies TRUE
Tampered payload verifies FALSE

NON-NEGOTIABLE RULES

DO NOT:

recompute score outside Snowflake
generate registry records in API
mutate registry snapshots
introduce non-deterministic IDs
expose workflow data publicly
manually insert decisions
manually publish registry records
recreate seed sprawl

ALWAYS:

use Snowflake as source of truth
use append-only registry
enforce deterministic joins
follow this run order EXACTLY
use stored procedures for writes
preserve public contract stability

PHASE 7 ADDITION — PROCEDURE-ONLY WRITE ENFORCEMENT (LOCKED)

All writes in the pipeline MUST occur through stored procedures.

Applies to:

APPLICATION → CORE.SP_CREATE_APPLICATION or canonical intake procedure
CASE → CORE.SP_CREATE_CASE_FROM_APPLICATION
FINDINGS → CORE.SP_CREATE_FINDING
EVIDENCE → CORE.SP_CREATE_EVIDENCE
LINKS → CORE.SP_LINK_FINDING_EVIDENCE
SCORING → CORE.SP_SCORE_CASE_ENTERPRISE
APPROVAL → CORE.APPROVE_CASE_V1 / CORE.UNAPPROVE_CASE_V1
PUBLISH → CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Do NOT:

insert directly into tables from API
use JSON or filesystem storage
generate IDs outside Snowflake

CRITICAL:

Pipeline integrity depends on procedure-only execution.

CURRENT SYSTEM STATE (AS OF 2026-05-02)

🔴 CANONICAL SEED STATUS (LOCKED)

✔ GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql is active canonical seed baseline
✔ Single seed rule remains mandatory
✔ Future expansion must MODIFY this file — not replace it

✔ Full verification API operational
✔ Ed25519 signing validated
✔ Public key endpoint operational
✔ messageString locked and externally verified
✔ External verification works in Node
✔ External verification works in Python
✔ Tamper test passes
✔ Registry pipeline deterministic end-to-end
✔ CORE.V_REGISTRY_PUBLIC stable
✔ Lifecycle model converted to time-bounded validity
✔ VALID_FROM / VALID_TO enforced
✔ CASE_ID NOT NULL enforced in CORE.DECISIONS
✔ Overlapping decision windows cleaned
✔ APPROVE_CASE_V1 closes overlapping decisions
✔ SP_PUBLISH_CASE_TO_REGISTRY_V3 aligned to bounded validity
✔ /registry detail route working
✔ /registry list route hardened
✔ /explorer page hardened with null-safe rendering
✔ Widget verification language aligned
✔ Widget browser-side verification operational
✔ SDK layer operational

ACTIVE ISSUES / IN PROGRESS

🔴 12_TABLES_PARTICIPANTS.sql still requires final compile validation
🔴 15_TABLES_EVENTS.sql still requires final compile validation
🟡 Explorer query contract is being restored after drift from temporary smaller files
🟡 /explorer subpages must be revalidated:
   /explorer/organizations
   /explorer/countries
   /explorer/systems
🟡 Stress testing not yet complete
🟡 Multi-case edge lifecycle testing not yet complete

NEXT PHASE

SYSTEM STRESS VALIDATION + PRIVATE WORKFLOW COMPLETION

Goals:

restore and validate explorer query contract
validate explorer subpages
stress test multi-case registry
test expired / near-expiry / future-valid lifecycle states
validate API consistency
validate widget fail-closed behavior
validate SDK failure handling
build canonical validation runner
complete private workflow polish

NEXT REQUIRED FILE

99_RUN_CANONICAL_PIPELINE.sql

Must:

execute full pipeline in canonical order
validate tables
validate views
validate procedures
validate scoring
validate decisions
validate registry output
validate public API readiness
detect drift automatically

FINAL PRINCIPLE

GAFAIG is not an application.

GAFAIG is a deterministic, cryptographically verifiable governance protocol.

All engineering must reinforce this.

END OF FILE