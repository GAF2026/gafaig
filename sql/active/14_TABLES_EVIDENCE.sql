-- ============================================================
-- 14_TABLES_EVIDENCE.sql
--
-- Purpose:
--   Create / align evidence objects used by the verification workflow:
--     - CORE.VERIFICATION_EVIDENCE
--     - CORE.VERIFICATION_FINDING_EVIDENCE
--     - CORE.V_EVIDENCE_UI
--
-- Notes:
--   - Supports evidence records at the case level
--   - Supports linking one evidence item to one or more findings
--   - Provides a UI-friendly view for admin pages
--   - Safe to run multiple times
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ------------------------------------------------------------
-- 1) Evidence table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS GAFAIG_DB.CORE.VERIFICATION_EVIDENCE (
  EVIDENCE_ID    STRING        NOT NULL,
  CASE_ID        STRING        NOT NULL,

  EVIDENCE_TYPE  STRING        NOT NULL,
  TITLE          STRING        NULL,
  DESCRIPTION    STRING        NULL,

  SOURCE_URL     STRING        NULL,
  STORAGE_REF    STRING        NULL,

  SUBMITTED_BY   STRING        NULL,
  SUBMITTED_AT   TIMESTAMP_NTZ NULL,

  CREATED_AT     TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  UPDATED_AT     TIMESTAMP_NTZ NULL
);

-- Optional clustering for common UI / API access patterns
ALTER TABLE GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
CLUSTER BY (CASE_ID, CREATED_AT);

-- ------------------------------------------------------------
-- 2) Link table: finding ⇄ evidence
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE (
  CASE_ID      STRING        NOT NULL,
  FINDING_ID   STRING        NOT NULL,
  EVIDENCE_ID  STRING        NOT NULL,
  CREATED_AT   TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

ALTER TABLE GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE
CLUSTER BY (CASE_ID, FINDING_ID);

-- ------------------------------------------------------------
-- 3) UI-friendly evidence view
-- ------------------------------------------------------------
CREATE OR REPLACE VIEW GAFAIG_DB.CORE.V_EVIDENCE_UI AS
SELECT
  e.EVIDENCE_ID,
  e.CASE_ID,
  vc.PARTICIPANT_ID,

  fe.FINDING_ID,
  vf.CONTROL_TITLE AS FINDING_TITLE,

  e.EVIDENCE_TYPE,
  e.TITLE AS EVIDENCE_TITLE,
  e.DESCRIPTION,

  e.SOURCE_URL,
  e.STORAGE_REF,

  e.SUBMITTED_BY,
  e.SUBMITTED_AT,
  e.CREATED_AT,
  e.UPDATED_AT
FROM GAFAIG_DB.CORE.VERIFICATION_EVIDENCE e
LEFT JOIN GAFAIG_DB.CORE.VERIFICATION_CASES vc
  ON vc.CASE_ID = e.CASE_ID
LEFT JOIN GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE fe
  ON fe.EVIDENCE_ID = e.EVIDENCE_ID
 AND fe.CASE_ID = e.CASE_ID
LEFT JOIN GAFAIG_DB.CORE.VERIFICATION_FINDINGS vf
  ON vf.FINDING_ID = fe.FINDING_ID
 AND vf.CASE_ID = e.CASE_ID;

-- ------------------------------------------------------------
-- 4) Grants for application role
-- ------------------------------------------------------------
GRANT USAGE ON DATABASE GAFAIG_DB TO ROLE GAFAIG_APP_ROLE;
GRANT USAGE ON SCHEMA GAFAIG_DB.CORE TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT, INSERT, UPDATE
ON TABLE GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT, INSERT, DELETE
ON TABLE GAFAIG_DB.CORE.VERIFICATION_FINDING_EVIDENCE
TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT
ON TABLE GAFAIG_DB.CORE.VERIFICATION_CASES
TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT
ON TABLE GAFAIG_DB.CORE.VERIFICATION_FINDINGS
TO ROLE GAFAIG_APP_ROLE;

GRANT SELECT
ON VIEW GAFAIG_DB.CORE.V_EVIDENCE_UI
TO ROLE GAFAIG_APP_ROLE;

-- ============================================================
-- END
-- ============================================================