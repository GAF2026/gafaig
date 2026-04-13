# GAFAIG ACTIVE FILE MAP

DATE: 2026-04-13

This document defines the actively used files in the GAFAIG system during the current development phase.

This is NOT a full repository map.  
This is the execution map for the current phase: Trust Surface Completion.

----------------------------------------
CURRENT PHASE
----------------------------------------

Trust Surface Completion + UI Consistency + External Trust Surfaces

Focus:
- Finalize all public-facing pages
- Ensure visual consistency across all trust surfaces
- Enable external verification via widget
- Stabilize API access (CORS)

----------------------------------------
CORE APPLICATION FILES
----------------------------------------

These are the primary files currently being edited and iterated.

----------------------------------------
REGISTRY (PRIMARY TRUST SURFACE)
----------------------------------------

app/registry/page.tsx  
- Public registry list page  
- Displays certified entities  
- Includes search + filters  
- Must match Explorer and Mission layout  

app/registry/[registryId]/page.tsx  
- Registry detail page  
- Displays certification record  
- Includes trust signals and metadata  
- Uses RegistryTrustTools component  

----------------------------------------
EXPLORER (DISCOVERY LAYER)
----------------------------------------

app/explorer/page.tsx  
- Explorer landing page  

app/explorer/organizations/page.tsx  
- Organization-level exploration  

app/explorer/systems/page.tsx  
- AI systems exploration  

app/explorer/countries/page.tsx  
- Country-level exploration  

lib/queries/explorer.ts  
- Query layer for explorer  
- Pulls from Snowflake views  
- Must remain deterministic  

----------------------------------------
BADGE (TRUST ARTIFACT)
----------------------------------------

app/badge/[registryId]/route.ts  
- Badge endpoint (HTML response)  
- Public trust artifact  
- Must align visually with GAFAIG UI  

app/badge-preview/[registryId]/page.tsx  
- Human-facing badge preview  
- Used for testing and demonstration  

----------------------------------------
WIDGET (EXTERNAL TRUST SURFACE)
----------------------------------------

public/widget/gafaig-widget.js  
- Embeddable widget  
- Fetches data from public APIs  
- Must work cross-origin  
- Must fail gracefully  

app/widget-preview/[registryId]/page.tsx  
- Widget preview page  
- Must mirror widget exactly  
- Used for testing and demos  

docs/test-widget.html  
- External test harness  
- Used with Live Server  
- Validates widget outside GAFAIG  

----------------------------------------
TRUST COMPONENTS
----------------------------------------

components/registry/RegistryTrustTools.tsx  
- Shared trust distribution component  
- Provides:
  - verify endpoint links  
  - badge embed  
  - widget embed  

components/registry/RegistryVerificationPanel.tsx  
- Displays verification data  
- Used on registry detail page  

components/ui/StatusChip.tsx  
- Standardized status display  
- Used across pages  

----------------------------------------
API LAYER (PUBLIC ACCESS)
----------------------------------------

app/api/registry/route.ts  
- Registry search + fetch endpoint  
- Uses V_REGISTRY_PUBLIC  

app/api/verify/[registryId]/route.ts  
- Verification endpoint  
- Returns signed trust payload  

RULE:
- Must include CORS headers  
- Must support OPTIONS requests  

----------------------------------------
QUERY LAYER
----------------------------------------

lib/queries/registry.ts  
- Registry data access  
- Uses V_REGISTRY_PUBLIC  

lib/queries/registry-ai-systems.ts  
- AI systems registry queries  

lib/queries/explorer.ts  
- Explorer queries  

RULE:
- Must only use canonical views  
- Must not compute business logic  

----------------------------------------
SNOWFLAKE (SOURCE OF TRUTH)
----------------------------------------

All data originates from Snowflake:

Database:
- GAFAIG_DB

Schema:
- CORE

Key objects:
- CORE.V_REGISTRY_PUBLIC  
- CORE.V_REGISTRY_LATEST_APPROVED  
- CORE.V_GOVERNANCE_SCORE_CASE  
- CORE.REGISTRY_SNAPSHOTS  
- CORE.REGISTRY_AI_SYSTEMS  

RULE:
- No direct table usage in UI  
- Only use views  

----------------------------------------
DEPLOYMENT
----------------------------------------

Repository:
- GitHub: GAF2026/gafaig  

Hosting:
- Vercel  

Production:
- https://www.gafaig.com  

----------------------------------------
CURRENTLY MODIFIED FILES (ACTIVE WORK)
----------------------------------------

These files are actively being refined:

- public/widget/gafaig-widget.js  
- app/widget-preview/[registryId]/page.tsx  
- app/badge/[registryId]/route.ts  
- app/badge-preview/[registryId]/page.tsx  
- app/registry/page.tsx  
- app/registry/[registryId]/page.tsx  
- lib/queries/explorer.ts  
- app/api/verify/[registryId]/route.ts  
- app/api/registry/route.ts  

----------------------------------------
NEXT FILES TO TOUCH (ORDERED)
----------------------------------------

1. app/api/verify/[registryId]/route.ts  
2. app/api/registry/route.ts  
3. public/widget/gafaig-widget.js  
4. app/widget-preview/[registryId]/page.tsx  
5. app/badge/[registryId]/route.ts  
6. app/registry/[registryId]/page.tsx  
7. components/registry/RegistryTrustTools.tsx  
8. app/page.tsx  

----------------------------------------
RULES FOR THIS FILE MAP
----------------------------------------

- Only include actively used files  
- Do not list unused or deprecated files  
- Keep aligned with CURRENT_FOCUS.md  
- Update when execution order changes  

----------------------------------------
PURPOSE
----------------------------------------

This file ensures:

- No confusion about what to work on  
- No wasted effort on inactive files  
- Strict execution order  
- Alignment across sessions  

----------------------------------------
FINAL NOTE
----------------------------------------

This is the execution map.

Follow it strictly.

One file at a time.

No drift.# GAFAIG ACTIVE FILE MAP

DATE: 2026-04-13

This document defines the actively used files in the GAFAIG system during the current development phase.

This is NOT a full repository map.  
This is the execution map for the current phase: Trust Surface Completion.

----------------------------------------
CURRENT PHASE
----------------------------------------

Trust Surface Completion + UI Consistency + External Trust Surfaces

Focus:
- Finalize all public-facing pages
- Ensure visual consistency across all trust surfaces
- Enable external verification via widget
- Stabilize API access (CORS)

----------------------------------------
CORE APPLICATION FILES
----------------------------------------

These are the primary files currently being edited and iterated.

----------------------------------------
REGISTRY (PRIMARY TRUST SURFACE)
----------------------------------------

app/registry/page.tsx  
- Public registry list page  
- Displays certified entities  
- Includes search + filters  
- Must match Explorer and Mission layout  

app/registry/[registryId]/page.tsx  
- Registry detail page  
- Displays certification record  
- Includes trust signals and metadata  
- Uses RegistryTrustTools component  

----------------------------------------
EXPLORER (DISCOVERY LAYER)
----------------------------------------

app/explorer/page.tsx  
- Explorer landing page  

app/explorer/organizations/page.tsx  
- Organization-level exploration  

app/explorer/systems/page.tsx  
- AI systems exploration  

app/explorer/countries/page.tsx  
- Country-level exploration  

lib/queries/explorer.ts  
- Query layer for explorer  
- Pulls from Snowflake views  
- Must remain deterministic  

----------------------------------------
BADGE (TRUST ARTIFACT)
----------------------------------------

app/badge/[registryId]/route.ts  
- Badge endpoint (HTML response)  
- Public trust artifact  
- Must align visually with GAFAIG UI  

app/badge-preview/[registryId]/page.tsx  
- Human-facing badge preview  
- Used for testing and demonstration  

----------------------------------------
WIDGET (EXTERNAL TRUST SURFACE)
----------------------------------------

public/widget/gafaig-widget.js  
- Embeddable widget  
- Fetches data from public APIs  
- Must work cross-origin  
- Must fail gracefully  

app/widget-preview/[registryId]/page.tsx  
- Widget preview page  
- Must mirror widget exactly  
- Used for testing and demos  

docs/test-widget.html  
- External test harness  
- Used with Live Server  
- Validates widget outside GAFAIG  

----------------------------------------
TRUST COMPONENTS
----------------------------------------

components/registry/RegistryTrustTools.tsx  
- Shared trust distribution component  
- Provides:
  - verify endpoint links  
  - badge embed  
  - widget embed  

components/registry/RegistryVerificationPanel.tsx  
- Displays verification data  
- Used on registry detail page  

components/ui/StatusChip.tsx  
- Standardized status display  
- Used across pages  

----------------------------------------
API LAYER (PUBLIC ACCESS)
----------------------------------------

app/api/registry/route.ts  
- Registry search + fetch endpoint  
- Uses V_REGISTRY_PUBLIC  

app/api/verify/[registryId]/route.ts  
- Verification endpoint  
- Returns signed trust payload  

RULE:
- Must include CORS headers  
- Must support OPTIONS requests  

----------------------------------------
QUERY LAYER
----------------------------------------

lib/queries/registry.ts  
- Registry data access  
- Uses V_REGISTRY_PUBLIC  

lib/queries/registry-ai-systems.ts  
- AI systems registry queries  

lib/queries/explorer.ts  
- Explorer queries  

RULE:
- Must only use canonical views  
- Must not compute business logic  

----------------------------------------
SNOWFLAKE (SOURCE OF TRUTH)
----------------------------------------

All data originates from Snowflake:

Database:
- GAFAIG_DB

Schema:
- CORE

Key objects:
- CORE.V_REGISTRY_PUBLIC  
- CORE.V_REGISTRY_LATEST_APPROVED  
- CORE.V_GOVERNANCE_SCORE_CASE  
- CORE.REGISTRY_SNAPSHOTS  
- CORE.REGISTRY_AI_SYSTEMS  

RULE:
- No direct table usage in UI  
- Only use views  

----------------------------------------
DEPLOYMENT
----------------------------------------

Repository:
- GitHub: GAF2026/gafaig  

Hosting:
- Vercel  

Production:
- https://www.gafaig.com  

----------------------------------------
CURRENTLY MODIFIED FILES (ACTIVE WORK)
----------------------------------------

These files are actively being refined:

- public/widget/gafaig-widget.js  
- app/widget-preview/[registryId]/page.tsx  
- app/badge/[registryId]/route.ts  
- app/badge-preview/[registryId]/page.tsx  
- app/registry/page.tsx  
- app/registry/[registryId]/page.tsx  
- lib/queries/explorer.ts  
- app/api/verify/[registryId]/route.ts  
- app/api/registry/route.ts  

----------------------------------------
NEXT FILES TO TOUCH (ORDERED)
----------------------------------------

1. app/api/verify/[registryId]/route.ts  
2. app/api/registry/route.ts  
3. public/widget/gafaig-widget.js  
4. app/widget-preview/[registryId]/page.tsx  
5. app/badge/[registryId]/route.ts  
6. app/registry/[registryId]/page.tsx  
7. components/registry/RegistryTrustTools.tsx  
8. app/page.tsx  

----------------------------------------
RULES FOR THIS FILE MAP
----------------------------------------

- Only include actively used files  
- Do not list unused or deprecated files  
- Keep aligned with CURRENT_FOCUS.md  
- Update when execution order changes  

----------------------------------------
PURPOSE
----------------------------------------

This file ensures:

- No confusion about what to work on  
- No wasted effort on inactive files  
- Strict execution order  
- Alignment across sessions  

----------------------------------------
FINAL NOTE
----------------------------------------

This is the execution map.

Follow it strictly.

One file at a time.

No drift.