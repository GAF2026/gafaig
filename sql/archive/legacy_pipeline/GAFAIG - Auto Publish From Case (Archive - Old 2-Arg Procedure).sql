-- ============================================================
-- GAFAIG — Auto Publish From Case
-- Purpose:
--   Automatically publish all scored cases not yet in registry
--   using canonical publish procedure
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Create procedure
-- ============================================================

CREATE OR REPLACE PROCEDURE CORE.SP_AUTO_PUBLISH_ALL_CASES()
RETURNS VARCHAR
LANGUAGE SQL
EXECUTE AS OWNER
AS
$$
DECLARE
  v_case_id STRING;
  v_count NUMBER DEFAULT 0;

  c_missing_cases CURSOR FOR
    SELECT sc.case_id
    FROM (
      SELECT DISTINCT case_id
      FROM CORE.CASE_SCORE_SNAPSHOTS
      WHERE case_id IS NOT NULL
    ) sc
    LEFT JOIN (
      SELECT DISTINCT case_id
      FROM CORE.REGISTRY_SNAPSHOTS
      WHERE case_id IS NOT NULL
    ) rs
      ON sc.case_id = rs.case_id
    WHERE rs.case_id IS NULL;

BEGIN
  OPEN c_missing_cases;

  FETCH c_missing_cases INTO v_case_id;

  WHILE (v_case_id IS NOT NULL) DO

    CALL CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3(v_case_id, 'auto-system');

    v_count := v_count + 1;

    FETCH c_missing_cases INTO v_case_id;

  END WHILE;

  CLOSE c_missing_cases;

  RETURN 'Published cases: ' || TO_VARCHAR(v_count);
END;
$$;

-- ============================================================
-- 2) Execute procedure
-- ============================================================

CALL CORE.SP_AUTO_PUBLISH_ALL_CASES();

-- ============================================================
-- 3) Verify results
-- ============================================================

SELECT *
FROM CORE.V_REGISTRY_LATEST_APPROVED
ORDER BY APPROVED_AT DESC;