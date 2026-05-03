VERIFICATION_SIGNATURE_CONTRACT.md

Last Updated: 2026-05-02

PURPOSE

This document defines the canonical verification signature contract for GAFAIG (Global Authority for AI Governance). It governs how GAFAIG public certification records are transformed into signed verification payloads, how those payloads are returned through the public verification API, and how external parties can independently validate the authenticity and integrity of a GAFAIG record.

GAFAIG is the world’s first searchable AI governance registry. GAFAIG verifies that human oversight in AI systems is implemented, operational, and producing real oversight outcomes.

This contract applies to:

Snowflake public registry views
/api/verify/[registryId]
/api/.well-known/gafaig-public-key
SDK verification calls
widgets
badge rendering
external verification consumers
public registry record verification
public key page
developers page examples
external embed integrations

Trust is established through Snowflake-originated public records and cryptographic proof, not through UI rendering.

CORE PRINCIPLE

A GAFAIG certification record is verifiable only when:

The record originates from Snowflake.
The record is exposed through the canonical public registry contract.
The verify API signs the canonical messageString.
The proof can be validated using GAFAIG’s public key endpoint.
The signed payload has not been altered.

The UI, SDK, widget, badge, and external consumers must never compute or infer certification truth independently.

GLOBAL TRUST INVARIANTS

These rules apply across ALL layers:

VERIFY API IS THE PROTOCOL CONTRACT

/api/verify is the canonical external verification interface.

MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Signature validation MUST use proof.messageString exactly.

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

Signature = authenticity.
Lifecycle = current trust state.

FAIL-CLOSED SYSTEM

ANY failure → NOT TRUSTED.

WIDGETS MUST FAIL CLOSED

Widgets MUST display invalid, unavailable, expired, or revoked states when verification or lifecycle fails.

SOURCE OF TRUTH

The source of truth for public verification records is:

CORE.V_REGISTRY_PUBLIC

This view defines the public record contract.

As of the current contract, CORE.V_REGISTRY_PUBLIC includes:

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

The API may normalize field names from Snowflake uppercase snake case to TypeScript camel case, but it must not recompute trust, lifecycle, certification status, badge eligibility, or verification eligibility.

CRITICAL:

This view defines the canonical payload foundation used to generate messageString.

Any structural change that impacts signed payload fields must be treated as a cryptographic breaking change.

CANONICAL PUBLIC RECORD MODEL

A GAFAIG public certification record represents a verifiable record of certified AI governance oversight.

A record may represent:

ORGANIZATION
AI_SYSTEM
PORTFOLIO
USE_CASE
CERTIFICATION_RECORD

The public record must not imply a broader certification claim than the record itself supports.

Certification attaches to the public record. The record is what is verified.

INTERNAL VS PUBLIC BOUNDARY

Internal/private GAFAIG data may include:

evidence
findings
reviewer notes
scoring details
score
tier
band
private decision workflow
internal approval gate details

These must not be exposed in the public verification contract unless explicitly promoted through a canonical public Snowflake view.

Public GAFAIG verification may expose:

certification outcome
lifecycle state
validity period
eligibility state
public metadata
signed proof

VERIFY ENDPOINT

Canonical endpoint:

/api/verify/[registryId]

The verify endpoint is responsible for:

accepting a registry ID
reading the matching public record from CORE.V_REGISTRY_PUBLIC
returning the public record
constructing the canonical signed message
constructing the canonical messageString deterministically
signing the canonical messageString
returning the proof object
supporting external verification consumers

The verify endpoint must:

run server-side
use runtime = "nodejs"
use dynamic = "force-dynamic"
use revalidate = 0
return Cache-Control: no-store
support CORS
use the canonical public record from Snowflake
preserve Ed25519 signing
return safe errors
never compute governance score
never compute certification status
never compute lifecycle status
never compute verification eligibility
never compute badge eligibility

CRITICAL:

messageString must be deterministic
messageString must be generated once and never reconstructed
signature MUST be generated from messageString ONLY
verification MUST use messageString ONLY
verify endpoint is the canonical protocol contract

CORS REQUIREMENTS

The verify endpoint must support external usage by SDKs, widgets, and third-party consumers.

Required CORS headers:

Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Cache-Control: no-store

The endpoint must support OPTIONS.

VERIFY RESPONSE STRUCTURE

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

CRITICAL:

Failure MUST result in NOT TRUSTED state.

RECORD OBJECT CONTRACT

The record object is the public registry record returned to consumers.

Required public record fields:

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

These values must originate from CORE.V_REGISTRY_PUBLIC.
API may normalize names but must not recompute meaning.
Dates may be converted to ISO strings for API compatibility.
Null dates may remain null.
Public record fields must remain consistent across all surfaces.
Public record fields must not include private workflow data.
Public record fields must not include raw scoring internals.

PROOF OBJECT CONTRACT

Required proof fields:

alg
kid
signature
signedAt
verificationKeyUrl
message
messageString

CRITICAL:

messageString is the ONLY valid verification input.

Rules:

Verification MUST use messageString exactly as returned.
Never reconstruct messageString from JSON fields.
Never verify using message object.
Never verify using UI-rendered data.
Never verify using parsed JSON fields.
Any modification invalidates signature.

SIGNING ALGORITHM

Algorithm:

Ed25519

Proof alg:

Ed25519

Public key alg:

EdDSA

kid:

gafaig-ed25519-2026-01

CANONICAL MESSAGE OBJECT

Fields currently used for the signed certification assertion:

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

Must remain stable.
Must remain deterministic.
Must not expand without versioning.
Must map directly to the public certification assertion.
Must not include private workflow data.
Must not include raw evidence.
Must not include internal findings.
Must not include score, tier, or band unless a future version explicitly promotes those fields into a new public contract.

MESSAGE STRING

messageString is the exact serialized payload.

CRITICAL RULES:

Deterministic ordering required.
No whitespace variation.
No field omission for signed payload inputs.
No formatting drift.
Never reconstructed.
Always use returned value.

Field order must remain stable across:

Snowflake
→ API
→ messageString
→ signature
→ external verifier

PUBLIC KEY ENDPOINT

/api/.well-known/gafaig-public-key

CRITICAL:

This is the ONLY valid verification key source.
Consumers must fetch key from this endpoint.
Do not use hardcoded keys.
Public key must match proof.kid.
Private key must never be exposed.

PUBLIC KEY PAGE

Canonical human-readable public key page:

/public-key

Purpose:

Explain the public verification key.
Explain Ed25519.
Explain how proof.messageString and proof.signature are validated.
Explain the verification loop.
Direct developers to the public key endpoint.
Reinforce that verification must use messageString exactly as returned.

EXTERNAL VERIFICATION PROCESS

Call /api/verify/[registryId].
Confirm ok === true.
Extract proof.messageString.
Extract proof.signature.
Extract proof.kid.
Fetch public key endpoint.
Match kid.
Verify signature using Ed25519.

If valid:

The record is authentic.

Then evaluate lifecycle and eligibility separately:

certificationStatus
lifecycleStatus
visibilityStatus
verificationEligible
badgeEligible
validFrom
validTo

TRUST MODEL

Trust depends on:

Snowflake-originated record
messageString
signature
public key
current lifecycle state
visibility and eligibility flags

Trust does NOT depend on:

UI
widgets
badges
SDK convenience
screenshots
manually copied JSON fields
reconstructed payloads

FAILURE RULE

If ANY of the following occur:

messageString missing
signature missing
signature invalid
key mismatch
public key unavailable
verification failure
payload reconstruction required
malformed proof
malformed public key response
unexpected signing algorithm

THEN:

DO NOT TRUST THE RECORD

CRITICAL:

System MUST fail closed.

LIFECYCLE STATUS

Values:

active
expired
revoked

Lifecycle is public trust state.

CRITICAL:

Signature proves authenticity.
Lifecycle determines current trust state.

A record may be authentic but not currently trusted.

Examples:

active + valid signature = currently trusted certified record
expired + valid signature = authentic expired record
revoked + valid signature = authentic revoked record
missing signature = not trusted
invalid signature = not trusted

BOUNDED VALIDITY MODEL

GAFAIG now uses a time-bounded certification lifecycle.

Canonical validity rule:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

VALID_FROM and VALID_TO must originate from Snowflake.

Approved decisions must have:

VALID_FROM populated
VALID_TO populated
one active non-overlapping decision window per CASE_ID

VALID_TO must not be treated as NULL for active records.

VERIFICATION ELIGIBILITY

verificationEligible

Must come from Snowflake.
Must not be computed.
Indicates whether record is eligible for public verification treatment.

BADGE ELIGIBILITY

badgeEligible

Must come from Snowflake.
Must not be computed.
Indicates whether record is eligible for badge display.

BADGES ARE NOT PROOF

Badges are visual only.

Proof = verify API.

Badge endpoint may return JSON and SVG, but neither replaces cryptographic verification.

Badge surfaces must:

respect badgeEligible
respect lifecycleStatus
link to /verify/[registryId]
fail safely when unavailable

WIDGETS ARE NOT PROOF

Widgets are rendering surfaces.

They must:

call verify API
display proof state
display lifecycle state
fail closed on error
link to /verify/[registryId]
use “Verify This Record” CTA for canonical trust navigation
independently verify the signed GAFAIG payload in the browser using the public verification key where supported
cryptographically validate against the canonical signed messageString returned by the verification endpoint

They must NOT:

compute trust
reconstruct payloads
verify from JSON fields
override API output
trust the host page
treat static badge display as verification

SDK REQUIREMENTS

SDK must:

call verify API
expose verification helpers
expose getPublicKey()
expose badge/widget/modal convenience helpers
never compute trust
never verify from JSON fields
never reconstruct payloads
never override Snowflake/API output

Current SDK public surface includes:

gafaig.init()
gafaig.scan()
gafaig.verify()
gafaig.getBadge()
gafaig.getPublicKey()
gafaig.badge()
gafaig.widget()
gafaig.openVerify()
gafaig.ensureWidget()
gafaig.ensureVerifyModal()

VERIFY API SECURITY

Sign server-side only.
Never expose private key.
Use no-store caching.
Use safe error handling.
Enable CORS for external verification consumers.
Do not leak internal workflow data.
Do not expose private scoring internals.
Do not expose raw evidence.
Do not expose reviewer notes.

DATE FORMAT CONTRACT

All dates returned by public APIs must be ISO 8601 strings or null.

Required behavior:

validFrom → ISO 8601 or null
validTo → ISO 8601 or null
certifiedAt → ISO 8601 or null
publishedAt → ISO 8601 or null
signedAt → ISO 8601

FIELD NAMING CONTRACT

Snowflake:

UPPERCASE_SNAKE_CASE

API:

camelCase

Examples:

REGISTRY_ID → registryId
REGISTRY_SNAPSHOT_ID → registrySnapshotId
CERTIFICATION_STATUS → certificationStatus
VALID_FROM → validFrom
VALID_TO → validTo
LIFECYCLE_STATUS → lifecycleStatus
VERIFICATION_ELIGIBLE → verificationEligible
BADGE_ELIGIBLE → badgeEligible

PUBLIC CONTRACT EXCLUSIONS

Never expose:

score
raw scoring internals
internal tier/band computation
raw evidence
findings
reviewer notes
private workflow data
internal approval details
private system records
private key material

Public views must not leak score dependencies into public trust surfaces.

APPROVAL VS CERTIFICATION

Approval = internal workflow state.
Certification = public trust record state.

Rules:

Approval alone does not create public trust.
Certification requires public registry publication.
Public trust surfaces must display certification, not internal approval state.
Approved-only records may exist internally but should not appear as certified public records unless published.

REGISTRY IMMUTABILITY

Registry tables are append-only.

Append-only registry tables:

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

Do NOT:

manually delete registry snapshots
manually insert registry snapshots
manually delete registry AI systems
manually insert registry AI systems
mutate registry state from seed files

Only allowed publish path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

SEED DATA RULE

GAFAIG uses one canonical seed file only:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

Do not create additional seed files.
Do not split seed logic across multiple seed files.
Do not create expansion seed files.
Do not directly mutate registry tables from seed logic.
Use seed data only for testing, public-page loading, and pipeline validation.

Seed data is not production data.

VERSIONING

Changes must:

introduce new kid if cryptographic key changes
preserve old verification where required
update docs
update SDK examples
update developers page
update public key page when verification flow changes

Breaking changes include:

changing signed message fields
changing signed field order
changing signing algorithm
changing key format
changing messageString construction
changing public verification contract
changing lifecycle semantics used by public trust surfaces
changing public key format

CURRENT ACTIVE CONTRACT

Algorithm:

Ed25519

kid:

gafaig-ed25519-2026-01

Verify endpoint:

/api/verify/[registryId]

Public key endpoint:

/api/.well-known/gafaig-public-key

Public key page:

/public-key

Snowflake view:

CORE.V_REGISTRY_PUBLIC

SDK:

public/sdk/gafaig.v1.js

Widget:

public/widget/gafaig-widget.v1.js

Primary current test record:

GAFAIG-00000001

Prior validated test record:

GAFAIG-00000001

VALIDATED PRODUCTION ENDPOINTS

https://www.gafaig.com/api/verify/GAFAIG-00000001

https://www.gafaig.com/api/badge/GAFAIG-00000001

https://www.gafaig.com/api/badge/GAFAIG-00000001?format=svg

https://www.gafaig.com/api/.well-known/gafaig-public-key

https://www.gafaig.com/widget-preview/GAFAIG-00000001

https://www.gafaig.com/public-key

https://www.gafaig.com/registry

https://www.gafaig.com/registry/GAFAIG-00000001

EXTERNAL VERIFICATION TESTS

Node verifier:

external-tests/verify-gafaig-node.js

Python verifier:

external-tests/verify-gafaig-python.py

Tamper verifier:

external-tests/verify-gafaig-tamper.js

Expected behavior:

Valid payload verifies TRUE.
Tampered payload verifies FALSE.
Verification uses proof.messageString only.

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
widget verification language aligned
widget CTA standardized to “Verify This Record”
widget browser-side payload verification operational
public key page available
developers page includes public key usage
bounded validity model active
VALID_FROM / VALID_TO populated for approved records
DAYS_TO_EXPIRY fixed in renewal view
public registry view aligned to current bounded validity model

Active system work:

Explorer query contract restoration
Explorer subpage revalidation
multi-case stress testing
edge lifecycle testing
widget fail-closed validation at scale
SDK failure handling validation at scale

DO NOT BREAK

Do not:

reconstruct messageString
verify from JSON
compute trust in UI
compute trust in SDK
compute trust in widget
expose private key
alter message shape casually
expose score internals publicly
mutate registry snapshots manually
create additional seed files
treat UI display as proof
treat badge display as proof
treat widget display as proof without signature validation

END STATE

GAFAIG verification is:

deterministic
Snowflake-originated
cryptographically signed
independently verifiable
lifecycle-aware
externally consumable
fail-closed
bounded by public validity windows

GAFAIG is not a claim.

GAFAIG is a signed, verifiable public record.

END OF FILE