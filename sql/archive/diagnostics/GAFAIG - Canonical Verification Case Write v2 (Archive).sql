-- ============================================================
-- GAFAIG — Canonical Verification Case Write (Guaranteed Correct)
-- Purpose:
--   Insert case using EXACT table schema (no guessing)
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Inspect TRUE schema (SOURCE OF TRUTH)
-- ============================================================

DESC TABLE CORE.VERIFICATION_CASES;

-- ============================================================
-- 2) Clean prior canonical case
-- ============================================================

DELETE FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-CANON-0001';

-- ============================================================
-- 3) INSERT using ONLY required columns
-- (based on real schema from DESC)
-- ============================================================

INSERT INTO CORE.VERIFICATION_CASES (
  CASE_ID,
  PARTICIPANT_ID,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  PRIORITY,
  SUBMITTED_AT,
  ORG_ID
)
VALUES (
  'CASE-CANON-0001',
  'PART-CANON-0001',
  'HG',
  'v1.0',
  'submitted',
  'medium',
  CURRENT_TIMESTAMP(),
  'ORG-CANON-0001'
);

-- ============================================================
-- 4) Verify insert
-- ============================================================

SELECT *
FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-CANON-0001';

-- ============================================================
-- 5) Count check
-- ============================================================

SELECT COUNT(*) AS CASE_COUNT
FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-CANON-0001';

-- ============================================================
-- END
-- ============================================================