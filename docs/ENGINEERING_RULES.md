# GAFAIG ENGINEERING RULES

These rules are absolute and must be followed at all times. They exist to preserve the deterministic, verifiable, and trust-based architecture of GAFAIG.

----------------------------------------
FOUNDATIONAL PRINCIPLE
----------------------------------------

GAFAIG is a trust infrastructure.

NOT a typical web application.

Every engineering decision must reinforce:
- determinism
- verifiability
- independence
- consistency

----------------------------------------
SOURCE OF TRUTH
----------------------------------------

Snowflake is the ONLY source of truth.

- All scoring is computed in Snowflake
- All certification decisions originate in Snowflake
- All registry data is stored in Snowflake
- All joins and logic occur in Snowflake

The application layer must NEVER:
- compute scores
- derive certification
- fabricate or transform governance data

----------------------------------------
SYSTEM FLOW (LOCKED)
----------------------------------------

CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

Rules:
- This flow is deterministic
- This flow is append-only
- No step may be skipped
- No step may be re-ordered
- No step may be computed outside Snowflake

----------------------------------------
APPEND-ONLY ARCHITECTURE
----------------------------------------

The registry is append-only.

- CORE.REGISTRY_SNAPSHOTS is immutable
- Every publish creates a new row
- Historical records are never modified or deleted
- Latest state is derived via views

Never:
- update snapshots
- delete snapshots
- override registry history

----------------------------------------
PUBLISHING RULES
----------------------------------------

Publishing must ONLY occur via stored procedures:

- SP_PUBLISH_CASE_TO_REGISTRY_V3 (primary)
- SP_PUBLISH_CASE_TO_REGISTRY_V4 (variant)

Rules:
- Validate case approval before publish
- Reuse REGISTRY_ID for the same entity
- Generate deterministic REGISTRY_ID if new
- Insert via INSERT ... SELECT (not VALUES for VARIANT safety)

Never:
- insert directly into registry tables from the API
- bypass publish procedures

----------------------------------------
CANONICAL VIEWS ONLY
----------------------------------------

All application data must come from canonical views:

- V_REGISTRY_PUBLIC
- V_REGISTRY_LATEST_APPROVED
- V_REGISTRY_PUBLIC_SEARCH
- V_REGISTRY_AI_SYSTEMS_PUBLIC
- V_GOVERNANCE_SCORE_CASE

Never:
- query base tables directly from the app
- reconstruct logic in TypeScript
- create shadow logic outside Snowflake

----------------------------------------
API LAYER RULES
----------------------------------------

The API layer is a thin transport layer only.

Allowed:
- Fetch data from Snowflake
- Return structured JSON
- Apply basic validation

Not allowed:
- business logic
- scoring logic
- certification decisions
- data transformation beyond formatting

All API routes must:
- use sfQuery()
- return deterministic results
- include proper error handling
- include CORS headers for public endpoints

----------------------------------------
CORS REQUIREMENT (PUBLIC APIs)
----------------------------------------

All public-facing endpoints must support cross-origin access:

Required for:
- /api/verify/[registryId]
- /api/registry

Must include:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET, OPTIONS
- Access-Control-Allow-Headers: Content-Type

Must implement:
- OPTIONS handler returning 204

----------------------------------------
UI LAYER RULES
----------------------------------------

The UI is a presentation layer only.

Allowed:
- render data
- format layout
- display trust signals

Not allowed:
- compute scores
- derive certification status
- modify truth
- implement fallback logic that changes meaning

----------------------------------------
DESIGN SYSTEM CONSISTENCY
----------------------------------------

All public pages must share identical design language:

- Typography scale
- Spacing system
- Border styles (light gray, not black)
- Card structure
- Button styles
- Status chips

Pages that must match:
- /mission
- /explorer
- /registry
- /registry/[registryId]
- /badge-preview
- widget output

Never:
- introduce custom styling per page
- deviate from established layout patterns

----------------------------------------
TRUST SURFACE CONSISTENCY
----------------------------------------

All trust surfaces must feel identical:

- Registry page
- Explorer page
- Badge
- Widget
- Verification endpoint

They must:
- communicate the same signals
- use the same terminology
- use consistent visual hierarchy

----------------------------------------
WIDGET RULES
----------------------------------------

The widget is an external trust surface.

Requirements:
- Must work on any website
- Must use public APIs only
- Must not depend on internal state
- Must fail gracefully
- Must not break layout of host page

Never:
- assume same-origin
- rely on cookies or auth
- embed sensitive data

----------------------------------------
BADGE RULES
----------------------------------------

The badge is a portable trust artifact.

Requirements:
- Clean, minimal design
- Clear certification signal
- Consistent typography
- Easily embeddable

Never:
- overload with data
- deviate from design system
- include private information

----------------------------------------
ERROR HANDLING RULES
----------------------------------------

Errors must be:

- deterministic
- transparent
- non-destructive

Widget fallback:
- must display "verification unavailable"
- must not display incorrect data
- must preserve trust

API errors:
- must return structured JSON
- must not expose internal logic

----------------------------------------
TYPE SAFETY RULES
----------------------------------------

TypeScript must be strict.

- No implicit "any"
- Shared types must be unified
- Avoid duplicate type definitions

Never:
- bypass type errors
- cast incorrectly to silence errors

----------------------------------------
SQL RULES
----------------------------------------

Snowflake scripting must follow:

- Use :variable binding
- Prefer INSERT ... SELECT
- Avoid VALUES for VARIANT
- Avoid non-existent columns (e.g., UPDATED_AT unless defined)

All SQL must be:
- idempotent where possible
- deterministic
- aligned with canonical schema

----------------------------------------
DEPLOYMENT RULES
----------------------------------------

Before deploy:

1. Run:
   npm run build

2. Ensure:
- No TypeScript errors
- No runtime errors
- No broken imports

3. Commit cleanly:
- git add .
- git commit -m "clear message"
- git push origin main

----------------------------------------
DO NOT BREAK RULE
----------------------------------------

If something is working:

DO NOT:
- refactor it unnecessarily
- rename core fields
- restructure logic

Fix only what is broken or misaligned.

----------------------------------------
CURRENT PHASE RULE
----------------------------------------

We are in:

Trust Surface Completion Phase

This means:

ONLY work on:
- UI consistency
- Widget reliability
- Badge alignment
- API accessibility (CORS)

DO NOT:
- expand features
- redesign architecture
- introduce new systems

----------------------------------------
FINAL PRINCIPLE
----------------------------------------

Every line of code must answer:

Does this make GAFAIG more:
- deterministic?
- verifiable?
- consistent?
- trustworthy?

If not, do not implement it.