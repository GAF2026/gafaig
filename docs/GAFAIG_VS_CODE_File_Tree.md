# GAFAIG_VS_CODE_File_Tree.md — Last Updated: 2026-04-21

## PURPOSE

This document defines the canonical VS Code file structure for the GAFAIG platform.

It ensures:
- Clean separation of concerns
- Deterministic alignment with Snowflake (source of truth)
- Zero architectural drift
- Consistent developer workflow
- Strict enforcement of UI/API/DB boundaries

This document is a control surface, not a reference note.

---

## CORE ARCHITECTURE PRINCIPLE

GAFAIG is a deterministic system.

Data flow is strictly:

Snowflake → Views → Query Layer → API → UI

NOT:
- UI → API → Logic
- API → Computation
- UI → Derived state

No trust logic is allowed outside Snowflake.

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
├── layout.tsx
├── page.tsx

Rules:
- App Router only
- No Pages Router
- Layout consistency required

---

## CORE PUBLIC PAGES

app/
├── page.tsx
├── mission/page.tsx
├── framework/page.tsx

---

## EXPLORER (PUBLIC TRUST SURFACE)

app/explorer/
├── page.tsx
├── organizations/page.tsx
├── countries/page.tsx
├── systems/page.tsx

Purpose:
- Aggregate public registry data
- Must ONLY consume Snowflake public views

MANDATORY DATA SOURCES:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

CRITICAL RULE:
- NEVER query CORE.REGISTRY_AI_SYSTEMS directly
- NEVER expose TMP registry IDs
- ONLY certified/public systems allowed

---

## REGISTRY (CANONICAL TRUST SURFACE)

app/registry/
├── page.tsx
├── [registryId]/page.tsx
├── ai-systems/page.tsx
├── ai-systems/[systemId]/page.tsx

Purpose:
- Display canonical registry records
- Must reflect V_REGISTRY_PUBLIC exactly

---

## VERIFY

app/verify/
├── page.tsx
├── [registryId]/page.tsx

Purpose:
- Human + machine verification interface

---

## APPLY (INTAKE ENTRY POINT)

app/apply/
├── page.tsx

Purpose:
- Entry into APPLICATION → CASE pipeline
- MUST write to CORE.APPLICATIONS

---

## DEVELOPERS

app/developers/
├── page.tsx

Purpose:
- Trust distribution
- API + widget documentation

---

## WIDGET PREVIEW

app/widget-preview/
├── [registryId]/page.tsx

Purpose:
- Validate embed behavior

---

## API ROUTES (READ-ONLY TRUST SURFACE)

app/api/

### EXPLORER
├── explorer/route.ts

### REGISTRY
├── registry/route.ts
├── registry/search/route.ts
├── registry/[registryId]/route.ts
├── registry/[registryId]/ai-systems/route.ts

### VERIFY
├── verify/[registryId]/route.ts

Responsibilities:
- return canonical registry record
- return signed proof

### BADGE
├── badge/[registryId]/route.ts

### PUBLIC KEY
├── .well-known/gafaig-public-key/route.ts

Rules:
- no recomputation
- no derived trust logic
- strict mapping only

---

## SHARED UI COMPONENTS

app/_components/
├── PublicPageHero.tsx
├── PublicButtonLink.tsx
├── PublicButton.tsx
├── SiteHeader.tsx
├── SiteNav.tsx

Rules:
- mandatory usage
- defines layout system

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
- presentation only
- no business logic

---

## QUERY LAYER (CRITICAL)

lib/queries/
├── explorer.ts
├── registry.ts
├── registry-ai-systems.ts (INTERNAL ONLY)

Rules:
- MUST query Snowflake views only
- NO direct table access for public surfaces

Allowed:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

Forbidden:
- CORE.REGISTRY_AI_SYSTEMS (public UI)
- workflow tables in explorer/registry

---

## SNOWFLAKE CONNECTION

lib/
├── snowflake.ts

Purpose:
- connection + query execution

Rules:
- no logic
- no transformation beyond execution

---

## CRYPTO / TRUST LAYER

lib/crypto/
├── verify-signing.ts

Purpose:
- Ed25519 signing
- deterministic proof payloads

---

## TYPES / CONTRACTS

types/
├── registry.ts

Purpose:
- enforce API ↔ UI consistency

---

## DOCUMENTATION (SYSTEM CONTROL)

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
- docs define system behavior
- must match Snowflake reality

---

## PUBLIC ASSETS

public/
├── widget/gafaig-widget.js
├── images/
├── icons/
├── badges/

---

## STYLES

styles/
├── globals.css

Rules:
- must follow PAGE_LAYOUT_SYSTEM.md
- no ad hoc styling systems

---

## ENVIRONMENT

.env.local must include:
- Snowflake credentials
- signing keys (Ed25519)
- NEXT_PUBLIC_BASE_URL

---

## CRITICAL SYSTEM RULES

1. Snowflake is source of truth  
2. UI does not compute trust  
3. API does not compute trust  
4. Views are projections only  
5. Query layer must use views only  
6. No duplicate scoring logic  
7. No workflow leakage into public UI  
8. Explorer systems must use V_REGISTRY_AI_SYSTEMS_PUBLIC only  

---

## CURRENT STABLE CHECKPOINT

Git Commit:
3f5a775

State:
- registry stable
- explorer stable
- API aligned
- Snowflake aligned
- public trust surface restored

---

## ACTIVE FOCUS

1. enforce systems view usage across explorer
2. eliminate any remaining raw table usage
3. maintain strict Snowflake → UI parity
4. protect public trust surface integrity

---

## FINAL STATEMENT

GAFAIG is now a deterministic governance system where:

Snowflake defines truth  
API transmits truth  
UI renders truth  

Any deviation from this model is a system violation.

END OF FILE