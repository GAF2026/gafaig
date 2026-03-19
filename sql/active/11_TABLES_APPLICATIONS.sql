-- ============================================================
-- 11_TABLES_APPLICATIONS.sql
--
-- Purpose:
--   Canonical APPLICATIONS table (ingestion layer)
--   - Stores incoming organization/application records
--   - Provides stable APPLICATION_ID for downstream pipeline
--
-- Safe to run multiple times (idempotent)
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Create table (base structure)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.APPLICATIONS (
  APPLICATION_ID STRING,
  REQUEST_ID     STRING,
  ORG_NAME       STRING,
  ORG_TYPE       STRING,
  COUNTRY        STRING,
  STATUS         STRING,
  CREATED_AT     TIMESTAMP_NTZ,
  UPDATED_AT     TIMESTAMP_NTZ
);

-- ------------------------------------------------------------
-- 2) Harden: ensure columns exist
-- ------------------------------------------------------------
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS APPLICATION_ID STRING;
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS REQUEST_ID     STRING;
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS ORG_NAME       STRING;
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS ORG_TYPE       STRING;
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS COUNTRY        STRING;
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS STATUS         STRING;
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS CREATED_AT     TIMESTAMP_NTZ;
ALTER TABLE CORE.APPLICATIONS ADD COLUMN IF NOT EXISTS UPDATED_AT     TIMESTAMP_NTZ;

-- ------------------------------------------------------------
-- 3) Backfill APPLICATION_ID (deterministic)
-- ------------------------------------------------------------
UPDATE CORE.APPLICATIONS
SET APPLICATION_ID = COALESCE(
  APPLICATION_ID,
  REQUEST_ID,
  CONCAT('APP-', UUID_STRING())
)
WHERE APPLICATION_ID IS NULL;

-- ------------------------------------------------------------
-- 4) Backfill timestamps (non-destructive)
-- ------------------------------------------------------------
UPDATE CORE.APPLICATIONS
SET
  CREATED_AT = COALESCE(CREATED_AT, CURRENT_TIMESTAMP()),
  UPDATED_AT = COALESCE(UPDATED_AT, CURRENT_TIMESTAMP())
WHERE CREATED_AT IS NULL OR UPDATED_AT IS NULL;

-- ============================================================
-- END
-- ============================================================