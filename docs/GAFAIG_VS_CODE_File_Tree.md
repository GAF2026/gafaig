# GAFAIG VS CODE FILE TREE

DATE: 2026-04-13

This file represents the current working file and folder structure for the GAFAIG platform in VS Code. It is aligned to the active development phase: Trust Surface Completion.

----------------------------------------
ROOT
----------------------------------------

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
├── tailwind.config.ts
└── README.md

----------------------------------------
APP DIRECTORY (NEXT.JS APP ROUTER)
----------------------------------------

app/
│
├── page.tsx                           # Homepage (to be upgraded)
├── layout.tsx                         # Root layout
├── globals.css                        # Global styles
│
├── mission/
│   └── page.tsx                       # Mission page (design reference)
│
├── explorer/
│   ├── page.tsx                       # Explorer landing
│   ├── organizations/
│   │   └── page.tsx                   # Organizations explorer
│   ├── systems/
│   │   └── page.tsx                   # AI systems explorer
│   └── countries/
│       └── page.tsx                   # Countries explorer
│
├── registry/
│   ├── page.tsx                       # Registry list page
│   ├── ai-systems/
│   │   └── page.tsx                   # AI systems registry (next target)
│   └── [registryId]/
│       └── page.tsx                   # Registry detail page
│
├── widget-preview/
│   └── [registryId]/
│       └── page.tsx                   # Widget preview page
│
├── badge/
│   └── [registryId]/
│       └── route.ts                   # Badge endpoint (HTML response)
│
├── badge-preview/
│   └── [registryId]/
│       └── page.tsx                   # Badge preview page
│
├── api/
│   │
│   ├── registry/
│   │   └── route.ts                   # Registry API (search + fetch)
│   │
│   ├── verify/
│   │   └── [registryId]/
│   │       └── route.ts               # Verification API (public trust endpoint)
│   │
│   └── badge/
│       └── [registryId]/
│           └── route.ts               # Badge API (if separate endpoint used)

----------------------------------------
COMPONENTS DIRECTORY
----------------------------------------

components/
│
├── registry/
│   ├── RegistryTrustTools.tsx         # Trust distribution component (active)
│   ├── RegistryVerificationPanel.tsx  # Verification panel (used in detail page)
│   └── RegistryHeaderPanel.tsx        # Header panel (if used)
│
├── ui/
│   ├── StatusChip.tsx                 # Standardized status chip
│   └── (other shared UI components)
│
└── (other component folders as needed)

----------------------------------------
LIB DIRECTORY (QUERY + INFRA)
----------------------------------------

lib/
│
├── queries/
│   ├── registry.ts                   # Registry queries
│   ├── explorer.ts                   # Explorer queries (active)
│   ├── registry-ai-systems.ts        # AI systems queries
│   └── (future query files)
│
├── snowflake.ts                      # Snowflake connection + sfQuery()
├── auth/
│   └── require.ts                    # Admin/auth helpers (if used)
└── (other utility modules)

----------------------------------------
PUBLIC DIRECTORY (STATIC + EXTERNAL SURFACES)
----------------------------------------

public/
│
├── widget/
│   ├── gafaig-widget.js              # External embeddable widget (active)
│   └── gafaig-verify.js              # Optional verify helper script
│
├── images/                           # Static images (if used)
└── (other static assets)

----------------------------------------
DOCS DIRECTORY (CANONICAL CONTEXT)
----------------------------------------

docs/
│
├── MASTER_STATE.md                   # System architecture (canonical)
├── CURRENT_FOCUS.md                  # Active execution plan
├── ENGINEERING_RULES.md              # Strict rules (must follow)
├── GAFAIG_ACTIVE_FILE_MAP.md         # Active working files
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md       # This file
│
├── CANONICAL_DATA_CONTRACTS.md
├── CANONICAL_DIMENSION_SYSTEM.md
├── REGISTRY_ID_RESOLUTION.md
├── VERIFICATION_SIGNATURE_CONTRACT.md
├── ENVIRONMENT_PARITY_RULES.md
├── VERIFIED_DEFINITION.md
├── FAILURE_MODES.md
├── TEST_CASES.md
├── VERSIONING.md
├── DO_NOT_BREAK.md
│
└── test-widget.html                  # External widget test harness

----------------------------------------
ENVIRONMENT FILES
----------------------------------------

.env.local
- GAFAIG_SESSION_SECRET
- GAFAIG_ADMIN_PASSWORD
- GAFAIG_ADMIN_DEMO_PASSWORD
- NEXT_PUBLIC_BASE_URL
- Snowflake credentials

----------------------------------------
BUILD + CONFIG FILES
----------------------------------------

package.json                          # Dependencies + scripts
tsconfig.json                         # TypeScript config
next.config.js                        # Next.js config
tailwind.config.ts                    # Tailwind config

----------------------------------------
CURRENTLY ACTIVE FILES (HIGH PRIORITY)
----------------------------------------

These files are actively being modified:

- public/widget/gafaig-widget.js
- app/widget-preview/[registryId]/page.tsx
- app/badge/[registryId]/route.ts
- app/badge-preview/[registryId]/page.tsx
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx
- app/api/verify/[registryId]/route.ts
- app/api/registry/route.ts
- lib/queries/explorer.ts
- components/registry/RegistryTrustTools.tsx

----------------------------------------
NEXT TARGET FILES
----------------------------------------

Execution order:

1. app/api/verify/[registryId]/route.ts
2. app/api/registry/route.ts
3. public/widget/gafaig-widget.js
4. app/widget-preview/[registryId]/page.tsx
5. app/badge/[registryId]/route.ts
6. app/registry/[registryId]/page.tsx
7. components/registry/RegistryTrustTools.tsx
8. app/page.tsx

----------------------------------------
RULES FOR FILE TREE
----------------------------------------

- Reflect actual repo structure
- Keep aligned with ACTIVE_FILE_MAP
- Do not include deprecated files
- Update when new routes/components are added

----------------------------------------
PURPOSE
----------------------------------------

This file ensures:
- Clear navigation of the codebase
- Alignment across sessions
- Fast onboarding into active development
- Zero ambiguity about file locations

----------------------------------------
FINAL NOTE
----------------------------------------

This is the live system map.

Follow it strictly.

One file at a time.

No drift.