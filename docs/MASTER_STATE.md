# GAFAIG — MASTER STATE (CANONICAL) — 2026-04-07

## SYSTEM IDENTITY
GAFAIG = Global Authority for AI Governance
GAFAIG is the world’s first searchable AI governance registry.
GAFAIG is a deterministic, append-only, Snowflake-native verification and registry system.
The system operates as a trust infrastructure layer, analogous to financial audit systems, certificate authorities, and regulatory registries.

## CORE ARCHITECTURE
TWO-LAYER MODEL
1) PRIVATE VERIFICATION ENGINE (Snowflake)
- Source of truth
- Performs all computation
- Stores findings, evidence, scoring
- Never exposed publicly
2) PUBLIC REGISTRY (Views + API + UI)
- Read-only projection
- Displays certification outcomes only
- No raw evidence exposed

## CANONICAL DATA FLOW (LOCKED)
APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI
Rules:
- Case-first architecture (NOT application-first)
- Deterministic pipeline
- Append-only snapshots
- No computation outside Snowflake

## CORE TABLES (SNOWFLAKE — CORE SCHEMA)
INPUT LAYER
- CORE.APPLICATIONS (APPLICATION_ID, REQUEST_ID)
CASE LAYER
- CORE.VERIFICATION_CASES (deterministic CASE_ID)
WORKFLOW LAYER
- CORE.VERIFICATION_EVENTS (append-only lifecycle log)
ASSESSMENT LAYER
- CORE.FINDINGS
- CORE.EVIDENCE
- CORE.FINDING_EVIDENCE_LINKS
SCORING LAYER
- CORE.CASE_SCORE_SNAPSHOTS
- V_GOVERNANCE_SCORE_CASE (canonical scoring view)
DECISION LAYER
- CORE.VERIFICATION_DECISIONS
REGISTRY LAYER
- CORE.REGISTRY_SNAPSHOTS (append-only public record)

## CORE PROCEDURES
1) APPLICATION → CASE
File: 23_SP_CREATE_CASE_FROM_APPLICATION.sql
- Input: APPLICATION_ID or REQUEST_ID
- Resolves latest application record
- Generates deterministic CASE_ID
- Inserts into VERIFICATION_CASES if not exists
- Inserts canonical workflow event into VERIFICATION_EVENTS
- Returns structured VARIANT response

2) SCORING
File: 24_SP_SCORE_CASE_ENTERPRISE.sql
- Computes FINAL_SCORE
- Outputs TIER and BAND
- Writes to CASE_SCORE_SNAPSHOTS
- Must align with V_GOVERNANCE_SCORE_CASE

3) DECISION
File: 25_PROCEDURES_APPROVAL.sql
- Inserts certification decision
- Sets DECISION_STATUS

4) REGISTRY PUBLISH
File: CORE.REGISTRY_PUBLISH.sql
- Validates approved case
- Generates or reuses REGISTRY_ID
- Inserts append-only record into REGISTRY_SNAPSHOTS

## CORE VIEWS
PRIVATE ENGINE
- V_GOVERNANCE_SCORE_CASE
- V_CASE_TIER_BAND
- V_CASE_RENEWAL_STATUS
PUBLIC REGISTRY
- V_REGISTRY_LATEST_APPROVED
- V_REGISTRY_PUBLIC
- V_REGISTRY_PUBLIC_SEARCH
AI SYSTEMS
- V_REGISTRY_AI_SYSTEMS_PUBLIC

## SYSTEM RULES (NON-NEGOTIABLE)
- Snowflake is the source of truth
- No scoring or certification logic in API or UI
- Append-only architecture (no updates, only inserts)
- Deterministic ID generation
- Procedures control all state transitions
- Public layer reads from views only
- No direct table access from frontend
- Do not re-architect

## IDENTIFIER STANDARDS
- APPLICATION_ID → APP-XXXXXXXX
- CASE_ID → CASE-XXXXXXXX
- REGISTRY_ID → GAFAIG-XXXXXXXX
All IDs must be uppercase, trimmed, deterministic, and consistent across layers.

## QUERY LAYER (NEXT.JS)
Pattern: Snowflake → lib/queries → API → UI
Examples:
- /api/registry → V_REGISTRY_PUBLIC
- /api/verify/[registryId]
- /api/badge/[registryId]

## CURRENT SYSTEM STATE
WORKING
- Snowflake environment configured (GAFAIG_DB.CORE)
- Core tables exist
- SP_CREATE_CASE_FROM_APPLICATION compiles and executes
- Deterministic CASE_ID generation works
- Event insertion logic works when triggered
- VARIANT return structure correct
- Idempotency enforced

BLOCKER
- Application → Case pipeline failing at lookup stage
- Procedure returns "Application not found"
- No rows inserted into VERIFICATION_CASES
- No rows inserted into VERIFICATION_EVENTS
Root cause:
- APPLICATIONS lookup mismatch (ID normalization or environment mismatch)

## WHAT WAS ACCOMPLISHED
- Verified procedure structure is correct
- Fixed insert column mismatches
- Validated event pipeline logic
- Confirmed deterministic ID generation
- Confirmed procedure execution path
- Isolated failure to APPLICATIONS lookup

## NEXT STEP (LOCKED)
- Fix application resolution inside SP_CREATE_CASE_FROM_APPLICATION
- Normalize matching using UPPER(TRIM())
- Verify APPLICATIONS table contains correct IDs
- Confirm correct DB/SCHEMA context

## NEXT PHASE
After fix:
1) Findings + Evidence ingestion
2) Run scoring procedure
3) Insert decision
4) Publish to registry
5) Validate public views
6) Connect API + UI

## FINAL NOTE
System architecture is correct and stable.
The only blocker is application lookup resolution.
Do not re-architect. Fix input resolution and proceed.