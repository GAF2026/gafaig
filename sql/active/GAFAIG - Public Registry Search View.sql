USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

CREATE OR REPLACE VIEW CORE.V_REGISTRY_PUBLIC_SEARCH AS
SELECT
  registry_id,
  application_id,
  case_id,

  entity_name,
  entity_type,
  country,

  certified_tier,
  certified_band,
  valid_from,
  valid_to,
  decision_status,

  certified_at,
  last_activity_at,

  UPPER(TRIM(registry_id))               AS registry_id_norm,
  UPPER(TRIM(COALESCE(entity_name, ''))) AS entity_name_norm,
  UPPER(TRIM(COALESCE(country, '')))     AS country_norm,

  UPPER(
  REGEXP_REPLACE(
    TRIM(
      COALESCE(registry_id, '') || ' ' ||
      COALESCE(application_id, '') || ' ' ||
      COALESCE(case_id, '') || ' ' ||
      COALESCE(entity_name, '') || ' ' ||
      COALESCE(country, '')
    ),
    '\\s+',
    ' '
  )
) AS q
FROM CORE.V_REGISTRY_PUBLIC;

GRANT SELECT ON VIEW CORE.V_REGISTRY_PUBLIC_SEARCH TO ROLE GAFAIG_APP_ROLE;