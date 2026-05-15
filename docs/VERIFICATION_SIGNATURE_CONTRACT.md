# VERIFICATION_SIGNATURE_CONTRACT.md

Last Updated: 2026-05-14

## PURPOSE

This document defines the canonical verification signature contract for GAFAIG (Global Authority for AI Governance).

GAFAIG is a deterministic global AI governance infrastructure platform that enables organizations, AI systems, regulators, enterprises, governments, research institutions, universities, laboratories, non-profits, technology providers, and governance stakeholders to manage, evaluate, certify, publish, verify, monitor, observe, and coordinate AI governance outcomes through Snowflake-originated public governance trust surfaces and cryptographic verification infrastructure.

GAFAIG exists to create deterministic, independently verifiable public governance trust infrastructure for AI governance at global scale.

GAFAIG also operates as:

* governance trust distribution infrastructure
* communication layer infrastructure
* public accountability infrastructure

This contract governs:

* Snowflake-originated public certification surfaces
* deterministic signed payload generation
* canonical proof generation
* public verification APIs
* SDK/browser verification
* widget verification
* badge verification
* external cryptographic validation
* publication enforcement
* lifecycle-aware trust validation
* governance observability isolation
* governance intelligence isolation
* governance simulation isolation
* append-only governance trust publication

This contract applies to:

* Snowflake public registry views
* `/api/verify/[registryId]`
* `/api/.well-known/gafaig-public-key`
* SDK verification calls
* widgets
* badge rendering
* external verification consumers
* public registry surface verification
* public key page
* developers page examples
* external embed integrations

Public governance trust is established through:

* Snowflake-originated public governance trust surfaces
* deterministic signed payloads
* cryptographic verification

Public governance trust is NOT established through:

* UI rendering
* screenshots
* badges alone
* widget display alone
* copied JSON fields
* reconstructed payloads
* client-side assumptions
* AI governance analytics
* simulation outputs
* governance timeline outputs
* governance observability dashboards

Baseline reviewed from uploaded canonical file.

---

# GLOBAL POSITIONING EVOLUTION (CRITICAL)

GAFAIG has evolved beyond the earlier framing of:

"registry platform"

The platform must now be consistently positioned as:

deterministic global AI governance infrastructure

AND:

public accountability infrastructure for artificial intelligence

This evolution reflects the expansion of GAFAIG into:

* deterministic certification infrastructure
* governance execution infrastructure
* governance intelligence infrastructure
* governance observability infrastructure
* governance simulation infrastructure
* remediation orchestration infrastructure
* append-only publication infrastructure
* cryptographic public governance trust infrastructure
* independent verification infrastructure
* global governance coordination infrastructure
* communication layer infrastructure
* governance trust distribution infrastructure
* public accountability infrastructure

This updated positioning must now be standardized across:

* ENGINEERING_RULES.md
* MASTER_STATE.md
* CURRENT_FOCUS.md
* GAFAIG_CANONICAL_SUMMARY.md
* VERIFIED_DEFINITION.md
* VERIFICATION_SIGNATURE_CONTRACT.md
* VERSIONING.md
* homepage hero messaging
* /mission
* /framework
* /developers
* /registry
* /explorer

CRITICAL:

This positioning evolution must NOT weaken:

* Snowflake-first execution
* deterministic public governance trust guarantees
* publication control
* append-only registry behavior
* proof.messageString verification enforcement
* cryptographic verification integrity
* fail-closed verification behavior
* AI advisory-only boundaries

---

# NON-NEGOTIABLE RULES

Snowflake is the source of truth.

API is pass-through only.

UI is display only.

Registry is append-only.

Certification is private.

Publication is explicit.

Verification uses `proof.messageString` ONLY.

AI is advisory only.

Humans approve.

Snowflake decides.

Registry publishes.

Proof verifies.

Simulation is operational only.

Governance intelligence must NEVER override deterministic public governance trust.

---

# ID PARITY RULE (CRITICAL)

All IDs must be:

* generated ONLY in Snowflake
* never generated in API/UI
* passed through unchanged

Applies to:

* APPLICATION_ID
* REQUEST_ID
* CASE_ID
* REGISTRY_ID
* REGISTRY_SNAPSHOT_ID
* FINDING_ID
* EVIDENCE_ID
* EVENT_ID
* AI_OBSERVATION_ID
* AI_RECOMMENDATION_ID
* REVIEW_ID
* AI_REVIEW_ASSIGNMENT_ID
* AI_CONSENSUS_DECISION_ID
* AI_POLICY_REQUIREMENT_ID
* AI_POLICY_MAPPING_ID
* AI_GOVERNANCE_RISK_SNAPSHOT_ID
* AI_GOVERNANCE_DRIFT_EVENT_ID
* AI_REMEDIATION_TASK_ID
* AI_WORKFLOW_ACTION_ID
* AI_GOVERNANCE_EXECUTION_ID
* AI_GOVERNANCE_APPROVAL_ID
* AI_SIMULATION_SCENARIO_ID
* AI_SIMULATION_RUN_ID
* AI_SIMULATION_EVENT_ID

Violation = system corruption.

---

# CORE PRINCIPLE

A GAFAIG certification surface is verifiable ONLY when:

1. The record originates from Snowflake.
2. The record exists in the canonical public registry contract.
3. The record is publicly published.
4. The verify API signs the canonical `messageString`.
5. The proof validates using GAFAIG’s public key endpoint.
6. The signed payload has not been altered.

The UI, SDK, widget, badge, and external consumers must NEVER:

* compute certification truth
* infer certification truth
* reconstruct verification payloads
* override Snowflake trust state
* mutate proof payloads

---

# GLOBAL TRUST INVARIANTS

These rules apply across ALL layers.

---

## VERIFY API IS THE PROTOCOL CONTRACT

`/api/verify/[registryId]`

is the canonical external verification interface.

All public governance trust surfaces depend on this endpoint.

---

## MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Signature validation MUST use:

`proof.messageString EXACTLY AS RETURNED`

No transformations allowed.

---

## PROOF.MESSAGE IS INFORMATIONAL ONLY

`proof.message`

exists for:

* readability
* debugging
* developer tooling
* transparency

It is NOT authoritative for verification.

---

## PROOF.MESSAGESTRING IS AUTHORITATIVE

`proof.messageString`

is the ONLY valid verification payload.

Verification MUST use:

* exact returned messageString
* exact returned signature

ONLY.

---

## NEVER VERIFY FROM JSON

Verification MUST NEVER use:

* parsed JSON fields
* reconstructed payloads
* reserialized payloads
* UI-rendered values
* message object reconstruction

Verification MUST use:

* exact `proof.messageString`
* exact `proof.signature`

ONLY.

---

## DETERMINISTIC PAYLOAD GUARANTEE

Field ordering MUST remain stable across:

Snowflake
→ API
→ messageString
→ signature
→ external verifier

No formatting drift allowed.

---

## SIGNED PAYLOAD GENERATED ONCE

The canonical signed payload is generated exactly once.

After generation:

* no mutation allowed
* no reserialization allowed
* no field reordering allowed
* no reconstruction allowed

---

## SIGNATURE VS LIFECYCLE SEPARATION

Signature = authenticity

Lifecycle = current public governance trust state

A signature may remain valid even if lifecycle validity later expires.

---

## FAIL-CLOSED SYSTEM

ANY verification failure
→ NOT TRUSTED

Examples:

* signature mismatch
* missing messageString
* missing public key
* malformed payload
* unsupported algorithm
* verification failure
* unpublished record
* malformed proof structure

All verification failures MUST fail closed.

---

## WIDGETS MUST FAIL CLOSED

Widgets MUST display:

* invalid
* unavailable
* expired
* revoked

states when verification or lifecycle fails.

---

# SOURCE OF TRUTH

The source of truth for public verification records is:

`CORE.V_REGISTRY_PUBLIC`

This view defines the canonical public verification contract.

Public visibility requires:

`PUBLISHED = TRUE`

All public governance trust surfaces MUST enforce:

```sql
WHERE PUBLISHED = TRUE
```

No unpublished records may appear publicly.

---

# PUBLICATION MODEL

Certification and publication are separate states.

Certification:

private
deterministic
Snowflake-controlled

Publication:

explicit
optional
append-only
visibility-controlled

Public visibility requires publication.

---

# PUBLIC GOVERNANCE TRUST HIERARCHY

Canonical public governance trust flow:

Snowflake
→ Public View
→ Verify API
→ messageString
→ Signature
→ Public Key
→ External Verifier

Public governance trust does NOT originate from:

UI
widgets
badges
screenshots
copied JSON
reconstructed payloads
AI governance state
governance simulation state
governance observability state
governance timeline state

---

# PUBLIC CONTRACT FIELDS

`CORE.V_REGISTRY_PUBLIC`

currently includes:

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

API may normalize:

UPPERCASE_SNAKE_CASE
→ camelCase

API must NEVER:

recompute trust
recompute certification
recompute lifecycle
recompute badge eligibility
recompute verification eligibility

---

# NO SCORE PUBLIC GOVERNANCE TRUST RULE

Public governance trust surfaces must remain score-blind.

Never expose publicly:

score
tier
band
scoring internals
scoring formulas
governance telemetry
private workflow state

unless a future explicit public contract version introduces them.

---

# CRITICAL MESSAGESTRING RULE

`CORE.V_REGISTRY_PUBLIC`

defines the canonical payload foundation used to generate:

`proof.messageString`

Any structural change impacting signed payload fields is a cryptographic breaking change.

---

# SERIALIZATION VERSIONING RULE

The following are cryptographic breaking changes:

changing signed field order
changing signed field names
changing signed payload structure
changing messageString construction
changing whitespace behavior
changing signing algorithm
changing canonical serialization rules

Breaking changes require:

versioning
updated kid
updated SDK support
updated documentation

---

# PUBLIC UI EXPOSURE RULE

Although:

CASE_ID
APPLICATION_ID

may remain in machine-readable payloads for deterministic contract continuity:

Public UI pages MUST NOT display:

Application ID
Case ID

These IDs are:

machine-contract fields
not public governance trust copy

---

# VERIFY ENDPOINT

Canonical endpoint:

`/api/verify/[registryId]`

Responsibilities:

accept registryId
read canonical public record
construct deterministic messageString
sign messageString
return proof object
support external verification

The endpoint MUST:

run server-side
use runtime = "nodejs"
use dynamic = "force-dynamic"
use revalidate = 0
return Cache-Control: no-store
support CORS
use canonical Snowflake public record
preserve Ed25519 signing
fail closed

The endpoint MUST NEVER:

compute governance score
compute certification
compute lifecycle
compute badge eligibility
compute verification eligibility
mutate signed payloads
reconstruct signed payloads from JSON

---

# VERIFY RESPONSE STRUCTURE

Successful response:

```json
{
  "ok": true,
  "verified": true,
  "registryId": "GAFAIG-XXXXXXXX",
  "record": {},
  "proof": {}
}
```

Failure response:

```json
{
  "ok": false,
  "verified": false,
  "registryId": "GAFAIG-XXXXXXXX",
  "error": "Registry record not found"
}
```

Failure MUST produce:

NOT TRUSTED

---

# RECORD OBJECT CONTRACT

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

values originate from CORE.V_REGISTRY_PUBLIC
API may normalize names
API may convert dates to ISO strings
API must not recompute trust
API must not expose private governance state
public UI must not display applicationId or caseId

---

# PROOF OBJECT CONTRACT

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

verification MUST use exact messageString
verification MUST use exact signature
never reconstruct messageString
never verify from JSON fields
never verify from UI-rendered values

Any modification invalidates signature.

---

# SIGNING ALGORITHM

Algorithm:
Ed25519

Proof alg:
Ed25519

Public key alg:
EdDSA

Current kid:
gafaig-ed25519-2026-01

---

# CANONICAL MESSAGE OBJECT

Current signed assertion fields:

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

must remain stable
must remain deterministic
must be version-controlled
must not expose governance telemetry
must not expose private workflow state
must not expose AI governance state
must not expose simulation state
must not expose scoring internals

---

# MESSAGESTRING

messageString is the exact serialized signed payload.

CRITICAL RULES:

deterministic ordering required
no whitespace drift
no field omission
no formatting drift
never reconstructed
always use exact returned value

Field order MUST remain stable across:

Snowflake
→ API
→ messageString
→ signature
→ external verifier

---

# REGISTRY IMMUTABILITY

Registry tables are append-only.

Append-only registry tables:

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

Do NOT:

manually insert
manually delete
manually mutate

Canonical publication path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4

Legacy compatibility:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

# PUBLIC KEY ENDPOINT

`/api/.well-known/gafaig-public-key`

This is the ONLY valid verification key source.

Consumers MUST:

fetch keys from endpoint
match kid
verify using Ed25519

Never:

hardcode keys
expose private key

---

# PUBLIC KEY PAGE

`/public-key`

Purpose:

explain public verification key
explain Ed25519 verification
explain messageString validation
explain external verification flow

---

# EXTERNAL VERIFICATION PROCESS

Call:
`/api/verify/[registryId]`

Confirm:
ok === true

Extract:
proof.messageString

Extract:
proof.signature

Extract:
proof.kid

Fetch:
`/api/.well-known/gafaig-public-key`

Match:
kid

Verify:
Ed25519 signature

If valid:
record is authentic.

Then evaluate lifecycle separately:

certificationStatus
lifecycleStatus
visibilityStatus
verificationEligible
badgeEligible
validFrom
validTo

---

# TRUST MODEL

Public governance trust depends on:

Snowflake-originated public governance trust surface
publication state
messageString
signature
public key
lifecycle state
visibility state

Public governance trust does NOT depend on:

UI
widgets
screenshots
badges
copied JSON
reconstructed payloads
AI governance state
simulation state
timeline state

---

# LIFECYCLE STATUS

Values:

active
expired
revoked

Lifecycle = public governance trust state.

Signature = authenticity.

Examples:

active + valid signature
→ trusted active certification

expired + valid signature
→ authentic expired certification

revoked + valid signature
→ authentic revoked certification

invalid signature
→ NOT TRUSTED

---

# BOUNDED VALIDITY MODEL

Canonical validity rule:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

VALID_FROM and VALID_TO originate ONLY from Snowflake.

Approved decisions require:

VALID_FROM
VALID_TO
non-overlapping active windows

VALID_TO must NOT be treated as NULL for active records.

---

# VERIFICATION ELIGIBILITY

verificationEligible

Rules:

originates from Snowflake
MUST NOT be computed externally

---

# BADGE ELIGIBILITY

badgeEligible

Rules:

originates from Snowflake
MUST NOT be computed externally

---

# BADGES ARE NOT PROOF

Badges are visual trust indicators only.

Proof = verify API.

Badges MUST:

respect badgeEligible
respect lifecycleStatus
fail closed
link to /verify/[registryId]

---

# WIDGETS ARE NOT PROOF

Widgets are rendering surfaces only.

Widgets are part of the governance trust distribution infrastructure.

They function as:

* portable governance verification surfaces
* governance trust distribution surfaces
* external governance trust signaling infrastructure

Widgets MUST:

call verify API
display lifecycle state
fail closed
independently verify proof.messageString in-browser where supported
validate Ed25519 signature

Widgets MUST NOT:

compute trust
reconstruct payloads
verify from JSON fields
trust host page
override API output

---

# SDK REQUIREMENTS

SDKs are part of the governance trust distribution infrastructure.

They function as:

* portable governance verification surfaces
* governance trust distribution surfaces
* external governance trust signaling infrastructure

SDK MUST:

call verify API
expose verification helpers
expose getPublicKey()
support badge/widget helpers
never compute trust
never reconstruct payloads
never override Snowflake outputs

Current SDK surface:

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

---

# AI GOVERNANCE ISOLATION

AI governance systems are operational and advisory only.

AI governance must NEVER:

modify signed payloads
publish registry records
alter certification state
alter proof state
override Snowflake trust outputs

Applies to:

observations
recommendations
drift engines
remediation systems
workflow orchestration
simulations
governance timelines

Canonical rule:

AI suggests.
Humans approve.
Snowflake decides.
Registry publishes.
Proof verifies.

---

# SIMULATION ISOLATION

Governance simulations are NON-DESTRUCTIVE.

Simulations must NEVER:

mutate certification
mutate publication
mutate registry snapshots
mutate public governance trust
mutate signed payloads

Simulation outputs are internal operational artifacts only.

---

# GOVERNANCE TIMELINE ISOLATION

Governance timeline systems are read-only observability systems.

Timeline systems may:

aggregate events
support audits
support dashboards
support investigation

Timeline systems must NEVER:

certify
publish
mutate trust state
mutate proof state

---

# COMMUNICATION LAYER ARCHITECTURE

GAFAIG now operates simultaneously across:

Layer 1:
Public Human Narrative

Audience:

* citizens
* consumers
* workers
* humanity

Focus:

* accountability
* governance visibility
* public understanding
* public legitimacy

Future domain:
theglobalauthorityforaigovernance.com

Layer 2:
Institutional Governance Infrastructure

Audience:

* enterprises
* regulators
* governments
* governance professionals

Focus:

* governance operations
* certification surfaces
* governance observability
* public governance trust infrastructure

Primary domain:
gafaig.com

Layer 3:
Developer / Verification Infrastructure

Audience:

* developers
* integrators
* auditors

Focus:

* proof.messageString
* Ed25519
* SDKs
* APIs
* cryptographic verification

Narrative legitimacy is now considered:
critical infrastructure.

---

# PUBLIC ACCOUNTABILITY INFRASTRUCTURE

GAFAIG is evolving into public accountability infrastructure for artificial intelligence.

The registry is NOT the platform itself.

The registry is:
the visible public governance trust manifestation layer.

The long-term objective is:
machine-verifiable human accountability for artificial intelligence systems.

Public accountability infrastructure requires:

* deterministic source-of-truth governance records
* publication-controlled certification surfaces
* append-only registry behavior
* cryptographic verification
* public governance legitimacy
* governance visibility
* verification portability
* governance trust distribution

---

# CURRENT ACTIVE CONTRACT

Algorithm:
Ed25519

kid:
gafaig-ed25519-2026-01

Verify endpoint:
`/api/verify/[registryId]`

Public key endpoint:
`/api/.well-known/gafaig-public-key`

Public key page:
`/public-key`

Snowflake public view:
CORE.V_REGISTRY_PUBLIC

SDK:
public/sdk/gafaig.v1.js

Widget:
public/widget/gafaig-widget.v1.js

Canonical publisher:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4

---

# CURRENT SYSTEM STATUS

WORKING

✔ Verification API deterministic
✔ messageString enforced
✔ signature enforced
✔ public key endpoint operational
✔ Ed25519 signing validated
✔ tamper verification passes
✔ publication enforcement operational
✔ bounded validity operational
✔ registry immutability enforced
✔ governance intelligence isolated from proof system
✔ governance simulation isolated from proof system
✔ governance timeline isolated from proof system
✔ public pages no longer expose Application ID or Case ID
✔ canonical validation runner passed
✔ communication layer architecture
✔ narrative infrastructure stabilization
✔ governance trust distribution infrastructure
✔ public accountability infrastructure
✔ governance legitimacy infrastructure

---

# ACTIVE SYSTEM WORK

Current active work:

Snowflake rebuild stabilization
public registry contract validation
explorer revalidation
multi-case stress testing
edge lifecycle testing
large-scale widget fail-closed testing
SDK failure handling testing

---

# DO NOT BREAK

Do NOT:

reconstruct messageString
verify from JSON
compute trust in UI
compute trust in SDK
compute trust in widget
expose private key
alter signed payload structure casually
expose score internals publicly
mutate registry snapshots
create additional seed files
treat UI as proof
treat badge as proof
treat widget display as proof without cryptographic validation
expose Application ID publicly
expose Case ID publicly

---

# END STATE

GAFAIG verification is:

deterministic
Snowflake-originated
cryptographically signed
independently verifiable
lifecycle-aware
publication-controlled
externally consumable
fail-closed
bounded by validity windows

GAFAIG is not a claim.

GAFAIG is a signed, verifiable public governance trust surface.

END OF FILE
