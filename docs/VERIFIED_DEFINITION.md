VERIFIED_DEFINITION.md

Last Updated: 2026-04-30

PURPOSE

This document defines what “Verified” means within GAFAIG (Global Authority for AI Governance). It establishes the canonical, system-wide definition of verification, how verification is determined, how it is represented in public APIs, and how it must be interpreted by UI, SDKs, widgets, badges, and external consumers.

GAFAIG is a deterministic, Snowflake-executed governance verification system. Verification is not a UI state or a heuristic—it is a cryptographically provable condition tied to a Snowflake-originated public record.

CORE DEFINITION

A GAFAIG record is Verified = true if and only if ALL of the following conditions are satisfied:

Record Exists
A record with the given REGISTRY_ID exists in CORE.V_REGISTRY_PUBLIC.
Public Record Contract
The record returned is a direct projection of the canonical public view (CORE.V_REGISTRY_PUBLIC) without recomputation of trust fields in API/UI/SDK.
Signed Payload Present
The verify endpoint returns a proof object containing a signature over a canonical messageString.
Canonical messageString Present
The proof object contains proof.messageString exactly as signed by GAFAIG.
Signature Validity (External Check)
The signature can be validated against the public key retrieved from /api/.well-known/gafaig-public-key using Ed25519.

If any of the above conditions fail, the record must be treated as Verified = false.

CRITICAL VERIFICATION RULE

Verification MUST be performed using proof.messageString only.
Verification MUST NOT be performed using parsed JSON fields, reconstructed payloads, proof.message, or UI-rendered data.

GLOBAL TRUST INVARIANTS

These rules define verification across the entire system:

VERIFY API IS THE PROTOCOL CONTRACT
/api/verify is the canonical external verification interface.
MESSAGESTRING IS THE ONLY VERIFICATION INPUT
Verification MUST use proof.messageString exactly.
NEVER VERIFY FROM JSON
Verification must NEVER use parsed JSON fields or reconstructed payloads.
DETERMINISTIC PAYLOAD GUARANTEE
Field order MUST remain stable across:
Snowflake → API → messageString → signature
SIGNATURE VS LIFECYCLE SEPARATION
Signature = authenticity
Lifecycle = current trust state
FAIL-CLOSED SYSTEM
ANY failure → Verified = false
WIDGETS MUST FAIL CLOSED
Widgets MUST display invalid, unavailable, expired, or revoked states when verification or lifecycle fails.
WHAT “VERIFIED” IS NOT

Verification is NOT:

A visual badge
A UI indicator or icon
A successful API call alone
A boolean computed in frontend code
A function of lifecycle alone
A function of eligibility flags alone
A marketing claim
A JSON-based validation
A static widget display
A screenshot
A manually copied record

Verification is a cryptographic property of a Snowflake-originated public record.

SOURCE OF TRUTH

All verification originates from:

CORE.V_REGISTRY_PUBLIC

This view defines the public contract and includes:

REGISTRY_SNAPSHOT_ID
REGISTRY_ID
CASE_ID
APPLICATION_ID
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
This view is the canonical payload foundation used to generate messageString. Any structural change that impacts signed payload fields must be treated as a cryptographic breaking change.

VERIFY ENDPOINT CONTRACT

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

verified must be true only when proof is present and structurally valid
API must not infer verification from UI or eligibility flags
API must not suppress records based on lifecycle
API must return messageString when proof is available
API must fail safely when a record or proof cannot be produced

CRITICAL ADDITION:

Verification MUST use messageString only
verify endpoint is the protocol contract
Failure MUST result in verified = false
VERIFICATION VS LIFECYCLE

Verification is independent of lifecycle.

A record may be:

verified: true AND lifecycleStatus: active
verified: true AND lifecycleStatus: expired
verified: true AND lifecycleStatus: revoked

Meaning:

The record is authentic (verified)
The state of certification may vary (lifecycle)

CRITICAL:

Signature proves authenticity.
Lifecycle determines current trust state.

A record can be authentic and still not currently trusted.

Examples:

active + valid signature = currently trusted certified record
expired + valid signature = authentic expired record
revoked + valid signature = authentic revoked record
missing signature = not verified
signature mismatch = not verified
VERIFICATION VS ELIGIBILITY

Fields:

verificationEligible
badgeEligible

These are public controls, not cryptographic determinants.

Rules:

verificationEligible does NOT determine whether the signature is valid
badgeEligible does NOT determine whether the signature is valid
A record can be cryptographically authentic even if eligibility flags are false
Eligibility determines display/availability behavior, not signature authenticity
VERIFICATION VS CERTIFICATION

Certification:

A state of the record (CERTIFIED)
Defined by Snowflake

Verification:

A cryptographic validation
Confirms authenticity of the public certification claim

Relationship:

Certification is the claim.
Verification proves the claim is authentic.

CANONICAL MESSAGE (SIGNED PAYLOAD)

Verification is tied to a signed messageString.

Current canonical signed payload fields:

registryId
registrySnapshotId
applicationId
caseId
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

Message must be deterministic
Message must not include score/tier/band
Message must not include raw evidence
Message must not include findings
Message must not include reviewer notes
Message must not include private workflow data
Message must not expand without versioning
PROOF OBJECT

The proof object must include:

{
"alg": "Ed25519",
"kid": "gafaig-ed25519-2026-01",
"signature": "<base64>",
"signedAt": "<ISO8601>",
"verificationKeyUrl": "https://www.gafaig.com/api/.well-known/gafaig-public-key
",
"message": { ... },
"messageString": "string"
}

Verification requires:

Valid Ed25519 signature
Matching kid
Exact messageString

CRITICAL:

messageString is the ONLY valid verification input
proof.message is informational ONLY
JSON fields must NEVER be used for verification
reconstructed payloads must NEVER be used for verification
PUBLIC KEY VERIFICATION

Public key endpoint:
/api/.well-known/gafaig-public-key

Public key page:
/public-key

External verification steps:

Fetch verify endpoint
Extract proof.messageString and proof.signature
Fetch public key
Confirm proof.kid matches public key kid
Validate signature using Ed25519

If valid → Verified = true

UI / SDK / WIDGET RULES

UI:

May display verified state
Must rely on API response
Must not compute verification
Must not reconstruct messageString
Must not verify from JSON fields

SDK:

Must call verify endpoint
Must expose getPublicKey()
Must not compute trust locally
Must not verify from JSON
Must not reconstruct payloads

Widgets:

Must display verification based on API
Must not embed static trust
MUST fail closed on verification failure
Must link to /verify/[registryId]
Must use “Verify This Record” as the canonical CTA for public trust navigation

Badges:

Must not represent proof
Must link to verification endpoint
Must respect lifecycleStatus and badgeEligible
FAILURE CONDITIONS

Verification must be false if:

Record not found
Proof missing
messageString missing
Signature missing
Signature invalid
Public key unavailable
Public key mismatch
Message tampered
messageString altered
Payload must be reconstructed to verify

CRITICAL:

System MUST fail closed.

DATE HANDLING

All timestamps must be ISO 8601 strings:

certifiedAt
validFrom
validTo
publishedAt
signedAt

Null values remain null.

FIELD NAMING

Snowflake → API mapping:

REGISTRY_ID → registryId
REGISTRY_SNAPSHOT_ID → registrySnapshotId
APPLICATION_ID → applicationId
CASE_ID → caseId
ENTITY_NAME → entityName
ENTITY_TYPE → entityType
CERTIFICATION_STATUS → certificationStatus
CERTIFIED_AT → certifiedAt
VALID_FROM → validFrom
VALID_TO → validTo
PUBLISHED_AT → publishedAt
RENEWAL_STATUS → renewalStatus
LIFECYCLE_STATUS → lifecycleStatus
VISIBILITY_STATUS → visibilityStatus
VERIFICATION_ELIGIBLE → verificationEligible
BADGE_ELIGIBLE → badgeEligible

No semantic changes allowed.

PUBLIC CONTRACT EXCLUSIONS

Verification contract must NOT expose:

score
tier
band
internal decision workflow
findings
evidence
reviewer notes
private workflow data
private key material

APPROVAL VS CERTIFICATION

Approval:
Internal workflow state

Certification:
Public record state

Verification:
Cryptographic validation of certification

Public interfaces must use certification terminology.

Approval alone does not create public trust.
Certification requires publication to the public registry layer.

RECORD-LEVEL VERIFICATION

Verification applies to a specific record.

Examples:

Organization-level record
AI system record
Portfolio record
Certification record

Verification does NOT imply:

Entire organization is certified
All systems are certified
All future systems are certified
Internal evidence is public

The public record defines the scope of verification.

NIST / FRAMEWORK ALIGNMENT

GAFAIG verifies that governance processes are functioning.

Frameworks such as NIST AI RMF define governance practices including:

Govern
Map
Measure
Manage

GAFAIG verifies execution of governance processes.
Verification must not be presented as NIST certification.

REGISTRY IMMUTABILITY

Registry tables are append-only.

Append-only registry tables:

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

Do not manually:

insert into registry snapshots
delete from registry snapshots
update registry snapshots
insert into registry AI systems
delete from registry AI systems
update registry AI systems

Only allowed publish path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

SEED DATA RULE

GAFAIG uses one canonical seed file only:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

Do not create additional seed files
Do not split seed logic across multiple seed files
Do not create expansion seed files
Do not directly mutate registry tables from seed logic
Use seed data only for testing, public-page loading, and pipeline validation

Seed data is not production data.

VERSIONING

Verification contract versioning is controlled by:

kid (key ID)
alg (algorithm)

Future updates must:

Introduce new key ID if breaking
Maintain backward compatibility where required
Update verification contract
Update public key page
Update developers page
Update SDK examples
Update widget behavior if proof semantics change

Breaking changes include:

changing signed message fields
changing signed field order
changing signing algorithm
changing key format
changing messageString construction
changing public verification contract
CURRENT ACTIVE VALUES

Algorithm: Ed25519
Key ID: gafaig-ed25519-2026-01

Verify endpoint:
/api/verify/[registryId]

Public key endpoint:
/api/.well-known/gafaig-public-key

Public key page:
/public-key

SDK:
public/sdk/gafaig.v1.js

Widget:
public/widget/gafaig-widget.v1.js

TEST RECORD

Example:

gafaig.verify("GAFAIG-00363095").then(console.log)

Expected:

ok: true
verified: true
record present
proof present
messageString present
signature present
verificationKeyUrl present

Production validation endpoints:

https://www.gafaig.com/api/verify/GAFAIG-00363095

https://www.gafaig.com/api/badge/GAFAIG-00363095

https://www.gafaig.com/api/.well-known/gafaig-public-key

https://www.gafaig.com/widget-preview/GAFAIG-00363095

https://www.gafaig.com/public-key

DO NOT BREAK

Do not:

compute verification outside API
remove proof object
alter messageString post-signing
reconstruct messageString
verify from JSON
expose private key
rely on UI for trust
remove CORS
change signed message without contract update
expose score internals publicly
create additional seed files
mutate registry tables manually
FINAL DEFINITION

Verified = true means:

The GAFAIG certification record:

originates from Snowflake
is exposed through the public contract
has a canonical signed payload
has a valid Ed25519 signature
can be independently verified using GAFAIG’s public key

If these conditions are met, the record is authentic, tamper-resistant, and independently verifiable.

GAFAIG verification is not a claim.
It is a cryptographic fact.