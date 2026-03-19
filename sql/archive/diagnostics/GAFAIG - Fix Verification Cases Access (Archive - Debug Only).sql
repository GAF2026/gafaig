-- ============================================================
-- GAFAIG — Fix Verification Cases Access
-- Purpose:
--   Make verification case data readable for Snowflake admin/debugging
--   Confirm whether a row access policy is attached
--   Remove it if attached
--   Create an unrestricted debug view
--   Prove writes are visible
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Show current table definition
-- ============================================================

DESC TABLE CORE.VERIFICATION_CASES;

SHOW OBJECTS LIKE 'VERIFICATION_CASES' IN SCHEMA CORE;

-- ============================================================
-- 2) Show any row access policies in the database
-- ============================================================

SHOW ROW ACCESS POLICIES IN DATABASE GAFAIG_DB;

-- ============================================================
-- 3) Try to remove a row access policy if one is attached
--
-- NOTE:
--   Snowflake requires the policy name.
--   We try the most likely GAFAIG policy names one by one.
--   Ignore failures for names that do not exist or are not attached.
-- ============================================================

ALTER TABLE CORE.VERIFICATION_CASES DROP ROW ACCESS POLICY GAFAIG_VERIFICATION_CASES_RAP;
ALTER TABLE CORE.VERIFICATION_CASES DROP ROW ACCESS POLICY VERIFICATION_CASES_RAP;
ALTER TABLE CORE.VERIFICATION_CASES DROP ROW ACCESS POLICY CORE_VERIFICATION_CASES_RAP;
ALTER TABLE CORE.VERIFICATION_CASES DROP ROW ACCESS POLICY RAP_VERIFICATION_CASES;

-- ============================================================
-- 4) Create a raw unrestricted debug view directly on the table
-- ============================================================

CREATE OR REPLACE VIEW CORE.V_VERIFICATION_CASES_DEBUG AS
SELECT
  CASE_ID,
  PARTICIPANT_ID,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  PRIORITY,
  SUBMITTED_AT,
  STARTED_AT,
  DECIDED_AT,
  REVIEW_DUE_AT,
  RENEWAL_DUE_AT,
  ASSIGNED_REVIEWER,
  DECISION_SUMMARY,
  CREATED_AT,
  UPDATED_AT,
  ENTITY_NAME,
  VERIFICATION_TYPE,
  ORG_ID,
  APPROVED_AT,
  APPROVED_BY,
  APPROVAL_NOTES,
  UNAPPROVED_AT,
  UNAPPROVED_BY,
  UNAPPROVAL_REASON
FROM CORE.VERIFICATION_CASES;

-- ============================================================
-- 5) Write one deterministic debug row
-- ============================================================

DELETE FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-DEBUG-0001';

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
  'CASE-DEBUG-0001',
  'PART-DEBUG-0001',
  'HG',
  'v1.0',
  'approved',
  'Debug Verification Case',
  'participant',
  'ORG-DEBUG-0001'
);

-- ============================================================
-- 6) Read from the raw table
-- ============================================================

SELECT
  CASE_ID,
  ENTITY_NAME,
  STATUS,
  ORG_ID,
  CREATED_AT
FROM CORE.VERIFICATION_CASES
WHERE CASE_ID = 'CASE-DEBUG-0001';

-- ============================================================
-- 7) Read from the debug view
-- ============================================================

SELECT
  CASE_ID,
  ENTITY_NAME,
  STATUS,
  ORG_ID,
  CREATED_AT
FROM CORE.V_VERIFICATION_CASES_DEBUG
WHERE CASE_ID = 'CASE-DEBUG-0001';

-- ============================================================
-- 8) Show latest rows from both raw table and debug view
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

SELECT
  CASE_ID,
  ENTITY_NAME,
  STATUS,
  ORG_ID,
  CREATED_AT
FROM CORE.V_VERIFICATION_CASES_DEBUG
ORDER BY CREATED_AT DESC
LIMIT 20;

-- ============================================================
-- 9) Count checks
-- ============================================================

SELECT COUNT(*) AS RAW_TABLE_COUNT
FROM CORE.VERIFICATION_CASES;

SELECT COUNT(*) AS DEBUG_VIEW_COUNT
FROM CORE.V_VERIFICATION_CASES_DEBUG;

-- ============================================================
-- END
-- ============================================================
SHOW OBJECTS LIKE 'VERIFICATION_CASES' IN SCHEMA CORE;