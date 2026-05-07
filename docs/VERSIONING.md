# VERSIONING.md

Last Updated: 2026-05-07

## PURPOSE

This document defines the canonical versioning strategy for GAFAIG (Global Authority for AI Governance).

GAFAIG is a deterministic global AI governance infrastructure platform that enables organizations, AI systems, regulators, enterprises, governments, research institutions, universities, laboratories, non-profits, technology providers, and governance stakeholders to manage, evaluate, certify, publish, verify, monitor, observe, and coordinate AI governance outcomes through Snowflake-originated public trust records and cryptographic proof infrastructure.

GAFAIG exists to create deterministic, independently verifiable trust infrastructure for AI governance at global scale.

This document governs how changes are introduced, tracked, validated, and communicated across:
- Snowflake
- APIs
- SDKs
- widgets
- badges
- public contracts
- verification systems
- cryptographic signatures
- governance intelligence systems
- governance observability systems
- governance simulation systems
- governance timeline systems
- remediation orchestration systems
- public trust surfaces
- append-only registry systems
- documentation
- deployment systems

Versioning must preserve:
- determinism
- backward compatibility where possible
- verifiability
- public trust stability
- cryptographic continuity
- external consumer reliability
- publication separation
- AI governance isolation
- registry append-only integrity
- governance observability isolation
- governance simulation isolation
- global governance coordination integrity

Versioning is not cosmetic.

Versioning is part of the trust infrastructure.

Baseline reviewed from uploaded file. :contentReference[oaicite:0]{index=0}

---

# GLOBAL POSITIONING EVOLUTION (CRITICAL)

GAFAIG has evolved beyond the earlier framing of:

"registry platform"

The platform must now be consistently positioned as:

deterministic global AI governance infrastructure

This evolution reflects the expansion of GAFAIG into:
- deterministic certification infrastructure
- governance execution infrastructure
- governance intelligence infrastructure
- governance observability infrastructure
- governance simulation infrastructure
- remediation orchestration infrastructure
- append-only publication infrastructure
- cryptographic public trust infrastructure
- independent verification infrastructure
- global governance coordination infrastructure

This updated positioning must now be standardized across:
- ENGINEERING_RULES.md
- MASTER_STATE.md
- CURRENT_FOCUS.md
- GAFAIG_CANONICAL_SUMMARY.md
- VERIFIED_DEFINITION.md
- VERIFICATION_SIGNATURE_CONTRACT.md
- VERSIONING.md
- homepage hero messaging
- /mission
- /framework
- /developers
- /registry
- /explorer

CRITICAL:

This positioning evolution must NOT weaken:
- Snowflake-first execution
- deterministic trust guarantees
- publication control
- append-only registry behavior
- proof.messageString verification enforcement
- cryptographic verification integrity
- fail-closed verification behavior
- AI advisory-only boundaries

---

# CORE PRINCIPLES

Snowflake is the source of truth.

Public contracts must remain stable or explicitly versioned.

Breaking changes must be versioned, not silently introduced.

Cryptographic verification must remain backward verifiable.

UI/SDK/widget must never redefine contract behavior.

Versioning must be explicit, traceable, and auditable.

Public trust language must remain consistent across all surfaces.

AI governance layers must not alter public trust contracts unless explicitly versioned through Snowflake public-safe contracts.

Governance observability systems must not mutate deterministic trust guarantees.

Governance simulation systems must remain operational-only unless explicitly versioned into a public-safe contract.

---

# NON-NEGOTIABLE RULES

Snowflake is the source of truth.

API is pass-through only.

UI is display only.

Registry is append-only.

Certification is private.

Publication is explicit.

Verification uses proof.messageString only.

AI is advisory only.

Humans approve.

Snowflake decides.

Registry publishes.

Proof verifies.

Simulation is operational only.

Governance intelligence must NEVER override deterministic trust.

---

# CRITICAL ENFORCEMENT

Versioning must preserve verification protocol integrity.

messageString must remain deterministic across versions.

Verification must never rely on JSON field reconstruction.

Verification must always use proof.messageString exactly.

All changes must maintain fail-closed verification behavior.

All public changes must preserve the certification/proof distinction.

All public changes must preserve publication enforcement.

All AI governance changes must preserve isolation from:
- proof
- registry
- certification
- publication state
- public trust state

All simulation changes must preserve:
- non-destructive behavior
- operational-only status
- separation from certification
- separation from publication
- separation from proof state

All observability changes must preserve:
- read-only behavior
- operational visibility only
- separation from public trust mutation
- separation from signed payload mutation

---

# ID PARITY RULE

All IDs must be:
- generated ONLY in Snowflake
- never generated in API/UI
- passed through unchanged

Applies to:
- APPLICATION_ID
- REQUEST_ID
- CASE_ID
- FINDING_ID
- EVIDENCE_ID
- EVENT_ID
- SNAPSHOT_ID
- REGISTRY_SNAPSHOT_ID
- REGISTRY_ID
- AI_OBSERVATION_ID
- AI_RECOMMENDATION_ID
- REVIEW_ID
- AI_REVIEW_ASSIGNMENT_ID
- AI_CONSENSUS_DECISION_ID
- AI_POLICY_REQUIREMENT_ID
- AI_POLICY_MAPPING_ID
- AI_GOVERNANCE_RISK_SNAPSHOT_ID
- AI_GOVERNANCE_DRIFT_EVENT_ID
- AI_REMEDIATION_TASK_ID
- AI_WORKFLOW_ACTION_ID
- AI_GOVERNANCE_EXECUTION_ID
- AI_GOVERNANCE_APPROVAL_ID
- AI_SIMULATION_SCENARIO_ID
- AI_SIMULATION_RUN_ID
- AI_SIMULATION_EVENT_ID

Violation = system corruption.

---

# GLOBAL TRUST INVARIANTS

These invariants MUST be preserved across ALL versions.

---

## VERIFY API IS THE PROTOCOL CONTRACT

/api/verify/[registryId] must remain the canonical verification interface.

---

## MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Verification MUST use proof.messageString exactly.

---

## PROOF.MESSAGE IS INFORMATIONAL ONLY

proof.message exists for readability and transparency.

It is not authoritative for verification.

---

## NEVER VERIFY FROM JSON

JSON-based verification is prohibited across all versions.

---

## DETERMINISTIC PAYLOAD GUARANTEE

Field order MUST remain stable across:

Snowflake
→ API
→ messageString
→ signature
→ external verifier

---

## SIGNATURE VS LIFECYCLE SEPARATION

Signature = authenticity

Lifecycle = current trust state

---

## FAIL-CLOSED SYSTEM

ANY failure
→ NOT TRUSTED

---

## PUBLIC UI SEPARATION

Certification Record = public trust record

Proof Record = cryptographic verification surface

Proof JSON = machine-readable verification object

---

# PUBLICATION VERSIONING RULE

Certification and publication are separate states.

Certification:
- private
- deterministic
- Snowflake-controlled

Publication:
- explicit
- optional
- append-only
- visibility-controlled

Public visibility requires:

PUBLISHED = TRUE

All public surfaces must enforce:

```sql
WHERE PUBLISHED = TRUE

Breaking changes include:

changing publication semantics
exposing unpublished records
treating certification as automatic publication
treating approval as public certification
changing public visibility logic

Publication changes must be versioned and documented.

VERSIONING DOMAINS

GAFAIG versioning spans multiple domains:

Snowflake data contracts
Public API contracts
Verification signature contract
Public registry record model
SDK
Widget
Badge surfaces
Public UI terminology
AI governance layers
Governance simulation systems
Governance timeline systems
Governance observability systems
Documentation
External verification tests
Deployment systems

Each domain has its own versioning rules but must remain aligned.

SNOWFLAKE VERSIONING

Snowflake is authoritative.

Schema/view changes define system behavior.

No version numbers are embedded directly in tables/views unless explicitly required by a future contract.

Changes must be additive or explicitly coordinated.

NON-BREAKING SNOWFLAKE CHANGES

Non-breaking changes may include:

adding new columns to private/internal tables
adding new columns to public views when not used in messageString
adding new record types
adding new eligibility fields
adding new lifecycle-adjacent fields
adding new public-safe metadata
adding new internal AI governance tables
adding new internal AI governance views
adding new simulation views
adding new timeline views
adding new governance observability views
adding new remediation orchestration views
adding new operational governance telemetry
BREAKING SNOWFLAKE CHANGES

Breaking changes include:

removing columns from public views
renaming existing columns
changing semantic meaning of fields
changing lifecycle interpretation
changing validity logic
changing publication visibility logic
changing fields used in messageString
changing signed field ordering
changing public certification/proof semantics
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

PUBLIC UI EXPOSURE RULE

Although CASE_ID and APPLICATION_ID may remain in the machine-readable contract for signed payload continuity, public-facing UI pages must not display:

Application ID
Case ID

as public trust labels.

API VERSIONING

GAFAIG APIs are currently unversioned and treated as implicit v1.

Primary endpoints:

/api/verify/[registryId]
/api/registry
/api/registry/search
/api/badge/[registryId]
/api/.well-known/gafaig-public-key
/api/explorer

Rules:

API responses must remain backward compatible.

Fields may be added but not removed.

Response shape must not break consumers.

APIs must remain pass-through projections of Snowflake outputs.

APIs must not compute:

trust
certification
lifecycle
score
publication
eligibility

outside Snowflake.

WHEN TO VERSION API

Introduce explicit versioning such as /api/v2/... when:

response shape changes
required fields are removed or renamed
verification contract changes
messageString structure changes
proof object structure changes
public contract semantics change
lifecycle semantics change
publication semantics change
SDK/widget integration contract changes

CRITICAL:

Any change affecting messageString structure or verification logic requires versioning.

VERIFICATION SIGNATURE VERSIONING

Verification contract is versioned through:

alg
kid

Current values:

alg: Ed25519
kid: gafaig-ed25519-2026-01

Rules:

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

must return current active key
must include kid
must remain stable
must expose public key material compatible with external verification surfaces

Key rotation:

New key
→ new kid

Old keys must remain verifiable for historical records.

Public key page must explain:

current active key
current kid
Ed25519 verification model
messageString-only verification rule
proof.signature + proof.messageString validation loop

Public key page:

/public-key

SDK VERSIONING

Files:

public/sdk/gafaig.js
public/sdk/gafaig.v1.js

Current version:

v1 production-stable

Rules:

SDK version must be explicitly defined.

Breaking changes require major version increment.

Backward-compatible changes increment minor or patch.

SDK must not compute certification trust.

SDK must not reconstruct messageString.

SDK must not verify from parsed JSON fields.

SDK must fail closed.

VERSIONING STRATEGY

MAJOR
→ breaking changes

MINOR
→ backward-compatible features

PATCH
→ bug fixes

DISTRIBUTION

Stable versioned file:

/sdk/gafaig.v1.js

Latest file:

/sdk/gafaig.js

Optional cache-busted usage:

/sdk/gafaig.js?v=1

HARD RULES

Versioned SDK files must NEVER change in a breaking way once published.

Breaking changes require a new file such as:

/sdk/gafaig.v2.js

SDK must NOT compute trust logic.

SDK must only:

fetch
verify
render

based on the verify endpoint.

SDK must NEVER:

verify from JSON fields
reconstruct messageString

SDK must preserve fail-closed behavior.

WIDGET VERSIONING

Files:

public/widget/gafaig-widget.js
public/widget/gafaig-widget.v1.js
public/widget/gafaig-verify.js
public/widget/gafaig-verify.v1.js

Current state:

v1 deployed and aligned with current public trust language.

Stable:

/widget/gafaig-widget.v1.js
/widget/gafaig-verify.v1.js

Latest:

/widget/gafaig-widget.js
/widget/gafaig-verify.js

Rules:

Versioned widget files must not receive breaking changes.

Latest files must remain backward compatible.

Breaking changes require new version files.

Widget language must remain aligned with:

registry
verification
proof
developer pages

Widget must:

not compute trust
call the verify API
use proof.messageString for cryptographic validation where supported
display verification state
display lifecycle state
display fail-closed state
link to /verify/[registryId]

CRITICAL:

Widgets MUST fail closed and display:

invalid
unavailable
expired
revoked

states when verification or lifecycle fails.

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

Badge logic must respect:

lifecycleStatus
badgeEligible

Badges must link users to verification.

Badge surfaces must not replace proof.

Badges are NOT proof.

Proof =
/api/verify

proof.messageString
signature
public key
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

CURRENT PUBLIC TERMINOLOGY
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
AI GOVERNANCE VERSIONING

AI governance layers are internal and advisory unless explicitly promoted through a canonical public-safe contract.

Active AI governance layers include:

AI observation generation
AI recommendation workflows
human review workflows
consensus governance
policy mapping
risk + drift analysis
remediation orchestration
execution governance
continuous monitoring
governance simulation
governance timeline observability
governance observability infrastructure

Rules:

AI governance changes must not alter:

public certification state
publication state
registry snapshots
proof payloads
messageString
public verification results

Breaking changes include:

AI layer mutating public trust state
AI layer writing to registry snapshots directly
AI layer altering signed payload fields
AI layer exposing private telemetry publicly without a public-safe contract

AI governance changes may be additive internally if they preserve isolation.

GOVERNANCE SIMULATION VERSIONING

Governance simulations are operational only.

Simulation may:

model governance collapse
model drift escalation
model trust decay
model approval delays
support internal planning
support internal stress testing

Simulation must not:

mutate certification
mutate publication
mutate registry snapshots
mutate proof state
affect public trust

Simulation versioning must preserve:

non-destructive behavior
internal-only visibility
clear separation from public trust state
GOVERNANCE TIMELINE VERSIONING

Governance timeline systems are read-only observability systems.

Timeline systems may:

aggregate events
support audits
support dashboards
support investigation
support future internal UI timelines

Timeline systems must never:

certify
publish
mutate trust state
mutate proof state
expose private records publicly without a public-safe contract

Timeline versioning must preserve:

read-only behavior
internal visibility unless explicitly published
separation from verification/proof state
GOVERNANCE OBSERVABILITY VERSIONING

Governance observability systems are operational intelligence systems.

Observability systems may:

aggregate governance telemetry
support remediation dashboards
support operational governance analytics
support governance coordination
support governance execution visibility

Observability systems must NEVER:

certify
publish
mutate proof state
mutate registry state
override deterministic trust guarantees

Observability versioning must preserve:

read-only operational behavior
isolation from proof systems
isolation from certification systems
internal-only visibility unless explicitly published through a public-safe contract
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
GAFAIG_CANONICAL_SUMMARY.md
PAGE_LAYOUT_SYSTEM.md
PUBLIC_PAGE_TEMPLATE_MAP.md
PUBLIC_PAGE_AUDIT.md

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
AI governance boundaries
Simulation boundaries
Timeline boundaries
Observability boundaries
BACKWARD COMPATIBILITY

Required:

existing registry records must remain verifiable
existing signatures must validate
existing SDK integrations must not break
existing widget embeds must not break
existing public proof URLs must remain valid

Strategy:

add fields, do not remove
introduce new keys for cryptographic changes
introduce new endpoints for breaking API changes
introduce new SDK versions for breaking behavior
introduce new widget versions for breaking UI/runtime changes
preserve current proof pages and registry URLs
BREAKING CHANGE POLICY

A change is breaking if it:

invalidates existing signatures
removes required API fields
changes verification meaning
alters public contract semantics
changes publication semantics
breaks SDK integrations
breaks widget integrations
alters messageString structure
changes signed field ordering
changes lifecycle interpretation tied to trust
changes public key format
changes proof object structure
changes public terminology in a way that reverses certification/proof clarity
exposes AI governance telemetry publicly without explicit public-safe contract
exposes score/tier/band publicly without explicit public-safe contract
turns governance simulation outputs into public trust outputs
turns governance observability dashboards into public verification authority

When breaking:

introduce new version
preserve old version
update documentation
update SDK
update widget
update public key page
update developers page
update external tests
communicate change
REGISTRY IMMUTABILITY VERSIONING CONSTRAINT

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

do not create additional seed files
do not split seed logic across files
do not create expansion seed files
do not directly mutate registry tables
do not directly mutate AI governance tables

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

Valid payload verifies TRUE.

Tampered payload verifies FALSE.

Verification uses proof.messageString only.

CURRENT ACTIVE CONTRACT

Algorithm:
Ed25519

Key ID:
gafaig-ed25519-2026-01

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

Canonical publisher:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4

Snowflake public view:
CORE.V_REGISTRY_PUBLIC

Primary test record:
GAFAIG-00000001

CURRENT SYSTEM STATE

Working:

public trust layer aligned
homepage messaging aligned
registry list aligned
registry detail aligned
verify tool aligned
proof page aligned
developers page includes Fast Install
widget terminology aligned
SDK/widget operational
verification API working
messageString contract enforced
Ed25519 verification validated
public key endpoint operational
bounded lifecycle model active
no Application ID or Case ID displayed in public UI pages
publication enforcement active
AI governance layer operational
governance simulation layer operational
governance timeline layer operational
governance observability layer operational
canonical validation runner passed

Active work:

public registry contract validation
explorer revalidation
multi-case stress testing
lifecycle edge-case testing
governance dashboard distribution planning
governance observability distribution planning
global governance coordination infrastructure expansion
CURRENT PHASE

GOVERNANCE INTELLIGENCE + OPERATIONAL GOVERNANCE VALIDATION

Primary objectives:

preserve deterministic trust guarantees
enforce publication visibility separation
validate AI governance isolation
stabilize canonical rebuilds
expand governance observability safely
preserve global governance coordination integrity
NEXT PHASE

GOVERNANCE DISTRIBUTION + OBSERVABILITY

Planned:

governance analytics APIs
governance telemetry dashboards
simulation visualization UI
governance timeline UI
remediation escalation dashboards
enterprise governance observability
governance coordination surfaces

WITHOUT:

AI certification authority
AI publication authority
AI scoring authority
AI proof mutation authority
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
expose governance telemetry publicly
mutate registry tables
create additional seed files
show Application ID publicly
show Case ID publicly
rename Proof JSON back to Raw Verification JSON
rename Certification Record back to Registry Record
convert simulations into certification authority
convert observability dashboards into verification authority
FINAL PRINCIPLE

Versioning in GAFAIG is not optional.

It is required to preserve:

cryptographic trust
deterministic behavior
external verifiability
system integrity
public terminology clarity
record-level trust
publication separation
AI governance isolation
governance observability isolation
governance simulation isolation
global governance coordination integrity

Versioning mistakes = trust failures.

END OF FILE