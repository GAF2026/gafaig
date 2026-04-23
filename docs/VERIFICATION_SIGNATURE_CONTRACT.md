# VERIFICATION_SIGNATURE_CONTRACT.md
Last Updated: 2026-04-23

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

1. It originates from canonical Snowflake data  
2. It is exposed via /api/verify/[registryId]  
3. It includes a valid cryptographic signature  
4. The signature can be independently verified using the GAFAIG public key  

No unsigned record is trusted.

---

## 🔒 TRUST AUTHORITY (PHASE 4 LOCK)

The ONLY source of trust is:

/api/verify/[registryId]

Rules:

- UI must not infer trust  
- Widgets must not compute trust  
- Badges must not infer trust  
- External systems must verify signatures  

Trust must never be derived from:

- /api/registry  
- UI state  
- client-side logic  

---

## TRUST FLOW

Snowflake (Source of Truth)  
→ CORE.V_REGISTRY_PUBLIC  
→ /api/verify/[registryId]  
→ Canonical Message Construction  
→ Signature (Ed25519)  
→ External Verification  

The API must reflect Snowflake data exactly.

---

## SIGNATURE ALGORITHM

Algorithm: Ed25519

Rules:

- deterministic signing only  
- no alternate algorithms  
- no fallback algorithms  
- compatible with standard Ed25519 libraries  

---

## VERIFY ENDPOINT CONTRACT

Endpoint:

/api/verify/[registryId]

Response:

{
  "ok": true,
  "verified": true,
  "registryId": string,
  "record": {
    "registryId": string,
    "applicationId": string | null,
    "caseId": string | null,
    "entityName": string | null,
    "entityType": string | null,
    "country": string | null,
    "certificationStatus": string | null,
    "certifiedAt": string | null,
    "validFrom": string | null,
    "validTo": string | null
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

- record = display only  
- proof = trust layer  
- message = signed payload  
- messageString = canonical input  

The following MUST NOT appear anywhere in the verify response:

- decisionStatus  
- score  
- tier  
- band  

These are private and excluded from trust.

---

## PROOF OBJECT (LOCKED)

Fields:

alg:
- must be "Ed25519"

kid:
- must match public key

signature:
- base64 encoded Ed25519 signature

signedAt:
- ISO timestamp
- NOT part of message

verificationKeyUrl:
- must point to:
  /api/.well-known/gafaig-public-key

message:
- canonical JSON object used for signing

messageString:
- exact serialized string used to generate signature

---

## CANONICAL MESSAGE STRUCTURE (PHASE 4 LOCK)

The signed message MUST include ONLY:

{
  "registryId": string,
  "entityName": string,
  "certificationStatus": string,
  "certifiedAt": string
}

Rules:

- fixed field order  
- no additional fields  
- no UI/API derived values  
- no null values  
- values must come from CORE.V_REGISTRY_PUBLIC  

---

## 🚫 FORBIDDEN MESSAGE FIELDS

The following MUST NEVER be included in message:

- entityType  
- country  
- validFrom  
- validTo  
- lifecycleStatus  
- renewalStatus  
- publishedAt  
- decisionStatus  
- score  
- tier  
- band  

This separation is intentional and permanent.

---

## MESSAGE STRING REQUIREMENTS

messageString must:

- be deterministic JSON  
- use fixed key order  
- contain no extra whitespace  
- match message exactly  
- be used directly for signature  

Any mismatch invalidates verification.

---

## SIGNING PROCESS (LOCKED)

1. Query CORE.V_REGISTRY_PUBLIC  
2. Resolve by REGISTRY_ID  
3. Construct message with ONLY:
   - registryId  
   - entityName  
   - certificationStatus  
   - certifiedAt  
4. Normalize values:
   - trim  
   - ISO format  
   - remove nulls  
5. Serialize deterministically  
6. Sign with Ed25519  
7. Construct proof  
8. Return response  

No deviations allowed.

---

## RECORD VS MESSAGE

record:
- display object  
- may contain more fields  

message:
- cryptographic object  
- minimal and fixed  

Trust depends ONLY on:

- messageString  
- signature  
- public key  

---

## PUBLIC KEY ENDPOINT

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

- must match signing key  
- must be public  
- no auth  

---

## VERIFICATION PROCESS (EXTERNAL)

Steps:

1. Fetch /api/verify/[registryId]  
2. Extract:
   - messageString  
   - signature  
   - kid  
3. Fetch public key  
4. Verify signature  
5. TRUE = valid  
6. FALSE = invalid  

No GAFAIG UI required.

---

## NULL HANDLING

- null allowed in record  
- null NOT allowed in message  

Required message fields:

- registryId  
- entityName  
- certificationStatus  
- certifiedAt  

If null → signing must fail  

---

## FAILURE MODES

Verification fails if:

- message mismatch  
- invalid signature  
- wrong key  
- field order changes  
- missing fields  
- null in message  
- data drift from Snowflake  

---

## TRUST DISTRIBUTION

This enables:

- external verification  
- widgets  
- badges  
- independent audit  
- portable trust  

Trust does NOT depend on GAFAIG UI.

---

## SYSTEM RESPONSIBILITIES

Snowflake:
- canonical data  

API:
- construct + sign  

UI:
- display only  

Widgets:
- consume verify  

External:
- verify signature  

---

## ENFORCEMENT

Any deviation:

- breaks trust  
- invalidates certification  
- must be fixed immediately  

---

## FINAL STATEMENT

A GAFAIG certification is valid because:

- it originates from Snowflake  
- it is deterministically constructed  
- it is cryptographically signed  
- it is independently verifiable  

Trust is not asserted.  

Trust is proven.

---

END OF FILE