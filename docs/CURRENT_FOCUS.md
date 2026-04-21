# CURRENT_FOCUS.md
Date: 2026-04-21

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

**Complete registry integrity validation and enforce full Snowflake → API → UI parity across the public trust surface.**

The system has moved from:
BUILD → CANONICALIZATION → STABILIZATION

Now in:
**VALIDATION + ENFORCEMENT PHASE**

---

## ACTIVE WORKSTREAMS

### 1. REGISTRY INTEGRITY VALIDATION

Status: ACTIVE

Objectives:
- ensure registry reflects ONLY certified, valid records
- verify lifecycle enforcement is correct
- ensure no revoked or expired records appear

Validation Criteria:
- one row per case in V_REGISTRY_PUBLIC
- latest decision row only (VALID_TO IS NULL)
- DECISION_STATUS = 'APPROVED'
- VALID_FROM / VALID_TO respected
- CERTIFICATION_STATUS = 'Certified'

Validation Queries:
- record count parity (Snowflake vs API vs UI)
- duplicate registryId detection
- invalid lifecycle exposure detection

---

### 2. EXPLORER SURFACE ENFORCEMENT

Status: ACTIVE

Objectives:
- ensure Explorer uses ONLY Snowflake public views
- eliminate any workflow data leakage
- enforce consistent aggregation

Required Views:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

Critical Rules:
- NO use of CORE.REGISTRY_AI_SYSTEMS directly
- NO TMP registry IDs in UI
- ONLY certified/public systems exposed

---

### 3. SYSTEMS SURFACE CORRECTION

Status: ACTIVE

Objectives:
- ensure `/explorer/systems` uses ONLY:
  CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Requirements:
- all systems must have REGISTRY_ID
- all systems must inherit certification fields
- no blank certification fields due to data mismatch
- no pre-public workflow systems exposed

Success Criteria:
- all systems displayed are certified
- all fields populated from Snowflake view
- no UI fallback logic required

---

### 4. API CONTRACT PARITY

Status: ACTIVE

Objectives:
- ensure API responses match Snowflake views exactly
- eliminate field mismatches
- ensure deterministic outputs

Endpoints in Scope:
- /api/registry
- /api/registry/search
- /api/explorer
- /api/verify/[registryId]

Rules:
- no transformation of trust logic
- no derived fields
- strict mapping only

---

### 5. SIGNATURE VERIFICATION VALIDATION

Status: ACTIVE

Objectives:
- validate cryptographic trust layer

Validation Targets:
- /api/verify/[registryId]
- /api/.well-known/gafaig-public-key
- /api/badge/[registryId]
- widget integration

Requirements:
- messageString matches message exactly
- signature verifies using Ed25519
- kid matches public key
- payload is deterministic

Success Criteria:
- independent third-party verification succeeds

---

### 6. SNOWFLAKE → UI PARITY VALIDATION

Status: ACTIVE

Objectives:
- ensure UI reflects Snowflake exactly

Pages in Scope:
- /registry
- /registry/[registryId]
- /explorer
- /explorer/organizations
- /explorer/countries
- /explorer/systems

Checks:
- counts match Snowflake
- fields match Snowflake
- no missing or derived data
- no UI-side corrections

---

### 7. DETERMINISTIC PIPELINE VALIDATION

Status: ACTIVE

Objectives:
validate full pipeline reproducibility:

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
- widget script

Requirements:
- all rely on signed proof
- no unsigned trust allowed
- all outputs reproducible

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

System is in **final validation phase**

---

## BLOCKERS

NONE CRITICAL

All prior blockers have been resolved:
- registry view misalignment
- explorer stats mismatch
- decision lifecycle ambiguity
- publish pipeline inconsistencies
- signature contract gaps

---

## REMAINING RISKS

- accidental use of non-public tables in query layer
- drift between Snowflake views and API mapping
- UI fallback logic masking data issues
- future schema changes breaking parity

---

## NEXT EXECUTION STEPS

1. validate V_REGISTRY_PUBLIC against UI
2. validate V_REGISTRY_AI_SYSTEMS_PUBLIC usage
3. confirm explorer systems correctness
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

GAFAIG is now a deterministic system approaching full production readiness.

The focus is no longer building.

The focus is ensuring:
- correctness
- consistency
- reproducibility
- trust integrity

---

END OF FILE