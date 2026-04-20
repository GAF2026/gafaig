# GAFAIG_VS_CODE_File_Tree.md — Last Updated: 2026-04-19

## PURPOSE

This document defines the canonical VS Code file structure for the GAFAIG platform.

It ensures:
- Clean separation of concerns
- Deterministic alignment with Snowflake (source of truth)
- Zero architectural drift
- Consistent developer workflow
- Strict enforcement of UI/API/DB boundaries

This document is a **control surface**, not a reference note.

---

## CORE ARCHITECTURE PRINCIPLE

GAFAIG is a deterministic system.

Data flow is strictly:

Snowflake → Views → Query Layer → API → UI

NOT:
- UI → API → Logic
- API → Computation
- UI → Derived state

No logic is allowed outside Snowflake.

---

## ROOT PROJECT STRUCTURE

gafaig/
├── app/                     # Next.js App Router (UI + API)
├── components/              # Feature-level UI components
├── lib/                     # Query + Snowflake + crypto logic
├── docs/                    # Canonical system documentation
├── public/                  # Static assets
├── styles/                  # Global styling
├── .env.local               # Environment variables
├── next.config.js           # Next.js config
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config

---

## APP DIRECTORY (NEXT.JS APP ROUTER)

app/
├── layout.tsx               # Root layout
├── page.tsx                 # Homepage

Rules:
- All routing is App Router based
- No legacy pages router allowed
- Layout system must remain consistent

---

## CORE PUBLIC PAGES (CANONICAL UI SURFACE)

app/
├── page.tsx                         # Homepage
├── mission/
│   └── page.tsx
├── framework/
│   └── page.tsx

### EXPLORER

├── explorer/
│   ├── page.tsx
│   ├── organizations/
│   │   └── page.tsx
│   ├── countries/
│   │   └── page.tsx
│   └── systems/
│       └── page.tsx

### REGISTRY

├── registry/
│   ├── page.tsx
│   ├── [registryId]/
│   │   └── page.tsx
│   ├── ai-systems/
│   │   ├── page.tsx
│   │   └── [systemId]/
│   │       └── page.tsx

### VERIFY

├── verify/
│   ├── page.tsx
│   └── [registryId]/
│       └── page.tsx

### APPLY (NEW — INTAKE ENTRY POINT)

├── apply/
│   └── page.tsx

Purpose:
- Entry into APPLICATION → CASE pipeline
- Must write to CORE.APPLICATIONS (not local storage)

### DEVELOPERS

├── developers/
│   └── page.tsx

### WIDGET PREVIEW

├── widget-preview/
│   └── [registryId]/
│       └── page.tsx

---

## API ROUTES (STRICTLY READ-ONLY TRUST SURFACE)

app/api/

### EXPLORER

├── explorer/
│   └── route.ts

### REGISTRY

├── registry/
│   ├── route.ts
│   ├── search/
│   │   └── route.ts
│   ├── [registryId]/
│   │   ├── route.ts
│   │   └── ai-systems/
│   │       └── route.ts

### VERIFY (CRITICAL TRUST ENDPOINT)

├── verify/
│   └── [registryId]/
│       └── route.ts

Responsibilities:
- Return canonical registry record
- Return signed proof (Ed25519)

### BADGE

├── badge/
│   └── [registryId]/
│       └── route.ts

### PUBLIC KEY

├── .well-known/
│   └── gafaig-public-key/
│       └── route.ts

---

## SHARED UI COMPONENTS (MANDATORY SYSTEM)

app/_components/

├── PublicPageHero.tsx              # Layout + hero system
├── PublicButtonLink.tsx            # Button system (primary/secondary/ghost)
├── PublicButton.tsx
├── SiteHeader.tsx
├── SiteNav.tsx

Rules:
- These define UI system
- Must not be bypassed
- No custom alternatives allowed

---

## FEATURE COMPONENTS

components/

### REGISTRY

├── registry/
│   ├── RegistryVerificationPanel.tsx
│   ├── RegistryHeader.tsx
│   ├── RegistryMetaGrid.tsx
│   └── RegistryActions.tsx

### EXPLORER

├── explorer/
│   ├── ExplorerCard.tsx
│   ├── ExplorerStats.tsx
│   └── ExplorerFilters.tsx

### UI PRIMITIVES

├── ui/
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── MetricCard.tsx
│   └── Pill.tsx

Rules:
- No business logic in components
- Components are presentation-only

---

## QUERY LAYER (CRITICAL — NO LOGIC ZONE)

lib/queries/

├── explorer.ts
├── registry.ts
├── registry-ai-systems.ts

Responsibilities:
- Query Snowflake views only
- No transformations beyond formatting
- No scoring logic
- No derived fields

---

## SNOWFLAKE CONNECTION LAYER

lib/

├── snowflake.ts

Responsibilities:
- Connection management
- Query execution
- No business logic
- No caching derived values

---

## CRYPTO / TRUST LAYER

lib/crypto/

├── verify-signing.ts

Responsibilities:
- Ed25519 signing
- Proof generation
- Key ID (kid) management
- Deterministic payload construction

---

## DOCUMENTATION (SYSTEM CONTROL FILES)

docs/

├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── ENGINEERING_RULES.md
├── GAFAIG_ACTIVE_FILE_MAP.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md
├── PAGE_LAYOUT_SYSTEM.md
├── VERIFIED_DEFINITION.md
├── VERSIONING.md
├── VERIFICATION_SIGNATURE_CONTRACT.md
├── CANONICAL_DATA_CONTRACTS.md
├── CANONICAL_DIMENSION_SYSTEM.md
├── REGISTRY_ID_RESOLUTION.md
├── ENVIRONMENT_PARITY_RULES.md
├── FAILURE_MODES.md
├── TEST_CASES.md
├── DO_NOT_BREAK.md

Rules:
- Docs define system behavior
- Docs must match Snowflake reality
- Docs are part of production system

---

## PUBLIC ASSETS

public/

├── images/
├── icons/
├── badges/

---

## STYLES

styles/

├── globals.css

Rules:
- No page-specific style systems
- Must follow PAGE_LAYOUT_SYSTEM.md

---

## ENVIRONMENT

.env.local

Must include:
- Snowflake credentials
- Signing key (Ed25519)
- NEXT_PUBLIC_BASE_URL

---

## ARCHITECTURE RULES (NON-NEGOTIABLE)

- Snowflake is the source of truth
- UI must not compute trust logic
- API must not compute trust logic
- Views are projections only
- Queries must map directly to Snowflake views
- No duplication of scoring logic

---

## LAYOUT RULES (MANDATORY)

All pages must:
- Use PublicPageHero
- Use max-w-[1180px]
- Use px-6 padding
- Use space-y-8 spacing
- Use rounded-3xl containers
- Use border-black/10
- Use bg-white surfaces

No custom layout systems allowed.

---

## DATA FLOW (APPLICATION SIDE)

API → Query Layer → Snowflake Views → Snowflake Tables

No reverse flow.  
No mutation outside Snowflake.

---

## CURRENT ACTIVE WORK

- Multi-case real data seed expansion
- Full pipeline validation
- Trust distribution (verify + badge + widget)
- Explorer + Registry alignment
- UI layout standardization
- Elimination of legacy conflicts

---

## DO NOT BREAK

- File structure hierarchy
- Query layer contracts
- Snowflake → API → UI flow
- Component reuse system
- Layout system (PublicPageHero)
- Deterministic ID generation
- Canonical pipeline order

---

## ENFORCEMENT

This document is the canonical VS Code structure for GAFAIG.

Any deviation must be corrected before deployment.

No exceptions.

---

END OF FILE