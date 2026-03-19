-- ============================================================
-- GAFAIG — Identify Verification Case Write Path
-- Purpose:
--   Determine where verification cases are REALLY created
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Inspect VERIFICATION_CASES object type
-- ============================================================

SHOW OBJECTS LIKE 'VERIFICATION_CASES' IN SCHEMA CORE;

-- ============================================================
-- 2) Get full DDL (CRITICAL)
-- ============================================================

SELECT GET_DDL('TABLE', 'CORE.VERIFICATION_CASES');

-- If above fails (meaning it's not a table), try:

SELECT GET_DDL('VIEW', 'CORE.VERIFICATION_CASES');

-- ============================================================
-- 3) Inspect upstream tables likely feeding it
-- ============================================================

SHOW TABLES IN SCHEMA CORE;

-- ============================================================
-- 4) Check PARTICIPANTS linkage (likely driver)
-- ============================================================

SELECT *
FROM CORE.PARTICIPANTS
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 5) Check EVENTS table (very likely trigger source)
-- ============================================================

SELECT *
FROM CORE.EVENTS
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 6) Check DECISIONS (already working)
-- ============================================================

SELECT *
FROM CORE.DECISIONS
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 7) Check SCORE SNAPSHOTS
-- ============================================================

SELECT *
FROM CORE.CASE_SCORE_SNAPSHOTS
ORDER BY CREATED_AT DESC;

-- ============================================================
-- END
-- ============================================================
SHOW OBJECTS LIKE 'VERIFICATION_CASES' IN SCHEMA CORE;
SELECT GET_DDL('TABLE', 'CORE.VERIFICATION_CASES');