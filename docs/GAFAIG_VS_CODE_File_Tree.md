# GAFAIG_VS_CODE_File_Tree.md
Last Updated: 2026-04-22

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
├── types/                   # TypeScript contracts
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
- Layout consistency enforced via PAGE_LAYOUT_SYSTEM.md

---

## CORE PUBLIC PAGES (PHASE 1 ALIGNED)

app/
├── page.tsx
├── mission/page.tsx
├── framework/page.tsx
├── demo/page.tsx
├── developers/page.tsx

---

## EXPLORER (PUBLIC TRUST SURFACE)

app/explorer/
├── page.tsx
├── organizations/page.tsx
├── countries/page.tsx
├── systems/page.tsx

Purpose:
- Aggregate public registry data

MANDATORY DATA SOURCES:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

CRITICAL RULES:
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

RULE:
- Must reflect CORE.V_REGISTRY_PUBLIC exactly

---

## VERIFY

app/verify/
├── page.tsx
├── [registryId]/page.tsx

Purpose:
- Human + machine verification interface
- Must align with signed proof output

---

## APPLY (INTAKE ENTRY POINT)

app/apply/
├── page.tsx

Purpose:
- Entry into APPLICATION → CASE pipeline

RULE:
- MUST write to CORE.APPLICATIONS

---

## DEVELOPERS

app/developers/
├── page.tsx

Purpose:
- API + widget documentation
- Trust distribution surface

---

## WIDGET PREVIEW

app/widget-preview/
├── [registryId]/page.tsx

Purpose:
- Validate embed behavior
- Demonstrate trust portability

---

## ADMIN (PRIVATE VERIFICATION LAYER)

app/admin/
├── login/page.tsx
├── applications/page.tsx
├── participants/page.tsx
├── verification/page.tsx
├── verification/[caseId]/page.tsx
├── verification/[caseId]/findings/page.tsx
├── verification/[caseId]/score/page.tsx
├── verification/[caseId]/publish/page.tsx

Purpose:
- Manage internal workflow only

RULE:
- NEVER expose admin data publicly

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

RULES:
- no recomputation
- no derived trust logic
- strict mapping only

---

## SHARED UI COMPONENTS (CANONICAL)

app/_components/
├── PublicPageHero.tsx
├── PublicButtonLink.tsx
├── PublicButton.tsx
├── SiteHeader.tsx
├── SiteNav.tsx

Rules:
- REQUIRED usage across all public pages
- Defines layout, typography, spacing

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

RULE:
- presentation only
- NO business logic

---

## QUERY LAYER (CRITICAL)

lib/queries/
├── explorer.ts
├── registry.ts
├── registry-ai-systems.ts (INTERNAL ONLY)

RULES:
- MUST query Snowflake views only

ALLOWED:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
- CORE.V_EXPLORER_STATS

FORBIDDEN:
- CORE.REGISTRY_AI_SYSTEMS (public UI)
- workflow tables in explorer/registry

---

## SNOWFLAKE CONNECTION

lib/
├── snowflake.ts

Purpose:
- connection + query execution

RULE:
- no transformation logic
- no derived computation

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
├── PUBLIC_PAGE_TEMPLATE_MAP.md
├── PUBLIC_PAGE_AUDIT.md
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

RULE:
- docs define system behavior
- must match Snowflake reality

---

## PUBLIC ASSETS

public/
├── widget/gafaig-widget.js
├── widget/gafaig-verify.js
├── images/
├── icons/
├── badges/

---

## STYLES

styles/
├── globals.css

RULE:
- must follow PAGE_LAYOUT_SYSTEM.md
- no ad hoc styling

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

State:
- Phase 1 UI alignment COMPLETE
- Registry stable
- Explorer stable
- Verify stable
- Widget system aligned
- Admin shell aligned
- API aligned
- Snowflake aligned

---

## ACTIVE FOCUS

1. Final registry integrity validation  
2. Enforce systems view purity  
3. Prevent revoked record leakage  
4. Maintain strict Snowflake → API → UI flow  

---

## FINAL STATEMENT

GAFAIG is a deterministic governance system where:

Snowflake defines truth  
API transmits truth  
UI renders truth  

Any deviation from this model is a system violation.