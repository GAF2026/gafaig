-- GAFAIG - Score Snapshot Tier Band Backfill.sql
-- Ensures historical score snapshots contain Tier and Band classifications

USE ROLE ACCOUNTADMIN;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- Backfill Tier and Band for any snapshot missing values
UPDATE CASE_SCORE_SNAPSHOTS_V2
SET
  TIER = COALESCE(
    TIER,
    CASE
      WHEN FINAL_SCORE >= 70 THEN 'Standard Assurance'
      WHEN FINAL_SCORE >= 60 THEN 'Provisional'
      ELSE 'Not Verified'
    END
  ),
  BAND = COALESCE(
    BAND,
    CASE
      WHEN FINAL_SCORE >= 90 THEN 'A'
      WHEN FINAL_SCORE >= 80 THEN 'B'
      WHEN FINAL_SCORE >= 70 THEN 'C'
      WHEN FINAL_SCORE >= 60 THEN 'D'
      ELSE 'E'
    END
  )
WHERE TIER IS NULL
   OR BAND IS NULL;

-- Verification query
SELECT
  SNAPSHOT_ID,
  CASE_ID,
  FINAL_SCORE,
  TIER,
  BAND,
  SNAPSHOT_AT
FROM CASE_SCORE_SNAPSHOTS_V2
ORDER BY SNAPSHOT_AT DESC;