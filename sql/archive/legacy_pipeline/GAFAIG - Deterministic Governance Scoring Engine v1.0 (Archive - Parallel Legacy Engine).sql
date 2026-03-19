-- ============================================================
-- GAFAIG — Deterministic Governance Scoring Engine v1.0
-- Snowflake-native deterministic scoring
-- Idempotent / safe to re-run
-- ============================================================

USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) SCORING MODEL REGISTRY (hardened for live schema)
-- ============================================================

CREATE TABLE IF NOT EXISTS SCORING_MODEL_VERSIONS (
  SCORING_MODEL_VERSION   STRING,
  MODEL_NAME              STRING,
  STATUS                  STRING,
  CREATED_AT              TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  NOTES                   STRING
);

-- Ensure all required columns exist even if table was created earlier
ALTER TABLE SCORING_MODEL_VERSIONS ADD COLUMN IF NOT EXISTS MODEL_NAME STRING;
ALTER TABLE SCORING_MODEL_VERSIONS ADD COLUMN IF NOT EXISTS STATUS STRING;
ALTER TABLE SCORING_MODEL_VERSIONS ADD COLUMN IF NOT EXISTS NOTES STRING;
ALTER TABLE SCORING_MODEL_VERSIONS ADD COLUMN IF NOT EXISTS CREATED_AT TIMESTAMP_NTZ;

MERGE INTO SCORING_MODEL_VERSIONS t
USING (SELECT 'v1.0' AS SCORING_MODEL_VERSION) s
ON t.SCORING_MODEL_VERSION = s.SCORING_MODEL_VERSION
WHEN NOT MATCHED THEN INSERT (
  SCORING_MODEL_VERSION, MODEL_NAME, STATUS, NOTES
)
VALUES (
  'v1.0',
  'GAFAIG Deterministic Oversight Scoring',
  'active',
  'Deterministic Snowflake logic. Scores reflect operational human oversight process presence + operation.'
);

-- ============================================================
-- 2) STANDARD CONTROLS
-- ============================================================

CREATE TABLE IF NOT EXISTS STANDARD_CONTROLS (
  STANDARD_CODE     STRING,
  STANDARD_VERSION  STRING,
  CONTROL_CODE      STRING,
  CONTROL_TITLE     STRING,
  CONTROL_DESC      STRING,
  WEIGHT            NUMBER(10,4),
  REQUIRED          BOOLEAN,
  CREATED_AT        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  UPDATED_AT        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

MERGE INTO STANDARD_CONTROLS t
USING (
  SELECT * FROM VALUES
    ('HG','v1.0','HG-01','Oversight charter exists','Defined scope + authority',1.0,TRUE),
    ('HG','v1.0','HG-02','Named accountable owners','Named accountable individuals',1.0,TRUE),
    ('HG','v1.0','HG-03','Workflow exists','Findings → evidence → decision',1.2,TRUE),
    ('HG','v1.0','HG-04','Audit trail retained','Timestamped decision history',1.0,TRUE),
    ('HG','v1.0','HG-05','Escalation process','Incident handling process',1.0,TRUE),
    ('HG','v1.0','HG-06','Review cadence','Periodic review + renewal triggers',0.8,TRUE)
) s(STANDARD_CODE,STANDARD_VERSION,CONTROL_CODE,CONTROL_TITLE,CONTROL_DESC,WEIGHT,REQUIRED)
ON t.STANDARD_CODE = s.STANDARD_CODE
AND t.STANDARD_VERSION = s.STANDARD_VERSION
AND t.CONTROL_CODE = s.CONTROL_CODE
WHEN NOT MATCHED THEN INSERT (
  STANDARD_CODE,STANDARD_VERSION,CONTROL_CODE,CONTROL_TITLE,CONTROL_DESC,WEIGHT,REQUIRED
)
VALUES (
  s.STANDARD_CODE,s.STANDARD_VERSION,s.CONTROL_CODE,s.CONTROL_TITLE,s.CONTROL_DESC,s.WEIGHT,s.REQUIRED
);

-- ============================================================
-- 3) CASE CONTROL ATTESTATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS CASE_CONTROL_ATTESTATIONS (
  CASE_ID           STRING,
  STANDARD_CODE     STRING DEFAULT 'HG',
  STANDARD_VERSION  STRING DEFAULT 'v1.0',
  CONTROL_CODE      STRING,
  CONTROL_STATUS    STRING,
  EVIDENCE_COUNT    NUMBER(18,0) DEFAULT 0,
  HAS_SUMMARY       BOOLEAN DEFAULT FALSE,
  LAST_TESTED_AT    TIMESTAMP_NTZ,
  UPDATED_AT        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- ============================================================
-- 4) CONTROL LEVEL CALCULATION VIEW
-- ============================================================

CREATE OR REPLACE VIEW V_CASE_CONTROL_SCORE_CALC_V1 AS
SELECT
  a.CASE_ID,
  a.CONTROL_CODE,
  c.WEIGHT,
  a.CONTROL_STATUS,
  a.EVIDENCE_COUNT,
  a.HAS_SUMMARY,
  a.LAST_TESTED_AT,

  CASE a.CONTROL_STATUS
    WHEN 'met' THEN 1.0
    WHEN 'partial' THEN 0.5
    WHEN 'not_met' THEN 0.0
    ELSE NULL
  END AS STATUS_SCORE,

  (CASE a.CONTROL_STATUS
    WHEN 'met' THEN 1.0
    WHEN 'partial' THEN 0.5
    WHEN 'not_met' THEN 0.0
    ELSE NULL
   END) * c.WEIGHT AS CONTROL_POINTS,

  c.WEIGHT AS CONTROL_DENOM,

  IFF(a.EVIDENCE_COUNT > 0,1.0,0.0) AS COVERAGE_FLAG,
  IFF(a.HAS_SUMMARY,1.0,0.0) AS SUMMARY_FLAG

FROM CASE_CONTROL_ATTESTATIONS a
JOIN STANDARD_CONTROLS c
  ON a.CONTROL_CODE = c.CONTROL_CODE
WHERE a.STANDARD_CODE='HG'
  AND a.STANDARD_VERSION='v1.0';

-- ============================================================
-- 5) CASE SCORE VIEW
-- ============================================================

CREATE OR REPLACE VIEW V_CASE_SCORE_CALC_V1 AS
SELECT
  CASE_ID,

  100 * SUM(CONTROL_POINTS) / NULLIF(SUM(CONTROL_DENOM),0) AS SUBSCORE_CONTROLS,
  100 * AVG(COVERAGE_FLAG) AS SUBSCORE_COVERAGE,
  100 * AVG(SUMMARY_FLAG) AS SUBSCORE_SUMMARIES,
  MAX(LAST_TESTED_AT) AS LAST_ACTIVITY_AT,

  LEAST(100,
    (0.5 * (100 * SUM(CONTROL_POINTS) / NULLIF(SUM(CONTROL_DENOM),0)))
  + (0.2 * (100 * AVG(COVERAGE_FLAG)))
  + (0.15 * (100 * AVG(SUMMARY_FLAG)))
  + (0.15 * 
      CASE
        WHEN MAX(LAST_TESTED_AT) IS NULL THEN 0
        WHEN DATEDIFF('day',MAX(LAST_TESTED_AT),CURRENT_TIMESTAMP()) <= 90 THEN 100
        WHEN DATEDIFF('day',MAX(LAST_TESTED_AT),CURRENT_TIMESTAMP()) <= 180 THEN 75
        ELSE 40
      END
    )
  ) AS SCORE

FROM V_CASE_CONTROL_SCORE_CALC_V1
GROUP BY CASE_ID;

-- ============================================================
-- 6) SNAPSHOT TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS CASE_SCORES_V1 (
  SNAPSHOT_ID       STRING,
  CASE_ID           STRING,
  MODEL_VERSION     STRING,
  SCORE             NUMBER(10,4),
  CREATED_AT        TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- ============================================================
-- 7) SCORING PROCEDURE
-- ============================================================

CREATE OR REPLACE PROCEDURE SP_SCORE_CASE_V1(P_CASE_ID STRING)
RETURNS VARIANT
LANGUAGE SQL
EXECUTE AS OWNER
AS
$$
DECLARE
  v_snapshot STRING;
BEGIN
  v_snapshot := CONCAT('SNP-',UUID_STRING());

  INSERT INTO CASE_SCORES_V1 (SNAPSHOT_ID,CASE_ID,MODEL_VERSION,SCORE)
  SELECT
    v_snapshot,
    CASE_ID,
    'v1.0',
    SCORE
  FROM V_CASE_SCORE_CALC_V1
  WHERE CASE_ID = P_CASE_ID;

  RETURN OBJECT_CONSTRUCT(
    'ok',true,
    'snapshotId',v_snapshot,
    'caseId',P_CASE_ID
  );
END;
$$;

-- ============================================================
-- 8) LATEST SCORE VIEW
-- ============================================================

CREATE OR REPLACE VIEW V_CASE_SCORE_LATEST_V1 AS
SELECT *
FROM CASE_SCORES_V1
QUALIFY ROW_NUMBER() OVER (PARTITION BY CASE_ID ORDER BY CREATED_AT DESC)=1;
INSERT INTO CASE_CONTROL_ATTESTATIONS
(CASE_ID,CONTROL_CODE,CONTROL_STATUS,EVIDENCE_COUNT,HAS_SUMMARY,LAST_TESTED_AT)
VALUES
('CASE-0001','HG-01','met',2,true,CURRENT_TIMESTAMP());

CALL SP_SCORE_CASE_V1('CASE-0001');

SELECT * FROM V_CASE_SCORE_LATEST_V1 WHERE CASE_ID='CASE-0001';