# GAFAIG — PROJECT INDEX
System Map & File Architecture
Last Updated: 2026-03-29

---

# REPOSITORY

GitHub:
GAF2026/gafaig

Production:
https://www.gafaig.com

Framework:
Next.js (App Router) + TypeScript

---

# ROOT STRUCTURE

gafaig/

├─ app/
├─ lib/
├─ docs/
├─ public/
├─ styles/
├─ middleware.ts
├─ next.config.js
├─ package.json
├─ tsconfig.json

---

# APP DIRECTORY (NEXT.JS ROUTES)

app/

├─ page.tsx                     → Homepage
├─ layout.tsx                   → Global layout

---

## PUBLIC PAGES

├─ mission/page.tsx
├─ framework/page.tsx
├─ demo/page.tsx
├─ demo-script/page.tsx

---

## REGISTRY

├─ registry/
│  ├─ page.tsx                  → Registry list (V_REGISTRY_PUBLIC)
│  ├─ [registryId]/
│  │  └─ page.tsx               → Registry detail
│  ├─ ai-systems/
│  │  ├─ page.tsx               → AI systems list
│  │  └─ [systemId]/
│  │     └─ page.tsx            → AI system detail

---

## EXPLORER

├─ explorer/
│  ├─ page.tsx                  → Explorer overview
│  ├─ organizations/page.tsx
│  ├─ systems/page.tsx
│  ├─ countries/page.tsx
│  └─ map/page.tsx

---

## VERIFY

├─ verify/
│  └─ [registryId]/
│     └─ page.tsx               → Verification UI

---

## BADGE

├─ badge/
│  └─ [registryId]/
│     └─ route.ts               → Badge endpoint

---

## ADMIN

├─ admin/
│  ├─ login/page.tsx
│  ├─ applications/page.tsx
│  └─ verification/
│     └─ [caseId]/
│        ├─ evidence/page.tsx
│        ├─ findings/page.tsx
│        ├─ score/page.tsx
│        └─ publish/page.tsx

---

# API ROUTES

app/api/

---

## REGISTRY API

├─ registry/
│  ├─ route.ts                  → GET registry list
│  ├─ search/route.ts           → Search endpoint
│  └─ [registryId]/
│     └─ ai-systems/route.ts    → Systems by registry

---

## VERIFY API

├─ verify/
│  └─ [registryId]/
│     └─ route.ts               → Signed verification payload

---

## ADMIN API

├─ admin/
│  ├─ login/route.ts
│  ├─ logout/route.ts
│  ├─ status/route.ts
│  └─ verification/
│     ├─ findings/route.ts
│     ├─ events/route.ts
│     ├─ decisions/route.ts
│     └─ evidence/
│        └─ summary/route.ts

---

# COMPONENTS

app/_components/

├─ PublicPageHero.tsx           → Page header
├─ PublicButtonLink.tsx         → Standard button
├─ PublishCertificationButton.tsx
├─ RegistryCard.tsx
├─ ExplorerCard.tsx

RULE:
All UI must remain presentation-only

---

# LIB (CORE LOGIC LAYER)

lib/

---

## SNOWFLAKE

├─ snowflake.ts                 → Connection + execution

---

## QUERY LAYER

lib/queries/

├─ registry.ts
├─ registry-search.ts
├─ registry-ai-systems.ts
├─ explorer.ts

RULE:
Snowflake → Query Layer → API → UI

NO business logic outside Snowflake

---

## AUTH

lib/auth/

├─ require.ts
├─ admin.ts
├─ session.ts

---

# DOCS (CANONICAL SYSTEM MEMORY)

docs/

├─ MASTER_STATE.md
├─ CURRENT_FOCUS.md
├─ CHANGELOG.md
├─ PROJECT_INDEX.md
├─ API_ROUTE_MAPPING.md
├─ UI_COMPONENT_MAPPING.md
├─ SNOWFLAKE_WORKSHEET_MAPPING.md
├─ GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├─ GAFAIG_VS_CODE_File_Tree.md
├─ ENGINEERING_RULES.md

---

# SNOWFLAKE SYSTEM (LOGICAL MAPPING)

Database:
GAFAIG_DB

Schema:
CORE

---

## TABLES

CORE.VERIFICATION_CASES
CORE.VERIFICATION_FINDINGS
CORE.VERIFICATION_EVIDENCE
CORE.VERIFICATION_FINDING_EVIDENCE
CORE.VERIFICATION_EVENTS

CORE.CASE_SCORE_SNAPSHOTS_V2
CORE.DECISIONS

CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

---

## VIEWS

CORE.V_GOVERNANCE_SCORE_CASE
CORE.V_CASE_TIER_BAND

CORE.V_REGISTRY_LATEST_APPROVED
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_PUBLIC_SEARCH
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

---

## PROCEDURES

CORE.SP_SCORE_CASE_ENTERPRISE
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

# EXECUTION FLOW (FILE MAPPING)

Snowflake SQL Files →
→ Tables
→ Views
→ Procedures

↓

lib/queries/*
↓

API routes (app/api/*)

↓

UI pages (app/*)

---

# DEPLOYMENT FLOW

Local:

npm run dev

Production:

git add .
git commit -m "message"
git push origin main

↓

Vercel auto-deploy

---

# CRITICAL RULES

DO NOT:

• add business logic to UI
• compute certification in API
• bypass Snowflake views
• insert directly into registry tables
• create parallel data paths

ALWAYS:

• use Snowflake views as truth
• follow canonical pipeline
• keep append-only model
• use query layer

---

# CURRENT SYSTEM STATE

✔ Engine working
✔ Registry working
✔ Explorer working
✔ Verification working

⚠️ Expansion incomplete
⚠️ Seed system not fully consolidated

---

# PURPOSE OF THIS FILE

This file ensures:

• full system visibility
• no confusion about file roles
• clear mapping from Snowflake → UI
• continuity across development sessions

---