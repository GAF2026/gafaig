GAFAIG_VS_CODE_File_Tree.md

Last Updated: 2026-05-02

PURPOSE

This file documents the current VS Code file structure for the GAFAIG platform. It reflects the active Next.js application, API routes, query layer, crypto layer, SDK/widget surfaces, external verification tests, Snowflake SQL coordination files, and documentation files.

This file must remain aligned with:

GitHub repo: GAF2026/gafaig
Vercel project: gafaig-vercel
Production domain: https://www.gafaig.com

Snowflake database: GAFAIG_DB
Snowflake schema: CORE

GAFAIG = Global Authority for AI Governance.

GAFAIG is a deterministic Snowflake-executed governance verification system that publishes independently verifiable public certification records.

CORE SYSTEM ENFORCEMENT

GAFAIG enforces:

Snowflake = Source of Truth
API = Pass-through only
UI = Display only
Registry = Append-only
IDs = Generated only in Snowflake

Violation of these rules creates system drift and can corrupt the public trust layer.

REGISTRY IMMUTABILITY RULE

The following registry tables are append-only:

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

Never:

DELETE from registry tables
INSERT into registry tables directly
UPDATE registry tables manually
mutate published registry snapshots

Only allowed registry write path:

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(...)

Registry state must be reset only through the full canonical rebuild process.

SEED FILE RULE

GAFAIG uses exactly ONE canonical seed file only.

Active canonical seed file:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Strict rules:

Do not create additional seed files
Do not split seed logic
Do not create expansion seed files
Do not create parallel seed systems

Seed data exists only to:

test pipeline
populate UI
validate registry / verify / widget / SDK

ROOT STRUCTURE

gafaig/
├── app/
├── components/
├── lib/
├── types/
├── public/
├── docs/
├── external-tests/
├── styles/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md

APP DIRECTORY (NEXT.JS APP ROUTER)

app/

Key updates (CURRENT STATE):

✔ app/page.tsx — Homepage updated locally with conversion-focused messaging and CTA hierarchy
🔴 Deployment blocked due to /explorer build failure
✔ app/certification/page.tsx — Exists but requires conversion optimization rewrite
✔ app/apply/page.tsx — Becomes primary conversion funnel after certification page
✔ Explorer pages present but currently blocked by query contract issue

Structure:

├── layout.tsx
├── globals.css
├── page.tsx
├── mission/
├── framework/
├── developers/
├── public-key/
├── registry/
├── explorer/
│ 🔴 CURRENT BLOCKER — query contract mismatch
├── verify/
├── widget-preview/
├── badge-preview/
├── badge/
├── demo/
├── certification/
│ ├── page.tsx
│ ├── apply/
│ └── renewal/
├── apply/
│ ├── page.tsx
│ └── ApplyForm.tsx
├── admin/
├── api/

HOMEPAGE

app/page.tsx

Current state:

✔ Messaging updated for conversion
✔ CTA hierarchy implemented:

Start Free Certification
Verify a Record
Explore Registry

✔ Dual-sided positioning (organizations + public)
🟡 Local only — NOT deployed

Dependency:

Blocked by Explorer build failure

CERTIFICATION PAGE

app/certification/page.tsx

Purpose:

Explain certification
Drive users to /apply
Explain lifecycle

Current state:

✔ Structurally complete
🟡 Requires conversion optimization rewrite

Next role:

Primary funnel entry page for organizations

APPLY PAGE

app/apply/page.tsx
app/apply/ApplyForm.tsx

Purpose:

Public intake
Start verification workflow

Current state:

✔ Functional
✔ Snowflake-driven ID generation
🟡 Becomes PRIMARY conversion endpoint

Position in funnel:

Homepage → Certification → Apply

EXPLORER (CRITICAL STATE)

app/explorer/

Status:

🔴 BLOCKED

Cause:

lib/queries/explorer.ts contract drift
Missing required exports
Type mismatch

Impact:

Build failure
Prevents Vercel deployment
Breaks public discovery layer

Must:

Be restored before ANY deployment

LIB DIRECTORY

lib/

├── queries/
│ ├── registry.ts
│ └── explorer.ts 🔴 CURRENT FIX REQUIRED
├── crypto/
├── snowflake.ts
├── auth/

EXPLORER QUERY LAYER

lib/queries/explorer.ts

Must export:

getExplorerStats
getLatestExplorerRecords
getExplorerData
getExplorerOrganizations
getExplorerCountries
getExplorerSystems

Current issue:

File was reduced incorrectly
Exports missing
Breaks build

API LAYER

app/api/

Status:

✔ Fully aligned with Snowflake
✔ Pass-through architecture enforced
✔ Verification protocol correct

Explorer API:

app/api/explorer/route.ts

🔴 Must align with restored query layer

SDK + WIDGET

public/sdk/
public/widget/

✔ Fully functional
✔ Externally validated
✔ Fail-closed enforced
✔ messageString verification enforced

CRYPTO LAYER

lib/crypto/verify-signing.ts

✔ Ed25519 signing working
✔ messageString enforced
✔ external verification confirmed

TYPES

types/registry.ts

✔ Public contract defined
✔ Verification proof structure enforced

DOCUMENTATION

docs/

Includes:

MASTER_STATE.md
CURRENT_FOCUS.md
ENGINEERING_RULES.md
GAFAIG_ACTIVE_FILE_MAP.md
GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
GAFAIG_VS_CODE_File_Tree.md
CANONICAL_RUN_ORDER.md
VERIFICATION_SIGNATURE_CONTRACT.md
VERIFIED_DEFINITION.md
VERSIONING.md

SQL FILES

✔ Canonical SQL pipeline established
✔ Registry + decision + renewal aligned
✔ 99_RUN_CANONICAL_PIPELINE.sql created

ENVIRONMENT

.env.local

✔ Snowflake config
✔ Signing keys
✔ participant ID

DEPLOYMENT

Vercel:

gafaig-vercel

Production:

https://www.gafaig.com

Status:

🟡 Deployment blocked due to Explorer

CURRENT STATE SUMMARY

✔ Core system complete
✔ Verification protocol complete
✔ SDK + widget complete
✔ Registry working
✔ Homepage optimized (local)

🔴 Explorer broken (deployment blocker)
🔴 Certification page needs conversion rewrite
🔴 Apply page is next funnel stage
🔴 Findings pipeline requires validation

END STATE

VS Code layer:

thin projection layer
no trust computation
fully aligned with Snowflake

GAFAIG becomes:

verifiable registry
cryptographic trust system
production-ready platform
global AI governance infrastructure

END OF FILE