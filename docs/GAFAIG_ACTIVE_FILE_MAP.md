# GAFAIG_ACTIVE_FILE_MAP.md  
Last Updated: 2026-04-19

---

## SYSTEM OVERVIEW

GAFAIG (Global Authority for AI Governance) is a deterministic AI governance registry and verification engine.

Architecture is strictly enforced:

PRIVATE LAYER (Snowflake) → PUBLIC LAYER (Views → API → UI)

Canonical flow:

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

Snowflake is the single source of truth.  
No computation is allowed in API or UI layers.  
No derived trust logic is allowed outside Snowflake.

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

### PARTICIPANT / ENTITY LAYER (CANONICAL + COMPATIBILITY)
- CORE.PARTICIPANTS

Purpose:
- Canonical participant/entity surface
- Bridges application, case, and registry identity
- Deterministic PARTICIPANT_ID generation
- Supports registry enrichment and public display

---

### VERIFICATION LAYER
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS

Purpose:
- Core private verification workflow
- All workflow state originates here
- EVENTS table is authoritative (not CORE.EVENTS)

---

### EVENTS COMPATIBILITY LAYER
- CORE.EVENTS

Purpose:
- Compatibility audit/event table
- Mirrors VERIFICATION_EVENTS
- Used for legacy compatibility + diagnostics
- MUST NOT replace VERIFICATION_EVENTS

---

### SCORING + DECISION
- CORE.CASE_SCORE_SNAPSHOTS
- CORE.DECISIONS

Purpose:
- Deterministic scoring (single source: V_GOVERNANCE_SCORE_CASE)
- Immutable scoring snapshots
- Decision issuance layer

---

### REGISTRY (APPEND-ONLY)
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

Purpose:
- Immutable public certification records
- Append-only architecture
- Registry IDs must be deterministic and persistent

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

Rules:
- Views are projections only
- No logic duplication allowed
- No recomputation outside Snowflake

---

## CORE PROCEDURES

- CORE.SP_CREATE_CASE_FROM_APPLICATION
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Purpose:
- Enforce canonical pipeline transitions
- Guarantee deterministic outputs
- Prevent UI/API mutation

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

Rules:
- No secondary seed files allowed
- No legacy seed files allowed
- All test data must originate here

---

## CANONICAL BUILD / REBUILD FILES

- 01_REBUILD_ENVIRONMENT_CANONICAL.sql (FULL SYSTEM RESET)
- 00_CORE_SETUP.sql (environment bootstrap)
- 11_TABLES_APPLICATIONS.sql
- 12_TABLES_PARTICIPANTS.sql (FIXED — deterministic + no ambiguity)
- 14_TABLES_REGISTRY_AI_SYSTEMS.sql
- 15_TABLES_EVENTS.sql (CANONICAL — FIXED alias ambiguity)
- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql
- 17_TABLES_DECISIONS.sql
- 18_TABLES_REGISTRY_ENTITIES.sql

Rules:
- Rebuild requires FULL execution (not partial)
- Order matters
- No mixing canonical and archive files

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

Rules:
- APIs must ONLY query Snowflake views
- No business logic allowed
- No transformations allowed beyond formatting

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

Rules:
- Queries must map 1:1 to views
- No derived fields
- No scoring logic

---

## UI PAGES (PUBLIC)

### CORE MARKETING PAGES
- app/page.tsx
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
- app/verify/[registryId]/page.tsx

### WIDGET
- app/widget-preview/[registryId]/page.tsx

---

## SHARED UI COMPONENTS (CRITICAL)

### LAYOUT SYSTEM
- app/_components/PublicPageHero.tsx

### BUTTON SYSTEM
- app/_components/PublicButtonLink.tsx

Rules:
- These are mandatory
- No alternatives allowed

---

## LAYOUT RULES (NON-NEGOTIABLE)

All pages must:
- Use PublicPageHero
- Use max-w-[1180px]
- Use px-6
- Use space-y-8
- Use rounded-3xl
- Use border-black/10
- Use bg-white

No deviations allowed.

---

## TRUST SURFACE DEFINITIONS

### EXPLORER
- Broad discovery surface
- Includes approved + certified
- NOT authoritative

### REGISTRY
- Certified only
- Authoritative record

---

## DATA CONTRACT RULES

- Scores ONLY from V_GOVERNANCE_SCORE_CASE
- Registry ONLY from REGISTRY_SNAPSHOTS
- APIs ONLY from views
- No UI logic

---

## CURRENT ACTIVE WORK

### PRIMARY FOCUS

1. Multi-case real data seed expansion  
2. Full pipeline validation  
3. Trust distribution (verify + badge + widget)  
4. Explorer + Registry alignment  
5. Layout standardization  

---

## PIPELINE STATUS

APPLICATION → CASE → COMPLETE  
CASE → FINDINGS → COMPLETE  
FINDINGS → EVIDENCE → COMPLETE  
EVIDENCE → EVENTS → COMPLETE  
EVENTS → SCORING → READY  
SCORING → DECISION → READY  
DECISION → REGISTRY → READY  
REGISTRY → API/UI → OPERATIONAL  

---

## KNOWN ISSUES (IN PROGRESS)

- Explorer summary accuracy  
- Registry layout alignment  
- Multi-case seed coverage  
- ID determinism validation across all tables  
- Removal of legacy file interference  

---

## NEXT EXECUTION STEPS

1. Run full canonical rebuild (01_REBUILD_ENVIRONMENT_CANONICAL.sql)  
2. Run canonical seed  
3. Run scoring  
4. Run decision  
5. Run publish  
6. Validate API  
7. Validate verify endpoint  

---

## DO NOT BREAK

- Snowflake = source of truth  
- No UI scoring  
- No duplicate seeds  
- No layout drift  
- No breaking pipeline order  
- No mutation of registry snapshots  
- No non-deterministic IDs  

---

## ENFORCEMENT

This document is the active system map for GAFAIG.  
Any deviation must be corrected immediately.

---

END OF FILE