# GAFAIG_ACTIVE_FILE_MAP.md
Date: 2026-04-21

## Purpose

This file is the active execution map for GAFAIG (Global Authority for AI Governance). It identifies the current canonical files that matter most for system integrity, current production behavior, and next-step execution. It is not a full file tree. It is the active map of files that currently govern the live platform and the current stabilization state.

## Core System Rule

Snowflake is the source of truth.

All governance computation, scoring, approval state, renewal state, publish eligibility, registry publication, and public trust projection must originate in Snowflake. The app, API, and UI are consumers of canonical Snowflake views and procedures. They must not invent or recompute trust logic.

## Current Platform State

The Snowflake-backed public trust surface is now substantially stabilized.

Working and validated:
- public registry view restored and filtered to approved/current records only
- explorer stats restored from Snowflake
- explorer page restored
- registry page restored
- explorer organizations restored
- explorer countries restored
- API registry route restored
- API explorer route restored
- decision lifecycle now supports approve, revoke, re-approve
- renewal/publishability layer now gates publication correctly
- revoked records are excluded from the public registry view

Still under active review:
- explorer systems surface must use only canonical public systems data
- remaining UI/query alignment must continue to follow Snowflake public views only
- final registry integrity validation should continue from the current stable checkpoint

## Canonical Snowflake Workflow Chain

The locked execution chain is:

APPLICATION
→ VERIFICATION_CASES
→ VERIFICATION_FINDINGS
→ VERIFICATION_EVIDENCE
→ VERIFICATION_EVENTS
→ V_CASE_SCORE_ENTERPRISE / V_GOVERNANCE_SCORE_CASE
→ CASE_SCORE_SNAPSHOTS
→ DECISIONS
→ V_CASE_RENEWAL_STATUS
→ SP_PUBLISH_CASE_TO_REGISTRY_V3
→ REGISTRY_SNAPSHOTS
→ V_REGISTRY_PUBLIC
→ V_REGISTRY_AI_SYSTEMS_PUBLIC
→ API
→ UI

## Active Snowflake Files

### Workflow / Core Tables
- `11_TABLES_APPLICATIONS.sql`
- `12_TABLES_PARTICIPANTS.sql`
- `15_TABLES_EVENTS.sql`
- `16_TABLES_CASE_SCORE_SNAPSHOTS.sql`
- `17_TABLES_DECISIONS.sql`
- `18_TABLES_REGISTRY_ENTITIES.sql`

### Public / Registry Views
- `21_VIEWS_PUBLIC_REGISTRY.sql`
- `22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql`
- `22_VIEWS_EXPLORER_STATS.sql`
- `26_VIEWS_CASE_RENEWAL_STATUS.sql`

### Procedures
- `23_SP_CREATE_CASE_FROM_APPLICATION.sql`
- `24_SP_SCORE_CASE_ENTERPRISE.sql`
- `25_PROCEDURES_APPROVAL.sql`
- `GAFAIG - CORE.REGISTRY_PUBLISH.sql`

### Canonical Scoring Engine
- `GAFAIG - Governance Scoring (Enterprise v1.2).sql`

## Snowflake Objects Currently Considered Canonical

### Tables
- `CORE.APPLICATIONS`
- `CORE.VERIFICATION_CASES`
- `CORE.VERIFICATION_FINDINGS`
- `CORE.VERIFICATION_EVIDENCE`
- `CORE.VERIFICATION_EVENTS`
- `CORE.CASE_SCORE_SNAPSHOTS`
- `CORE.DECISIONS`
- `CORE.REGISTRY_SNAPSHOTS`
- `CORE.REGISTRY_AI_SYSTEMS`

### Views
- `CORE.V_FINDING_RESULT_NORMALIZED`
- `CORE.V_FINDING_UNMAPPED_CONTROLS`
- `CORE.V_CASE_FINDING_AGG_ENTERPRISE`
- `CORE.V_CASE_EVIDENCE_AGG_ENTERPRISE`
- `CORE.V_CASE_EVENT_AGG_ENTERPRISE`
- `CORE.V_CASE_SCORE_ENTERPRISE`
- `CORE.V_GOVERNANCE_SCORE_CASE`
- `CORE.V_CASE_RENEWAL_STATUS`
- `CORE.V_REGISTRY_PUBLIC`
- `CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC`
- `CORE.V_EXPLORER_STATS`
- `CORE.V_SCORE_DIMENSIONS_PUBLIC`
- `CORE.V_PUBLIC_OVERSIGHT_SIGNAL`

### Procedures
- `CORE.SP_CREATE_CASE_FROM_APPLICATION`
- `CORE.SP_SCORE_CASE_ENTERPRISE`
- `CORE.APPROVE_CASE_V1`
- `CORE.UNAPPROVE_CASE_V1`
- `CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3`

## Current Snowflake Governance Rules Locked

### Score Source of Truth
`CORE.V_GOVERNANCE_SCORE_CASE` is the single authoritative source for:
- final score
- tier
- band
- renewal status
- validity / publishability propagation into public trust layer

### Decision Lifecycle Rule
`CORE.DECISIONS` is the canonical lifecycle table.

Current contract:
- exactly one active decision row per case
- active row = `VALID_TO IS NULL`
- historical rows = `VALID_TO IS NOT NULL`
- latest row governs renewal, validity, and publishability

### Renewal Rule
`CORE.V_CASE_RENEWAL_STATUS` is the canonical lifecycle interpretation layer.

It determines:
- `RENEWAL_STATUS`
- `IS_CURRENTLY_VALID`
- `IS_PUBLISHABLE`

### Publish Rule
`CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3` must not gate on workflow status alone. It must gate on canonical lifecycle / publishability state.

### Public Registry Rule
`CORE.V_REGISTRY_PUBLIC` must surface only:
- latest registry snapshot per case
- latest decision row = APPROVED
- current record is valid/publishable
- revoked and expired records excluded

### Public Systems Rule
`CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC` is the canonical public systems surface. Public explorer/system UI must consume this view, not raw workflow tables.

## Active VS Code / App Files

### Registry / Explorer Query Layer
- `lib/queries/registry.ts`
- `lib/queries/explorer.ts`

### API Routes
- `app/api/registry/route.ts`
- `app/api/explorer/route.ts`
- `app/api/verify/[registryId]/route.ts`
- `app/api/.well-known/gafaig-public-key/route.ts`
- `app/api/badge/[registryId]/route.ts`

### Explorer Pages
- `app/explorer/page.tsx`
- `app/explorer/organizations/page.tsx`
- `app/explorer/countries/page.tsx`
- `app/explorer/systems/page.tsx`

### Registry Pages
- `app/registry/page.tsx`
- `app/registry/[registryId]/page.tsx`
- `app/registry/ai-systems/page.tsx`
- `app/registry/ai-systems/[systemId]/page.tsx`

### Shared Contracts / Types
- `types/registry.ts`

### Trust Surface / Crypto
- `lib/crypto/verify-signing.ts`
- `public/widget/gafaig-widget.js`

### Developers / Trust Distribution
- `app/developers/page.tsx`

## App-Layer Rules Currently Active

### Registry Query Rule
Registry API and pages must query `CORE.V_REGISTRY_PUBLIC` using the live Snowflake contract. They must not rely on stale uppercase/camelCase assumptions that conflict with the actual view shape.

### Explorer Query Rule
Explorer pages must consume Snowflake-backed explorer query helpers only. Explorer must not derive public truth from raw workflow tables.

### Systems Explorer Rule
`/explorer/systems` must use only canonical public systems data. No TMP IDs, pre-public systems, or non-certified workflow rows should appear on the public explorer systems surface.

### UI Trust Rule
If a field is blank in the public UI, first check Snowflake public views and query mappings. Do not patch trust meaning in UI.

## Recently Stabilized Files

These files were central to the most recent stabilization work and should be treated as hot files:

### Snowflake
- `16_TABLES_CASE_SCORE_SNAPSHOTS.sql`
- `24_SP_SCORE_CASE_ENTERPRISE.sql`
- `25_PROCEDURES_APPROVAL.sql`
- `26_VIEWS_CASE_RENEWAL_STATUS.sql`
- `GAFAIG - Governance Scoring (Enterprise v1.2).sql`
- `GAFAIG - CORE.REGISTRY_PUBLISH.sql`
- `21_VIEWS_PUBLIC_REGISTRY.sql`
- `22_VIEWS_EXPLORER_STATS.sql`

### App / API
- `lib/queries/explorer.ts`
- `app/api/explorer/route.ts`
- `app/explorer/page.tsx`
- `app/explorer/organizations/page.tsx`
- `app/explorer/countries/page.tsx`
- `lib/queries/registry.ts`
- `app/api/registry/route.ts`

## Files to Watch Carefully Next

These are the most likely files to require the next production hardening pass:

### Snowflake
- `22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql`
- `21_VIEWS_PUBLIC_REGISTRY.sql`
- `GAFAIG - CORE.REGISTRY_PUBLISH.sql`

### VS Code / App
- `lib/queries/explorer.ts`
- `app/explorer/systems/page.tsx`
- `app/registry/ai-systems/page.tsx`
- `app/registry/ai-systems/[systemId]/page.tsx`
- `lib/queries/registry.ts`

## Files That Should Not Be Used as Public Truth Sources

These may exist and may be useful internally, but they are not to be treated as public trust sources for explorer/registry output:
- raw `CORE.REGISTRY_AI_SYSTEMS`
- raw workflow status on `CORE.VERIFICATION_CASES` as public publish gate
- helper or legacy tier/band views separate from `CORE.V_GOVERNANCE_SCORE_CASE`
- any UI-side derived lifecycle logic
- any API-side recomputation of approval/renewal/publishability

## Current Stable Production Checkpoint

Git checkpoint:
- `3f5a775`
- message: `Stabilize Snowflake-backed registry and explorer public surfaces`

This is the current clean baseline after:
- registry restoration
- explorer restoration
- Snowflake public view stabilization
- decision/renewal/publish enforcement stabilization

## Current Known Remaining Focus

1. Continue final registry integrity validation
2. Ensure `/explorer/systems` uses only canonical public systems data
3. Verify no revoked or non-public systems leak into public explorer systems surface
4. Verify public view/API/UI parity for counts and record presence
5. Preserve clean separation:
   - private workflow layer
   - public trust layer

## Immediate Next-Step Principle

All remaining fixes must follow this rule:

- fix Snowflake public view or query mapping first
- then fix API/query contract
- then fix UI binding
- never reverse that order

## Final Reminder

GAFAIG is now operating as a Snowflake-governed public trust system. The active file map must remain centered on:
- deterministic Snowflake lifecycle control
- append-only registry publication
- clean public trust projections
- app/API/UI parity with canonical view contracts