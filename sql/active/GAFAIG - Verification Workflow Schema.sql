-- =========================================================
-- GAFAIG - Verification Workflow Schema
-- Canonical private verification workflow tables
-- Database: GAFAIG_DB
-- Schema:   CORE
-- =========================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ---------------------------------------------------------
-- 1) VERIFICATION_CASES
-- Root container for a verification workflow
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.VERIFICATION_CASES (
  CASE_ID              STRING        NOT NULL,
  PARTICIPANT_ID       STRING        NOT NULL,

  ENTITY_NAME          STRING        NOT NULL,
  VERIFICATION_TYPE    STRING        NOT NULL,   -- org | system | product | jurisdiction | participant

  STANDARD_CODE        STRING        NOT NULL,
  STANDARD_VERSION     STRING        NOT NULL,

  STATUS               STRING        NOT NULL,   -- received | submitted | in_review | approved | rejected | suspended
  PRIORITY             STRING        DEFAULT 'normal',

  SUBMITTED_AT         TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  CREATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  UPDATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (CASE_ID)
);

-- ---------------------------------------------------------
-- 2) VERIFICATION_ASSIGNMENTS
-- Review ownership / assignment records
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.VERIFICATION_ASSIGNMENTS (
  ASSIGNMENT_ID        STRING        NOT NULL,
  CASE_ID              STRING        NOT NULL,

  ASSIGNED_TO          STRING        NOT NULL,
  ROLE                 STRING        DEFAULT 'reviewer',  -- reviewer | lead | auditor

  ASSIGNED_AT          TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  CREATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (ASSIGNMENT_ID)
);

-- ---------------------------------------------------------
-- 3) VERIFICATION_EVIDENCE
-- Evidence objects attached to a verification case
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.VERIFICATION_EVIDENCE (
  EVIDENCE_ID          STRING        NOT NULL,
  CASE_ID              STRING        NOT NULL,

  EVIDENCE_TYPE        STRING        NOT NULL,   -- policy | screenshot | log | report | attestation | link | dataset | document
  TITLE                STRING        NOT NULL,
  DESCRIPTION          STRING,

  SOURCE_URL           STRING,
  STORAGE_REF          STRING,

  SUBMITTED_BY         STRING,
  SUBMITTED_AT         TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  CREATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  UPDATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (EVIDENCE_ID)
);

-- ---------------------------------------------------------
-- 4) VERIFICATION_FINDINGS
-- Reviewer conclusions per control / check
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.VERIFICATION_FINDINGS (
  FINDING_ID           STRING        NOT NULL,
  CASE_ID              STRING        NOT NULL,

  CONTROL_ID           STRING        NOT NULL,
  CONTROL_TITLE        STRING        NOT NULL,

  RESULT               STRING        NOT NULL,   -- pass | partial | fail | needs_more_info | na
  RATIONALE            STRING,

  SEVERITY             STRING        DEFAULT 'medium',  -- low | medium | high | critical

  EVIDENCE_IDS         ARRAY,

  CREATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  UPDATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (FINDING_ID)
);

-- ---------------------------------------------------------
-- 5) VERIFICATION_EVENTS
-- Audit trail / workflow timeline
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.VERIFICATION_EVENTS (
  EVENT_ID             STRING        NOT NULL,
  CASE_ID              STRING        NOT NULL,

  EVENT_TYPE           STRING        NOT NULL,   -- submitted | status_changed | evidence_added | comment | decision | review_started

  ACTOR                STRING,
  DETAILS              VARIANT,

  CREATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (EVENT_ID)
);

-- ---------------------------------------------------------
-- 6) VERIFICATION_DECISIONS
-- Final decision record for a case
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.VERIFICATION_DECISIONS (
  DECISION_ID          STRING        NOT NULL,
  CASE_ID              STRING        NOT NULL,

  DECISION             STRING        NOT NULL,   -- approved | rejected | suspended

  DECIDED_BY           STRING,
  DECIDED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  SUMMARY              STRING,
  CONDITIONS           STRING,

  CREATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (DECISION_ID)
);

-- ---------------------------------------------------------
-- 7) VERIFICATION_FINDING_EVIDENCE
-- Link table between findings and evidence
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.VERIFICATION_FINDING_EVIDENCE (
  FINDING_ID           STRING        NOT NULL,
  EVIDENCE_ID          STRING        NOT NULL,
  CREATED_AT           TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

  PRIMARY KEY (FINDING_ID, EVIDENCE_ID)
);

-- ---------------------------------------------------------
-- 8) FINDING_EVIDENCE_MAP
-- Canonical case-scoped junction table used by scoring/debug
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.FINDING_EVIDENCE_MAP (
  CASE_ID              STRING        NOT NULL,
  FINDING_ID           STRING        NOT NULL,
  EVIDENCE_ID          STRING        NOT NULL,

  CREATED_AT           TIMESTAMP_NTZ NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  CREATED_BY           STRING        DEFAULT CURRENT_USER(),

  CONSTRAINT PK_FINDING_EVIDENCE_MAP PRIMARY KEY (CASE_ID, FINDING_ID, EVIDENCE_ID)
);

-- ---------------------------------------------------------
-- 9) APP ROLE ACCESS
-- ---------------------------------------------------------
GRANT SELECT, INSERT, DELETE
ON TABLE CORE.FINDING_EVIDENCE_MAP
TO ROLE GAFAIG_APP_ROLE;

-- =========================================================
-- END
-- =========================================================