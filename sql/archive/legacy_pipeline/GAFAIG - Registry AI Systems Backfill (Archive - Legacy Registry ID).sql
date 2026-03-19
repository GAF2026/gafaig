-- GAFAIG - Registry AI Systems Backfill.sql
-- Backfills REGISTRY_ID for AI systems attached to an already-published certification

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- Inspect AI systems currently in the system
SELECT *
FROM REGISTRY_AI_SYSTEMS
ORDER BY CREATED_AT DESC;

-- Attach AI systems from CASE-0001 to the first public registry record
UPDATE REGISTRY_AI_SYSTEMS
SET REGISTRY_ID = 'GAFAIG-00000001'
WHERE CASE_ID = 'CASE-0001'
  AND REGISTRY_ID IS NULL;

-- Verify linkage
SELECT
  SYSTEM_NAME,
  CASE_ID,
  REGISTRY_ID
FROM REGISTRY_AI_SYSTEMS
ORDER BY SYSTEM_NAME;