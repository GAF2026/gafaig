# VERIFIED_DEFINITION.md

Last Updated: 2026-05-04

PURPOSE

This document defines what “Verified” means within GAFAIG (Global Authority for AI Governance). It establishes the canonical, system-wide definition of verification, how verification is determined, how it is represented in public APIs, and how it must be interpreted by UI, SDKs, widgets, badges, and external consumers.

GAFAIG is a deterministic, Snowflake-executed governance verification system. Verification is not a UI state or a heuristic—it is a cryptographically provable condition tied to a Snowflake-originated public record.

CORE DEFINITION

A GAFAIG record is Verified = true if and only if ALL of the following conditions are satisfied:

Record Exists

A record with the given REGISTRY_ID exists in CORE.V_REGISTRY_PUBLIC.

Public Record Contract

The record returned is a direct projection of the canonical public view (CORE.V_REGISTRY_PUBLIC) without recomputation of trust fields in API, UI, SDK, or widget layers.

Signed Payload Present

The verify endpoint returns a proof object containing a signature over a canonical messageString.

Canonical messageString Present

The proof object contains proof.messageString exactly as signed by GAFAIG.

Signature Validity (External Check)

The signature can be validated against the public key retrieved from /api/.well-known/gafaig-public-key using Ed25519.

If any of the above conditions fail, the record must be treated as Verified = false.

CRITICAL VERIFICATION RULE

Verification MUST be performed using proof.messageString only.

Verification MUST NOT be performed using:

parsed JSON fields
reconstructed payloads
proof.message
UI-rendered data
SDK convenience outputs
widget-rendered data
badge-rendered data

GLOBAL TRUST INVARIANTS

VERIFY API IS THE PROTOCOL CONTRACT

/api/verify is the canonical external verification interface.

MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Verification MUST use proof.messageString exactly.

NEVER VERIFY FROM JSON

Verification must NEVER use parsed JSON fields or reconstructed payloads.

DETERMINISTIC PAYLOAD GUARANTEE

Field order MUST remain stable across:

Snowflake
→ API
→ messageString
→ signature
→ external verifier

SIGNATURE VS LIFECYCLE SEPARATION

Signature = authenticity
Lifecycle = current trust state

FAIL-CLOSED SYSTEM

ANY failure → Verified = false

WIDGETS MUST FAIL CLOSED

Widgets MUST display invalid, unavailable, expired, or revoked states when verification or lifecycle fails.

WHAT “VERIFIED” IS NOT

Verification is NOT:

a visual badge
a UI indicator or icon
a successful API call alone
a boolean computed in frontend code
a function of lifecycle alone
a function of eligibility flags alone
a marketing claim
a JSON-based validation
a static widget display
a screenshot
a manually copied record
a claim that an entire organization is certified
a claim that all future systems are certified
a replacement for the public proof record

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

CRITICAL:

This view is the canonical payload foundation used to generate messageString. Any structural change that impacts signed payload fields must be treated as a cryptographic breaking change.

PUBLIC UI EXPOSURE NOTE

Although CORE.V_REGISTRY_PUBLIC may include CASE_ID and APPLICATION_ID for internal public-contract continuity and signed payload stability, public-facing UI pages must not display Application ID or Case ID.

These IDs may remain in API payloads only if required by the signed message contract and must not be treated as user-facing trust copy.

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

CRITICAL:

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

BOUNDED VALIDITY MODEL

GAFAIG uses a time-bounded certification lifecycle.

Canonical validity rule:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

VALID_FROM and VALID_TO must originate from Snowflake.

Approved decisions must have:

VALID_FROM populated
VALID_TO populated
one active non-overlapping decision window per CASE_ID

VERIFICATION VS ELIGIBILITY

Fields:

verificationEligible
badgeEligible

Rules:

verificationEligible does NOT determine whether the signature is valid
badgeEligible does NOT determine whether the signature is valid
A record can be cryptographically authentic even if eligibility flags are false
Eligibility determines display behavior, not authenticity

VERIFICATION VS CERTIFICATION

Certification:

A state of the record (CERTIFIED)
Defined by Snowflake
Represents the finalized public trust outcome

Verification:

A cryptographic validation
Confirms authenticity of the public certification claim

Relationship:

Certification is the claim.
Verification proves the claim is authentic.

Approval is internal.
Certification is public.
Verification is proof.

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
Message must not include score, tier, or band
Message must not include raw evidence
Message must not include findings
Message must not include reviewer notes
Message must not include private workflow data
Message must not expand without versioning
If applicationId or caseId remain in the signed message, they are machine-contract fields and must not be shown as public UI labels

PROOF OBJECT

The proof object must include:

alg
kid
signature
signedAt
verificationKeyUrl
message
messageString

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
Must not expose Application ID or Case ID as public-facing trust labels

SDK:

Must call verify endpoint
Must expose getPublicKey()
Must not compute trust locally
Must not verify from JSON
Must not reconstruct payloads
Must fail closed

Widgets:

Must display verification based on API
Must not embed static trust
Must fail closed on verification failure
Must link to /verify/[registryId]
Must use “Verify This Record” CTA
Must use proof.messageString for cryptographic validation where browser verification is supported

Badges:

Must not represent proof
Must link to verification endpoint
Must respect lifecycleStatus and badgeEligible
Must fail safely when unavailable

PUBLIC TERMINOLOGY ALIGNMENT

GAFAIG public surfaces should use:

Public Certification Registry
Public Certification Record
Public Proof Record
Verify This Record
Open Certification Record
Open Full Proof Page
Proof JSON
Proof API
Widget Preview
Public Certification + Cryptographic Proof

Avoid or replace:

Raw Verification JSON → Proof JSON
Registry Record → Certification Record
Open JSON → View Proof JSON
Application ID → not displayed publicly
Case ID → not displayed publicly

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
Unexpected signing algorithm
Malformed proof
Malformed key response

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

Public UI pages must NOT expose:

Application ID
Case ID
Private workflow state
Internal scoring state

APPROVAL VS CERTIFICATION

Approval: internal workflow state
Certification: public record state
Verification: cryptographic validation

Approval alone does not create public trust.
Certification requires publication to the public registry layer.
Verification proves that the public certification record is authentic.

RECORD-LEVEL VERIFICATION

Verification applies to a specific record.

Verification does NOT imply:

entire organization is certified
all systems are certified
all future systems are certified
internal evidence is public
private scoring has been disclosed
reviewer notes have been disclosed

The public record defines the scope of verification.

REGISTRY IMMUTABILITY

Registry tables are append-only.

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

Do not manually:

insert
delete
update

Only allowed publish path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

SEED DATA RULE

GAFAIG uses one canonical seed file only:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

Do not create additional seed files
Do not split seed logic
Do not mutate registry tables from seed logic

VERSIONING

Controlled by:

kid
algorithm

Breaking changes include:

changing signed fields
changing field order
changing algorithm
changing messageString construction
changing public contract
changing lifecycle semantics
changing public key format

CURRENT ACTIVE VALUES

Algorithm: Ed25519
Key ID: gafaig-ed25519-2026-01

Verify endpoint:

/api/verify/[registryId]

Public key endpoint:

/api/.well-known/gafaig-public-key

SDK:

public/sdk/gafaig.v1.js

Widget:

public/widget/gafaig-widget.v1.js

TEST RECORD

Example:

gafaig.verify("GAFAIG-00000001").then(console.log)

Expected:

ok: true
verified: true
record present
proof present
messageString present
signature present

CURRENT SYSTEM STATE

Working:

Verification API locked to deterministic signed payload
messageString present
signature present
verificationKeyUrl present
public key endpoint operational
Ed25519 signing validated
external Node verification passes
external Python verification passes
tamper test passes
registry detail route working
registry list route hardened
registry terminology aligned
proof page terminology aligned
verify tool terminology aligned
homepage messaging aligned
developers page updated with Fast Install
widget verification language aligned
widget CTA standardized to “Verify This Record”
widget browser-side payload verification operational
public key page available
developers page includes public key usage
bounded validity model active
VALID_FROM / VALID_TO populated for approved records
DAYS_TO_EXPIRY fixed in renewal view
public registry view aligned to current bounded validity model
public pages no longer expose Application ID or Case ID in user-facing pages

Active system work:

Snowflake validation is next
12_TABLES_PARTICIPANTS.sql requires final compile validation
15_TABLES_EVENTS.sql requires final compile validation
CORE.V_REGISTRY_PUBLIC requires deep contract validation
CORE.V_REGISTRY_LATEST_APPROVED requires validation
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC requires validation
Explorer query contract requires revalidation after Snowflake public contract validation
Explorer subpage revalidation
multi-case stress testing
edge lifecycle testing
widget fail-closed validation at scale
SDK failure handling validation at scale

DO NOT BREAK

Do not:

compute verification outside API
remove proof object
alter messageString post-signing
reconstruct messageString
verify from JSON
expose private key
rely on UI for trust
change signed message without contract update
expose score internally
mutate registry tables manually
create additional seed files
show Application ID publicly
show Case ID publicly
rename Proof JSON back to Raw Verification JSON
rename Certification Record back to Registry Record

FINAL DEFINITION

Verified = true means:

The GAFAIG certification record:

originates from Snowflake
is exposed through the public contract
has a canonical signed payload
has a valid Ed25519 signature
can be independently verified using GAFAIG’s public key

If these conditions are met, the record is authentic, tamper-resistant, and independently verifiable.

Lifecycle must still be evaluated separately to determine whether the authentic record is currently active, expired, or revoked.

GAFAIG verification is not a claim.
It is a cryptographic fact.

END OF FILE