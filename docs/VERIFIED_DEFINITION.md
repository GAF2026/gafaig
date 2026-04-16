# VERIFIED_DEFINITION.md
Last Updated: 2026-04-15

## PURPOSE
This document defines the canonical meaning of “Verified”, “Approved”, and “Certified” across the GAFAIG platform. It establishes a strict, non-overlapping trust model used consistently across Snowflake, API, UI, registry, explorer, verify, and widget surfaces. These definitions are foundational to GAFAIG and must not drift.

---

## CORE PRINCIPLE
GAFAIG separates three independent trust layers:
- Verification (cryptographic integrity)
- Approval (evaluation completion)
- Certification (trusted public state)

These layers must remain strictly distinct and must never be conflated in any system component.

---

## VERIFIED

### Definition
A record is Verified if its data integrity is cryptographically proven using a valid signature.

### Requirements
- A valid signature exists
- The messageString matches the signed payload
- Verification using the public key succeeds

### Source
- Application-layer proof system
- `/api/verify/[registryId]`

### Meaning
“This record has not been altered and was issued by GAFAIG.”

### Important Constraints
- Verified does NOT imply Approved
- Verified does NOT imply Certified
- Verification is independent of governance evaluation

---

## APPROVED

### Definition
A system is Approved if it has been evaluated through the GAFAIG verification process and has received a formal decision.

### Requirements
- Case exists in Snowflake
- Findings, evidence, and events processed
- Decision exists with valid `DECISION_STATUS`
- Typically:
  - `DECISION_STATUS = 'APPROVED'`

### Source
- `CORE.DECISIONS`
- Derived into `CORE.V_REGISTRY_PUBLIC`

### Meaning
“This system has been evaluated under the GAFAIG governance framework.”

### Important Constraints
- Approved systems are NOT automatically trusted
- Approved systems may have weaknesses or gaps
- Approved systems may or may not be certified

---

## CERTIFIED

### Definition
A system is Certified if it has:
1. Been evaluated
2. Achieved required governance thresholds
3. Been formally published to the GAFAIG registry

### Requirements
- `CERTIFIED_AT` is NOT NULL
- `CERTIFIED_TIER` exists
- `CERTIFIED_BAND` exists
- A valid decision exists
- Record published via:
  - `SP_PUBLISH_CASE_TO_REGISTRY_V3` or `V4`
- Present in:
  - `CORE.REGISTRY_SNAPSHOTS`
  - `CORE.V_REGISTRY_PUBLIC`

### Meaning
“This system is trusted and publicly certified by GAFAIG.”

### Authority
Certification authority comes from:
- GAFAIG governance framework
- Scoring system
- Decision layer

NOT from:
- signature
- API
- UI

---

## TIME-BOUND TRUST (CRITICAL)

Certification is NOT permanent.

### Controlled By
- `VALID_FROM`
- `VALID_TO`

### Interpretation
- A certification is only valid within its defined time window
- Outside this window, certification is no longer active

### Meaning
“Certified” always implies:
→ Certified AND currently within validity period

---

## LIFECYCLE STATES

Derived from:
- `CERTIFIED_AT`
- `VALID_TO`
- system time

### ACTIVE
- Certification exists
- Current time is within validity window

Meaning:
“Currently certified and valid”

---

### EXPIRING SOON
- Certification exists
- Approaching expiration window (typically last 30 days)

Meaning:
“Certification nearing expiration; renewal required”

---

### EXPIRED
- Certification exists
- Current time is past `VALID_TO`

Meaning:
“Previously certified but no longer valid”

---

### NOT CERTIFIED
- No certification exists (`CERTIFIED_AT` is NULL)

Meaning:
“Evaluated but not certified”

---

### FUTURE STATE (NOT YET ACTIVE)
REVOCATION (planned):
- Certification may be revoked prior to expiration
- Will represent active invalidation of trust

---

## RELATIONSHIP MODEL

Conceptual progression:
Verified → Approved → Certified

But technically:
- Verified is independent
- Approved is evaluation state
- Certified is trust + publication state

---

## COMBINED STATES

| Verified | Approved | Certified | Lifecycle | Meaning |
|---------|----------|----------|----------|--------|
| ❌ | ❌ | ❌ | — | No valid record |
| ✅ | ❌ | ❌ | — | Valid record, not evaluated |
| ✅ | ✅ | ❌ | — | Evaluated, not certified |
| ✅ | ✅ | ✅ | Active | Fully trusted |
| ✅ | ✅ | ✅ | Expired | Previously trusted |

---

## REGISTRY VS VERIFICATION (CRITICAL DISTINCTION)

### VERIFY SURFACE (`/verify`)
- Shows cryptographic truth
- Confirms data integrity
- Independent of certification

### REGISTRY SURFACE (`/registry`)
- Shows governance truth
- Reflects approval and certification
- Derived from Snowflake

### Key Principle
Verification ≠ Governance

---

## MINIMUM CERTIFICATION CRITERIA

A system cannot be certified unless ALL are true:

- Valid case exists
- Findings and evidence processed
- Events support lifecycle progression
- Scoring completed
- Tier and band assigned
- Decision approved
- Registry snapshot published

---

## SIGNAL SOURCES

### VERIFIED
- Source: verify API
- Field: `verified`

### APPROVED
- Source: decisions table
- Field: `DECISION_STATUS`

### CERTIFIED
- Source: registry snapshot
- Field: `CERTIFIED_AT`

### LIFECYCLE
- Derived from:
  - `VALID_TO`
  - current time

---

## UI CONTRACT

### VERIFY PAGE
Must show:
- Verified status
- Approval status
- Certification status
- Lifecycle state
- Full record details

---

### REGISTRY PAGE
Must:
- prioritize certified records
- clearly label approved-only records
- reflect lifecycle state

---

### EXPLORER
Must:
- include both approved and certified
- distinguish clearly

---

### WIDGET
Must:
- show certification only if certified
- show approved otherwise
- include verify link
- never imply certification incorrectly

---

## API CONTRACT

### VERIFY API
Must return:
- verified
- record
- proof

---

### REGISTRY API
Must:
- reflect `CORE.V_REGISTRY_PUBLIC`
- not compute certification logic

---

## PROHIBITED MISINTERPRETATIONS

The following are incorrect and must never appear:

- Verified = Certified
- Approved = Trusted
- Signature = Certification
- Certification is permanent

---

## TRUST MODEL SUMMARY

- VERIFIED = cryptographic integrity
- APPROVED = evaluated
- CERTIFIED = trusted + published + time-valid

All three layers must remain independent.

---

## ENFORCEMENT

These definitions must be enforced in:
- Snowflake views
- API responses
- UI rendering
- widget output
- external integrations

Any change requires:
- updating this file
- updating all dependent layers

---

## SUMMARY

GAFAIG trust is multi-layered and deterministic:
- Verification proves integrity
- Approval proves evaluation
- Certification proves trust and publication
- Certification is time-bound
- Lifecycle state defines current validity

This separation is fundamental and must not drift.