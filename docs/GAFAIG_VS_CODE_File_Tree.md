# GAFAIG — VS CODE FILE TREE
Canonical Repository Structure
Last Updated: 2026-03-29

---

# PURPOSE

This file provides:

• full VS Code folder + file structure  
• clear mapping of UI, API, and backend layers  
• system-level visibility  

Goal:
→ eliminate confusion  
→ enable fast navigation  
→ maintain architectural clarity  

---

# ROOT

gafaig/

├─ .next/                        (build output — ignore)
├─ .vercel/                      (deployment metadata)

├─ app/                          (Next.js App Router)
├─ lib/                          (query + auth layer)
├─ docs/                         (canonical system memory)
├─ public/                       (static assets)
├─ styles/                       (global styles)

├─ middleware.ts                 (auth protection)
├─ next.config.js
├─ package.json
├─ tsconfig.json

---

# APP DIRECTORY (ROUTES)

app/

├─ layout.tsx
├─ page.tsx                      (homepage)

---

## PUBLIC PAGES

├─ mission/
│  └─ page.tsx

├─ framework/
│  └─ page.tsx

├─ demo/
│  └─ page.tsx

├─ demo-script/
│  └─ page.tsx

---

## REGISTRY

├─ registry/
│  ├─ page.tsx                   (/registry)
│  ├─ [registryId]/
│  │  └─ page.tsx                (/registry/[registryId])
│  ├─ ai-systems/
│  │  ├─ page.tsx                (/registry/ai-systems)
│  │  └─ [systemId]/
│  │     └─ page.tsx             (/registry/ai-systems/[systemId])

---

## EXPLORER

├─ explorer/
│  ├─ page.tsx                   (/explorer)
│  ├─ organizations/
│  │  └─ page.tsx
│  ├─ systems/
│  │  └─ page.tsx
│  ├─ countries/
│  │  └─ page.tsx
│  └─ map/
│     └─ page.tsx

---

## VERIFY

├─ verify/
│  └─ [registryId]/
│     └─ page.tsx                (/verify/[registryId])

---

## BADGE

├─ badge/
│  └─ [registryId]/
│     └─ route.ts                (badge endpoint)

---

## ADMIN

├─ admin/
│  ├─ login/
│  │  └─ page.tsx
│  ├─ applications/
│  │  └─ page.tsx
│  └─ verification/
│     └─ [caseId]/
│        ├─ evidence/
│        │  └─ page.tsx
│        ├─ findings/
│        │  └─ page.tsx
│        ├─ score/
│        │  └─ page.tsx
│        └─ publish/
│           └─ page.tsx

---

# API ROUTES

app/api/

---

## REGISTRY

├─ registry/
│  ├─ route.ts                   (GET list)
│  ├─ search/
│  │  └─ route.ts
│  └─ [registryId]/
│     └─ ai-systems/
│        └─ route.ts

---

## VERIFY

├─ verify/
│  └─ [registryId]/
│     └─ route.ts

---

## ADMIN API

├─ admin/
│  ├─ login/
│  │  └─ route.ts
│  ├─ logout/
│  │  └─ route.ts
│  ├─ status/
│  │  └─ route.ts
│  └─ verification/
│     ├─ findings/
│     │  └─ route.ts
│     ├─ events/
│     │  └─ route.ts
│     ├─ decisions/
│     │  └─ route.ts
│     └─ evidence/
│        └─ summary/
│           └─ route.ts

---

# COMPONENTS

app/_components/

├─ PublicPageHero.tsx
├─ PublicButtonLink.tsx
├─ RegistryCard.tsx
├─ ExplorerCard.tsx
├─ PublishCertificationButton.tsx

---

# LIB DIRECTORY

lib/

---

## SNOWFLAKE

├─ snowflake.ts                  (connection + query execution)

---

## QUERY LAYER

lib/queries/

├─ registry.ts
├─ registry-search.ts
├─ registry-ai-systems.ts
├─ explorer.ts

---

## AUTH

lib/auth/

├─ require.ts
├─ admin.ts
├─ session.ts

---

# DOCS DIRECTORY (CRITICAL)

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

# PUBLIC ASSETS

public/

├─ images/
│  ├─ gafaig-badge-tier-a.png
│  ├─ gafaig-badge-tier-b.png
│  ├─ gafaig-badge-tier-c.png

---

# DATA FLOW (FILE LEVEL)

Snowflake SQL (external)

↓

lib/snowflake.ts

↓

lib/queries/*

↓

app/api/*

↓

app/* (UI pages)

---

# DEPLOYMENT FLOW

Local:

npm run dev

---

Production:

git add .
git commit -m "update"
git push origin main

↓

Vercel auto-deploy

---

# CRITICAL RULES

DO NOT:

• add logic to UI
• compute certification in API
• bypass query layer
• create duplicate data flows

ALWAYS:

• use Snowflake views
• use query layer
• keep UI presentation-only
• maintain clean file structure

---

# CURRENT STATE

✔ Full UI structure in place  
✔ API routes mapped correctly  
✔ Query layer functioning  
✔ Registry + explorer pages live  

⚠️ Multi-case expansion incomplete  
⚠️ Seed system consolidation pending  

---

# PURPOSE OF THIS FILE

Ensures:

• complete file visibility  
• fast navigation in VS Code  
• correct mapping between layers  
• continuity across development sessions  

---