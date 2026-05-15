# VERIFIED_DEFINITION.md

Last Updated: 2026-05-14

## PURPOSE

This document defines what “Verified” means within GAFAIG (Global Authority for AI Governance). It establishes the canonical, system-wide definition of verification, how verification is determined, how it is represented in public APIs, and how it must be interpreted by UI, SDKs, widgets, badges, and external consumers.

GAFAIG is a deterministic global AI governance infrastructure platform, governance trust distribution infrastructure, communication layer infrastructure, and public accountability infrastructure that enables organizations, AI systems, regulators, enterprises, governments, research institutions, universities, laboratories, non-profits, technology providers, and governance stakeholders to manage, evaluate, certify, publish, verify, monitor, observe, and coordinate AI governance outcomes through Snowflake-originated public governance trust surfaces and cryptographic verification infrastructure.

GAFAIG exists to create deterministic, independently verifiable public governance trust infrastructure for AI governance at global scale.

Verification is not:

* a UI state
* a heuristic
* a marketing claim
* a frontend boolean
* a visual badge alone

Verification is:

* deterministic
* cryptographic
* externally reproducible
* fail-closed
* messageString-based
* tied directly to a Snowflake-originated public certification surface

Verification exists to prove that a published GAFAIG certification surface is authentic, tamper-resistant, and independently verifiable using GAFAIG’s public verification key.

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
* deterministic trust guarantees
* publication control
* append-only registry behavior
* proof.messageString verification enforcement
* cryptographic verification integrity
* fail-closed verification behavior
* AI advisory-only boundaries

---

## NON-NEGOTIABLE RULES

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

Governance intelligence must NEVER override deterministic public governance trust.

---

## ID PARITY RULE

All IDs must be:

* generated ONLY in Snowflake
* never generated in API/UI
* passed through unchanged

Applies to:

* APPLICATION_ID
* REQUEST_ID
* CASE_ID
* FINDING_ID
* EVIDENCE_ID
* EVENT_ID
* REGISTRY_ID
* REGISTRY_SNAPSHOT_ID
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

## CORE DEFINITION

A GAFAIG certification surface is Verified = true if and only if ALL of the following conditions are satisfied:

### 1. Record Exists

A record with the given REGISTRY_ID exists in:

CORE.V_REGISTRY_PUBLIC

### 2. Public Record Contract

The record returned is a direct projection of the canonical public view:

CORE.V_REGISTRY_PUBLIC

without recomputation of public governance trust fields in:

* API
* UI
* SDK
* widget
* badge
* external integration layers

### 3. Publication Enforced

The record is publicly published.

Public visibility requires:

PUBLISHED = TRUE

All public governance trust surfaces must enforce published-only visibility.

### 4. Signed Payload Present

The verify endpoint returns a proof object containing a signature over a canonical messageString.

### 5. Canonical messageString Present

The proof object contains:

proof.messageString

exactly as signed by GAFAIG.

### 6. Signature Validity

The signature can be validated against the public key retrieved from:

/api/.well-known/gafaig-public-key

using Ed25519.

### 7. Payload Integrity

The signed payload has not been altered.

No mutation, reserialization, field reordering, or reconstruction may occur after signing.

If any of the above conditions fail, the record must be treated as:

Verified = false

---

## CRITICAL VERIFICATION RULE

Verification MUST be performed using:

proof.messageString only

Verification MUST NOT be performed using:

* parsed JSON fields
* reconstructed payloads
* proof.message
* UI-rendered data
* SDK convenience outputs
* widget-rendered data
* badge-rendered data
* screenshots
* copied JSON fields
* client-side assumptions

---

## GLOBAL TRUST INVARIANTS

### VERIFY API IS THE PROTOCOL CONTRACT

/api/verify/[registryId] is the canonical external verification interface.

All public governance trust surfaces depend on this endpoint.

### MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Verification MUST use:

proof.messageString

exactly as returned.

### PROOF.MESSAGE IS INFORMATIONAL ONLY

proof.message exists for:

* readability
* debugging
* developer tooling
* transparency

It is not authoritative for verification.

### NEVER VERIFY FROM JSON

Verification must NEVER use:

* parsed JSON fields
* reconstructed payloads
* reserialized payloads
* UI-rendered values
* message object reconstruction

Verification must use:

* exact proof.messageString
* exact proof.signature

only.

### DETERMINISTIC PAYLOAD GUARANTEE

Field order must remain stable across:

Snowflake
→ API
→ messageString
→ signature
→ external verifier

No formatting drift is allowed.

### SIGNED PAYLOAD GENERATED ONCE

The canonical signed payload is generated exactly once.

After generation:

* no mutation allowed
* no reconstruction allowed
* no reserialization allowed
* no field reordering allowed

### SIGNATURE VS LIFECYCLE SEPARATION

Signature = authenticity

Lifecycle = current public governance trust state

A signature may remain valid even if lifecycle validity later expires.

### FAIL-CLOSED SYSTEM

Any verification failure results in:

Verified = false

Examples:

* signature mismatch
* missing messageString
* missing public key
* malformed payload
* unsupported algorithm
* verification failure
* unpublished record
* malformed proof structure
* unavailable public record

### WIDGETS MUST FAIL CLOSED

Widgets must display:

* invalid
* unavailable
* expired
* revoked

states when verification or lifecycle fails.

---

## WHAT “VERIFIED” IS NOT

Verification is NOT:

* a visual badge
* a UI indicator or icon
* a successful API call alone
* a boolean computed in frontend code
* a function of lifecycle alone
* a function of eligibility flags alone
* a marketing claim
* a JSON-based validation
* a static widget display
* a screenshot
* a manually copied record
* a claim that an entire organization is certified
* a claim that all systems are certified
* a claim that all future systems are certified
* a disclosure of internal evidence
* a disclosure of internal scoring
* a disclosure of reviewer notes
* a replacement for the public proof record

Verification is a cryptographic property of a Snowflake-originated public certification surface.

---

## SOURCE OF TRUTH

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

This view is the canonical payload foundation used to generate messageString.

Any structural change that impacts signed payload fields must be treated as a cryptographic breaking change.

---

## PUBLICATION MODEL

Certification and publication are separate states.

Certification:

* private
* deterministic
* Snowflake-controlled

Publication:

* explicit
* optional
* append-only
* visibility-controlled

Public visibility requires:

PUBLISHED = TRUE

Certification alone does not create public governance trust.

Approval alone does not create public governance trust.

Publication is required before a certification surface may appear publicly.

---

## PUBLIC VISIBILITY ENFORCEMENT

All public surfaces MUST enforce:

WHERE PUBLISHED = TRUE

Applies to:

* CORE.V_REGISTRY_PUBLIC
* CORE.V_REGISTRY_LATEST_APPROVED
* CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
* /api/registry
* /api/verify/[registryId]
* /api/badge/[registryId]
* widgets
* SDK
* public UI
* explorer surfaces

No unpublished record may appear publicly.

---

## PUBLIC GOVERNANCE TRUST HIERARCHY

Canonical public governance trust flow:

Snowflake
→ Public View
→ Verify API
→ messageString
→ Signature
→ Public Key
→ External Verifier

Public governance trust does NOT originate from:

* UI
* widgets
* badges
* screenshots
* copied JSON
* reconstructed payloads
* AI governance analytics
* simulations
* governance timelines

---

## PUBLIC UI EXPOSURE NOTE

Although CORE.V_REGISTRY_PUBLIC may include CASE_ID and APPLICATION_ID for internal public-contract continuity and signed payload stability, public-facing UI pages must not display Application ID or Case ID.

These IDs may remain in API payloads only if required by the signed message contract and must not be treated as user-facing public governance trust copy.

Public registry and proof pages must not expose:

* Application ID
* Case ID
* private workflow state
* internal scoring state
* private evidence
* reviewer notes

---

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

* verified must be true only when proof is present and structurally valid
* API must not infer verification from UI or eligibility flags
* API must not suppress records based on lifecycle alone
* API must return messageString when proof is available
* API must fail safely when a record or proof cannot be produced
* API must not recompute lifecycle
* API must not recompute certification
* API must not recompute badge eligibility
* API must not recompute verification eligibility
* API must not compute score
* API must not mutate proof payloads
* API must not reconstruct signed payloads from JSON

CRITICAL:

Verification MUST use messageString only.

The verify endpoint is the protocol contract.

Failure MUST result in:

verified = false

---

## VERIFY ENDPOINT REQUIREMENTS

The endpoint MUST:

* run server-side
* use runtime = "nodejs"
* use dynamic = "force-dynamic"
* use revalidate = 0
* return Cache-Control: no-store
* support CORS
* use canonical Snowflake public record
* preserve Ed25519 signing
* fail closed

The endpoint MUST NEVER:

* compute governance score
* compute certification
* compute lifecycle
* compute badge eligibility
* compute verification eligibility
* mutate signed payloads
* reconstruct signed payloads from JSON
* expose private workflow data
* expose raw evidence
* expose reviewer notes
* expose AI governance telemetry

---

## CORS REQUIREMENTS

Required headers:

Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Cache-Control: no-store

OPTIONS must be supported.

---

## VERIFICATION VS LIFECYCLE

Verification is independent of lifecycle.

A record may be:

* verified: true AND lifecycleStatus: active
* verified: true AND lifecycleStatus: expired
* verified: true AND lifecycleStatus: revoked

Meaning:

* the record is authentic
* the state of certification may vary

CRITICAL:

Signature proves authenticity.

Lifecycle determines current public governance trust state.

A record can be authentic and still not currently trusted.

Examples:

* active + valid signature = currently trusted certified record
* expired + valid signature = authentic expired record
* revoked + valid signature = authentic revoked record
* missing signature = not verified
* signature mismatch = not verified

---

## BOUNDED VALIDITY MODEL

GAFAIG uses a time-bounded certification lifecycle.

Canonical validity rule:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

VALID_FROM and VALID_TO must originate from Snowflake.

Approved decisions must have:

* VALID_FROM populated
* VALID_TO populated
* one active non-overlapping decision window per CASE_ID

VALID_TO must not be treated as NULL for active records.

---

## VERIFICATION VS ELIGIBILITY

Fields:

* verificationEligible
* badgeEligible

Rules:

* verificationEligible does NOT determine whether the signature is valid
* badgeEligible does NOT determine whether the signature is valid
* a record can be cryptographically authentic even if eligibility flags are false
* eligibility determines display behavior, not authenticity
* eligibility must originate from Snowflake
* eligibility must not be computed externally

---

## VERIFICATION VS CERTIFICATION

Certification:

* a state of the record
* defined by Snowflake
* represents the finalized public governance trust outcome once published

Verification:

* a cryptographic validation
* confirms authenticity of the public certification claim

Relationship:

Certification is the claim.

Verification proves the claim is authentic.

Approval is internal.

Certification is public.

Verification is proof.

---

## CANONICAL MESSAGE SIGNED PAYLOAD

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

* message must be deterministic
* message must not include score, tier, or band
* message must not include raw evidence
* message must not include findings
* message must not include reviewer notes
* message must not include private workflow data
* message must not include governance telemetry
* message must not include AI governance observations
* message must not include AI recommendations
* message must not include simulation state
* message must not include governance timeline state
* message must not expand without versioning

If applicationId or caseId remain in the signed message:

* they are machine-contract fields
* they must not be shown as public UI labels

---

## PROOF OBJECT

The proof object must include:

alg
kid
signature
signedAt
verificationKeyUrl
message
messageString

Verification requires:

* valid Ed25519 signature
* matching kid
* exact messageString

CRITICAL:

messageString is the ONLY valid verification input.

proof.message is informational only.

JSON fields must NEVER be used for verification.

Reconstructed payloads must NEVER be used for verification.

---

## PUBLIC KEY VERIFICATION

Public key endpoint:

/api/.well-known/gafaig-public-key

Public key page:

/public-key

External verification steps:

1. Fetch verify endpoint
2. Extract proof.messageString and proof.signature
3. Extract proof.kid
4. Fetch public key
5. Confirm proof.kid matches public key kid
6. Validate signature using Ed25519

If valid:

Verified = true

If invalid:

Verified = false

---

## SIGNING ALGORITHM

Algorithm:

Ed25519

Proof alg:

Ed25519

Public key alg:

EdDSA

Current kid:

gafaig-ed25519-2026-01

---

## UI / SDK / WIDGET RULES

### UI

UI:

* may display verified state
* must rely on API response
* must not compute verification
* must not reconstruct messageString
* must not verify from JSON fields
* must not expose Application ID as a public governance trust label
* must not expose Case ID as a public governance trust label
* must not expose private governance state publicly

### SDK

SDK:

* must call verify endpoint
* must expose getPublicKey()
* must not compute public governance trust locally
* must not verify from JSON
* must not reconstruct payloads
* must fail closed
* must not override Snowflake/API output

SDKs are part of the governance trust distribution infrastructure.

They function as:

* portable governance verification surfaces
* governance trust distribution surfaces
* external governance trust signaling infrastructure

Current SDK surface:

* gafaig.init()
* gafaig.scan()
* gafaig.verify()
* gafaig.getBadge()
* gafaig.getPublicKey()
* gafaig.badge()
* gafaig.widget()
* gafaig.openVerify()
* gafaig.ensureWidget()
* gafaig.ensureVerifyModal()

### Widgets

Widgets:

* must display verification based on API
* must not embed static public governance trust
* must fail closed on verification failure
* must link to /verify/[registryId]
* must use “Verify This Record” CTA
* must use proof.messageString for cryptographic validation where browser verification is supported

Widgets are part of the governance trust distribution infrastructure.

They function as:

* portable governance verification surfaces
* governance trust distribution surfaces
* external governance trust signaling infrastructure

Widgets must NOT:

* compute public governance trust
* reconstruct payloads
* verify from JSON fields
* trust host page
* override API output

### Badges

Badges:

* must not represent proof
* must link to verification endpoint
* must respect lifecycleStatus
* must respect badgeEligible
* must fail safely when unavailable

Badges are visual public governance trust indicators only.

Proof = verify API.

---

## PUBLIC TERMINOLOGY ALIGNMENT

GAFAIG public surfaces should use:

* Public Certification Registry
* Public Certification Surface
* Public Proof Record
* Verify This Record
* Open Certification Surface
* Open Full Proof Page
* View Proof JSON
* Proof JSON
* Proof API
* Widget Preview
* Public Certification + Cryptographic Verification

Avoid or replace:

* Raw Verification JSON → Proof JSON
* Registry Record → Certification Surface
* Open JSON → View Proof JSON
* Application ID → not displayed publicly
* Case ID → not displayed publicly

---

## FAILURE CONDITIONS

Verification must be false if:

* record not found
* record unpublished
* proof missing
* messageString missing
* signature missing
* signature invalid
* public key unavailable
* public key mismatch
* message tampered
* messageString altered
* payload must be reconstructed to verify
* unexpected signing algorithm
* malformed proof
* malformed key response
* public record unavailable
* unsupported key format

CRITICAL:

System MUST fail closed.

---

## DATE HANDLING

All timestamps must be ISO 8601 strings:

* certifiedAt
* validFrom
* validTo
* publishedAt
* signedAt

Null values remain null.

---

## FIELD NAMING

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

---

## PUBLIC CONTRACT EXCLUSIONS

Verification contract must NOT expose:

* score
* tier
* band
* internal decision workflow
* findings
* evidence
* reviewer notes
* private workflow data
* private key material
* AI governance state
* governance telemetry
* governance risk snapshots
* governance drift events
* remediation tasks
* workflow actions
* governance execution events
* governance approval records
* simulation state
* governance timeline state

Public UI pages must NOT expose:

* Application ID
* Case ID
* private workflow state
* internal scoring state

---

## APPROVAL VS CERTIFICATION

Approval = internal workflow state

Certification = public record state

Verification = cryptographic validation

Approval alone does not create public governance trust.

Certification requires publication to the public registry layer.

Verification proves that the public certification surface is authentic.

---

## RECORD-LEVEL VERIFICATION

Verification applies to a specific record.

Verification does NOT imply:

* entire organization is certified
* all systems are certified
* all future systems are certified
* internal evidence is public
* private scoring has been disclosed
* reviewer notes have been disclosed
* AI governance analysis is public
* governance simulation data is public

The public record defines the scope of verification.

---

## REGISTRY IMMUTABILITY

Registry tables are append-only.

Append-only registry tables:

* CORE.REGISTRY_SNAPSHOTS
* CORE.REGISTRY_AI_SYSTEMS

Do not manually:

* insert
* delete
* update
* mutate published registry snapshots

Canonical publish path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4

Legacy compatibility path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

## SEED DATA RULE

GAFAIG uses one canonical seed file only:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

* do not create additional seed files
* do not split seed logic
* do not mutate registry tables from seed logic
* do not mutate AI governance tables from seed logic

Seed data exists only for:

* testing
* UI loading
* validation
* pipeline smoke tests

Seed data is not production public governance trust data.

---

## VERSIONING

Controlled by:

* kid
* algorithm

Breaking changes include:

* changing signed fields
* changing field order
* changing algorithm
* changing messageString construction
* changing canonical serialization
* changing public contract
* changing lifecycle semantics
* changing public key format

Breaking changes require:

* updated kid
* updated SDK support
* updated widget support
* updated documentation
* backward compatibility review

---

## AI GOVERNANCE RULE

AI governance is advisory only.

AI may:

* observe governance patterns
* recommend improvements
* identify evidence gaps
* support operational governance
* support remediation orchestration
* support governance simulations
* support governance analytics
* support internal governance timelines

AI must NOT:

* assign certification
* assign final score
* assign publication state
* modify signed payloads
* override Snowflake public governance trust outputs
* mutate registry state
* mutate proof state

Canonical rule:

AI suggests.
Humans approve.
Snowflake decides.
Registry publishes.
Proof verifies.

---

## SIMULATION RULE

Governance simulation is operational only.

Simulation may:

* model governance collapse
* model drift escalation
* model trust decay
* model approval delay
* support internal planning
* support internal stress testing

Simulation must NOT:

* mutate certification
* mutate publication
* mutate registry snapshots
* mutate proof state
* affect public governance trust

---

## GOVERNANCE TIMELINE RULE

Governance timeline systems are read-only governance observability systems.

Timeline systems may:

* aggregate events
* support audits
* support dashboards
* support investigation
* support future internal UI timelines

Timeline systems must NEVER:

* certify
* publish
* mutate public governance trust state
* mutate proof state
* expose private records publicly

---

## COMMUNICATION LAYER ARCHITECTURE

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

## PUBLIC ACCOUNTABILITY INFRASTRUCTURE

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

## CURRENT ACTIVE VALUES

Algorithm:

Ed25519

Key ID:

gafaig-ed25519-2026-01

Verify endpoint:

/api/verify/[registryId]

Public key endpoint:

/api/.well-known/gafaig-public-key

SDK:

public/sdk/gafaig.v1.js

Widget:

public/widget/gafaig-widget.v1.js

Canonical publisher:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4

Snowflake public view:

CORE.V_REGISTRY_PUBLIC

---

## TEST RECORD

Example:

gafaig.verify("GAFAIG-00000001").then(console.log)

Expected:

* ok: true
* verified: true
* record present
* proof present
* messageString present
* signature present

---

## CURRENT SYSTEM STATE

Working:

* Verification API locked to deterministic signed payload
* messageString present
* signature present
* verificationKeyUrl present
* public key endpoint operational
* Ed25519 signing validated
* external Node verification passes
* external Python verification passes
* tamper test passes
* registry detail route working
* registry list route hardened
* registry terminology aligned
* proof page terminology aligned
* verify tool terminology aligned
* homepage messaging aligned
* developers page updated with Fast Install
* widget verification language aligned
* widget CTA standardized to “Verify This Record”
* widget browser-side payload verification operational
* public key page available
* developers page includes public key usage
* bounded validity model active
* VALID_FROM / VALID_TO populated for approved records
* DAYS_TO_EXPIRY fixed in renewal view
* public registry view aligned to current bounded validity model
* public pages no longer expose Application ID or Case ID in user-facing pages
* publication enforcement active
* governance intelligence isolated from proof system
* governance simulation isolated from proof system
* governance timeline isolated from proof system
* communication layer architecture
* narrative infrastructure stabilization
* governance trust distribution infrastructure
* public accountability infrastructure
* governance legitimacy infrastructure
* canonical validation runner passed

---

## ACTIVE SYSTEM WORK

Current active work:

* Snowflake rebuild stabilization
* CORE.V_REGISTRY_PUBLIC deep contract validation
* CORE.V_REGISTRY_LATEST_APPROVED validation
* CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC validation
* Explorer query contract revalidation
* Explorer subpage revalidation
* multi-case stress testing
* edge lifecycle testing
* widget fail-closed validation at scale
* SDK failure handling validation at scale
* governance dashboard distribution planning

---

## DO NOT BREAK

Do not:

* compute verification outside API
* remove proof object
* alter messageString post-signing
* reconstruct messageString
* verify from JSON
* expose private key
* rely on UI for public governance trust
* change signed message without contract update
* expose score publicly
* expose governance telemetry publicly
* mutate registry tables manually
* create additional seed files
* show Application ID publicly
* show Case ID publicly
* rename Proof JSON back to Raw Verification JSON
* rename Certification Surface back to Registry Record
* treat widget display as proof without cryptographic validation
* treat badge display as proof

---

## FINAL DEFINITION

Verified = true means:

The GAFAIG certification surface:

* originates from Snowflake
* is publicly published
* is exposed through the public contract
* has a canonical signed payload
* has a valid Ed25519 signature
* can be independently verified using GAFAIG’s public key

If these conditions are met, the record is authentic, tamper-resistant, and independently verifiable.

Lifecycle must still be evaluated separately to determine whether the authentic record is currently:

* active
* expired
* revoked

GAFAIG verification is not a claim.

It is a cryptographic fact.

It is a deterministic public governance trust verification outcome.

END OF FILE
