# CURRENT_FOCUS.md
Date: 2026-04-23

## PURPOSE

This document defines the current execution focus for GAFAIG.

It acts as:
- the active control surface for development
- the alignment layer across Snowflake, API, UI, and Verify
- the enforcement mechanism for execution order and priorities

Only items listed here are active work.

Everything else is locked or deferred.

---

## CORE PRINCIPLE

Execution must follow the canonical pipeline:

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI → VERIFY → WIDGET

Rules:

- no step may be skipped  
- no parallel logic paths  
- no UI/API logic may replace Snowflake logic  
- no trust may be computed outside /api/verify  

---

## CURRENT PRIMARY OBJECTIVE (PHASE 4)

Lock the GAFAIG system as a deterministic, cryptographically verifiable trust infrastructure.

System phase:

BUILD → CANONICALIZATION → STABILIZATION → VALIDATION → **LOCK**

Current phase:
**PHASE 4 — TRUST LOCK + ENFORCEMENT**

---

## ACTIVE WORKSTREAMS

### 1. TRUST SURFACE LOCK (CRITICAL)

Status: ACTIVE (HIGHEST PRIORITY)

Objectives:

- enforce /api/verify as the ONLY trust authority  
- eliminate all alternate trust logic paths  
- ensure all surfaces consume verify output  

Scope:

- /verify  
- /api/verify/[registryId]  
- /api/badge/[registryId]  
- widget system  
- widget preview  

Rules:

- no trust from /api/registry  
- no trust from UI  
- no trust from client-side logic  

Success Criteria:

- identical trust output across:
  - verify page  
  - widget  
  - badge  
  - API  

---

### 2. PUBLIC / PRIVATE BOUNDARY ENFORCEMENT

Status: ACTIVE (CRITICAL)

Objectives:

- enforce strict separation of public vs private data  
- prevent all leakage of internal workflow data  

PUBLIC (ALLOWED):

- registryId  
- entityName  
- entityType  
- country  
- certificationStatus  
- certifiedAt  
- validFrom  
- validTo  
- lifecycleStatus  
- renewalStatus  

PRIVATE (FORBIDDEN):

- decision_status  
- score  
- tier  
- band  
- scoring breakdown  
- workflow states  

Enforcement Targets:

- Snowflake views  
- API responses  
- UI components  
- widgets  
- verify payload  

---

### 3. VERIFY CONTRACT ENFORCEMENT

Status: ACTIVE

Objectives:

- enforce deterministic signature contract  
- ensure minimal trust payload  
- prevent payload drift  

Signed Message MUST include ONLY:

- registryId  
- entityName  
- certificationStatus  
- certifiedAt  

Requirements:

- no null values  
- fixed field order  
- no additional fields  

Success Criteria:

- signature verifies independently  
- messageString = message  
- no variation across environments  

---

### 4. WIDGET SYSTEM HARDENING

Status: ACTIVE

Objectives:

- enforce verify-only widget architecture  
- eliminate registry dependency  
- ensure portable trust  

Files:

- public/widget/gafaig-widget.js  
- public/widget/gafaig-verify.js  

Rules:

- must call /api/verify  
- must NOT call /api/registry  
- must NOT compute trust  
- must NOT infer certification  

Success Criteria:

- widget renders only verify output  
- modal uses signed payload only  
- no private data leakage  

---

### 5. API CONTRACT LOCK

Status: ACTIVE

Objectives:

- ensure API is pure Snowflake projection  
- enforce deterministic outputs  

Endpoints:

- /api/registry  
- /api/registry/search  
- /api/explorer  
- /api/verify/[registryId]  
- /api/badge/[registryId]  

Rules:

- no trust computation  
- no synthetic fields  
- no transformation logic  

---

### 6. SNOWFLAKE → VERIFY PARITY VALIDATION

Status: ACTIVE

Objectives:

- ensure verify payload matches Snowflake exactly  

Checks:

- registryId parity  
- certifiedAt parity  
- lifecycle validity  
- certification status consistency  

Success Criteria:

- identical output across:
  - Snowflake  
  - API  
  - verify  
  - widget  

---

### 7. END-TO-END DETERMINISTIC VALIDATION

Status: ACTIVE

Pipeline:

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ V_REGISTRY_PUBLIC  
→ /api/verify  
→ widget  
→ modal  

Requirements:

- deterministic IDs  
- no orphan records  
- no recomputation  
- consistent outputs  

---

### 8. DOCUMENTATION LOCK (FINAL STEP)

Status: ACTIVE

Files:

- ENGINEERING_RULES.md  
- VERIFIED_DEFINITION.md  
- VERIFICATION_SIGNATURE_CONTRACT.md  
- MASTER_STATE.md  
- CURRENT_FOCUS.md  

Objectives:

- prevent future system drift  
- enforce architectural constraints  
- define trust model permanently  

---

## CURRENT SYSTEM STATE

APPLICATION → CASE: COMPLETE  
CASE → FINDINGS: COMPLETE  
FINDINGS → EVIDENCE: COMPLETE  
EVIDENCE → EVENTS: COMPLETE  
EVENTS → SCORING: COMPLETE  
SCORING → DECISION: COMPLETE  
DECISION → REGISTRY: COMPLETE  
REGISTRY → PUBLIC VIEWS: LOCKED  
PUBLIC VIEWS → API: LOCKED  
API → UI: LOCKED  
UI → VERIFY: LOCKED  
VERIFY → WIDGET: LOCKED  

System is in:

**PHASE 4 — TRUST LOCK**

---

## BLOCKERS

NONE

---

## REMAINING RISKS

- future developer drift  
- accidental reintroduction of private fields  
- API contract mutation  
- widget misuse  
- schema evolution breaking public contract  

---

## NEXT EXECUTION STEPS

1. complete documentation lock  
2. validate verify endpoint externally  
3. validate widget on third-party site  
4. confirm public key verification  
5. finalize production baseline  

---

## NON-NEGOTIABLE RULES

- Snowflake is the source of truth  
- /api/verify is the ONLY trust source  
- no UI/API trust logic  
- no private data in public layer  
- no skipping pipeline steps  
- no non-deterministic outputs  
- no unsigned certification  

---

## ENFORCEMENT

If a task is not listed here:

- it is not active  
- it must not be worked on  

All development must align with CURRENT_FOCUS.md.

---

## FINAL STATEMENT

GAFAIG is no longer in a build phase.

GAFAIG is now a deterministic trust system.

The focus is:

- enforcing correctness  
- preserving determinism  
- maintaining trust integrity  

Trust must remain:

- minimal  
- verifiable  
- portable  
- immutable  

---

END OF FILE