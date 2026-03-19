-- ============================================================
-- GAFAIG — Canonical Submission Trigger
-- Purpose:
--   Insert the canonical submission row that should bridge
--   APPLICATIONS into the verification workflow
--   Uses schema-safe diagnostics for unknown view shapes
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Inspect real SUBMISSIONS schema first
-- ============================================================

DESC TABLE CORE.SUBMISSIONS;

-- ============================================================
-- 2) Clean prior canonical submission row
-- ============================================================

DELETE FROM CORE.SUBMISSIONS
WHERE REQUEST_ID = 'REQ-CANON-0001';

-- ============================================================
-- 3) Insert canonical submission
-- ============================================================

INSERT INTO CORE.SUBMISSIONS (
  REQUEST_ID,
  SUBMISSION_TYPE,
  CONTACT_EMAIL,
  STATUS,
  CREATED_AT
)
VALUES (
  'REQ-CANON-0001',
  'application',
  'test@gafaig.com',
  'submitted',
  CURRENT_TIMESTAMP()
);

-- ============================================================
-- 4) Verify submission write
-- ============================================================

SELECT
  REQUEST_ID,
  SUBMISSION_TYPE,
  CONTACT_EMAIL,
  STATUS,
  CREATED_AT
FROM CORE.SUBMISSIONS
WHERE REQUEST_ID = 'REQ-CANON-0001';

-- ============================================================
-- 5) Confirm canonical application still exists
-- ============================================================

SELECT
  REQUEST_ID,
  TYPE,
  STATUS,
  ORG_NAME,
  EMAIL,
  APPLICATION_ID,
  ORG_TYPE,
  COUNTRY,
  CREATED_AT,
  UPDATED_AT
FROM CORE.APPLICATIONS
WHERE REQUEST_ID = 'REQ-CANON-0001';

-- ============================================================
-- 6) Confirm participant linkage still exists
-- ============================================================

SELECT
  PARTICIPANT_ID,
  APPLICATION_ID,
  ENTITY_NAME,
  ENTITY_TYPE,
  COUNTRY,
  CREATED_AT,
  UPDATED_AT
FROM CORE.PARTICIPANTS
WHERE APPLICATION_ID = 'APP-CANON-0001'
   OR ENTITY_NAME = 'Canonical Test Organization'
ORDER BY UPDATED_AT DESC;

-- ============================================================
-- 7) Check verification cases table directly
-- ============================================================

SELECT
  CASE_ID,
  PARTICIPANT_ID,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  PRIORITY,
  CREATED_AT,
  UPDATED_AT,
  ENTITY_NAME,
  VERIFICATION_TYPE,
  ORG_ID
FROM CORE.VERIFICATION_CASES
WHERE PARTICIPANT_ID = 'PART-CANON-0001'
   OR ENTITY_NAME = 'Canonical Test Organization'
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 8) Safe inspection of verification detail view
-- ============================================================

SELECT *
FROM CORE.V_VERIFICATION_CASE_DETAIL
LIMIT 20;

-- ============================================================
-- 9) Safe inspection of admin submissions view
-- ============================================================

SELECT *
FROM CORE.V_ADMIN_SUBMISSIONS
LIMIT 20;

-- ============================================================
-- 10) Count checks
-- ============================================================

SELECT COUNT(*) AS SUBMISSION_COUNT
FROM CORE.SUBMISSIONS
WHERE REQUEST_ID = 'REQ-CANON-0001';

SELECT COUNT(*) AS CASE_COUNT
FROM CORE.VERIFICATION_CASES
WHERE ENTITY_NAME = 'Canonical Test Organization'
   OR PARTICIPANT_ID = 'PART-CANON-0001';

-- ============================================================
-- END
-- ============================================================