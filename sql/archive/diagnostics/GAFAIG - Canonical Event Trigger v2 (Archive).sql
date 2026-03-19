-- ============================================================
-- GAFAIG — Canonical Event Trigger v2
-- Purpose:
--   Trigger case creation using REAL EVENTS schema
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Clean prior canonical event
-- ============================================================

DELETE FROM CORE.EVENTS
WHERE EVENT_ID = 'EVT-CANON-0001';

-- ============================================================
-- 2) Insert canonical event (schema-correct)
-- ============================================================

INSERT INTO CORE.EVENTS (
  EVENT_ID,
  APPLICATION_ID,
  EVENT_TYPE,
  ACTOR_TYPE,
  ACTOR_ID,
  EVENT_DETAILS,
  CREATED_AT
)
SELECT
  'EVT-CANON-0001' AS EVENT_ID,
  'APP-DEMO-2001' AS APPLICATION_ID,
  'APPLICATION_SUBMITTED' AS EVENT_TYPE,
  'system' AS ACTOR_TYPE,
  'system' AS ACTOR_ID,
  PARSE_JSON('{"source":"canonical_test"}') AS EVENT_DETAILS,
  CURRENT_TIMESTAMP() AS CREATED_AT;

-- ============================================================
-- 3) Verify event insert
-- ============================================================

SELECT *
FROM CORE.EVENTS
WHERE EVENT_ID = 'EVT-CANON-0001';

-- ============================================================
-- 4) Check verification cases
-- ============================================================

SELECT *
FROM CORE.VERIFICATION_CASES
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 5) Count check
-- ============================================================

SELECT COUNT(*) AS CASE_COUNT
FROM CORE.VERIFICATION_CASES;

-- ============================================================
-- END
-- ============================================================