# GAFAIG — PROJECT INDEX
System Map & File Architecture
Last Updated: 2026-03-25

---

# REPOSITORY

GitHub:
GAF2026/gafaig

Production:
https://www.gafaig.com

Deployment:
Vercel (project: gafaig-vercel)

---

# PLATFORM OVERVIEW

GAFAIG is composed of:

1) Snowflake (core engine + registry)
2) Query Layer (controlled access)
3) API Layer (pass-through)
4) Frontend (Next.js UI)

---

# TOP-LEVEL STRUCTURE

gafaig/
├─ app/
├─ components/
├─ lib/
├─ public/
├─ docs/
├─ package.json
├─ tsconfig.json
├─ next.config.js

---

# APP DIRECTORY (NEXT.JS ROUTES)

app/
├─ layout.tsx
├─ page.tsx
├─ mission/page.tsx
├─ framework/page.tsx
├─ demo/page.tsx
├─ explorer/page.tsx
├─ registry/page.tsx
├─ registry/[registryId]/page.tsx
├─ registry/ai-systems/page.tsx
├─ registry/ai-systems/[systemId]/page.tsx

---

# ADMIN ROUTES

app/admin/
├─ login/page.tsx
├─ applications/page.tsx
├─ verification/[caseId]/findings/page.tsx
├─ verification/[caseId]/evidence/page.tsx
├─ verification/[caseId]/score/page.tsx
├─ verification/[caseId]/publish/page.tsx

---

# API ROUTES

app/api/

## PUBLIC

/api/registry  
→ reads CORE.V_REGISTRY_PUBLIC  

/api/registry/search  
→ reads CORE.V_REGISTRY_PUBLIC_SEARCH  

/api/registry/[registryId]  
→ single registry record  

/api/registry/[registryId]/ai-systems  
→ reads CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

/api/verify/[registryId]  
→ verification payload + proof  

/api/badge/[registryId]  
→ certification badge image  

/api/explorer/*  
→ explorer metrics endpoints  

---

## ADMIN

/api/admin/login  
/api/admin/logout  
/api/admin/status  

/api/admin/verification/findings  
/api/admin/verification/evidence  
/api/admin/verification/events  
/api/admin/verification/decisions  

---

# COMPONENTS

components/

## PUBLIC

components/registry/
├─ RegistryVerificationPanel.tsx

app/_components/
├─ PublicPageHero.tsx
├─ PublicPageSection.tsx

---

# QUERY LAYER

lib/queries/

├─ registry.ts
→ registry queries

├─ registry-ai-systems.ts
→ AI systems queries

├─ explorer.ts
→ explorer analytics queries

---

# CORE INFRA

lib/

├─ snowflake.ts
→ connection + query execution

├─ auth/
→ authentication logic

---

# PUBLIC ASSETS

public/

├─ images/
│  ├─ gafaig-lockup.png
│  ├─ gafaig-badge-tier-1.png
│  ├─ gafaig-badge-tier-2.png
│  ├─ gafaig-badge-tier-3.png

---

# DOCS (CANONICAL SYSTEM MEMORY)

docs/

├─ MASTER_STATE.md
→ system architecture

├─ CURRENT_FOCUS.md
→ execution phase

├─ ENGINEERING_RULES.md
→ constraints

├─ PROJECT_INDEX.md
→ this file

├─ CHANGELOG.md
→ history

---

# SNOWFLAKE STRUCTURE

Database:
GAFAIG_DB

Schema:
CORE

Warehouse:
GAFAIG_WH

---

# CORE TABLES

CORE.APPLICATIONS  
CORE.VERIFICATION_CASES  
CORE.VERIFICATION_FINDINGS  
CORE.VERIFICATION_EVIDENCE  
CORE.VERIFICATION_EVENTS  
CORE.DECISIONS  
CORE.REGISTRY_SNAPSHOTS  
CORE.REGISTRY_AI_SYSTEMS  

---

# CORE VIEWS

CORE.V_GOVERNANCE_SCORE_CASE  
→ deterministic scoring engine  

CORE.V_REGISTRY_LATEST_APPROVED  
→ latest snapshot per case  

CORE.V_REGISTRY_PUBLIC  
→ main registry view  

CORE.V_REGISTRY_PUBLIC_SEARCH  
→ search index  

CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  
→ AI systems  

---

# CORE PROCEDURES

GAFAIG - CORE.REGISTRY_PUBLISH.sql

Contains:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4  
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3  

Purpose:

→ publish case into registry  
→ enforce certification logic  

---

# DATA FLOW MAPPING

CASE  
→ CORE.VERIFICATION_CASES  

FINDINGS  
→ CORE.VERIFICATION_FINDINGS  

EVIDENCE  
→ CORE.VERIFICATION_EVIDENCE  

EVENTS  
→ CORE.VERIFICATION_EVENTS  

SCORING  
→ CORE.V_GOVERNANCE_SCORE_CASE  

DECISION  
→ CORE.DECISIONS  

PUBLISH  
→ SP_PUBLISH_CASE_TO_REGISTRY  

SNAPSHOT  
→ CORE.REGISTRY_SNAPSHOTS  

PUBLIC  
→ V_REGISTRY_PUBLIC  

API  
→ /api/registry  

UI  
→ /registry  

---

# IDENTIFIER FLOW

CASE_ID → CASE-0001  
REGISTRY_ID → GAFAIG-XXXXXXXX  

All joins must normalize:

TRIM + UPPER  

---

# DEPLOYMENT FLOW

Local:

npm run dev  

Build:

npm run build  

Deploy:

git push → Vercel  

Project:

gafaig-vercel  

---

# ENVIRONMENT VARIABLES

Used:

NEXT_PUBLIC_SITE_URL  
SNOWFLAKE_ACCOUNT  
SNOWFLAKE_USER  
SNOWFLAKE_PASSWORD  
SNOWFLAKE_DATABASE  
SNOWFLAKE_SCHEMA  
SNOWFLAKE_WAREHOUSE  

---

# SYSTEM CONTRACT

Snowflake → Views → Query Layer → API → UI

No exceptions.

---

# PURPOSE OF THIS FILE

Prevent:

• file confusion  
• incorrect edits  
• broken data flow  
• architectural drift  

---

# END STATE

A fully mapped, deterministic, and globally trusted AI governance system.

---