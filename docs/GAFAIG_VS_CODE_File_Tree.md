# GAFAIG_VS_CODE_File_Tree.md
Last Updated: 2026-04-15

## PURPOSE
This file provides a current, execution-relevant view of the GAFAIG VS Code project structure. It is not a raw dump of every file in the repository. It is a curated, canonical file tree focused on the files that matter for the public trust surface, API layer, query layer, crypto/proof system, Snowflake integration points, and core documentation control files. Snowflake is the source of truth. Next.js is the trust surface.

## ROOT PROJECT STRUCTURE
gafaig/
├── app/
├── components/
├── lib/
├── public/
├── types/
├── docs/
├── .env.local
├── next.config.js
├── package.json
└── tsconfig.json

## CONTROL FILES (LOAD FIRST)
docs/
├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── ENGINEERING_RULES.md
├── CANONICAL_RUN_ORDER.md
├── GAFAIG_ACTIVE_FILE_MAP.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md
├── VERIFIED_DEFINITION.md
├── VERIFICATION_SIGNATURE_CONTRACT.md
└── VERSIONING.md

These are system control files, not ordinary documentation. They must be loaded first in continuation chats and treated as authoritative context.

## APP ROUTER (NEXT.JS)
app/
├── page.tsx
│   └── Homepage and visual/layout standard for public-facing pages
├── registry/
│   ├── page.tsx
│   │   └── Public registry list page
│   ├── ai-systems/
│   │   └── page.tsx
│   │       └── Public AI systems registry page
│   └── [registryId]/
│       └── page.tsx
│           └── Registry detail page
├── explorer/
│   ├── page.tsx
│   │   └── Explorer landing page
│   ├── organizations/
│   │   └── page.tsx
│   │       └── Organization explorer page
│   ├── systems/
│   │   └── page.tsx
│   │       └── Systems explorer page
│   └── countries/
│       └── page.tsx
│           └── Country explorer page
├── verify/
│   ├── page.tsx
│   │   └── Verify landing page
│   └── [registryId]/
│       └── page.tsx
│           └── Verify detail page with proof surface
├── widget-preview/
│   └── [registryId]/
│       └── page.tsx
│           └── Widget preview page
└── api/
    ├── registry/
    │   ├── route.ts
    │   │   └── Registry list API
    │   └── search/
    │       └── route.ts
    │           └── Registry search API
    ├── verify/
    │   └── [registryId]/
    │       └── route.ts
    │           └── Verification + proof endpoint
    ├── badge/
    │   └── [registryId]/
    │       └── route.ts
    │           └── Badge API
    └── .well-known/
        └── gafaig-public-key/
            └── route.ts
                └── Public key endpoint

## SHARED COMPONENTS
components/
├── registry/
│   ├── RegistryHeaderPanel.tsx
│   ├── RegistryCertificationSummary.tsx
│   └── RegistryVerificationPanel.tsx
├── ui/
│   ├── StatusChip.tsx
│   ├── PublicButton.tsx
│   └── PublicButtonLink.tsx
├── explorer/
│   ├── ExplorerStatCard.tsx
│   └── ExplorerTable.tsx
└── layout/
    └── PublicPageHero.tsx

These shared components standardize layout, typography, trust-state signaling, and UI consistency across the public trust surface.

## QUERY LAYER (SNOWFLAKE ACCESS)
lib/
├── queries/
│   ├── registry.ts
│   ├── explorer.ts
│   └── registry-ai-systems.ts

Rules for these files:
- no business logic
- no scoring logic
- only data retrieval and normalization from Snowflake
- never compute canonical truth outside Snowflake

## SNOWFLAKE CONNECTION
lib/
└── snowflake.ts
    └── Central Snowflake connection and query execution layer, including sfQuery()

## CRYPTO / PROOF SYSTEM
lib/
└── crypto/
    └── verify-signing.ts
        └── Ed25519 signing, verification, key handling, proof utilities

## TYPE DEFINITIONS
types/
└── registry.ts
    └── Shared registry, AI system, badge, and verify response contracts

Important note:
The proof object structure is defined here and must stay aligned with `/api/verify/[registryId]`.

## PUBLIC ASSETS
public/
└── widget/
    └── gafaig-widget.js
        └── External embeddable GAFAIG widget script

Critical note:
This is a highly sensitive file because third-party embeds depend on it. It must stay aligned with the verify API and widget preview page.

## ENVIRONMENT VARIABLES
.env.local

Key environment variables used by the trust/proof system include:
- GAFAIG_SIGNING_PRIVATE_KEY_PEM
- GAFAIG_SIGNING_PUBLIC_KEY_PEM
- GAFAIG_SIGNING_KEY_ID
- GAFAIG_VERIFY_PUBLIC_KEY_PEM
- GAFAIG_VERIFY_KID
- GAFAIG_SESSION_SECRET

## BUILD / CONFIG
- next.config.js
- tsconfig.json
- package.json

## ACTIVE SYSTEM CONNECTIONS
Snowflake
↓
lib/snowflake.ts
↓
lib/queries/*
↓
app/api/*
↓
app/*
↓
Public UI

## ACTIVE SYSTEM BREAKPOINT
The VS Code / Next.js side is stable enough for the current phase. The current break is not in the page layer. The break is in Snowflake:
SP_SCORE_CASE_ENTERPRISE
↓
V_GOVERNANCE_SCORE_CASE (empty for rebuilt demo cases)
↓
SP_PUBLISH_CASE_TO_REGISTRY_V3
↓
V_REGISTRY_PUBLIC (empty for new cases)

## DO NOT BREAK FILES
These are especially sensitive and should not be changed casually:
- public/widget/gafaig-widget.js
- app/api/verify/[registryId]/route.ts
- app/api/.well-known/gafaig-public-key/route.ts
- lib/crypto/verify-signing.ts
- lib/queries/registry.ts
- lib/queries/explorer.ts

## VERIFIED WORKING ROUTES
These routes were already working before the current Snowflake seed/scoring blocker:
- /registry
- /registry/[registryId]
- /explorer
- /explorer/organizations
- /explorer/systems
- /explorer/countries
- /verify
- /verify/[registryId]
- /widget-preview/[registryId]
- /api/verify/[registryId]
- /api/.well-known/gafaig-public-key

## SUMMARY
The VS Code structure is correct and the public trust surface has been aligned visually and semantically. The API layer is clean. The proof/signature system is functioning. The widget system is functioning. The current platform blocker is not in VS Code. The only active blocker is the Snowflake scoring-to-publish chain. Until Snowflake scoring is fixed, VS Code should remain stable and should not be unnecessarily modified.