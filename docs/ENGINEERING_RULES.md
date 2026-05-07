# ENGINEERING_RULES.md

Last Updated: 2026-05-07

PURPOSE

This document defines the non-negotiable engineering rules for GAFAIG (Global Authority for AI Governance).

GAFAIG is a deterministic global AI governance infrastructure platform that enables organizations, AI systems, regulators, enterprises, governments, research institutions, universities, laboratories, non-profits, technology providers, and governance stakeholders to manage, evaluate, certify, publish, verify, monitor, observe, and coordinate AI governance outcomes through Snowflake-originated public trust records and cryptographic proof infrastructure.

GAFAIG exists to create deterministic, independently verifiable trust infrastructure for AI governance at global scale.

These rules govern how the system is designed, implemented, modified, extended, validated, deployed, and maintained across:
- Snowflake
- API
- SDK
- UI
- widget
- badge
- public trust surfaces
- governance intelligence layers
- governance simulations
- governance timelines
- governance observability systems
- remediation orchestration systems
- public verification infrastructure

GAFAIG is:
- deterministic governance infrastructure
- public trust infrastructure
- cryptographic verification infrastructure
- governance intelligence infrastructure
- governance observability infrastructure
- governance simulation infrastructure
- publication-controlled certification infrastructure
- global AI governance coordination infrastructure

These rules exist to preserve:
- determinism
- data integrity
- trust integrity
- cryptographic verifiability
- architectural consistency
- publication separation
- registry immutability
- proof integrity
- public trust stability
- AI governance isolation
- governance execution integrity
- governance observability integrity
- governance coordination integrity

Violation of these rules = system corruption.

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

# CORE SYSTEM PRINCIPLE

Snowflake is the ONLY source of truth.

Everything else is a projection.

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

# GLOBAL TRUST INVARIANTS (LOCKED)

These rules override all implementation details.

---

## VERIFY API IS THE PROTOCOL CONTRACT

/api/verify/[registryId]

is the canonical external verification interface.

All trust surfaces depend on this endpoint.

---

## MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Signature validation MUST use:

proof.messageString

exactly.

---

## PROOF.MESSAGE IS INFORMATIONAL ONLY

proof.message exists for:
- readability
- debugging
- developer tooling
- transparency

It is NOT authoritative for verification.

---

## NEVER VERIFY FROM JSON

Verification must NEVER use:
- parsed JSON fields
- reconstructed payloads
- reserialized payloads
- UI-rendered values
- message object reconstruction

Verification MUST use:
- exact proof.messageString
- exact proof.signature

ONLY.

---

## DETERMINISTIC PAYLOAD GUARANTEE

Field order MUST remain stable across:

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
- no mutation allowed
- no reconstruction allowed
- no field reordering allowed
- no reserialization allowed

---

## SIGNATURE VS LIFECYCLE SEPARATION

Signature = authenticity

Lifecycle = current trust state

A signature may remain valid even if lifecycle validity later expires.

---

## FAIL-CLOSED SYSTEM

ANY verification failure
→ NOT TRUSTED

Examples:
- signature mismatch
- missing messageString
- malformed proof
- missing public key
- verification failure
- unpublished record

---

## WIDGETS MUST FAIL CLOSED

Widgets MUST display:
- INVALID
- UNVERIFIED
- UNAVAILABLE
- EXPIRED
- REVOKED

when verification or lifecycle fails.

---

# CANONICAL ARCHITECTURE (LOCKED)

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
- reorder
- bypass
- duplicate
- simulate outside Snowflake
- split authority across layers

---

# DATA AUTHORITY RULE

All authoritative data originates in Snowflake.

Specifically:
- certification status
- lifecycle status
- publication state
- eligibility flags
- registry records
- scoring outputs
- decisions
- proof payload inputs
- governance observability outputs

API, SDK, UI, widgets, badges:

→ MUST ONLY READ AND PASS THROUGH

---

# ID PARITY RULE (CRITICAL)

All IDs must:
- be generated ONLY in Snowflake
- NEVER be generated in API/UI/SDK
- be passed through unchanged

Applies to:
- APPLICATION_ID
- REQUEST_ID
- CASE_ID
- REGISTRY_ID
- REGISTRY_SNAPSHOT_ID
- FINDING_ID
- EVIDENCE_ID
- EVENT_ID
- SNAPSHOT_ID
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

Any mutation = corruption.

---

# NO COMPUTATION OUTSIDE SNOWFLAKE

The following must NEVER be computed outside Snowflake:
- certification status
- lifecycle status
- publication state
- verification eligibility
- badge eligibility
- score
- tier
- band
- governance risk state
- remediation state

API/UI/SDK/widgets must not infer or recompute.

---

# PUBLIC CONTRACT RULE

The public contract is defined ONLY by:

CORE.V_REGISTRY_PUBLIC

Rules:
- API must use this view directly
- no alternate sources
- no reconstructed data
- no synthetic fields

CRITICAL:

This contract is the foundation for messageString generation.

Changes to this contract are cryptographic breaking changes.

Explorer and all public data surfaces must derive strictly from:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED

No private workflow tables.

No score exposure.

No governance telemetry exposure.

---

# VIEW DESIGN RULE

Snowflake views must be:
- projection layers
- deterministic
- non-destructive

Do NOT:
- embed heavy business logic
- duplicate scoring logic
- introduce side effects
- mutate state

CRITICAL:

Views must maintain deterministic field ordering.

Views must NOT reference SCORE or any scoring view in public projections.

---

# SNAPSHOT IMMUTABILITY RULE

CORE.REGISTRY_SNAPSHOTS are immutable.

Once published:
- cannot be updated
- cannot be deleted
- cannot be rewritten

New state → new snapshot.

---

# REGISTRY IMMUTABILITY RULE (CRITICAL)

The following tables are APPEND-ONLY:
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

NEVER:
- DELETE from registry tables
- INSERT into registry tables directly
- UPDATE registry tables manually

ONLY allowed write path:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4(...)

Legacy compatibility:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Violation = system corruption.

---

# PUBLISH RULE

The ONLY valid publish path:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4

Legacy compatibility:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Do NOT:
- insert into REGISTRY_SNAPSHOTS manually
- simulate publish in API
- bypass procedure
- mutate publication in UI

CRITICAL:

Publish output must remain deterministic for signature generation.

---

# SCORING RULE

Scoring must ONLY occur in:

CORE.SP_SCORE_CASE_ENTERPRISE

Output:

CORE.CASE_SCORE_SNAPSHOTS

Do NOT:
- compute scores in API/UI
- expose raw scoring publicly
- expose scoring telemetry publicly

CRITICAL:

Score is PRIVATE and must NEVER appear in:
- public views
- verification payloads
- proof objects
- widget surfaces
- badge surfaces

unless explicitly promoted through a future public-safe contract.

---

# CERTIFICATION RULE

Certification is:
- a Snowflake-derived private state
- a deterministic outcome of scoring and decision logic

Certification is NOT:
- public by default
- visible outside Snowflake unless published

CRITICAL:

Certification alone does NOT create a public record.

Only published certifications appear in the registry.

---

# PUBLICATION RULE (CRITICAL)

Certification and publication are separate states.

Certification:
- determined privately in Snowflake
- part of the verification decision process

Publication:
- explicit
- controlled
- OPTIONAL
- append-only
- visibility-gated

Canonical flow:

CERTIFICATION (PRIVATE STATE)
→ OPTIONAL PUBLICATION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEW
→ API
→ UI
→ VERIFY

Rules:
- no record is public unless published
- no API/UI layer may expose unpublished records
- verification operates ONLY on published records

---

# PUBLIC VISIBILITY ENFORCEMENT

All public views MUST enforce:

WHERE PUBLISHED = TRUE

CRITICAL:

CORE.V_REGISTRY_PUBLIC MUST filter:

WHERE PUBLISHED = TRUE

No unpublished records may exist in:
- public views
- API responses
- UI surfaces
- widgets
- badges
- explorer endpoints

Violation = system corruption.

---

# VERIFICATION RULE

Verification is:
- a cryptographic validation
- tied to a signed payload
- externally reproducible

Verification is NOT:
- a UI state
- a boolean guess
- based on lifecycle alone
- based on eligibility flags alone

---

# SIGNATURE RULE

Verification payload must:
- be signed using Ed25519
- include kid
- include messageString
- be verifiable using public key endpoint

Do NOT:
- alter message after signing
- expose private key
- change signature format without versioning
- reconstruct messageString

CRITICAL:

Signature MUST be generated from messageString ONLY.

---

# MESSAGE CONTRACT RULE

Signed message must:
- be minimal
- be deterministic
- contain only certification assertion fields

Do NOT:
- include score/tier/band
- include internal workflow data
- include findings/evidence
- include governance telemetry
- include AI governance state
- include simulation state

CRITICAL:

Lifecycle and eligibility ARE allowed in the signed message if defined in CORE.V_REGISTRY_PUBLIC.

messageString is canonical and must never be reconstructed.

---

# API RULES

API is a thin layer.

Responsibilities:
- query Snowflake
- normalize field names
- sign payload
- return response

API must NOT:
- compute trust
- compute lifecycle
- compute certification
- compute publication
- generate IDs
- reconstruct signed payloads
- expose private governance state

---

# VERIFY API RULES

Endpoint:

/api/verify/[registryId]

Must:
- return record from Snowflake
- include proof object
- include messageString
- support CORS
- use no-store caching
- preserve deterministic serialization

Must NOT:
- hide expired records
- infer eligibility
- compute certification
- reconstruct signed payloads

CRITICAL:
- verify API is the protocol contract
- verification MUST use messageString only
- failure MUST result in NOT TRUSTED state

---

# BADGE RULES

Badges are visual only.

Rules:
- must respect BADGE_ELIGIBLE
- must respect lifecycle
- must not imply scoring
- must not act as proof

Static badge ≠ trust

SDK badge = live display

Verify endpoint = truth

Badges must:
- fail safely
- link to verification
- never override API truth

---

# SDK RULES

SDK must:
- call API endpoints
- expose convenience methods
- reflect Snowflake truth

SDK must NOT:
- compute trust
- override API results
- store authoritative state
- verify from JSON fields
- reconstruct messageString

SDK must fail closed.

---

# UI RULES

UI is presentation only.

UI may:
- display data
- render status
- provide interaction

UI must NOT:
- compute certification
- compute lifecycle
- infer trust
- mutate data
- reconstruct signed payloads

Public UI must NOT display:
- Application ID
- Case ID
- score
- private workflow state
- governance telemetry

---

# WIDGET RULE

Widgets are rendering layers.

They must:
- call verify API
- display proof
- display lifecycle state
- fail closed
- validate cryptographic proof where supported

They must NOT:
- compute trust
- verify from JSON
- reconstruct messageString

CRITICAL:

Widgets MUST display:
- INVALID
- UNAVAILABLE
- EXPIRED
- REVOKED

when appropriate.

---

# LIFECYCLE RULE

Lifecycle is defined in Snowflake.

Values:
- active
- expired
- revoked

Must NOT be computed elsewhere.

CRITICAL:

Signature proves authenticity.

Lifecycle determines trust state.

---

# ELIGIBILITY RULE

Eligibility fields:
- VERIFICATION_ELIGIBLE
- BADGE_ELIGIBLE

Defined ONLY in Snowflake.

Must not be recomputed elsewhere.

---

# RECORD MODEL RULE

Certification attaches to records.

Record types:
- ORGANIZATION
- AI_SYSTEM
- PORTFOLIO
- USE_CASE
- CERTIFICATION_RECORD

Rules:
- certification is scoped
- no over-claiming trust
- record defines what is verified

---

# NO UI HACKS RULE

Do NOT:
- “fix” data in UI
- override backend inconsistencies
- simulate missing fields
- fabricate trust state

Fix at source (Snowflake).

---

# FILE INTEGRITY RULE

When updating files:
- always request current file if uncertain
- provide COMPLETE file
- do NOT shrink files
- do NOT remove sections unless instructed

CRITICAL:

All updates must be additive or surgical.

NEVER compress or rewrite canonical intent.

---

# LAYOUT SYSTEM RULE

Use:
- PAGE_LAYOUT_SYSTEM.md
- PUBLIC_PAGE_TEMPLATE_MAP.md

Rules:
- preserve structure
- preserve content
- standardize shell only

---

# VERSIONING RULE

All breaking changes must be versioned.

Applies to:
- API
- signature contract
- SDK
- widget
- proof structure

Use:
- new kid for crypto changes
- new endpoint version if needed

CRITICAL:

Changes to messageString structure REQUIRE versioning.

---

# DEPLOYMENT RULE

Deployment via Vercel.

Rules:
- push only tested code
- do not deploy broken builds
- test locally first
- preserve deterministic behavior
- preserve public trust behavior

---

# TESTING RULE

Always validate:

gafaig.verify("GAFAIG-00000001").then(console.log)

CRITICAL:

Verification must use messageString only.

External verification tests must pass:
- Node verification
- Python verification
- tamper verification

---

# SEED DATA RULE (CRITICAL)

GAFAIG must use exactly ONE canonical seed file.

Active file:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:
- only one seed file allowed
- no auxiliary seed files
- all expansion occurs in canonical file
- seed must remain deterministic

Do NOT:
- create additional seed files
- split seed logic
- introduce parallel seeds

Seed exists only for:
- pipeline validation
- public page population
- registry validation
- verification testing

Seed is NOT production data.

---

# AI LAYER RULE (CRITICAL)

GAFAIG includes an AI Intelligence Layer.

AI is NOT part of certification authority.

Core rule:

AI suggests.
Humans approve.
Snowflake decides.
Registry publishes.
Proof verifies.

AI MUST NEVER:
- assign FINAL_SCORE
- assign CERTIFICATION_TIER
- assign CERTIFICATION_BAND
- set DECISION_STATUS
- publish registry records
- modify signed payloads
- override Snowflake outputs
- mutate proof state
- mutate publication state

Violation = system corruption.

---

# AI OUTPUT RULE

AI outputs must be:
- structured
- stored in Snowflake
- separate from certification data

AI tables must NEVER be joined into:
- scoring
- decisions
- registry
- verification payloads
- public proof contracts

unless explicitly promoted through a public-safe contract.

---

# HUMAN REVIEW RULE

All AI outputs require human approval.

Only approved outputs may influence:
- canonical SQL files
- scoring logic
- framework definitions
- governance rules

No automatic system mutation allowed.

---

# GOVERNANCE SIMULATION RULE

Governance simulations are operational only.

Simulation may:
- model governance collapse
- model drift escalation
- model trust decay
- support internal planning
- support stress testing

Simulation must NEVER:
- mutate certification
- mutate publication
- mutate registry snapshots
- mutate proof state
- affect public trust

---

# GOVERNANCE TIMELINE RULE

Governance timeline systems are read-only observability systems.

Timeline systems may:
- aggregate events
- support audits
- support dashboards
- support investigation

Timeline systems must NEVER:
- certify
- publish
- mutate trust state
- mutate proof state
- expose private governance records publicly

---

# GOVERNANCE OBSERVABILITY RULE

Governance observability systems are intelligence visibility layers only.

Observability systems may:
- aggregate governance telemetry
- support remediation visibility
- support governance analytics
- support governance coordination
- support governance dashboards
- support operational monitoring

Observability systems must NEVER:
- certify
- publish
- mutate registry state
- mutate proof state
- recompute trust
- override Snowflake outputs

---

# CURRENT ACTIVE CONTRACT

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

Primary public contract:
CORE.V_REGISTRY_PUBLIC

---

# CURRENT SYSTEM STATE

Working:
- verification API deterministic
- messageString enforced
- public key endpoint operational
- Ed25519 validation operational
- registry trust layer aligned
- homepage aligned
- registry detail aligned
- proof page aligned
- verify tool aligned
- widget terminology aligned
- SDK/widget operational
- bounded lifecycle model active
- publication enforcement active
- no Application ID or Case ID exposed publicly
- governance intelligence isolated from proof
- governance simulation isolated from proof
- governance timeline isolated from proof
- governance observability isolated from proof
- canonical validation runner passed

Active work:
- Snowflake rebuild stabilization
- public registry contract validation
- explorer validation
- multi-case stress testing
- lifecycle edge-case testing
- governance dashboard distribution planning
- governance observability distribution
- governance coordination infrastructure expansion

---

# FINAL RULE

If a change introduces:
- non-determinism
- hidden logic
- duplicate truth
- verification ambiguity
- signature inconsistency
- publication ambiguity
- trust ambiguity
- AI authority leakage

→ REJECT IT.

---

# FINAL LINE

Do not optimize.

Do not simplify.

Preserve truth.

END OF FILE