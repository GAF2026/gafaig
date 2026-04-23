# VERIFICATION_SIGNATURE_CONTRACT.md
Last Updated: 2026-04-22

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
- the record object is for display only  
- the record object is NOT the signed payload  
- the signed message MUST be a strict subset  
- verify response must NOT expose cryptographic trust dependence on:
  - certifiedScore  
  - certifiedTier  
  - certifiedBand  
  - decisionStatus  

These are intentionally excluded from the cryptographic trust layer.

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

The following MUST NEVER be included in the signed message:

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

2. Resolve registry record by REGISTRY_ID  

3. Construct canonical message using ONLY:
   - registryId  
   - entityName  
   - certificationStatus  
   - certifiedAt  

4. Normalize values:
   - trim strings  
   - ISO timestamp formatting  
   - remove nulls  

5. Serialize into deterministic JSON (messageString)  

6. Generate Ed25519 signature using private key  

7. Construct proof object  

8. Return API response  

No transformations are allowed outside this flow.

---

## RECORD VS MESSAGE

Two distinct objects:

### record
- full public display object  
- used for UI + registry inspection  

### message
- cryptographic trust object  
- used for signature validation  

Rules:
- record MAY contain more fields  
- message MUST remain minimal  
- proof validity depends ONLY on:
  messageString + signature + public key  

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
- public key must match signing key  
- kid must match proof.kid  
- endpoint must be public  
- no authentication  

---

## VERIFICATION PROCESS (EXTERNAL)

To verify:

1. Fetch:
   /api/verify/[registryId]

2. Extract:
   - messageString  
   - signature  
   - kid  

3. Fetch public key  

4. Verify:
   Ed25519(signature, messageString, publicKey)

5. Result:
   TRUE → valid  
   FALSE → invalid  

Verification depends ONLY on proof object.

---

## NULL HANDLING RULES

- null values allowed in record  
- null values NOT allowed in message  
- if required field is null → signing MUST FAIL  

Required signed fields:
- registryId  
- entityName  
- certificationStatus  
- certifiedAt  

---

## NON-NEGOTIABLE RULES

- no unsigned certified responses  
- no partial proof objects  
- no mutation after signing  
- no signing of UI/API derived data  
- no alternate signature formats  
- no mutation of messageString  
- no inclusion of workflow or scoring data in message  

---

## FAILURE MODES

Verification MUST fail if:

- messageString ≠ message  
- signature invalid  
- wrong key used  
- field order changes  
- required fields missing  
- null exists in message  
- Snowflake data mismatch  

---

## TRUST DISTRIBUTION

This contract enables:

- third-party verification  
- embeddable widgets  
- certification badges  
- independent auditability  
- portable trust signals  

Trust does NOT depend on GAFAIG UI.

Trust depends ONLY on:
- Snowflake canonical data  
- deterministic message  
- signature validity  
- public key verification  

---

## SYSTEM RESPONSIBILITIES

Snowflake:
- store canonical registry truth  
- expose via CORE.V_REGISTRY_PUBLIC  

API:
- construct message  
- sign message  
- return proof  

UI:
- display data  
- never alter proof  
- never compute trust  

External Systems:
- verify signature  
- treat messageString as source  

---

## ENFORCEMENT

Any deviation:
- invalidates certification  
- breaks trust surface  
- must be corrected immediately  

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