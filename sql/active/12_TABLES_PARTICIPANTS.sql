-- ============================================================
-- 12_TABLES_PARTICIPANTS.sql
--
-- Purpose:
--   Canonical PARTICIPANTS table
--   - Stores participating entities linked to applications
--   - Supports verification workflow and registry context
--
-- Safe to run multiple times (idempotent)
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Create table if missing
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.PARTICIPANTS (
  PARTICIPANT_ID STRING,
  APPLICATION_ID STRING,
  ENTITY_NAME    STRING,
  ENTITY_TYPE    STRING,   -- company | university | government | nonprofit | lab | etc
  COUNTRY        STRING,
  CREATED_AT     TIMESTAMP_NTZ,
  UPDATED_AT     TIMESTAMP_NTZ
);

-- ------------------------------------------------------------
-- 2) Harden schema
-- ------------------------------------------------------------
ALTER TABLE CORE.PARTICIPANTS ADD COLUMN IF NOT EXISTS PARTICIPANT_ID STRING;
ALTER TABLE CORE.PARTICIPANTS ADD COLUMN IF NOT EXISTS APPLICATION_ID STRING;
ALTER TABLE CORE.PARTICIPANTS ADD COLUMN IF NOT EXISTS ENTITY_NAME    STRING;
ALTER TABLE CORE.PARTICIPANTS ADD COLUMN IF NOT EXISTS ENTITY_TYPE    STRING;
ALTER TABLE CORE.PARTICIPANTS ADD COLUMN IF NOT EXISTS COUNTRY        STRING;
ALTER TABLE CORE.PARTICIPANTS ADD COLUMN IF NOT EXISTS CREATED_AT     TIMESTAMP_NTZ;
ALTER TABLE CORE.PARTICIPANTS ADD COLUMN IF NOT EXISTS UPDATED_AT     TIMESTAMP_NTZ;

-- ------------------------------------------------------------
-- 3) Backfill timestamps (non-destructive)
-- ------------------------------------------------------------
UPDATE CORE.PARTICIPANTS
SET
  CREATED_AT = COALESCE(CREATED_AT, CURRENT_TIMESTAMP()),
  UPDATED_AT = COALESCE(UPDATED_AT, CURRENT_TIMESTAMP())
WHERE CREATED_AT IS NULL OR UPDATED_AT IS NULL;

-- ============================================================
-- END
-- ============================================================