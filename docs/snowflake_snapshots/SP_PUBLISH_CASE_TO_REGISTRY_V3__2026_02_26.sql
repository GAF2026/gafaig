USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;
CREATE OR REPLACE PROCEDURE "SP_PUBLISH_CASE_TO_REGISTRY_V3"("CASE_ID_IN" VARCHAR, "APPROVED_BY_IN" VARCHAR)
RETURNS VARIANT
LANGUAGE SQL
EXECUTE AS OWNER
AS '
DECLARE
  v_case_id           VARCHAR;
  v_snapshot_id       VARCHAR;
  v_final_score       NUMBER(10,4);
  v_tier              VARCHAR;
  v_band              VARCHAR;

  v_controls_pct      NUMBER(10,4);
  v_coverage_pct      NUMBER(10,4);
  v_freshness_pct     NUMBER(10,4);
  v_summary_pct       NUMBER(10,4);

  v_subscores         VARIANT;
  v_counts            VARIANT;
  v_payload           VARIANT;

BEGIN
  v_case_id := CASE_ID_IN;

  -- Pull latest score for this case
  SELECT
    case_id,
    final_score,
    tier,
    band,
    controls_pct,
    coverage_pct,
    freshness_pct,
    summary_pct
  INTO
    v_case_id,
    v_final_score,
    v_tier,
    v_band,
    v_controls_pct,
    v_coverage_pct,
    v_freshness_pct,
    v_summary_pct
  FROM CORE.V_GOVERNANCE_SCORE_CASE
  WHERE case_id = :v_case_id;   -- ✅ bind var

  -- Snapshot id
  v_snapshot_id := ''SNP-'' || REPLACE(UUID_STRING(), ''-'', '''');

  -- Minimal structured payloads (variants)
  v_subscores := OBJECT_CONSTRUCT(
    ''controls'',  v_controls_pct,
    ''coverage'',  v_coverage_pct,
    ''freshness'', v_freshness_pct,
    ''summaries'', v_summary_pct
  );

  v_counts := OBJECT_CONSTRUCT(
    ''findingsTotal'', NULL,
    ''evidenceTotal'', NULL
  );

  v_payload := OBJECT_CONSTRUCT(
    ''caseId'', v_case_id,
    ''tier'', v_tier,
    ''band'', v_band,
    ''finalScore'', v_final_score,
    ''subscores'', v_subscores,
    ''counts'', v_counts
  );

  -- ✅ IMPORTANT FIX:
  -- Use INSERT ... SELECT (not VALUES) to avoid VARIANT bind compilation issues.
  INSERT INTO CORE.REGISTRY_SNAPSHOTS (
    SNAPSHOT_ID,
    CASE_ID,
    ORG_ID,
    STANDARD_CODE,
    STANDARD_VERSION,
    FINAL_SCORE,
    TIER,
    BAND,
    SUBSCORES,
    COUNTS,
    CASE_STATUS,
    LAST_ACTIVITY_AT,
    APPROVED_AT,
    APPROVED_BY,
    SOURCE_VIEW,
    SOURCE_HASH,
    PAYLOAD,
    CREATED_AT
  )
  SELECT
    :v_snapshot_id,
    :v_case_id,
    NULL,                     -- ORG_ID (optional)
    NULL,                     -- STANDARD_CODE (optional)
    NULL,                     -- STANDARD_VERSION (optional)
    :v_final_score,
    :v_tier,
    :v_band,
    :v_subscores,
    :v_counts,
    ''APPROVED'',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP(),
    :APPROVED_BY_IN,          -- bind param
    ''CORE.V_GOVERNANCE_SCORE_CASE'',
    SHA2(TO_VARCHAR(:v_payload), 256),
    :v_payload,
    CURRENT_TIMESTAMP();

  RETURN OBJECT_CONSTRUCT(
    ''ok'', TRUE,
    ''caseId'', :v_case_id,
    ''snapshotId'', :v_snapshot_id,
    ''finalScore'', :v_final_score,
    ''tier'', :v_tier,
    ''band'', :v_band
  );
END;
';