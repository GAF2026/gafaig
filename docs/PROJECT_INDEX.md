# GAFAIG — PROJECT INDEX
Repository Map + Execution Guide
Last Updated: 2026-03-24

---

# PURPOSE

This file provides:

• full repository structure  
• file responsibilities  
• system navigation guide  
• execution map across Snowflake, API, and UI  

This is the **entry point for all development**.

---

# REPOSITORY

GitHub:

GAF2026/gafaig

---

# ROOT STRUCTURE

gafaig/
├─ app/
├─ lib/
├─ docs/
├─ public/
├─ .env.local
├─ package.json
├─ next.config.js
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json

---

# APP DIRECTORY (NEXT.JS ROUTES)

app/

---

## PUBLIC ROUTES

app/page.tsx  
Homepage

app/mission/page.tsx  
Mission page

app/framework/page.tsx  
Framework explanation

app/architecture/page.tsx  
Architecture overview

app/demo/page.tsx  
Demo entry

app/demo-script/page.tsx  
Presentation script

---

## REGISTRY

app/registry/page.tsx  
→ Registry list page  
→ consumes getRegistryRecords()

app/registry/[registryId]/page.tsx  
→ Registry detail page  
→ consumes getRegistryByRegistryId()

---

## AI SYSTEMS

app/registry/ai-systems/page.tsx  
→ AI systems listing

app/ai-systems/[systemId]/page.tsx  
→ AI system detail page

---

## EXPLORER

app/explorer/page.tsx  
→ Overview

app/explorer/organizations/page.tsx  
→ Organizations

app/explorer/systems/page.tsx  
→ Systems

---

## ADMIN

app/admin/login/page.tsx  
→ Admin login

app/admin/applications/page.tsx  
→ Intake submissions

app/admin/verification/[caseId]/evidence/page.tsx  
→ Evidence workflow

app/admin/verification/[caseId]/findings/page.tsx  
→ Findings workflow

app/admin/verification/[caseId]/score/page.tsx  
→ Score + publish

---

# API ROUTES

app/api/

---

## PUBLIC API

app/api/registry/route.ts  
→ Registry listing endpoint

app/api/verify/[registryId]/route.ts  
→ Verification endpoint (public proof)

---

## ADMIN API

app/api/admin/login/route.ts  
app/api/admin/logout/route.ts  
app/api/admin/status/route.ts  

app/api/admin/submissions/route.ts  

app/api/admin/verification/findings/route.ts  
app/api/admin/verification/evidence/route.ts  
app/api/admin/verification/[caseId]/summaries/route.ts  

app/api/admin/verification/[caseId]/publish/route.ts  
→ Calls SP_PUBLISH_CASE_TO_REGISTRY

---

# LIB DIRECTORY

lib/

---

## SNOWFLAKE

lib/snowflake.ts  
→ Snowflake connection + query execution

---

## QUERY LAYER (CRITICAL)

lib/queries/

### registry.ts
→ Canonical registry query layer

Functions:

• getRegistryRecords()  
• searchRegistryRecords()  
• getRegistryByRegistryId()  

Purpose:

• single source of truth for registry SQL  
• prevents SQL duplication  
• normalizes Snowflake output  

---

## AUTH

lib/auth/

admin.ts  
→ admin cookie logic

require.ts  
→ requireAdmin() middleware

session.ts  
→ session handling

---

# DOCS DIRECTORY

docs/

---

MASTER_STATE.md  
→ canonical platform definition

CURRENT_FOCUS.md  
→ active execution phase

ENGINEERING_RULES.md  
→ development constraints

PROJECT_INDEX.md  
→ this file

CHANGELOG.md  
→ historical record

ROUTES.md  
→ route documentation

DB_SCHEMA.md  
→ Snowflake schema reference

DEMO_SCRIPT.md  
→ presentation script

ENV_CHECKLIST.md  
→ environment variables

---

# SNOWFLAKE WORKSHEETS (LOGICAL GROUPING)

---

## ENGINE

VERIFICATION_CASES  
VERIFICATION_FINDINGS  
VERIFICATION_EVIDENCE  
VERIFICATION_EVENTS  

CASE_CONTROL_ATTESTATIONS  
SCORING_CONFIG  
SEVERITY_WEIGHTS  

---

## SCORING

V_GOVERNANCE_SCORE_CASE  

---

## REGISTRY

REGISTRY_SNAPSHOTS  
CASE_APPROVAL_LOG  

---

## REGISTRY VIEWS (CRITICAL)

21_VIEWS_PUBLIC_REGISTRY.sql

Creates:

• V_REGISTRY_LATEST_APPROVED  
• V_REGISTRY_PUBLIC  
• V_REGISTRY_EXPORT_V1  

---

## PUBLISH ENGINE

GAFAIG - CORE.REGISTRY_PUBLISH.sql

Contains:

SP_PUBLISH_CASE_TO_REGISTRY_V3

---

# SYSTEM FLOW MAPPING

---

## END-TO-END EXECUTION

CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SNAPSHOT  
→ REGISTRY  
→ VIEW  
→ QUERY  
→ API  
→ UI  

---

## FILE RESPONSIBILITY MAP

---

### Snowflake

21_VIEWS_PUBLIC_REGISTRY.sql  
→ defines registry contract

---

### Query Layer

lib/queries/registry.ts  
→ defines API data structure

---

### API

app/api/registry/route.ts  
→ exposes registry data

---

### UI

app/registry/page.tsx  
→ list view

app/registry/[registryId]/page.tsx  
→ detail view

---

# CRITICAL FILES (DO NOT BREAK)

---

Snowflake:

• V_REGISTRY_PUBLIC  
• V_REGISTRY_LATEST_APPROVED  

---

Query Layer:

• lib/queries/registry.ts  

---

API:

• /api/registry  
• /api/verify  

---

UI:

• /registry  
• /registry/[registryId]  

---

# DEVELOPMENT WORKFLOW

---

## STANDARD LOOP

1. Update Snowflake view  
2. Update query layer  
3. Update API (if needed)  
4. Update UI  
5. Clear .next  
6. Run npm run dev  
7. Test endpoints  

---

## CACHE RESET

Remove-Item -Recurse -Force .next  
npm run dev  

---

# TEST URLS

---

API:

http://localhost:3000/api/registry?caseId=CASE-0001  

---

Registry:

http://localhost:3000/registry  

---

Record:

http://localhost:3000/registry/[registryId]  

---

Verify:

http://localhost:3000/api/verify/[registryId]  

---

# CURRENT PRIORITY

CERTIFICATION WIRING

Focus:

• Snowflake correctness  
• query alignment  
• API stability  
• UI consistency  

---

# NEXT PHASE

After stabilization:

• search layer (V_REGISTRY_PUBLIC_SEARCH)  
• explorer enrichment  
• AI systems linking  
• production optimization  

---

END OF PROJECT INDEX