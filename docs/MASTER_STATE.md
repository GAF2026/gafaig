# MASTER_STATE.md
Last Updated: 2026-04-15

## SYSTEM IDENTITY
GAFAIG = Global Authority for AI Governance. GAFAIG is a trust infrastructure for AI systems, providing a deterministic, auditable, and publicly searchable registry of governance outcomes. It functions similarly to a certificate authority, audit registry, and ratings system combined. It is not a SaaS dashboard; it is a public trust layer backed by a private verification engine.

## CORE ARCHITECTURE
The system is composed of two layers: (1) Private Verification Engine (Snowflake) and (2) Public Trust Surface (Next.js). Snowflake performs all authoritative operations including case management, findings, evidence, events, scoring, decisions, registry snapshot creation, and public view projection. Next.js renders the registry, explorer, verify, widget, and API endpoints by reading Snowflake outputs. No business logic, scoring, or certification decisions occur in Next.js.

## CORE PRINCIPLE
Snowflake is the single source of truth. All APIs, UI pages, widgets, and verification outputs must strictly reflect Snowflake data. No derived logic in the application layer may override or reinterpret Snowflake outputs.

## CANONICAL EXECUTION FLOW
CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → SCORE SNAPSHOT → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEW → VERIFY (SIGNATURE). This order is deterministic and enforced. Failure at any stage blocks downstream layers.

## CURRENT PLATFORM STATE

### WORKING (CONFIRMED)
Public surfaces:
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

API layer:
- /api/registry
- /api/registry/search
- /api/verify/[registryId]
- /api/badge/[registryId]
- /api/.well-known/gafaig-public-key

Proof/signature system:
- Ed25519 signing implemented
- deterministic message payload
- public key endpoint live
- external verification possible

UI:
- unified layout across pages
- correct separation of Approved vs Certified
- stable navigation and rendering

## ACTIVE BLOCKER
The system is currently blocked at SCORING → PUBLISH.

Observed behavior:
- Cases inserted successfully
- Findings inserted successfully
- Evidence inserted successfully
- Events inserted successfully
- Decisions inserted successfully
- SP_SCORE_CASE_ENTERPRISE executes but inserts 0 rows
- V_GOVERNANCE_SCORE_CASE returns no rows for new cases
- SP_PUBLISH_CASE_TO_REGISTRY_V3 produces no registry snapshots
- V_REGISTRY_PUBLIC does not show new cases

## ROOT CAUSE
This is not a UI issue, not an API issue, and no longer a schema mismatch issue. The root cause is a SCORING INPUT CONTRACT FAILURE. The rebuilt seed data does not satisfy the exact conditions required by the scoring engine (SP_SCORE_CASE_ENTERPRISE and V_GOVERNANCE_SCORE_CASE), so scoring emits no rows, and publish has nothing to process.

## CONFIRMED LIVE DATA CONTRACTS

### VERIFICATION_CASES
Key fields include: CASE_ID, ENTITY_NAME, STATUS, APPLICATION_ID, ORG_ID, CREATED_AT, SUBMITTED_AT, APPROVED_AT, DECIDED_AT, PRIORITY, ASSIGNED_REVIEWER, DECISION_SUMMARY. CASE_ID is unique and drives all downstream relationships.

### VERIFICATION_FINDINGS (CRITICAL)
Correct fields: CONTROL_ID, CONTROL_TITLE, RESULT, RATIONALE, SEVERITY, EVIDENCE_IDS (array), CREATED_AT, UPDATED_AT, ORG_ID. Prior assumptions using RAW_CONTROL_ID or RESULT_RAW are invalid.

### VERIFICATION_EVIDENCE
Fields include: EVIDENCE_ID, CASE_ID, EVIDENCE_TYPE, TITLE, DESCRIPTION, SOURCE_URL, STORAGE_REF, SUBMITTED_BY, SUBMITTED_AT, CREATED_AT, UPDATED_AT, ORG_ID.

### DECISIONS
Fields include: DECISION_ID, APPLICATION_ID, SNAPSHOT_ID, DECISION_STATUS, CERTIFICATION_TIER, CERTIFICATION_BAND, VALID_FROM, VALID_TO, CREATED_AT, CASE_ID.

### SCORE STORAGE
Live table: CORE.CASE_SCORE_SNAPSHOTS_V2. Fields include CASE_ID, MODEL_VERSION, SCORE, SUBSCORE_CONTROLS, SUBSCORE_COVERAGE, SUBSCORE_FRESHNESS, SUBSCORE_OPERATIONAL, TIER, BAND, RENEWAL_STATUS, EVENTS_90D, SCORED_AT, CREATED_AT. SNAPSHOT_AT is not a valid column.

## SCORING SYSTEM

Active components:
- GAFAIG - Governance Scoring (Enterprise v1.2).sql
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CASE_TIER_BAND
- CORE.V_CASE_RENEWAL_STATUS
- CORE.V_FINDING_UNMAPPED_CONTROLS

Current behavior: SP_SCORE_CASE_ENTERPRISE runs but returns rowsInserted = 0, indicating that required inputs are not satisfied.

## REGISTRY SYSTEM

Snapshot layer:
- CORE.REGISTRY_SNAPSHOTS (append-only)
- CORE.V_REGISTRY_LATEST_APPROVED

Publish layer:
- SP_PUBLISH_CASE_TO_REGISTRY_V3
- SP_PUBLISH_CASE_TO_REGISTRY_V4

Public layer:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_PUBLIC_SEARCH

Publish requires valid score output; without it, registry remains unchanged.

## TRUST MODEL

Verified: cryptographic integrity confirmed via signature.
Approved: evaluated and decision recorded.
Certified: evaluated, meets thresholds, published, and time-valid.

Certification is time-bound and governed by VALID_FROM and VALID_TO. Lifecycle states include Active, Expiring Soon, Expired, and Not Certified.

## PROOF / SIGNATURE SYSTEM

Location:
- app/api/verify/[registryId]/route.ts
- lib/crypto/verify-signing.ts

Algorithm:
- Ed25519

Payload:
- deterministic JSON message
- signed as messageString

Public key endpoint:
- /api/.well-known/gafaig-public-key

Verification is independent of approval and certification.

## SYSTEM CONSTRAINTS

- Do not compute scores in API or UI
- Do not bypass publish procedures
- Do not mutate registry snapshots
- Do not invent schema fields
- Do not break proof contract
- Do not re-architect system

## DEMO SEED SYSTEM

Primary file:
- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql

Goal:
- seed 12 cases across industries
- mix of certified and approved

Current status:
- base data loads correctly
- scoring pipeline not satisfied
- publish not triggered

## ACTIVE PRIORITY

Focus exclusively on:
SP_SCORE_CASE_ENTERPRISE → V_GOVERNANCE_SCORE_CASE → PUBLISH

Determine:
- required event states
- required control mappings
- required case status values
- required relationships across findings, evidence, and events

## NEXT EXECUTION STRATEGY

1. Inspect SP_SCORE_CASE_ENTERPRISE logic in detail
2. Trace dependencies into V_CASE_SCORE_ENTERPRISE and V_GOVERNANCE_SCORE_CASE
3. Compare working legacy cases vs new seed cases
4. Identify missing inputs or signals
5. Adjust seed data to satisfy scoring contract
6. Re-run scoring and publish

## STABILITY STATUS

Stable:
- frontend architecture
- API layer
- verification system
- widget system
- registry UI

Unstable:
- scoring pipeline inputs
- seed-to-score alignment
- publish trigger conditions

## SYSTEM RISK

If scoring is not resolved:
- registry will not update
- no new certifications can be issued
- platform appears static
- trust layer loses credibility

## SUMMARY

GAFAIG system architecture is complete and functioning at the surface level. The verification proof system is operational. The data layer is populated correctly. The only blocking issue is the scoring input contract. Resolving scoring will unlock publishing, registry growth, and full platform functionality.