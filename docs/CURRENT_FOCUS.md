# CURRENT_FOCUS.md
Last Updated: 2026-04-14

============================================================
GAFAIG — CURRENT DEVELOPMENT FOCUS
============================================================

This document defines the ACTIVE execution focus for the GAFAIG platform.

It reflects:
- What is COMPLETE
- What is BROKEN
- What must be FIXED NEXT
- What is explicitly OFF-LIMITS

============================================================
CURRENT PHASE
============================================================

PHASE: POST-CANONICAL SEED → APPLICATION STABILIZATION

The Snowflake engine is COMPLETE and FUNCTIONAL.

The system has transitioned from:
- Data pipeline construction

→ to:

- Application layer stabilization

============================================================
WHAT WAS JUST COMPLETED
============================================================

1. Canonical Demo Seed System
   - GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql created
   - Full pipeline executed:
     CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → PUBLISH

2. Snowflake Alignment
   - REGISTRY_SNAPSHOTS schema corrected
   - DECISION_STATUS integrated
   - V_REGISTRY_PUBLIC fully enriched
   - V_REGISTRY_AI_SYSTEMS_PUBLIC aligned

3. Registry ID Policy
   - Sequential policy established
   - Demo normalization performed

4. Registry Detail Page (UI)
   - Certified vs Approved branching implemented
   - Proof rendering controlled correctly

============================================================
CURRENT DATA STATE
============================================================

Snowflake now contains:

- 6 total registry records
- 2 certified records
- 4 approved-only records

All data is correct and verified.

============================================================
PRIMARY PROBLEM (BLOCKER)
============================================================

The application layer is currently BROKEN.

Specifically:

lib/queries/registry.ts

Issues:
- TypeScript interface mismatch
- Missing filter fields expected by API
- Missing exports expected by API
- Incorrect filtering logic previously introduced
- Inconsistent normalization between certified and approved records

Impact:
- Build failures
- Broken /registry page
- Broken /explorer page
- Inconsistent registry detail pages

============================================================
WHAT IS NOT BROKEN
============================================================

DO NOT TOUCH:

- Snowflake tables
- Snowflake views
- Snowflake procedures
- Demo seed files
- Scoring engine
- Publish logic

These are:
✅ Correct
✅ Canonical
✅ Locked

============================================================
ACTIVE OBJECTIVE
============================================================

Stabilize the application layer by fixing:

lib/queries/registry.ts

============================================================
REQUIRED OUTCOME
============================================================

1. Build must pass:
   npm run build → SUCCESS

2. API routes must work:
   - /api/registry
   - /api/registry/search
   - /api/badge/[registryId]

3. Pages must render correctly:
   - /registry → shows ALL records
   - /explorer → shows ALL records
   - /registry/[registryId] → correct certified vs approved display

============================================================
REQUIRED FIXES (STRICT)
============================================================

The registry query layer MUST:

1. Export required functions:
   - getRegistryRecords
   - getRegistryRecord
   - getRegistryByRegistryId
   - searchRegistryRecords
   - getRegistrySummary
   - getRegistryCountries

2. Support all filters used by API:
   - q
   - country
   - registryId
   - caseId
   - applicationId
   - entityName
   - limit
   - offset
   - certifiedOnly

3. Normalize records:
   CERTIFIED:
     - expose certified fields

   APPROVED:
     - certified fields MUST be null

4. NOT filter records by default

============================================================
STRICT DO NOT RULES
============================================================

DO NOT:

- Modify Snowflake
- Modify UI layout
- Add business logic to API
- Create new views
- Introduce alternate data sources
- Re-architect system

============================================================
SUCCESS CRITERIA
============================================================

System is considered stable when:

- Build passes with zero errors
- /registry shows 6 records
- /explorer shows 6 records
- Certified records show:
  - Score
  - Tier
  - Band
  - Proof

- Approved records show:
  - No certification fields
  - No proof
  - Clean UI

============================================================
NEXT PHASE (AFTER FIX)
============================================================

Once stable:

PHASE: REGISTRY EXPERIENCE POLISH

- UX refinement
- Trust signaling
- Explorer enhancements
- Badge system finalization

============================================================
SUMMARY
============================================================

Snowflake = COMPLETE  
Data = CORRECT  
System = FUNCTIONAL  

ONLY remaining issue:
→ Query layer instability

Fix that → Platform is fully operational

============================================================
END
============================================================