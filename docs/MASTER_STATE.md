# MASTER_STATE.md
Date: 2026-04-21

---

## SYSTEM IDENTITY

GAFAIG (Global Authority for AI Governance) is the world’s first deterministic AI governance registry.

It is a system designed to:
- evaluate AI systems
- assign governance scores
- issue lifecycle-controlled decisions
- publish immutable registry records
- enable external trust via cryptographic verification

GAFAIG is not a database or dashboard.

It is a **deterministic trust engine**.

---

## CORE ARCHITECTURE

GAFAIG is built on a strict two-layer model:

1. PRIVATE VERIFICATION ENGINE (Snowflake)
2. PUBLIC TRUST LAYER (Views → API → UI)

This separation is mandatory and enforced.

---

## CANONICAL DATA FLOW

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  
→ API  
→ UI  

This flow is immutable and must never be re-architected.

---

## SOURCE OF TRUTH

Snowflake is the single source of truth.

All:
- scoring
- certification
- lifecycle state
- registry publication
- trust classification

must originate in Snowflake.

No logic is allowed in:
- API
- UI

---

## SYSTEM LAYERS

### 1. PRIVATE WORKFLOW LAYER

Purpose:
- intake
- verification
- scoring
- decision lifecycle

Core Tables:
- CORE.APPLICATIONS
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.DECISIONS

Characteristics:
- append-only where required
- lifecycle-controlled
- not publicly exposed

---

### 2. REGISTRY LAYER

Purpose:
- store certified outcomes as immutable records

Core Tables:
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

Characteristics:
- append-only
- immutable snapshots
- one REGISTRY_ID reused across snapshots
- full historical trace

---

### 3. PUBLIC TRUST LAYER

Purpose:
- expose certified truth

Core Views:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

Characteristics:
- projections only
- no computation
- lifecycle-filtered
- certification-enforced

---

## CORE TABLES

APPLICATION
- CORE.APPLICATIONS

VERIFICATION
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS

SCORING
- CORE.CASE_SCORE_SNAPSHOTS

DECISION
- CORE.DECISIONS

REGISTRY
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

---

## CORE VIEWS

REGISTRY (AUTHORITATIVE)
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED

AI SYSTEMS
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

EXPLORER
- CORE.V_EXPLORER_STATS

SCORING
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_SCORE_BREAKDOWN_PUBLIC
- CORE.V_SCORE_DIMENSIONS_PUBLIC

LIFECYCLE
- CORE.V_CASE_RENEWAL_STATUS

---

## CORE PROCEDURES

- CORE.SP_CREATE_CASE_FROM_APPLICATION
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.APPROVE_CASE_V1
- CORE.UNAPPROVE_CASE_V1
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

## TRUST MODEL

GAFAIG defines three strict states:

### 1. VERIFIED (Workflow Complete)
- case exists
- findings, evidence, events complete
- structural integrity confirmed

### 2. APPROVED (Decision Issued)
- score exists
- decision exists
- active decision row:
  - DECISION_STATUS = 'APPROVED'
  - VALID_TO IS NULL

### 3. CERTIFIED (Public Trust)
- published via registry procedure
- exists in REGISTRY_SNAPSHOTS
- appears in V_REGISTRY_PUBLIC
- lifecycle-valid
- cryptographically verifiable

---

## VERIFIED DEFINITION

A record is VERIFIED when:
- workflow chain is complete
- data relationships are valid
- no structural gaps exist

A VERIFIED record is NOT publicly trusted.

---

## CERTIFIED DEFINITION

A record is CERTIFIED only if:

1. APPROVED
2. lifecycle-valid (not expired or revoked)
3. published to registry
4. appears in CORE.V_REGISTRY_PUBLIC
5. has valid certification metadata
6. has valid cryptographic signature

Certified = Published + Valid + Signed

---

## LIFECYCLE MODEL

Lifecycle is governed by:

- CORE.DECISIONS (append-only)
- VALID_FROM / VALID_TO
- CORE.V_CASE_RENEWAL_STATUS

States include:
- Approved
- Certified
- Expired
- Expiring Soon
- Renewal Required
- Revoked

Only valid states are exposed publicly.

---

## REGISTRY MODEL

Registry is:

- append-only
- snapshot-based
- immutable

Rules:
- no updates to existing snapshots
- new state = new snapshot
- REGISTRY_ID persists across snapshots

---

## SIGNATURE SYSTEM

Algorithm:
- Ed25519

Verify endpoint:
/api/verify/[registryId]

Public key endpoint:
/api/.well-known/gafaig-public-key

Proof includes:
- alg
- kid
- signature
- signedAt
- message
- messageString

Rules:
- deterministic message construction
- signature over messageString only
- independently verifiable

---

## PUBLIC SURFACES

### REGISTRY

- authoritative
- certified records only
- source of truth for verification

### EXPLORER

- discovery layer
- aggregates public registry data
- must only use public views

CRITICAL RULE:
Explorer must NEVER expose:
- raw workflow data
- TMP registry IDs
- non-certified systems

---

## API LAYER

Endpoints:

/api/registry  
/api/registry/search  
/api/registry/[registryId]  
/api/registry/[registryId]/ai-systems  
/api/explorer  
/api/verify/[registryId]  
/api/badge/[registryId]  
/api/.well-known/gafaig-public-key  

Rules:
- no computation
- no trust logic
- strict mapping to Snowflake views

---

## UI SYSTEM

Framework:
- Next.js (App Router)
- TypeScript

Layout System:
- PublicPageHero
- max-w-[1180px]
- px-6
- space-y-8
- rounded-3xl
- border-black/10
- bg-white

Rules:
- consistent layout
- no custom layout systems
- no trust computation

---

## CURRENT STATE (APRIL 2026)

System is in STABILIZED PRODUCTION ALIGNMENT.

Status:

- canonical data flow enforced
- registry surface stable
- explorer surface stable
- scoring engine operational
- lifecycle model enforced
- publish pipeline deterministic
- signature system operational

---

## CURRENT PRIORITY

1. registry integrity validation
2. enforce public-view-only query layer
3. ensure explorer systems uses V_REGISTRY_AI_SYSTEMS_PUBLIC only
4. maintain Snowflake → API → UI parity
5. prevent any workflow data leakage into public surfaces

---

## SYSTEM GUARANTEES

GAFAIG guarantees:

- deterministic outputs
- immutable registry records
- correct trust classification
- lifecycle-controlled certification
- consistent data across Snowflake, API, UI
- cryptographically verifiable trust

---

## DO NOT BREAK

- canonical data flow
- Snowflake authority
- append-only registry
- decision lifecycle model
- signature verification system
- separation of VERIFIED / APPROVED / CERTIFIED
- public view contracts
- UI layout system

---

## FINAL RULE

If any layer:
- computes its own logic
- overrides Snowflake
- mixes workflow and public data
- breaks determinism

The system is invalid.

---

END OF FILE