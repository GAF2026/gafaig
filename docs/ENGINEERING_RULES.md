# ENGINEERING_RULES.md
# GAFAIG — Global Authority for AI Governance
# Engineering Rules (Strict Enforcement)
# Last Updated: 2026-04-12

## CORE PRINCIPLE
Snowflake is the single source of truth. All system computation must occur in Snowflake, including scoring, joins, certification logic, registry outputs, workflow state, and publish logic. The API and UI are strictly read-only surfaces over canonical Snowflake outputs.

## SYSTEM ARCHITECTURE (NON-NEGOTIABLE)
GAFAIG follows a deterministic pipeline: CASE → FINDINGS → EVIDENCE → FINDING_EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY_SNAPSHOT → PUBLIC VIEWS → API → UI. No stage may be skipped, re-ordered, duplicated, or redefined outside Snowflake. The platform is case-first, not application-first.

## ABSOLUTE PROHIBITIONS
Do NOT re-architect the platform. Do NOT introduce alternate pipelines. Do NOT move logic out of Snowflake. Do NOT compute certification, score, tier, band, validity, or registry status in API or UI. Do NOT change schema during debugging unless the work is explicitly a canonical schema migration. Do NOT create competing seed files. Do NOT create hidden “helper” seed files that become required to make the system work. Do NOT introduce temp-table dependency into canonical executable files. Do NOT rewrite working public views when the real issue is missing or malformed underlying data. Do NOT change Explorer, Registry, Explorer Systems, Registry AI Systems, or any public page while debugging seed/workflow/scoring data. Do NOT invent new “pillars,” new public semantics, or new business logic.

## ONE CANONICAL SEED RULE
There must be exactly one canonical demo seed file: GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql. This file is the only executable demo seed authority. All deterministic demo rebuild logic must live inside this file. Do not rely on GAFAIG - DEMO_CERTIFICATION_WORKFLOW_REBUILD.sql or any archived seed/rebuild file as part of the active platform path. Retired or archived files may be used only for reference, never as required execution steps.

## CANONICAL DATA OWNERSHIP
VERIFICATION_CASES owns case state. VERIFICATION_FINDINGS owns governance findings. VERIFICATION_EVIDENCE owns evidence records. VERIFICATION_FINDING_EVIDENCE owns finding-to-evidence links. VERIFICATION_EVENTS owns workflow events. CASE_SCORE_SNAPSHOTS_V2 owns scored snapshots. DECISIONS owns certification decision state. REGISTRY_SNAPSHOTS owns append-only public registry state. V_REGISTRY_PUBLIC and related public views surface controlled public outputs only.

## API AND UI RULES
API routes may only query canonical Snowflake query layers and return results. UI may only render API/query outputs. API and UI must never derive certification state from partial fields, invent missing values, or compensate for missing Snowflake data. If public pages look wrong, validate the underlying Snowflake workflow and score outputs first. Never patch UI to hide broken data.

## NO SCHEMA GUESSING
Never assume a table or view shape. Before writing inserts, updates, merges, or views, confirm live table contracts using DESC TABLE, DESC VIEW, or INFORMATION_SCHEMA. All SQL must match live column names, order, nullability expectations, and actual table ownership. If a column does not exist, do not reference it. If a table does not exist, do not invent it. If a view expects a field that no longer exists, fix the view or source contract instead of patching around it elsewhere.

## NO TEMP TABLE DEPENDENCY IN CANONICAL FILES
Canonical executable files must not rely on temp tables or session-scoped objects. Any deterministic data generation must use inline VALUES blocks, direct INSERT ... SELECT patterns, or persisted canonical tables/views. A canonical file must run top-to-bottom in one worksheet without depending on prior hidden state.

## REQUIRED SQL INSERT PATTERN
Use deterministic INSERT ... SELECT patterns. Prefer SELECT from inline VALUES blocks with explicit aliases and explicit column lists. Do not use session-dependent temp objects in canonical files. Avoid malformed CTE syntax. If a CTE is used with INSERT in Snowflake, the syntax must be Snowflake-valid and attached correctly to the statement. Prefer the simplest deterministic form when possible: INSERT INTO <table> (<columns>) SELECT <expressions> FROM (SELECT * FROM VALUES (...), (...)) alias(col1, col2, ...) CROSS JOIN (SELECT * FROM VALUES (...), (...)) template(colA, colB, ...).

## DETERMINISTIC ID RULE
All demo IDs must be deterministic, human-readable, and reproducible. Examples: FND-0001-01, EVD-0001-01, EVT-0001-01, CASE-0001, GAFAIG-DEMO-0001. Never use random UUIDs in canonical demo seed data. If the same canonical file is rerun, it must recreate the same IDs.

## CLEANUP RULE
Before rebuilding demo workflow rows, delete only the canonical demo workflow rows tied to the canonical demo case IDs and deterministic demo IDs. Never wipe unrelated live data. Cleanup filters must be constrained by CASE_ID, deterministic ID patterns, or known demo ORG_ID values. Cleanup logic must match real table contracts. If a table does not have ORG_ID, do not filter it by ORG_ID.

## WORKFLOW REBUILD RULE
The canonical seed file must rebuild the certification workflow layer in this order: findings, evidence, finding-evidence links, events, scoring, validation. If findings are zero, stop and fix findings before continuing. If evidence is zero, stop and fix evidence before continuing. If finding-evidence links are zero, stop and fix linking before touching scoring. Scoring is downstream of valid workflow data.

## SCORING RULE
Scoring is downstream and must not be debugged before the workflow layer exists. If VERIFICATION_FINDINGS, VERIFICATION_EVIDENCE, or VERIFICATION_FINDING_EVIDENCE are missing for demo cases, scoring errors are symptoms, not root causes. Fix workflow data first. Then validate V_CONTROL_SCORE_COMPONENTS, V_CASE_SCORE_ENTERPRISE, CASE_SCORE_SNAPSHOTS_V2, and any public score breakdown views. Never modify public Explorer or Registry pages to compensate for missing scoring rows.

## REGISTRY RULE
Registry views and pages are public outputs only. They must not be treated as the place where certification is “made true.” Registry surfaces only reflect certified results already computed upstream. Do not patch public registry logic to compensate for broken workflow or missing scoring inputs.

## VIEW CHANGE RULE
Do not rewrite canonical public views during workflow debugging unless a live schema mismatch is confirmed. If a view compile error references a missing column, identify whether the problem is stale file content, stale worksheet execution, or actual upstream schema drift before changing the view. Never change multiple layers at once.

## DEBUGGING ORDER (MANDATORY)
When the platform is wrong, debug in this order: 1) confirm worksheet context with USE ROLE / USE WAREHOUSE / USE DATABASE / USE SCHEMA, 2) inspect raw Snowflake rows and counts, 3) validate workflow tables, 4) validate linking tables, 5) validate scoring support views, 6) validate score snapshots, 7) validate public views, 8) validate API, 9) validate UI. Do not reverse this order.

## WORKSHEET DISCIPLINE
Always run canonical SQL in a fresh worksheet with explicit Snowflake session context set at the top. Do not rely on selected snippets from older worksheets. Do not mix active repairs across multiple worksheets if session state matters. If a file is the canonical executable file, run the file itself, not manually reconstructed fragments, unless isolating a specific failing statement.

## CURRENT PLATFORM ENFORCEMENT (2026-04-12)
The current active focus is the canonical demo workflow inside GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql. Public pages are already rendering and must not be changed as part of this fix. The known workflow problem during this cycle has been incomplete or malformed rebuilds of VERIFICATION_FINDINGS, VERIFICATION_EVIDENCE, and VERIFICATION_FINDING_EVIDENCE. The goal is to make the single canonical seed file reliably rebuild those rows without drift.

## SUCCESS CRITERIA
The canonical seed file is considered correct when it runs in one worksheet and deterministically yields: VERIFICATION_FINDINGS = 25 for CASE-0001 through CASE-0005, VERIFICATION_EVIDENCE = 25 for CASE-0001 through CASE-0005, VERIFICATION_FINDING_EVIDENCE = 25 tied to the demo finding IDs, VERIFICATION_EVENTS = 10 for the five demo cases, and scoring may then be re-enabled and validated downstream. Registry and Explorer pages must remain unchanged during this workflow rebuild.

## FINAL ENFORCEMENT RULE
If a proposed fix changes architecture, adds competing files, moves logic out of Snowflake, changes UI/API to compensate for missing data, or touches unrelated public surfaces while the canonical workflow is still broken, reject that fix immediately.

## END OF FILE