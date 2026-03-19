-- ============================================================
-- 10_TABLES_SUBMISSIONS.sql
-- Purpose: Core intake table for GAFAIG submissions
-- Safe to run multiple times (idempotent)
-- ============================================================

USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;

CREATE SCHEMA IF NOT EXISTS CORE;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- SUBMISSIONS
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS SUBMISSIONS (
  REQUEST_ID       STRING PRIMARY KEY,
  SUBMISSION_TYPE  STRING,                 -- e.g. "application" | "renewal" | "update"
  ORG_NAME         STRING,
  CONTACT_EMAIL    STRING,
  STATUS           STRING DEFAULT 'submitted', -- submitted | in_review | approved | rejected | archived
  REQUESTED_TIER   STRING,                 -- e.g. "Standard Assurance"
  RENEWAL_PERIOD   STRING,                 -- optional human-readable (e.g. "365d")
  CREATED_AT       TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  UPDATED_AT       TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  RAW              VARIANT
);

-- Optional but recommended: status guardrail
ALTER TABLE SUBMISSIONS
  ADD CONSTRAINT IF NOT EXISTS CK_SUBMISSIONS_STATUS
  CHECK (STATUS IN ('submitted','in_review','approved','rejected','archived'));

-- Diagnostics
SHOW TABLES LIKE 'SUBMISSIONS' IN SCHEMA GAFAIG_DB.CORE;
SHOW TABLES IN SCHEMA GAFAIG_DB.CORE;

-- Quick sanity check (won't error if table exists)
SELECT COUNT(*) AS total_submissions FROM SUBMISSIONS;