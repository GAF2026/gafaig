-- ============================================================
-- GAFAIG — Canonical Verification Case Write (FINAL)
-- Purpose:
--   Create one deterministic verification case using the real
--   required VERIFICATION_CASES columns
--   No scoring
--   No publish
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Inspect actual schema
-- ============================================================

DESC TABLE CORE.VERIFICATION_CASES;

-- ============================================================
-- 2) Clean prior canonical case
-- ============================================================

DELETE FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-CANON-0001';

-- ============================================================
-- 3) Insert canonical verification case
-- ============================================================

INSERT INTO CORE.VERIFICATION_CASES (
  CASE_ID,
  PARTICIPANT_ID,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  ORG_ID
)
VALUES (
  'CASE-CANON-0001',
  'PART-CANON-0001',
  'GAFAIG',
  'v1.0',
  'submitted',
  'ORG-CANON-0001'
);

-- ============================================================
-- 4) Verify case creation directly
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
-- 6) Safe view inspection only
-- ============================================================

SELECT *
FROM CORE.V_VERIFICATION_CASE_DETAIL
LIMIT 20;

SELECT *
FROM CORE.V_ADMIN_SUBMISSIONS
LIMIT 20;

-- ============================================================
-- END
-- ============================================================
SELECT *
FROM CORE.VERIFICATION_CASES
ORDER BY CREATED_AT DESC;