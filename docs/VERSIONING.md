# VERSIONING.md
Last Updated: 2026-04-15

## PURPOSE
This document defines the canonical versioning model for GAFAIG across Snowflake (data, scoring, decisions, registry), Next.js (API/UI), and the verification proof/signature system. Versioning is part of the trust model: all artifacts must be deterministic, traceable, and reproducible. No silent overwrites are permitted.

## CORE PRINCIPLES
- Snowflake is the source of truth
- All downstream layers must reflect Snowflake outputs
- Snapshots are append-only and immutable
- Each layer versions independently but must align
- Signatures bind to a specific data state at a point in time
- Breaking changes require explicit versioning (no implicit drift)

## VERSIONING LAYERS
- Case (evaluation instance)
- Scoring Model (governance logic)
- Score Snapshot (computed result)
- Decision (approval/certification outcome)
- Registry Snapshot (public record)
- Public Views (latest projection)
- API/UI (presentation layer; non-authoritative)
- Signature (proof of integrity)
- Key (signing key identity)

## CASE VERSIONING
- Key: CASE_ID
- Rules:
  - Unique, never reused
  - Represents a single evaluation lifecycle
  - Updates produce new downstream artifacts (score snapshots, decisions, registry snapshots)
  - No in-place mutation of historical state

## SCORING MODEL VERSIONING
- Key: MODEL_VERSION (e.g., "v1.2-enterprise")
- Rules:
  - Every scoring run must include MODEL_VERSION
  - Any logic change requires a new version
  - Historical scores remain valid under their original version
  - Publish must reference the correct model output

## SCORE SNAPSHOT VERSIONING
- Object: CORE.CASE_SCORE_SNAPSHOTS_V2 (live)
- Keys:
  - SNAPSHOT_ID (unique per snapshot)
  - CASE_ID
  - MODEL_VERSION
  - SCORE, SUBSCORES, TIER, BAND
  - SCORED_AT, CREATED_AT
- Rules:
  - Append-only; never update existing rows
  - Multiple snapshots per CASE_ID allowed
  - “Latest” is determined by SCORED_AT (or CREATED_AT as fallback)
  - Note: SNAPSHOT_AT is not a valid column in the live schema

## DECISION VERSIONING
- Object: CORE.DECISIONS
- Keys:
  - DECISION_ID (unique)
  - CASE_ID, APPLICATION_ID
  - DECISION_STATUS
  - CERTIFICATION_TIER, CERTIFICATION_BAND
  - VALID_FROM, VALID_TO
  - CREATED_AT
- Rules:
  - Multiple decisions per CASE_ID allowed
  - Latest decision (by CREATED_AT) is authoritative
  - Must align with the score snapshot used for certification
  - No overwriting of historical decisions

## REGISTRY SNAPSHOT VERSIONING
- Object: CORE.REGISTRY_SNAPSHOTS
- Keys:
  - REGISTRY_SNAPSHOT_ID (unique per publish)
  - REGISTRY_ID (stable across publishes for same entity/case lineage)
  - CASE_ID
  - CERTIFIED_SCORE, CERTIFIED_TIER, CERTIFIED_BAND
  - CERTIFIED_AT, APPROVED_AT, PUBLISHED_AT, CREATED_AT
- Rules:
  - Append-only; never update existing snapshots
  - Each publish creates a new snapshot
  - REGISTRY_ID is reused for subsequent publishes of the same lineage
  - REGISTRY_SNAPSHOT_ID changes every publish

## PUBLIC REGISTRY PROJECTION
- Views:
  - CORE.V_REGISTRY_LATEST_APPROVED
  - CORE.V_REGISTRY_PUBLIC
- Rules:
  - Expose only the latest snapshot per CASE_ID (row_number windowing)
  - Must never surface stale snapshots
  - Must derive lifecycle (Active/Expiring/Expired) from VALID_TO and current time
  - Must not compute scores; only project stored values

## SIGNATURE VERSIONING
- Fields:
  - proof.alg
  - proof.kid
  - proof.signature
  - proof.signedAt
  - proof.message
  - proof.messageString
- Rules:
  - Signature binds exactly to messageString
  - Any data change invalidates the signature
  - messageString must be deterministic (JSON.stringify of canonical message)
  - signedAt timestamps the signing event (not part of message payload unless explicitly included)

## KEY VERSIONING
- Environment:
  - GAFAIG_SIGNING_PRIVATE_KEY_PEM
  - GAFAIG_SIGNING_PUBLIC_KEY_PEM
  - GAFAIG_SIGNING_KEY_ID
  - GAFAIG_VERIFY_PUBLIC_KEY_PEM
  - GAFAIG_VERIFY_KID
- Rules:
  - kid uniquely identifies the signing key (e.g., "gafaig-ed25519-2026-01")
  - Key rotation must preserve ability to verify historical signatures
  - Public key endpoint must expose current verification key
  - Do not retroactively re-sign historical records

## API VERSIONING
- Current endpoints (unversioned):
  - /api/registry
  - /api/registry/search
  - /api/verify/[registryId]
  - /api/badge/[registryId]
  - /api/.well-known/gafaig-public-key
- Rules:
  - Maintain backward compatibility
  - Introduce versioned routes (e.g., /api/v2/...) for breaking changes
  - API must not compute authoritative values; it transports Snowflake outputs

## UI VERSIONING
- Next.js App Router
- Rules:
  - UI is not an authority; reflects Snowflake state
  - No caching of stale certification states that contradict Snowflake
  - Visual changes do not alter underlying version semantics

## WIDGET VERSIONING
- File: public/widget/gafaig-widget.js
- Rules:
  - Backward compatible for existing embeds
  - Breaking changes require a new script version/path (future)
  - Must reflect verify + registry truth without inference

## DEMO SEED VERSIONING
- File: GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql
- Rules:
  - Must align with live schema (DESC TABLE)
  - Must follow canonical run order (CASE → … → PUBLISH)
  - Must not bypass scoring or publish procedures
  - Updates must not invalidate prior demo lineage

## CANONICAL ALIGNMENT REQUIREMENT
All layers must align for a case:
CASE → FINDINGS → EVIDENCE → EVENTS → SCORING (MODEL_VERSION) → SCORE SNAPSHOT → DECISION → PUBLISH → REGISTRY SNAPSHOT → PUBLIC VIEW → SIGNATURE
If any layer is missing or misaligned, the system fails at scoring → publish.

## CURRENT STATE (2026-04-15)
- Base data loads succeed (cases, findings, evidence, events, decisions)
- SP_SCORE_CASE_ENTERPRISE executes but inserts 0 rows for rebuilt cases
- V_GOVERNANCE_SCORE_CASE does not surface rebuilt cases
- Publish procedures produce no registry snapshots for those cases
- Result: V_REGISTRY_PUBLIC remains unchanged for new cases

## DO NOT DO
- Do not overwrite or update snapshots
- Do not reuse CASE_IDs
- Do not mutate published registry records
- Do not change scoring logic without MODEL_VERSION bump
- Do not change messageString format
- Do not introduce non-deterministic fields into signed payloads

## SUMMARY
GAFAIG versioning is multi-layered and deterministic. CASE_ID tracks evaluation, MODEL_VERSION tracks scoring logic, SNAPSHOT_ID tracks computed results, DECISION_ID tracks approval, REGISTRY_SNAPSHOT_ID tracks public publication, and kid tracks the signing key. All layers must align to enable scoring, publishing, and verifiable trust.