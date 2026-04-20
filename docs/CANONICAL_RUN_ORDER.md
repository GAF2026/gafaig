# GAFAIG_CANONICAL_RUN_ORDER.md
Last Updated: 2026-04-20

# PURPOSE
This document defines the exact deterministic execution order of all GAFAIG Snowflake files and procedures. This is the ONLY valid run sequence. Do not reorder. Do not skip. Do not parallelize.

Snowflake is the source of truth.
All computation must occur in Snowflake.
All downstream systems (API/UI/Widget) are read-only projections.

---

# GLOBAL EXECUTION RULES

1. Always run in ACCOUNTADMIN (or appropriate elevated role for setup)
2. Always USE:
   USE ROLE ACCOUNTADMIN;
   USE WAREHOUSE GAFAIG_WH;
   USE DATABASE GAFAIG_DB;
   USE SCHEMA CORE;

3. Never modify table contracts outside their canonical files
4. Never introduce derived logic in API/UI
5. Registry is append-only
6. IDs must be deterministic and stable
7. All joins must use TRIM(UPPER(...)) normalization
8. All scoring must originate from Snowflake views only

---

# CANONICAL EXECUTION ORDER

## 00 — ENVIRONMENT SETUP
00_CORE_SETUP.sql

## 01 — REBUILD ENVIRONMENT (OPTIONAL RESET)
01_REBUILD_ENVIRONMENT.sql

---

## 10 — CORE TABLES (FOUNDATION LAYER)

10_TABLES_SUBMISSIONS.sql  
11_TABLES_APPLICATIONS.sql  
12_TABLES_PARTICIPANTS.sql  ⚠️ MUST BE VERIFIED (previous error encountered)
13_TABLES_VERIFICATION_CASES.sql  
14_TABLES_VERIFICATION_FINDINGS.sql  
14_TABLES_VERIFICATION_EVIDENCE.sql  
14_TABLES_VERIFICATION_FINDING_EVIDENCE.sql  
15_TABLES_EVENTS.sql        ⚠️ MUST BE VERIFIED (previous error encountered)
16_TABLES_CASE_SCORES.sql  
17_TABLES_DECISIONS.sql  
18_TABLES_REGISTRY_SNAPSHOTS.sql  
19_TABLES_REGISTRY_AI_SYSTEMS.sql  

---

## 20 — VIEWS (CANONICAL READ LAYER)

20_VIEWS_VERIFICATION_CASE_DETAIL.sql  

21_VIEWS_PUBLIC_REGISTRY.sql  
   - Defines CORE.V_REGISTRY_PUBLIC

22_VIEWS_REGISTRY_AI_SYSTEMS.sql  
   - Defines CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

22_VIEWS_EXPLORER.sql  
   - Defines CORE.V_REGISTRY_PUBLIC_SEARCH

---

## 23 — CORE PROCEDURES (PIPELINE ENGINE)

23_SP_CREATE_CASE_FROM_APPLICATION.sql  
   - APPLICATION → CASE

24_SP_SCORE_CASE_ENTERPRISE.sql  
   - CASE → SCORE

25_PROCEDURES_APPROVAL.sql  
   - CORE.APPROVE_CASE_V1  
   - CORE.UNAPPROVE_CASE_V1  

---

## REGISTRY PUBLISH (CRITICAL TRUST TRANSITION)

GAFAIG - CORE.REGISTRY_PUBLISH.sql  
   - Defines CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

This is the ONLY procedure allowed to:
   CASE → REGISTRY_SNAPSHOTS → REGISTRY_ID

Rules:
- Must reuse existing REGISTRY_ID if already published
- Must insert immutable snapshot
- Must not overwrite prior records
- Must align REGISTRY_AI_SYSTEMS with REGISTRY_ID

---

## LATEST APPROVED VIEW (CRITICAL)

CREATE OR REPLACE VIEW CORE.V_REGISTRY_LATEST_APPROVED

Source:
- CORE.REGISTRY_SNAPSHOTS
- LEFT JOIN CORE.VERIFICATION_CASES

Rules:
- One row per CASE_ID
- ROW_NUMBER partition by CASE_ID
- ORDER BY CREATED_AT DESC
- Must expose:

  REGISTRY_ID  
  APPLICATION_ID  
  CASE_ID  
  ENTITY_NAME  
  ENTITY_TYPE  
  COUNTRY  
  DECISION_STATUS  
  CERTIFICATION_STATUS  
  CERTIFIED_SCORE  
  CERTIFIED_TIER  
  CERTIFIED_BAND  
  CERTIFIED_AT  
  VALID_FROM  
  VALID_TO  

This view is the SINGLE SOURCE for:
- /api/registry
- /api/verify
- badge system
- widget system

---

## 30 — SEED (DETERMINISTIC DATA)

GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

Rules:
- Single source of seed truth
- No temporary seed files allowed
- Must produce:

  APPLICATION  
  CASE  
  FINDINGS  
  EVIDENCE  
  LINKS  
  EVENTS  

---

## END-TO-END PIPELINE (MANDATORY ORDER)

1. INSERT INTO CORE.APPLICATIONS  
2. CALL CORE.SP_CREATE_CASE_FROM_APPLICATION  
3. CALL CORE.SP_SCORE_CASE_ENTERPRISE  
4. CALL CORE.APPROVE_CASE_V1  
5. CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

Verification queries:

SELECT * FROM CORE.V_GOVERNANCE_SCORE_CASE WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.REGISTRY_SNAPSHOTS WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_LATEST_APPROVED WHERE CASE_ID = '<CASE_ID>';

SELECT * FROM CORE.V_REGISTRY_PUBLIC WHERE CASE_ID = '<CASE_ID>';

---

# TRUST SURFACE LAYER (API CONTRACT)

## VERIFY ENDPOINT
/api/verify/[registryId]

Source:
- CORE.V_REGISTRY_LATEST_APPROVED

Rules:
- No computation
- No mutation
- Deterministic message construction
- ISO 8601 timestamps ONLY
- Must return:

  record  
  proof  

Proof must include:
- alg (Ed25519)
- kid
- signature
- signedAt (ISO)
- verificationKeyUrl
- message
- messageString

---

## PUBLIC KEY ENDPOINT
/api/.well-known/gafaig-public-key

Must expose:
- kty: OKP
- crv: Ed25519
- alg: EdDSA
- kid
- publicKeyPem
- publicKeyBase64

---

## REGISTRY ENDPOINT
/api/registry

Source:
- CORE.V_REGISTRY_PUBLIC

Rules:
- Projection only
- No derived logic

---

## CRYPTO RULES

- Algorithm: Ed25519
- Signing occurs ONLY server-side
- Private key NEVER exposed
- Public key must be independently accessible
- Signature must validate against messageString EXACTLY

---

# NON-NEGOTIABLE RULES

DO NOT:
- Recompute scores outside Snowflake
- Generate registry data in API
- Mutate registry snapshots
- Introduce non-deterministic IDs
- Add UI-side business logic

ALWAYS:
- Use Snowflake as source of truth
- Use append-only registry
- Use deterministic normalization
- Use canonical run order

---

# CURRENT SYSTEM STATE (AS OF 2026-04-20)

✔ Full pipeline operational  
✔ Scoring engine operational  
✔ Approval procedures operational  
✔ Registry publishing operational  
✔ REGISTRY_ID deterministic  
✔ V_REGISTRY_LATEST_APPROVED aligned  
✔ API /registry working  
✔ API /verify working  
✔ Ed25519 signing implemented  
✔ Public key endpoint deployed  
✔ ISO timestamp compliance enforced  
✔ External verification now possible  

---

# NEXT PHASE

Proceed to:

BADGE + WIDGET TRUST SURFACE

Goals:
- Deterministic badge endpoint
- External embeddable widget
- Third-party verification capability
- Zero drift between registry, verify, badge, widget

---

# FINAL PRINCIPLE

GAFAIG is not an application.

GAFAIG is a deterministic, cryptographically verifiable registry protocol.

Everything must reinforce that.