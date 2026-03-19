-- ============================================================
-- GAFAIG — Verify Case Pipeline (Schema Safe)
-- Purpose:
--   Inspect downstream pipeline tables without assumptions
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Verification cases (already working)
-- ============================================================

SELECT *
FROM CORE.VERIFICATION_CASES
LIMIT 20;

-- ============================================================
-- 2) Score snapshots
-- ============================================================

SELECT *
FROM CORE.CASE_SCORE_SNAPSHOTS
LIMIT 20;

-- ============================================================
-- 3) Decisions
-- ============================================================

SELECT *
FROM CORE.DECISIONS
LIMIT 20;

-- ============================================================
-- 4) Registry snapshots
-- ============================================================

SELECT *
FROM CORE.REGISTRY_SNAPSHOTS
LIMIT 20;

-- ============================================================
-- END
-- ============================================================