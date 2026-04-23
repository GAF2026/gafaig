# MASTER_STATE.md
Date: 2026-04-22

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

It is a deterministic trust engine.

---

## CORE ARCHITECTURE

GAFAIG is built on a strict two-layer model:

1. PRIVATE VERIFICATION ENGINE (Snowflake)  
2. PUBLIC TRUST LAYER (Views → API → UI)  

This separation is mandatory and enforced.

---

## CANONICAL DATA FLOW (LOCKED)

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

### 1. PRIVATE VERIFICATION ENGINE

Purpose:
- intake  
- verification workflow  
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
- deterministic  
- lifecycle-controlled  
- append-only where required  
- not publicly exposed  

---

### 2. REGISTRY LAYER

Purpose:
- store certified outcomes as immutable public records  

Core Tables:
- CORE.REGISTRY_SNAPSHOTS  
- CORE.REGISTRY_AI_SYSTEMS  

Characteristics:
- append-only  
- immutable snapshots  
- REGISTRY_ID persists across versions  
- full historical trace preserved  

---

### 3. PUBLIC TRUST LAYER

Purpose:
- expose certified truth externally  

Core Views:
- CORE.V_REGISTRY_PUBLIC  
- CORE.V_REGISTRY_LATEST_APPROVED  
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
- CORE.V_EXPLORER_STATS  

Characteristics:
- projection-only  
- no computation  
- lifecycle-filtered  
- certification-enforced  

---

## CORE TABLES

APPLICATION:
- CORE.APPLICATIONS  

VERIFICATION:
- CORE.VERIFICATION_CASES  
- CORE.VERIFICATION_FINDINGS  
- CORE.VERIFICATION_EVIDENCE  
- CORE.VERIFICATION_FINDING_EVIDENCE  
- CORE.VERIFICATION_EVENTS  

SCORING:
- CORE.CASE_SCORE_SNAPSHOTS  

DECISION:
- CORE.DECISIONS  

REGISTRY:
- CORE.REGISTRY_SNAPSHOTS  
- CORE.REGISTRY_AI_SYSTEMS  

---

## CORE VIEWS

REGISTRY (AUTHORITATIVE):
- CORE.V_REGISTRY_PUBLIC  
- CORE.V_REGISTRY_LATEST_APPROVED  

AI SYSTEMS:
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

EXPLORER:
- CORE.V_EXPLORER_STATS  

SCORING:
- CORE.V_GOVERNANCE_SCORE_CASE  
- CORE.V_SCORE_BREAKDOWN_PUBLIC  
- CORE.V_SCORE_DIMENSIONS_PUBLIC  

LIFECYCLE:
- CORE.V_CASE_RENEWAL_STATUS  

---

## CORE PROCEDURES

- CORE.SP_CREATE_CASE_FROM_APPLICATION  
- CORE.SP_SCORE_CASE_ENTERPRISE  
- CORE.APPROVE_CASE_V1  
- CORE.UNAPPROVE_CASE_V1  
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

---

## TRUST MODEL (LOCKED)

GAFAIG defines three strict states:

### VERIFIED (Workflow Complete)
- full workflow chain exists  
- findings, evidence, events complete  
- structural integrity confirmed  

### APPROVED (Governance Decision)
- score exists  
- decision exists  
- active decision row:
  - DECISION_STATUS = 'APPROVED'  
  - VALID_TO IS NULL  

### CERTIFIED (Public Trust)
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
- minimal trust payload enforced  

---

## PUBLIC SURFACES

### REGISTRY

- authoritative source of truth  
- certified records only  
- used for verification  

### EXPLORER

- discovery layer  
- aggregates registry data  
- must only use public views  

CRITICAL RULE:
Explorer must NEVER expose:
- workflow data  
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
- must preserve deterministic outputs  

---

## UI SYSTEM

Framework:
- Next.js (App Router)  
- TypeScript  

Layout System (Canonical):
- max-w-[1180px]  
- px-6  
- space-y-8  
- PublicPageHero  
- section-based stacking  
- rounded-3xl  
- border-black/10  
- bg-white  

Rules:
- consistent layout across all pages  
- no custom layout overrides  
- no trust computation  

---

## WIDGET SYSTEM

Files:
- public/widget/gafaig-widget.js  
- public/widget/gafaig-verify.js  

Purpose:
- embed GAFAIG trust externally  
- allow third-party verification  

Rules:
- must call /api/verify  
- must not compute trust  
- must display canonical signed result  

---

## CURRENT STATE (APRIL 2026)

System is in STABILIZED PRODUCTION ALIGNMENT.

Status:

- canonical data flow enforced  
- registry surface stable  
- explorer surface stable  
- verify system stable  
- widget system operational  
- scoring engine deterministic  
- lifecycle model enforced  
- publish pipeline stable  
- signature system operational  
- Phase 1 UI alignment complete  

---

## CURRENT PRIORITY

1. final registry integrity validation  
2. enforce public-view-only query layer  
3. ensure explorer systems uses V_REGISTRY_AI_SYSTEMS_PUBLIC only  
4. maintain Snowflake → API → UI parity  
5. prevent workflow data leakage into public surfaces  

---

## SYSTEM GUARANTEES

GAFAIG guarantees:

- deterministic outputs  
- immutable registry records  
- correct trust classification  
- lifecycle-controlled certification  
- consistent Snowflake → API → UI data  
- cryptographically verifiable trust  

---

## DO NOT BREAK

- canonical data flow  
- Snowflake authority  
- append-only registry  
- decision lifecycle model  
- signature verification system  
- VERIFIED / APPROVED / CERTIFIED separation  
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

## FINAL STATEMENT

GAFAIG is a deterministic trust infrastructure where:

Snowflake defines truth  
API transmits truth  
UI renders truth  
Signature proves truth  

Trust is not asserted.  

Trust is mathematically and structurally guaranteed.

---

END OF FILE