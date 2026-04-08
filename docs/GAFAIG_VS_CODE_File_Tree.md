# GAFAIG — VS CODE FILE TREE (CANONICAL) — 2026-04-07

## OVERVIEW
This document represents the canonical GAFAIG VS Code project structure. It reflects the full Next.js (App Router) application, Snowflake query layer, API routes, admin workflows, and supporting infrastructure. The structure enforces the rule: Snowflake is the source of truth, and the application layer is a thin orchestration layer.

## ROOT
gafaig/
├─ app/
├─ components/
├─ lib/
├─ types/
├─ public/
├─ docs/
├─ middleware.ts
├─ next.config.js
├─ package.json
├─ tsconfig.json

## APP (NEXT.JS APP ROUTER)

### PUBLIC PAGES
app/
├─ page.tsx (homepage)
├─ mission/page.tsx
├─ framework/page.tsx
├─ demo/page.tsx
├─ demo-script/page.tsx

### REGISTRY
app/registry/
├─ page.tsx (registry list)
├─ [registryId]/page.tsx (registry detail)
├─ ai-systems/page.tsx

### EXPLORER
app/explorer/
├─ page.tsx
├─ organizations/page.tsx
├─ systems/page.tsx
├─ countries/page.tsx
├─ map/page.tsx

### APPLY FLOW
app/apply/
├─ page.tsx
├─ ApplyForm.tsx

### ADMIN
app/admin/
├─ login/page.tsx
├─ applications/page.tsx
├─ verification/
│  ├─ [caseId]/page.tsx
│  ├─ [caseId]/findings/page.tsx
│  ├─ [caseId]/evidence/page.tsx
│  ├─ [caseId]/decision/page.tsx

## API ROUTES

app/api/

### PUBLIC API
├─ registry/route.ts (V_REGISTRY_PUBLIC)
├─ registry/search/route.ts (V_REGISTRY_PUBLIC_SEARCH)
├─ verify/[registryId]/route.ts
├─ badge/[registryId]/route.ts
├─ .well-known/gafaig-public-key/route.ts

### APPLY
├─ apply/route.ts (writes application to local JSON store)

### ADMIN API
├─ admin/
│  ├─ applications/route.ts
│  ├─ verification/
│  │  ├─ cases/route.ts
│  │  ├─ findings/route.ts
│  │  ├─ evidence/route.ts
│  │  ├─ decisions/route.ts

## COMPONENTS

components/
├─ registry/
│  ├─ RegistryHeaderPanel.tsx
│  ├─ RegistryCertificationSummary.tsx
│  ├─ RegistryVerificationPanel.tsx
├─ ui/
│  ├─ StatusChip.tsx
│  ├─ PublicButton.tsx
│  ├─ PublicButtonLink.tsx

## LIB (QUERY + INFRASTRUCTURE)

lib/
├─ snowflake.ts (canonical Snowflake connection / sfQuery)
├─ queries/
│  ├─ registry.ts
│  ├─ registry-ai-systems.ts
│  ├─ explorer.ts
├─ auth/
│  ├─ requireAdmin.ts

## TYPES

types/
├─ registry.ts (RegistryRow, RegistryApiResponse, VerifyApiResponse, etc.)

## PUBLIC ASSETS

public/
├─ images/
│  ├─ gafaig-badge-tier-1.png
│  ├─ gafaig-badge-default.png

## DATA (LOCAL DEV ONLY)

app/data/
├─ applications.json (temporary ingestion store for apply flow)

## DOCS (CANONICAL SYSTEM FILES)

docs/
├─ MASTER_STATE.md
├─ CURRENT_FOCUS.md
├─ ENGINEERING_RULES.md
├─ PROJECT_INDEX.md
├─ CHANGELOG.md
├─ API_ROUTE_MAPPING.md
├─ UI_COMPONENT_MAPPING.md
├─ SNOWFLAKE_WORKSHEET_MAPPING.md
├─ GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├─ GAFAIG_VS_CODE_File_Tree.md

## MIDDLEWARE

middleware.ts
- Handles admin authentication
- Uses GAFAIG_SESSION_SECRET
- Protects /admin routes

## KEY ARCHITECTURAL RULE

ALL DATA FLOW:

Snowflake → lib/queries → API → UI

NEVER:
- UI directly querying database
- API computing scores
- Business logic outside Snowflake

## CURRENT SYSTEM STATE (RELEVANT TO FILE TREE)

WORKING:
- Next.js routing structure complete
- API routes implemented for registry, verify, badge
- Query layer connected to Snowflake
- Admin pages scaffolded
- Apply flow writing to local JSON

BLOCKER:
- Apply flow is NOT connected to Snowflake CORE.APPLICATIONS
- Admin applications page is not sourcing from Snowflake
- No automatic pipeline trigger from application → case
- Snowflake procedure SP_CREATE_CASE_FROM_APPLICATION not yet wired to API

## CURRENT PIPELINE GAP

Apply (UI)
→ app/api/apply/route.ts (writes JSON only)
→ ❌ NOT writing to CORE.APPLICATIONS
→ ❌ NOT triggering SP_CREATE_CASE_FROM_APPLICATION
→ ❌ No case created in Snowflake
→ ❌ No downstream pipeline

## REQUIRED NEXT CONNECTION

Replace local ingestion with Snowflake write:

app/api/apply/route.ts
→ INSERT INTO CORE.APPLICATIONS

Then:

Admin action OR API route
→ CALL CORE.SP_CREATE_CASE_FROM_APPLICATION

## FINAL NOTE

The VS Code structure is complete and correctly aligned with GAFAIG architecture.
The current failure is not structural but integration-level:
the frontend apply flow is not yet connected to the Snowflake engine.

Once connected, the entire GAFAIG pipeline will activate end-to-end.