-- =========================================================
-- GAFAIG — Scoring Model v1.0 (LOCKED CONTRACT) + Registry
-- =========================================================
-- This "locks" the deterministic engine outputs under v1.0 view names
-- and provides a registry-ready view for app + public surfaces.

USE ROLE ACCOUNTADMIN;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ---------------------------------------------------------
-- 1) LOCKED CONTRACT VIEWS (v1.0)
-- ---------------------------------------------------------
-- IMPORTANT:
-- These are the canonical stable names your app should consume going forward.
-- If we ever change the underlying engine logic later, we either:
--   - keep these v1.0 views unchanged, or
--   - introduce v1.1 views with new names.

CREATE OR REPLACE VIEW CORE.V_CASE_INPUTS_V1
COMMENT = 'GAFAIG Scoring Model v1.0 — deterministic engine inputs (locked contract).'
AS
SELECT * FROM CORE.V_CASE_INPUTS;

CREATE OR REPLACE VIEW CORE.V_CASE_SCORING_V1
COMMENT = 'GAFAIG Scoring Model v1.0 — weighted score output (locked contract).'
AS
SELECT * FROM CORE.V_CASE_SCORING;

CREATE OR REPLACE VIEW CORE.V_GOVERNANCE_SCORE_V1
COMMENT = 'GAFAIG Scoring Model v1.0 — final score + band + tier (locked contract).'
AS
SELECT * FROM CORE.V_GOVERNANCE_SCORE;

-- ---------------------------------------------------------
-- 2) REGISTRY VIEW (built off the v1.0 contract)
-- ---------------------------------------------------------
-- This is your “single pane of glass” for registry pages and dashboards.
-- It does NOT assume any extra tables beyond what you already have.

CREATE OR REPLACE VIEW CORE.V_REGISTRY_CASES_V1
COMMENT = 'GAFAIG Registry v1.0 — per-case public-ish summary built on Scoring Model v1.0.'
AS
WITH
-- Findings per case
F AS (
  SELECT
    CASE_ID,
    COUNT(*)                                          AS FINDINGS_TOTAL,
    SUM(IFF(UPPER(RESULT) IN ('PASS','FAIL'), 1, 0))   AS FINDINGS_SCORED,
    SUM(IFF(UPPER(RESULT) = 'NA', 1, 0))               AS FINDINGS_NA,
    MAX(COALESCE(UPDATED_AT, CREATED_AT))              AS FINDINGS_LAST_AT
  FROM CORE.VERIFICATION_FINDINGS
  GROUP BY CASE_ID
),

-- Evidence mapped to findings (junction)
FE AS (
  SELECT
    CASE_ID,
    COUNT(*)                         AS FINDING_EVIDENCE_LINKS,
    COUNT(DISTINCT FINDING_ID)       AS FINDINGS_WITH_EVIDENCE,
    COUNT(DISTINCT EVIDENCE_ID)      AS EVIDENCE_MAPPED_DISTINCT,
    MAX(CREATED_AT)                  AS MAP_LAST_AT
  FROM CORE.FINDING_EVIDENCE_MAP
  GROUP BY CASE_ID
),

-- Evidence per case (from VERIFICATION_EVIDENCE)
E AS (
  SELECT
    CASE_ID,
    COUNT(*)                                              AS EVIDENCE_TOTAL,
    COUNT(DISTINCT EVIDENCE_ID)                           AS EVIDENCE_DISTINCT,
    MAX(COALESCE(SUBMITTED_AT, CREATED_AT))               AS EVIDENCE_LAST_AT,
    MAX(COALESCE(SUBMITTED_AT, CREATED_AT))               AS NEWEST_EVIDENCE_AT
  FROM CORE.VERIFICATION_EVIDENCE
  GROUP BY CASE_ID
),

-- Evidence summaries (non-empty) per case
ES AS (
  SELECT
    e.CASE_ID,
    COUNT(*) AS EVIDENCE_WITH_SUMMARY,
    MAX(s.UPDATED_AT) AS SUMMARY_LAST_AT
  FROM CORE.VERIFICATION_EVIDENCE e
  JOIN CORE.EVIDENCE_SUMMARIES s
    ON s.EVIDENCE_ID = e.EVIDENCE_ID
  WHERE LENGTH(TRIM(COALESCE(s.SUMMARY,''))) > 0
  GROUP BY e.CASE_ID
),

-- "Valid evidence" for freshness: evidence that is BOTH
-- (a) mapped to a finding, and (b) has a non-empty summary
NV AS (
  SELECT
    m.CASE_ID,
    MAX(COALESCE(e.SUBMITTED_AT, e.CREATED_AT)) AS NEWEST_VALID_EVIDENCE_AT
  FROM CORE.FINDING_EVIDENCE_MAP m
  JOIN CORE.VERIFICATION_EVIDENCE e
    ON e.CASE_ID = m.CASE_ID
   AND e.EVIDENCE_ID = m.EVIDENCE_ID
  JOIN CORE.EVIDENCE_SUMMARIES s
    ON s.EVIDENCE_ID = e.EVIDENCE_ID
  WHERE LENGTH(TRIM(COALESCE(s.SUMMARY,''))) > 0
  GROUP BY m.CASE_ID
)

SELECT
  c.CASE_ID,
  c.ORG_ID,
  c.PARTICIPANT_ID,
  c.STANDARD_CODE,
  c.STANDARD_VERSION,
  c.STATUS                         AS CASE_STATUS,

  -- v1.0 score outputs (locked contract)
  gs.FINAL_SCORE,
  gs.BAND,
  gs.TIER,
  gs.CONTROLS_PCT,
  gs.COVERAGE_PCT,
  gs.FRESHNESS_PCT,
  gs.SUMMARY_PCT,

  -- Counts / auditability signals
  COALESCE(f.FINDINGS_TOTAL, 0)            AS FINDINGS_TOTAL,
  COALESCE(f.FINDINGS_SCORED, 0)           AS FINDINGS_SCORED,
  COALESCE(f.FINDINGS_NA, 0)               AS FINDINGS_NA,
  COALESCE(fe.FINDINGS_WITH_EVIDENCE, 0)   AS FINDINGS_WITH_EVIDENCE,

  COALESCE(e.EVIDENCE_TOTAL, 0)            AS EVIDENCE_TOTAL,
  COALESCE(es.EVIDENCE_WITH_SUMMARY, 0)    AS EVIDENCE_WITH_SUMMARY,

  -- Freshness anchor
  nv.NEWEST_VALID_EVIDENCE_AT,

  -- Last activity (best-effort)
  GREATEST(
    COALESCE(c.UPDATED_AT, c.CREATED_AT),
    COALESCE(f.FINDINGS_LAST_AT, TO_TIMESTAMP_NTZ('1970-01-01')),
    COALESCE(fe.MAP_LAST_AT,      TO_TIMESTAMP_NTZ('1970-01-01')),
    COALESCE(e.EVIDENCE_LAST_AT,  TO_TIMESTAMP_NTZ('1970-01-01')),
    COALESCE(es.SUMMARY_LAST_AT,  TO_TIMESTAMP_NTZ('1970-01-01'))
  ) AS LAST_ACTIVITY_AT

FROM CORE.VERIFICATION_CASES c
LEFT JOIN CORE.V_GOVERNANCE_SCORE_V1 gs
  ON gs.CASE_ID = c.CASE_ID
LEFT JOIN F  f  ON f.CASE_ID  = c.CASE_ID
LEFT JOIN FE fe ON fe.CASE_ID = c.CASE_ID
LEFT JOIN E  e  ON e.CASE_ID  = c.CASE_ID
LEFT JOIN ES es ON es.CASE_ID = c.CASE_ID
LEFT JOIN NV nv ON nv.CASE_ID = c.CASE_ID
;

-- ---------------------------------------------------------
-- 3) QUICK VERIFICATION QUERIES (optional)
-- ---------------------------------------------------------

-- List the v1 views (simple pattern)
SHOW VIEWS LIKE 'V%_V1' IN SCHEMA GAFAIG_DB.CORE;

-- Confirm CASE-0001 is registry-ready
SELECT *
FROM CORE.V_REGISTRY_CASES_V1
WHERE CASE_ID = 'CASE-0001';