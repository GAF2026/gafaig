# GAFAIG — VS CODE FILE TREE (CANONICAL) — 2026-04-10

## OVERVIEW
This document defines the complete active VS Code file structure for the GAFAIG platform.

GAFAIG is built using:
- Next.js (App Router)
- TypeScript
- Snowflake (external computation layer)
- Vercel (deployment)

RULE:
This codebase does NOT contain business logic.  
It is a presentation + transport layer only.

All computation lives in Snowflake.

---

## ROOT DIRECTORY

gafaig/
├─ app/                         # Next.js App Router (ALL UI + API routes)
├─ components/                  # Shared UI components
├─ lib/                         # Query layer + utilities
├─ public/                      # Static assets
├─ styles/                      # Global styles
├─ docs/                        # Canonical documentation
├─ .env.local                   # Local environment variables (NOT committed)
├─ next.config.js               # Next.js configuration
├─ package.json                 # Dependencies + scripts
├─ tsconfig.json                # TypeScript configuration
├─ README.md                    # Project overview

---

## APP DIRECTORY (CORE)

app/
├─ layout.tsx                   # Root layout wrapper
├─ page.tsx                     # Homepage

---

## PUBLIC PAGES

app/
├─ mission/page.tsx
├─ framework/page.tsx
├─ verify/page.tsx              # Cryptographic verification page
├─ developers/page.tsx
├─ apply/page.tsx

---

## REGISTRY (PUBLIC TRUST RECORD)

app/registry/
├─ page.tsx                     # Registry list
├─ [registryId]/
│  ├─ page.tsx                  # Registry detail page (CORE TRUST PAGE)
├─ ai-systems/
│  ├─ page.tsx                  # AI systems registry view

---

## EXPLORER (DISCOVERY LAYER)

app/explorer/
├─ page.tsx                     # Explorer overview
├─ organizations/page.tsx
├─ countries/page.tsx
├─ systems/page.tsx

---

## WIDGET PREVIEW

app/widget-preview/
├─ [registryId]/page.tsx        # Badge + embed preview

---

## API ROUTES (THIN LAYER — NO LOGIC)

app/api/

### PUBLIC REGISTRY

├─ registry/
│  ├─ route.ts                 # GET → V_REGISTRY_PUBLIC
│  ├─ search/
│  │  ├─ route.ts             # GET → V_REGISTRY_PUBLIC_SEARCH
│  ├─ [registryId]/
│  │  ├─ score-breakdown/
│  │  │  ├─ route.ts          # GET → V_SCORE_DIMENSIONS_PUBLIC

---

### VERIFICATION

├─ verify/
│  ├─ [registryId]/route.ts   # Signed verification payload

├─ .well-known/
│  ├─ gafaig-public-key/
│  │  ├─ route.ts            # Public Ed25519 key

---

### BADGE

├─ badge/
│  ├─ [registryId]/route.ts  # Badge rendering endpoint

---

## ADMIN (PRIVATE CONTROL LAYER)

app/admin/
├─ login/page.tsx
├─ applications/page.tsx
├─ verification/
│  ├─ [caseId]/
│  │  ├─ findings/page.tsx

---

### ADMIN API

app/api/admin/
├─ verification/
│  ├─ decisions/
│  │  ├─ route.ts            # Inserts certification decisions

---

## COMPONENTS

components/

### REGISTRY COMPONENTS

├─ registry/
│  ├─ RegistryHeaderPanel.tsx
│  ├─ RegistryCertificationSummary.tsx
│  ├─ RegistryVerificationPanel.tsx

---

### UI COMPONENTS

├─ ui/
│  ├─ StatusChip.tsx

---

### SHARED COMPONENTS

app/_components/
├─ PublicButton.tsx
├─ PublicButtonLink.tsx
├─ PublicPageHero.tsx

---

## LIB DIRECTORY (CRITICAL — QUERY LAYER)

lib/

### SNOWFLAKE CONNECTION

├─ snowflake.ts
Purpose:
- Handles Snowflake connection
- Exposes sfQuery()

RULE:
Only entry point to Snowflake

---

### QUERY LAYER

lib/queries/

├─ registry.ts
Purpose:
- Fetch registry list + detail
- Uses V_REGISTRY_PUBLIC

---

├─ explorer.ts
Purpose:
- Explorer aggregations
- Organizations, countries, systems

---

├─ registry-ai-systems.ts
Purpose:
- Fetch AI systems data
- Uses V_REGISTRY_AI_SYSTEMS_PUBLIC

---

├─ score-breakdown.ts
Purpose:
- Fetch governance dimension data
- Uses V_SCORE_DIMENSIONS_PUBLIC

---

## AUTH LAYER

lib/auth/

├─ require.ts
Purpose:
- Protect admin routes
- Validate session cookies

---

## CRYPTO (VERIFICATION)

lib/crypto/

├─ verifySignature.ts
Purpose:
- Verifies Ed25519 signatures using tweetnacl

---

## STYLES

styles/
├─ globals.css

---

## PUBLIC ASSETS

public/
├─ images/
├─ icons/

---

## DOCS (CANONICAL SYSTEM FILES)

docs/

├─ MASTER_STATE.md
├─ CURRENT_FOCUS.md
├─ ENGINEERING_RULES.md
├─ PROJECT_INDEX.md
├─ CHANGELOG.md
├─ GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├─ GAFAIG_VS_CODE_File_Tree.md
├─ API_ROUTE_MAPPING.md
├─ UI_COMPONENT_MAPPING.md

---

## ENVIRONMENT VARIABLES

.env.local (LOCAL ONLY)

Examples:
- GAFAIG_SESSION_SECRET
- GAFAIG_ADMIN_PASSWORD
- SNOWFLAKE_ACCOUNT
- SNOWFLAKE_USER
- SNOWFLAKE_PASSWORD
- SNOWFLAKE_DATABASE
- SNOWFLAKE_SCHEMA
- SNOWFLAKE_WAREHOUSE

RULE:
Never commit this file.

---

## DATA FLOW (END-TO-END)

Snowflake (CORE)
→ lib/queries/*
→ API routes (app/api/*)
→ UI pages (app/*)
→ User

---

## KEY RULES

- No scoring logic in API
- No certification logic in UI
- No direct table access
- Only query Snowflake via lib/queries
- API routes = thin transport only
- UI = display only

---

## CURRENT SYSTEM STATE (2026-04-10)

STABLE:
✔ Registry pages  
✔ Explorer pages  
✔ API routes  
✔ Query layer  
✔ Snowflake connection  
✔ Verification endpoint  
✔ Badge endpoint  

NEW:
✔ Score breakdown API  
✔ Governance dimension layer  
✔ TweetNaCl signature verification  

IN PROGRESS:
- Registry UI trust alignment  
- Explorer UI normalization (5 dimensions)  

---

## FINAL NOTE

This file tree is the **execution layer of GAFAIG**.

It does NOT define truth.

Truth lives in Snowflake.

This layer simply renders it.