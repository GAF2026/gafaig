# GAFAIG_VS_CODE_File_Tree.md
Last Updated: 2026-04-10

============================================================
GAFAIG — FULL VS CODE FILE TREE (CANONICAL)
============================================================

This document reflects the current, active VS Code file structure for the GAFAIG platform after stabilization.

All files listed are:
- Actively used
- Aligned with Snowflake
- Compatible with current build and runtime

------------------------------------------------------------
ROOT DIRECTORY
------------------------------------------------------------

gafaig/
├─ .next/                         (build output — ignore)
├─ .vercel/                       (deployment metadata)
├─ node_modules/                  (dependencies — ignore)

├─ app/
├─ components/
├─ lib/
├─ types/
├─ public/
├─ docs/

├─ .env.local
├─ package.json
├─ tsconfig.json
├─ next.config.js
├─ README.md

------------------------------------------------------------
APP DIRECTORY (NEXT.JS APP ROUTER)
------------------------------------------------------------

app/

├─ page.tsx                      (homepage)

------------------------------------------------------------
REGISTRY (PUBLIC)
------------------------------------------------------------

├─ registry/
│  ├─ page.tsx                  (registry list page)
│  ├─ [registryId]/
│  │  └─ page.tsx              (registry detail page)
│  └─ ai-systems/
│     └─ page.tsx              (AI systems registry page)

------------------------------------------------------------
EXPLORER
------------------------------------------------------------

├─ explorer/
│  ├─ page.tsx                 (explorer overview)
│  ├─ organizations/
│  │  └─ page.tsx
│  ├─ countries/
│  │  └─ page.tsx
│  └─ systems/
│     └─ page.tsx

------------------------------------------------------------
API ROUTES
------------------------------------------------------------

├─ api/

│  ├─ registry/
│  │  └─ route.ts              (registry endpoint)

│  ├─ explorer/
│  │  └─ route.ts              (explorer endpoint)

│  ├─ verify/
│  │  └─ [registryId]/
│  │     └─ route.ts           (verification proof endpoint)

│  ├─ badge/
│  │  └─ [registryId]/
│  │     └─ route.ts           (badge endpoint)

│  ├─ .well-known/
│  │  └─ gafaig-public-key/
│  │     └─ route.ts           (public key endpoint)

------------------------------------------------------------
ADMIN (VERIFICATION WORKFLOW)
------------------------------------------------------------

├─ admin/

│  ├─ login/
│  │  └─ page.tsx

│  ├─ applications/
│  │  └─ page.tsx

│  ├─ verification/
│  │  └─ [caseId]/
│  │     ├─ page.tsx
│  │     ├─ findings/
│  │     │  └─ page.tsx
│  │     └─ decisions/
│  │        └─ page.tsx

------------------------------------------------------------
SHARED COMPONENTS
------------------------------------------------------------

components/

├─ ui/
│  ├─ StatusChip.tsx
│  ├─ Button.tsx
│  └─ Table.tsx

├─ registry/
│  ├─ RegistryHeaderPanel.tsx
│  ├─ RegistryCertificationSummary.tsx
│  ├─ RegistryVerificationPanel.tsx

├─ explorer/
│  ├─ ExplorerSummary.tsx
│  ├─ ExplorerTable.tsx

├─ _components/
│  ├─ PublicButton.tsx
│  ├─ PublicButtonLink.tsx
│  ├─ PublicPageHero.tsx

------------------------------------------------------------
QUERY LAYER (CRITICAL)
------------------------------------------------------------

lib/

├─ queries/

│  ├─ registry.ts
│  │  → CORE.V_REGISTRY_PUBLIC
│  │  → Minimal schema aligned

│  ├─ explorer.ts
│  │  → Fully patched
│  │  → Uses only valid Snowflake fields
│  │  → Provides compatibility fields:
│  │     organizationCount, registryCount, decisionStatus, etc.

│  ├─ registry-ai-systems.ts
│     → CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

------------------------------------------------------------
SNOWFLAKE CONNECTION
------------------------------------------------------------

lib/

├─ snowflake.ts
   → JWT key-pair authentication
   → Uses:
      SNOWFLAKE_PRIVATE_KEY
      SNOWFLAKE_ACCOUNT
      SNOWFLAKE_ROLE
   → No longer relies on password auth

------------------------------------------------------------
AUTH / SECURITY
------------------------------------------------------------

lib/

├─ auth/
│  ├─ requireAdmin.ts

├─ crypto/
│  ├─ sign.ts
│  ├─ verify.ts

------------------------------------------------------------
TYPES
------------------------------------------------------------

types/

├─ registry.ts
├─ explorer.ts
├─ api.ts

------------------------------------------------------------
PUBLIC ASSETS
------------------------------------------------------------

public/

├─ badge/
├─ images/
├─ favicon.ico

------------------------------------------------------------
DOCUMENTATION
------------------------------------------------------------

docs/

├─ MASTER_STATE.md
├─ CURRENT_FOCUS.md
├─ ENGINEERING_RULES.md
├─ PROJECT_INDEX.md
├─ CHANGELOG.md

├─ GAFAIG_ACTIVE_FILE_MAP.md
├─ GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md
├─ GAFAIG_VS_CODE_File_Tree.md

------------------------------------------------------------
CURRENT STATE SUMMARY
------------------------------------------------------------

✔ Build passes (Next.js + TypeScript)
✔ All pages render without runtime crashes
✔ Snowflake connection stable (JWT auth)
✔ Query layer fully aligned with minimal schema
✔ Explorer + Registry functional

------------------------------------------------------------
KNOWN LIMITATIONS
------------------------------------------------------------

Current mode: MINIMAL REGISTRY

Missing fields in Snowflake:
- ENTITY_TYPE
- CERTIFIED_SCORE / TIER / BAND
- CERTIFIED_AT
- VALID_FROM / VALID_TO

These are temporarily removed from UI logic.

------------------------------------------------------------
NEXT PHASE
------------------------------------------------------------

Rebuild Snowflake layer:

→ CORE.V_REGISTRY_PUBLIC (ENRICHED)

Then:

→ Upgrade query layer
→ Restore full UI fields
→ Remove placeholders from explorer.ts

------------------------------------------------------------
DO NOT BREAK RULES
------------------------------------------------------------

- Do NOT add fields in frontend not in Snowflake
- Do NOT compute certification in UI
- Do NOT bypass publish procedure
- Do NOT modify working connection layer

------------------------------------------------------------
END OF FILE
------------------------------------------------------------