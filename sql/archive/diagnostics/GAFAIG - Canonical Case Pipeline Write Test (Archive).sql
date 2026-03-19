-- ============================================================
-- GAFAIG — Canonical Case Pipeline Write Test
-- Purpose:
--   Deterministically test whether CORE.VERIFICATION_CASES
--   is a valid canonical write layer
--   One row only
--   One immediate read-back
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Clean prior test row
-- ============================================================

DELETE FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-WRITE-TEST-0001';

-- ============================================================
-- 2) Insert one deterministic test row
-- ============================================================

INSERT INTO CORE.VERIFICATION_CASES (
  CASE_ID,
  PARTICIPANT_ID,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  ENTITY_NAME,
  VERIFICATION_TYPE,
  ORG_ID
)
VALUES (
  'CASE-WRITE-TEST-0001',
  'PART-WRITE-TEST-0001',
  'HG',
  'v1.0',
  'approved',
  'Write Test Organization',
  'participant',
  'ORG-WRITE-TEST-0001'
);

-- ============================================================
-- 3) Read back exact row
-- ============================================================

SELECT
  CASE_ID,
  PARTICIPANT_ID,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  ENTITY_NAME,
  VERIFICATION_TYPE,
  ORG_ID,
  CREATED_AT,
  UPDATED_AT
FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-WRITE-TEST-0001';

-- ============================================================
-- 4) Count check
-- ============================================================

SELECT
  COUNT(*) AS WRITE_TEST_COUNT
FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-WRITE-TEST-0001';

-- ============================================================
-- 5) Latest rows sanity check
-- ============================================================

SELECT
  CASE_ID,
  ENTITY_NAME,
  STATUS,
  ORG_ID,
  CREATED_AT
FROM CORE.VERIFICATION_CASES
ORDER BY CREATED_AT DESC
LIMIT 20;

-- ============================================================
-- END
-- ============================================================