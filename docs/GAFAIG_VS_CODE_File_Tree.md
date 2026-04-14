# GAFAIG_VS_CODE_File_Tree.md
Last Updated: 2026-04-14

============================================================
PURPOSE
============================================================

This document defines the COMPLETE and CANONICAL VS Code file structure for the GAFAIG application.

It reflects:
- Active Next.js App Router structure
- API routes
- Query layer
- Shared utilities
- Documentation files

Only files listed here should be actively used and modified.

============================================================
ROOT STRUCTURE
============================================================

gafaig/
│
├── app/
├── components/
├── lib/
├── public/
├── docs/
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md

============================================================
APP DIRECTORY (NEXT.JS APP ROUTER)
============================================================

app/
│
├── page.tsx
│
├── registry/
│   ├── page.tsx
│   └── [registryId]/
│       └── page.tsx
│
├── explorer/
│   ├── page.tsx
│   ├── organizations/
│   │   └── page.tsx
│   ├── systems/
│   │   └── page.tsx
│   └── countries/
│       └── page.tsx
│
├── widget-preview/
│   └── [registryId]/
│       └── page.tsx
│
├── admin/
│   ├── login/
│   │   └── page.tsx
│   ├── applications/
│   │   └── page.tsx
│   └── verification/
│       └── [caseId]/
│           └── findings/
│               └── page.tsx
│
├── api/
│   │
│   ├── registry/
│   │   ├── route.ts
│   │   └── search/
│   │       └── route.ts
│   │
│   ├── verify/
│   │   └── [registryId]/
│   │       └── route.ts
│   │
│   ├── badge/
│   │   └── [registryId]/
│   │       └── route.ts
│   │
│   └── .well-known/
│       └── gafaig-public-key/
│           └── route.ts

============================================================
COMPONENTS DIRECTORY
============================================================

components/
│
├── ui/
│   ├── StatusChip.tsx
│   └── (other shared UI components)
│
├── registry/
│   ├── RegistryHeaderPanel.tsx
│   ├── RegistryCertificationSummary.tsx
│   ├── RegistryVerificationPanel.tsx
│   ├── RegistryAiSystemsSection.tsx
│   └── RegistryTrustTools.tsx
│
└── (shared layout / utility components)

============================================================
LIB DIRECTORY (CRITICAL)
============================================================

lib/
│
├── snowflake.ts
│   → Canonical Snowflake query execution layer
│
├── queries/
│   │
│   ├── registry.ts        ⚠️ PRIMARY ACTIVE FILE (CURRENTLY UNSTABLE)
│   ├── explorer.ts
│   ├── registry-ai-systems.ts
│   └── (other query helpers)
│
├── auth/
│   └── require.ts
│
└── (other shared utilities)

============================================================
PUBLIC DIRECTORY
============================================================

public/
│
├── widget/
│   └── gafaig-widget.js
│
└── (static assets, images, etc.)

============================================================
DOCS DIRECTORY (CANONICAL CONTEXT FILES)
============================================================

docs/
│
├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── GAFAIG_ACTIVE_FILE_MAP.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md
├── ENGINEERING_RULES.md
├── CANONICAL_RUN_ORDER.md
├── PROJECT_INDEX.md
├── CHANGELOG.md
├── API_ROUTE_MAPPING.md
├── UI_COMPONENT_MAPPING.md
├── SNOWFLAKE_WORKSHEET_MAPPING.md
└── (additional canonical docs)

============================================================
CRITICAL FILES (DO NOT BREAK)
============================================================

Frontend Pages:
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx
- app/explorer/page.tsx

API Routes:
- app/api/registry/route.ts
- app/api/registry/search/route.ts
- app/api/badge/[registryId]/route.ts

Query Layer:
- lib/queries/registry.ts ⚠️ PRIMARY FAILURE POINT

============================================================
CURRENT SYSTEM STATUS
============================================================

Snowflake:
- ✅ Stable
- ✅ Canonical

Next.js:
- ⚠️ Build instability resolved but fragile
- ❌ Query layer mismatch causing system inconsistency

UI:
- ⚠️ Rendering dependent on query layer stability

============================================================
ACTIVE ISSUE LOCATION
============================================================

lib/queries/registry.ts

Problems:
- Interface mismatch with API
- Missing filter fields
- Missing exports (previously)
- Incorrect filtering logic (previously)

This file must be stabilized BEFORE any UI work.

============================================================
RULES
============================================================

- Do not modify Snowflake
- Do not modify UI unnecessarily
- Fix query layer first
- Maintain API compatibility
- Maintain deterministic data flow

============================================================
END
============================================================