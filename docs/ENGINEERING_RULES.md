# ENGINEERING_RULES.md
Last Updated: 2026-04-23

---

## 🔴 CORE SYSTEM PRINCIPLE (NON-NEGOTIABLE)

GAFAIG is a deterministic AI governance registry.

- Snowflake is the ONLY source of truth
- All computation happens in Snowflake
- API and UI are projection layers ONLY
- No business logic outside Snowflake
- No recomputation outside Snowflake

Violation of any of the above = system corruption

---

## 🔴 BROKEN FILE PRIORITY (MANDATORY FIRST STEP)

Before ANY system work or rebuild:

Fix Snowflake run-order failures:

- 12_TABLES_PARTICIPANTS.sql
- 15_TABLES_EVENTS.sql

Reason:

- These break canonical run order
- They block deterministic rebuilds
- They can silently corrupt downstream workflow tables

👉 This is NOT optional. This is step zero.

---

## 🔑 ID PARITY RULE (CRITICAL)

All IDs MUST be:

- Generated in Snowflake ONLY
- NEVER generated in API or UI
- Passed through unchanged across all layers

Applies to:

- APPLICATION_ID
- CASE_ID
- REGISTRY_ID
- FINDING_ID
- EVIDENCE_ID
- EVENT_ID
- REGISTRY_SNAPSHOT_ID

Violation = system corruption

---

## 🧱 CANONICAL DATA FLOW (LOCKED)

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEWS → API → UI

Rules:

- Flow is append-only
- No back-editing of historical states
- Snapshots are immutable once published
- Every downstream layer must reflect upstream truth

---

## 🧮 SCORING RULE (STRICT)

- Scoring is defined ONLY in:
  - V_GOVERNANCE_SCORE_CASE

- Tier and Band are derived ONLY in Snowflake

NOT ALLOWED:

- API scoring logic
- UI scoring logic
- Widget scoring logic

---

## 🔒 PUBLIC vs PRIVATE DATA CONTRACT (PHASE 4 LOCK)

### ✅ PUBLIC (ALLOWED SURFACE)

These fields define the FULL public contract:

- REGISTRY_ID
- APPLICATION_ID
- CASE_ID
- ENTITY_NAME
- ENTITY_TYPE
- COUNTRY
- CERTIFICATION_STATUS
- CERTIFIED_AT
- VALID_FROM
- VALID_TO
- PUBLISHED_AT
- LIFECYCLE_STATUS
- RENEWAL_STATUS

---

### ❌ PRIVATE (STRICTLY FORBIDDEN IN PUBLIC SURFACE)

- DECISION_STATUS
- SCORE
- TIER
- BAND
- ANY SCORING BREAKDOWN
- ANY INTERNAL WORKFLOW STATE

These MUST NEVER appear in:

- V_REGISTRY_PUBLIC
- API responses
- UI components
- Widgets
- Verify payloads

Violation = breach of trust model

---

## 🧭 SEMANTIC DEFINITIONS (LOCKED)

- Approved = internal workflow state (PRIVATE)
- Certified = public trust outcome (PUBLIC)
- Verified = cryptographic validation (TRUST LAYER)

These MUST NOT be mixed or reinterpreted

---

## 🌐 TRUST SURFACE RULE (CRITICAL)

The ONLY trust authority:

- /api/verify/[registryId]

ALL systems must depend on it:

- UI
- Widgets
- Badges
- External consumers

No independent trust computation allowed

---

## 🔐 SIGNATURE CONTRACT (LOCKED)

Algorithm:

- Ed25519

Payload Rules:

- Deterministic JSON
- Stable ordering
- No hidden fields

Message Structure:

{
  registryId,
  entityName,
  certificationStatus,
  certifiedAt,
  validFrom,
  validTo
}

Output:

- signature
- signedAt
- kid
- verificationKeyUrl

---

## 🌍 WIDGET RULES

Widgets are:

- Read-only
- Stateless
- Trust consumers

Widgets MUST:

- Fetch from /api/verify
- Render public data
- Display proof state

Widgets MUST NOT:

- Compute trust
- Infer certification
- Modify payload

---

## 🧾 REGISTRY VIEW RULES

### V_REGISTRY_PUBLIC

Must:

- Represent latest approved snapshot per case
- Only include PUBLIC fields
- Be deterministic

Must NOT:

- Join private scoring data
- Expose decision workflow internals

---

## 🧪 VALIDATION REQUIREMENT

Every certified record MUST match across:

- Snowflake
- API
- UI
- Widget

Fields that must match:

- REGISTRY_ID
- CERTIFIED_AT
- VALID_FROM
- VALID_TO
- SIGNED PAYLOAD

Mismatch = system failure

---

## 🧱 APPEND-ONLY RULE

- No updates to historical records
- No overwrites
- New states = new rows

---

## ⚙️ ENVIRONMENT PARITY RULE

- Local = Vercel = Snowflake
- No environment-specific logic
- No fallback computation

---

## 🚫 FORBIDDEN ACTIONS

DO NOT:

- Re-architect the system
- Move logic out of Snowflake
- Create alternate data sources
- Generate IDs outside Snowflake
- Expose private workflow data
- Recompute scores outside scoring engine
- Build trust logic in UI/API

---

## 🧭 SYSTEM OWNERSHIP MODEL

- Snowflake = Authority
- API = Transport
- UI = Presentation
- Verify = Trust
- Widget = Distribution

---

## 🔐 FINAL RULE

If any change introduces:

- Non-determinism
- Duplicate logic
- Data inconsistency
- Trust ambiguity

👉 Reject the change

---

## ✅ PHASE 4 STATUS

- Public contract enforced
- Private boundary locked
- Verify endpoint authoritative
- Widget and badge aligned
- Trust surface complete

System state: STABLE + DETERMINISTIC

---

END OF FILE