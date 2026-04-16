# GAFAIG_ACTIVE_FILE_MAP.md  
Last Updated: 2026-04-16

---

## SYSTEM OVERVIEW

GAFAIG (Global Authority for AI Governance) is a deterministic AI governance registry and verification engine.

Architecture is strictly enforced:

PRIVATE LAYER (Snowflake) → PUBLIC LAYER (Views → API → UI)

Canonical flow:

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

Snowflake is the single source of truth.  
No computation is allowed in API or UI layers.

---

## CORE SNOWFLAKE STRUCTURE

### DATABASE
GAFAIG_DB

### SCHEMA
CORE

---

## CORE TABLES (PRIVATE ENGINE)

### APPLICATION LAYER
- CORE.APPLICATIONS

### VERIFICATION LAYER
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS

### SCORING + DECISION
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.DECISIONS

### REGISTRY (APPEND-ONLY)
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

---

## CORE VIEWS (PUBLIC TRUST LAYER)

### REGISTRY
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED
- CORE.V_REGISTRY_PUBLIC_SEARCH

### AI SYSTEMS
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

### VERIFICATION DETAIL
- CORE.V_VERIFICATION_CASE_DETAIL

### SCORING
- CORE.V_GOVERNANCE_SCORE_CASE

---

## CORE PROCEDURES

- CORE.SP_CREATE_CASE_FROM_APPLICATION
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

## CANONICAL SEED FILE

PRIMARY (ONLY ACTIVE SEED FILE):

- GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

This file seeds:
- APPLICATIONS
- CASES
- FINDINGS
- EVIDENCE
- EVENTS
- SYSTEMS

No secondary seed files allowed.

---

## API LAYER (NEXT.JS)

### REGISTRY
- app/api/registry/route.ts
- app/api/registry/search/route.ts
- app/api/registry/[registryId]/route.ts
- app/api/registry/[registryId]/ai-systems/route.ts

### EXPLORER
- app/api/explorer/route.ts

### VERIFICATION
- app/api/verify/[registryId]/route.ts
- app/api/.well-known/gafaig-public-key/route.ts

### BADGE
- app/api/badge/[registryId]/route.ts

---

## QUERY LAYER (CRITICAL)

### EXPLORER
- lib/queries/explorer.ts

Functions:
- getExplorerSummary()
- getRecentRegistryRecords()
- getExplorerOrganizations()
- getExplorerCountries()
- getExplorerSystems()

### REGISTRY
- lib/queries/registry.ts

Functions:
- getRegistryList()
- searchRegistryRecords()

### AI SYSTEMS
- lib/queries/registry-ai-systems.ts

Functions:
- getRegistryAiSystemsPaginated()
- getRegistryAiSystemsByRegistryId()
- getRelatedRegistryAiSystems()

---

## UI PAGES (PUBLIC)

### CORE MARKETING PAGES (CANONICAL LAYOUT)
- app/page.tsx (Home)
- app/mission/page.tsx
- app/framework/page.tsx

### EXPLORER
- app/explorer/page.tsx
- app/explorer/organizations/page.tsx
- app/explorer/countries/page.tsx
- app/explorer/systems/page.tsx

### REGISTRY
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx
- app/registry/ai-systems/page.tsx
- app/registry/ai-systems/[systemId]/page.tsx

### VERIFY
- app/verify/page.tsx

### WIDGET
- app/widget-preview/[registryId]/page.tsx

---

## SHARED UI COMPONENTS (CRITICAL)

### LAYOUT SYSTEM (MANDATORY)
- app/_components/PublicPageHero.tsx

Controls:
- Page width (max-w-[1180px])
- Heading scale
- Paragraph scale
- Spacing rhythm
- Hero container styling

### BUTTON SYSTEM
- app/_components/PublicButtonLink.tsx

Variants:
- primary
- secondary
- ghost

---

## LAYOUT RULES (NON-NEGOTIABLE)

ALL pages must:

- Use PublicPageHero
- Use max-w-[1180px] container
- Use px-6 horizontal padding
- Use consistent spacing (space-y-8)
- Use border-black/10 (NOT custom borders)
- Use rounded-3xl containers
- Use bg-white surfaces

NO custom layout systems allowed.

---

## TRUST SURFACE DEFINITIONS

### EXPLORER
- Broad surface
- Includes:
  - Approved systems
  - Certified systems
- NOT authoritative

### REGISTRY
- Narrow surface
- Includes:
  - Certified records only
- Authoritative public record

---

## DATA CONTRACT RULES

- All scores come from V_GOVERNANCE_SCORE_CASE
- Registry data must come from REGISTRY_SNAPSHOTS
- Public APIs must use views only
- No derived trust logic in UI

---

## CURRENT ACTIVE WORK

### PRIMARY FOCUS

1. Explorer + Registry alignment
2. Seed data correctness
3. Trust surface clarity
4. Layout standardization

---

## KNOWN ISSUES (IN PROGRESS)

- Explorer summary pills must reflect:
  - total systems (public surface)
  - certified subset
  - approved subset
  - distinct countries

- Registry page must match:
  - PublicPageHero layout
  - Explorer spacing system

- Explorer page must maintain:
  - navigation pills (Organizations / Countries / Systems)
  - correct trust badge rendering

---

## NEXT EXECUTION STEPS

1. Lock Explorer summary logic
2. Validate seed data consistency
3. Align all explorer subpages
4. Align registry detail pages
5. Finalize trust surface UX

---

## DO NOT BREAK

- Snowflake is the source of truth
- No UI-derived scoring
- No duplicate seed files
- No layout deviations from PublicPageHero
- No renaming of canonical fields without updating ALL layers

---

END OF FILE