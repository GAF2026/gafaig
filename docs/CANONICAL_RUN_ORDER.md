# CANONICAL_RUN_ORDER.md

Last Updated: 2026-05-04

PURPOSE

This document defines the exact deterministic execution order of all GAFAIG Snowflake files and procedures.

This is the ONLY valid run sequence.

Do not reorder.  
Do not skip.  
Do not parallelize.  

Snowflake is the source of truth.  
All computation must occur in Snowflake.  
All downstream systems (API/UI/Widget) are read-only projections.  

---

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

---

CRITICAL MESSAGESTRING RULES

All fields used for messageString must remain deterministic.  
Field ordering must NEVER change once in use.  
No conditional field omission for signed payload inputs.  
Any change impacting messageString = cryptographic breaking change.  
messageString is the ONLY valid external verification input.  
Never reconstruct signed payloads from UI or JSON object fields.  

---

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

---

CANONICAL EXECUTION ORDER

00 — ENVIRONMENT SETUP

00_CORE_SETUP.sql

---

01 — FULL RESET (OPTIONAL BUT RECOMMENDED)

01_REBUILD_ENVIRONMENT_CANONICAL.sql

Purpose:

full deterministic rebuild  
eliminates residual state  
ensures reproducibility  

CRITICAL:

This is the ONLY valid method to reset registry state.  
DO NOT manually delete registry tables.  

---

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

CRITICAL:

All IDs originate in Snowflake only.  
No derived IDs allowed.  
Referential integrity must be enforced.  
CORE.DECISIONS.CASE_ID must be NOT NULL.  
Approved decisions MUST have VALID_FROM and VALID_TO.  
VALID_TO must NOT be NULL for approved decisions.  
Decision windows must not overlap.  

---

20 — CORE VIEWS (READ LAYER)

20_VIEWS_VERIFICATION_CASE_DETAIL.sql  

26_VIEWS_CASE_RENEWAL_STATUS.sql  

Defines:

CORE.V_CASE_RENEWAL_STATUS  

Rules:

one row per CASE_ID  
latest decision only  
DAYS_TO_EXPIRY derived from VALID_TO  

Active validity:

DECISION_STATUS = 'APPROVED'  
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO  

---

21_VIEWS_PUBLIC_REGISTRY.sql  

Defines:

CORE.V_REGISTRY_PUBLIC  
CORE.V_REGISTRY_LATEST_APPROVED  

Rules:

canonical public contract  
score-blind  
no scoring leakage  
certification derived from approved + valid + published  

CRITICAL:

This view defines the messageString payload foundation.  
Field order MUST remain stable.  

---

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

Defines:

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

Rules:

join on CASE_ID  
no score exposure  
no private logic  

---

22_VIEWS_EXPLORER_STATS.sql  

Defines:

CORE.V_EXPLORER_STATS  

Rules:

projection only  
no recomputation  
lifecycle enforced  

---

🔴 CRITICAL VIEW BLOCKER RULE

NO PUBLIC VIEW may expose:

SCORE  
scoring internals  
raw evidence  
private workflow data  

Score is PRIVATE.  

---

23 — CORE PROCEDURES (PIPELINE ENGINE)

23_SP_CREATE_CASE_FROM_APPLICATION.sql  

APPLICATION → CASE  

---

24_PROCEDURES_APPLICATION_INTAKE.sql  

Application intake procedures  

---

26_PROCEDURES_FINDINGS.sql  

Defines:

CORE.SP_CREATE_FINDING  

Rules:

FINDING_ID generated in Snowflake  
insert only via procedure  
return canonical payload  

---

27_PROCEDURES_EVIDENCE.sql  

Evidence creation procedures  

---

28_PROCEDURES_FINDING_EVIDENCE.sql  

Finding ↔ Evidence linking procedures  

---

25_SP_SCORE_CASE_ENTERPRISE.sql  

CASE → SCORE SNAPSHOT  

Rules:

read from CORE.V_GOVERNANCE_SCORE_CASE  
write to CORE.CASE_SCORE_SNAPSHOTS  
no external computation  

---

25_PROCEDURES_APPROVAL.sql  

Defines:

CORE.APPROVE_CASE_V1  
CORE.UNAPPROVE_CASE_V1  

Rules:

attach SNAPSHOT_ID  
create VALID_FROM / VALID_TO  
close overlapping decisions  
no overlapping validity windows  

---

30 — SCORING ENGINE (AUTHORITATIVE)

GAFAIG - Governance Scoring (Enterprise v1.2).sql  

Defines:

CORE.V_GOVERNANCE_SCORE_CASE  

Rules:

single source of score  
no duplicate logic  
PRIVATE ONLY  

---

REGISTRY PUBLISH (CRITICAL)

GAFAIG - CORE.REGISTRY_PUBLISH.sql  

Defines:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

Rules:

append-only  
reuse REGISTRY_ID  
deterministic output  
derive publishability from:

DECISION_STATUS = 'APPROVED'  
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO  

🔴 CRITICAL:

DO NOT manually insert or delete registry data  

---

40 — SEED (DETERMINISTIC DATA)

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql  

🔴 ONLY canonical seed file  

Rules:

no additional seed files  
no splitting logic  
must produce full pipeline  

CRITICAL:

Seed must NOT:

insert into registry tables  
delete from registry tables  

Seed MUST use:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(...)  

---

END-TO-END PIPELINE EXECUTION

MANDATORY ORDER:

INSERT INTO CORE.APPLICATIONS  
CALL CORE.SP_CREATE_CASE_FROM_APPLICATION  
CALL CORE.SP_SCORE_CASE_ENTERPRISE  
CALL CORE.APPROVE_CASE_V1  
CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

No step may be skipped.  

---

VALIDATION QUERIES

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = '<CASE_ID>';  
SELECT * FROM CORE.CASE_SCORE_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';  
SELECT * FROM CORE.DECISIONS WHERE CASE_ID = '<CASE_ID>';  
SELECT * FROM CORE.REGISTRY_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';  
SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = '<CASE_ID>';  
SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC WHERE CASE_ID = '<CASE_ID>';  
SELECT * FROM CORE.V_EXPLORER_STATS;  

---

DECISION INTEGRITY VALIDATION

SELECT COUNT(*) FROM CORE.DECISIONS  
WHERE CASE_ID IS NULL OR TRIM(CASE_ID) = '';  

Expected: 0  

Overlap validation:

(no overlapping VALID_FROM / VALID_TO windows)

---

RENEWAL VALIDATION

SELECT * FROM CORE.V_CASE_RENEWAL_STATUS WHERE CASE_ID = '<CASE_ID>';  

Expected:

IS_CURRENTLY_VALID = TRUE  
DAYS_TO_EXPIRY not null  

---

PUBLIC REGISTRY VALIDATION

SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = '<CASE_ID>';  

Expected:

CERTIFICATION_STATUS = CERTIFIED  
VALID_FROM populated  
VALID_TO populated  
LIFECYCLE_STATUS = active  

---

TRUST SURFACE LAYER

VERIFY ENDPOINT

/api/verify/[registryId]  

Rules:

no computation  
deterministic  
returns messageString  

CRITICAL:

messageString is ONLY verification input  

---

PUBLIC KEY ENDPOINT

/api/.well-known/gafaig-public-key  

Must expose:

Ed25519 key  

---

REGISTRY ENDPOINT

/api/registry  

Projection only  

---

EXPLORER ENDPOINT

/api/explorer  

Sources:

V_REGISTRY_PUBLIC  
V_REGISTRY_AI_SYSTEMS_PUBLIC  
V_EXPLORER_STATS  

---

CRYPTO RULES

Algorithm: Ed25519  
Signing: server-side  
Private key NEVER exposed  

CRITICAL:

messageString must be deterministic  
verification must fail closed  

---

EXTERNAL VERIFICATION

Node + Python + Tamper tests  

Expected:

Valid = TRUE  
Tampered = FALSE  

---

NON-NEGOTIABLE RULES

DO NOT:

compute score outside Snowflake  
generate registry records outside procedure  
mutate registry  
expose private data  

ALWAYS:

use Snowflake  
follow run order  
use procedures  
preserve determinism  

---

PHASE LOCK

All writes must occur via procedures  

No direct inserts from API  

---

CURRENT SYSTEM STATE

✔ Verification system complete  
✔ Public registry working  
✔ messageString locked  
✔ Ed25519 verified  
✔ Widget + SDK working  

🔴 12_TABLES_PARTICIPANTS.sql → needs validation  
🔴 15_TABLES_EVENTS.sql → needs validation  

🟡 Explorer contract being restored  
🟡 Stress testing pending  

---

NEXT PHASE

Snowflake validation + stress testing  

---

FINAL PRINCIPLE

GAFAIG is not an application.

GAFAIG is a deterministic, cryptographically verifiable governance protocol.

END OF FILE