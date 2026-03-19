-- ============================================================
-- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql
-- Purpose: Deterministic scoring results for verification cases
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Create table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.CASE_SCORE_SNAPSHOTS (
  SNAPSHOT_ID      STRING,
  CASE_ID          STRING,
  APPLICATION_ID   STRING,

  TOTAL_SCORE      NUMBER,
  TIER             STRING,
  BAND             STRING,

  SCORE_COMPONENTS VARIANT,

  CALCULATED_AT    TIMESTAMP_NTZ
);

-- ------------------------------------------------------------
-- 2) Harden schema
-- ------------------------------------------------------------
ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS SNAPSHOT_ID STRING;
ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS CASE_ID STRING;
ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS APPLICATION_ID STRING;

ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS TOTAL_SCORE NUMBER;
ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS TIER STRING;
ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS BAND STRING;

ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS SCORE_COMPONENTS VARIANT;
ALTER TABLE CORE.CASE_SCORE_SNAPSHOTS ADD COLUMN IF NOT EXISTS CALCULATED_AT TIMESTAMP_NTZ;

-- ============================================================
-- END
-- ============================================================