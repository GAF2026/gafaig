# GAFAIG_VS_CODE_File_Tree.md
Last Updated: 2026-04-28

## PURPOSE
This file documents the current VS Code file structure for the GAFAIG platform. It reflects the active Next.js application, API routes, query layer, crypto layer, SDK/widget surfaces, and documentation files. This file must remain aligned with the actual repository at GAF2026/gafaig and the deployed environment on Vercel.

GAFAIG = Global Authority for AI Governance. GAFAIG is a deterministic Snowflake-executed governance verification system that publishes independently verifiable public certification records.

---

## ROOT STRUCTURE

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

---

## APP DIRECTORY (NEXT.JS APP ROUTER)

app/
├── layout.tsx
├── globals.css
├── page.tsx
├── mission/
│   └── page.tsx
├── framework/
│   └── page.tsx
├── developers/
│   ├── page.tsx
│   ├── LiveEmbedPreview.tsx
│   ├── RegistryIdTester.tsx
│   └── CopyCodeButton.tsx
├── registry/
│   ├── page.tsx
│   ├── ai-systems/
│   │   └── page.tsx
│   └── [registryId]/
│       └── page.tsx
├── explorer/
│   ├── page.tsx
│   ├── organizations/
│   │   └── page.tsx
│   ├── countries/
│   │   └── page.tsx
│   ├── systems/
│   │   └── page.tsx
│   └── map/
│       └── page.tsx
├── verify/
│   ├── page.tsx
│   └── [registryId]/
│       └── page.tsx
├── widget-preview/
│   └── [registryId]/
│       └── page.tsx
├── demo/
│   └── page.tsx
├── certification/
│   ├── page.tsx
│   ├── apply/
│   │   └── page.tsx
│   └── renewal/
│       └── page.tsx
├── apply/
│   ├── page.tsx
│   └── ApplyForm.tsx
├── admin/
│   ├── login/
│   │   └── page.tsx
│   ├── applications/
│   │   ├── page.tsx
│   │   └── [requestId]/
│   │       └── page.tsx
│   └── verification/
│       ├── page.tsx
│       └── [caseId]/
│           ├── page.tsx
│           ├── findings/
│           │   └── page.tsx
│           ├── evidence/
│           │   └── page.tsx
│           ├── score/
│           │   └── page.tsx
│           ├── decisions/
│           │   └── page.tsx
│           └── publish/
│               └── page.tsx
└── api/
    ├── apply/
    │   └── route.ts
    ├── registry/
    │   ├── route.ts
    │   └── search/
    │       └── route.ts
    ├── verify/
    │   └── [registryId]/
    │       └── route.ts
    ├── badge/
    │   └── [registryId]/
    │       └── route.ts
    ├── admin/
    │   ├── applications/
    │   │   ├── route.ts
    │   │   ├── [requestId]/
    │   │   │   └── route.ts
    │   │   ├── convert-to-case/
    │   │   │   └── route.ts
    │   │   ├── start-verification/
    │   │   │   └── route.ts
    │   │   └── status/
    │   │       └── route.ts
    │   ├── verification/
    │   │   ├── route.ts
    │   │   ├── cases/
    │   │   │   └── route.ts
    │   │   ├── findings/
    │   │   │   └── route.ts
    │   │   ├── evidence/
    │   │   │   └── route.ts
    │   │   ├── finding-evidence/
    │   │   │   └── route.ts
    │   │   ├── decisions/
    │   │   │   └── route.ts
    │   │   ├── events/
    │   │   │   └── route.ts
    │   │   ├── status/
    │   │   │   └── route.ts
    │   │   └── [caseId]/
    │   │       ├── route.ts
    │   │       ├── findings/
    │   │       │   └── route.ts
    │   │       ├── evidence/
    │   │       │   └── route.ts
    │   │       ├── score/
    │   │       │   └── route.ts
    │   │       ├── decisions/
    │   │       │   └── route.ts
    │   │       ├── publish/
    │   │       │   └── route.ts
    │   │       └── summaries/
    │   │           └── route.ts
    │   ├── participants/
    │   │   ├── route.ts
    │   │   ├── search/
    │   │   │   └── route.ts
    │   │   └── [participantId]/
    │   │       └── route.ts
    │   ├── submissions/
    │   │   ├── route.ts
    │   │   ├── status/
    │   │   │   └── route.ts
    │   │   └── [requestId]/
    │   │       └── route.ts
    │   ├── login/
    │   │   └── route.ts
    │   ├── logout/
    │   │   └── route.ts
    │   ├── demo-login/
    │   │   └── route.ts
    │   ├── status/
    │   │   └── route.ts
    │   ├── metrics/
    │   │   └── route.ts
    │   └── debug/
    │       └── snowflake/
    │           └── route.ts
    └── .well-known/
        └── gafaig-public-key/
            └── route.ts

---

## SHARED COMPONENTS

app/_components/
├── SiteHeader.tsx
├── SiteFooter.tsx
├── PublicPageHero.tsx
├── PublicButtonLink.tsx
├── PublicButton.tsx

---

## REGISTRY COMPONENTS

components/registry/
├── RegistryHeaderPanel.tsx
├── RegistryCertificationSummary.tsx
├── RegistryVerificationPanel.tsx
├── RegistryBadgePanel.tsx
├── RegistryTrustTools.tsx
├── RegistryAiSystemsSection.tsx
├── RegistryNavigationGraph.tsx
├── AISystemCard.tsx

---

## UI COMPONENTS

components/ui/
├── StatusChip.tsx
├── MonoCodeBlock.tsx

---

## LIB DIRECTORY (LOGIC LAYER)

lib/
├── queries/
│   ├── registry.ts
│   └── explorer.ts
├── crypto/
│   └── verify-signing.ts
├── snowflake.ts
├── auth/
│   └── admin.ts

---

## TYPES

types/
├── registry.ts

Purpose:
Defines all public-facing TypeScript contracts for:
- registry records
- API responses
- verify response shape

Phase 6 requirement:
Must include:
- recordType
- recordName
- lifecycleStatus
- visibilityStatus
- verificationEligible
- badgeEligible

CRITICAL (Phase 6.4 ADDITION):
Must include proof structure:
- proof.messageString
- proof.signature
- proof.verificationKeyUrl

CRITICAL ADDITION:
- proof.messageString is the ONLY valid verification input
- proof.message must NOT be used for verification

---

## PUBLIC ASSETS

public/
├── sdk/
│   ├── gafaig.js
│   └── gafaig.v1.js
├── widget/
│   ├── gafaig-widget.js
│   ├── gafaig-widget.v1.js
│   ├── gafaig-verify.js
│   └── gafaig-verify.v1.js
├── badges/
│   └── (badge assets go here)

---

## SDK

File:
public/sdk/gafaig.js  
public/sdk/gafaig.v1.js

Current version:
v1 (production-stable)

Capabilities:
- verify(registryId)
- render(target, { registryId })
- badge(target, { registryId })
- openVerify(registryId)
- autoInit()
- scan()

HTML attributes:
- data-gafaig-widget
- data-gafaig-badge
- data-gafaig-open-verify

CRITICAL:
Versioned files must be used in production.

CRITICAL ADDITION:
SDK must NEVER:
- verify from JSON fields
- reconstruct payloads
- compute trust independently

---

## CRYPTO LAYER

lib/crypto/verify-signing.ts

Exports:
- signVerificationPayload
- getSigningKeyId
- GAFAIG_VERIFY_ALG

Algorithm:
Ed25519

Used by:
- /api/verify/[registryId]

CRITICAL (Phase 6.4 ADDITION):
Signature must be generated from messageString only.

CRITICAL ADDITION:
- messageString must be deterministic
- signature must NEVER be generated from JSON object

---

## QUERY LAYER

lib/queries/registry.ts

Purpose:
- Query CORE.V_REGISTRY_PUBLIC
- Map Snowflake → API contract

Must:
- Pass through fields exactly
- Not compute trust

Required fields:
- REGISTRY_SNAPSHOT_ID
- RECORD_TYPE
- RECORD_NAME
- VISIBILITY_STATUS
- VERIFICATION_ELIGIBLE
- BADGE_ELIGIBLE
- LIFECYCLE_STATUS

CRITICAL:
Field ordering must remain stable for messageString generation.

---

## API LAYER

### APPLY

app/api/apply/route.ts

Responsibilities:
- Accept public certification intake submissions
- Validate minimal required intake fields
- Call Snowflake procedure for application creation
- Must NOT generate REQUEST_ID or APPLICATION_ID in API
- Must pass through Snowflake-generated IDs

Calls:
- GAFAIG_DB.CORE.SP_CREATE_APPLICATION
- GAFAIG_DB.CORE.SP_CREATE_CASE_FROM_APPLICATION when case creation is enabled in intake flow

CRITICAL:
- Application IDs are generated in Snowflake only
- API must remain pass-through
- No certification logic exists in this route

---

### VERIFY

app/api/verify/[registryId]/route.ts

Responsibilities:
- Fetch record from Snowflake
- Build verification payload
- Generate messageString (deterministic)
- Sign payload using Ed25519
- Return proof

Must:
- Use no-store caching
- Support CORS
- Not compute lifecycle or eligibility

CRITICAL:
- messageString is canonical
- No fallback to reconstructed payload
- No verification from JSON fields

CRITICAL ADDITION:
- /api/verify is the canonical verification protocol contract
- Verification MUST use messageString only
- Any failure MUST result in NOT TRUSTED state

---

### BADGE

app/api/badge/[registryId]/route.ts

Responsibilities:
- Determine badge output
- Use BADGE_ELIGIBLE
- Respect lifecycle

Must:
- Not compute certification logic

---

### REGISTRY

app/api/registry/route.ts  
app/api/registry/search/route.ts

Purpose:
- Provide registry browsing endpoints

---

### PUBLIC KEY

app/api/.well-known/gafaig-public-key/route.ts

Purpose:
- Expose Ed25519 public key

CRITICAL:
This is the ONLY valid key source for verification.

---

## ADMIN API LAYER (PHASE 7 PRIVATE WORKFLOW)

### APPLICATIONS

app/api/admin/applications/route.ts  
app/api/admin/applications/[requestId]/route.ts  
app/api/admin/applications/convert-to-case/route.ts  
app/api/admin/applications/start-verification/route.ts  
app/api/admin/applications/status/route.ts  

Responsibilities:
- Admin application listing
- Admin application detail retrieval
- Application → case conversion
- Verification workflow start
- Status management

Must:
- Use Snowflake as source of truth
- Never generate CASE_ID in API
- Call stored procedures for state transitions where applicable

---

### ADMIN VERIFICATION CASES

app/api/admin/verification/route.ts  
app/api/admin/verification/cases/route.ts  
app/api/admin/verification/[caseId]/route.ts  

Responsibilities:
- List verification cases
- Read case detail
- Provide admin case workflow data

Must:
- Read from Snowflake only
- Not compute certification logic

---

### FINDINGS

app/api/admin/verification/[caseId]/findings/route.ts

Responsibilities:
- GET findings for a specific case
- POST new finding for a specific case

GET maps canonical Snowflake columns:
- FINDING_ID → findingId
- CASE_ID → caseId
- CONTROL_TITLE → title
- SEVERITY → severity
- RESULT → status
- CONTROL_ID → category
- CREATED_AT → createdAt
- UPDATED_AT → updatedAt

POST calls:
- GAFAIG_DB.CORE.SP_CREATE_FINDING

CRITICAL:
- FINDING_ID must be generated in Snowflake only
- API must not use Date.now(), Math.random(), random suffixes, or local IDs
- API must not insert directly into VERIFICATION_FINDINGS when a procedure exists

Current active debugging note:
- Findings count still showing 0 after updating app/admin/verification/[caseId]/page.tsx
- Next chat should verify:
  - GET /api/admin/verification/CASE-20260427-0002/findings
  - Snowflake rows in CORE.VERIFICATION_FINDINGS
  - caseId consistency
  - route being called from the UI

---

### EVIDENCE

app/api/admin/verification/[caseId]/evidence/route.ts

Responsibilities:
- GET evidence for a specific case
- POST evidence for a specific case

POST calls:
- GAFAIG_DB.CORE.SP_CREATE_EVIDENCE

CRITICAL:
- EVIDENCE_ID must be generated in Snowflake only
- No local JSON storage
- No filesystem storage
- No Date.now() or Math.random() IDs

Status:
- Evidence creation working from admin case overview
- Evidence count updates correctly

---

### FINDING ↔ EVIDENCE LINK

app/api/admin/verification/finding-evidence/route.ts

Responsibilities:
- GET finding/evidence links
- POST link between finding and evidence
- DELETE unlink between finding and evidence

Calls:
- GAFAIG_DB.CORE.SP_LINK_FINDING_EVIDENCE
- GAFAIG_DB.CORE.SP_UNLINK_FINDING_EVIDENCE

CRITICAL:
- Links must be stored in CORE.VERIFICATION_FINDING_EVIDENCE
- No local JSON storage
- No filesystem storage
- No API-generated link IDs

Status:
- Linking procedures created and route converted to Snowflake-backed logic
- Linking UI still pending

---

### SCORE

app/api/admin/verification/[caseId]/score/route.ts

Responsibilities:
- Retrieve canonical scoring output for a verification case
- Surface score state to admin UI

Must:
- Use Snowflake scoring output
- Not compute score in API
- Not compute tier/band in UI

---

### DECISIONS

app/api/admin/verification/[caseId]/decisions/route.ts  
app/api/admin/verification/decisions/route.ts  

Responsibilities:
- Read and/or create admin certification decisions
- Feed decision layer before publish

Must:
- Use Snowflake as source of truth
- Not compute lifecycle in API/UI

---

### PUBLISH

app/api/admin/verification/[caseId]/publish/route.ts

Responsibilities:
- Publish approved/certified case to registry snapshot layer

Calls:
- SP_PUBLISH_CASE_TO_REGISTRY_V3 or canonical publish wrapper

Must:
- Never mutate published snapshots
- Only append public registry records
- Keep deterministic public view output

---

## ADMIN UI LAYER (PHASE 7 PRIVATE WORKFLOW)

### ADMIN LOGIN

app/admin/login/page.tsx

Purpose:
- Admin access
- Demo/admin credential path

---

### APPLICATIONS

app/admin/applications/page.tsx  
app/admin/applications/[requestId]/page.tsx  

Purpose:
- View application intake
- Convert application into verification case
- Start verification workflow

Status:
- Application → case conversion working
- Case created: CASE-20260427-0002 during active testing

---

### VERIFICATION QUEUE

app/admin/verification/page.tsx

Purpose:
- View private verification cases
- Navigate to case-specific workflow

---

### CASE OVERVIEW

app/admin/verification/[caseId]/page.tsx

Purpose:
- Display case status
- Display evidence count
- Display findings count
- Display score
- Display decision status
- Navigate to evidence/findings/score/decision/publish
- Trigger test evidence/finding creation during workflow validation

Must call:
- /api/admin/verification/${caseId}/evidence
- /api/admin/verification/${caseId}/findings

Must NOT call legacy endpoint:
- /api/admin/verification/findings?caseId=

Status:
- Evidence button working
- Evidence count updates
- Findings button still showing 0 after update
- Next debug target in next chat

---

### CASE FINDINGS PAGE

app/admin/verification/[caseId]/findings/page.tsx

Purpose:
- Show findings for a specific case
- Manage findings workflow

Must align with:
- app/api/admin/verification/[caseId]/findings/route.ts
- CORE.SP_CREATE_FINDING
- CORE.VERIFICATION_FINDINGS

---

### CASE EVIDENCE PAGE

app/admin/verification/[caseId]/evidence/page.tsx

Purpose:
- Show evidence for a specific case
- Manage evidence workflow

Must align with:
- app/api/admin/verification/[caseId]/evidence/route.ts
- CORE.SP_CREATE_EVIDENCE
- CORE.VERIFICATION_EVIDENCE

---

### CASE SCORE PAGE

app/admin/verification/[caseId]/score/page.tsx

Purpose:
- Show canonical score
- Must not compute score in UI

---

### CASE DECISIONS PAGE

app/admin/verification/[caseId]/decisions/page.tsx

Purpose:
- Manage decision workflow before publish

---

### CASE PUBLISH PAGE

app/admin/verification/[caseId]/publish/page.tsx

Purpose:
- Publish approved/certified cases into public registry surface

---

## PUBLIC PAGES ADDED / UPDATED IN PHASE 11

### CERTIFICATION OVERVIEW

app/certification/page.tsx

Purpose:
- Explain how organizations become independently verifiable
- Route to /apply
- Explain certification lifecycle
- Separate private evidence review from public trust record

---

### APPLY PAGE

app/apply/page.tsx  
app/apply/ApplyForm.tsx

Purpose:
- Public certification intake
- User-facing entry into private GAFAIG verification workflow

Must:
- Submit to /api/apply
- Not generate IDs
- Not publish public registry records
- Make clear that public visibility occurs only after review/certification/publication

Current status:
- Apply page built
- Apply form enhanced with:
  - systemDescription
  - deploymentStage
- Snowflake-owned application ID generation working
- Application → case creation working

---

## STYLES

styles/
- global CSS and layout styling

---

## DOCUMENTATION

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
├── VERIFIED_DEFINITION.md
├── VERSIONING.md

Additional future-required documentation:
├── 99_RUN_CANONICAL_PIPELINE.sql reference note
├── SQL smoke test documentation
├── Snowflake rebuild validation notes

---

## SQL FILES ACTIVE IN VS CODE

Canonical SQL files recently added/updated:

- 24_PROCEDURES_APPLICATION_INTAKE.sql
- 26_PROCEDURES_FINDINGS.sql
- 27_PROCEDURES_EVIDENCE.sql
- 28_PROCEDURES_FINDING_EVIDENCE.sql

Future required:

- 99_RUN_CANONICAL_PIPELINE.sql

Purpose:
- Run all SQL files in deterministic order
- Validate tables, views, procedures, and smoke tests
- Eliminate scratch-pad drift

---

## ENVIRONMENT FILE

.env.local

Contains:
- Snowflake connection config
- NEXT_PUBLIC_BASE_URL
- GAFAIG_DEFAULT_PARTICIPANT_ID

Active participant value used for intake/case creation:
- GAFAIG_DEFAULT_PARTICIPANT_ID=PARTICIPANT-DEMO-0001

CRITICAL:
- This must be a valid PARTICIPANT_ID from CORE.PARTICIPANTS
- Do not use placeholder values
- Do not use REGISTRY_ID as participant ID

---

## DEPLOYMENT

Vercel project:
gafaig-vercel

Production:
https://www.gafaig.com

---

## TEST COMMANDS

Local:
npm run dev  
npm run build  

Browser:
gafaig.version  
gafaig.verify("GAFAIG-00363095").then(console.log)

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

---

## CURRENT STATE

✔ SDK working  
✔ Verify API working  
✔ Snowflake public view updated (Phase 6)  
✔ Developers page upgraded  
✔ Verify page hardened to trust surface  
✔ messageString contract enforced  
✔ Public key verification surfaced  
✔ Failure-state handling implemented  
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

🔴 CURRENT BLOCKER:
- Findings still show 0 in admin case overview after app/admin/verification/[caseId]/page.tsx update
- Continue next chat by verifying:
  1. /api/admin/verification/CASE-20260427-0002/findings response
  2. CORE.VERIFICATION_FINDINGS rows
  3. whether POST is failing silently
  4. whether UI is still loading stale/legacy endpoint

🔴 NEXT:
- Fix findings count / finding insert visibility
- Build linking UI for finding ↔ evidence
- Validate scoring after linked evidence exists
- Continue toward decision → publish pipeline
- Add 99_RUN_CANONICAL_PIPELINE.sql in near future

---

## END STATE

VS Code layer becomes:
- thin projection layer
- no business logic
- no trust computation
- full alignment with Snowflake contract

GAFAIG becomes:
- deterministic system
- verifiable registry
- cryptographic trust layer
- enterprise-ready platform