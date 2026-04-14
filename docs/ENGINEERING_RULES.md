# ENGINEERING_RULES.md
Last Updated: 2026-04-14

============================================================
GAFAIG — ENGINEERING RULES (CANONICAL)
============================================================

This document defines the NON-NEGOTIABLE engineering rules for the GAFAIG platform.

These rules govern:
- Architecture
- Data flow
- Code boundaries
- System integrity

All development must comply with these rules.

============================================================
RULE 1 — SNOWFLAKE IS THE SOURCE OF TRUTH
============================================================

ALL logic must originate from Snowflake.

Snowflake owns:
- Scoring
- Certification
- Decisions
- Registry state
- Data relationships

The application layer MUST NOT:
- Compute scores
- Infer certification
- Derive decision outcomes

============================================================
RULE 2 — STRICT LAYER SEPARATION
============================================================

System layers:

Snowflake → Query Layer → API → UI

------------------------------------------------------------

Snowflake:
- Business logic
- Data computation
- Deterministic outputs

Query Layer (lib/queries):
- Thin adapter
- Data normalization only
- NO business logic

API Layer:
- Transport only
- Input validation only
- NO computation

UI Layer:
- Presentation only
- NO logic beyond display conditions

============================================================
RULE 3 — CANONICAL DATA CONTRACT
============================================================

ALL public data must come from:

CORE.V_REGISTRY_PUBLIC

No exceptions.

DO NOT:
- Query tables directly
- Build alternate views
- Merge data outside Snowflake

============================================================
RULE 4 — APPEND-ONLY DATA MODEL
============================================================

CORE.REGISTRY_SNAPSHOTS is append-only.

Rules:
- Never update existing rows
- Never delete historical records
- Each publish creates a new snapshot

Latest state is derived via:
- CORE.V_REGISTRY_LATEST_APPROVED

============================================================
RULE 5 — DETERMINISTIC PIPELINE
============================================================

Pipeline is fixed:

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → PUBLISH

Rules:
- No shortcuts
- No skipped steps
- No manual overrides outside procedures

============================================================
RULE 6 — SCORING IS LOCKED TO SNOWFLAKE
============================================================

Scoring must be executed via:

CORE.SP_SCORE_CASE_ENTERPRISE

Outputs must come from:
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_GOVERNANCE_SCORE_CASE

DO NOT:
- Recalculate scores in API
- Recalculate scores in UI

============================================================
RULE 7 — PUBLISH IS THE ONLY WAY TO ENTER REGISTRY
============================================================

Publishing must be done via:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Rules:
- No direct inserts into REGISTRY_SNAPSHOTS
- No manual registry manipulation

============================================================
RULE 8 — RECORD TYPE INTEGRITY
============================================================

There are ONLY two valid record types:

------------------------------------------------------------

CERTIFIED RECORD:
- CERTIFIED_AT NOT NULL
- Has:
  - CERTIFIED_SCORE
  - CERTIFIED_TIER
  - CERTIFIED_BAND
  - Proof

------------------------------------------------------------

APPROVED-ONLY RECORD:
- DECISION_STATUS = APPROVED
- CERTIFIED_AT = NULL
- No certification fields

------------------------------------------------------------

CRITICAL:
UI MUST NOT fabricate certification data.

============================================================
RULE 9 — QUERY LAYER RESTRICTIONS
============================================================

lib/queries/* files must:

- NOT implement business logic
- NOT filter data unless explicitly required
- NOT transform meaning of data

Allowed:
- Field normalization (case, null handling)
- Type conversion
- Simple mapping

Forbidden:
- Score calculation
- Certification inference beyond direct fields
- Data fabrication

============================================================
RULE 10 — API CONTRACT STABILITY
============================================================

API routes must:

- Match query layer interfaces exactly
- Not introduce new fields
- Not hide missing data

If data is missing:
→ Fix Snowflake or query layer
→ NOT the API

============================================================
RULE 11 — UI HONESTY
============================================================

UI must reflect reality.

Rules:
- Do not hide missing data
- Do not fabricate fields
- Do not guess values

Display logic:
- Certified → full trust surface
- Approved → limited surface

============================================================
RULE 12 — NO RE-ARCHITECTURE
============================================================

DO NOT:
- Change pipeline structure
- Introduce new layers
- Replace Snowflake logic

Only fix what is broken.

============================================================
RULE 13 — ID CONSISTENCY
============================================================

Identifiers must be deterministic and consistent:

- CASE_ID → "CASE-XXXX"
- APPLICATION_ID → "APP-XXXX"
- REGISTRY_ID → "GAFAIG-XXXXXXXX"

Rules:
- No random ID formats
- No mixed casing
- Always normalize (UPPER + TRIM)

============================================================
RULE 14 — NORMALIZATION RULES
============================================================

All joins must use:

UPPER(TRIM(field))

Applied to:
- CASE_ID
- APPLICATION_ID
- REGISTRY_ID

============================================================
RULE 15 — NO DUPLICATE LOGIC
============================================================

Each piece of logic must exist in ONE place only.

Examples:
- Scoring → Snowflake only
- Certification → Snowflake only
- Registry state → Snowflake only

============================================================
RULE 16 — BUILD MUST PASS
============================================================

Every change must result in:

npm run build → SUCCESS

No warnings allowed to accumulate.

============================================================
RULE 17 — FIX ROOT CAUSE ONLY
============================================================

When debugging:

- Identify root cause
- Fix at correct layer

DO NOT:
- Patch UI to hide issues
- Add temporary fixes
- Introduce workarounds

============================================================
RULE 18 — CANONICAL FILES ONLY
============================================================

Only use:
- Files listed in GAFAIG_ACTIVE_FILE_MAP.md
- SQL files listed in GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md

Ignore:
- Archived files
- Duplicate files
- Legacy scripts

============================================================
RULE 19 — TEST AFTER EVERY CHANGE
============================================================

After changes, verify:

- Build passes
- /registry loads
- /explorer loads
- /registry/[id] behaves correctly

============================================================
RULE 20 — CURRENT CRITICAL FOCUS
============================================================

The ONLY current engineering priority:

Stabilize:
lib/queries/registry.ts

Do NOT modify:
- Snowflake
- UI layout

============================================================
END
============================================================