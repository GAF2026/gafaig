# GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-04-16

---

## SYSTEM OVERVIEW

GAFAIG (Global Authority for AI Governance) is a deterministic AI governance registry and verification engine.

Architecture is strictly enforced:

PRIVATE VERIFICATION ENGINE (Snowflake) → PUBLIC TRUST LAYER (Views → API → UI)

Canonical data flow:

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

Snowflake is the single source of truth.
No computation is allowed in API or UI layers.

---

## CORE SNOWFLAKE STRUCTURE

DATABASE: GAFAIG_DB
SCHEMA: CORE

---

## CORE TABLES (PRIVATE ENGINE)

APPLICATION LAYER
- CORE.APPLICATIONS

VERIFICATION LAYER
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS

SCORING + DECISION
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.DECISIONS

REGISTRY (APPEND-ONLY)
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

---

## CORE VIEWS (PUBLIC TRUST LAYER)

REGISTRY (AUTHORITATIVE)
- CORE.V_REGISTRY_PUBLIC (CANONICAL TRUST SURFACE)
- CORE.V_REGISTRY_LATEST_APPROVED

AI SYSTEMS
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

EXPLORER / AGGREGATION
- CORE.V_REGISTRY_STATS_GLOBAL
- CORE.V_REGISTRY_STATS_BY_COUNTRY
- CORE.V_REGISTRY_STATS_BY_STATUS
- CORE.V_REGISTRY_STATS_BY_TIER
- CORE.V_REGISTRY_STATS_BY_BAND
- CORE.V_REGISTRY_STATS_BY_ENTITY_TYPE

VERIFICATION DETAIL
- CORE.V_VERIFICATION_CASE_DETAIL

SCORING
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_SCORE_BREAKDOWN_PUBLIC
- CORE.V_SCORE_DIMENSIONS_PUBLIC

---

## CORE PROCEDURES

- CORE.SP_CREATE_CASE_FROM_APPLICATION
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.APPROVE_CASE_V1
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

## CANONICAL SEED STRATEGY

PRIMARY (ONLY ACTIVE SEED FILE):

- GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

RULES:
- This is the ONLY seed file allowed
- Seeds full pipeline:
  APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY → SYSTEMS
- No parallel seed systems allowed

ARCHIVED (DO NOT USE):
- CANONICAL_DEMO_SEED_MASTER.sql
- FINAL_CANONICAL_CASE_0001_SEED.sql
- SAFE_MULTI_CASE_EXPANSION V2.sql
- Any “Demo”, “Legacy”, or “Expansion” seed variants

---

## CRITICAL VIEW CONTRACT FILES

THESE FILES DEFINE THE ENTIRE PUBLIC TRUST SURFACE:

1. 21_VIEWS_PUBLIC_REGISTRY.sql
   - MUST enforce:
     - Approved ≠ Certified
     - Correct CERTIFIED_AT semantics
     - Proper lifecycle states
   - THIS IS THE ROOT OF ALL PUBLIC DATA

2. 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
   - Canonical AI systems public surface
   - Joins to V_REGISTRY_PUBLIC on CASE_ID
   - Must not fabricate trust logic

3. 22_VIEWS_EXPLORER_STATS.sql
   - Aggregation layer for explorer counts
   - Must align with actual registry/system truth
   - Must not double count or misclassify states

4. GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql
   - Public score explanation layer
   - Must align with CASE_SCORE_SNAPSHOTS
   - Depends on correct registry semantics

---

## API LAYER (NEXT.JS)

REGISTRY
- app/api/registry/route.ts
- app/api/registry/search/route.ts
- app/api/registry/[registryId]/route.ts
- app/api/registry/[registryId]/ai-systems/route.ts

EXPLORER
- app/api/explorer/route.ts

VERIFICATION
- app/api/verify/[registryId]/route.ts
- app/api/.well-known/gafaig-public-key/route.ts

BADGE
- app/api/badge/[registryId]/route.ts

---

## QUERY LAYER (CRITICAL)

EXPLORER
- lib/queries/explorer.ts
  Functions:
  - getExplorerSummary()
  - getRecentRegistryRecords()
  - getExplorerOrganizations()
  - getExplorerCountries()
  - getExplorerSystems()

REGISTRY
- lib/queries/registry.ts
  Functions:
  - getRegistryList()
  - searchRegistryRecords()

AI SYSTEMS
- lib/queries/registry-ai-systems.ts
  Functions:
  - getRegistryAiSystemsPaginated()
  - getRegistryAiSystemsByRegistryId()
  - getRelatedRegistryAiSystems()

---

## UI PAGES (PUBLIC)

CANONICAL LAYOUT PAGES
- app/page.tsx
- app/mission/page.tsx
- app/framework/page.tsx

EXPLORER
- app/explorer/page.tsx
- app/explorer/organizations/page.tsx
- app/explorer/countries/page.tsx
- app/explorer/systems/page.tsx

REGISTRY
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx
- app/registry/ai-systems/page.tsx
- app/registry/ai-systems/[systemId]/page.tsx

VERIFY
- app/verify/page.tsx

WIDGET
- app/widget-preview/[registryId]/page.tsx

---

## SHARED UI COMPONENTS

LAYOUT SYSTEM (MANDATORY)
- app/_components/PublicPageHero.tsx
  Controls:
  - Page width (max-w-[1180px])
  - Typography scale
  - Spacing rhythm
  - Hero structure

BUTTON SYSTEM
- app/_components/PublicButtonLink.tsx

---

## LAYOUT RULES (NON-NEGOTIABLE)

ALL pages must:
- Use PublicPageHero
- Use max-w-[1180px]
- Use px-6 padding
- Use space-y-8 section spacing
- Use rounded-3xl containers
- Use border-black/10
- Use bg-white surfaces

NO custom layout systems allowed.

---

## TRUST SURFACE DEFINITIONS

EXPLORER
- Broad surface
- Shows:
  - Approved systems
  - Certified systems
- NOT authoritative

REGISTRY
- Narrow surface
- Shows:
  - Certified records only
- Authoritative public record

---

## DATA CONTRACT RULES

- All scores come from V_GOVERNANCE_SCORE_CASE
- Registry data must originate from REGISTRY_SNAPSHOTS
- Public views are projections only
- No trust logic in UI or API
- No recomputation outside Snowflake

---

## CURRENT ACTIVE WORK

PRIMARY FOCUS:

1. Snowflake canonicalization (in progress)
2. Fix V_REGISTRY_PUBLIC semantics
3. Align Explorer stats with real data
4. Validate seed integrity
5. Eliminate duplicate/legacy SQL files
6. Restore deterministic trust surface

---

## KNOWN ISSUES (IN PROGRESS)

- Approved vs Certified incorrectly conflated in V_REGISTRY_PUBLIC
- Explorer summary pills not aligned with seed data
- Legacy seed files causing drift
- Stats layer not aligned with actual registry/system data
- UI inconsistencies driven by backend data errors

---

## NEXT EXECUTION STEPS

1. Fix 21_VIEWS_PUBLIC_REGISTRY.sql
2. Fix 22_VIEWS_EXPLORER_STATS.sql
3. Re-run canonical seed
4. Validate pipeline outputs
5. Align UI to corrected data
6. Archive non-canonical files

---

## DO NOT BREAK

- Snowflake is the source of truth
- No UI-derived scoring
- No duplicate seed systems
- No deviation from canonical data flow
- No mixing of Approved and Certified states
- No layout drift from PublicPageHero system

---

END OF FILE