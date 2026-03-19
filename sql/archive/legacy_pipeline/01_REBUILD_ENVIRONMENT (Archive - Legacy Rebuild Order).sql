-- ============================================================
-- 01_REBUILD_ENVIRONMENT.sql
--
-- Purpose:
--   Master rebuild checklist for the GAFAIG Snowflake environment.
--
-- How to use:
--   Run the worksheets below in the listed order.
--   This file is the authoritative rebuild sequence and operator runbook.
--
-- Notes:
--   - Some files create/alter schema objects
--   - Some files seed demo data
--   - Some files provide diagnostics only
--   - Safe ordering matters
-- ============================================================

-- ------------------------------------------------------------
-- STEP 0 — Core platform setup
-- ------------------------------------------------------------
-- Run:
--   00_CORE_SETUP.sql
--
-- Creates:
--   - GAFAIG_DB
--   - core schemas
--   - GAFAIG_WH
--   - GAFAIG_APP_ROLE
--   - GAFAIG_APP_USER
--   - baseline grants
--   - minimal participant objects

-- ------------------------------------------------------------
-- STEP 1 — Core tables
-- ------------------------------------------------------------
-- Run in this order:
--   10_TABLES_SUBMISSIONS.sql
--   11_TABLES_APPLICATIONS.sql
--   12_TABLES_PARTICIPANTS.sql
--   13_TABLES_FINDINGS.sql
--   14_TABLES_EVIDENCE.sql
--   14_TABLES_REGISTRY_AI_SYSTEMS.sql
--   15_TABLES_EVENTS.sql
--   16_TABLES_CASE_SCORE_SNAPSHOTS.sql
--   17_TABLES_DECISIONS.sql

-- ------------------------------------------------------------
-- STEP 2 — Core / public views
-- ------------------------------------------------------------
-- Run in this order:
--   20_VIEWS_VERIFICATION_CASE_DETAIL.sql
--   21_VIEWS_PUBLIC_REGISTRY.sql
--   22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

-- ------------------------------------------------------------
-- STEP 3 — Grants and access validation
-- ------------------------------------------------------------
-- Run in this order:
--   23_GRANTS_REGISTRY_AI_SYSTEMS_PUBLIC.sql
--   24_GRANTS_AND_DIAGNOSTICS_PUBLIC_VIEWS.sql

-- ------------------------------------------------------------
-- STEP 4 — Demo data
-- ------------------------------------------------------------
-- Run in this order:
--   30_DEMO_DATA_SEEDING.sql
--   31_DEMO_DECISIONS_SEEDING.sql
--   32_DEMO_REGISTRY_AI_SYSTEMS_SEED.sql
--   33_DEMO_PARTICIPANTS_CURATED_SEED.sql

-- ------------------------------------------------------------
-- STEP 5 — Identity sync
-- ------------------------------------------------------------
-- Run:
--   40_PARTICIPANTS_AUTOSYNC.sql

-- ------------------------------------------------------------
-- STEP 6 — Diagnostics
-- ------------------------------------------------------------
-- Run as needed:
--   98_ENVIRONMENT_DIAGNOSTICS_REGISTRY.sql
--   99_ENVIRONMENT_DIAGNOSTICS.sql

-- ------------------------------------------------------------
-- OPTIONAL POST-REBUILD VALIDATION QUERIES
-- ------------------------------------------------------------

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- 1) Check core objects exist
SHOW TABLES IN SCHEMA GAFAIG_DB.CORE;
SHOW VIEWS IN SCHEMA GAFAIG_DB.CORE;

-- 2) Check app role access
SHOW GRANTS TO ROLE GAFAIG_APP_ROLE;

-- 3) Check public registry has rows
SELECT *
FROM GAFAIG_DB.CORE.V_PUBLIC_REGISTRY
ORDER BY certified_at DESC NULLS LAST
LIMIT 20;

-- 4) Check public AI systems view has rows
SELECT *
FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
ORDER BY DISPLAY_ORDER ASC, SYSTEM_NAME ASC
LIMIT 20;

-- 5) Check participants exist
SELECT
  NAME,
  PARTICIPANT_TYPE,
  COUNTRY,
  VERIFICATION_STATUS
FROM GAFAIG_DB.CORE.PARTICIPANTS
ORDER BY UPDATED_AT DESC, NAME ASC
LIMIT 50;