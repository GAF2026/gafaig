-- ============================================================
-- GAFAIG — Canonical Application Write
-- Purpose:
--   Deterministic write into true ingestion layer
--   Fully matches REQUIRED schema of CORE.APPLICATIONS
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Clean prior canonical test rows
-- ============================================================

DELETE FROM CORE.APPLICATIONS
WHERE REQUEST_ID = 'REQ-CANON-0001';

-- ============================================================
-- 2) Insert canonical application (ALL required fields)
-- ============================================================

INSERT INTO CORE.APPLICATIONS (
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
)
VALUES (
  'REQ-CANON-0001',
  'AI_SYSTEM',              -- REQUIRED (fixes your error)
  'approved',
  'Canonical Test Organization',
  'test@gafaig.com',
  'APP-CANON-0001',
  'Technology Company',
  'United States',
  CURRENT_TIMESTAMP(),
  CURRENT_TIMESTAMP()
);

-- ============================================================
-- 3) Verify application write
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
-- 4) Count check
-- ============================================================

SELECT
  COUNT(*) AS APPLICATION_WRITE_COUNT
FROM CORE.APPLICATIONS
WHERE REQUEST_ID = 'REQ-CANON-0001';

-- ============================================================
-- 5) Latest applications snapshot
-- ============================================================

SELECT
  REQUEST_ID,
  TYPE,
  STATUS,
  ORG_NAME,
  UPDATED_AT
FROM CORE.APPLICATIONS
ORDER BY UPDATED_AT DESC
LIMIT 20;

-- ============================================================
-- END
-- ============================================================