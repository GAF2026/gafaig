# GAFAIG — CANONICAL DIMENSION SYSTEM (LOCKED) — 2026-04-10

## PURPOSE
Defines the governance dimension system used across GAFAIG.

This is the foundation of the public trust explanation layer.

---

## GOVERNANCE DIMENSIONS (FIXED — MUST ALWAYS BE 5)

1. Transparency
2. Accountability
3. Safety & Risk Management
4. Human Oversight
5. Data Governance

---

## HARD RULES

- EXACTLY 5 dimensions per CASE
- No more, no less
- Always returned even if score = 0
- Order must be consistent

---

## DIMENSION MAPPING LOGIC

Transparency:
CONTROL_DOMAIN LIKE '%transparen%'

Accountability:
CONTROL_DOMAIN LIKE '%account%'

Safety & Risk Management:
CONTROL_DOMAIN LIKE '%risk%' OR '%safety%'

Human Oversight:
CONTROL_DOMAIN LIKE '%human%' OR '%oversight%'

Data Governance:
CONTROL_DOMAIN LIKE '%data%' OR '%govern%'

---

## DIMENSION BASE SET (REQUIRED)

SELECT 'Transparency'
UNION ALL SELECT 'Accountability'
UNION ALL SELECT 'Safety & Risk Management'
UNION ALL SELECT 'Human Oversight'
UNION ALL SELECT 'Data Governance'

---

## ENFORCEMENT LOGIC

- LEFT JOIN dimension base set to actual scores
- COALESCE missing values to 0
- GROUP BY CASE_ID + DIMENSION

---

## FAILURE CONDITIONS

If ANY of the following occur:
- Less than 5 rows
- More than 5 rows
- NULL dimension
- Unmapped control

→ SYSTEM IS INVALID

---

## FINAL RULE

Dimension consistency is REQUIRED for trust integrity.