-- ============================================================
-- GAFAIG - Scoring Smoke Test
-- Purpose:
--   Validate canonical scoring pipeline for CASE-0001
-- ============================================================

USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

CALL CORE.SP_SCORE_CASE_ENTERPRISE('CASE-0001');

SELECT *
FROM CORE.V_CASE_SCORE_ENTERPRISE
WHERE CASE_ID = 'CASE-0001';

SELECT *
FROM CORE.CASE_SCORE_SNAPSHOTS_V2
WHERE CASE_ID = 'CASE-0001'
ORDER BY SCORED_AT DESC;

SELECT *
FROM CORE.V_CONTROL_SCORE_COMPONENTS
WHERE CASE_ID = 'CASE-0001';