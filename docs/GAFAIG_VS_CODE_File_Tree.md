# GAFAIG — VS CODE FILE TREE
Canonical Project Structure
Last Updated: 2026-04-03

---

# PURPOSE

This document provides a clean, human-readable representation of:

• the GAFAIG repository structure  
• folder hierarchy  
• key files and their locations  

Use this to:

→ navigate the project quickly  
→ understand where logic lives  
→ avoid duplication or confusion  

---

# ROOT

gafaig/

---

# TOP-LEVEL STRUCTURE

gafaig/
├─ app/
├─ lib/
├─ public/
├─ docs/
├─ .next/                (build output — ignore)
├─ .vercel/              (deployment metadata — ignore)
├─ node_modules/         (dependencies — ignore)
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ .env.local

---

# APP (NEXT.JS APPLICATION)

app/
├─ page.tsx                     → homepage
├─ layout.tsx                   → root layout

---

## GLOBAL COMPONENTS

app/_components/
├─ SiteNav.tsx
├─ SiteFooter.tsx
├─ PublicPageHero.tsx
├─ PublicButtonLink.tsx

---

## API ROUTES

app/api/
├─ registry/
│  ├─ route.ts
│
├─ verify/
│  ├─ [registryId]/
│  │  ├─ route.ts
│
├─ badge/
│  ├─ [registryId]/
│  │  ├─ route.ts
│
├─ .well-known/
│  ├─ gafaig-public-key/
│  │  ├─ route.ts
│
├─ admin/
│  ├─ applications/
│  ├─ verification/
│  │  ├─ [caseId]/
│  │  │  ├─ evidence/
│  │  │  ├─ findings/
│  │  │  ├─ score/
│  │  │  ├─ publish/
│  │  │  ├─ decisions/

---

## REGISTRY

app/registry/
├─ page.tsx                    → registry listing
├─ [registryId]/
│  ├─ page.tsx                → registry detail

---

## EXPLORER

app/explorer/
├─ page.tsx                   → explorer landing
├─ countries/
│  ├─ page.tsx
├─ organizations/
│  ├─ page.tsx
├─ systems/
│  ├─ page.tsx
├─ map/
│  ├─ page.tsx

---

## VERIFY

app/verify/
├─ page.tsx                   → verification guide

---

## CORE PAGES

app/framework/
├─ page.tsx

app/mission/
├─ page.tsx

app/demo/
├─ page.tsx

---

## OPTIONAL / DEV

app/widget-preview/
├─ [registryId]/
│  ├─ page.tsx               → widget testing page

---

# LIB (CORE LOGIC)

lib/
├─ snowflake.ts              → connection + sfQuery
├─ crypto/
│  ├─ verify-signing.ts      → signing logic
│
├─ queries/
│  ├─ registry.ts
│  ├─ explorer.ts
│  ├─ registry-ai-systems.ts

---

# PUBLIC (STATIC ASSETS)

public/
├─ widget/
│  ├─ gafaig-widget.js       → embeddable widget (v1 locked)
│  ├─ gafaig-verify.js       → verify modal script
│
├─ images/
│  ├─ (optional assets)

---

# DOCS (CANONICAL SYSTEM FILES)

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

# KEY FILE RELATIONSHIPS

---

## Registry

app/registry/page.tsx
→ queries V_REGISTRY_PUBLIC
→ displays registry records

app/registry/[registryId]/page.tsx
→ displays single record
→ connects to trust surfaces

---

## Explorer

app/explorer/page.tsx
→ aggregates from V_REGISTRY_PUBLIC

subpages:
→ group data (countries, orgs, systems)

---

## Verify API

app/api/verify/[registryId]/route.ts
→ Snowflake query
→ signed proof generation

---

## Widget

public/widget/gafaig-widget.js
→ calls verify API
→ renders trust surface externally

---

## Signing

lib/crypto/verify-signing.ts
→ generates signature
→ defines alg + kid

---

# DATA FLOW

Snowflake
→ sfQuery (lib/snowflake.ts)
→ API route
→ UI page
→ user

---

# TRUST FLOW

Registry
→ Verify API
→ Signed Proof
→ Public Key
→ Widget / Badge / QR
→ External validation

---

# BUILD + DEPLOYMENT

## Local

npm run dev

---

## Production

git add .
git commit -m "message"
git push origin main

→ Vercel auto deploy

---

# CRITICAL RULES

DO NOT:

• move logic out of Snowflake  
• compute certification in UI/API  
• bypass query layer  

---

ALWAYS:

• use sfQuery  
• rely on V_REGISTRY_PUBLIC  
• maintain deterministic outputs  

---

# STATUS

Project is:

✔ structured  
✔ stable  
✔ production-ready  
✔ externally verifiable  

---

# SUMMARY

This file tree represents:

→ a complete trust infrastructure system  

All components connect back to:

→ Snowflake  
→ canonical registry record  

No exceptions.