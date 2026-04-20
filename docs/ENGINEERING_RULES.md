# ENGINEERING_RULES.md — Last Updated: 2026-04-19

## PURPOSE

This document defines the non-negotiable engineering rules for the GAFAIG platform.

It governs:
- System architecture
- Data flow
- Code boundaries
- Trust enforcement
- Development behavior

This is not guidance.  
This is a **hard constraint system**.

Any violation must be corrected immediately.

---

## CORE PRINCIPLE

GAFAIG is a deterministic system.

All trust originates from Snowflake.

All public outputs must be traceable to:
Snowflake → Views → API → UI

No computation, inference, or mutation of trust data is allowed outside Snowflake.

---

## SOURCE OF TRUTH

Snowflake is the ONLY source of truth.

Specifically:
- CORE tables store canonical data
- Views define public projections
- Procedures enforce state transitions

Rules:
- UI must not compute trust data
- API must not compute trust data
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
- The same CASE_ID must be generated
- The same score must be produced
- The same decision must be issued
- The same registry output must be returned

Rules:
- No randomness
- No non-deterministic IDs
- No hidden state

---

## ID GENERATION RULES

All IDs must be deterministic:

- APPLICATION_ID
- CASE_ID
- FINDING_ID
- EVIDENCE_ID
- EVENT_ID
- PARTICIPANT_ID
- REGISTRY_ID (incremental deterministic)

Exception:
- REGISTRY_SNAPSHOT_ID may use UUID (append-only versioning)

Rules:
- IDs must be reproducible
- IDs must not be reassigned
- IDs must not be mutated

---

## APPEND-ONLY RULE

Registry data is append-only.

Rules:
- CORE.REGISTRY_SNAPSHOTS must never be updated
- New state = new row
- Historical data must remain intact

Violations:
- Updating a snapshot
- Deleting a snapshot
- Overwriting registry history

---

## SCORING RULES

All scoring must originate from:

CORE.V_GOVERNANCE_SCORE_CASE

Rules:
- No scoring logic in API
- No scoring logic in UI
- No derived scoring fields outside Snowflake
- Score version must be tracked

---

## DECISION RULES

Decisions must be:

- Derived from scoring
- Stored in CORE.DECISIONS
- Explicitly defined (APPROVED / REJECTED / etc.)

Rules:
- No implicit decisions
- No UI-based decisions
- No API-based decisions

---

## REGISTRY RULES

Registry data must:

- Originate from CORE.REGISTRY_SNAPSHOTS
- Be exposed via V_REGISTRY_PUBLIC
- Reflect only approved and published cases

Rules:
- No synthetic registry entries
- No UI filtering logic to simulate certification
- No API overrides

---

## VIEW RULES

Views are projections only.

Rules:
- No business logic duplication
- No recomputation of scores
- No mutation of underlying data
- Must reflect Snowflake tables exactly

---

## API RULES

API layer is read-only.

Rules:
- Must query Snowflake views only
- Must not compute trust data
- Must not modify responses beyond formatting
- Must not cache derived trust values

---

## UI RULES

UI is presentation-only.

Rules:
- Must not compute trust logic
- Must not derive state
- Must not override API data
- Must display Snowflake truth only

---

## SIGNATURE RULES

All public trust must be signed.

Rules:
- Use Ed25519
- Signature must be deterministic
- messageString must match message exactly
- kid must match public key endpoint
- No unsigned trust outputs

---

## PUBLIC TRUST RULE

A record is trusted only if:

1. It is CERTIFIED
2. It exists in V_REGISTRY_PUBLIC
3. It is returned via /api/verify/[registryId]
4. It includes a valid signature
5. Signature verifies using public key

Anything less is NOT trusted.

---

## VERSIONING RULES

All critical systems must be versioned:

- Scoring
- Signature contract
- Registry snapshots
- API contract

Rules:
- No silent changes
- No breaking changes without version update
- Historical data must remain valid

---

## FILE STRUCTURE RULES

- Must follow GAFAIG_VS_CODE_File_Tree.md
- No ad hoc file placement
- No duplicate logic across files
- No mixing canonical and legacy files

---

## SEED DATA RULES

- Single source: CANONICAL_DEMO_SEED_MASTER.sql
- No secondary seed files
- No manual inserts outside seed
- All data must be deterministic

---

## LEGACY FILE RULE

Files labeled:
- Archive
- Legacy
- Backup

Must NOT be used.

Rules:
- Must not be executed
- Must not influence system state

---

## LAYOUT RULES

Must follow PAGE_LAYOUT_SYSTEM.md.

Rules:
- PublicPageHero required
- max-w-[1180px] required
- space-y-8 required
- No layout drift allowed

---

## QUERY LAYER RULES

- Must map directly to Snowflake views
- No derived fields
- No transformations beyond formatting
- No hidden logic

---

## SECURITY RULES

- Signing keys must be protected
- Public key must be exposed via API
- No sensitive data in UI or API
- No secrets committed to repo

---

## ENVIRONMENT RULES

.env.local must include:
- Snowflake credentials
- Signing key
- NEXT_PUBLIC_BASE_URL

Rules:
- No hardcoded secrets
- No environment drift between local and production

---

## FAILURE CONDITIONS

System is invalid if:

- Trust logic exists outside Snowflake
- IDs are non-deterministic
- Registry snapshots are mutated
- Signature is invalid
- API returns inconsistent data
- UI diverges from Snowflake truth

---

## ENFORCEMENT

These rules define the GAFAIG engineering system.

They are:
- Mandatory
- Enforced
- Non-negotiable

Any violation:
- Breaks determinism
- Breaks trust
- Breaks system integrity

Must be corrected immediately.

---

END OF FILE