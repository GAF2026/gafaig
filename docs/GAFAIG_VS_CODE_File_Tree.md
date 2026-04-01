# GAFAIG — GAFAIG_VS_CODE_File_Tree.md
VS Code File Tree + Structural Map
Last Updated: 2026-03-31

---

# 🚨 SYSTEM RULE

This file represents the **authoritative project structure**.

DO NOT:

• Reorganize folders arbitrarily  
• Move core system files  
• Break App Router structure  

All development must respect this structure.

---

# 📁 ROOT PROJECT TREE

gafaig/
├── app/
├── lib/
├── public/
├── styles/
├── docs/
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.local

---

# 📂 APP DIRECTORY (Next.js App Router)

app/

---

## 🌍 PUBLIC PAGES

├── page.tsx
├── mission/
│   └── page.tsx
├── framework/
│   └── page.tsx
├── demo/
│   └── page.tsx

---

## 📊 REGISTRY

├── registry/
│   ├── page.tsx
│   ├── [registryId]/
│   │   └── page.tsx
│   ├── ai-systems/
│   │   ├── page.tsx
│   │   └── [systemId]/
│   │       └── page.tsx

---

## 🔍 EXPLORER

├── explorer/
│   ├── page.tsx
│   ├── countries/
│   │   └── page.tsx
│   ├── organizations/
│   │   └── page.tsx
│   ├── systems/
│   │   └── page.tsx
│   └── map/
│       └── page.tsx

---

## 🖼️ BADGE (SVG ROUTE)

├── badge/
│   └── [registryId]/
│       └── route.ts

---

## 🔐 API ROUTES

app/api/

### Verification

├── verify/
│   └── [registryId]/
│       └── route.ts

---

### Public Key (CRITICAL)

├── .well-known/
│   └── gafaig-public-key/
│       └── route.ts

---

### Admin

├── admin/
│   ├── applications/
│   │   └── route.ts
│   ├── verification/
│   │   ├── findings/
│   │   │   └── route.ts
│   │   ├── evidence/
│   │   │   └── route.ts
│   │   ├── events/
│   │   │   └── route.ts
│   │   ├── decisions/
│   │   │   └── route.ts
│   │   └── publish/
│   │       └── route.ts

---

## 🔐 ADMIN UI

├── admin/
│   ├── login/
│   │   └── page.tsx
│   ├── applications/
│   │   └── page.tsx
│   └── verification/
│       └── [caseId]/
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

---

## 🧩 SHARED COMPONENTS

├── _components/
│   ├── PublicPageHero.tsx
│   ├── PublicButtonLink.tsx
│   └── ...

---

## 📦 REGISTRY COMPONENTS

components/registry/

├── RegistryCertificationSummary.tsx
├── RegistryHeaderPanel.tsx
├── RegistryVerificationPanel.tsx

---

# 📂 LIB DIRECTORY

lib/

---

## ❄️ SNOWFLAKE

├── snowflake.ts

Purpose:

• Snowflake connection  
• Query execution (sfQuery)  

---

## 🧩 QUERY LAYER

lib/queries/

├── registry.ts
├── registry-ai-systems.ts
├── explorer.ts

Purpose:

• All database access  
• Enforced abstraction layer  

---

## 🔐 CRYPTO

lib/crypto/

├── verify-signing.ts

Purpose:

• Ed25519 signing  
• Public/private key handling  
• Signature verification  

---

## 🧰 UTILITIES

├── ids.ts
├── constants/
├── helpers/

---

# 📂 PUBLIC DIRECTORY

public/

Purpose:

• Static assets  
• Images  
• Icons  

---

# 📂 STYLES

styles/

Purpose:

• Global styles  
• Tailwind / CSS  

---

# 📂 DOCS

docs/

├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── CHANGELOG.md
├── PROJECT_INDEX.md
├── UI_COMPONENT_MAPPING.md
├── API_ROUTE_MAPPING.md
├── SNOWFLAKE_WORKSHEET_MAPPING.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md
├── ENGINEERING_RULES.md

---

# 🔗 KEY FILE RELATIONSHIPS

## Verification Flow

lib/crypto/verify-signing.ts  
→ app/api/verify/[registryId]/route.ts  
→ app/api/.well-known/gafaig-public-key/route.ts  

---

## Registry Flow

Snowflake Views  
→ lib/queries/registry.ts  
→ /api/registry  
→ /registry UI  

---

## Badge Flow

V_REGISTRY_PUBLIC  
→ badge route.ts  
→ SVG render  

---

## Explorer Flow

V_REGISTRY_PUBLIC_SEARCH  
→ lib/queries/explorer.ts  
→ /explorer pages  

---

# ⚠️ CRITICAL STRUCTURE RULES

## DO NOT:

• Move API routes out of app/api  
• Rename .well-known folder  
• Break dynamic route structure ([id])  
• Duplicate query logic  

---

## ALWAYS:

• Follow App Router conventions  
• Keep crypto logic in lib/crypto  
• Keep queries in lib/queries  
• Keep UI logic in app/  

---

# 🧠 DESIGN PRINCIPLE

The file tree reflects:

A **layered trust architecture**

NOT:

A typical web app  

---

# 🚀 NEXT FILE WORK

## Verification UX

• Update registry detail page  
• Add verification panel  

---

## Explorer Phase 2

• Enhance explorer pages  
• Add filters and metrics  

---

## Trust Layer

• Align badge + registry + API  

---

# END OF VS CODE FILE TREE