-- ============================================================
-- 13_TABLES_FINDINGS.sql
-- Purpose: Governance findings for verification cases
-- ============================================================

USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Create table if missing
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.FINDINGS (
  FINDING_ID     STRING,
  APPLICATION_ID STRING,
  PARTICIPANT_ID STRING,
  CONTROL_CODE   STRING,
  CONTROL_DOMAIN STRING,
  STATUS         STRING,      -- open | satisfied | failed | not_applicable
  SEVERITY       STRING,      -- low | medium | high | critical
  CREATED_AT     TIMESTAMP_NTZ,
  UPDATED_AT     TIMESTAMP_NTZ
);

-- ------------------------------------------------------------
-- 2) Harden schema
-- ------------------------------------------------------------
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS FINDING_ID STRING;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS APPLICATION_ID STRING;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS PARTICIPANT_ID STRING;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS CONTROL_CODE STRING;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS CONTROL_DOMAIN STRING;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS STATUS STRING;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS SEVERITY STRING;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS CREATED_AT TIMESTAMP_NTZ;
ALTER TABLE CORE.FINDINGS ADD COLUMN IF NOT EXISTS UPDATED_AT TIMESTAMP_NTZ;

-- ------------------------------------------------------------
-- 3) Diagnostics
-- ------------------------------------------------------------
SHOW TABLES LIKE 'FINDINGS' IN SCHEMA GAFAIG_DB.CORE;

SHOW COLUMNS IN TABLE CORE.FINDINGS;

SELECT COUNT(*) AS total_findings
FROM CORE.FINDINGS;