# ENGINEERING_RULES.md
Last Updated: 2026-04-16

============================================================
GAFAIG — ENGINEERING RULES (CANONICAL)
============================================================

This document defines the NON-NEGOTIABLE engineering rules for the GAFAIG platform.

These rules govern:
- Architecture
- Data flow
- Code boundaries
- System integrity
- Trust semantics
- Scoring and publish execution
- Verification proof behavior

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
- Lifecycle status
- Renewal status

The application layer MUST NOT:
- Compute scores
- Infer certification
- Derive decision outcomes
- Invent lifecycle states
- Override Snowflake truth

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
- Query tables directly for public truth
- Build alternate public views
- Merge public data outside Snowflake
- Reconstruct certification state in API/UI

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

Score snapshots are also append-only.

Live score snapshot table:
- CORE.CASE_SCORE_SNAPSHOTS_V2

Rules:
- Never overwrite score history
- Never mutate historical score rows
- New scoring = new snapshot row

============================================================
RULE 5 — DETERMINISTIC PIPELINE
============================================================

Pipeline is fixed:

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → PUBLISH

Expanded runtime interpretation:

CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SCORE SNAPSHOT
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEW
→ VERIFY (SIGNATURE)

Rules:
- No shortcuts
- No skipped steps
- No manual overrides
- No direct inserts into downstream layers

============================================================
RULE 6 — SCORING IS LOCKED TO SNOWFLAKE
============================================================

Scoring must be executed via:

CORE.SP_SCORE_CASE_ENTERPRISE

Outputs must come from:
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_GOVERNANCE_SCORE_CASE

Supporting objects:
- CORE.V_CASE_TIER_BAND
- CORE.V_CASE_RENEWAL_STATUS
- CORE.V_FINDING_UNMAPPED_CONTROLS
- CORE.CASE_SCORE_SNAPSHOTS_V2

DO NOT:
- Recalculate scores in API
- Recalculate scores in UI
- Fabricate score rows
- Assume success if rowsInserted = 0

If scoring inserts 0 rows:
→ treat as failure
→ fix input contract

============================================================
RULE 7 — PUBLISH IS THE ONLY WAY TO ENTER REGISTRY
============================================================

Publishing must be done via:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Rules:
- No direct inserts into REGISTRY_SNAPSHOTS
- No manual registry manipulation
- No fake registry data
- No bypass of scoring

============================================================
RULE 8 — RECORD TYPE INTEGRITY
============================================================

Two valid public record types:

CERTIFIED RECORD:
- CERTIFIED_AT NOT NULL
- Has:
  CERTIFIED_SCORE
  CERTIFIED_TIER
  CERTIFIED_BAND

APPROVED-ONLY RECORD:
- DECISION_STATUS = APPROVED
- CERTIFIED_AT = NULL

CRITICAL:
UI MUST NOT fabricate certification data

============================================================
RULE 9 — QUERY LAYER RESTRICTIONS
============================================================

lib/queries must:

Allowed:
- normalization
- null handling
- type conversion

Forbidden:
- scoring logic
- certification inference
- lifecycle invention
- data fabrication

============================================================
RULE 10 — API CONTRACT STABILITY
============================================================

API must:
- mirror Snowflake truth
- not hide missing data
- not reinterpret logic

If data is wrong:
→ fix Snowflake
→ NOT API

============================================================
RULE 11 — UI HONESTY
============================================================

UI must:
- reflect real data
- not fabricate
- not infer
- not guess

Display rules:
- Certified → full trust
- Approved → limited
- Verified → signed

============================================================
RULE 12 — NO RE-ARCHITECTURE
============================================================

DO NOT:
- change pipeline
- move logic out of Snowflake
- introduce new trust layers

============================================================
RULE 13 — ID CONSISTENCY
============================================================

- CASE_ID → CASE-XXXX
- APPLICATION_ID → APP-XXXX
- REGISTRY_ID → GAFAIG-XXXXXXXX

Always:
UPPER(TRIM())

============================================================
RULE 14 — NORMALIZATION
============================================================

All joins must use:

UPPER(TRIM(field))

============================================================
RULE 15 — NO DUPLICATE LOGIC
============================================================

Each logic must exist in ONE place only.

============================================================
RULE 16 — BUILD MUST PASS
============================================================

npm run build → SUCCESS

============================================================
RULE 17 — FIX ROOT CAUSE ONLY
============================================================

Never patch UI to hide backend problems.

============================================================
RULE 18 — CANONICAL FILES ONLY
============================================================

Only use:
- GAFAIG_ACTIVE_FILE_MAP.md
- GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md

============================================================
RULE 19 — TEST AFTER EVERY CHANGE
============================================================

Must verify:
- build
- explorer
- registry
- verify endpoint
- widget

============================================================
RULE 20 — CURRENT CRITICAL FOCUS
============================================================

Fix Snowflake canonicalization:

- V_REGISTRY_PUBLIC semantics
- Explorer stats
- Seed integrity
- Scoring pipeline

UI is NOT the blocker.

============================================================
RULE 21 — LIVE SCHEMA ONLY
============================================================

Use DESC TABLE / VIEW only.

Never assume schema.

============================================================
RULE 22 — VERIFICATION IS NOT CERTIFICATION
============================================================

- VERIFIED = signature
- APPROVED = evaluated
- CERTIFIED = trusted

Never mix.

============================================================
RULE 23 — TIME-BOUND CERTIFICATION
============================================================

Must use:
- VALID_FROM
- VALID_TO

No UI guesses.

============================================================
RULE 24 — SIGNATURE CONTRACT STABILITY
============================================================

Proof must include:
- alg
- kid
- signature
- signedAt
- verificationKeyUrl
- message
- messageString

============================================================
RULE 25 — PRIVATE KEY SAFETY
============================================================

Never expose private key.

============================================================
RULE 26 — PUBLIC TRUST SURFACE = SNOWFLAKE
============================================================

All pages must reflect Snowflake truth.

============================================================
RULE 27 — DEMO SEEDS MUST BE REAL
============================================================

No fake data.

============================================================
RULE 28 — CONTROL FILES ARE AUTHORITATIVE
============================================================

MASTER_STATE.md
CURRENT_FOCUS.md
ENGINEERING_RULES.md
GAFAIG_ACTIVE_FILE_MAP.md
GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md

============================================================
RULE 29 — DEBUG FROM SNOWFLAKE FIRST
============================================================

Trace:

CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY
→ VIEWS
→ API
→ UI

============================================================
END
============================================================