# VERIFICATION_SIGNATURE_CONTRACT.md
Last Updated: 2026-04-26

## PURPOSE
This document defines the canonical verification signature contract for GAFAIG (Global Authority for AI Governance). It governs how GAFAIG public certification records are transformed into signed verification payloads, how those payloads are returned through the public verification API, and how external parties can independently validate the authenticity and integrity of a GAFAIG record.

GAFAIG is the world’s first searchable AI governance registry. GAFAIG verifies that human oversight in AI systems is real, functioning, and independently verifiable.

This contract applies to:
- Snowflake public registry views
- `/api/verify/[registryId]`
- `/api/.well-known/gafaig-public-key`
- SDK verification calls
- widgets
- badge rendering
- external verification consumers
- public registry record verification

Trust is established through Snowflake-originated public records and cryptographic proof, not through UI rendering.

---

## CORE PRINCIPLE
A GAFAIG certification record is verifiable only when:
- The record originates from Snowflake.
- The record is exposed through the canonical public registry contract.
- The verify API signs the canonical message.
- The proof can be validated using GAFAIG’s public key endpoint.
- The signed payload has not been altered.

The UI, SDK, widget, badge, and external consumers must never compute or infer certification truth independently.

---

## GLOBAL TRUST INVARIANTS (PHASE 6.4 — PROTOCOL RULES)

These rules apply across ALL layers:

1. VERIFY API IS THE PROTOCOL CONTRACT  
   `/api/verify` is the canonical external verification interface

2. MESSAGESTRING IS THE ONLY VERIFICATION INPUT  
   Signature validation MUST use `proof.messageString` exactly

3. NEVER VERIFY FROM JSON  
   Verification must NEVER use parsed JSON fields or reconstructed payloads

4. DETERMINISTIC PAYLOAD GUARANTEE  
   Field order MUST remain stable across:
   Snowflake → API → messageString → signature

5. SIGNATURE VS LIFECYCLE SEPARATION  
   Signature = authenticity  
   Lifecycle = current trust state

6. FAIL-CLOSED SYSTEM  
   ANY failure → NOT TRUSTED

7. WIDGETS MUST FAIL CLOSED  
   Widgets MUST display INVALID / UNVERIFIED when verification fails

---

## SOURCE OF TRUTH
The source of truth for public verification records is:

CORE.V_REGISTRY_PUBLIC

This view defines the public record contract.

As of Phase 6, CORE.V_REGISTRY_PUBLIC includes:
- REGISTRY_SNAPSHOT_ID
- REGISTRY_ID
- CASE_ID
- APPLICATION_ID
- RECORD_TYPE
- RECORD_NAME
- ENTITY_NAME
- ENTITY_TYPE
- COUNTRY
- CERTIFICATION_STATUS
- CERTIFIED_AT
- VALID_FROM
- VALID_TO
- PUBLISHED_AT
- RENEWAL_STATUS
- LIFECYCLE_STATUS
- VISIBILITY_STATUS
- VERIFICATION_ELIGIBLE
- BADGE_ELIGIBLE

The API may normalize field names from Snowflake uppercase snake case to TypeScript camel case, but it must not recompute trust, lifecycle, certification status, badge eligibility, or verification eligibility.

CRITICAL ADDITION:
This view defines the canonical payload foundation used to generate messageString.
Any structural change must be treated as a cryptographic breaking change.

---

## CANONICAL PUBLIC RECORD MODEL
A GAFAIG public certification record represents a verifiable record of certified AI governance oversight.

A record may represent:
- ORGANIZATION
- AI_SYSTEM
- PORTFOLIO
- USE_CASE
- CERTIFICATION_RECORD

The public record must not imply a broader certification claim than the record itself supports.

Certification attaches to the public record. The record is what is verified.

---

## INTERNAL VS PUBLIC BOUNDARY
Internal/private GAFAIG data may include:
- evidence
- findings
- reviewer notes
- scoring details
- score
- tier
- band
- private decision workflow
- internal approval gate details

These must not be exposed in the public verification contract unless explicitly promoted through a canonical public Snowflake view.

Public GAFAIG verification may expose:
- certification outcome
- lifecycle state
- validity period
- eligibility state
- public metadata
- signed proof

---

## VERIFY ENDPOINT
Canonical endpoint:

/api/verify/[registryId]

The verify endpoint is responsible for:
- accepting a registry ID
- reading the matching public record from CORE.V_REGISTRY_PUBLIC
- returning the public record
- constructing the canonical signed message
- constructing the canonical messageString (deterministic)
- signing the canonical message string
- returning the proof object
- supporting external verification consumers

The verify endpoint must:
- run server-side
- use runtime = "nodejs"
- use dynamic = "force-dynamic"
- use revalidate = 0
- return Cache-Control: no-store
- support CORS
- use the canonical public record from Snowflake
- preserve Ed25519 signing
- return safe errors
- never compute governance score
- never compute certification status
- never compute lifecycle status
- never compute verification eligibility
- never compute badge eligibility

CRITICAL (Phase 6.4 ADDITION):
- messageString must be deterministic
- messageString must be generated ONCE and never reconstructed
- signature MUST be generated from messageString ONLY
- verification MUST use messageString ONLY
- verify endpoint is the canonical protocol contract

---

## CORS REQUIREMENTS
The verify endpoint must support external usage by SDKs, widgets, and third-party consumers.

Required CORS headers:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET, OPTIONS
- Access-Control-Allow-Headers: Content-Type
- Cache-Control: no-store

The endpoint must support OPTIONS.

---

## VERIFY RESPONSE STRUCTURE
Successful response shape:

{
  "ok": true,
  "verified": true,
  "registryId": "GAFAIG-XXXXXXXX",
  "record": { ... },
  "proof": { ... }
}

Failure response shape:

{
  "ok": false,
  "verified": false,
  "registryId": "GAFAIG-XXXXXXXX",
  "error": "Registry record not found"
}

CRITICAL ADDITION:
Failure MUST result in NOT TRUSTED state.

---

## RECORD OBJECT CONTRACT
The record object is the public registry record returned to consumers.

Required Phase 6 record fields:

registryId
registrySnapshotId
applicationId
caseId
recordType
recordName
entityName
entityType
country
certificationStatus
certifiedAt
validFrom
validTo
publishedAt
renewalStatus
lifecycleStatus
visibilityStatus
verificationEligible
badgeEligible

Rules:

These values must originate from CORE.V_REGISTRY_PUBLIC.
API may normalize names but must not recompute meaning.
Dates may be converted to ISO strings for API compatibility.
Null dates may remain null.
Public record fields must remain consistent across all surfaces.

---

## PROOF OBJECT CONTRACT

Required proof fields:

alg
kid
signature
signedAt
verificationKeyUrl
message
messageString

CRITICAL (Phase 6.4 ADDITION):

messageString is the ONLY valid verification input.

Rules:

- Verification MUST use messageString exactly as returned
- Never reconstruct messageString from JSON fields
- Never verify using message object
- Never verify using UI-rendered data
- Never verify using parsed JSON fields
- Any modification invalidates signature

---

## SIGNING ALGORITHM

Ed25519  
alg: Ed25519  
public key alg: EdDSA  

kid:
gafaig-ed25519-2026-01

---

## CANONICAL MESSAGE OBJECT

Fields:

registryId
entityName
certificationStatus
certifiedAt
validFrom
validTo

Rules:

- Must remain minimal
- Must remain stable
- Must not expand without versioning
- Must map directly to certification assertion

---

## MESSAGE STRING

messageString is the exact serialized payload.

CRITICAL RULES:

- Deterministic ordering required
- No whitespace variation
- No field omission
- No formatting drift
- Never reconstructed
- Always use returned value

CRITICAL ADDITION:
Field order must remain stable across:
Snowflake → API → messageString → signature

---

## PUBLIC KEY ENDPOINT

/api/.well-known/gafaig-public-key

CRITICAL:

- This is the ONLY valid verification key source
- Consumers must fetch key from this endpoint
- Do not use hardcoded keys

---

## EXTERNAL VERIFICATION PROCESS

1. Call /api/verify/[registryId]
2. Confirm ok === true
3. Extract proof.messageString
4. Extract proof.signature
5. Extract proof.kid
6. Fetch public key endpoint
7. Match kid
8. Verify signature using Ed25519

If valid → record is authentic

---

## TRUST MODEL

Trust depends on:

- Snowflake-originated record
- messageString
- signature
- public key

Trust does NOT depend on:

- UI
- widgets
- badges
- SDK convenience

---

## FAILURE RULE

If ANY of the following occur:

- messageString missing
- signature invalid
- key mismatch
- verification failure

THEN:

DO NOT TRUST THE RECORD

CRITICAL ADDITION:
System MUST fail closed.

---

## LIFECYCLE STATUS

Values:

- active
- expired
- revoked

Lifecycle is informational.

CRITICAL:

Signature proves authenticity.
Lifecycle determines current trust state.

---

## VERIFICATION ELIGIBILITY

verificationEligible

- Must come from Snowflake
- Must not be computed

---

## BADGE ELIGIBILITY

badgeEligible

- Must come from Snowflake
- Must not be computed

---

## BADGES ARE NOT PROOF

Badges are visual only.

Proof = verify API

---

## WIDGETS ARE NOT PROOF

Widgets are rendering surfaces.

They must:
- call verify API
- display proof
- fail closed on error

They must NOT:
- compute trust

---

## SDK REQUIREMENTS

SDK must:
- call verify API
- expose verification
- never compute trust
- never verify from JSON fields

---

## VERIFY API SECURITY

- Sign server-side only
- Never expose private key
- No-store caching
- Safe error handling

---

## DATE FORMAT CONTRACT

All dates must be ISO 8601

---

## FIELD NAMING CONTRACT

Snowflake: UPPERCASE  
API: camelCase  

---

## PUBLIC CONTRACT EXCLUSIONS

Never expose:
- score
- tier
- band
- evidence
- findings
- internal data

---

## APPROVAL VS CERTIFICATION

Approval = internal  
Certification = public  

---

## VERSIONING

Changes must:
- introduce new kid
- preserve old verification
- update docs

---

## CURRENT ACTIVE CONTRACT

Algorithm:
Ed25519

kid:
gafaig-ed25519-2026-01

Verify endpoint:
/api/verify/[registryId]

Public key:
/api/.well-known/gafaig-public-key

Snowflake view:
CORE.V_REGISTRY_PUBLIC

---

## TEST RECORD

GAFAIG-00363095

---

## DO NOT BREAK

Do not:

- reconstruct messageString
- verify from JSON
- compute trust in UI
- expose private key
- alter message shape casually

---

## END STATE

GAFAIG verification is:

deterministic  
Snowflake-originated  
cryptographically signed  
independently verifiable  
lifecycle-aware  
externally consumable  

GAFAIG is not a claim.  
GAFAIG is a signed, verifiable public record.