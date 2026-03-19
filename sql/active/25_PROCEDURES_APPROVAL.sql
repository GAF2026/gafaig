-- ============================================================
-- 25_PROCEDURES_APPROVAL.sql
--
-- Purpose:
--   Case approval + unapproval procedures for GAFAIG registry
--
-- Responsibilities:
--   - Manage CASE status transitions
--   - Maintain approval audit log
--   - Provide controlled publish/unpublish interface
--
-- Notes:
--   - Case-centric (NOT application-centric)
--   - Safe to re-run
--   - No registry ID generation here
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Approval audit log
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS CORE.CASE_APPROVAL_LOG (
  LOG_ID      STRING,
  CASE_ID     STRING,
  ACTION      STRING,         -- APPROVE | UNAPPROVE
  ACTOR       STRING,
  ACTION_AT   TIMESTAMP_NTZ,
  NOTES       STRING
);

ALTER TABLE CORE.CASE_APPROVAL_LOG ADD COLUMN IF NOT EXISTS LOG_ID STRING;
ALTER TABLE CORE.CASE_APPROVAL_LOG ADD COLUMN IF NOT EXISTS CASE_ID STRING;
ALTER TABLE CORE.CASE_APPROVAL_LOG ADD COLUMN IF NOT EXISTS ACTION STRING;
ALTER TABLE CORE.CASE_APPROVAL_LOG ADD COLUMN IF NOT EXISTS ACTOR STRING;
ALTER TABLE CORE.CASE_APPROVAL_LOG ADD COLUMN IF NOT EXISTS ACTION_AT TIMESTAMP_NTZ;
ALTER TABLE CORE.CASE_APPROVAL_LOG ADD COLUMN IF NOT EXISTS NOTES STRING;

-- ------------------------------------------------------------
-- 2) APPROVE CASE
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE CORE.APPROVE_CASE_V1(
  P_CASE_ID STRING,
  P_ACTOR   STRING,
  P_NOTES   STRING
)
RETURNS VARIANT
LANGUAGE SQL
EXECUTE AS OWNER
AS
$$
DECLARE
  V_ACTOR STRING;
  V_NOTES STRING;
  V_EXISTS NUMBER;
BEGIN
  V_ACTOR := COALESCE(P_ACTOR, CURRENT_USER());
  V_NOTES := COALESCE(P_NOTES, 'Approved for public registry');

  SELECT COUNT(*)
    INTO :V_EXISTS
  FROM CORE.VERIFICATION_CASES
  WHERE CASE_ID = :P_CASE_ID;

  IF (:V_EXISTS = 0) THEN
    RETURN OBJECT_CONSTRUCT(
      'ok', FALSE,
      'error', 'Case not found',
      'caseId', :P_CASE_ID
    );
  END IF;

  UPDATE CORE.VERIFICATION_CASES
     SET STATUS = 'approved',
         APPROVED_AT = CURRENT_TIMESTAMP(),
         APPROVED_BY = :V_ACTOR,
         APPROVAL_NOTES = :V_NOTES,
         UNAPPROVED_AT = NULL,
         UNAPPROVED_BY = NULL,
         UPDATED_AT = CURRENT_TIMESTAMP()
   WHERE CASE_ID = :P_CASE_ID;

  INSERT INTO CORE.CASE_APPROVAL_LOG
    (LOG_ID, CASE_ID, ACTION, ACTOR, ACTION_AT, NOTES)
  SELECT
    UUID_STRING(),
    :P_CASE_ID,
    'APPROVE',
    :V_ACTOR,
    CURRENT_TIMESTAMP(),
    :V_NOTES;

  RETURN OBJECT_CONSTRUCT(
    'ok', TRUE,
    'action', 'approved',
    'caseId', :P_CASE_ID,
    'actor', :V_ACTOR,
    'notes', :V_NOTES
  );
END;
$$;

-- ------------------------------------------------------------
-- 3) UNAPPROVE CASE
-- ------------------------------------------------------------
CREATE OR REPLACE PROCEDURE CORE.UNAPPROVE_CASE_V1(
  P_CASE_ID STRING,
  P_ACTOR   STRING,
  P_NOTES   STRING
)
RETURNS VARIANT
LANGUAGE SQL
EXECUTE AS OWNER
AS
$$
DECLARE
  V_ACTOR STRING;
  V_NOTES STRING;
  V_EXISTS NUMBER;
BEGIN
  V_ACTOR := COALESCE(P_ACTOR, CURRENT_USER());
  V_NOTES := COALESCE(P_NOTES, 'Removed from public registry');

  SELECT COUNT(*)
    INTO :V_EXISTS
  FROM CORE.VERIFICATION_CASES
  WHERE CASE_ID = :P_CASE_ID;

  IF (:V_EXISTS = 0) THEN
    RETURN OBJECT_CONSTRUCT(
      'ok', FALSE,
      'error', 'Case not found',
      'caseId', :P_CASE_ID
    );
  END IF;

  UPDATE CORE.VERIFICATION_CASES
     SET STATUS = 'submitted',
         UNAPPROVED_AT = CURRENT_TIMESTAMP(),
         UNAPPROVED_BY = :V_ACTOR,
         APPROVAL_NOTES = :V_NOTES,
         UPDATED_AT = CURRENT_TIMESTAMP()
   WHERE CASE_ID = :P_CASE_ID;

  INSERT INTO CORE.CASE_APPROVAL_LOG
    (LOG_ID, CASE_ID, ACTION, ACTOR, ACTION_AT, NOTES)
  SELECT
    UUID_STRING(),
    :P_CASE_ID,
    'UNAPPROVE',
    :V_ACTOR,
    CURRENT_TIMESTAMP(),
    :V_NOTES;

  RETURN OBJECT_CONSTRUCT(
    'ok', TRUE,
    'action', 'unapproved',
    'caseId', :P_CASE_ID,
    'actor', :V_ACTOR,
    'notes', :V_NOTES
  );
END;
$$;

-- ------------------------------------------------------------
-- 4) Grants
-- ------------------------------------------------------------
GRANT USAGE ON PROCEDURE CORE.APPROVE_CASE_V1(STRING, STRING, STRING)
TO ROLE GAFAIG_APP_ROLE;

GRANT USAGE ON PROCEDURE CORE.UNAPPROVE_CASE_V1(STRING, STRING, STRING)
TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT ON TABLE CORE.CASE_APPROVAL_LOG
TO ROLE GAFAIG_APP_ROLE;

-- ============================================================
-- END
-- ============================================================