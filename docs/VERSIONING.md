# VERSIONING.md — Last Updated: 2026-04-19

## PURPOSE

This document defines the canonical versioning system for GAFAIG.

It governs:
- How system components evolve over time
- How data, scoring, and registry states are versioned
- How backward compatibility is preserved
- How deterministic reproducibility is maintained

Versioning in GAFAIG is not cosmetic. It is a **core integrity mechanism**.

---

## CORE PRINCIPLE

All critical outputs in GAFAIG must be versioned.

This includes:
- Scoring logic
- Registry snapshots
- Verification workflows
- Public API contracts
- Cryptographic signature payloads

Versioning ensures:
- Determinism
- Reproducibility
- Auditability
- Historical integrity

No system component is allowed to change silently.

---

## VERSIONING TIERS

GAFAIG uses structured versioning across five layers:

1. SCORING VERSION
2. WORKFLOW VERSION
3. REGISTRY SNAPSHOT VERSION
4. API CONTRACT VERSION
5. SIGNATURE CONTRACT VERSION

Each layer is independently versioned but must remain compatible.

---

## SCORING VERSION

Source:
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.SP_SCORE_CASE_ENTERPRISE

Versioning Method:
- Explicit version string (e.g., "v1.0", "v1.2")

Requirements:
- Every score must be associated with a scoring version
- Stored in CASE_SCORE_SNAPSHOTS
- Changes to scoring logic MUST increment version

Rules:
- No retroactive score modification
- Old scores must remain reproducible
- New versions must not overwrite old results

---

## WORKFLOW VERSION

Source:
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_EVENTS
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE

Purpose:
- Defines structure of verification process

Versioning Method:
- Implicit structural versioning (schema + procedure alignment)

Requirements:
- Workflow changes must be documented
- Schema changes must not break historical data
- Backward compatibility must be preserved

Rules:
- No destructive schema changes
- No orphaned workflow states
- All transitions must remain valid

---

## REGISTRY SNAPSHOT VERSION

Source:
- CORE.REGISTRY_SNAPSHOTS

Purpose:
- Immutable record of certification state at a specific time

Versioning Method:
- Append-only records
- Each snapshot represents a version

Key Fields:
- REGISTRY_ID
- REGISTRY_SNAPSHOT_ID
- CREATED_AT
- PUBLISHED_AT

Rules:
- Snapshots must never be updated
- New state = new snapshot
- Historical snapshots must remain queryable

---

## API CONTRACT VERSION

Source:
- app/api/* routes

Purpose:
- Defines structure of data returned to external consumers

Versioning Method:
- Implicit versioning via contract stability
- Explicit versioning if breaking changes occur

Rules:
- No breaking changes without version increment
- Field names must remain stable
- Deprecated fields must be phased out gradually

---

## SIGNATURE CONTRACT VERSION

Source:
- lib/crypto/verify-signing.ts
- VERIFICATION_SIGNATURE_CONTRACT.md

Purpose:
- Defines how payloads are signed and verified

Versioning Method:
- Versioned via key ID (kid)
- Versioned via message structure

Key Fields:
- alg
- kid
- message
- messageString
- signature

Rules:
- Signature format must not change silently
- Any change to message structure requires version update
- Old signatures must remain verifiable

---

## KEY VERSION IDENTIFIERS

### KID (Key ID)

Format:
- gafaig-ed25519-YYYY-MM

Example:
- gafaig-ed25519-2026-01

Purpose:
- Identifies signing key version
- Enables key rotation without breaking verification

Rules:
- Must be included in every proof
- Must match public key endpoint
- Must not be reused incorrectly

---

## VERSION PROPAGATION RULES

When a version changes:

1. Scoring change → update scoring version
2. Signature change → update kid
3. API change → update contract or version route
4. Workflow change → update schema + docs
5. Registry change → create new snapshot

All downstream systems must reflect version changes.

---

## BACKWARD COMPATIBILITY

GAFAIG must support:

- Historical registry snapshots
- Historical signatures
- Historical scoring outputs

Rules:
- Old data must remain verifiable
- Old signatures must remain valid
- Old API responses must remain interpretable

---

## DETERMINISTIC REPRODUCIBILITY

Given:
- CASE_ID
- SCORING_VERSION
- WORKFLOW_STATE

The system must always reproduce:
- Same score
- Same tier/band
- Same decision outcome

No randomness allowed.

---

## VERSION FAILURE MODES

System is invalid if:

- Score changes without version increment
- Snapshot is overwritten instead of appended
- Signature structure changes without new kid
- API returns inconsistent fields
- Historical data cannot be reproduced

---

## VERSION LOCKING RULES

Once published:

- Registry snapshot is immutable
- Signature is immutable
- Score is immutable

New version requires:
- New snapshot
- New signature
- New evaluation cycle

---

## CURRENT VERSION STATE (2026-04-19)

Scoring:
- Active: v1.0 (enterprise scoring)

Workflow:
- Canonical case-first workflow active

Registry:
- Append-only snapshot system active

API:
- Stable contract (no version prefix yet)

Signature:
- Ed25519
- kid format: gafaig-ed25519-2026-01

---

## FUTURE VERSIONING STRATEGY

Planned:

- Explicit API versioning (/v1/)
- Multiple scoring models (enterprise, regulatory, sector-specific)
- Key rotation schedule
- Versioned verification workflows

---

## NON-NEGOTIABLE RULES

- No silent changes
- No mutable snapshots
- No breaking API changes without versioning
- No signature changes without key update
- No scoring changes without version increment

---

## ENFORCEMENT

Versioning is a core integrity system in GAFAIG.

Any violation:
- breaks reproducibility
- breaks trust
- invalidates registry integrity

All changes must follow this contract.

---

END OF FILE