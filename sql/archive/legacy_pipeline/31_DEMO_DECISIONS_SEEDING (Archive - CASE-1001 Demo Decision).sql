-- ============================================================
-- 31_DEMO_DECISIONS_SEEDING.sql
--
-- Purpose:
--   Seed demo verification decisions for demo cases.
--
-- Demo cases:
--   CASE-1001  OpenAI — ChatGPT Platform
--
-- Safe to rerun:
--   Deletes and recreates demo decisions.
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

SET CASE_OPENAI = 'CASE-1001';

-- ------------------------------------------------------------
-- 1) Remove existing demo decision
-- ------------------------------------------------------------
DELETE FROM GAFAIG_DB.CORE.VERIFICATION_DECISIONS
WHERE CASE_ID = $CASE_OPENAI;

-- ------------------------------------------------------------
-- 2) Insert approved decision
-- ------------------------------------------------------------
INSERT INTO GAFAIG_DB.CORE.VERIFICATION_DECISIONS (
    DECISION_ID,
    CASE_ID,
    DECISION,
    DECIDED_BY,
    DECIDED_AT,
    SUMMARY,
    CONDITIONS,
    CREATED_AT
)
VALUES
(
    'DEC-1001',
    $CASE_OPENAI,
    'approved',
    'lead.reviewer@gafaig.com',
    DATEADD(day, -5, CURRENT_TIMESTAMP()),
    'Meets HG v1.0 baseline requirements based on submitted evidence.',
    'Maintain incident reporting and annual renewal.',
    CURRENT_TIMESTAMP()
);

-- ------------------------------------------------------------
-- 3) Verify registry surface
-- ------------------------------------------------------------
SELECT *
FROM GAFAIG_DB.CORE.V_PUBLIC_REGISTRY
ORDER BY certified_at DESC NULLS LAST;