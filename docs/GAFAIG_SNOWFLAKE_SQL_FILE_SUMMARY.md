# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-28

## PURPOSE
This file summarizes all active Snowflake SQL files, objects, and execution logic used in GAFAIG (Global Authority for AI Governance). It serves as the canonical reference for Snowflake as the system of truth and execution for the GAFAIG platform.

GAFAIG is a deterministic governance verification system. All scoring, certification, lifecycle state, and public trust outputs originate in Snowflake and are exposed through controlled public views.

---

## NON-NEGOTIABLE RULES

- Snowflake is the ONLY source of truth
- No scoring, certification, lifecycle, or eligibility logic exists outside Snowflake
- API, UI, SDK must NOT compute or override Snowflake outputs
- All IDs originate in Snowflake:
  - APPLICATION_ID
  - CASE_ID
  - REGISTRY_ID
  - FINDING_ID
  - EVIDENCE_ID
  - EVENT_ID
  - REGISTRY_SNAPSHOT_ID
- Published registry snapshots are IMMUTABLE
- Public views are projection layers only (no heavy logic)

CRITICAL (Phase 6.4 ADDITION):
- messageString used in verification MUST be deterministic and stable
- Field ordering must NEVER change
- Timestamp format must remain ISO 8601
- No conditional omission of fields used in messageString
- messageString is the ONLY valid payload for signature verification

CRITICAL ADDITION:
- Verification must NEVER be performed using parsed JSON fields
- Verification must NEVER be performed using reconstructed payloads
- proof.message is informational only and must NOT be used for verification

---

## GLOBAL TRUST INVARIANTS (PHASE 6.4 — SNOWFLAKE ALIGNMENT)

1. VERIFY API IS THE PROTOCOL CONTRACT  
   Snowflake output feeds `/api/verify`, which is the canonical external verification interface

2. MESSAGESTRING IS THE ONLY VERIFICATION INPUT  
   Snowflake output must support deterministic messageString generation

3. NEVER VERIFY FROM JSON  
   JSON fields must not be relied on for cryptographic validation

4. DETERMINISTIC PAYLOAD GUARANTEE  
   Field order must remain stable across:
   Snowflake → API → messageString → signature

5. SIGNATURE VS LIFECYCLE SEPARATION  
   Signature = authenticity  
   Lifecycle = current trust state

6. FAIL-CLOSED SYSTEM  
   Any failure → NOT TRUSTED

---

## CANONICAL EXECUTION FLOW

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEW  

---

## CRITICAL RUN ORDER FILES (MUST BE STABLE)

🔴 IMMEDIATE PRIORITY

- 12_TABLES_PARTICIPANTS.sql  
- 15_TABLES_EVENTS.sql  

These files:
- Break canonical run order if incorrect
- Block deterministic rebuilds
- Risk silent corruption of downstream tables

These must be fixed before any full system rebuild.

---

## CORE TABLE CREATION FILES

### APPLICATION LAYER
- CORE.APPLICATIONS  
Defines organization-level intake data  

Includes:
- APPLICATION_ID
- REQUEST_ID
- TYPE
- STATUS
- ORG_NAME
- EMAIL
- ORG_TYPE
- COUNTRY

---

### CASE LAYER
- CORE.VERIFICATION_CASES  
Defines each verification case  

Includes:
- CASE_ID
- APPLICATION_ID
- PARTICIPANT_ID
- STATUS
- CREATED_AT
- UPDATED_AT

---

### FINDINGS LAYER
- CORE.VERIFICATION_FINDINGS  

Structured evaluation outputs tied to CASE_ID  

Fields:
- FINDING_ID
- CASE_ID
- CONTROL_ID
- CONTROL_TITLE
- RESULT
- RATIONALE
- SEVERITY
- EVIDENCE_IDS
- CREATED_AT
- UPDATED_AT
- ORG_ID

---

### EVIDENCE LAYER
- CORE.VERIFICATION_EVIDENCE  

Stores supporting materials for findings  

Fields:
- EVIDENCE_ID
- CASE_ID
- EVIDENCE_TYPE
- TITLE
- DESCRIPTION
- SOURCE_URL
- STORAGE_REF
- SUBMITTED_BY
- SUBMITTED_AT
- CREATED_AT
- UPDATED_AT
- ORG_ID

---

### FINDING ↔ EVIDENCE LINK
- CORE.VERIFICATION_FINDING_EVIDENCE  

Mapping table between findings and evidence  

Fields:
- FINDING_ID
- EVIDENCE_ID
- CASE_ID
- CREATED_AT

---

### EVENTS LAYER
- CORE.VERIFICATION_EVENTS  
Tracks actions, timestamps, workflow transitions

---

### SCORING LAYER
- CORE.CASE_SCORE_SNAPSHOTS  
Stores deterministic scoring outputs per case

---

### DECISION LAYER
- CORE.DECISIONS  
Final governance decisions  

Includes:
- DECISION_STATUS
- VALID_FROM
- VALID_TO

---

### REGISTRY LAYER
- CORE.REGISTRY_SNAPSHOTS  

Canonical public certification records  

Includes:
- REGISTRY_SNAPSHOT_ID
- REGISTRY_ID
- CASE_ID
- ENTITY_NAME
- VERIFICATION_TYPE
- APPROVED_AT
- PUBLISHED_AT
- RENEWAL_STATUS

---

### ENTITY TABLES
- CORE.REGISTRY_ENTITIES  
- CORE.REGISTRY_AI_SYSTEMS  

---

## CORE VIEWS

### PRIMARY PUBLIC VIEW
CORE.V_REGISTRY_PUBLIC  

This is the canonical public contract.

Includes:
- lifecycle
- eligibility
- certification outcome

Excludes:
- score
- tier
- band

CRITICAL:
- Deterministic output required for messageString
- Field order must never change

---

### SUPPORTING VIEWS

CORE.V_REGISTRY_LATEST_APPROVED  
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
CORE.V_GOVERNANCE_SCORE_CASE  

---

## STORED PROCEDURES

### APPLICATION INTAKE
CORE.SP_CREATE_APPLICATION  

---

### CASE CREATION
CORE.SP_CREATE_CASE_FROM_APPLICATION  

---

### FINDING CREATION (UPDATED — CRITICAL)
CORE.SP_CREATE_FINDING  

- Uses sequence: CORE.SEQ_FINDING_ID  
- Inserts into canonical schema  
- Maps:
  - TITLE → CONTROL_TITLE
  - STATUS → RESULT
  - CATEGORY → CONTROL_ID  

---

### EVIDENCE CREATION
CORE.SP_CREATE_EVIDENCE  

- Uses sequence: CORE.SEQ_EVIDENCE_ID  

---

### FINDING ↔ EVIDENCE LINK
CORE.SP_LINK_FINDING_EVIDENCE  
CORE.SP_UNLINK_FINDING_EVIDENCE  

---

### SCORING
CORE.SP_SCORE_CASE_ENTERPRISE  

---

### PUBLISH
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

## PHASE 7 ADDITION (CRITICAL)

System now includes:

- Deterministic Findings creation via procedure  
- Deterministic Evidence creation via procedure  
- Deterministic Linking via procedure  
- Removal of ALL JSON/local storage  

System is now:

APPLICATION → CASE → FINDING → EVIDENCE → LINK (Snowflake-controlled)

---

## SEED FILES

Primary:

- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql  

---

## CANONICAL RUN ORDER

1. Tables  
2. Applications  
3. Cases  
4. Findings  
5. Evidence  
6. Link findings/evidence  
7. Events  
8. Scoring  
9. Decisions  
10. Publish  

---

## 🔴 REQUIRED NEXT FILE (FUTURE)

### CANONICAL RUNNER

File to create:

99_RUN_CANONICAL_PIPELINE.sql  

Purpose:
- Execute all SQL files in deterministic order  
- Validate:
  - Tables
  - Procedures
  - Views
  - Full pipeline  

---

## CURRENT SYSTEM STATE

✔ Case creation working  
✔ Evidence creation working  
✔ Finding procedure corrected  
✔ Linking procedures created  
✔ Snowflake now controls all writes  

⚠️ Current issue:
Findings UI count mismatch (API/UI alignment issue)

---

## END STATE

Snowflake acts as:

- deterministic governance engine  
- certification authority  
- registry publisher  
- lifecycle authority  
- trust source  
- canonical payload generator  

GAFAIG becomes:

- a verifiable governance registry  
- a public trust infrastructure  
- a certification record system  
- a Snowflake-native execution platform  
- a cryptographically verifiable system of record  

---