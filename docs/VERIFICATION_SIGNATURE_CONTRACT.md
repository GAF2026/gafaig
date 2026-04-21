# VERIFICATION_SIGNATURE_CONTRACT.md — Last Updated: 2026-04-21

## PURPOSE

This document defines the canonical verification signature contract for GAFAIG.

It governs:
- how registry records are cryptographically signed
- how verification payloads are constructed
- how external systems validate GAFAIG certifications
- how trust is distributed beyond GAFAIG

This contract is non-optional and must be strictly enforced across Snowflake, API, and UI layers.

---

## CORE PRINCIPLE

A GAFAIG certification is only valid if:

1. It originates from a canonical registry snapshot in Snowflake
2. It is returned via the verify API
3. It includes a valid cryptographic signature
4. That signature can be independently verified using the GAFAIG public key

No unsigned record is considered trusted.

---

## TRUST FLOW

Snowflake (Source of Truth)  
→ CORE.V_REGISTRY_PUBLIC  
→ API (/api/verify/[registryId])  
→ Canonical Message Construction  
→ Signature (Ed25519)  
→ External Verification (Client / Widget / Third Party)

The signature is generated at the API layer but MUST reflect Snowflake data exactly.

---

## SIGNATURE ALGORITHM

Algorithm: Ed25519

Rules:
- deterministic signature generation
- no alternate algorithms allowed
- no fallback algorithms allowed
- signature must be verifiable using standard Ed25519 libraries

---

## VERIFY ENDPOINT CONTRACT

Endpoint:

/api/verify/[registryId]

Response structure:

{
  "ok": true,
  "verified": true,
  "registryId": string,
  "record": {
    "registryId": string,
    "registrySnapshotId": string | null,
    "applicationId": string | null,
    "caseId": string | null,
    "entityName": string | null,
    "entityType": string | null,
    "country": string | null,
    "certificationStatus": string | null,
    "certifiedAt": string | null,
    "validFrom": string | null,
    "validTo": string | null,
    "lifecycleStatus": string | null,
    "renewalStatus": string | null,
    "publishedAt": string | null
  },
  "proof": {
    "alg": "Ed25519",
    "kid": string,
    "signature": string,
    "signedAt": string,
    "verificationKeyUrl": string,
    "message": object,
    "messageString": string
  }
}

Rules:
- the record object may include informational public fields for display
- the record object is not the same as the signed message
- the signed message MUST be a stricter, smaller subset
- the verify response must not expose:
  - decisionStatus
  - certifiedScore
  - certifiedTier
  - certifiedBand

These fields are intentionally excluded from the public cryptographic trust surface.

---

## PROOF OBJECT DEFINITION

The proof object is mandatory.

Fields:

alg:
- must be "Ed25519"

kid (Key ID):
- identifies which public key to use
- must match key served at /api/.well-known/gafaig-public-key

signature:
- base64-encoded Ed25519 signature
- generated from messageString

signedAt:
- ISO timestamp of signature creation
- generated at API execution time
- NOT included in message

verificationKeyUrl:
- must point to:
  /api/.well-known/gafaig-public-key

message:
- canonical JSON object used for signing
- must contain only deterministic Snowflake-derived trust fields

messageString:
- exact serialized string used to generate signature
- must match message exactly
- must not be reconstructed downstream

---

## CANONICAL MESSAGE STRUCTURE

The signed message MUST include ONLY the minimal trust fields:

{
  "registryId": string,
  "entityName": string,
  "certificationStatus": string,
  "certifiedAt": string
}

Rules:
- field order MUST be fixed
- no additional fields allowed
- no UI-derived fields allowed
- no API-derived fields allowed
- values must come directly from CORE.V_REGISTRY_PUBLIC
- null values MUST NOT appear in the signed message
- values must be normalized before signing

---

## TRUST SURFACE MINIMIZATION

The signed message is intentionally minimal.

Rationale:
- reduces attack surface
- prevents downstream interpretation drift
- ensures deterministic verification across systems
- isolates cryptographic trust from informational display fields

All additional fields are informational and MUST NOT be included in the signature, including:
- entityType
- country
- validFrom
- validTo
- lifecycleStatus
- renewalStatus
- publishedAt
- decisionStatus
- certifiedScore
- certifiedTier
- certifiedBand

---

## MESSAGE STRING REQUIREMENTS

messageString must:

- be a deterministic JSON string
- use fixed key ordering
- contain no extra whitespace
- match message exactly
- be the exact input to the signature function

Any mismatch invalidates the signature.

---

## SIGNING PROCESS

1. Query Snowflake using:
   CORE.V_REGISTRY_PUBLIC

2. Resolve the target registry record by REGISTRY_ID

3. Construct canonical message object using only:
   - registryId
   - entityName
   - certificationStatus
   - certifiedAt

4. Normalize values:
   - trim strings
   - ensure timestamps are ISO formatted
   - ensure no null values remain in the signed message

5. Serialize into deterministic JSON (messageString)

6. Generate signature using Ed25519 private key

7. Construct proof object

8. Return API response

No transformations are allowed outside this flow.

---

## RECORD VS MESSAGE

The verify response contains two related but different objects:

### record
The public display object returned by the verify endpoint.

Purpose:
- human-readable verification details
- public registry inspection
- UI rendering
- widget rendering

### message
The canonical cryptographic trust object.

Purpose:
- deterministic signing
- independent verification
- trust portability

Rule:
- record may include more fields than message
- message MUST remain minimal and fixed
- proof validity depends only on messageString, signature, and public key verification

---

## PUBLIC KEY ENDPOINT

Endpoint:

/api/.well-known/gafaig-public-key

Response:

{
  "keys": [
    {
      "kid": string,
      "kty": "OKP",
      "crv": "Ed25519",
      "x": string
    }
  ]
}

Rules:
- public key must match private key used for signing
- kid must match proof.kid
- endpoint must be public
- no authentication required

---

## VERIFICATION PROCESS (EXTERNAL)

To verify a GAFAIG certification:

1. Fetch:
   /api/verify/[registryId]

2. Extract:
   - messageString
   - signature
   - kid

3. Fetch public key from:
   verificationKeyUrl

4. Verify:
   Ed25519(signature, messageString, publicKey)

5. Result:
   TRUE → valid certification  
   FALSE → invalid certification

External verification depends on the proof object, not on GAFAIG UI rendering.

---

## NULL HANDLING RULES

Rules:
- null values are allowed in the record object
- null values may appear in informational display fields
- null values MUST NOT appear in the signed message
- if a required signed field is null, signature generation must fail

Required signed fields:
- registryId
- entityName
- certificationStatus
- certifiedAt

If any required signed field is missing or null, the certification must not be signed.

---

## NON-NEGOTIABLE RULES

- no unsigned responses for valid certified records
- no partial proof objects
- no modification of message after signing
- no signing of UI-derived or API-derived data
- no alternate signing formats
- no mutation of messageString after signature generation
- no inclusion of internal workflow fields in the signed message
- no inclusion of score, tier, or band in the signed message

---

## FAILURE MODES

Verification must fail if:

- messageString does not match message
- signature does not match public key
- incorrect key is used
- fields are reordered
- required signed fields are missing
- null values exist in the signed message
- the registry record differs from Snowflake-derived canonical data

All failures must invalidate certification.

---

## TRUST DISTRIBUTION

This contract enables:

- third-party verification
- embeddable widgets
- certification badges
- independent auditability
- portable external trust verification

Trust does not depend on GAFAIG UI.

Trust depends ONLY on:
- Snowflake canonical public data
- deterministic message construction
- signature validity
- public key verification

---

## SYSTEM RESPONSIBILITIES

Snowflake:
- store canonical registry data
- expose certified public truth through CORE.V_REGISTRY_PUBLIC

API:
- resolve registry record
- construct canonical message
- sign payload
- return proof

UI:
- display verified data
- must not alter proof
- must not invent trust fields

External Systems:
- independently verify signature
- treat messageString as the source object for signature verification

---

## ENFORCEMENT

This contract defines the cryptographic trust layer of GAFAIG.

Any deviation:
- invalidates certification
- breaks trust surface
- must be corrected immediately

---

## FINAL STATEMENT

A GAFAIG certification is valid because:

- it is derived from Snowflake canonical public data
- it is serialized deterministically
- it is signed cryptographically
- it can be independently verified

Trust is not asserted.

Trust is proven.

---

END OF FILE