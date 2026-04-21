# VERSIONING.md — Last Updated: 2026-04-21

## PURPOSE

This document defines the canonical versioning system for GAFAIG.

It governs:
- how system components evolve over time
- how scoring, lifecycle, and registry states are versioned
- how reproducibility and auditability are preserved
- how backward compatibility is maintained across all layers

Versioning in GAFAIG is a core integrity mechanism and must never be treated as optional.

---

## CORE PRINCIPLE

All critical outputs in GAFAIG must be versioned and reproducible.

This includes:
- scoring outputs
- registry snapshots
- decision lifecycle states
- verification workflows
- API contracts
- cryptographic signatures

No system behavior may change silently.

---

## VERSIONING LAYERS

GAFAIG enforces versioning across five layers:

1. SCORING VERSION
2. WORKFLOW VERSION
3. REGISTRY SNAPSHOT VERSION
4. API CONTRACT VERSION
5. SIGNATURE CONTRACT VERSION

Each layer is independently versioned but must remain compatible with all others.

---

## 1. SCORING VERSION

Source:
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.SP_SCORE_CASE_ENTERPRISE

Method:
- explicit version string (e.g., "v1.0", "v1.2")

Requirements:
- every score must include a scoring version
- stored in CORE.CASE_SCORE_SNAPSHOTS
- scoring version must be persisted with each snapshot

Rules:
- no retroactive score modification
- no overwriting prior results
- new scoring logic requires version increment
- old scoring versions must remain reproducible

---

## 2. WORKFLOW VERSION

Source:
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_EVENTS
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE

Method:
- implicit versioning via schema + procedure alignment

Purpose:
- defines structure and rules of verification workflow

Requirements:
- workflow changes must be documented
- schema must remain backward compatible
- procedures must respect historical data

Rules:
- no destructive schema changes
- no orphaned workflow states
- no invalid transitions

---

## 3. REGISTRY SNAPSHOT VERSION

Source:
- CORE.REGISTRY_SNAPSHOTS

Purpose:
- immutable representation of certification state at a point in time

Method:
- append-only snapshots
- each snapshot is a version

Key Fields:
- REGISTRY_ID
- REGISTRY_SNAPSHOT_ID
- CREATED_AT
- PUBLISHED_AT

Rules:
- snapshots are immutable
- new state requires new snapshot
- no updates to existing snapshots
- historical snapshots must remain queryable

---

## 4. API CONTRACT VERSION

Source:
- app/api/* routes

Purpose:
- defines external data contract

Method:
- implicit versioning (current)
- explicit versioning required for breaking changes (future /v1/)

Rules:
- no breaking changes without version increment
- field names must remain stable
- deprecated fields must be phased out gradually
- API must reflect Snowflake truth exactly

---

## 5. SIGNATURE CONTRACT VERSION

Source:
- lib/crypto/verify-signing.ts
- VERIFICATION_SIGNATURE_CONTRACT.md

Purpose:
- defines cryptographic verification layer

Method:
- versioned via key ID (kid)
- versioned via message structure

Key Fields:
- alg
- kid
- message
- messageString
- signature

Rules:
- any change to message structure requires version update
- signature must remain reproducible
- historical signatures must remain verifiable
- messageString must remain deterministic

---

## KEY IDENTIFIER VERSIONING

### KID (Key ID)

Format:
gafaig-ed25519-YYYY-MM

Example:
gafaig-ed25519-2026-01

Purpose:
- identifies signing key version
- enables key rotation

Rules:
- must be included in every proof
- must map to public key endpoint
- must never be reused incorrectly

---

## VERSION PROPAGATION RULES

When a version changes:

Scoring change:
- increment scoring version
- generate new score snapshots

Workflow change:
- update schema + procedures
- ensure backward compatibility

Registry change:
- create new snapshot
- never mutate existing snapshot

Signature change:
- update kid
- ensure verification compatibility

API change:
- introduce versioned route if breaking

All downstream systems must reflect version changes.

---

## BACKWARD COMPATIBILITY

GAFAIG must support:

- historical registry snapshots
- historical scoring outputs
- historical signatures
- historical API consumers

Rules:
- old data must remain verifiable
- old signatures must remain valid
- old snapshots must remain accessible
- no breaking historical interpretation

---

## DETERMINISTIC REPRODUCIBILITY

Given:
- CASE_ID
- SCORING_VERSION
- SNAPSHOT_ID

The system must always reproduce:
- identical score
- identical tier and band
- identical decision outcome
- identical registry snapshot

No randomness is allowed anywhere in the system.

---

## VERSION FAILURE MODES

The system is invalid if:

- scoring changes without version increment
- snapshots are overwritten
- signature structure changes without new kid
- API returns inconsistent contract
- historical data cannot be reproduced
- registry record differs from original snapshot

---

## VERSION LOCKING RULES

Once published:

- registry snapshot is immutable
- score snapshot is immutable
- signature is immutable
- decision history is append-only

Any change requires:
- new scoring execution
- new decision row
- new registry snapshot
- new signature

---

## CURRENT VERSION STATE (2026-04-21)

Scoring:
- active: v1.2 (enterprise scoring)

Workflow:
- case-first canonical workflow active

Registry:
- append-only snapshot system active
- latest-approved projection enforced

API:
- stable contract
- no version prefix yet

Signature:
- Ed25519
- kid: gafaig-ed25519-2026-01

Explorer:
- fully aligned to public views
- no workflow leakage allowed

---

## FUTURE VERSIONING STRATEGY

Planned:

- explicit API versioning (/v1/)
- multi-model scoring (enterprise, regulatory, sector)
- automated key rotation
- versioned workflow schemas
- versioned verification standards

---

## NON-NEGOTIABLE RULES

- no silent changes
- no mutable snapshots
- no breaking API changes without versioning
- no signature changes without key update
- no scoring changes without version increment
- no lifecycle logic outside Snowflake

---

## ENFORCEMENT

Versioning is a core integrity mechanism.

Any violation:
- breaks reproducibility
- breaks trust
- invalidates registry integrity

All changes must follow this contract.

---

## FINAL STATEMENT

GAFAIG guarantees trust through:

- deterministic Snowflake computation
- immutable snapshots
- versioned scoring
- versioned signatures
- reproducible outputs

Versioning is how GAFAIG preserves truth over time.

---

END OF FILE