# VERIFICATION_SIGNATURE_CONTRACT.md
Last Updated: 2026-04-15

## PURPOSE
This document defines the canonical verification proof and signature contract for GAFAIG. It governs how verification records are constructed, how they are signed, how they are verified externally, and how trust is communicated across registry, verify, widget, and API surfaces. This contract is implemented in the application layer (Next.js) and is not currently stored in Snowflake. Snowflake provides the authoritative data. The application layer provides the cryptographic proof.

## CORE PRINCIPLE
Verification = Data (Snowflake) + Signature (Application Layer). Snowflake is the authoritative source of record data. The signature is the cryptographic guarantee of integrity. The public key is the external verification anchor.

## SIGNATURE STANDARD
Algorithm: Ed25519. Message encoding: UTF-8 string. Signature encoding: Base64. The algorithm identifier returned in the proof object is "Ed25519" or "EdDSA" depending on context, but must remain consistent across generation and verification.

## VERIFY API CONTRACT
Endpoint: GET /api/verify/[registryId]. Response shape is a discriminated union. Success response includes ok: true, registryId, verified (boolean), record (object), and proof (object). Failure response includes ok: false and error, with optional registryId and verified false.

## RECORD OBJECT (CANONICAL FIELDS)
The record object returned in the verify response must include the following fields sourced from Snowflake: registryId, applicationId, caseId, entityName, entityType, country, certificationStatus, certifiedScore (optional number or string), certifiedTier, certifiedBand, decisionStatus, validFrom, validTo, certifiedAt. These fields must match the canonical public registry projection and must not be recomputed in the API layer.

## PROOF OBJECT (CANONICAL FIELDS)
The proof object must include: alg (string), kid (string, optional but strongly recommended), signature (base64 string), signedAt (ISO timestamp string), verificationKeyUrl (string URL to public key endpoint), message (object), messageString (string). The message and messageString must represent the exact same payload, with messageString being the JSON serialized version of message.

## MESSAGE PAYLOAD (CANONICAL)
The message object must be deterministic and reproducible. It must include: registryId, entityName, certifiedTier, certifiedBand, certifiedAt, decisionStatus, validFrom, validTo. No additional hidden or transient fields may be included. The purpose is to ensure that any third party can reconstruct the exact same messageString and verify the signature.

## MESSAGE STRING
messageString = JSON.stringify(message). No additional formatting, whitespace normalization, or ordering transformations should be applied beyond standard JSON serialization. The same serialization method must be used during verification. Any change to messageString invalidates the signature.

## SIGNATURE GENERATION FLOW
1. Retrieve record data from Snowflake via the query layer. 2. Construct canonical message object using only allowed fields. 3. Serialize message into messageString using JSON.stringify. 4. Generate signature using Ed25519 private key over messageString. 5. Return proof object containing signature, kid, alg, signedAt, verificationKeyUrl, message, and messageString.

## CRYPTO IMPLEMENTATION
Location: lib/crypto/verify-signing.ts. Core functions: getSigningKeyId(), getPrivateKeyPem(), getPublicKeyPem(), signMessage(messageString), verifyMessageSignature(messageString, signature). The Node.js crypto module is used with Ed25519 keys. Private key must never be exposed. Public key may be derived from private key if not explicitly provided.

## KEY MANAGEMENT
Environment variables: GAFAIG_SIGNING_PRIVATE_KEY_PEM, GAFAIG_SIGNING_PUBLIC_KEY_PEM, GAFAIG_SIGNING_KEY_ID, GAFAIG_VERIFY_PUBLIC_KEY_PEM, GAFAIG_VERIFY_KID. The key ID (kid) identifies the signing key version. Example: gafaig-ed25519-2026-01. Key rotation must preserve the ability to verify historical signatures. The public key endpoint must always expose the active key.

## PUBLIC KEY ENDPOINT
Endpoint: GET /api/.well-known/gafaig-public-key. Response must include: ok, kty (OKP), crv (Ed25519), use (sig), alg (EdDSA), kid, publicKeyPem, publicKeyBase64. The PEM is used for verification. The base64 version is provided for convenience. This endpoint is publicly accessible and must be cacheable.

## EXTERNAL VERIFICATION PROCESS
1. Call GET /api/verify/{registryId}. 2. Extract proof.messageString, proof.signature, proof.kid, proof.verificationKeyUrl. 3. Call GET /api/.well-known/gafaig-public-key. 4. Use public key to verify signature against messageString. 5. If verification succeeds, the record is cryptographically valid and unaltered.

## TRUST STATES (SEPARATION)
Verification is separate from approval and certification. Verified means the signature is valid. Approved means the system has been evaluated. Certified means the system is trusted and published. A record can be verified but not certified. The signature does not imply certification. The signature only guarantees integrity.

## UI CONTRACT
Verify page must display: verification status (signature valid or not), certification status (approved vs certified), full record data, and link to registry page. Registry page must display certified records prominently and may display approved-only records with clear distinction. Widget must reflect certification status accurately and always include a verification link.

## API CONTRACT RULES
The verify API must not compute certification logic. It must pass through Snowflake-derived fields. It must generate signatures deterministically. It must include all required proof fields. It must not mutate or enrich the canonical message beyond defined fields.

## SECURITY PRINCIPLES
Private keys are never exposed. Public keys are always accessible. Signatures must be deterministic. Messages must be reproducible. No hidden fields may be included in signed payloads. Any change to signed data must invalidate the signature. The system must be verifiable by external parties without internal access.

## DO NOT BREAK
Do not change message field names. Do not change messageString construction. Do not change signature encoding format. Do not change key format (PEM). Do not change verify endpoint structure. Do not introduce non-deterministic fields (timestamps inside message beyond certifiedAt and valid windows).

## FUTURE EXTENSIONS (NOT ACTIVE)
Potential enhancements include storing signed payloads in Snowflake (REGISTRY_SNAPSHOTS), supporting multiple active keys with rotation metadata, anchoring signatures on-chain, and versioning verification payload schemas. These are not currently implemented and must not be assumed.

## SUMMARY
Verification in GAFAIG is the combination of authoritative Snowflake data and Ed25519 cryptographic signatures generated in the application layer. The contract is deterministic, externally verifiable, and independent of approval or certification status. This contract must remain stable across all APIs, UI surfaces, and integrations.