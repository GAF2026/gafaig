# GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-04-14

============================================================
PURPOSE
============================================================

This document defines the ACTIVE, CANONICAL file map for the GAFAIG platform.

It identifies:
- Source-of-truth Snowflake files
- Active Next.js application files
- Critical query layer dependencies
- API ↔ Query ↔ Snowflake relationships

Only files listed here should be modified.
Archived or duplicate files must NOT be used.

============================================================
SYSTEM ARCHITECTURE (LOCKED)
============================================================

Snowflake (Source of Truth)
→ Query Layer (lib/queries)
→ API Layer (app/api)
→ UI Layer (app/*)
→ Vercel (Production)

NO business logic exists outside Snowflake.

============================================================
SNOWFLAKE — CANONICAL FILES
============================================================

CORE PIPELINE TABLES (Defined in rebuild file):
- 01_REBUILD_ENVIRONMENT_CANONICAL.sql
  - CORE.VERIFICATION_CASES
  - CORE.VERIFICATION_FINDINGS
  - CORE.VERIFICATION_EVIDENCE
  - CORE.VERIFICATION_FINDING_EVIDENCE
  - CORE.VERIFICATION_EVENTS
  - CORE.CASE_SCORE_SNAPSHOTS
  - CORE.DECISIONS
  - CORE.REGISTRY_SNAPSHOTS

APPLICATION LAYER:
- 11_TABLES_APPLICATIONS.sql
  - CORE.APPLICATIONS

REGISTRY SNAPSHOTS:
- GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql
  - CORE.REGISTRY_SNAPSHOTS
  - CORE.V_REGISTRY_LATEST_APPROVED

PUBLIC REGISTRY VIEWS:
- 21_VIEWS_PUBLIC_REGISTRY.sql
  - CORE.V_REGISTRY_PUBLIC
  - CORE.V_REGISTRY_LATEST_APPROVED

AI SYSTEMS:
- 14_TABLES_REGISTRY_AI_SYSTEMS.sql
  - CORE.REGISTRY_AI_SYSTEMS

- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
  - CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

SCORING:
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CASE_TIER_BAND

PUBLISHING:
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

CASE CREATION:
- 23_SP_CREATE_CASE_FROM_APPLICATION.sql

DEMO DATA:
- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql (ACTIVE)
- GAFAIG - CANONICAL DEMO DATASET.sql (SUPPORTING)

============================================================
NEXT.JS — ACTIVE APPLICATION FILES
============================================================

APP ROUTES (UI)

Registry:
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx

Explorer:
- app/explorer/page.tsx
- app/explorer/organizations/page.tsx
- app/explorer/systems/page.tsx
- app/explorer/countries/page.tsx

Widget Preview:
- app/widget-preview/[registryId]/page.tsx

============================================================
API ROUTES (CRITICAL)
============================================================

Registry API:
- app/api/registry/route.ts
- app/api/registry/search/route.ts

Verification:
- app/api/verify/[registryId]/route.ts

Badge:
- app/api/badge/[registryId]/route.ts

Well-known:
- app/api/.well-known/gafaig-public-key/route.ts

============================================================
QUERY LAYER (CRITICAL — CURRENTLY UNSTABLE)
============================================================

Primary file:
- lib/queries/registry.ts  ⚠️ ACTIVE BREAKPOINT

This file MUST provide:

Exports:
- getRegistryRecords
- getRegistryRecord
- getRegistryByRegistryId
- searchRegistryRecords
- getRegistrySummary
- getRegistryCountries

This file MUST align with:
- API route expectations
- Snowflake column names
- UI component expectations

Current issue:
- Mismatched filters
- Missing exports (previously)
- Incorrect filtering logic (previously)
- TypeScript interface mismatch

STATUS: NEEDS STABILIZATION

============================================================
SUPPORTING QUERY FILES
============================================================

- lib/queries/explorer.ts
- lib/queries/registry-ai-systems.ts

============================================================
SHARED INFRASTRUCTURE
============================================================

Snowflake Client:
- lib/snowflake.ts

Auth:
- lib/auth/require.ts

============================================================
CRITICAL DATA CONTRACT
============================================================

All data must originate from:
- CORE.V_REGISTRY_PUBLIC

This is the ONLY public contract view.

============================================================
RECORD TYPES (LOCKED LOGIC)
============================================================

CERTIFIED RECORD:
- CERTIFIED_AT NOT NULL
- Has:
  - CERTIFIED_SCORE
  - CERTIFIED_TIER
  - CERTIFIED_BAND
  - Signed proof

APPROVED-ONLY RECORD:
- DECISION_STATUS = APPROVED
- CERTIFIED_AT NULL
- Has NO certification fields

UI must respect this distinction.

============================================================
CURRENT SYSTEM STATUS
============================================================

Snowflake:
- ✅ Fully operational
- ✅ Canonical pipeline working
- ✅ Demo data seeded (6 records)

Application Layer:
- ❌ Query layer unstable
- ❌ API contract mismatch
- ❌ Build errors recently resolved but fragile

UI:
- ⚠️ Rendering correctly but dependent on unstable data layer

============================================================
IMMEDIATE PRIORITY
============================================================

1. Stabilize:
   lib/queries/registry.ts

2. Ensure compatibility with:
   - /api/registry
   - /api/registry/search
   - /api/badge/[registryId]

3. Do NOT modify:
   - Snowflake
   - UI components

============================================================
RULES
============================================================

- Snowflake is the source of truth
- No business logic in API or UI
- Do not re-architect
- Do not introduce new data sources
- Fix only what is broken
- Maintain deterministic pipeline

============================================================
END
============================================================