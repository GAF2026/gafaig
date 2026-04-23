# CURRENT_FOCUS.md
Date: 2026-04-22

## PURPOSE

This document defines the current execution focus for GAFAIG.

It acts as:
- the active control surface for development
- the alignment layer across Snowflake, API, and UI
- the enforcement mechanism for execution order and priorities

Only items listed here are active work.

Everything else is deferred.

---

## CORE PRINCIPLE

Execution must follow the canonical pipeline:

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

No step may be skipped.  
No parallel logic paths are allowed.  
No UI/API logic may replace Snowflake logic.

---

## CURRENT PRIMARY OBJECTIVE

Complete registry integrity validation and enforce full Snowflake → API → UI parity across the public trust surface.

System phase:

BUILD → CANONICALIZATION → STABILIZATION → VALIDATION  

Current phase:
VALIDATION + ENFORCEMENT (FINAL)

---

## ACTIVE WORKSTREAMS

### 1. REGISTRY INTEGRITY VALIDATION

Status: ACTIVE (CRITICAL)

Objectives:
- ensure registry exposes ONLY certified, valid records  
- enforce lifecycle correctness  
- eliminate revoked or expired leakage  

Validation Criteria:
- one row per case in V_REGISTRY_PUBLIC  
- latest decision row only (VALID_TO IS NULL)  
- DECISION_STATUS = 'APPROVED'  
- lifecycle validity enforced  
- CERTIFICATION_STATUS = 'Certified'  

Validation Checks:
- Snowflake vs API vs UI parity  
- duplicate REGISTRY_ID detection  
- lifecycle mismatch detection  

---

### 2. EXPLORER SURFACE ENFORCEMENT

Status: ACTIVE

Objectives:
- enforce strict use of public Snowflake views  
- eliminate all workflow data leakage  
- ensure aggregation consistency  

Required Views:
- CORE.V_REGISTRY_PUBLIC  
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
- CORE.V_EXPLORER_STATS  

Critical Rules:
- NO use of CORE.REGISTRY_AI_SYSTEMS directly  
- NO TMP registry IDs  
- ONLY certified systems  

---

### 3. SYSTEMS SURFACE VALIDATION

Status: ACTIVE

Objectives:
- enforce purity of /explorer/systems and /registry/ai-systems  

Requirements:
- all systems must originate from V_REGISTRY_AI_SYSTEMS_PUBLIC  
- all systems must have valid REGISTRY_ID  
- certification fields must be inherited correctly  
- no missing or blank certification fields  
- no pre-public workflow systems  

Success Criteria:
- all systems are certified  
- no UI fallback logic  
- full Snowflake parity  

---

### 4. API CONTRACT PARITY

Status: ACTIVE

Objectives:
- ensure API is a strict projection of Snowflake  

Endpoints in Scope:
- /api/registry  
- /api/registry/search  
- /api/explorer  
- /api/verify/[registryId]  

Rules:
- no transformation of trust logic  
- no derived or synthetic fields  
- exact field mapping only  

Success Criteria:
- API responses match Snowflake views exactly  

---

### 5. SIGNATURE VERIFICATION VALIDATION

Status: ACTIVE

Objectives:
- validate full cryptographic trust layer  

Validation Targets:
- /api/verify/[registryId]  
- /api/.well-known/gafaig-public-key  
- /api/badge/[registryId]  
- widget system  

Requirements:
- messageString matches message exactly  
- Ed25519 signature verifies  
- kid matches public key  
- deterministic payload  

Success Criteria:
- independent third-party verification succeeds  

---

### 6. SNOWFLAKE → UI PARITY VALIDATION

Status: ACTIVE

Objectives:
- ensure UI renders Snowflake truth exactly  

Pages in Scope:
- /registry  
- /registry/[registryId]  
- /explorer  
- /explorer/organizations  
- /explorer/countries  
- /explorer/systems  
- /verify  
- /widget-preview  

Checks:
- counts match Snowflake  
- fields match Snowflake  
- no missing data  
- no UI-side correction logic  

---

### 7. DETERMINISTIC PIPELINE VALIDATION

Status: ACTIVE

Objectives:
- validate full pipeline reproducibility  

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY  

Requirements:
- deterministic IDs  
- no orphan records  
- complete linkage across all stages  
- consistent outputs on rebuild  

---

### 8. PUBLIC TRUST SURFACE HARDENING

Status: ACTIVE

Objectives:
- finalize external trust distribution  

Components:
- verify endpoint  
- badge endpoint  
- widget system  

Requirements:
- all trust derived from signed proof  
- no unsigned trust exposure  
- deterministic outputs  

---

## CURRENT SYSTEM STATE

APPLICATION → CASE: COMPLETE  
CASE → FINDINGS: COMPLETE  
FINDINGS → EVIDENCE: COMPLETE  
EVIDENCE → EVENTS: COMPLETE  
EVENTS → SCORING: COMPLETE  
SCORING → DECISION: COMPLETE  
DECISION → REGISTRY: COMPLETE  
REGISTRY → PUBLIC VIEWS: STABLE  
PUBLIC VIEWS → API: STABLE  
API → UI: STABLE  
UI → WIDGET: STABLE  

System is in FINAL VALIDATION PHASE

---

## BLOCKERS

NONE CRITICAL

All prior blockers resolved:
- registry misalignment  
- explorer inconsistencies  
- lifecycle ambiguity  
- publish pipeline gaps  
- signature contract issues  
- UI layout inconsistencies  

---

## REMAINING RISKS

- accidental use of non-public tables  
- API mapping drift  
- UI fallback masking issues  
- schema evolution breaking parity  

---

## NEXT EXECUTION STEPS

1. validate V_REGISTRY_PUBLIC against UI  
2. validate V_REGISTRY_AI_SYSTEMS_PUBLIC usage  
3. confirm systems explorer correctness  
4. validate all API endpoints  
5. validate signature verification end-to-end  
6. confirm full Snowflake → UI parity  
7. lock system as production baseline  

---

## NON-NEGOTIABLE RULES

- Snowflake is the source of truth  
- no UI/API trust logic  
- no skipping pipeline steps  
- no direct table usage in public surfaces  
- no non-deterministic outputs  
- no unsigned certification  
- no lifecycle violations  

---

## ENFORCEMENT

This document defines the active execution state of GAFAIG.

If a task is not listed here:
- it is not active  
- it must not be worked on  

All development must align with CURRENT_FOCUS.md.

---

## FINAL STATEMENT

GAFAIG is now a deterministic system in final production validation.

The focus is no longer building.

The focus is ensuring:
- correctness  
- consistency  
- reproducibility  
- trust integrity  

The system must now prove itself under strict validation.

---

END OF FILE