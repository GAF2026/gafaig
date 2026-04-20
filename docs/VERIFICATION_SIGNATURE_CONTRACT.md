# VERIFICATION_SIGNATURE_CONTRACT.md — Last Updated: 2026-04-19

## PURPOSE

This document defines the canonical verification signature contract for GAFAIG.

It governs:
- How registry records are cryptographically signed
- How verification payloads are constructed
- How external systems validate GAFAIG certifications
- How trust is distributed beyond GAFAIG

This contract is non-optional and must be strictly enforced across Snowflake, API, and UI layers.

---

## CORE PRINCIPLE

A GAFAIG certification is only valid if:

1. It originates from a canonical registry snapshot in Snowflake
2. It is returned via the verify API
3. It includes a valid cryptographic signature
4. That signature can be verified using the GAFAIG public key

No unsigned record is considered trusted.

---

## TRUST FLOW

Snowflake (Source of Truth)
→ V_REGISTRY_PUBLIC
→ API (/api/verify/[registryId])
→ Signed Payload
→ External Verification (Client / Widget / Third Party)

The signature is generated at the API layer but must reflect Snowflake data exactly.

---

## SIGNATURE ALGORITHM

Algorithm: Ed25519

Rules:
- Deterministic signature generation
- No alternate algorithms allowed
- No fallback algorithms allowed
- Signature must be verifiable using standard Ed25519 libraries

---

## VERIFY ENDPOINT CONTRACT

Endpoint:

/api/verify/[registryId]

Response structure:

{
  "registryId": string,
  "entityName": string,
  "entityType": string,
  "country": string,
  "verificationType": string,
  "certificationStatus": string,
  "certifiedTier": string,
  "certifiedBand": string,
  "certifiedScore": number,
  "certifiedAt": string,
  "validFrom": string,
  "validTo": string,
  "lifecycleStatus": string,
  "renewalStatus": string,
  "decisionStatus": string,
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

---

## PROOF OBJECT DEFINITION

The proof object is mandatory.

Fields:

alg:
- Must be "Ed25519"

kid (Key ID):
- Identifies which public key to use
- Must match key served at /.well-known/gafaig-public-key

signature:
- Base64-encoded Ed25519 signature
- Generated from messageString

signedAt:
- ISO timestamp of signature creation
- Must be generated at API execution time

verificationKeyUrl:
- Must point to:
  /api/.well-known/gafaig-public-key

message:
- Canonical JSON object used for signing
- Must contain only deterministic fields

messageString:
- Exact serialized string used to generate signature
- Must match message exactly (no reordering)

---

## CANONICAL MESSAGE STRUCTURE

The message object must include only canonical, deterministic fields:

{
  "registryId": string,
  "entityName": string,
  "entityType": string,
  "country": string,
  "verificationType": string,
  "certificationStatus": string,
  "certifiedTier": string,
  "certifiedBand": string,
  "certifiedScore": number,
  "certifiedAt": string,
  "validFrom": string,
  "validTo": string,
  "decisionStatus": string
}

Rules:
- Field order must be consistent
- No optional or dynamic fields allowed
- No null values allowed (must be normalized before signing)
- No UI-derived fields allowed

---

## MESSAGE STRING REQUIREMENTS

messageString must:

- Be a deterministic JSON string
- Use stable key ordering
- Not include whitespace differences
- Match the message object exactly
- Be the exact input to the signature function

Any mismatch invalidates the signature.

---

## SIGNING PROCESS

1. Fetch registry record from Snowflake (V_REGISTRY_PUBLIC)
2. Construct canonical message object
3. Serialize message into messageString (deterministic JSON)
4. Generate signature using Ed25519 private key
5. Construct proof object
6. Return full response via API

No transformations allowed between steps.

---

## PUBLIC KEY ENDPOINT

Endpoint:

/api/.well-known/gafaig-public-key

Response:

{
  "kid": string,
  "alg": "Ed25519",
  "publicKey": string
}

Rules:
- publicKey must match private key used for signing
- kid must match proof.kid
- Endpoint must be publicly accessible
- No authentication required

---

## VERIFICATION PROCESS (EXTERNAL)

To verify a GAFAIG certification:

1. Fetch record from /api/verify/[registryId]
2. Extract:
   - messageString
   - signature
   - kid
3. Fetch public key from verificationKeyUrl
4. Verify signature using Ed25519
5. Confirm:
   signature(messageString) == valid

If valid → certification is trusted  
If invalid → certification is invalid

---

## NON-NEGOTIABLE RULES

- No unsigned responses
- No partial proof objects
- No modification of message after signing
- No signing of UI or API derived data
- No alternate signing formats
- No mutation of registry data post-signature

---

## FAILURE MODES

Invalid signature if:
- messageString does not match message
- signature does not match public key
- incorrect key is used
- message fields are reordered or altered
- null or undefined values exist in message

System must treat all failures as invalid certification.

---

## TRUST DISTRIBUTION

The verification contract enables:

- Third-party validation
- Embedded widgets
- Public trust badges
- External auditability

Trust does not depend on GAFAIG UI.  
Trust depends only on:
- Snowflake data
- Signature validity
- Public key verification

---

## SYSTEM RESPONSIBILITIES

Snowflake:
- Store canonical registry data

API:
- Construct message
- Sign payload
- Return proof

UI:
- Display verified data
- Must not alter proof

External Systems:
- Independently verify signature

---

## ENFORCEMENT

This contract defines the cryptographic trust layer of GAFAIG.

Any deviation:
- invalidates certification
- breaks trust surface
- must be corrected immediately

This is a critical system contract.

---

END OF FILE