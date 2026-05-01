ENGINEERING_RULES.md

Last Updated: 2026-04-30

PURPOSE

This document defines the non-negotiable engineering rules for GAFAIG (Global Authority for AI Governance). These rules govern how the system is designed, implemented, modified, and extended across Snowflake, API, SDK, UI, and public trust surfaces.

GAFAIG is a deterministic governance verification system. These rules exist to preserve:

determinism
data integrity
trust integrity
cryptographic verifiability
architectural consistency

Violation of these rules = system corruption.

CORE SYSTEM PRINCIPLE

Snowflake is the ONLY source of truth.

Everything else is a projection.

GLOBAL TRUST INVARIANTS (PHASE 6.4 — LOCKED)

These rules override all implementation details.

VERIFY API IS THE PROTOCOL CONTRACT
/api/verify is the canonical external verification interface.
MESSAGESTRING IS THE ONLY VERIFICATION INPUT
Signature validation MUST use proof.messageString exactly.
NEVER VERIFY FROM JSON
Verification must NEVER use parsed JSON fields or reconstructed payloads.
DETERMINISTIC PAYLOAD GUARANTEE
Field order MUST remain stable across:
Snowflake → API → messageString → signature
SIGNATURE VS LIFECYCLE SEPARATION
Signature = authenticity
Lifecycle = current trust state
FAIL-CLOSED SYSTEM
ANY failure → NOT TRUSTED
WIDGETS MUST FAIL CLOSED
Widgets MUST display INVALID / UNVERIFIED when verification fails
CANONICAL ARCHITECTURE (LOCKED)

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEW
→ API
→ SDK
→ UI

This flow is immutable.

Do NOT:

reorder
bypass
duplicate
simulate outside Snowflake
DATA AUTHORITY RULE

All authoritative data originates in Snowflake.

Specifically:

certification status
lifecycle status
eligibility flags
registry records
scoring outputs
decisions

API, SDK, UI:
→ MUST ONLY READ AND PASS THROUGH

ID PARITY RULE (CRITICAL)

All IDs must:

be generated in Snowflake ONLY
NEVER be generated in API/UI/SDK
be passed through unchanged

Applies to:

APPLICATION_ID
CASE_ID
REGISTRY_ID
FINDING_ID
EVIDENCE_ID
EVENT_ID
REGISTRY_SNAPSHOT_ID

Any mutation = corruption.

NO COMPUTATION OUTSIDE SNOWFLAKE

The following must NEVER be computed outside Snowflake:

certification status
lifecycle status
verification eligibility
badge eligibility
score
tier
band

API/UI/SDK must not infer or recompute.

PUBLIC CONTRACT RULE

The public contract is defined ONLY by:

CORE.V_REGISTRY_PUBLIC

Rules:

API must use this view directly
No alternate sources
No reconstructed data
No synthetic fields

CRITICAL ADDITION:
This contract is the foundation for messageString generation.
Changes to this contract are cryptographic breaking changes.

VIEW DESIGN RULE

Snowflake views must be:

projection layers
deterministic
non-destructive

Do NOT:

embed heavy business logic
duplicate scoring logic
introduce side effects

CRITICAL:
Views must maintain deterministic field ordering.

SNAPSHOT IMMUTABILITY RULE

CORE.REGISTRY_SNAPSHOTS are immutable.

Once published:

cannot be updated
cannot be deleted
cannot be rewritten

New state → new snapshot.

🔴 REGISTRY IMMUTABILITY RULE (ADDED — CRITICAL)

The following tables are APPEND-ONLY:

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

NEVER:

DELETE from registry tables
INSERT into registry tables directly
UPDATE registry tables manually

ONLY allowed write path:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(...)

Violation = system corruption.

PUBLISH RULE

The ONLY valid publish path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Do NOT:

insert into REGISTRY_SNAPSHOTS manually
simulate publish in API
bypass procedure

CRITICAL:
Publish output must remain deterministic for signature generation.

SCORING RULE

Scoring must ONLY occur in:

CORE.SP_SCORE_CASE_ENTERPRISE

Output:
CORE.CASE_SCORE_SNAPSHOTS

Do NOT:

compute scores in API/UI
expose raw scoring publicly

CRITICAL ADDITION:
Score is PRIVATE and must NEVER appear in public views or verification payloads.

CERTIFICATION RULE

Certification is:

a Snowflake-derived state
a published registry record
a public contract

Certification is NOT:

a UI label
a badge
a computed flag in API
VERIFICATION RULE

Verification is:

a cryptographic validation
tied to a signed payload
externally reproducible

Verification is NOT:

a UI state
a boolean guess
based on lifecycle
SIGNATURE RULE

Verification payload must:

be signed using Ed25519
include kid
include messageString
be verifiable using public key endpoint

Do NOT:

alter message after signing
expose private key
change signature format without versioning

CRITICAL:
Signature MUST be generated from messageString ONLY.

MESSAGE CONTRACT RULE

Signed message must:

be minimal
be deterministic
contain only certification assertion fields

Do NOT:

include score/tier/band
include internal workflow data
include findings/evidence

CRITICAL CORRECTION:

Lifecycle and eligibility ARE allowed in the signed message if defined in the public contract (CORE.V_REGISTRY_PUBLIC).

CRITICAL:
messageString is canonical and must never be reconstructed.

API RULES

API is a thin layer.

Responsibilities:

query Snowflake
normalize field names
sign payload
return response

API must NOT:

compute trust
compute lifecycle
compute certification
generate IDs
VERIFY API RULES

Endpoint:
/api/verify/[registryId]

Must:

return record from Snowflake
include proof object
include messageString
support CORS
use no-store caching

Must NOT:

hide expired records
infer eligibility
compute certification

CRITICAL:

verify API is the protocol contract
verification MUST use messageString only
failure MUST result in NOT TRUSTED state
BADGE RULES

Badges are visual only.

Rules:

must respect BADGE_ELIGIBLE
must respect lifecycle
must not imply scoring
must not act as proof

Static badge ≠ trust
SDK badge = live display
Verify endpoint = truth

SDK RULES

SDK must:

call API endpoints
expose convenience methods
reflect Snowflake truth

SDK must NOT:

compute trust
override API results
store authoritative state
verify from JSON fields
reconstruct messageString
UI RULES

UI is presentation only.

UI may:

display data
render status
provide interaction

UI must NOT:

compute certification
compute lifecycle
infer trust
mutate data
WIDGET RULE

Widgets are rendering layers.

They must:

call verify API
display proof
display lifecycle state
fail closed

They must NOT:

compute trust
verify from JSON

CRITICAL ADDITION:
Widgets MUST display INVALID / UNAVAILABLE / EXPIRED / REVOKED when appropriate.

LIFECYCLE RULE

Lifecycle is defined in Snowflake.

Values:

active
expired
revoked

Must NOT be computed elsewhere.

CRITICAL:
Signature proves authenticity.
Lifecycle determines trust state.

ELIGIBILITY RULE

Eligibility fields:

VERIFICATION_ELIGIBLE
BADGE_ELIGIBLE

Defined ONLY in Snowflake.

RECORD MODEL RULE (PHASE 6)

Certification attaches to records.

Record types:

ORGANIZATION
AI_SYSTEM
PORTFOLIO
USE_CASE

Rules:

certification is scoped
no over-claiming trust
record defines what is verified
NO UI HACKS RULE

Do NOT:

“fix” data in UI
override backend inconsistencies
simulate missing fields

Fix at source (Snowflake).

FILE INTEGRITY RULE

When updating files:

always request current file if uncertain
provide COMPLETE file
do NOT shrink files
do NOT remove sections unless instructed

CRITICAL ADDITION:
All updates must be additive or surgical — NEVER compress or rewrite.

LAYOUT SYSTEM RULE

Use:

PAGE_LAYOUT_SYSTEM.md
PUBLIC_PAGE_TEMPLATE_MAP.md

Rules:

preserve structure
preserve content
standardize shell only
VERSIONING RULE

All breaking changes must be versioned.

Applies to:

API
signature contract
SDK

Use:

new kid for crypto changes
new endpoint version if needed

CRITICAL ADDITION:
Changes to messageString structure REQUIRE versioning.

DEPLOYMENT RULE

Deployment via Vercel.

Rules:

push only tested code
do not deploy broken builds
test locally first
TESTING RULE

Always validate:

gafaig.verify("GAFAIG-00363095").then(console.log)

CRITICAL:
Verification must use messageString only.

SEED DATA RULE (CRITICAL)

GAFAIG must use exactly ONE canonical seed file.

Active file:
GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

Only one seed file is allowed
No auxiliary or secondary seed files
All expansion must occur in the canonical file
Seed must remain deterministic

Do NOT:

create additional seed files
split seed logic across files
introduce parallel seed execution

CRITICAL:

Multiple seed files introduce non-determinism, break canonical run order, and corrupt registry outputs and verification.

Seed data exists only for:

pipeline validation
public page population during development

Seed data is NOT production data.

FINAL RULE

If a change introduces:

non-determinism
hidden logic
duplicate truth
verification ambiguity
signature inconsistency

→ REJECT IT.

FINAL LINE

Do not optimize.
Do not simplify.

Preserve truth.