-- ============================================================
-- GAFAIG — End-to-End Pipeline Smoke Test
-- Purpose:
--   Validate full pipeline:
--   Scoring → Snapshot → Publish → Registry → Public Views
-- ============================================================

USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Score case
-- ============================================================

CALL CORE.SP_SCORE_CASE_ENTERPRISE('CASE-ENT-0001');

-- ============================================================
-- 2) Verify scoring snapshot
-- ============================================================

SELECT *
FROM CORE.CASE_SCORE_SNAPSHOTS_V2
WHERE CASE_ID = 'CASE-ENT-0001'
ORDER BY SCORED_AT DESC;

-- ============================================================
-- 3) Publish to registry
-- ============================================================

CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3('CASE-ENT-0001');

-- ============================================================
-- 4) Verify registry snapshot
-- ============================================================

SELECT *
FROM CORE.REGISTRY_SNAPSHOTS
WHERE CASE_ID = 'CASE-ENT-0001'
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 5) Verify public registry view
-- ============================================================

SELECT *
FROM CORE.V_REGISTRY_LATEST_APPROVED
WHERE CASE_ID = 'CASE-ENT-0001';

-- ============================================================
-- 6) Verify public governance signal
-- ============================================================

SELECT *
FROM CORE.V_PUBLIC_OVERSIGHT_SIGNAL
WHERE CASE_ID = 'CASE-ENT-0001';

-- ============================================================
-- END
-- ============================================================