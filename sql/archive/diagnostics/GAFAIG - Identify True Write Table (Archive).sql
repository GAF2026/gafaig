-- ============================================================
-- GAFAIG — Identify True Write Table
-- Purpose:
--   Determine the real writable ingestion layer behind
--   CORE.VERIFICATION_CASES
--   Do not modify schema
--   Read-only diagnostics only
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) List all objects in CORE
-- ============================================================

SHOW OBJECTS IN SCHEMA CORE;

-- ============================================================
-- 2) Candidate base tables likely involved in case creation
-- ============================================================

SHOW TABLES IN SCHEMA CORE;

-- ============================================================
-- 3) Inspect likely ingestion/write tables
-- ============================================================

DESCRIBE TABLE CORE.SUBMISSIONS;
DESCRIBE TABLE CORE.APPLICATIONS;
DESCRIBE TABLE CORE.PARTICIPANTS;
DESCRIBE TABLE CORE.EVENTS;

-- ============================================================
-- 4) Inspect current record shapes in likely write tables
-- ============================================================

SELECT *
FROM CORE.SUBMISSIONS
ORDER BY CREATED_AT DESC
LIMIT 10;

SELECT *
FROM CORE.APPLICATIONS
ORDER BY CREATED_AT DESC
LIMIT 10;

SELECT *
FROM CORE.PARTICIPANTS
ORDER BY CREATED_AT DESC
LIMIT 10;

SELECT *
FROM CORE.EVENTS
ORDER BY CREATED_AT DESC
LIMIT 10;

-- ============================================================
-- 5) Inspect verification-case-facing surfaces
-- ============================================================

SHOW OBJECTS LIKE 'VERIFICATION_CASES' IN SCHEMA CORE;

SELECT *
FROM CORE.VERIFICATION_CASES
ORDER BY CREATED_AT DESC
LIMIT 20;

-- ============================================================
-- 6) Inspect upstream workflow objects if they exist
-- ============================================================

SHOW OBJECTS LIKE 'V_VERIFICATION_CASE_DETAIL' IN SCHEMA CORE;
SHOW OBJECTS LIKE 'V_ADMIN_SUBMISSIONS' IN SCHEMA CORE;
SHOW OBJECTS LIKE 'CASE_SCORE_SNAPSHOTS' IN SCHEMA CORE;
SHOW OBJECTS LIKE 'DECISIONS' IN SCHEMA CORE;
SHOW OBJECTS LIKE 'REGISTRY_SNAPSHOTS' IN SCHEMA CORE;

-- ============================================================
-- 7) Row counts for likely write-path objects
-- ============================================================

SELECT 'SUBMISSIONS' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.SUBMISSIONS
UNION ALL
SELECT 'APPLICATIONS' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.APPLICATIONS
UNION ALL
SELECT 'PARTICIPANTS' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.PARTICIPANTS
UNION ALL
SELECT 'EVENTS' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.EVENTS
UNION ALL
SELECT 'VERIFICATION_CASES' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.VERIFICATION_CASES
UNION ALL
SELECT 'CASE_SCORE_SNAPSHOTS' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.CASE_SCORE_SNAPSHOTS
UNION ALL
SELECT 'DECISIONS' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.DECISIONS
UNION ALL
SELECT 'REGISTRY_SNAPSHOTS' AS OBJECT_NAME, COUNT(*) AS ROW_COUNT FROM CORE.REGISTRY_SNAPSHOTS;

-- ============================================================
-- END
-- ============================================================