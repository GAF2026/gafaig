# VERIFIED_DEFINITION.md — Last Updated: 2026-04-19

## PURPOSE

This document defines what it means for an AI system, organization, or registry record to be considered "Verified" within the GAFAIG platform.

It establishes:
- The difference between Verified, Approved, and Certified
- The minimum requirements for each state
- The exact conditions under which a record can be trusted
- The enforcement boundaries across Snowflake, API, and UI

This definition is a **core trust contract** and must be consistently enforced across all system layers.

---

## CORE PRINCIPLE

Verification in GAFAIG is **state-based, deterministic, and evidence-backed**.

A record is not considered verified based on UI display or API response alone.  
A record is only verified if it satisfies all underlying Snowflake conditions and workflow requirements.

---

## TRUST STATE HIERARCHY

GAFAIG defines three primary trust states:

1. VERIFIED (process-level validation)
2. APPROVED (decision-level validation)
3. CERTIFIED (public registry validation)

These states are strictly ordered and cannot be skipped.

---

## VERIFIED (DEFINITION)

A record is considered VERIFIED when:

1. A canonical verification case exists in CORE.VERIFICATION_CASES
2. The case has progressed through the workflow:
   CASE → FINDINGS → EVIDENCE → EVENTS
3. Findings exist and are associated with the case
4. Evidence exists and is linked to findings
5. Events exist and reflect workflow execution
6. No structural gaps exist in the verification chain
7. Data integrity is maintained across all linked tables

A VERIFIED record represents:
- Completed data intake
- Completed verification workflow execution
- Structural completeness of verification data

A VERIFIED record does NOT imply:
- Approval
- Certification
- Public trust status

---

## APPROVED (DEFINITION)

A record is considered APPROVED when:

1. The record is VERIFIED
2. Scoring has been executed via CORE.SP_SCORE_CASE_ENTERPRISE
3. A score exists in CORE.CASE_SCORE_SNAPSHOTS
4. A decision has been issued in CORE.DECISIONS
5. DECISION_STATUS = 'APPROVED'
6. VALID_FROM and VALID_TO are defined

An APPROVED record represents:
- Completion of verification workflow
- Completion of scoring
- Formal governance decision issued

An APPROVED record does NOT imply:
- Public registry inclusion
- External trust distribution

---

## CERTIFIED (DEFINITION)

A record is considered CERTIFIED when:

1. The record is APPROVED
2. It has been published via CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3
3. A record exists in CORE.REGISTRY_SNAPSHOTS
4. REGISTRY_ID has been assigned
5. PUBLISHED_AT is not null
6. The record appears in CORE.V_REGISTRY_PUBLIC
7. Certification status resolves to "Certified"

A CERTIFIED record represents:
- Public trust status
- Registry inclusion
- External verifiability

Only CERTIFIED records are considered:
- Authoritative
- Publicly trusted
- Eligible for verification proof signing

---

## VERIFICATION VS CERTIFICATION

VERIFIED:
- Internal state
- Workflow completeness
- Not exposed publicly as trust

CERTIFIED:
- External state
- Registry-backed
- Cryptographically verifiable
- Exposed via API and UI

---

## DATA REQUIREMENTS FOR VERIFIED STATE

A record must satisfy:

### CASE REQUIREMENTS
- Valid CASE_ID
- Linked to APPLICATION_ID
- Present in CORE.VERIFICATION_CASES

### FINDINGS REQUIREMENTS
- At least one finding exists
- Findings linked to CASE_ID
- Stored in CORE.VERIFICATION_FINDINGS

### EVIDENCE REQUIREMENTS
- Evidence records exist
- Linked via CORE.VERIFICATION_FINDING_EVIDENCE
- Evidence stored in CORE.VERIFICATION_EVIDENCE

### EVENTS REQUIREMENTS
- Events exist reflecting workflow
- Stored in CORE.VERIFICATION_EVENTS
- Represent progression of case lifecycle

### INTEGRITY REQUIREMENTS
- No orphan records
- No missing joins
- All IDs deterministic and consistent

---

## DATA REQUIREMENTS FOR APPROVED STATE

In addition to VERIFIED:

- Score exists in CORE.CASE_SCORE_SNAPSHOTS
- Score derived from V_GOVERNANCE_SCORE_CASE
- Decision exists in CORE.DECISIONS
- DECISION_STATUS = 'APPROVED'
- VALID_FROM and VALID_TO defined

---

## DATA REQUIREMENTS FOR CERTIFIED STATE

In addition to APPROVED:

- Registry snapshot exists
- Stored in CORE.REGISTRY_SNAPSHOTS
- REGISTRY_ID assigned
- PUBLISHED_AT populated
- Record appears in CORE.V_REGISTRY_PUBLIC
- CERTIFICATION_STATUS = 'Certified'

---

## PUBLIC TRUST REQUIREMENTS

A record is publicly trusted only when:

1. It is CERTIFIED
2. It is returned via /api/verify/[registryId]
3. It includes a valid cryptographic signature
4. Signature verifies using public key
5. Message matches signed payload exactly

Anything less is NOT trusted.

---

## LIFECYCLE STATES

Derived states include:

- Not Verified
- Verified
- Approved
- Certified
- Expired
- Expiring Soon
- Renewal Required

Lifecycle states are derived from:
- VALID_FROM
- VALID_TO
- DECISION_STATUS

---

## INVALID STATES

A record is invalid if:

- Missing case
- Missing findings
- Missing evidence
- Missing events
- Missing score (for approved/certified)
- Missing decision
- Missing registry snapshot (for certified)
- Invalid signature (for public trust)

---

## SYSTEM ENFORCEMENT

Snowflake:
- Enforces structural validity
- Stores all canonical data

Procedures:
- Enforce transitions between states

Views:
- Expose only valid projections

API:
- Exposes only certified records for trust

UI:
- Displays state without modifying logic

---

## NON-NEGOTIABLE RULES

- VERIFIED must precede APPROVED
- APPROVED must precede CERTIFIED
- No skipping states
- No manual overrides outside procedures
- No UI/API state mutation
- No certification without registry snapshot
- No trust without signature

---

## TRUST MODEL SUMMARY

Verified = Data integrity  
Approved = Governance decision  
Certified = Public trust  

Trust only exists at the CERTIFIED level.

---

## ENFORCEMENT

This document defines the canonical meaning of verification in GAFAIG.

Any deviation:
- breaks trust model
- invalidates registry integrity
- must be corrected immediately

This is a critical system contract.

---

END OF FILE