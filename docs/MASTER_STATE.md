# MASTER_STATE.md
Last Updated: 2026-04-16

---

## SYSTEM IDENTITY

GAFAIG (Global Authority for AI Governance) is the world’s first deterministic AI governance registry.

It is a system designed to:
- Evaluate AI systems
- Assign governance scores
- Issue certification decisions
- Publish verifiable public records
- Enable external trust through cryptographic verification

---

## CORE ARCHITECTURE

GAFAIG is built on a strict two-layer model:

1. PRIVATE VERIFICATION ENGINE (Snowflake)
2. PUBLIC TRUST LAYER (Views → API → UI)

---

## CANONICAL DATA FLOW

APPLICATION
→ CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEWS
→ API
→ UI

This flow is immutable and must never be re-architected.

---

## SOURCE OF TRUTH

Snowflake is the single source of truth.

All:
- scoring
- certification
- registry publication
- trust state

must originate in Snowflake.

No logic is allowed in:
- API
- UI

---

## CORE TABLES

APPLICATION
- CORE.APPLICATIONS

VERIFICATION
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS

SCORING
- CORE.CASE_SCORE_SNAPSHOTS

DECISION
- CORE.DECISIONS

REGISTRY
- CORE.REGISTRY_SNAPSHOTS
- CORE.REGISTRY_AI_SYSTEMS

---

## CORE VIEWS

REGISTRY (AUTHORITATIVE)
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED

AI SYSTEMS
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

EXPLORER / STATS
- CORE.V_REGISTRY_STATS_GLOBAL
- CORE.V_REGISTRY_STATS_BY_COUNTRY
- CORE.V_REGISTRY_STATS_BY_STATUS
- CORE.V_REGISTRY_STATS_BY_TIER
- CORE.V_REGISTRY_STATS_BY_BAND
- CORE.V_REGISTRY_STATS_BY_ENTITY_TYPE

SCORING
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_SCORE_BREAKDOWN_PUBLIC
- CORE.V_SCORE_DIMENSIONS_PUBLIC

---

## CORE PROCEDURES

- CORE.SP_CREATE_CASE_FROM_APPLICATION
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.APPROVE_CASE_V1
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

---

## TRUST MODEL

GAFAIG defines three trust states:

### 1. Unverified
- No evaluation completed
- No registry presence

### 2. Approved (Evaluated)
- Evaluation complete
- Decision issued
- Not yet published as certified record

### 3. Certified (Verified)
- Published in registry
- Has certification metadata
- Cryptographically signed
- Externally verifiable

---

## VERIFIED DEFINITION

A record is VERIFIED only if:

1. It exists in CORE.REGISTRY_SNAPSHOTS
2. It is exposed via CORE.V_REGISTRY_PUBLIC
3. It has a valid registryId
4. It has a valid cryptographic signature

Verified = Certified + Signed

---

## SIGNATURE SYSTEM

Algorithm:
- Ed25519

Proof object includes:
- alg
- kid
- signature
- signedAt
- verificationKeyUrl
- message
- messageString

Public key endpoint:
/api/.well-known/gafaig-public-key

Verification endpoint:
/api/verify/[registryId]

---

## SEED SYSTEM

Canonical seed:
- GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Rules:
- Only one seed file allowed
- Must follow full pipeline
- Must produce deterministic dataset

All legacy seed files are archived.

---

## PUBLIC SURFACES

### REGISTRY

- Authoritative
- Certified records only
- Source of verification

### EXPLORER

- Discovery layer
- Shows:
  - Approved systems
  - Certified systems
- Not authoritative

---

## API LAYER

Endpoints:

/api/registry
/api/registry/search
/api/registry/[registryId]
/api/registry/[registryId]/ai-systems
/api/explorer
/api/verify/[registryId]
/api/badge/[registryId]
/api/.well-known/gafaig-public-key

Rules:
- No computation
- No trust logic
- Must reflect Snowflake views exactly

---

## UI SYSTEM

Framework:
- Next.js (App Router)
- TypeScript

Layout:
- PublicPageHero system
- max-w-[1180px]
- px-6 padding
- space-y-8 spacing
- rounded-3xl containers
- border-black/10
- bg-white

No custom layout systems allowed.

---

## CURRENT STATE (APRIL 2026)

System is in CANONICALIZATION PHASE.

Status:

- Core pipeline implemented
- Seed system consolidated
- Public views exist but require fixes
- Explorer and Registry UI built
- Signature system operational

---

## CURRENT ISSUES

1. V_REGISTRY_PUBLIC incorrectly conflates Approved and Certified
2. CERTIFIED_AT incorrectly mapped
3. Explorer stats misaligned with actual data
4. Summary counts incorrect
5. Legacy seed files previously caused drift
6. Public trust surface not fully deterministic

---

## CURRENT PRIORITY

1. Fix 21_VIEWS_PUBLIC_REGISTRY.sql
2. Fix 22_VIEWS_EXPLORER_STATS.sql
3. Validate FINAL_CANONICAL_MULTI_SEED.sql
4. Re-run full pipeline
5. Align UI to corrected data
6. Archive non-canonical SQL files

---

## SYSTEM GUARANTEES (TARGET STATE)

GAFAIG must guarantee:

- Deterministic outputs
- Correct trust classification
- Accurate counts across all surfaces
- Clear separation of Approved vs Certified
- Immutable registry records
- Cryptographically verifiable public data

---

## DO NOT BREAK

- Canonical data flow
- Snowflake as source of truth
- Append-only registry
- Signature verification system
- Separation of trust states
- Public view contracts
- Layout system consistency

---

## FINAL RULE

If any layer:
- Computes its own logic
- Overrides Snowflake outputs
- Mixes trust states
- Breaks determinism

The system is invalid.

---

END OF FILE