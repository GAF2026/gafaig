# GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md

Last Updated: 2026-05-04

PURPOSE

This file summarizes all active Snowflake SQL files, objects, and execution logic used in GAFAIG (Global Authority for AI Governance). It serves as the canonical reference for Snowflake as the system of truth and execution for the GAFAIG platform.

GAFAIG is a deterministic governance verification system. All scoring, certification, lifecycle state, registry publication, and public trust outputs originate in Snowflake and are exposed through controlled public views.

This update preserves the original file structure and intent while aligning the file to the current bounded-validity lifecycle, registry publish procedure, verification contract, public trust layer state, current public page alignment, and the next Snowflake validation phase.

NON-NEGOTIABLE RULES

Snowflake is the ONLY source of truth
No scoring, certification, lifecycle, or eligibility logic exists outside Snowflake
API, UI, SDK, and widget must NOT compute or override Snowflake outputs
All IDs originate in Snowflake
Published registry snapshots are IMMUTABLE
Registry tables are APPEND-ONLY
Public views are projection layers only
Public trust output must be score-blind unless explicitly exposed through a dedicated public-safe view

All IDs must be generated in Snowflake and passed through unchanged:

APPLICATION_ID
REQUEST_ID
CASE_ID
FINDING_ID
EVIDENCE_ID
EVENT_ID
SNAPSHOT_ID
REGISTRY_SNAPSHOT_ID
REGISTRY_ID

Violation = system corruption

CRITICAL VERIFICATION CONTRACT ENFORCEMENT

messageString MUST be deterministic and stable
Field ordering MUST NEVER change once in use
Timestamp format MUST remain ISO 8601
No conditional omission of fields used in messageString
messageString is the ONLY valid payload for signature verification

Verification MUST NEVER be performed using parsed JSON fields
Verification MUST NEVER be performed using reconstructed payloads
proof.message is informational only and MUST NOT be used for verification
Any change impacting messageString is a cryptographic breaking change and requires versioning

GLOBAL TRUST INVARIANTS

VERIFY API IS THE PROTOCOL CONTRACT

Snowflake output feeds /api/verify, which is the canonical external verification interface.

MESSAGESTRING IS THE ONLY VERIFICATION INPUT

Snowflake output must support deterministic messageString generation.

NEVER VERIFY FROM JSON

JSON fields must not be relied on for cryptographic validation.

DETERMINISTIC PAYLOAD GUARANTEE

Field order must remain stable across:

Snowflake
→ API
→ messageString
→ signature
→ external verifier

SIGNATURE VS LIFECYCLE SEPARATION

Signature = authenticity
Lifecycle = current trust state

A signature may be valid even if a record later expires.
Lifecycle state must be evaluated from Snowflake validity fields.

FAIL-CLOSED SYSTEM

Any verification failure → NOT TRUSTED
Any signature mismatch → NOT TRUSTED
Any missing public key → NOT TRUSTED
Any malformed messageString → NOT TRUSTED

CANONICAL EXECUTION FLOW

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
→ UI / SDK / WIDGET

CRITICAL RUN ORDER FILES

IMMEDIATE BLOCKERS — STEP ZERO

12_TABLES_PARTICIPANTS.sql
15_TABLES_EVENTS.sql

These files:

Break canonical run order if incorrect
Block deterministic rebuilds
Risk silent corruption of downstream workflow tables

These MUST compile cleanly before ANY pipeline execution.

CORE TABLE CREATION FILES

APPLICATION LAYER

11_TABLES_APPLICATIONS.sql

Creates:

CORE.APPLICATIONS

Defines organization-level intake data.

Includes:

APPLICATION_ID
REQUEST_ID
TYPE
STATUS
ORG_NAME
EMAIL
ORG_TYPE
COUNTRY
CREATED_AT
UPDATED_AT

CASE LAYER

13_TABLES_VERIFICATION_CASES.sql

Creates:

CORE.VERIFICATION_CASES

Defines each verification case.

Includes:

CASE_ID
APPLICATION_ID
PARTICIPANT_ID
ORG_ID
ENTITY_NAME
VERIFICATION_TYPE
STATUS
CREATED_AT
UPDATED_AT

PARTICIPANTS LAYER

12_TABLES_PARTICIPANTS.sql

Creates:

CORE.PARTICIPANTS

Status:

Must be validated before rebuild execution.
This remains an immediate blocker before deterministic pipeline execution.

FINDINGS LAYER

14_TABLES_VERIFICATION_FINDINGS.sql or active canonical findings table file

Creates:

CORE.VERIFICATION_FINDINGS

Structured evaluation outputs tied to CASE_ID.

Fields:

FINDING_ID
CASE_ID
CONTROL_ID
CONTROL_TITLE
RESULT
RATIONALE
SEVERITY
EVIDENCE_IDS
CREATED_AT
UPDATED_AT
ORG_ID

EVIDENCE LAYER

14_TABLES_VERIFICATION_EVIDENCE.sql

Creates:

CORE.VERIFICATION_EVIDENCE

Stores supporting materials for findings.

Fields:

EVIDENCE_ID
CASE_ID
EVIDENCE_TYPE
TITLE
DESCRIPTION
SOURCE_URL
STORAGE_REF
SUBMITTED_BY
SUBMITTED_AT
CREATED_AT
UPDATED_AT
ORG_ID

FINDING ↔ EVIDENCE LINK

14_TABLES_VERIFICATION_FINDING_EVIDENCE.sql

Creates:

CORE.VERIFICATION_FINDING_EVIDENCE

Mapping table between findings and evidence.

Fields:

FINDING_ID
EVIDENCE_ID
CASE_ID
CREATED_AT

EVENTS LAYER

15_TABLES_EVENTS.sql

Creates:

CORE.VERIFICATION_EVENTS

Tracks actions, timestamps, workflow transitions, scoring actions, approval actions, publish actions, and audit-relevant events.

Status:

Must be validated before rebuild execution.
This remains an immediate blocker before deterministic pipeline execution.

SCORING SNAPSHOT LAYER

16_TABLES_CASE_SCORE_SNAPSHOTS.sql

Creates:

CORE.CASE_SCORE_SNAPSHOTS

Stores deterministic scoring outputs per case.

Important:

Scores exist internally and must not leak into CORE.V_REGISTRY_PUBLIC.

DECISION LAYER

17_TABLES_DECISIONS.sql

Creates:

CORE.DECISIONS

Final governance decisions.

Current required rules:

CASE_ID must be NOT NULL
Approved decisions must have VALID_FROM
Approved decisions must have VALID_TO
Approved decisions must be time-bounded
Decision windows must not overlap for the same CASE_ID
APPROVE_CASE_V1 must attach SNAPSHOT_ID
APPROVE_CASE_V1 must close overlapping prior decisions

Includes:

DECISION_ID
CASE_ID
APPLICATION_ID
SNAPSHOT_ID
DECISION_STATUS
CERTIFICATION_TIER
CERTIFICATION_BAND
VALID_FROM
VALID_TO
DECISION_NOTES
CREATED_AT

Current lifecycle rule:

Active / valid / publishable =

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

REGISTRY LAYER

18_TABLES_REGISTRY_SNAPSHOTS.sql

Creates:

CORE.REGISTRY_SNAPSHOTS

Canonical public certification publication snapshots.

Includes:

REGISTRY_SNAPSHOT_ID
REGISTRY_ID
CASE_ID
ORG_ID
ENTITY_NAME
VERIFICATION_TYPE
MODEL_VERSION
RENEWAL_STATUS
APPROVED_AT
PUBLISHED_AT
CREATED_AT

Rules:

Append-only
Never manually insert
Never manually delete
Publish procedure owns registry writes

ENTITY TABLES

18_TABLES_REGISTRY_ENTITIES.sql

Creates:

CORE.REGISTRY_ENTITIES

19_TABLES_REGISTRY_AI_SYSTEMS.sql

Creates:

CORE.REGISTRY_AI_SYSTEMS

AI systems registry table must be aligned to CASE_ID and public registry publication through procedure-controlled flow.

CORE VIEWS

PRIMARY PUBLIC VIEW

21_VIEWS_PUBLIC_REGISTRY.sql

Creates:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_LATEST_APPROVED

CORE.V_REGISTRY_PUBLIC is the canonical public contract.

Includes:

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
VISIBILITY_STATUS
VERIFICATION_ELIGIBLE
BADGE_ELIGIBLE
LIFECYCLE_STATUS

Excludes:

score
tier
band
private scoring internals
raw reviewer evidence
internal workflow logic

Critical rules:

Deterministic output required for messageString
Public contract fields must remain stable
Public layer must remain score-blind
Certification status is derived from approved + published + valid state
Do not reference IS_PUBLISHABLE unless CORE.V_CASE_RENEWAL_STATUS explicitly exposes it
Current system should derive publishability from approved + bounded validity

Public UI alignment currently expects:

REGISTRY_ID
ENTITY_NAME
ENTITY_TYPE
COUNTRY
CERTIFICATION_STATUS
CERTIFIED_AT
VALID_FROM
VALID_TO
PUBLISHED_AT
LIFECYCLE_STATUS
RENEWAL_STATUS
VISIBILITY_STATUS
VERIFICATION_ELIGIBLE
BADGE_ELIGIBLE

Public UI must not expose:

APPLICATION_ID
CASE_ID
Internal scoring
Raw findings
Raw evidence
Reviewer workflow
Private decision internals

CASE RENEWAL VIEW

26_VIEWS_CASE_RENEWAL_STATUS.sql

Creates:

CORE.V_CASE_RENEWAL_STATUS

Purpose:

Determines renewal, validity, days-to-expiry, and current validity state by CASE_ID.

Current required outputs:

CASE_ID
DECISION_STATUS
VALID_FROM
VALID_TO
DAYS_TO_EXPIRY
RENEWAL_STATUS
IS_CURRENTLY_VALID

Current required behavior:

One row per CASE_ID
Uses latest canonical decision row
DAYS_TO_EXPIRY must compute from VALID_TO
Active validity must use bounded validity logic

Canonical active rule:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

AI SYSTEMS PUBLIC VIEW

22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Creates:

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Rules:

MUST JOIN on CASE_ID
MUST depend only on public-safe sources
MUST NOT expose score
MUST NOT expose private decision internals
MUST NOT expose raw reviewer evidence

Allowed dependencies:

CORE.V_REGISTRY_PUBLIC
CORE.REGISTRY_AI_SYSTEMS

SUPPORTING VIEWS

CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_GOVERNANCE_SCORE_CASE
CORE.V_SCORE_DIMENSIONS_PUBLIC
CORE.V_FINDING_UNMAPPED_CONTROLS
CORE.V_EXPLORER_STATS

SCORING VIEW

GAFAIG - Governance Scoring (Enterprise v1.2).sql

Creates:

CORE.V_GOVERNANCE_SCORE_CASE
CORE.V_CASE_SCORE_ENTERPRISE
CORE.V_FINDING_RESULT_NORMALIZED
CORE.V_FINDING_UNMAPPED_CONTROLS
CORE.V_CASE_FINDING_AGG_ENTERPRISE
CORE.V_CASE_EVIDENCE_AGG_ENTERPRISE
CORE.V_CASE_EVENT_AGG_ENTERPRISE
CORE.V_SCORE_DIMENSIONS_PUBLIC
CORE.V_PUBLIC_OVERSIGHT_SIGNAL

Rules:

CORE.V_GOVERNANCE_SCORE_CASE is the authoritative score/tier/band source
Score/tier/band must originate from Snowflake only
Cases with no findings must resolve safely
Scoring is private unless explicitly projected through a public-safe contract
Public registry view must not expose score/tier/band

STORED PROCEDURES

APPLICATION INTAKE

CORE.SP_CREATE_APPLICATION or canonical intake procedure

Purpose:

Create application rows through Snowflake-owned write logic.

CASE CREATION

CORE.SP_CREATE_CASE_FROM_APPLICATION

Purpose:

Application → Case

Rules:

CASE_ID generated in Snowflake
APPLICATION_ID passed through unchanged
API must call procedure
API must not insert directly

FINDING CREATION

CORE.SP_CREATE_FINDING

Uses sequence:

CORE.SEQ_FINDING_ID

Purpose:

Create findings through procedure-only workflow.

Maps:

TITLE → CONTROL_TITLE
STATUS → RESULT
CATEGORY → CONTROL_ID

Rules:

Generate FINDING_ID in Snowflake
Insert into CORE.VERIFICATION_FINDINGS
Return canonical OBJECT payload containing findingId and caseId

EVIDENCE CREATION

CORE.SP_CREATE_EVIDENCE

Uses sequence:

CORE.SEQ_EVIDENCE_ID

Purpose:

Create evidence through Snowflake procedure only.

FINDING ↔ EVIDENCE LINK

CORE.SP_LINK_FINDING_EVIDENCE
CORE.SP_UNLINK_FINDING_EVIDENCE

Purpose:

Create and remove finding/evidence links through Snowflake procedure only.

SCORING

CORE.SP_SCORE_CASE_ENTERPRISE

Purpose:

Score one case using CORE.V_GOVERNANCE_SCORE_CASE and write to CORE.CASE_SCORE_SNAPSHOTS.

Rules:

Must read score/tier/band from CORE.V_GOVERNANCE_SCORE_CASE
Must write to CORE.CASE_SCORE_SNAPSHOTS
Must preserve snapshot contract
Must return rowsInserted
Must not compute score outside Snowflake scoring view

Output must flow only into:

CASE_SCORE_SNAPSHOTS
→ DECISIONS
→ REGISTRY_SNAPSHOTS
→ PUBLIC VIEWS

APPROVAL

CORE.APPROVE_CASE_V1
CORE.UNAPPROVE_CASE_V1

Current required behavior:

APPROVE_CASE_V1 requires latest score snapshot
APPROVE_CASE_V1 attaches SNAPSHOT_ID
APPROVE_CASE_V1 creates one-year VALID_FROM / VALID_TO window
APPROVE_CASE_V1 closes active or overlapping prior decision rows
UNAPPROVE_CASE_V1 closes active or overlapping prior decision rows
Decision windows must not overlap for same CASE_ID
CASE_ID must never be NULL

PUBLISH

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Critical owner:

GAFAIG - CORE.REGISTRY_PUBLISH.sql

Purpose:

Publish a case into CORE.REGISTRY_SNAPSHOTS and reuse or assign REGISTRY_ID.

Rules:

ALL registry writes MUST go through this procedure
NEVER manually INSERT into registry tables
NEVER manually DELETE from registry tables
Registry is append-only
Publishability comes from Snowflake lifecycle state
Publish must rely on approved + valid decision state
Publish output must support deterministic messageString generation

Current publishability rule:

DECISION_STATUS = 'APPROVED'
AND CURRENT_TIMESTAMP() BETWEEN VALID_FROM AND VALID_TO

SEED FILE POLICY

Primary and ONLY allowed seed file:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Strict rules:

NEVER create additional seed files
NEVER use archived seed files as active seeds
NEVER split seed logic across files
NEVER insert directly into CORE.REGISTRY_SNAPSHOTS
NEVER insert directly into CORE.REGISTRY_AI_SYSTEMS
NEVER delete from registry tables

Allowed:

Modify master seed file
Expand dataset inside master seed
Add lifecycle realism
Add expired records
Add revoked records
Add near-expiry records
Perform CASE-level cleanup only before publish

Required seed flow:

Insert APPLICATIONS
Create CASES
Insert FINDINGS
Insert EVIDENCE
Link findings ↔ evidence
Insert EVENTS
Run scoring
Create decisions
Call publish procedure

Seed must rely on:

CALL CORE.SP_SCORE_CASE_ENTERPRISE(...)
CALL CORE.APPROVE_CASE_V1(...)
CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(...)

CANONICAL RUN ORDER

Environment setup
Full rebuild
Applications
Participants
Cases
Findings
Evidence
Link findings/evidence
Events
Scoring snapshots
Decisions
Registry snapshots
Registry AI systems
Views
Procedures
Scoring engine
Approval
Publish
Seed
Validation runner

Canonical run order is defined in:

CANONICAL_RUN_ORDER.md

REQUIRED VALIDATION RUNNER

99_RUN_CANONICAL_PIPELINE.sql

Purpose:

Non-destructive canonical smoke test and integrity runner.

Must validate:

Context
Tables
Table shapes
Views
View compile
Procedures
Application query paths
Case query paths
Findings query paths
Evidence query paths
Finding/evidence link query paths
Events query paths
Scoring view
Score snapshots
Decisions
Decision validity
Decision overlap
Registry snapshots
Public registry
Public AI systems view
Explorer stats
Score leakage prevention
Public record counts
Sample registry record for API/UI/widget testing
Canonical pass/fail summary

Must NOT include:

DROP
TRUNCATE
DELETE
INSERT
UPDATE
CREATE OR REPLACE DATABASE
CREATE OR REPLACE SCHEMA

PUBLIC API CONTRACTS

VERIFY ENDPOINT

/app/api/verify/[registryId]/route.ts

Source:

CORE.V_REGISTRY_PUBLIC

Rules:

No computation
No mutation
No lifecycle derivation outside Snowflake
Must return record
Must return proof
Must return messageString
Must sign deterministic messageString
Must expose ISO timestamps
Must use proof.messageString as the canonical signed payload
Must not reconstruct signed payload from parsed JSON fields

REGISTRY ENDPOINT

/app/api/registry/route.ts

Source:

CORE.V_REGISTRY_PUBLIC

Rules:

Projection only
No score computation
No lifecycle recomputation
No certification derivation
Must return public-safe registry fields only
Must support registryId filtering for detail pages

BADGE ENDPOINT

/app/api/badge/[registryId]/route.ts

Source:

CORE.V_REGISTRY_PUBLIC

Rules:

Projection only
No trust computation outside Snowflake
Badge eligibility must derive from public Snowflake output
Must fail closed if record is invalid or unavailable

PUBLIC KEY ENDPOINT

/app/api/.well-known/gafaig-public-key/route.ts

Must expose:

kty: OKP
crv: Ed25519
alg: EdDSA
kid
publicKey
publicKeyPem and/or compatible public key material required by verifier surfaces

EXPLORER ENDPOINT

/app/api/explorer/route.ts

Sources:

CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
CORE.V_EXPLORER_STATS

Rules:

No workflow data
No temporary IDs
No derived trust logic
Must be null-safe
Must fail closed or return controlled empty state

PUBLIC UI CONTRACTS

HOME PAGE

/app/page.tsx

Current state:

Homepage messaging aligned to GAFAIG’s formal identity and public trust positioning.
Eyebrow uses Global Authority for AI Governance.
Hero language emphasizes independently verifiable AI governance, signed certification records, and cryptographic proof.
Why GAFAIG Exists section uses principle-based framing: AI governance must be independently verifiable.

Rules:

No certification computation
No proof verification logic
No Snowflake logic
Display only public-facing positioning and links

REGISTRY LIST

/app/registry/page.tsx

Must:

Read from registry query layer
Display only public view fields
Normalize rows before rendering
Fail gracefully if query fails
Never compute certification
Never expose Application ID
Never expose Case ID

Current public labels:

PUBLIC CERTIFICATION REGISTRY
Verify This Record
Open Certification Record
View Proof JSON

Registry list is the public index of certified records.

REGISTRY DETAIL

/app/registry/[registryId]/page.tsx

Must:

Display public certification record
Link to full proof page
Use registryId unchanged
Never expose Application ID
Never expose Case ID
Never expose workflow internals

Current public labels:

PUBLIC CERTIFICATION RECORD
Verify This Record
Open Full Proof Page
Proof JSON
Widget Preview
Proof API
Certification Record

VERIFY TOOL

/app/verify/page.tsx
/app/verify/VerifyClient.tsx

Must:

Allow entry of registry ID
Load latest certified record example
Display public record proof state
Use exact messageString
Never reconstruct messageString
Verify signature using public key
Differentiate certification record from proof record

Current public labels:

Verify This Record
Open full proof page
View Proof JSON
Open Certification Record
Load latest certified record (example)

VERIFY PROOF PAGE

/app/verify/[registryId]/page.tsx

Must:

Display verification result
Rely on API verify response
Never reconstruct messageString
Validate exact messageString
Expose proof materials
Never expose Application ID
Never expose Case ID

Current public labels:

PUBLIC PROOF RECORD
View Proof JSON
Certification Record
Open Certification Record
Copy Proof JSON

EXPLORER

/app/explorer/page.tsx
/app/explorer/organizations/page.tsx
/app/explorer/countries/page.tsx
/app/explorer/systems/page.tsx

Must:

Use public-safe query layer
Render null-safe data
Never expose workflow internals
Never derive trust state
Must be revalidated after Snowflake public view validation

DEVELOPERS PAGE

/app/developers/page.tsx

Current state:

Developer page includes Fast Install section.
SDK is presented as canonical production integration path.
Advanced widget/modal runtimes are separated from recommended SDK path.
Public Key button uses outlined pill styling.
Developer docs reinforce messageString-only verification.

Must:

Present SDK as canonical integration surface
Recommend versioned SDK files
Explain proof object
Explain failure modes
Never suggest reconstructing payloads
Never expose private governance records

TRUST SURFACE

Widget:

/public/widget/gafaig-widget.v1.js

Rules:

Live trust surface
Reads GAFAIG public verification layer
Independently verifies signed payload in browser
Uses public verification key
No trust assumed from host system
Fail closed on mismatch
Displays unavailable state instead of crashing

Current public labels:

Verify This Record
Open Certification Record
View Proof JSON
Public Certification + Cryptographic Proof
Certified by GAFAIG and independently verifiable using cryptographic proof

SDK:

/public/sdk/gafaig.v1.js

Rules:

External developer trust interface
Must use verify endpoint and messageString
Must fail closed

EXTERNAL VERIFICATION FILES

external-tests/verify-gafaig-node.js
external-tests/verify-gafaig-python.py
external-tests/verify-gafaig-tamper.js

Expected behavior:

Valid payload verifies TRUE
Tampered payload verifies FALSE
Signature validation uses messageString only

CURRENT SYSTEM STATE

Working:

Full Snowflake-controlled pipeline operational
Verification contract enforced
messageString locked
Ed25519 signing validated
Public key endpoint operational
External Node verification passes
External Python verification passes
Tamper test passes
Registry append-only enforced
SP_PUBLISH_CASE_TO_REGISTRY_V3 owns registry writes
Decision lifecycle converted to time-bounded model
CORE.DECISIONS.CASE_ID NOT NULL enforced
Overlapping decisions cleaned
APPROVE_CASE_V1 closes overlapping decisions
VALID_FROM / VALID_TO populated for approved decisions
DAYS_TO_EXPIRY fixed in CORE.V_CASE_RENEWAL_STATUS
CORE.V_REGISTRY_PUBLIC aligned to bounded validity
Public registry detail route working
Public registry list route hardened
Public registry terminology aligned
Public proof page terminology aligned
Public verification tool terminology aligned
Homepage messaging aligned
Developers page includes Fast Install
Widget browser-side verification operational
Widget terminology aligned
SDK layer operational
Public pages reviewed and aligned for certification/proof terminology

Active issues / in progress:

12_TABLES_PARTICIPANTS.sql requires final compile validation
15_TABLES_EVENTS.sql requires final compile validation
Explorer query contract requires revalidation after Snowflake public contract validation
Explorer subpages require revalidation
Multi-case stress testing not complete
Lifecycle edge case testing not complete
Performance optimization not started
Snowflake validation is the immediate next phase

NEXT PHASE

Snowflake validation and private workflow completion.

Primary validation sequence:

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY

Goals:

Validate 12_TABLES_PARTICIPANTS.sql
Validate 15_TABLES_EVENTS.sql
Validate CORE.V_REGISTRY_PUBLIC
Validate CORE.V_REGISTRY_LATEST_APPROVED
Validate CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
Validate scoring snapshots
Validate decision lifecycle
Validate registry snapshot append-only behavior
Validate registry publish procedure
Validate explorer query contract
Validate explorer subpages
Stress test multi-case registry
Test expired records
Test near-expiry records
Test future-valid records
Test revoked records
Validate API consistency
Validate widget fail-closed behavior
Validate SDK failure handling
Complete canonical validation runner usage
Complete private workflow polish

POST-VALIDATION FUTURE PHASE

AI INTELLIGENCE LAYER

AI will be created as a separate Snowflake-backed recommendation system after Snowflake validation is complete.

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

Potential future tables:

CORE.AI_OBSERVATIONS
CORE.AI_RECOMMENDATIONS
CORE.AI_RISK_PATTERNS
CORE.AI_STANDARD_UPDATES
CORE.AI_RECOMMENDATION_REVIEWS

FINAL SYSTEM DEFINITION

Snowflake is:

Governance engine
Certification authority
Registry publisher
Lifecycle authority
Cryptographic payload source

GAFAIG is:

A deterministic AI governance registry
A public trust infrastructure
A certification record system
A cryptographically verifiable protocol
A verifiable global standard

END OF FILE