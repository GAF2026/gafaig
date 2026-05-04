# VERSIONING.md

Last Updated: 2026-05-04

PURPOSE

This document defines the canonical versioning strategy for GAFAIG (Global Authority for AI Governance).

It governs how changes are introduced, tracked, and communicated across Snowflake, API, SDK, public contracts, cryptographic signatures, public verification, widgets, badges, documentation, and UI surfaces.

GAFAIG is a deterministic, Snowflake-executed governance verification system.

Versioning must preserve:

determinism
backward compatibility where possible
verifiability
public trust stability
cryptographic continuity
external consumer reliability

Versioning is not cosmetic. It is part of the trust infrastructure.

CORE PRINCIPLES

Snowflake is the source of truth
Public contracts must remain stable or explicitly versioned
Breaking changes must be versioned, not silently introduced
Cryptographic verification must remain backward verifiable
UI/SDK/widget must never redefine contract behavior
Versioning must be explicit, traceable, and auditable
Public trust language must remain consistent across all surfaces

CRITICAL ENFORCEMENT

Versioning must preserve verification protocol integrity
messageString must remain deterministic across versions
Verification must never rely on JSON field reconstruction
Verification must always use proof.messageString exactly
All changes must maintain fail-closed verification behavior
All public changes must preserve the certification/proof distinction

GLOBAL TRUST INVARIANTS (VERSIONING ENFORCEMENT)

These invariants MUST be preserved across ALL versions:

VERIFY API IS THE PROTOCOL CONTRACT

/api/verify must remain the canonical verification interface.

MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Verification MUST use proof.messageString exactly.

NEVER VERIFY FROM JSON

JSON-based verification is prohibited across all versions.

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

ANY failure → NOT TRUSTED

PUBLIC UI SEPARATION

Certification Record = public trust record
Proof Record = cryptographic verification surface
Proof JSON = machine-readable verification object

VERSIONING DOMAINS

GAFAIG versioning spans multiple domains:

Snowflake Data Contracts
Public API Contracts
Verification Signature Contract
SDK / Widget
Badge Surfaces
Public Record Model
Public UI Terminology
Documentation
External Verification Tests
Future AI Intelligence Layer

Each domain has its own versioning rules but must remain aligned.

SNOWFLAKE VERSIONING

RULES

Snowflake is authoritative.
Schema/view changes define system behavior.
No version numbers are embedded directly in tables/views unless explicitly required by a future contract.
Changes must be additive or explicitly coordinated.

TYPES OF CHANGES

Non-breaking:

Adding new columns to private/internal tables
Adding new columns to public views when not used in messageString
Adding new record types
Adding new eligibility fields
Adding new lifecycle-adjacent fields
Adding new public-safe metadata
Adding new Snowflake-backed AI recommendation tables after validation

Breaking:

Removing columns from public views
Renaming existing columns
Changing semantic meaning of fields
Changing lifecycle interpretation
Changing validity logic
Changing fields used in messageString
Changing signed field ordering
Changing public certification/proof semantics

REQUIREMENT

Breaking changes must:

be coordinated with API layer
be reflected in documentation
be reflected in SDK/widget behavior where relevant
not silently alter public behavior
not invalidate historical verification without a versioned migration

CRITICAL:

Changes affecting fields used in messageString MUST be treated as cryptographic breaking changes.

PUBLIC VIEW CONTRACT VERSIONING

Primary public contract:

CORE.V_REGISTRY_PUBLIC

Rules:

This is the canonical public data contract.
Fields must not be removed without version transition.
New fields may be added only if backward-compatible.
Public-facing UI must not expose internal fields merely because they exist in the public contract.

Current public contract includes:

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

CRITICAL:

This view defines the canonical payload foundation used for messageString generation.
Any structural change may require signature versioning.

PUBLIC UI EXPOSURE RULE:

Although CASE_ID and APPLICATION_ID may remain in the machine-readable contract for signed payload continuity, public-facing UI pages must not display Application ID or Case ID as user-facing trust labels.

API VERSIONING

CURRENT STATE

GAFAIG APIs are currently unversioned (implicit v1).

Primary endpoints:

/api/verify/[registryId]
/api/registry
/api/registry/search
/api/badge/[registryId]
/api/.well-known/gafaig-public-key
/api/explorer

RULES

API responses must remain backward compatible.
Fields may be added but not removed.
Response shape must not break consumers.
APIs must remain pass-through projections of Snowflake outputs.
APIs must not compute trust, certification, lifecycle, score, or eligibility outside Snowflake.

WHEN TO VERSION API

Introduce explicit versioning such as /api/v2/... when:

response shape changes
required fields are removed or renamed
verification contract changes
messageString structure changes
proof object structure changes
public contract semantics change
lifecycle semantics change
SDK/widget integration contract changes

CRITICAL:

Any change that affects messageString structure or verification logic requires versioning.

VERIFICATION SIGNATURE VERSIONING

CONTROL MECHANISM

Verification contract is versioned through:

alg
kid

CURRENT VALUES

alg: Ed25519
kid: gafaig-ed25519-2026-01

RULES

Changing algorithm requires new alg value.
Rotating keys requires new kid.
Old signatures must remain verifiable.
Historical records must not be invalidated by future key changes.
messageString must remain stable for the key/version that signed it.

MESSAGE VERSIONING

The signed message must:

remain stable
remain deterministic
not be expanded casually
not be reconstructed by consumers

If message structure changes:

introduce new kid
optionally introduce explicit message version field
preserve historical verification behavior
update verification contract docs
update SDK/widget examples
update external tests

CRITICAL:

messageString must remain deterministic across versions and must never be reconstructed.

PUBLIC KEY VERSIONING

Endpoint:

/api/.well-known/gafaig-public-key

Rules:

Must return current active key.
Must include kid.
Must remain stable.
Must expose public key material compatible with external verification surfaces.

Key rotation:

New key → new kid
Old keys must remain verifiable for historical records
Public key page must explain current active key and verification model
External test scripts must be updated to validate current behavior

Public key page:

/public-key

Must reflect:

current key
current kid
Ed25519 verification model
messageString-only verification rule
proof.signature + proof.messageString validation loop

SDK VERSIONING

FILES

public/sdk/gafaig.js
public/sdk/gafaig.v1.js

CURRENT VERSION

v1 production-stable

RULES

SDK version must be explicitly defined.
Breaking changes require major version increment.
Backward-compatible changes increment minor or patch.
SDK must not compute certification trust.
SDK must not reconstruct messageString.
SDK must not verify from parsed JSON fields.
SDK must fail closed.

VERSIONING STRATEGY

MAJOR → breaking changes
MINOR → backward-compatible features
PATCH → bug fixes

DISTRIBUTION

Stable versioned file:

/sdk/gafaig.v1.js

Latest file:

/sdk/gafaig.js

Optional cache-busted usage:

/sdk/gafaig.js?v=1

HARD RULES

Versioned SDK files must NEVER change in a breaking way once published.
Breaking changes require a new file such as /sdk/gafaig.v2.js.
SDK must NOT compute trust logic.
SDK must only fetch, verify, and render based on the verify endpoint.
SDK must NEVER verify from JSON fields.
SDK must NEVER reconstruct messageString.
SDK must preserve fail-closed behavior.

WIDGET VERSIONING

FILES

public/widget/gafaig-widget.js
public/widget/gafaig-widget.v1.js
public/widget/gafaig-verify.js
public/widget/gafaig-verify.v1.js

CURRENT STATE

v1 deployed and aligned with current public trust language.

STRUCTURE

Stable:

/widget/gafaig-widget.v1.js
/widget/gafaig-verify.v1.js

Latest:

/widget/gafaig-widget.js
/widget/gafaig-verify.js

RULES

Versioned widget files must not receive breaking changes.
Latest files must remain backward compatible.
Breaking changes require new version files.
Widget language must remain aligned with registry, verification, proof, and developer pages.

Widget must:

not compute trust
call the verify API
use proof.messageString for cryptographic validation where supported
display verification state
display lifecycle state
display fail-closed state
link to /verify/[registryId]

CRITICAL:

Widgets MUST fail closed and display invalid, unavailable, expired, or revoked states when verification or lifecycle fails.

CURRENT PUBLIC WIDGET LANGUAGE

Verify This Record
Open Certification Record
View Proof JSON
Public Certification + Cryptographic Proof
Certified by GAFAIG and independently verifiable using cryptographic proof

BADGE VERSIONING

Badge assets:

/public/badges/

Rules:

Visual changes must not imply different certification meaning.
Badge semantics must align with Snowflake contract.
Badge logic must respect lifecycleStatus and badgeEligible.
Badges must link users to verification.

Badge surfaces must not replace proof.

Badges are NOT proof.
They are representations only.

Proof = /api/verify + proof.messageString + signature + public key.

RECORD MODEL VERSIONING

GAFAIG uses a record-level certification model.

Current capabilities include:

record-level certification
lifecycle-aware verification
eligibility controls
public trust projection without exposing internal workflow
certification/proof separation
portable trust through SDK and widget

Rules:

Record model changes must be additive where possible.
Must not invalidate existing records.
Must not change meaning of certification without versioning.
Must preserve record-level scope.

Current public terminology:

Public Certification Registry
Public Certification Record
Public Proof Record
Verify This Record
Open Certification Record
Open Full Proof Page
Proof JSON
Proof API
Widget Preview

Avoid:

Raw Verification JSON
Registry Record when referring to a certification page
Open JSON
Application ID as public UI copy
Case ID as public UI copy

DOCUMENTATION VERSIONING

Key docs:

MASTER_STATE.md
CURRENT_FOCUS.md
ENGINEERING_RULES.md
VERIFICATION_SIGNATURE_CONTRACT.md
VERIFIED_DEFINITION.md
VERSIONING.md
GAFAIG_ACTIVE_FILE_MAP.md
GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
GAFAIG_VS_CODE_File_Tree.md
CANONICAL_RUN_ORDER.md

Rules:

Must be updated with every major change.
Must reflect actual system state.
Must not drift from implementation.
Must preserve canonical rules across chats.

Documentation must remain synchronized with:

Snowflake
API
SDK
Widget
Public contract
Verification contract
UI terminology
AI future-phase boundaries

BACKWARD COMPATIBILITY

REQUIRED

Existing registry records must remain verifiable.
Existing signatures must validate.
Existing SDK integrations must not break.
Existing widget embeds must not break.
Existing public proof URLs must remain valid.

STRATEGY

Add fields, do not remove.
Introduce new keys for cryptographic changes.
Introduce new endpoints for breaking API changes.
Introduce new SDK versions for breaking behavior.
Introduce new widget versions for breaking UI/runtime changes.
Preserve current proof pages and registry URLs.

BREAKING CHANGE POLICY

A change is breaking if it:

invalidates existing signatures
removes required API fields
changes verification meaning
alters public contract semantics
breaks SDK integrations
breaks widget integrations
alters messageString structure
changes signed field ordering
changes lifecycle interpretation tied to trust
changes public key format
changes proof object structure
changes public terminology in a way that reverses certification/proof clarity

WHEN BREAKING

Introduce new version.
Preserve old version.
Update documentation.
Update SDK.
Update widget.
Update public key page.
Update developers page.
Update external tests.
Communicate change.

REGISTRY IMMUTABILITY (VERSIONING CONSTRAINT)

Registry tables are append-only:

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

Versioning must NEVER:

mutate historical records
delete published records
overwrite registry snapshots
rewrite signed historical payloads
reuse a registry ID for a different certification record

All changes must be additive.

SEED VERSIONING RULE

GAFAIG uses one canonical seed file only:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

Do not create additional seed files.
Do not split seed logic across files.
Do not create expansion seed files.
Do not directly mutate registry tables.
Expand dataset only within canonical seed file.

Seed is for:

pipeline testing
UI population
registry validation
verify validation
widget/SDK testing
lifecycle edge-case testing

DEPLOYMENT VERSION CONTROL

Deployment via:

Vercel project:

gafaig-vercel

Production:

https://www.gafaig.com

Rules:

Production reflects main branch.
No silent breaking changes.
All changes tested locally first.
Versioned SDK/widget files must be deployed immutably.
Public contract changes must pass build and verification checks.
Snowflake validation must precede distribution.

TESTING VERSION CONSISTENCY

Example:

gafaig.version
gafaig.verify("GAFAIG-00000001").then(console.log)

Expected:

verified: true
proof present
signature valid
messageString present

CRITICAL:

Verification must use messageString only.

External verification tests:

external-tests/verify-gafaig-node.js
external-tests/verify-gafaig-python.py
external-tests/verify-gafaig-tamper.js

Expected:

Valid payload verifies TRUE
Tampered payload verifies FALSE
Verification uses proof.messageString only

CURRENT ACTIVE CONTRACT

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

Primary test record:

GAFAIG-00000001

CURRENT SYSTEM STATE

Working:

Public trust layer aligned
Homepage messaging aligned
Registry list aligned
Registry detail aligned
Verify tool aligned
Proof page aligned
Developers page includes Fast Install
Widget terminology aligned
SDK/widget operational
Verification API working
messageString contract enforced
Ed25519 verification validated
Public key endpoint operational
Bounded lifecycle model active
No Application ID or Case ID displayed in public UI pages

Active work:

Snowflake validation is next
12_TABLES_PARTICIPANTS.sql requires compile validation
15_TABLES_EVENTS.sql requires compile validation
CORE.V_REGISTRY_PUBLIC requires deep validation
CORE.V_REGISTRY_LATEST_APPROVED requires validation
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC requires validation
Explorer requires revalidation after Snowflake contract validation
Multi-case stress testing pending
Lifecycle edge-case testing pending

POST-VALIDATION FUTURE PHASE

AI INTELLIGENCE LAYER

After Snowflake validation is complete, GAFAIG may add a separate Snowflake-backed AI intelligence layer.

AI must be advisory only.

AI may:

Observe governance patterns
Learn from verification cases
Identify recurring evidence gaps
Recommend new governance controls
Recommend schema or standard improvements
Highlight top governance structures
Assist pre-submission guidance
Support global benchmarking

AI must NOT:

Assign FINAL_SCORE
Assign CERTIFICATION_TIER
Assign CERTIFICATION_BAND
Create DECISION_STATUS
Publish registry records
Modify signed payloads
Override Snowflake outputs

Canonical AI rule:

AI suggests
Humans approve
Snowflake decides
Registry publishes
Proof verifies

DO NOT BREAK

Do not:

reconstruct messageString
verify from JSON
compute trust in UI
compute trust in SDK
compute trust in widget
expose private key
alter message shape casually
change signed field ordering
remove proof.messageString
expose score internals publicly
mutate registry tables
create additional seed files
show Application ID publicly
show Case ID publicly
rename Proof JSON back to Raw Verification JSON
rename Certification Record back to Registry Record

FINAL PRINCIPLE

Versioning in GAFAIG is not optional.

It is required to preserve:

cryptographic trust
deterministic behavior
external verifiability
system integrity
public terminology clarity
record-level trust

Versioning mistakes = trust failures.

END OF FILE