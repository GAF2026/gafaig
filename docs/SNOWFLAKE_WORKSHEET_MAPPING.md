# GAFAIG — SNOWFLAKE WORKSHEET MAPPING
Last Updated: 2026-03-28

---

# PURPOSE

This file maps the major Snowflake worksheets to their intended purpose so future chats do not lose time re-discovering which worksheet/file is authoritative versus diagnostic versus archive.

---

# CORE PLATFORM WORKSHEETS

## GAFAIG - CORE.REGISTRY_PUBLISH.sql
Purpose:
- Canonical registry publish layer
- Contains / relates to registry publish procedure logic
- Responsible for append-only publish workflow and canonical registry identity behavior
Notes:
- `SP_PUBLISH_CASE_TO_REGISTRY_V3` is a wrapper
- `SP_PUBLISH_CASE_TO_REGISTRY_V4` contains the real publish logic

## 21_VIEWS_PUBLIC_REGISTRY.sql
Purpose:
- Canonical public registry view layer
- Defines / supports public registry surface
- Used by public registry routes and detail pages
Key outputs:
- public certification fields
- public timestamps
- public decision / certification status

## 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
Purpose:
- Canonical public AI-systems registry surface
- Public-facing AI system projection tied to registry records
Notes:
- view includes richer derived output than the base `REGISTRY_AI_SYSTEMS` table
- public routes and organization/system explorer rely on this view

## 22_VIEWS_EXPLORER_STATS.sql
Purpose:
- Explorer metrics and public analytics layer
- Supports aggregate explorer counts and derived public governance metrics

## GAFAIG - Governance Scoring (Enterprise v1.2).sql
Purpose:
- Deterministic enterprise scoring engine
- Scoring model / score generation / certified scoring basis
Notes:
- critical upstream source for registry-certified outputs

## GAFAIG - Canonical Certified Case Seed.sql
Purpose:
- canonical seed used to create a certifiable demo case
- used for validation of scoring + publish + public certification outputs
Notes:
- was used in certification wiring completion and validation of CASE-1001

## DATA_BACKFILL_DEMO_DECISIONS.sql
Purpose:
- demo / data backfill support for decisions-related scenarios
Notes:
- diagnostic / support usage, not the main production publish definition

## 17_TABLES_DECISIONS.sql
Purpose:
- table definition / schema reference for `CORE.DECISIONS`
Notes:
- used to confirm actual live column names during certification-wiring diagnostics

## 14_TABLES_REGISTRY_AI_SYSTEMS.sql
Purpose:
- base table definition for `CORE.REGISTRY_AI_SYSTEMS`
Notes:
- base table does not necessarily expose every field shown in public AI-systems view
- used during AI-systems linkage validation

---

# NEW OPERATOR / VALIDATION WORKSHEET

## GAFAIG - Certification Wiring Validation + AI Systems Demo Link.sql
Purpose:
- non-core operator script
- preserves validation work previously performed in `Untitled.sql`
Contains:
- certified field validation queries
- registry detail verification queries
- AI-system public view verification queries
- publish procedure DDL inspection commands
- `REGISTRY_AI_SYSTEMS` table DDL inspection
- optional demo AI-system insert for CASE-1001 / known registry ID
- revalidation queries after insert / publish
Status:
- recommended helper worksheet
- not a core architecture definition file

---

# TEMPORARY / SCRATCHPAD WORK

## Untitled.sql
Purpose:
- temporary scratchpad only
Used for:
- quick DDL inspection
- ad hoc validation queries
- one-off demo inserts
- publish-call verification
Rule:
- do not treat `Untitled.sql` as canonical
- preserve anything important by moving it into a named worksheet/file

---

# ARCHITECTURAL NOTES

## Publish Chain
- `SP_PUBLISH_CASE_TO_REGISTRY_V3(VARCHAR)` delegates to `SP_PUBLISH_CASE_TO_REGISTRY_V4(VARCHAR, VARCHAR)`
- `V4` is the real logic layer
- AI-system registry-ID alignment for existing case-linked systems already exists in `V4`

## AI Systems
- `CORE.REGISTRY_AI_SYSTEMS` = base table
- `CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC` = public projection / derived surface
- If organization page shows zero systems for a registry ID, first verify matching rows actually exist in `V_REGISTRY_AI_SYSTEMS_PUBLIC` for that `REGISTRY_ID`

## Certification Wiring
- certification wiring is complete
- production pages confirmed working:
  - `/registry/[registryId]`
  - `/organizations/[registryId]`

---

# NEXT PHASE
- lifecycle wiring
- then optional upstream AI-system intake / authoring automation