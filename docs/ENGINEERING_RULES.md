# ENGINEERING_RULES.md
Last Updated: 2026-04-15

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

Rules:
- No shortcuts
- No skipped steps
- No manual overrides outside procedures
- No direct inserts into downstream trust layers as a substitute for canonical flow

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

============================================================
RULE 6 — SCORING IS LOCKED TO SNOWFLAKE
============================================================

Scoring must be executed via:

CORE.SP_SCORE_CASE_ENTERPRISE

Outputs must come from:
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_GOVERNANCE_SCORE_CASE

Supporting live objects include:
- CORE.V_CASE_TIER_BAND
- CORE.V_CASE_RENEWAL_STATUS
- CORE.V_FINDING_UNMAPPED_CONTROLS
- CORE.CASE_SCORE_SNAPSHOTS_V2

DO NOT:
- Recalculate scores in API
- Recalculate scores in UI
- Fabricate score rows in query layer
- Pretend a successful procedure call means scoring succeeded if rowsInserted = 0

If scoring inserts 0 rows:
→ treat as failure
→ diagnose scoring input contract
→ do NOT patch downstream surfaces

============================================================
RULE 7 — PUBLISH IS THE ONLY WAY TO ENTER REGISTRY
============================================================

Publishing must be done via:

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

If V4 is active in the environment, it must still remain canonical and Snowflake-owned.

Rules:
- No direct inserts into REGISTRY_SNAPSHOTS
- No manual registry manipulation
- No fake registry data for UI testing
- No bypass of score requirements

============================================================
RULE 8 — RECORD TYPE INTEGRITY
============================================================

There are ONLY two valid public record types:

------------------------------------------------------------

CERTIFIED RECORD:
- CERTIFIED_AT NOT NULL
- Has:
  - CERTIFIED_SCORE
  - CERTIFIED_TIER
  - CERTIFIED_BAND
  - Proof-capable verify surface

------------------------------------------------------------

APPROVED-ONLY RECORD:
- DECISION_STATUS = APPROVED (or canonical equivalent)
- CERTIFIED_AT = NULL
- No certification fields should be fabricated

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
- Lifecycle invention
- Business rules

============================================================
RULE 10 — API CONTRACT STABILITY
============================================================

API routes must:

- Match query layer interfaces exactly
- Not introduce new semantic fields casually
- Not hide missing data
- Not reinterpret Snowflake truth

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
- Do not imply certification where only approval exists
- Do not imply approval where only verification exists

Display logic:
- Certified → full trust surface
- Approved → limited surface
- Verified → cryptographic integrity only

============================================================
RULE 12 — NO RE-ARCHITECTURE
============================================================

DO NOT:
- Change pipeline structure
- Introduce new layers
- Replace Snowflake logic
- Move authoritative logic into API/UI

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
- ORG_ID where required by live contracts

============================================================
RULE 15 — NO DUPLICATE LOGIC
============================================================

Each piece of logic must exist in ONE place only.

Examples:
- Scoring → Snowflake only
- Certification → Snowflake only
- Registry state → Snowflake only
- Verification signature generation → application crypto layer only
- Public key exposure → dedicated public key endpoint only

============================================================
RULE 16 — BUILD MUST PASS
============================================================

Every Next.js change must result in:

npm run build → SUCCESS

No type regressions allowed to accumulate.

============================================================
RULE 17 — FIX ROOT CAUSE ONLY
============================================================

When debugging:

- Identify root cause
- Fix at correct layer

DO NOT:
- Patch UI to hide issues
- Add temporary fixes
- Introduce workarounds that violate architecture
- Fake success in downstream layers

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
- Unverified scratch SQL

============================================================
RULE 19 — TEST AFTER EVERY CHANGE
============================================================

After changes, verify:

- Build passes
- /registry loads
- /explorer loads
- /registry/[id] behaves correctly
- /verify/[id] behaves correctly
- /api/verify/[id] behaves correctly
- Widget preview still works
- Snowflake scoring/publish path still holds if Snowflake was touched

============================================================
RULE 20 — CURRENT CRITICAL FOCUS
============================================================

The ONLY current engineering priority is:

Stabilize the Snowflake scoring-to-publish path for the expanded demo seed system.

Specifically:
- diagnose why rebuilt cases do not appear in V_GOVERNANCE_SCORE_CASE
- restore SP_SCORE_CASE_ENTERPRISE output for new seed cases
- restore SP_PUBLISH_CASE_TO_REGISTRY_V3 output into REGISTRY_SNAPSHOTS / V_REGISTRY_PUBLIC

Do NOT treat UI as the blocker.
Do NOT treat API as the blocker.
The blocker is Snowflake scoring input contract alignment.

============================================================
RULE 21 — LIVE SCHEMA ONLY
============================================================

All SQL must align to live DESC TABLE / DESC VIEW output.

Do NOT assume fields from:
- prior chats
- draft files
- inferred view structures
- outdated memory

Examples of live-schema corrections already discovered:
- VERIFICATION_FINDINGS uses CONTROL_ID, CONTROL_TITLE, RESULT, RATIONALE, SEVERITY, EVIDENCE_IDS
- CASE_SCORE_SNAPSHOTS_V2 uses SCORED_AT, not SNAPSHOT_AT

============================================================
RULE 22 — VERIFICATION IS NOT CERTIFICATION
============================================================

Trust semantics must remain separate:

- VERIFIED = cryptographic integrity
- APPROVED = evaluated
- CERTIFIED = trusted + published + time-valid

Do NOT conflate them in:
- Snowflake outputs
- API payloads
- UI labels
- Widgets
- Public copy

============================================================
RULE 23 — TIME-BOUND CERTIFICATION
============================================================

Certification is not permanent.

It must be governed by:
- VALID_FROM
- VALID_TO

Lifecycle states such as:
- Active
- Expiring Soon
- Expired

must be derived from canonical Snowflake logic, not guessed in UI/API.

============================================================
RULE 24 — SIGNATURE CONTRACT STABILITY
============================================================

Verification proof contract must remain stable.

Current contract includes:
- proof.alg
- proof.kid
- proof.signature
- proof.signedAt
- proof.verificationKeyUrl
- proof.message
- proof.messageString

Rules:
- messageString must be deterministic
- signature must be base64
- signing algorithm must remain Ed25519 unless explicitly versioned
- any contract change must be coordinated across verify API, key endpoint, widget, and UI

============================================================
RULE 25 — PRIVATE KEY SAFETY
============================================================

Private signing key material must never be exposed.

Allowed:
- public key endpoint
- public key PEM/base64 exposure
- key id exposure

Forbidden:
- logging private key
- returning private key in API
- embedding private key in client bundle
- storing private key in public files

============================================================
RULE 26 — PUBLIC TRUST SURFACE MUST FOLLOW SNOWFLAKE
============================================================

The following surfaces must only reflect canonical Snowflake truth:
- /registry
- /registry/[registryId]
- /registry/ai-systems
- /explorer
- /explorer/organizations
- /explorer/systems
- /explorer/countries
- /verify
- /verify/[registryId]
- /widget-preview/[registryId]

No surface may “look better” by drifting from Snowflake.

============================================================
RULE 27 — DEMO SEEDS MUST BE REAL PIPELINE DATA
============================================================

Demo seed data must:
- respect live schemas
- pass through canonical scoring and publish flow
- generate real downstream records

Demo seed data must NOT:
- fake registry visibility
- fake certification
- bypass procedures for convenience
- create contradictions between Snowflake and UI

============================================================
RULE 28 — CONTROL FILES ARE AUTHORITATIVE
============================================================

These files are system control files and must be treated as authoritative:
- MASTER_STATE.md
- CURRENT_FOCUS.md
- ENGINEERING_RULES.md
- CANONICAL_RUN_ORDER.md
- GAFAIG_ACTIVE_FILE_MAP.md
- GAFAIG_SNOWFLAKE_SQL_FILE_SUMMARY.md

They are not optional reference docs.
They are the operating control layer.

============================================================
RULE 29 — WHEN IN DOUBT, TRACE THE PIPELINE
============================================================

If something is missing in UI or API:

Trace in this order:
1. VERIFICATION_CASES
2. VERIFICATION_FINDINGS
3. VERIFICATION_EVIDENCE
4. VERIFICATION_EVENTS
5. V_CASE_SCORE_ENTERPRISE / V_GOVERNANCE_SCORE_CASE
6. DECISIONS
7. REGISTRY_SNAPSHOTS
8. V_REGISTRY_LATEST_APPROVED
9. V_REGISTRY_PUBLIC
10. API
11. UI

Never debug top-down first if Snowflake truth is uncertain.

============================================================
END
============================================================