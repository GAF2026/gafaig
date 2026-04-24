# GAFAIG_VS_CODE_File_Tree.md
Last Updated: 2026-04-24

## PURPOSE
This file documents the current VS Code file structure for the GAFAIG platform. It reflects the active Next.js application, API routes, query layer, crypto layer, SDK/widget surfaces, and documentation files. This file must remain aligned with the actual repository at GAF2026/gafaig and the deployed environment on Vercel.

GAFAIG = Global Authority for AI Governance. GAFAIG is a deterministic Snowflake-executed governance verification system that publishes independently verifiable public certification records.

---

## ROOT STRUCTURE

gafaig/
├── app/
├── components/
├── lib/
├── types/
├── public/
├── docs/
├── styles/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md

---

## APP DIRECTORY (NEXT.JS APP ROUTER)

app/
├── layout.tsx
├── globals.css
├── page.tsx
├── mission/
│   └── page.tsx
├── framework/
│   └── page.tsx
├── developers/
│   └── page.tsx
├── registry/
│   ├── page.tsx
│   ├── ai-systems/
│   │   └── page.tsx
│   └── [registryId]/
│       └── page.tsx
├── explorer/
│   ├── page.tsx
│   ├── organizations/
│   │   └── page.tsx
│   ├── countries/
│   │   └── page.tsx
│   ├── systems/
│   │   └── page.tsx
│   └── map/
│       └── page.tsx
├── verify/
│   ├── page.tsx
│   └── [registryId]/
│       └── page.tsx
├── widget-preview/
│   └── [registryId]/
│       └── page.tsx
├── demo/
│   └── page.tsx
├── admin/
│   ├── login/
│   │   └── page.tsx
│   ├── applications/
│   │   └── page.tsx
│   └── verification/
│       └── [caseId]/
│           └── findings/
│               └── page.tsx
└── api/
    ├── registry/
    │   ├── route.ts
    │   └── search/
    │       └── route.ts
    ├── verify/
    │   └── [registryId]/
    │       └── route.ts
    ├── badge/
    │   └── [registryId]/
    │       └── route.ts
    └── .well-known/
        └── gafaig-public-key/
            └── route.ts

---

## SHARED COMPONENTS

app/_components/
├── SiteHeader.tsx
├── SiteFooter.tsx
├── PublicPageHero.tsx
├── PublicButtonLink.tsx
├── PublicButton.tsx

---

## REGISTRY COMPONENTS

components/registry/
├── RegistryHeaderPanel.tsx
├── RegistryCertificationSummary.tsx
├── RegistryVerificationPanel.tsx
├── RegistryBadgePanel.tsx
├── RegistryTrustTools.tsx
├── RegistryAiSystemsSection.tsx
├── RegistryNavigationGraph.tsx
├── AISystemCard.tsx

---

## UI COMPONENTS

components/ui/
├── StatusChip.tsx
├── MonoCodeBlock.tsx

---

## LIB DIRECTORY (LOGIC LAYER)

lib/
├── queries/
│   ├── registry.ts
│   └── explorer.ts
├── crypto/
│   └── verify-signing.ts

---

## TYPES

types/
├── registry.ts

Purpose:
Defines all public-facing TypeScript contracts for:
- registry records
- API responses
- verify response shape

Phase 6 requirement:
Must include:
- recordType
- recordName
- lifecycleStatus
- visibilityStatus
- verificationEligible
- badgeEligible

---

## PUBLIC ASSETS

public/
├── sdk/
│   └── gafaig.js
├── widget/
│   ├── gafaig-widget.js
│   └── gafaig-verify.js
├── badges/
│   └── (badge assets go here)

---

## SDK

File:
public/sdk/gafaig.js

Current version:
1.1.0

Capabilities:
- verify(registryId)
- render(target, { registryId })
- badge(target, { registryId })
- openVerify(registryId)
- autoInit()
- scan()

HTML attributes:
- data-gafaig-widget
- data-gafaig-badge
- data-gafaig-open-verify

---

## CRYPTO LAYER

lib/crypto/verify-signing.ts

Exports:
- signVerificationPayload
- getSigningKeyId
- GAFAIG_VERIFY_ALG

Algorithm:
Ed25519

Used by:
- /api/verify/[registryId]

---

## QUERY LAYER

lib/queries/registry.ts

Purpose:
- Query CORE.V_REGISTRY_PUBLIC
- Map Snowflake → API contract

Must:
- Pass through fields exactly
- Not compute trust

Required fields:
- REGISTRY_SNAPSHOT_ID
- RECORD_TYPE
- RECORD_NAME
- VISIBILITY_STATUS
- VERIFICATION_ELIGIBLE
- BADGE_ELIGIBLE
- LIFECYCLE_STATUS

---

## API LAYER

### VERIFY

app/api/verify/[registryId]/route.ts

Responsibilities:
- Fetch record from Snowflake
- Build verification payload
- Sign payload using Ed25519
- Return proof

Must:
- Use no-store caching
- Support CORS
- Not compute lifecycle or eligibility

---

### BADGE

app/api/badge/[registryId]/route.ts

Responsibilities:
- Determine badge output
- Use BADGE_ELIGIBLE
- Respect lifecycle

Must:
- Not compute certification logic

---

### REGISTRY

app/api/registry/route.ts  
app/api/registry/search/route.ts

Purpose:
- Provide registry browsing endpoints

---

### PUBLIC KEY

app/api/.well-known/gafaig-public-key/route.ts

Purpose:
- Expose Ed25519 public key

---

## STYLES

styles/
- global CSS and layout styling

---

## DOCUMENTATION

docs/
├── MASTER_STATE.md
├── CURRENT_FOCUS.md
├── ENGINEERING_RULES.md
├── GAFAIG_ACTIVE_FILE_MAP.md
├── GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├── GAFAIG_VS_CODE_File_Tree.md
├── CANONICAL_RUN_ORDER.md
├── PAGE_LAYOUT_SYSTEM.md
├── PUBLIC_PAGE_TEMPLATE_MAP.md
├── PUBLIC_PAGE_AUDIT.md
├── VERIFICATION_SIGNATURE_CONTRACT.md
├── VERIFIED_DEFINITION.md
├── VERSIONING.md

---

## ENVIRONMENT FILE

.env.local

Contains:
- Snowflake connection config
- NEXT_PUBLIC_BASE_URL

---

## DEPLOYMENT

Vercel project:
gafaig-vercel

Production:
https://www.gafaig.com

---

## TEST COMMANDS

Local:
npm run dev  
npm run build  

Browser:
gafaig.version  
gafaig.verify("GAFAIG-00363095").then(console.log)

---

## CURRENT STATE

✔ SDK working  
✔ Verify API working  
✔ Snowflake public view updated (Phase 6)  
✔ Developers + Framework pages updated  
✔ Footer updated  
✔ Registry system operational  

🔴 NEXT:
Align VS Code files to Phase 6 contract:
- types/registry.ts
- lib/queries/registry.ts
- app/api/verify/[registryId]/route.ts

---

## END STATE

VS Code layer becomes:
- thin projection layer
- no business logic
- no trust computation
- full alignment with Snowflake contract

GAFAIG becomes:
- deterministic system
- verifiable registry
- cryptographic trust layer
- enterprise-ready platform