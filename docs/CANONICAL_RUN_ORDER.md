# CANONICAL_RUN_ORDER.md
Date: 2026-04-21

# PURPOSE

This document defines the exact deterministic execution order of all GAFAIG Snowflake files and procedures.

This is the ONLY valid run sequence.

Do not reorder.  
Do not skip.  
Do not parallelize.

Snowflake is the source of truth.  
All computation must occur in Snowflake.  
All downstream systems (API/UI/Widget) are read-only projections.

---

# GLOBAL EXECUTION RULES

1. Always run in ACCOUNTADMIN (or appropriate elevated role)
2. Always execute:

USE ROLE ACCOUNTADMIN;  
USE WAREHOUSE GAFAIG_WH;  
USE DATABASE GAFAIG_DB;  
USE SCHEMA CORE;

3. Never modify table contracts outside canonical files
4. Never introduce derived logic in API/UI
5. Registry is append-only
6. IDs must be deterministic and stable
7. All joins must use TRIM(UPPER(...)) normalization
8. All scoring must originate from Snowflake views only

---

# CANONICAL EXECUTION ORDER

## 00 — ENVIRONMENT SETUP

00_CORE_SETUP.sql

---

## 01 — FULL RESET (OPTIONAL)

01_REBUILD_ENVIRONMENT_CANONICAL.sql

Purpose:
- clean rebuild of entire system
- used for deterministic validation

---

## 10 — CORE TABLES (FOUNDATION)

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
- all tables must compile clean
- no missing columns
- no schema drift allowed

---

## 20 — CORE VIEWS (READ LAYER)

20_VIEWS_VERIFICATION_CASE_DETAIL.sql  

21_VIEWS_PUBLIC_REGISTRY.sql  
- defines CORE.V_REGISTRY_PUBLIC  
- defines CORE.V_REGISTRY_LATEST_APPROVED  

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  
- defines CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

22_VIEWS_EXPLORER_STATS.sql  
- defines CORE.V_EXPLORER_STATS  

26_VIEWS_CASE_RENEWAL_STATUS.sql  
- defines CORE.V_CASE_RENEWAL_STATUS  

Rules:
- views are projections only
- no recomputation
- no mutation
- must enforce lifecycle and certification rules

---

## 23 — CORE PROCEDURES (PIPELINE ENGINE)

23_SP_CREATE_CASE_FROM_APPLICATION.sql  
- APPLICATION → CASE  

24_SP_SCORE_CASE_ENTERPRISE.sql  
- CASE → SCORE  

25_PROCEDURES_APPROVAL.sql  
- CORE.APPROVE_CASE_V1  
- CORE.UNAPPROVE_CASE_V1  

Rules:
- procedures must enforce deterministic transitions
- no partial state transitions allowed

---

## REGISTRY PUBLISH (CRITICAL)

GAFAIG - CORE.REGISTRY_PUBLISH.sql  
- defines CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

Purpose:
- CASE → REGISTRY_SNAPSHOTS → REGISTRY_ID  

Rules:
- must reuse REGISTRY_ID if already exists
- must insert append-only snapshot
- must not overwrite prior records
- must align REGISTRY_AI_SYSTEMS with REGISTRY_ID
- must use scoring + lifecycle state only

---

## 30 — SCORING ENGINE (AUTHORITATIVE)

GAFAIG - Governance Scoring (Enterprise v1.2).sql  

Defines:
- CORE.V_GOVERNANCE_SCORE_CASE  

Rules:
- single source of score, tier, band
- no duplicate scoring logic anywhere else

---

## 40 — SEED (DETERMINISTIC DATA)

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql  

Rules:
- single source of seed truth
- no auxiliary seed files allowed
- must generate:

APPLICATION  
CASE  
FINDINGS  
EVIDENCE  
LINKS  
EVENTS  

---

## END-TO-END PIPELINE EXECUTION

MANDATORY ORDER:

1. INSERT INTO CORE.APPLICATIONS  
2. CALL CORE.SP_CREATE_CASE_FROM_APPLICATION  
3. CALL CORE.SP_SCORE_CASE_ENTERPRISE  
4. CALL CORE.APPROVE_CASE_V1  
5. CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

## VALIDATION QUERIES

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.CASE_SCORE_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.DECISIONS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.REGISTRY_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC WHERE CASE_ID = '<CASE_ID>';

---

# TRUST SURFACE LAYER

## VERIFY ENDPOINT

/api/verify/[registryId]

Source:
- CORE.V_REGISTRY_PUBLIC

Rules:
- no computation
- no mutation
- deterministic message construction
- ISO 8601 timestamps only

Must return:
- record
- proof

---

## PUBLIC KEY ENDPOINT

/api/.well-known/gafaig-public-key

Must expose:
- kty: OKP
- crv: Ed25519
- alg: EdDSA
- kid
- publicKeyBase64

---

## REGISTRY ENDPOINT

/api/registry

Source:
- CORE.V_REGISTRY_PUBLIC

Rules:
- projection only
- no derived logic

---

## EXPLORER ENDPOINT

/api/explorer

Sources:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

Rules:
- no workflow data
- no TMP IDs
- no derived trust logic

---

# CRYPTO RULES

- Algorithm: Ed25519  
- Signing occurs ONLY server-side  
- Private key NEVER exposed  
- Public key must be accessible  
- Signature must validate against messageString EXACTLY  

---

# NON-NEGOTIABLE RULES

DO NOT:
- recompute scores outside Snowflake
- generate registry data in API
- mutate registry snapshots
- introduce non-deterministic IDs
- expose workflow data in public UI

ALWAYS:
- use Snowflake as source of truth
- use append-only registry
- enforce deterministic joins
- follow canonical run order exactly

---

# CURRENT SYSTEM STATE (AS OF 2026-04-21)

✔ full pipeline operational  
✔ scoring engine stable (v1.2)  
✔ decision lifecycle enforced  
✔ registry publishing deterministic  
✔ REGISTRY_ID reuse enforced  
✔ V_REGISTRY_PUBLIC aligned  
✔ V_REGISTRY_AI_SYSTEMS_PUBLIC aligned  
✔ explorer surface stabilized  
✔ API /registry operational  
✔ API /verify operational  
✔ Ed25519 signing validated  
✔ public key endpoint operational  
✔ Snowflake → API → UI parity achieved  

---

# NEXT PHASE

SYSTEM HARDENING + TRUST DISTRIBUTION

Goals:
- registry integrity validation
- explorer systems enforcement
- widget + badge production rollout
- third-party verification enablement
- zero drift across all layers

---

# FINAL PRINCIPLE

GAFAIG is not an application.

GAFAIG is a deterministic, cryptographically verifiable governance protocol.

All engineering decisions must reinforce this.

---

END OF FILE