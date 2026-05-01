GAFAIG_VS_CODE_File_Tree.md

Last Updated: 2026-04-30

PURPOSE

This file documents the current VS Code file structure for the GAFAIG platform. It reflects the active Next.js application, API routes, query layer, crypto layer, SDK/widget surfaces, and documentation files. This file must remain aligned with the actual repository at GAF2026/gafaig and the deployed environment on Vercel.

GAFAIG = Global Authority for AI Governance. GAFAIG is a deterministic Snowflake-executed governance verification system that publishes independently verifiable public certification records.

CORE SYSTEM ENFORCEMENT

GAFAIG enforces:

Snowflake = Source of Truth
API = Pass-through only
UI = Display only
Registry = Append-only
IDs = Generated only in Snowflake

Violation of these rules creates system drift and can corrupt the public trust layer.

REGISTRY IMMUTABILITY RULE

The following tables are append-only:

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

Never:

DELETE from registry tables
INSERT into registry tables directly
UPDATE registry tables manually
mutate published registry snapshots

Only allowed registry write path:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(...)

Registry state must be reset only through the full canonical rebuild process, not through seed-file registry deletes.

SEED FILE RULE

GAFAIG uses exactly ONE canonical seed file only.

Active canonical seed file:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Strict rules:

Do not create additional seed files
Do not split seed logic across multiple files
Do not create expansion seed files
Do not create parallel demo seed files
Do not insert into registry tables from seed logic
Do not delete from registry tables from seed logic

Allowed:

Modify the master seed file
Expand the dataset inside the master seed file
Add lifecycle realism inside the master seed file
Modify canonical files before or after the seed file in run order

Seed data exists only to:

test the pipeline
load public-facing pages during development
validate registry, verify, badge, widget, SDK, and explorer behavior

Seed data is not production data.

ROOT STRUCTURE

gafaig/
├── app/
├── components/
├── lib/
├── types/
├── public/
├── docs/
├── styles/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md

APP DIRECTORY (NEXT.JS APP ROUTER)

app/
├── layout.tsx
├── globals.css
├── page.tsx
├── mission/
│ └── page.tsx
├── framework/
│ └── page.tsx
├── developers/
│ ├── page.tsx
│ ├── LiveEmbedPreview.tsx
│ ├── RegistryIdTester.tsx
│ └── CopyCodeButton.tsx
├── public-key/
│ └── page.tsx
├── registry/
│ ├── page.tsx
│ ├── ai-systems/
│ │ └── page.tsx
│ └── [registryId]/
│ └── page.tsx
├── explorer/
│ ├── page.tsx
│ ├── organizations/
│ │ └── page.tsx
│ ├── countries/
│ │ └── page.tsx
│ ├── systems/
│ │ └── page.tsx
│ └── map/
│ └── page.tsx
├── verify/
│ ├── page.tsx
│ └── [registryId]/
│ └── page.tsx
├── widget-preview/
│ └── [registryId]/
│ └── page.tsx
├── demo/
│ └── page.tsx
├── certification/
│ ├── page.tsx
│ ├── apply/
│ │ └── page.tsx
│ └── renewal/
│ └── page.tsx
├── apply/
│ ├── page.tsx
│ └── ApplyForm.tsx
├── admin/
│ ├── login/
│ │ └── page.tsx
│ ├── applications/
│ │ ├── page.tsx
│ │ └── [requestId]/
│ │ └── page.tsx
│ └── verification/
│ ├── page.tsx
│ └── [caseId]/
│ ├── page.tsx
│ ├── findings/
│ │ └── page.tsx
│ ├── evidence/
│ │ └── page.tsx
│ ├── score/
│ │ └── page.tsx
│ ├── decisions/
│ │ └── page.tsx
│ └── publish/
│ └── page.tsx
└── api/
├── apply/
│ └── route.ts
├── registry/
│ ├── route.ts
│ └── search/
│ └── route.ts
├── verify/
│ └── [registryId]/
│ └── route.ts
├── badge/
│ └── [registryId]/
│ └── route.ts
├── admin/
│ ├── applications/
│ │ ├── route.ts
│ │ ├── [requestId]/
│ │ │ └── route.ts
│ │ ├── convert-to-case/
│ │ │ └── route.ts
│ │ ├── start-verification/
│ │ │ └── route.ts
│ │ └── status/
│ │ └── route.ts
│ ├── verification/
│ │ ├── route.ts
│ │ ├── cases/
│ │ │ └── route.ts
│ │ ├── findings/
│ │ │ └── route.ts
│ │ ├── evidence/
│ │ │ └── route.ts
│ │ ├── finding-evidence/
│ │ │ └── route.ts
│ │ ├── decisions/
│ │ │ └── route.ts
│ │ ├── events/
│ │ │ └── route.ts
│ │ ├── status/
│ │ │ └── route.ts
│ │ └── [caseId]/
│ │ ├── route.ts
│ │ ├── findings/
│ │ │ └── route.ts
│ │ ├── evidence/
│ │ │ └── route.ts
│ │ ├── score/
│ │ │ └── route.ts
│ │ ├── decisions/
│ │ │ └── route.ts
│ │ ├── publish/
│ │ │ └── route.ts
│ │ └── summaries/
│ │ └── route.ts
│ ├── participants/
│ │ ├── route.ts
│ │ ├── search/
│ │ │ └── route.ts
│ │ └── [participantId]/
│ │ └── route.ts
│ ├── submissions/
│ │ ├── route.ts
│ │ ├── status/
│ │ │ └── route.ts
│ │ └── [requestId]/
│ │ └── route.ts
│ ├── login/
│ │ └── route.ts
│ ├── logout/
│ │ └── route.ts
│ ├── demo-login/
│ │ └── route.ts
│ ├── status/
│ │ └── route.ts
│ ├── metrics/
│ │ └── route.ts
│ └── debug/
│ └── snowflake/
│ └── route.ts
└── .well-known/
└── gafaig-public-key/
└── route.ts

SHARED COMPONENTS

app/_components/
├── SiteHeader.tsx
├── SiteFooter.tsx
├── PublicPageHero.tsx
├── PublicButtonLink.tsx
├── PublicButton.tsx

REGISTRY COMPONENTS

components/registry/
├── RegistryHeaderPanel.tsx
├── RegistryCertificationSummary.tsx
├── RegistryVerificationPanel.tsx
├── RegistryBadgePanel.tsx
├── RegistryTrustTools.tsx
├── RegistryAiSystemsSection.tsx
├── RegistryNavigationGraph.tsx
├── AISystemCard.tsx

UI COMPONENTS

components/ui/
├── StatusChip.tsx
├── MonoCodeBlock.tsx

LIB DIRECTORY (LOGIC LAYER)

lib/
├── queries/
│ ├── registry.ts
│ └── explorer.ts
├── crypto/
│ └── verify-signing.ts
├── snowflake.ts
├── auth/
│ └── admin.ts

TYPES

types/
├── registry.ts

Purpose:
Defines all public-facing TypeScript contracts for:

registry records
API responses
verify response shape
badge response shape
public trust fields

Phase 6 requirement:
Must include:

recordType
recordName
lifecycleStatus
visibilityStatus
verificationEligible
badgeEligible

CRITICAL (Phase 6.4 ADDITION):
Must include proof structure:

proof.messageString
proof.signature
proof.verificationKeyUrl

CRITICAL ADDITION:

proof.messageString is the ONLY valid verification input
proof.message must NOT be used for verification
parsed JSON must not be used for signature verification
reconstructed payloads must not be used for signature verification

Current public trust fields include:

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
lifecycleStatus
visibilityStatus
verificationEligible
badgeEligible
renewalStatus
publishedAt
PUBLIC ASSETS

public/
├── sdk/
│ ├── gafaig.js
│ └── gafaig.v1.js
├── widget/
│ ├── gafaig-widget.js
│ ├── gafaig-widget.v1.js
│ ├── gafaig-verify.js
│ └── gafaig-verify.v1.js
├── badges/
│ └── (badge assets go here)

SDK

File:
public/sdk/gafaig.js
public/sdk/gafaig.v1.js

Current version:
v1.3.0 production-stable

Capabilities:

init(options)
scan(options)
verify(registryId)
getBadge(registryId)
getPublicKey(options)
badge(target, { registryId })
widget(target, { registryId })
openVerify(registryId)
ensureWidget(options)
ensureVerifyModal(options)

HTML attributes:

data-gafaig-widget
data-gafaig-badge
data-gafaig-id
data-gafaig-open-verify

CRITICAL:
Versioned files must be used in production.

CRITICAL ADDITION:
SDK must NEVER:

verify from JSON fields
reconstruct payloads
compute trust independently
compute certification status
compute lifecycle status
override Snowflake/API output

Current SDK upgrade:

public/sdk/gafaig.v1.js exposes getPublicKey()
Developers page now shows SDK public key usage
External test confirmed GAFAIG widget works outside gafaig.com
WIDGET

Files:
public/widget/gafaig-widget.js
public/widget/gafaig-widget.v1.js

Current behavior:

Contract-aware
Status-aware
Displays Certified / Expired / Revoked / Unavailable
Displays signature state
Displays payload integrity state
Links trust back to /verify/{registryId}
Uses “Verify This Record” CTA
Fails closed when verification is unavailable

CRITICAL:
Widget is a rendering layer only.

Widget must:

call verify API
display proof status
fail closed
never compute trust independently
never reconstruct payload
never verify from JSON fields

Widget lifecycle fix:

app/widget-preview/[registryId]/page.tsx must call window.GAFAIGWidget.mount()
legacy window.gafaigWidget.init() must not be used
CRYPTO LAYER

lib/crypto/verify-signing.ts

Exports:

signVerificationPayload
getSigningKeyId
GAFAIG_VERIFY_ALG

Algorithm:
Ed25519

Used by:

/api/verify/[registryId]

CRITICAL (Phase 6.4 ADDITION):
Signature must be generated from messageString only.

CRITICAL ADDITION:

messageString must be deterministic
signature must NEVER be generated from JSON object
private key must never be exposed
public key must be exposed only through the public key endpoint
QUERY LAYER

lib/queries/registry.ts

Purpose:

Query CORE.V_REGISTRY_PUBLIC
Map Snowflake → API contract

Must:

Pass through fields exactly
Not compute trust
Not compute lifecycle
Not compute certification
Not compute eligibility

Required fields:

REGISTRY_SNAPSHOT_ID
RECORD_TYPE
RECORD_NAME
VISIBILITY_STATUS
VERIFICATION_ELIGIBLE
BADGE_ELIGIBLE
LIFECYCLE_STATUS

CRITICAL:
Field ordering must remain stable for messageString generation.

Current public registry contract should align with:

CORE.V_REGISTRY_PUBLIC
/api/registry
/api/verify/[registryId]
/api/badge/[registryId]
widget
SDK
verify page
API LAYER
APPLY

app/api/apply/route.ts

Responsibilities:

Accept public certification intake submissions
Validate minimal required intake fields
Call Snowflake procedure for application creation
Must NOT generate REQUEST_ID or APPLICATION_ID in API
Must pass through Snowflake-generated IDs

Calls:

GAFAIG_DB.CORE.SP_CREATE_APPLICATION
GAFAIG_DB.CORE.SP_CREATE_CASE_FROM_APPLICATION when case creation is enabled in intake flow

CRITICAL:

Application IDs are generated in Snowflake only
API must remain pass-through
No certification logic exists in this route
VERIFY

app/api/verify/[registryId]/route.ts

Responsibilities:

Fetch record from Snowflake
Build verification payload
Generate messageString deterministically
Sign payload using Ed25519
Return proof

Must:

Use no-store caching
Support CORS
Not compute lifecycle or eligibility
Not reconstruct payload from JSON
Not use proof.message for verification

CRITICAL:

messageString is canonical
messageString is the only verification input
No fallback to reconstructed payload
No verification from JSON fields

CRITICAL ADDITION:

/api/verify is the canonical verification protocol contract
Verification MUST use messageString only
Any failure MUST result in NOT TRUSTED state

Current status:

Production /api/verify/GAFAIG-00363095 returns ok: true
verified: true
proof.messageString present
proof.signature present
proof.verificationKeyUrl points to https://www.gafaig.com/api/.well-known/gafaig-public-key
BADGE

app/api/badge/[registryId]/route.ts

Responsibilities:

Return badge JSON
Return optional SVG when format=svg
Use BADGE_ELIGIBLE
Respect lifecycle
Link badge to verify page

Must:

Not compute certification logic outside Snowflake contract
Not mutate registry data
Not imply trust if verification/lifecycle fails

Current status:

Production badge endpoint working
Production SVG badge working
imageUrl returns /api/badge/{registryId}?format=svg
Badge links to /verify/{registryId}
REGISTRY

app/api/registry/route.ts
app/api/registry/search/route.ts

Purpose:

Provide registry browsing endpoints
Read from CORE.V_REGISTRY_PUBLIC
Support public registry pages

Must:

Not compute trust
Not compute lifecycle
Not infer certification status
Not expose internal scoring evidence
PUBLIC KEY

app/api/.well-known/gafaig-public-key/route.ts

Purpose:

Expose Ed25519 public key

CRITICAL:
This is the ONLY valid key source for verification.

Public key page:
app/public-key/page.tsx

Purpose:

Human-readable public key explanation
Explain Ed25519
Explain verification loop
Explain messageString rule
Link developers to verification key
ADMIN API LAYER (PHASE 7 PRIVATE WORKFLOW)
APPLICATIONS

app/api/admin/applications/route.ts
app/api/admin/applications/[requestId]/route.ts
app/api/admin/applications/convert-to-case/route.ts
app/api/admin/applications/start-verification/route.ts
app/api/admin/applications/status/route.ts

Responsibilities:

Admin application listing
Admin application detail retrieval
Application → case conversion
Verification workflow start
Status management

Must:

Use Snowflake as source of truth
Never generate CASE_ID in API
Call stored procedures for state transitions where applicable
ADMIN VERIFICATION CASES

app/api/admin/verification/route.ts
app/api/admin/verification/cases/route.ts
app/api/admin/verification/[caseId]/route.ts

Responsibilities:

List verification cases
Read case detail
Provide admin case workflow data

Must:

Read from Snowflake only
Not compute certification logic
FINDINGS

app/api/admin/verification/[caseId]/findings/route.ts

Responsibilities:

GET findings for a specific case
POST new finding for a specific case

GET maps canonical Snowflake columns:

FINDING_ID → findingId
CASE_ID → caseId
CONTROL_TITLE → title
SEVERITY → severity
RESULT → status
CONTROL_ID → category
CREATED_AT → createdAt
UPDATED_AT → updatedAt

POST calls:

GAFAIG_DB.CORE.SP_CREATE_FINDING

CRITICAL:

FINDING_ID must be generated in Snowflake only
API must not use Date.now(), Math.random(), random suffixes, or local IDs
API must not insert directly into VERIFICATION_FINDINGS when a procedure exists

Current active debugging note:

Findings count still showing 0 after updating app/admin/verification/[caseId]/page.tsx
Next chat should verify:
GET /api/admin/verification/CASE-20260427-0002/findings
Snowflake rows in CORE.VERIFICATION_FINDINGS
caseId consistency
route being called from the UI
EVIDENCE

app/api/admin/verification/[caseId]/evidence/route.ts

Responsibilities:

GET evidence for a specific case
POST evidence for a specific case

POST calls:

GAFAIG_DB.CORE.SP_CREATE_EVIDENCE

CRITICAL:

EVIDENCE_ID must be generated in Snowflake only
No local JSON storage
No filesystem storage
No Date.now() or Math.random() IDs

Status:

Evidence creation working from admin case overview
Evidence count updates correctly
FINDING ↔ EVIDENCE LINK

app/api/admin/verification/finding-evidence/route.ts

Responsibilities:

GET finding/evidence links
POST link between finding and evidence
DELETE unlink between finding and evidence

Calls:

GAFAIG_DB.CORE.SP_LINK_FINDING_EVIDENCE
GAFAIG_DB.CORE.SP_UNLINK_FINDING_EVIDENCE

CRITICAL:

Links must be stored in CORE.VERIFICATION_FINDING_EVIDENCE
No local JSON storage
No filesystem storage
No API-generated link IDs

Status:

Linking procedures created and route converted to Snowflake-backed logic
Linking UI still pending
SCORE

app/api/admin/verification/[caseId]/score/route.ts

Responsibilities:

Retrieve canonical scoring output for a verification case
Surface score state to admin UI

Must:

Use Snowflake scoring output
Not compute score in API
Not compute tier/band in UI

Important:

Public registry views must not expose score internals
Public trust layer must not depend on score fields
SCORE leakage into public views must be removed
DECISIONS

app/api/admin/verification/[caseId]/decisions/route.ts
app/api/admin/verification/decisions/route.ts

Responsibilities:

Read and/or create admin certification decisions
Feed decision layer before publish

Must:

Use Snowflake as source of truth
Not compute lifecycle in API/UI
PUBLISH

app/api/admin/verification/[caseId]/publish/route.ts

Responsibilities:

Publish approved/certified case to registry snapshot layer

Calls:

SP_PUBLISH_CASE_TO_REGISTRY_V3 or canonical publish wrapper

Must:

Never mutate published snapshots
Only append public registry records
Keep deterministic public view output
Never insert directly into REGISTRY_SNAPSHOTS
Never insert directly into REGISTRY_AI_SYSTEMS
ADMIN UI LAYER (PHASE 7 PRIVATE WORKFLOW)
ADMIN LOGIN

app/admin/login/page.tsx

Purpose:

Admin access
Demo/admin credential path
APPLICATIONS

app/admin/applications/page.tsx
app/admin/applications/[requestId]/page.tsx

Purpose:

View application intake
Convert application into verification case
Start verification workflow

Status:

Application → case conversion working
Case created: CASE-20260427-0002 during active testing
VERIFICATION QUEUE

app/admin/verification/page.tsx

Purpose:

View private verification cases
Navigate to case-specific workflow
CASE OVERVIEW

app/admin/verification/[caseId]/page.tsx

Purpose:

Display case status
Display evidence count
Display findings count
Display score
Display decision status
Navigate to evidence/findings/score/decision/publish
Trigger test evidence/finding creation during workflow validation

Must call:

/api/admin/verification/${caseId}/evidence
/api/admin/verification/${caseId}/findings

Must NOT call legacy endpoint:

/api/admin/verification/findings?caseId=

Status:

Evidence button working
Evidence count updates
Findings button still showing 0 after update
Next debug target in next chat
CASE FINDINGS PAGE

app/admin/verification/[caseId]/findings/page.tsx

Purpose:

Show findings for a specific case
Manage findings workflow

Must align with:

app/api/admin/verification/[caseId]/findings/route.ts
CORE.SP_CREATE_FINDING
CORE.VERIFICATION_FINDINGS
CASE EVIDENCE PAGE

app/admin/verification/[caseId]/evidence/page.tsx

Purpose:

Show evidence for a specific case
Manage evidence workflow

Must align with:

app/api/admin/verification/[caseId]/evidence/route.ts
CORE.SP_CREATE_EVIDENCE
CORE.VERIFICATION_EVIDENCE
CASE SCORE PAGE

app/admin/verification/[caseId]/score/page.tsx

Purpose:

Show canonical score
Must not compute score in UI
CASE DECISIONS PAGE

app/admin/verification/[caseId]/decisions/page.tsx

Purpose:

Manage decision workflow before publish
CASE PUBLISH PAGE

app/admin/verification/[caseId]/publish/page.tsx

Purpose:

Publish approved/certified cases into public registry surface
PUBLIC PAGES ADDED / UPDATED IN PHASE 11
CERTIFICATION OVERVIEW

app/certification/page.tsx

Purpose:

Explain how organizations become independently verifiable
Route to /apply
Explain certification lifecycle
Separate private evidence review from public trust record
APPLY PAGE

app/apply/page.tsx
app/apply/ApplyForm.tsx

Purpose:

Public certification intake
User-facing entry into private GAFAIG verification workflow

Must:

Submit to /api/apply
Not generate IDs
Not publish public registry records
Make clear that public visibility occurs only after review/certification/publication

Current status:

Apply page built
Apply form enhanced with:
systemDescription
deploymentStage
Snowflake-owned application ID generation working
Application → case creation working
PUBLIC PAGES UPDATED IN PHASE 12 — TRUST SYSTEM COMPLETION
HOMEPAGE

app/page.tsx

Current upgrades:

Hero now positions GAFAIG as a private verification engine + public trust layer
Adds cryptographic verification to AI governance certification
States certified outcomes are backed by signed proof and public key validation
Added VERIFICATION LOOP section:
Verify endpoint
Signed payload
Public key

Purpose:

Explain GAFAIG as a cryptographically verifiable AI governance trust system
Preserve original voice while adding proof/protocol clarity
MISSION PAGE

app/mission/page.tsx

Current upgrades:

Surgical trust language enhancements
Reinforces verified governance without exposing private systems, evidence, or workflows
FRAMEWORK PAGE

app/framework/page.tsx

Current upgrades:

Surgical trust language enhancements
Aligns framework language with private verification engine + public trust layer
DEVELOPERS PAGE

app/developers/page.tsx

Current upgrades:

Added Public Key button to hero actions
Updated SDK examples to use:
gafaig.verify(...)
gafaig.getPublicKey(...)
Expanded public verification explanation
Reinforces messageString as canonical verification input
VERIFY PAGE

app/verify/[registryId]/page.tsx

Current upgrades:

Hardened as canonical proof surface
Legacy blank public record fields removed
Displays current API-backed fields
Links proof, signed payload, and public key
WIDGET PREVIEW PAGE

app/widget-preview/[registryId]/page.tsx

Current upgrades:

Reinitializes widget with window.GAFAIGWidget.mount()
Uses versioned widget script
Aligns CTA language with “Verify This Record”
Supports live preview after back/forward navigation
PUBLIC KEY PAGE

app/public-key/page.tsx

Purpose:

Explain GAFAIG public verification key
Explain Ed25519
Explain exact messageString verification rule
Link developers to public key JSON and verify flow
STYLES

styles/

global CSS and layout styling
DOCUMENTATION

docs/
├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── ENGINEERING_RULES.md
├── GAFAIG_ACTIVE_FILE_MAP.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md
├── CANONICAL_RUN_ORDER.md
├── PAGE_LAYOUT_SYSTEM.md
├── PUBLIC_PAGE_TEMPLATE_MAP.md
├── PUBLIC_PAGE_AUDIT.md
├── VERIFICATION_SIGNATURE_CONTRACT.md
├── VERIFICATION_CONTRACT.md
├── VERIFIED_DEFINITION.md
├── VERSIONING.md

Additional future-required documentation:
├── 99_RUN_CANONICAL_PIPELINE.sql reference note
├── SQL smoke test documentation
├── Snowflake rebuild validation notes

SQL FILES ACTIVE IN VS CODE

Canonical SQL files recently added/updated:

24_PROCEDURES_APPLICATION_INTAKE.sql
26_PROCEDURES_FINDINGS.sql
27_PROCEDURES_EVIDENCE.sql
28_PROCEDURES_FINDING_EVIDENCE.sql
21_VIEWS_PUBLIC_REGISTRY.sql
22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql
01_REBUILD_ENVIRONMENT_CANONICAL.sql

Canonical seed file:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:

single seed file only
no additional seed files
no direct registry writes
no direct registry deletes
registry systems must be owned/aligned by SP_PUBLISH_CASE_TO_REGISTRY_V3

Current Snowflake rebuild note:

01_REBUILD_ENVIRONMENT_CANONICAL.sql has been cleaned of direct SCORE validation references
Remaining SCORE issue is likely inside V_REGISTRY_AI_SYSTEMS_BY_REGISTRY
Next check:
SELECT GET_DDL('VIEW', 'GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY');

Future required:

99_RUN_CANONICAL_PIPELINE.sql

Purpose:

Run all SQL files in deterministic order
Validate tables, views, procedures, and smoke tests
Eliminate scratch-pad drift
ENVIRONMENT FILE

.env.local

Contains:

Snowflake connection config
NEXT_PUBLIC_BASE_URL
GAFAIG_DEFAULT_PARTICIPANT_ID
GAFAIG_SIGNING_PRIVATE_KEY_PEM
GAFAIG_SIGNING_PUBLIC_KEY_PEM
GAFAIG_SIGNING_KEY_ID

Active participant value used for intake/case creation:

GAFAIG_DEFAULT_PARTICIPANT_ID=PARTICIPANT-DEMO-0001

CRITICAL:

This must be a valid PARTICIPANT_ID from CORE.PARTICIPANTS
Do not use placeholder values
Do not use REGISTRY_ID as participant ID
Do not expose private signing key
DEPLOYMENT

Vercel project:
gafaig-vercel

Production:
https://www.gafaig.com

Production routes validated:

https://www.gafaig.com/api/verify/GAFAIG-00363095
https://www.gafaig.com/api/badge/GAFAIG-00363095
https://www.gafaig.com/api/badge/GAFAIG-00363095?format=svg
https://www.gafaig.com/widget-preview/GAFAIG-00363095
https://www.gafaig.com/public-key
https://www.gafaig.com/developers
TEST COMMANDS

Local:
npm run dev
npm run build

Browser:
gafaig.version
gafaig.verify("GAFAIG-00363095").then(console.log)
gafaig.getPublicKey().then(console.log)

Production API:
curl.exe "https://www.gafaig.com/api/verify/GAFAIG-00363095
"
curl.exe "https://www.gafaig.com/api/badge/GAFAIG-00363095
"
curl.exe "https://www.gafaig.com/api/badge/GAFAIG-00363095?format=svg
"
curl.exe "https://www.gafaig.com/api/.well-known/gafaig-public-key
"

External widget test:
Create external index.html with:

<div data-gafaig-id="GAFAIG-00363095"></div> <script src="https://www.gafaig.com/widget/gafaig-widget.v1.js"></script>

Run:
npx serve .

Expected:

widget renders outside gafaig.com
Certified status displays
Signature Valid displays
Payload Integrity Verified displays
Verify This Record links to /verify/GAFAIG-00363095

Admin workflow test:
http://localhost:3000/admin/verification/CASE-20260427-0002

Findings API test:
http://localhost:3000/api/admin/verification/CASE-20260427-0002/findings

Evidence API test:
http://localhost:3000/api/admin/verification/CASE-20260427-0002/evidence

Snowflake verification:
SELECT *
FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
WHERE CASE_ID = 'CASE-20260427-0002'
ORDER BY CREATED_AT DESC;

SELECT *
FROM GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
WHERE CASE_ID = 'CASE-20260427-0002'
ORDER BY CREATED_AT DESC;

Registry validation:
SELECT
CERTIFICATION_STATUS,
LIFECYCLE_STATUS,
VISIBILITY_STATUS,
COUNT(*) AS RECORDS
FROM CORE.V_REGISTRY_PUBLIC
GROUP BY 1,2,3
ORDER BY 1,2,3;

AI systems view validation:
SELECT COUNT(*) AS ai_systems_public_count
FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC;

SELECT GET_DDL('VIEW', 'GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY');

CURRENT STATE

✔ SDK working
✔ SDK upgraded to v1.3.0
✔ SDK getPublicKey helper added
✔ Verify API working
✔ Badge API working
✔ Badge SVG working
✔ Snowflake public view updated
✔ Developers page upgraded
✔ Verify page hardened to trust surface
✔ messageString contract enforced
✔ Public key verification surfaced
✔ Public key page created
✔ Failure-state handling implemented
✔ Widget upgraded to contract-compliant trust states
✔ Widget CTA standardized to “Verify This Record”
✔ Widget external test passed
✔ Homepage trust positioning upgraded
✔ Mission page trust positioning updated
✔ Framework page trust positioning updated
✔ Certification page created
✔ Apply page created
✔ Application intake procedure created
✔ Application → case creation working
✔ Evidence procedure created
✔ Evidence route moved to Snowflake
✔ Evidence button working in admin case overview
✔ Finding procedure corrected to match real schema
✔ Finding route updated to map CONTROL_TITLE / RESULT / CONTROL_ID
✔ Finding/evidence linking procedures created
✔ Finding/evidence route moved away from JSON storage
✔ Registry append-only rule enforced
✔ Direct REGISTRY_SNAPSHOTS seed deletes removed
✔ Direct REGISTRY_AI_SYSTEMS seed inserts/deletes removed
✔ Canonical seed file policy reinforced
✔ AI systems public view aligned to public contract
✔ Rebuild file cleaned of direct legacy scoring validation

🔴 CURRENT BLOCKER:

01_REBUILD_ENVIRONMENT_CANONICAL.sql still fails with invalid identifier SCORE during validation
The rebuild file no longer directly references SCORE
Remaining likely source:
CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY
Continue next chat by running:
SELECT GET_DDL('VIEW', 'GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY');
Search returned DDL for SCORE
Remove score dependency from that view
Keep V_REGISTRY_AI_SYSTEMS_BY_REGISTRY as registry/system grouping only

🔴 PRESERVED ADMIN WORKFLOW BLOCKER:

Findings still show 0 in admin case overview after app/admin/verification/[caseId]/page.tsx update
Continue by verifying:
/api/admin/verification/CASE-20260427-0002/findings response
CORE.VERIFICATION_FINDINGS rows
whether POST is failing silently
whether UI is still loading stale/legacy endpoint

🔴 NEXT:

Fix V_REGISTRY_AI_SYSTEMS_BY_REGISTRY SCORE dependency
Rerun 01_REBUILD_ENVIRONMENT_CANONICAL.sql
Rerun GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql
Validate 14 public registry rows:
12 active certified
1 expired certified
1 revoked certified
Fix findings count / finding insert visibility
Build linking UI for finding ↔ evidence
Validate scoring after linked evidence exists
Continue toward decision → publish pipeline
Add 99_RUN_CANONICAL_PIPELINE.sql in near future
END STATE

VS Code layer becomes:

thin projection layer
no business logic
no trust computation
full alignment with Snowflake contract

Snowflake layer remains:

source of truth
computation engine
registry publisher
lifecycle authority
certification authority

GAFAIG becomes:

deterministic system
verifiable registry
cryptographic trust layer
enterprise-ready platform
public AI governance certification infrastructure