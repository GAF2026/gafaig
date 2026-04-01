# GAFAIG — PROJECT_INDEX.md
System Map + File Index
Last Updated: 2026-03-31

---

# 🚨 SYSTEM CONTINUATION INSTRUCTION

This is a CONTINUATION system.

DO NOT:
• Re-architect
• Move logic out of Snowflake
• Introduce duplicate query logic

All work must follow:

Snowflake → Views → Query Layer → API → UI

---

# 🌍 PLATFORM OVERVIEW

GAFAIG = Global Authority for AI Governance

Architecture:

PRIVATE ENGINE (Snowflake)
+
PUBLIC REGISTRY (Next.js + Vercel)

---

# 🧠 EXECUTION FLOW (CANONICAL)

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ SCORE SNAPSHOT  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEW  
→ API  
→ UI  

---

# 📁 ROOT STRUCTURE

gafaig/

├── app/
├── lib/
├── public/
├── styles/
├── docs/
├── package.json
├── next.config.js
├── tsconfig.json
└── .env.local

---

# 📂 APP DIRECTORY (Next.js App Router)

app/

## Public Pages

├── page.tsx                      → Home
├── mission/page.tsx              → Mission
├── framework/page.tsx            → Framework
├── demo/page.tsx                 → Demo
├── registry/page.tsx             → Registry list
├── registry/[registryId]/page.tsx → Registry detail
├── registry/ai-systems/page.tsx  → Systems list
├── registry/ai-systems/[systemId]/page.tsx → System detail

---

## Explorer

├── explorer/page.tsx
├── explorer/countries/page.tsx
├── explorer/organizations/page.tsx
├── explorer/systems/page.tsx
├── explorer/map/page.tsx

---

## Badge Surface

├── badge/[registryId]/route.ts

Purpose:
• Render certification badge (SVG)
• Public trust artifact

---

## API Routes

app/api/

### Verification

├── verify/[registryId]/route.ts

Returns:
• record
• proof (signed message + signature)

---

### Public Key

├── .well-known/gafaig-public-key/route.ts

Returns:
• kid
• publicKeyPem

---

### Admin (partial)

├── admin/

Includes:
• applications
• verification workflows

---

# 📂 LIB DIRECTORY

lib/

## Snowflake

├── snowflake.ts

Purpose:
• Connection handling
• Query execution (sfQuery)

---

## Query Layer

lib/queries/

├── registry.ts
├── registry-ai-systems.ts
├── explorer.ts

Purpose:
• All SQL access
• Enforces separation from API

---

## Crypto

lib/crypto/

├── verify-signing.ts

Purpose:
• Ed25519 signing
• Public/private key handling
• Signature verification helpers

---

## Utilities

├── ids.ts
├── constants/
├── helpers/

---

# 📂 DOCS DIRECTORY

docs/

├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── CHANGELOG.md
├── PROJECT_INDEX.md
├── ENGINEERING_RULES.md
├── API_ROUTE_MAPPING.md
├── SNOWFLAKE_WORKSHEET_MAPPING.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md

Purpose:
• System memory
• Execution continuity

---

# 🧱 SNOWFLAKE OBJECT MAP

Database:

GAFAIG_DB.CORE

---

## Tables

• APPLICATIONS
• VERIFICATION_CASES
• VERIFICATION_FINDINGS
• VERIFICATION_EVIDENCE
• VERIFICATION_FINDING_EVIDENCE
• VERIFICATION_EVENTS
• REGISTRY_SNAPSHOTS

---

## Views

### Core Registry

• V_REGISTRY_LATEST_APPROVED
• V_REGISTRY_PUBLIC
• V_REGISTRY_PUBLIC_SEARCH

---

### AI Systems

• V_REGISTRY_AI_SYSTEMS_PUBLIC

---

### Scoring

• V_GOVERNANCE_SCORE_CASE
• Enterprise scoring views (if enabled)

---

## Stored Procedures

• SP_PUBLISH_CASE_TO_REGISTRY_V3 (or latest)

Purpose:
• Writes registry snapshot
• Assigns registry ID
• Controls publish lifecycle

---

# 🔐 VERIFICATION SYSTEM FILES

## Signing Logic

lib/crypto/verify-signing.ts

---

## Verification Endpoint

app/api/verify/[registryId]/route.ts

---

## Public Key Endpoint

app/api/.well-known/gafaig-public-key/route.ts

---

## Badge Surface

app/badge/[registryId]/route.ts

---

# 🌐 PUBLIC URL MAP

## Registry

• /registry
• /registry/[registryId]

---

## AI Systems

• /registry/ai-systems
• /registry/ai-systems/[systemId]

---

## Explorer

• /explorer
• /explorer/countries
• /explorer/organizations
• /explorer/systems
• /explorer/map

---

## Verification

• /api/verify/[registryId]

---

## Public Key

• /api/.well-known/gafaig-public-key

---

## Badge

• /badge/[registryId]

---

# ⚙️ DEPLOYMENT

## GitHub

Repo:
GAF2026/gafaig

Branch:
main

---

## Vercel

Production:
https://www.gafaig.com

---

## Push Flow

git add .
git commit -m "message"
git push origin main

---

# ⚠️ SYSTEM RULES (ENFORCED)

• Snowflake = source of truth
• No business logic in API/UI
• No mutation of registry snapshots
• No exposure of private evidence
• Query layer must be used for all data access

---

# 🧠 DESIGN PRINCIPLE

GAFAIG is:

A verification system + registry of record

NOT:

• A dashboard
• A scoring tool

---

# 🚀 NEXT EXECUTION TARGET

Verification UX + External Verification Layer

---

# END OF PROJECT INDEX