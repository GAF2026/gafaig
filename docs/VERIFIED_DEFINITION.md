# VERIFIED_DEFINITION.md
Last Updated: 2026-04-26

## PURPOSE

This document defines what “Verified” means within GAFAIG (Global Authority for AI Governance). It establishes the canonical, system-wide definition of verification, how verification is determined, how it is represented in public APIs, and how it must be interpreted by UI, SDKs, widgets, badges, and external consumers.

GAFAIG is a deterministic, Snowflake-executed governance verification system. Verification is not a UI state or a heuristic—it is a cryptographically provable condition tied to a Snowflake-originated public record.

## CORE DEFINITION

A GAFAIG record is **Verified = true** if and only if ALL of the following conditions are satisfied:

1. **Record Exists**  
   A record with the given REGISTRY_ID exists in CORE.V_REGISTRY_PUBLIC.

2. **Public Record Contract**  
   The record returned is a direct projection of the canonical public view (CORE.V_REGISTRY_PUBLIC) without recomputation of trust fields in API/UI/SDK.

3. **Signed Payload Present**  
   The verify endpoint returns a proof object containing a signature over a canonical message.

4. **Signature Validity (External Check)**  
   The signature can be validated against the public key retrieved from /api/.well-known/gafaig-public-key using Ed25519.

If any of the above conditions fail, the record must be treated as **Verified = false**.

## CRITICAL (PHASE 6.4 ADDITION)

Verification MUST be performed using proof.messageString only.  
Verification MUST NOT be performed using parsed JSON fields, reconstructed payloads, or UI-rendered data.

## GLOBAL TRUST INVARIANTS (PHASE 6.4)

These rules define verification across the entire system:

- VERIFY API IS THE PROTOCOL CONTRACT  
  /api/verify is the canonical external verification interface.

- MESSAGESTRING IS THE ONLY VERIFICATION INPUT  
  Verification MUST use proof.messageString exactly.

- NEVER VERIFY FROM JSON  
  Verification must NEVER use parsed JSON fields or reconstructed payloads.

- DETERMINISTIC PAYLOAD GUARANTEE  
  Field order MUST remain stable across:  
  Snowflake → API → messageString → signature

- SIGNATURE VS LIFECYCLE SEPARATION  
  Signature = authenticity  
  Lifecycle = current trust state

- FAIL-CLOSED SYSTEM  
  ANY failure → Verified = false

- WIDGETS MUST FAIL CLOSED  
  Widgets MUST display INVALID / UNVERIFIED when verification fails.

## WHAT “VERIFIED” IS NOT

Verification is NOT:

- A visual badge  
- A UI indicator or icon  
- A successful API call alone  
- A boolean computed in frontend code  
- A function of lifecycle (active/expired/revoked)  
- A function of eligibility flags  
- A marketing claim  
- A JSON-based validation  

Verification is a cryptographic property of a Snowflake-originated public record.

## SOURCE OF TRUTH

All verification originates from:

CORE.V_REGISTRY_PUBLIC

This view defines the public contract and includes:

REGISTRY_SNAPSHOT_ID  
REGISTRY_ID  
CASE_ID  
APPLICATION_ID  
RECORD_TYPE  
RECORD_NAME  
ENTITY_NAME  
ENTITY_TYPE  
COUNTRY  
CERTIFICATION_STATUS  
CERTIFIED_AT  
VALID_FROM  
VALID_TO  
PUBLISHED_AT  
RENEWAL_STATUS  
LIFECYCLE_STATUS  
VISIBILITY_STATUS  
VERIFICATION_ELIGIBLE  
BADGE_ELIGIBLE  

No other layer may redefine these fields.

CRITICAL ADDITION:  
This view is the canonical payload foundation used to generate messageString. Any structural change must be treated as a cryptographic breaking change.

## VERIFY ENDPOINT CONTRACT

Endpoint:  
/api/verify/[registryId]

Successful response:
{
  "ok": true,
  "verified": true,
  "registryId": "GAFAIG-XXXXXXXX",
  "record": { ... },
  "proof": { ... }
}

Failure response:
{
  "ok": false,
  "verified": false,
  "registryId": "GAFAIG-XXXXXXXX",
  "error": "message"
}

Rules:

- verified must be true only when proof is present and structurally valid  
- API must not infer verification from UI or eligibility flags  
- API must not suppress records based on lifecycle  

CRITICAL ADDITION:

- Verification MUST use messageString only  
- verify endpoint is the protocol contract  
- Failure MUST result in verified = false  

## VERIFICATION VS LIFECYCLE

Verification is independent of lifecycle.

A record may be:

- verified: true AND lifecycleStatus: active  
- verified: true AND lifecycleStatus: expired  
- verified: true AND lifecycleStatus: revoked  

Meaning:

- The record is authentic (verified)  
- The state of certification may vary (lifecycle)  

CRITICAL:

Signature proves authenticity  
Lifecycle determines trust state  

## VERIFICATION VS ELIGIBILITY

Fields:

verificationEligible  
badgeEligible  

These are informational controls, not verification determinants.

Rules:

- verificationEligible does NOT determine verified  
- badgeEligible does NOT determine verified  
- A record can be verified even if eligibility flags are false  

## VERIFICATION VS CERTIFICATION

Certification:

A state of the record (CERTIFIED)  
Defined by Snowflake  

Verification:

A cryptographic validation  
Confirms authenticity of certification claim  

Relationship:

Certification is the claim  
Verification proves the claim is authentic  

## CANONICAL MESSAGE (SIGNED PAYLOAD)

Verification is tied to a signed message.

Current canonical message fields:

{
  "registryId": "GAFAIG-XXXXXXXX",
  "entityName": "Example Entity",
  "certificationStatus": "CERTIFIED",
  "certifiedAt": "ISO8601",
  "validFrom": "ISO8601 | null",
  "validTo": "ISO8601 | null"
}

Rules:

- Message must be minimal  
- Message must be deterministic  
- Message must not include score/tier/band  
- Message must not include lifecycle or eligibility flags  

## PROOF OBJECT

The proof object must include:

{
  "alg": "Ed25519",
  "kid": "gafaig-ed25519-2026-01",
  "signature": "<base64>",
  "signedAt": "<ISO8601>",
  "verificationKeyUrl": "https://www.gafaig.com/api/.well-known/gafaig-public-key",
  "message": { ... },
  "messageString": "string"
}

Verification requires:

- Valid Ed25519 signature  
- Matching kid  
- Exact messageString  

CRITICAL:

- messageString is the ONLY valid verification input  
- proof.message is informational ONLY  
- JSON fields must NEVER be used for verification  

## PUBLIC KEY VERIFICATION

Public key endpoint:  
/api/.well-known/gafaig-public-key

External verification steps:

1. Fetch verify endpoint  
2. Extract proof.messageString and proof.signature  
3. Fetch public key  
4. Validate signature using Ed25519  

If valid → Verified = true  

## UI / SDK / WIDGET RULES

UI:

- May display verified state  
- Must rely on API response  
- Must not compute verification  

SDK:

- Must call verify endpoint  
- Must not compute trust locally  
- Must not verify from JSON  

Widgets:

- Must display verification based on API  
- Must not embed static trust  
- MUST fail closed on verification failure  

Badges:

- Must not represent proof  
- Must link to verification endpoint  

## FAILURE CONDITIONS

Verification must be false if:

- Record not found  
- Proof missing  
- Signature invalid  
- Public key mismatch  
- Message tampered  
- messageString altered  

CRITICAL:

System MUST fail closed  

## DATE HANDLING

All timestamps must be ISO8601 strings:

certifiedAt  
validFrom  
validTo  
publishedAt  
signedAt  

Null values remain null.

## FIELD NAMING

Snowflake → API mapping:

REGISTRY_ID → registryId  
RECORD_TYPE → recordType  
CERTIFIED_AT → certifiedAt  
LIFECYCLE_STATUS → lifecycleStatus  

No semantic changes allowed.

## PUBLIC CONTRACT EXCLUSIONS

Verification contract must NOT expose:

score  
tier  
band  
internal decision workflow  
findings  
evidence  
reviewer notes  

## APPROVAL VS CERTIFICATION

Approval:  
Internal workflow state  

Certification:  
Public record state  

Verification:  
Cryptographic validation of certification  

Public interfaces must use certification terminology.

## RECORD-LEVEL VERIFICATION

Verification applies to a specific record.

Examples:

- Organization-level record  
- AI system record  
- Portfolio record  

Verification does NOT imply:

- Entire organization is certified  
- All systems are certified  

## NIST / FRAMEWORK ALIGNMENT

GAFAIG verifies that governance processes are functioning.

Frameworks (e.g., NIST AI RMF) define:

Govern  
Map  
Measure  
Manage  

GAFAIG verifies execution of those processes.

Verification must not be presented as NIST certification.

## VERSIONING

Verification contract versioning is controlled by:

kid (key ID)  
alg (algorithm)  

Future updates must:

- Introduce new key ID if breaking  
- Maintain backward compatibility  

## CURRENT ACTIVE VALUES

Algorithm: Ed25519  
Key ID: gafaig-ed25519-2026-01  

Verify endpoint:  
/api/verify/[registryId]  

Public key endpoint:  
/api/.well-known/gafaig-public-key  

## TEST RECORD

Example:

gafaig.verify("GAFAIG-00363095").then(console.log)

Expected:

ok: true  
verified: true  
record present  
proof present  

## DO NOT BREAK

Do not:

- compute verification outside API  
- remove proof object  
- alter messageString post-signing  
- expose private key  
- rely on UI for trust  
- remove CORS  
- change signed message without contract update  

## FINAL DEFINITION

Verified = true means:

The GAFAIG certification record:

- originates from Snowflake  
- is exposed through the public contract  
- has a canonical signed payload  
- has a valid Ed25519 signature  
- can be independently verified using GAFAIG’s public key  

If these conditions are met, the record is authentic, tamper-resistant, and independently verifiable.

GAFAIG verification is not a claim.  
It is a cryptographic fact.