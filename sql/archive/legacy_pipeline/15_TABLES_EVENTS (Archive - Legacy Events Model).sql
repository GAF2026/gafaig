-- ============================================================
-- 15_TABLES_EVENTS.sql
-- Purpose: Verification workflow audit log
-- ============================================================

USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Create table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.EVENTS (
  EVENT_ID        STRING,
  APPLICATION_ID  STRING,
  FINDING_ID      STRING,
  EVIDENCE_ID     STRING,
  EVENT_TYPE      STRING,   -- finding_created | evidence_uploaded | evidence_verified | status_changed | score_calculated | decision_issued
  ACTOR_TYPE      STRING,   -- reviewer | system | organization
  ACTOR_ID        STRING,
  EVENT_DETAILS   VARIANT,
  CREATED_AT      TIMESTAMP_NTZ
);

-- ------------------------------------------------------------
-- 2) Harden schema
-- ------------------------------------------------------------
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS EVENT_ID STRING;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS APPLICATION_ID STRING;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS FINDING_ID STRING;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS EVIDENCE_ID STRING;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS EVENT_TYPE STRING;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS ACTOR_TYPE STRING;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS ACTOR_ID STRING;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS EVENT_DETAILS VARIANT;
ALTER TABLE CORE.EVENTS ADD COLUMN IF NOT EXISTS CREATED_AT TIMESTAMP_NTZ;

-- ------------------------------------------------------------
-- 3) Diagnostics
-- ------------------------------------------------------------
SHOW TABLES LIKE 'EVENTS' IN SCHEMA GAFAIG_DB.CORE;

SHOW COLUMNS IN TABLE CORE.EVENTS;

SELECT COUNT(*) AS total_events
FROM CORE.EVENTS;