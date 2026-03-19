-- ============================================================
-- 20_VIEWS_VERIFICATION_CASE_DETAIL.sql
-- Purpose:
--   Unified “case detail” surface for the app.
--   Built to be resilient to your current schema:
--   - DOES NOT reference APPLICATIONS.PARTICIPANT_ID
--   - DOES NOT reference APPLICATIONS.APPLICATION_TYPE
--   - DOES NOT reference SUBMISSIONS.SUBMISSION_REQUEST_ID
--   - Joins SUBMISSIONS on REQUEST_ID (verified present)
--   - Exposes CERTIFIED_AT (from DECISIONS.CREATED_AT)
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

CREATE OR REPLACE VIEW CORE.V_VERIFICATION_CASE_DETAIL AS
WITH
latest_snapshot AS (
  SELECT
    css.*,
    ROW_NUMBER() OVER (
      PARTITION BY css.application_id
      ORDER BY css.calculated_at DESC NULLS LAST
    ) AS rn
  FROM CORE.CASE_SCORE_SNAPSHOTS css
),
latest_decision AS (
  SELECT
    d.*,
    ROW_NUMBER() OVER (
      PARTITION BY d.application_id
      ORDER BY d.created_at DESC NULLS LAST
    ) AS rn
  FROM CORE.DECISIONS d
),
finding_counts AS (
  SELECT
    f.application_id,
    COUNT(*) AS total_findings
  FROM CORE.FINDINGS f
  GROUP BY f.application_id
),
evidence_counts AS (
  SELECT
    f.application_id,
    COUNT(e.evidence_id) AS total_evidence
  FROM CORE.FINDINGS f
  LEFT JOIN CORE.EVIDENCE e
    ON e.finding_id = f.finding_id
  GROUP BY f.application_id
),
event_counts AS (
  SELECT
    ev.application_id,
    COUNT(*) AS total_events
  FROM CORE.EVENTS ev
  GROUP BY ev.application_id
)

SELECT
  -- Identity
  a.application_id                                           AS application_id,
  a.request_id                                               AS request_id,

  -- Application surface
  a.org_name                                                 AS org_name,
  a.status                                                   AS application_status,

  -- Submissions (best-effort: your SUBMISSIONS table uses REQUEST_ID)
  s.submission_type                                          AS submission_type,
  s.contact_email                                            AS contact_email,
  s.status                                                   AS submission_status,
  s.created_at                                               AS submission_created_at,

  -- Latest score snapshot (if any)
  ls.snapshot_id                                             AS snapshot_id,
  ls.total_score                                             AS total_score,
  ls.tier                                                    AS score_tier,
  ls.calculated_at                                           AS score_calculated_at,

  -- Latest decision (if any)
  d.decision_id                                              AS decision_id,
  d.decision_status                                          AS decision_status,
  d.certification_tier                                       AS certification_tier,
  d.certification_band                                       AS certification_band,
  d.valid_from                                               AS valid_from,
  d.valid_to                                                 AS valid_to,
  d.created_at                                               AS decision_created_at,

  -- This powers the public registry ordering
  d.created_at                                               AS certified_at,

  -- Last activity (max across key timestamps we have)
  GREATEST(
    COALESCE(d.created_at,        '1970-01-01'::timestamp),
    COALESCE(ls.calculated_at,    '1970-01-01'::timestamp),
    COALESCE(s.created_at,        '1970-01-01'::timestamp)
  )                                                          AS last_activity_at,

  -- Counts (for admin dashboards / QA)
  COALESCE(fc.total_findings, 0)                             AS total_findings,
  COALESCE(ec.total_evidence, 0)                             AS total_evidence,
  COALESCE(ev.total_events,   0)                             AS total_events

FROM CORE.APPLICATIONS a

-- submissions join on REQUEST_ID (your earlier diagnostics show this matches)
LEFT JOIN CORE.SUBMISSIONS s
  ON s.request_id = a.request_id

LEFT JOIN latest_snapshot ls
  ON ls.application_id = a.application_id
 AND ls.rn = 1

LEFT JOIN latest_decision d
  ON d.application_id = a.application_id
 AND d.rn = 1

LEFT JOIN finding_counts fc
  ON fc.application_id = a.application_id

LEFT JOIN evidence_counts ec
  ON ec.application_id = a.application_id

LEFT JOIN event_counts ev
  ON ev.application_id = a.application_id
;

-- Quick test
SELECT *
FROM CORE.V_VERIFICATION_CASE_DETAIL
ORDER BY last_activity_at DESC NULLS LAST
LIMIT 25;

-- Grant for app role (safe to re-run)
GRANT SELECT ON VIEW CORE.V_VERIFICATION_CASE_DETAIL TO ROLE GAFAIG_APP_ROLE;