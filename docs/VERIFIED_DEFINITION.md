# VERIFIED_DEFINITION.md
Last Updated: 2026-04-16

---

## PURPOSE

This document defines the canonical meaning of "Verified" within the GAFAIG system.

It establishes:
- What constitutes a verified record
- How verification is determined
- The difference between evaluation, approval, and certification
- The relationship between verification and public trust

This definition is authoritative and must be used consistently across:
- Snowflake
- API
- UI
- Documentation
- External integrations

---

## CORE PRINCIPLE

Verification is a deterministic state derived from the GAFAIG evaluation pipeline.

A record is verified only when it has passed through the full canonical workflow and meets the required conditions defined in Snowflake.

Verification is not:
- A UI label
- A heuristic
- A partial state
- A manually assigned flag

Verification is a system-defined outcome.

---

## CANONICAL PIPELINE

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEWS

Verification is only meaningful after the DECISION stage.

---

## TRUST STATES

GAFAIG defines distinct trust states:

### 1. Unverified

Definition:
- A system that has not completed evaluation

Characteristics:
- No decision
- No score
- No registry presence
- Not visible in public registry

---

### 2. Evaluated (Approved)

Definition:
- A system that has completed evaluation and received a decision

Characteristics:
- Has findings, evidence, and score
- Decision status = APPROVED
- May be visible in Explorer
- Not yet a certified public record

Important:
- Approved does NOT mean certified
- Approved is an internal governance outcome

---

### 3. Certified

Definition:
- A system whose evaluation outcome has been finalized and published as a public trust record

Characteristics:
- Decision completed
- Certification status = CERTIFIED
- Registry snapshot created
- Public record exists in V_REGISTRY_PUBLIC
- Certification metadata assigned:
  - certifiedScore
  - certifiedTier
  - certifiedBand
  - certifiedAt
  - validFrom / validTo

This is the only authoritative public trust state.

---

## VERIFIED DEFINITION

A record is considered VERIFIED if and only if:

1. It exists in CORE.REGISTRY_SNAPSHOTS
2. It is exposed through CORE.V_REGISTRY_PUBLIC
3. It has a valid registryId
4. It has a valid cryptographic signature (proof object)
5. It passes external verification using the public key

---

## VERIFIED ≠ APPROVED

This distinction is critical.

Approved:
- Internal evaluation complete
- Not yet a public trust artifact

Verified:
- Publicly published
- Cryptographically signed
- Externally verifiable

---

## VERIFIED DATA REQUIREMENTS

A verified record must include:

- registryId
- entityName
- entityType
- country
- decisionStatus
- certificationStatus
- certifiedScore
- certifiedTier
- certifiedBand
- certifiedAt
- validFrom
- validTo

These fields must originate from Snowflake.

---

## VERIFIED SIGNATURE REQUIREMENTS

A verified record must include a valid proof object:

- alg = Ed25519
- kid = key identifier
- signature = valid signature
- signedAt = timestamp
- verificationKeyUrl = public key endpoint
- message = canonical payload
- messageString = deterministic string

If any of these are missing or invalid:
→ the record is NOT verified

---

## VERIFIED ENDPOINT

/api/verify/[registryId]

This endpoint is the only authoritative verification surface.

It must:
- Return canonical data from Snowflake
- Include a valid proof object
- Be deterministic
- Be externally verifiable

---

## VERIFIED VS DISPLAYED DATA

Displayed data:
- UI-rendered
- May include formatting
- May include grouping or summaries

Verified data:
- Raw canonical payload
- Signed
- Deterministic
- Independent of UI

Only verified data is trusted.

---

## EXPLORER VS REGISTRY

Explorer:
- Shows evaluated (approved) and certified systems
- Not authoritative
- Discovery layer only

Registry:
- Shows certified records only
- Authoritative public record
- Source of verification

---

## INVALID VERIFICATION STATES

A record is NOT verified if:

- It is not in V_REGISTRY_PUBLIC
- It lacks a registryId
- It is not signed
- Signature does not validate
- Data is modified after signing
- It exists only in UI or API layer

---

## EXTERNAL VERIFICATION

External systems must:

1. Fetch record from /api/verify/[registryId]
2. Extract messageString and signature
3. Fetch public key
4. Verify signature using Ed25519

If valid:
→ record is verified

---

## SYSTEM RULES

- Verification is computed in Snowflake
- Signature is generated in API
- UI must not determine verification state
- No inferred or assumed verification

---

## DO NOT BREAK

- Verified = Certified + Signed
- No mixing Approved with Verified
- No UI-derived verification
- No unsigned trust claims
- No partial verification

---

## FINAL RULE

If a record is not both:
1. Published in the registry
2. Cryptographically signed

It is NOT verified.

---

END OF FILE