# VERIFIED_DEFINITION.md
Last Updated: 2026-04-23

## PURPOSE

This document defines what it means for an AI system, organization, or registry record to be considered "Verified" within the GAFAIG platform.

It establishes:
- the distinction between VERIFIED, APPROVED, and CERTIFIED
- the required conditions for each state
- the deterministic enforcement model across Snowflake, API, and UI
- the exact boundary of public trust

This definition is a core trust contract and must be enforced consistently across all system layers.

---

## CORE PRINCIPLE

Verification in GAFAIG is deterministic, state-based, and evidence-backed.

A record is NOT considered verified based on:
- UI display
- API response
- widget rendering

A record is verified ONLY if:
- all required Snowflake conditions are satisfied
- the full workflow chain is complete
- all linked data is structurally valid

---

## TRUST STATE HIERARCHY (LOCKED)

GAFAIG defines three primary trust states:

1. VERIFIED (workflow completeness — internal)
2. APPROVED (governance decision — internal)
3. CERTIFIED (public trust — external)

These states are strictly sequential and cannot be skipped.

---

## VERIFIED (DEFINITION)

A record is VERIFIED when:

1. A canonical case exists in CORE.VERIFICATION_CASES
2. The workflow chain is complete:
   CASE → FINDINGS → EVIDENCE → EVENTS
3. Findings exist and are linked to the case
4. Evidence exists and is linked to findings
5. Events exist and reflect workflow execution
6. No structural gaps exist in the verification chain
7. All relationships are valid and deterministic

A VERIFIED record represents:
- complete data intake
- complete verification workflow
- structural data integrity

A VERIFIED record does NOT imply:
- approval
- certification
- public trust

---

## APPROVED (DEFINITION)

A record is APPROVED when:

1. The record is VERIFIED
2. Scoring has been executed via CORE.SP_SCORE_CASE_ENTERPRISE
3. A score exists in CORE.CASE_SCORE_SNAPSHOTS
4. Score originates from CORE.V_GOVERNANCE_SCORE_CASE
5. A decision exists in CORE.DECISIONS
6. The active decision row satisfies:
   - DECISION_STATUS = 'APPROVED'
   - VALID_TO IS NULL

An APPROVED record represents:
- completed verification
- completed scoring
- formal governance decision

An APPROVED record is:
- strictly INTERNAL
- never a public trust signal

---

## CERTIFIED (DEFINITION)

A record is CERTIFIED when:

1. The record is APPROVED
2. It is currently valid (lifecycle enforced)
3. It is publishable according to CORE.V_CASE_RENEWAL_STATUS
4. It has been published via CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3
5. A registry snapshot exists in CORE.REGISTRY_SNAPSHOTS
6. A REGISTRY_ID has been assigned
7. The record appears in CORE.V_REGISTRY_PUBLIC
8. CERTIFICATION_STATUS resolves to "CERTIFIED"

A CERTIFIED record represents:
- public trust status
- registry inclusion
- eligibility for cryptographic verification

Only CERTIFIED records are:
- authoritative
- publicly trusted
- externally verifiable

---

## 🔒 PUBLIC TRUST BOUNDARY (PHASE 4 LOCK)

The public system exposes ONLY:

- certificationStatus
- certifiedAt
- validFrom
- validTo
- entityName
- registryId

The public system MUST NOT expose:

- decision_status
- score
- tier
- band
- internal workflow states

This boundary is absolute and non-negotiable.

---

## VERIFIED VS APPROVED VS CERTIFIED

VERIFIED:
- internal workflow state
- structural completeness
- not publicly visible

APPROVED:
- governance decision issued
- lifecycle initiated
- still internal

CERTIFIED:
- published to registry
- publicly visible
- cryptographically verifiable

Trust exists ONLY at the CERTIFIED level.

---

## DATA REQUIREMENTS — VERIFIED

A record must satisfy:

### CASE
- valid CASE_ID
- linked to APPLICATION_ID
- present in CORE.VERIFICATION_CASES

### FINDINGS
- at least one finding
- linked to CASE_ID
- stored in CORE.VERIFICATION_FINDINGS

### EVIDENCE
- evidence exists
- linked via CORE.VERIFICATION_FINDING_EVIDENCE
- stored in CORE.VERIFICATION_EVIDENCE

### EVENTS
- workflow events exist
- stored in CORE.VERIFICATION_EVENTS
- reflect progression of verification

### INTEGRITY
- no orphan records
- no missing joins
- deterministic IDs
- consistent relationships

---

## DATA REQUIREMENTS — APPROVED

In addition to VERIFIED:

- score exists in CORE.CASE_SCORE_SNAPSHOTS
- score derived from CORE.V_GOVERNANCE_SCORE_CASE
- decision exists in CORE.DECISIONS
- active decision row:
  - DECISION_STATUS = 'APPROVED'
  - VALID_TO IS NULL

---

## DATA REQUIREMENTS — CERTIFIED

In addition to APPROVED:

- registry snapshot exists in CORE.REGISTRY_SNAPSHOTS
- REGISTRY_ID assigned
- PUBLISHED_AT populated
- record appears in CORE.V_REGISTRY_PUBLIC
- CERTIFICATION_STATUS = 'CERTIFIED'
- lifecycle validity enforced via CORE.V_CASE_RENEWAL_STATUS

---

## 🌐 PUBLIC TRUST REQUIREMENTS (UPDATED)

A record is publicly trusted ONLY when:

1. It is CERTIFIED
2. It is returned via /api/verify/[registryId]
3. It includes a valid cryptographic signature
4. The signature verifies using the GAFAIG public key
5. The signed message matches EXACTLY
6. The payload is not modified by any downstream system

Anything less is NOT trusted.

---

## 🔐 VERIFY = TRUST (PHASE 4 RULE)

- /api/verify is the ONLY trust authority
- UI must not infer trust
- Widgets must not compute trust
- Badges must not infer trust

All trust is derived ONLY from signed verification payloads.

---

## LIFECYCLE STATES

Derived states include:

- Not Verified
- Verified
- Approved
- Certified
- Expired
- Renewal Required
- Revoked

Lifecycle is determined by:

- CORE.DECISIONS
- VALID_FROM / VALID_TO
- CORE.V_CASE_RENEWAL_STATUS

---

## INVALID STATES

A record is invalid if:

- missing case
- missing findings
- missing evidence
- missing events
- missing score (for approved/certified)
- missing decision
- no active decision row
- expired or revoked but exposed
- missing registry snapshot (for certified)
- invalid signature (for public trust)

---

## SYSTEM ENFORCEMENT

Snowflake:
- enforces structure and lifecycle
- stores canonical data
- computes scoring and renewal

Procedures:
- enforce deterministic transitions
- prevent invalid progression

Views:
- expose only valid states
- enforce public/private boundary

API:
- exposes only certified records for trust
- must not compute trust logic

UI:
- renders state only
- must not infer trust

Widgets:
- consume verify endpoint only
- must not reconstruct trust

---

## NON-NEGOTIABLE RULES

- VERIFIED must precede APPROVED
- APPROVED must precede CERTIFIED
- no skipping states
- no UI/API state mutation
- no certification without registry snapshot
- no trust without signature
- no public exposure of non-certified records

---

## TRUST MODEL SUMMARY

Verified = data integrity  
Approved = governance decision  
Certified = public trust  

Only CERTIFIED records are trusted externally.

---

## FINAL STATEMENT

A GAFAIG record is:

Verified → structurally complete  
Approved → governance validated  
Certified → publicly trusted  

Trust is not implied.  

Trust is deterministically earned and cryptographically proven.

---

END OF FILE