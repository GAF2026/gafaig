-- ============================================================
-- GAFAIG — Canonical Case Pipeline Bootstrap
-- Purpose:
--   Clean deterministic bootstrap for verification case pipeline
--   Matches the real CORE.VERIFICATION_CASES schema
--   No policy changes
--   No publish actions
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Clean demo verification cases only
-- ============================================================

DELETE FROM CORE.VERIFICATION_CASES
WHERE CASE_ID LIKE 'CASE-DEMO-%';

-- ============================================================
-- 2) Insert canonical 8 demo cases
-- ============================================================

INSERT INTO CORE.VERIFICATION_CASES (
  CASE_ID,
  PARTICIPANT_ID,
  STANDARD_CODE,
  STANDARD_VERSION,
  STATUS,
  ENTITY_NAME,
  VERIFICATION_TYPE,
  ORG_ID
)
SELECT
  column1 AS CASE_ID,
  column2 AS PARTICIPANT_ID,
  column3 AS STANDARD_CODE,
  column4 AS STANDARD_VERSION,
  column5 AS STATUS,
  column6 AS ENTITY_NAME,
  column7 AS VERIFICATION_TYPE,
  column8 AS ORG_ID
FROM VALUES
  ('CASE-DEMO-4001','PART-DEMO-4001','HG','v1.0','approved','OpenAI','participant','ORG-DEMO-0001'),
  ('CASE-DEMO-4002','PART-DEMO-4002','HG','v1.0','approved','Anthropic','participant','ORG-DEMO-0002'),
  ('CASE-DEMO-4003','PART-DEMO-4003','HG','v1.0','approved','Google DeepMind','participant','ORG-DEMO-0003'),
  ('CASE-DEMO-4004','PART-DEMO-4004','HG','v1.0','approved','Mila AI Institute','participant','ORG-DEMO-0004'),
  ('CASE-DEMO-4005','PART-DEMO-4005','HG','v1.0','approved','Vector Institute','participant','ORG-DEMO-0005'),
  ('CASE-DEMO-4006','PART-DEMO-4006','HG','v1.0','approved','ETH Zurich AI Center','participant','ORG-DEMO-0006'),
  ('CASE-DEMO-4007','PART-DEMO-4007','HG','v1.0','approved','University of Oxford','participant','ORG-DEMO-0007'),
  ('CASE-DEMO-4008','PART-DEMO-4008','HG','v1.0','approved','MIT','participant','ORG-DEMO-0008');

-- ============================================================
-- 3) Verify demo cases are visible
-- ============================================================

SELECT
  CASE_ID,
  ENTITY_NAME,
  STATUS,
  ORG_ID,
  CREATED_AT
FROM CORE.VERIFICATION_CASES
WHERE CASE_ID LIKE 'CASE-DEMO-%'
ORDER BY CASE_ID;

-- ============================================================
-- 4) Count check
-- ============================================================

SELECT
  COUNT(*) AS DEMO_CASE_COUNT
FROM CORE.VERIFICATION_CASES
WHERE CASE_ID LIKE 'CASE-DEMO-%';

-- ============================================================
-- END
-- ============================================================