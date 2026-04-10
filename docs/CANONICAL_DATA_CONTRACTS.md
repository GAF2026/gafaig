# GAFAIG — CANONICAL DATA CONTRACTS (LOCKED) — 2026-04-10

## PURPOSE
This document defines the exact schemas for all Snowflake views and API responses.

These contracts are NON-NEGOTIABLE.

If a contract changes, the system must be updated everywhere consistently.

---

## SNOWFLAKE VIEW CONTRACTS

### CORE.V_REGISTRY_PUBLIC

FIELDS:
REGISTRY_ID
CASE_ID
ENTITY_NAME
VERIFICATION_TYPE
CERTIFIED_SCORE
CERTIFIED_TIER
CERTIFIED_BAND
CERTIFIED_AT
DECISION_STATUS

RULES:
- One row per CASE_ID (latest approved only)
- Source = REGISTRY_SNAPSHOTS
- No joins to private data

---

### CORE.V_SCORE_DIMENSIONS_PUBLIC

FIELDS:
CASE_ID
DIMENSION
DIMENSION_SCORE
CONTROLS_COUNT

RULES:
- MUST return exactly 5 rows per CASE_ID
- One per governance dimension
- Missing values must be COALESCE to 0

---

### CORE.V_SCORE_BREAKDOWN_PUBLIC

FIELDS:
CASE_ID
DIMENSION
COMPONENT_NAME
COMPONENT_SCORE

RULES:
- Control-level breakdown
- Never exposed publicly beyond controlled surfaces

---

## API CONTRACTS

### GET /api/registry

RETURNS:
[
  {
    registryId,
    entityName,
    tier,
    band,
    certifiedAt
  }
]

---

### GET /api/registry/[registryId]

RETURNS:
{
  registryId,
  entityName,
  tier,
  band,
  certifiedAt,
  decisionStatus
}

---

### GET /api/registry/[registryId]/score-breakdown

RETURNS:
{
  registryId,
  dimensions: [
    {
      name,
      score,
      controls
    }
  ]
}

RULES:
- Must return exactly 5 dimensions
- Order must be consistent

---

### GET /api/verify/[registryId]

RETURNS:
{
  registryId,
  message,
  signature,
  alg,
  kid,
  signedAt,
  verificationKeyUrl
}

---

## CONTRACT RULES

- No additional fields without versioning
- No missing fields allowed
- No renaming without full system update
- All IDs must be uppercase
- All timestamps ISO-8601

---

## FINAL RULE

If the contract is violated → the system is broken.