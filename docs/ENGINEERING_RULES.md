# ENGINEERING_RULES.md
Date: 2026-04-21

## PURPOSE

This document defines the non-negotiable engineering rules for the GAFAIG platform.

It governs:
- system architecture
- data flow
- code boundaries
- trust enforcement
- development behavior

This is not guidance.  
This is a **hard constraint system**.

Any violation must be corrected immediately.

---

## CORE PRINCIPLE

GAFAIG is a deterministic system.

All trust originates from Snowflake.

All public outputs must follow:

Snowflake → Views → Query Layer → API → UI

No computation, inference, mutation, or correction of trust data is allowed outside Snowflake.

---

## SOURCE OF TRUTH

Snowflake is the ONLY source of truth.

Specifically:
- CORE tables store canonical data
- Views define public projections
- Procedures enforce lifecycle transitions

Rules:
- UI must not compute trust data
- API must not compute trust data
- Query layer must not compute trust data
- No duplication of logic outside Snowflake

---

## CANONICAL DATA FLOW

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

Rules:
- No skipping steps
- No reordering steps
- No alternate flows
- Each stage must be complete before the next

---

## DETERMINISM REQUIREMENT

All outputs must be deterministic.

Given the same inputs:
- Same CASE_ID
- Same score
- Same decision
- Same registry output
- Same signature

Rules:
- No randomness
- No hidden state
- No environment-dependent behavior

---

## ID GENERATION RULES

All IDs must be deterministic:

- APPLICATION_ID  
- CASE_ID  
- FINDING_ID  
- EVIDENCE_ID  
- EVENT_ID  
- PARTICIPANT_ID  
- REGISTRY_ID  

Exception:
- REGISTRY_SNAPSHOT_ID may use UUID (append-only versioning)

Rules:
- IDs must be reproducible
- IDs must not be mutated
- IDs must not be reassigned

---

## APPEND-ONLY RULE

Registry and lifecycle data are append-only.

Rules:
- CORE.REGISTRY_SNAPSHOTS must never be updated
- CORE.DECISIONS must not overwrite active rows (must close via VALID_TO)
- New state = new row

Violations:
- Updating snapshots
- Deleting historical records
- Overwriting lifecycle history

---

## SCORING RULES

All scoring must originate from:

CORE.V_GOVERNANCE_SCORE_CASE

Rules:
- No scoring logic in API
- No scoring logic in UI
- No derived scoring fields outside Snowflake
- Score must be versioned

---

## DECISION RULES

Decisions must:

- originate from scoring outputs
- be stored in CORE.DECISIONS
- follow append-only lifecycle model

Rules:
- exactly one active decision row (VALID_TO IS NULL)
- no implicit decisions
- no UI/API-based decisions

---

## LIFECYCLE RULES

Lifecycle must be derived from:

- CORE.DECISIONS
- VALID_FROM / VALID_TO
- CORE.V_CASE_RENEWAL_STATUS

Rules:
- lifecycle must not be inferred in UI/API
- expired or revoked records must not appear in public views
- publishability must be determined in Snowflake only

---

## REGISTRY RULES

Registry data must:

- originate from CORE.REGISTRY_SNAPSHOTS
- be exposed via CORE.V_REGISTRY_PUBLIC
- represent only certified, valid records

Rules:
- no synthetic registry entries
- no UI filtering to simulate certification
- no API overrides

---

## PUBLIC VIEW RULES

Views are projections only.

Rules:
- no recomputation of scores
- no lifecycle inference outside Snowflake
- no mutation of data
- must reflect canonical tables exactly

Critical Views:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

---

## EXPLORER RULES (CRITICAL)

Explorer must use ONLY public views.

Rules:
- must query CORE.V_REGISTRY_PUBLIC
- must query CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- must query CORE.V_EXPLORER_STATS

Forbidden:
- CORE.REGISTRY_AI_SYSTEMS (direct)
- workflow tables
- TMP registry IDs

---

## SYSTEMS SURFACE RULE

`/explorer/systems` must:

- use CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC ONLY
- display only certified/public systems
- inherit certification fields from registry

Violations:
- blank certification due to wrong data source
- showing non-certified systems
- mixing workflow and public data

---

## QUERY LAYER RULES

Query layer must:

- map directly to Snowflake views
- perform no business logic
- perform no lifecycle logic
- perform no scoring logic

Allowed:
- field mapping
- formatting

Forbidden:
- filtering trust states
- deriving certification
- joining workflow tables for public pages

---

## API RULES

API is read-only trust transport.

Rules:
- must query Snowflake views only
- must not compute trust logic
- must not mutate meaning of data
- must return deterministic outputs

---

## UI RULES

UI is presentation-only.

Rules:
- must not compute trust logic
- must not derive lifecycle state
- must not override API data
- must not hide data inconsistencies

---

## SIGNATURE RULES

All public trust must be signed.

Algorithm:
- Ed25519

Rules:
- messageString must match message exactly
- signature must be deterministic
- kid must match public key endpoint
- no unsigned certification allowed

---

## PUBLIC TRUST RULE

A record is trusted only if:

1. CERTIFIED
2. exists in CORE.V_REGISTRY_PUBLIC
3. returned via /api/verify/[registryId]
4. includes valid signature
5. signature verifies independently

Anything less is NOT trusted.

---

## VERSIONING RULES

All critical systems must be versioned:

- scoring
- signature contract
- registry snapshots
- API contract

Rules:
- no silent changes
- no breaking changes without version increment
- historical outputs must remain valid

---

## FILE STRUCTURE RULES

- must follow GAFAIG_VS_CODE_File_Tree.md
- no duplicate logic across files
- no mixing canonical and legacy files

---

## SEED DATA RULES

- single source: GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql
- no manual inserts
- deterministic dataset only

---

## LEGACY FILE RULE

Files labeled:
- Archive
- Legacy
- Backup

Must NOT be used.

---

## LAYOUT RULES

Must follow PAGE_LAYOUT_SYSTEM.md.

Rules:
- PublicPageHero required
- max-w-[1180px] required
- space-y-8 required
- no layout drift

---

## SECURITY RULES

- private signing key must never leave server
- public key must be exposed via API
- no secrets in repo
- no sensitive data in UI

---

## ENVIRONMENT RULES

.env.local must include:
- Snowflake credentials
- signing key
- NEXT_PUBLIC_BASE_URL

Rules:
- no hardcoded secrets
- no environment drift

---

## FAILURE CONDITIONS

System is invalid if:

- trust logic exists outside Snowflake
- IDs are non-deterministic
- registry snapshots are mutated
- lifecycle is misrepresented
- signature is invalid
- API diverges from Snowflake
- UI diverges from API

---

## ENFORCEMENT

These rules are:

- mandatory
- enforced
- non-negotiable

Any violation:
- breaks determinism
- breaks trust
- invalidates system integrity

Must be corrected immediately.

---

## FINAL RULE

If any layer:
- computes its own truth
- overrides Snowflake
- mixes workflow and public data
- breaks determinism

The system is invalid.

---

END OF FILE