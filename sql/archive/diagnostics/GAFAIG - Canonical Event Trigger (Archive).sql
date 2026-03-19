-- ============================================================
-- GAFAIG — Canonical Event Trigger
-- Purpose:
--   Trigger case creation via EVENTS (true ingestion path)
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Inspect EVENTS schema
-- ============================================================

DESC TABLE CORE.EVENTS;

-- ============================================================
-- 2) Clean prior canonical event
-- ============================================================

DELETE FROM CORE.EVENTS
WHERE EVENT_ID = 'EVT-CANON-0001';

-- ============================================================
-- 3) Insert canonical event (TRIGGER)
-- ============================================================

INSERT INTO CORE.EVENTS (
  EVENT_ID,
  EVENT_TYPE,
  PARTICIPANT_ID,
  CREATED_AT
)
VALUES (
  'EVT-CANON-0001',
  'CREATE_CASE',
  'PART-CANON-0001',
  CURRENT_TIMESTAMP()
);

-- ============================================================
-- 4) Verify event
-- ============================================================

SELECT *
FROM CORE.EVENTS
WHERE EVENT_ID = 'EVT-CANON-0001';

-- ============================================================
-- 5) Check if case now appears
-- ============================================================

SELECT *
FROM CORE.VERIFICATION_CASES
ORDER BY CREATED_AT DESC;

-- ============================================================
-- 6) Count check
-- ============================================================

SELECT COUNT(*) AS CASE_COUNT
FROM CORE.VERIFICATION_CASES;

-- ============================================================
-- END
-- ============================================================