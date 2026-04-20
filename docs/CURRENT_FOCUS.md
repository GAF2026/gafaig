# CURRENT_FOCUS.md — Last Updated: 2026-04-19

## PURPOSE

This document defines the current execution focus for GAFAIG.

It acts as:
- The active control surface for system development
- The alignment layer between Snowflake, API, and UI
- The enforcement mechanism for priorities and sequencing

Only items listed here are considered active work.

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

Stabilize and validate the **full multi-case deterministic pipeline** and ensure **public trust distribution is production-ready**.

This includes:
- Multi-case seed expansion
- Full pipeline validation (end-to-end)
- Registry integrity enforcement
- Public trust surface validation (verify + badge + widget)
- UI alignment with Snowflake truth

---

## ACTIVE WORKSTREAMS

### 1. MULTI-CASE REAL DATA SEED (EXPANSION)

Status: ACTIVE

Objectives:
- Expand from single-case to multi-case dataset
- Target: 26 deterministic cases
- Include:
  - Multiple organizations
  - Multiple countries
  - Varied tiers (Tier 1–3)
  - Varied bands (A–D)
  - Mixed lifecycle states (Active, Expiring, Expired)

Requirements:
- All data must originate from canonical seed file
- Deterministic IDs required across all tables
- No manual inserts outside seed file

Output:
- GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql fully populated

---

### 2. FULL PIPELINE VALIDATION

Status: ACTIVE

Objectives:
Validate complete flow:

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY

Validation Criteria:
- Each stage produces expected rows
- No orphan records
- All joins resolve correctly
- Deterministic IDs maintained
- No null critical fields

Validation Queries:
- Case counts vs application counts
- Findings linked to cases
- Evidence linked to findings
- Events present per case
- Score exists per approved case
- Decision exists per scored case
- Registry snapshot exists per approved case

---

### 3. SCORING → DECISION → REGISTRY FLOW

Status: ACTIVE

Objectives:
- Execute scoring using CORE.SP_SCORE_CASE_ENTERPRISE
- Generate CASE_SCORE_SNAPSHOTS
- Issue decisions in CORE.DECISIONS
- Publish via CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Requirements:
- Score must originate from V_GOVERNANCE_SCORE_CASE
- Decision must reflect score output
- Registry must reuse REGISTRY_ID when applicable
- Append-only snapshot behavior enforced

---

### 4. TRUST DISTRIBUTION (PUBLIC SURFACE)

Status: ACTIVE

Objectives:
Validate external trust layer:

- /api/verify/[registryId]
- /api/badge/[registryId]
- Widget embedding (/widget/gafaig-widget.js)
- Public key endpoint

Requirements:
- Signed proof must be valid (Ed25519)
- messageString must match message exactly
- signature must verify with public key
- verificationKeyUrl must resolve correctly

Success Criteria:
- Third-party system can independently verify certification

---

### 5. REGISTRY + EXPLORER ALIGNMENT

Status: ACTIVE

Objectives:
- Ensure Registry displays ONLY certified records
- Ensure Explorer displays broader dataset (approved + certified)
- Align all metrics with Snowflake views

Key Views:
- V_REGISTRY_PUBLIC
- V_REGISTRY_LATEST_APPROVED
- V_REGISTRY_AI_SYSTEMS_PUBLIC

Requirements:
- No UI filtering logic
- No API-derived logic
- All aggregation must come from Snowflake

---

### 6. UI LAYOUT STANDARDIZATION

Status: ACTIVE

Objectives:
- Enforce PAGE_LAYOUT_SYSTEM.md across all pages
- Eliminate layout drift
- Ensure all pages match Registry / Explorer design

Requirements:
- PublicPageHero must be used everywhere
- max-w-[1180px] enforced
- space-y-8 spacing enforced
- No custom layout systems

Pages in scope:
- Home
- Mission
- Framework
- Registry
- Explorer
- Verify
- Developers
- Apply

---

### 7. LEGACY FILE ELIMINATION

Status: ACTIVE

Objectives:
- Remove all archive/legacy SQL dependencies
- Ensure only canonical files are used

Rules:
- No file with "Archive", "Legacy", or "Backup" in name may be executed
- All rebuilds must use canonical file sequence
- Seed must be single source

---

### 8. DETERMINISTIC ID ENFORCEMENT

Status: ACTIVE

Objectives:
Ensure all IDs are deterministic:

- APPLICATION_ID
- CASE_ID
- FINDING_ID
- EVIDENCE_ID
- EVENT_ID
- REGISTRY_ID
- PARTICIPANT_ID

Requirements:
- No UUID randomness except where explicitly allowed (snapshot IDs)
- All IDs must be reproducible from input data

---

## CURRENT SYSTEM STATE

APPLICATION → CASE: COMPLETE  
CASE → FINDINGS: COMPLETE  
FINDINGS → EVIDENCE: COMPLETE  
EVIDENCE → EVENTS: COMPLETE  
EVENTS → SCORING: READY  
SCORING → DECISION: READY  
DECISION → REGISTRY: READY  
REGISTRY → API/UI: OPERATIONAL  

System is now in **final validation + expansion phase**

---

## BLOCKERS (RESOLVED)

- Snowflake DDL/DML ambiguity issues → resolved
- Participants table normalization → resolved
- Events table ambiguity → resolved
- Missing canonical events file → resolved
- Registry publish procedure alignment → resolved

---

## REMAINING RISKS

- Explorer metrics mismatch (counts vs registry)
- Incomplete multi-case seed coverage
- Potential ID inconsistency across seed expansions
- UI pages not fully aligned to layout system

---

## NEXT EXECUTION STEPS

1. Complete multi-case seed (26 cases)
2. Run full rebuild (01_REBUILD_ENVIRONMENT_CANONICAL.sql)
3. Execute seed file
4. Run scoring procedure
5. Run decision issuance
6. Run registry publish procedure
7. Validate public views
8. Validate API endpoints
9. Validate verify + badge + widget
10. Confirm full pipeline integrity

---

## NON-NEGOTIABLE RULES

- Snowflake is the source of truth
- No UI/API logic for scoring or trust
- No skipping pipeline steps
- No manual data mutation
- No non-deterministic IDs
- No legacy file usage
- No layout drift

---

## ENFORCEMENT

This document defines the active execution state of GAFAIG.

If a task is not listed here:
- It is not active
- It must not be worked on

All development must align with CURRENT_FOCUS.md.

---

END OF FILE