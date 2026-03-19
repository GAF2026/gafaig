-- ============================================================
-- GAFAIG — Verification Case Projection Check
-- Purpose:
--   Trace how a canonical APPLICATIONS row projects into
--   verification-case-facing objects
--   Read-only diagnostics only
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Confirm canonical application exists
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
-- 2) Check participant linkage by application_id
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
-- 3) Check verification cases table for any projection
-- ============================================================

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
FROM CORE.VERIFICATION_CASES
WHERE PARTICIPANT_ID = 'PART-CANON-0001'
   OR ENTITY_NAME = 'Canonical Test Organization'
   OR ORG_ID = 'ORG-CANON-0001'
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 4) Check verification detail view
-- ============================================================

SELECT *
FROM CORE.V_VERIFICATION_CASE_DETAIL
WHERE APPLICATION_ID = 'APP-CANON-0001'
   OR ORG_NAME = 'Canonical Test Organization'
ORDER BY LAST_ACTIVITY_AT DESC NULLS LAST;

-- ============================================================
-- 5) Check admin submissions view
-- ============================================================

SELECT *
FROM CORE.V_ADMIN_SUBMISSIONS
WHERE APPLICATION_ID = 'APP-CANON-0001'
   OR ORG_NAME = 'Canonical Test Organization'
ORDER BY UPDATED_AT DESC NULLS LAST;

-- ============================================================
-- 6) Check score snapshots
-- ============================================================

SELECT *
FROM CORE.CASE_SCORE_SNAPSHOTS
WHERE APPLICATION_ID = 'APP-CANON-0001'
ORDER BY CALCULATED_AT DESC NULLS LAST;

-- ============================================================
-- 7) Check decisions
-- ============================================================

SELECT *
FROM CORE.DECISIONS
WHERE APPLICATION_ID = 'APP-CANON-0001'
ORDER BY CREATED_AT DESC NULLS LAST;

-- ============================================================
-- 8) Check registry snapshots
-- ============================================================

SELECT *
FROM CORE.REGISTRY_SNAPSHOTS
WHERE CASE_ID IN (
  SELECT CASE_ID
  FROM CORE.VERIFICATION_CASES
  WHERE PARTICIPANT_ID = 'PART-CANON-0001'
     OR ENTITY_NAME = 'Canonical Test Organization'
)
ORDER BY CREATED_AT DESC NULLS LAST;

-- ============================================================
-- 9) Latest related surfaces for quick inspection
-- ============================================================

SELECT
  APPLICATION_ID,
  REQUEST_ID,
  ORG_NAME,
  STATUS,
  UPDATED_AT
FROM CORE.APPLICATIONS
ORDER BY UPDATED_AT DESC
LIMIT 20;

SELECT
  PARTICIPANT_ID,
  APPLICATION_ID,
  ENTITY_NAME,
  UPDATED_AT
FROM CORE.PARTICIPANTS
ORDER BY UPDATED_AT DESC
LIMIT 20;

SELECT
  CASE_ID,
  PARTICIPANT_ID,
  ENTITY_NAME,
  STATUS,
  CREATED_AT
FROM CORE.VERIFICATION_CASES
ORDER BY CREATED_AT DESC
LIMIT 20;

-- ============================================================
-- END
-- ============================================================