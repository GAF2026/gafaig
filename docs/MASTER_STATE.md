# GAFAIG MASTER STATE

GAFAIG (Global Authority for AI Governance) is the world’s first deterministic AI governance registry. It functions as a global trust infrastructure layer for AI systems, analogous to financial audit systems, certificate authorities, and regulatory registries.

The system is designed as a dual-layer architecture:

1. Private Verification Engine (controlled environment)
2. Public Registry of Record (trust surface)

Snowflake is the single source of truth. All computation, scoring, certification, and registry state originate exclusively in Snowflake. The Next.js application is a presentation and transport layer only.

----------------------------------------
CORE SYSTEM FLOW (LOCKED)
----------------------------------------

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

This flow is deterministic and append-only. No step may be bypassed or computed outside Snowflake.

----------------------------------------
PRIVATE VERIFICATION ENGINE
----------------------------------------

The private engine processes governance assessments using structured workflows:

- CASE: Root verification object
- FINDINGS: Control-level evaluation results
- EVIDENCE: Supporting documentation (private)
- EVENTS: Audit trail of actions
- SCORING: Deterministic scoring (Snowflake only)
- DECISION: Final certification outcome

All scoring outputs must come from canonical Snowflake views such as:

- V_GOVERNANCE_SCORE_CASE
- V_CASE_TIER_BAND
- V_CASE_RENEWAL_STATUS

No scoring logic is permitted in the API or UI layer.

----------------------------------------
PUBLIC REGISTRY (TRUST SURFACE)
----------------------------------------

The public registry is an immutable, append-only record of certification outcomes.

Core table:
- CORE.REGISTRY_SNAPSHOTS

Publishing is performed exclusively via stored procedures:
- SP_PUBLISH_CASE_TO_REGISTRY_V3 (primary)
- SP_PUBLISH_CASE_TO_REGISTRY_V4 (variant)

Key rules:
- Registry is append-only
- Each publish creates a new snapshot
- REGISTRY_ID is reused for the same entity
- Snapshots are immutable

----------------------------------------
CANONICAL PUBLIC VIEWS
----------------------------------------

The UI and APIs consume only canonical Snowflake views:

- V_REGISTRY_LATEST_APPROVED
- V_REGISTRY_PUBLIC
- V_REGISTRY_PUBLIC_SEARCH
- V_REGISTRY_AI_SYSTEMS_PUBLIC

These views provide:
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT
- DECISION_STATUS
- ENTITY_NAME
- COUNTRY
- ENTITY_TYPE

No direct table access is allowed from the application layer.

----------------------------------------
APPLICATION ARCHITECTURE
----------------------------------------

Frontend:
- Next.js (App Router)
- TypeScript
- Tailwind CSS

Backend:
- Snowflake (all logic + data)

Hosting:
- Vercel (production)

Query Layer:
- lib/queries/*.ts
- Uses sfQuery() from lib/snowflake.ts

API Layer:
- Thin transport only
- No business logic
- No scoring
- No mutation of truth

----------------------------------------
PUBLIC TRUST SURFACES
----------------------------------------

GAFAIG exposes multiple public verification surfaces:

1. Registry Pages
   - /registry
   - /registry/[registryId]

2. Explorer
   - /explorer
   - /explorer/organizations
   - /explorer/systems
   - /explorer/countries

3. Verification API
   - /api/verify/[registryId]

4. Badge Endpoint
   - /badge/[registryId] (route-based response)

5. Widget
   - public/widget/gafaig-widget.js

6. Widget Preview
   - /widget-preview/[registryId]

7. Badge Preview
   - /badge-preview/[registryId]

These surfaces allow third parties to independently verify governance status without accessing private data.

----------------------------------------
REGISTRY AI SYSTEMS
----------------------------------------

Core table:
- CORE.REGISTRY_AI_SYSTEMS

Public view:
- V_REGISTRY_AI_SYSTEMS_PUBLIC

Fields include:
- SYSTEM_NAME
- SYSTEM_TYPE
- INTENDED_USE
- DEPLOYMENT_STATUS
- RISK_TIER
- DEVELOPER_ORGANIZATION
- HUMAN_REVIEW_REQUIRED
- AUDIT_FREQUENCY

This powers system-level transparency within the registry.

----------------------------------------
ENGINEERING RULES (STRICT)
----------------------------------------

- Snowflake is the source of truth
- No scoring in API/UI
- No bypassing publish procedures
- No mutation of registry snapshots
- No UI hacks
- No direct table queries
- Only use canonical views
- Maintain deterministic behavior
- Maintain append-only architecture
- Do not re-architect working systems

----------------------------------------
CURRENT SYSTEM STATUS
----------------------------------------

COMPLETED:
- Core verification pipeline (end-to-end)
- Registry snapshot publishing
- Canonical public views
- Explorer pages (fully aligned UI + data)
- Registry list page (aligned with design system)
- Registry detail page (functional, minor refinements)
- Badge preview page implemented
- Widget rendering externally (functional)
- Query layer stabilization (explorer.ts)

IN PROGRESS:
- Widget stabilization (external reliability)
- Badge route visual alignment
- Registry detail page UI consistency
- Trust surface unification

----------------------------------------
CURRENT PHASE
----------------------------------------

Trust Surface Completion + UI Consistency + External Trust Surfaces

Focus:
- Make GAFAIG externally verifiable
- Ensure all surfaces feel identical
- Ensure API reliability for third-party usage

----------------------------------------
ACTIVE FILES
----------------------------------------

- public/widget/gafaig-widget.js
- app/widget-preview/[registryId]/page.tsx
- app/badge/[registryId]/route.ts
- app/badge-preview/[registryId]/page.tsx
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx
- lib/queries/explorer.ts

----------------------------------------
NEXT EXECUTION PRIORITIES (STRICT ORDER)
----------------------------------------

1. Fix CORS for external widget:
   - app/api/verify/[registryId]/route.ts
   - app/api/registry/route.ts

2. Finalize widget:
   - Reliable fetch
   - Clean fallback state
   - Consistent styling

3. Align badge route output with UI system:
   - Typography
   - spacing
   - trust signaling

4. Standardize registry detail page layout:
   - Match explorer + mission
   - Fix typography + spacing

5. Build shared trust component:
   - components/registry/RegistryTrustTools.tsx

6. Homepage upgrade:
   - Clarify positioning
   - Strengthen trust narrative

----------------------------------------
DEPLOYMENT
----------------------------------------

Repository:
- GitHub: GAF2026/gafaig

Production:
- Vercel
- https://www.gafaig.com

----------------------------------------
KEY PRINCIPLE
----------------------------------------

GAFAIG is not a UI product.

It is a trust infrastructure.

Every decision must reinforce:
- determinism
- verifiability
- independence
- consistency across all trust surfaces