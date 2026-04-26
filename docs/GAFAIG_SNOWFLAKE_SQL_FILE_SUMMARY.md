# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
Last Updated: 2026-04-26

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
- ORG_NAME
- ORG_TYPE
- COUNTRY

---

### CASE LAYER
- CORE.VERIFICATION_CASES  
Defines each verification case  

Includes:
- CASE_ID
- APPLICATION_ID
- ENTITY_NAME

---

### FINDINGS LAYER
- CORE.VERIFICATION_FINDINGS  
Structured evaluation outputs tied to CASE_ID

---

### EVIDENCE LAYER
- CORE.VERIFICATION_EVIDENCE  
Stores supporting materials for findings

- CORE.VERIFICATION_FINDING_EVIDENCE  
Mapping table between findings and evidence

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

Used for structured entity modeling and system-level records

---

## CORE VIEWS

### PRIMARY PUBLIC VIEW
CORE.V_REGISTRY_PUBLIC

This is the canonical public contract.

Phase 6 update includes:

- REGISTRY_SNAPSHOT_ID
- REGISTRY_ID
- CASE_ID
- APPLICATION_ID
- RECORD_TYPE
- RECORD_NAME
- ENTITY_NAME
- ENTITY_TYPE
- COUNTRY
- CERTIFICATION_STATUS
- CERTIFIED_AT
- VALID_FROM
- VALID_TO
- PUBLISHED_AT
- RENEWAL_STATUS
- LIFECYCLE_STATUS
- VISIBILITY_STATUS
- VERIFICATION_ELIGIBLE
- BADGE_ELIGIBLE

Important:
- Score, tier, band are NOT exposed
- Expired records remain visible
- Lifecycle and eligibility are computed ONLY here

CRITICAL (Phase 6.4 ADDITION):
This view must produce a deterministic record used to generate messageString.
Any change to field order, inclusion, or formatting may break signature verification downstream.

CRITICAL ADDITION:
This view defines the canonical payload foundation for messageString generation.
Changes to this view must be treated as cryptographic breaking changes.

---

### SUPPORTING VIEWS

CORE.V_REGISTRY_LATEST_APPROVED  
- Latest approved decision per CASE_ID

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
- Public AI systems surface
- Must align strictly with V_REGISTRY_PUBLIC

CORE.V_GOVERNANCE_SCORE_CASE  
- Final scoring output
- Source of truth for score/tier/band (PRIVATE)

---

## STORED PROCEDURES

### CASE CREATION
CORE.SP_CREATE_CASE_FROM_APPLICATION  
- Converts application → case

---

### SCORING
CORE.SP_SCORE_CASE_ENTERPRISE  
- Runs deterministic scoring engine
- Writes to CASE_SCORE_SNAPSHOTS

---

### PUBLISH
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  
- Creates REGISTRY_SNAPSHOTS
- Publishes certification record

⚠️ This is the ONLY valid publish path

CRITICAL (Phase 6.4 ADDITION):
Publishing must produce a stable record that results in a deterministic messageString.
Any change to publish logic that alters output structure must be treated as a breaking change.

CRITICAL ADDITION:
Publishing output must maintain field order and structural consistency required for signature generation.

---

## PHASE 6 RECORD MODEL

New Snowflake-defined fields:

- RECORD_TYPE
- RECORD_NAME
- VISIBILITY_STATUS
- LIFECYCLE_STATUS
- VERIFICATION_ELIGIBLE
- BADGE_ELIGIBLE

These fields enable:

- Organization-level certification
- System-level certification
- Portfolio modeling
- Lifecycle-aware trust
- Badge control

---

## LIFECYCLE LOGIC (SNOWFLAKE ONLY)

LIFECYCLE_STATUS:

- active → VALID_TO > NOW()
- expired → VALID_TO < NOW()
- revoked → RENEWAL_STATUS = REVOKED

CRITICAL:
Lifecycle must be computed ONLY in Snowflake and never inferred externally.

CRITICAL ADDITION:
Lifecycle determines current trust state.
Signature determines authenticity.

---

## ELIGIBILITY LOGIC

VERIFICATION_ELIGIBLE:

- TRUE unless revoked

BADGE_ELIGIBLE:

- TRUE only if:
  - active
  - not revoked

---

## DATA CONTRACT RULES

Public contract includes:

- identity fields
- certification fields
- lifecycle fields
- eligibility fields
- signed proof inputs

Public contract excludes:

- score
- tier
- band
- findings
- evidence
- internal decisions

CRITICAL (Phase 6.4 ADDITION):
Public contract must remain stable to support external verification systems.

CRITICAL ADDITION:
Public contract stability is required for deterministic messageString generation and cryptographic verification.

---

## SEED FILES

Primary working seed:

- GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

Responsibilities:

- creates demo applications
- creates cases
- inserts findings/evidence/events
- runs scoring
- publishes registry records

Must follow canonical flow EXACTLY

---

## CANONICAL RUN ORDER

1. Create tables  
2. Insert applications  
3. Create cases  
4. Insert findings  
5. Insert evidence  
6. Link findings/evidence  
7. Insert events  
8. Run scoring  
9. Create decisions  
10. Publish to registry  

---

## PUBLIC CONTRACT PRINCIPLE

Certification attaches to RECORDS, not organizations broadly.

Each registry entry is:

- independently verifiable
- cryptographically signed
- lifecycle-aware
- externally consumable

---

## SNOWFLAKE RESPONSIBILITIES

Snowflake is responsible for:

- governance computation
- scoring
- decisioning
- lifecycle determination
- eligibility logic
- registry snapshot creation
- public contract projection
- deterministic payload generation for verification (messageString)

---

## API / UI ROLE

API/UI:

- read from V_REGISTRY_PUBLIC
- return signed payloads
- expose messageString, signature, public key reference
- never compute trust
- never mutate data

CRITICAL ADDITION:
Verification must occur using messageString only.
UI/API must never verify using JSON field reconstruction.

---

## CURRENT SYSTEM STATE

✔ Snowflake canonical flow established  
✔ Registry snapshot model active  
✔ Phase 6 public view updated  
✔ Lifecycle + eligibility introduced  
✔ Deterministic scoring enforced  
✔ messageString contract aligned with verify page  
✔ Public verification model stabilized  

🔴 Next step:
Align and harden:

- widget verification behavior
- badge lifecycle enforcement
- external SDK verification documentation

---

## END STATE

Snowflake acts as:

- deterministic governance engine  
- certification authority  
- registry publisher  
- lifecycle authority  
- trust source  
- canonical payload generator for cryptographic verification  

GAFAIG becomes:

- a verifiable governance registry  
- a public trust infrastructure  
- a certification record system  
- a Snowflake-native execution platform  
- a cryptographically verifiable system of record  