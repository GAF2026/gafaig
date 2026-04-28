USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

CREATE OR REPLACE VIEW CORE.V_REGISTRY_PUBLIC AS
WITH LATEST_DECISION AS (
    SELECT
        UPPER(TRIM(COALESCE(CASE_ID, ''))) AS CASE_ID_NORM,
        CASE_ID,
        APPLICATION_ID,
        UPPER(TRIM(COALESCE(DECISION_STATUS, ''))) AS DECISION_STATUS,
        VALID_FROM,
        VALID_TO,
        CREATED_AT,
        ROW_NUMBER() OVER (
            PARTITION BY UPPER(TRIM(COALESCE(CASE_ID, '')))
            ORDER BY CREATED_AT DESC, DECISION_ID DESC
        ) AS RN
    FROM CORE.DECISIONS
    WHERE TRIM(COALESCE(CASE_ID, '')) <> ''
),
LATEST_REGISTRY_SNAPSHOT AS (
    SELECT
        UPPER(TRIM(COALESCE(CASE_ID, ''))) AS CASE_ID_NORM,
        REGISTRY_SNAPSHOT_ID,
        REGISTRY_ID,
        ORG_ID,
        CASE_ID,
        ENTITY_NAME,
        VERIFICATION_TYPE,
        MODEL_VERSION,
        SCORE,
        TIER,
        BAND,
        RENEWAL_STATUS,
        APPROVED_AT,
        PUBLISHED_AT,
        CREATED_AT,
        ROW_NUMBER() OVER (
            PARTITION BY UPPER(TRIM(COALESCE(CASE_ID, '')))
            ORDER BY CREATED_AT DESC, REGISTRY_SNAPSHOT_ID DESC
        ) AS RN
    FROM CORE.REGISTRY_SNAPSHOTS
    WHERE TRIM(COALESCE(CASE_ID, '')) <> ''
),
CASE_ENRICHMENT AS (
    SELECT
        UPPER(TRIM(COALESCE(vc.CASE_ID, ''))) AS CASE_ID_NORM,
        vc.CASE_ID,
        vc.APPLICATION_ID,
        vc.ENTITY_NAME AS CASE_ENTITY_NAME,
        ROW_NUMBER() OVER (
            PARTITION BY UPPER(TRIM(COALESCE(vc.CASE_ID, '')))
            ORDER BY vc.CASE_ID DESC
        ) AS RN
    FROM CORE.VERIFICATION_CASES vc
    WHERE TRIM(COALESCE(vc.CASE_ID, '')) <> ''
),
APPLICATION_ENRICHMENT AS (
    SELECT
        UPPER(TRIM(COALESCE(a.APPLICATION_ID, ''))) AS APPLICATION_ID_NORM,
        a.APPLICATION_ID,
        a.COUNTRY,
        a.ORG_TYPE AS ENTITY_TYPE,
        a.ORG_NAME AS APPLICATION_ENTITY_NAME,
        ROW_NUMBER() OVER (
            PARTITION BY UPPER(TRIM(COALESCE(a.APPLICATION_ID, '')))
            ORDER BY a.CREATED_AT DESC, a.APPLICATION_ID DESC
        ) AS RN
    FROM CORE.APPLICATIONS a
    WHERE TRIM(COALESCE(a.APPLICATION_ID, '')) <> ''
)
SELECT
    rs.REGISTRY_SNAPSHOT_ID                                           AS REGISTRY_SNAPSHOT_ID,
    rs.REGISTRY_ID                                                    AS REGISTRY_ID,
    rs.CASE_ID                                                        AS CASE_ID,
    COALESCE(ld.APPLICATION_ID, ce.APPLICATION_ID, ae.APPLICATION_ID) AS APPLICATION_ID,

    COALESCE(
        NULLIF(rs.ENTITY_NAME, ''),
        NULLIF(ce.CASE_ENTITY_NAME, ''),
        NULLIF(ae.APPLICATION_ENTITY_NAME, '')
    )                                                                 AS ENTITY_NAME,

    ae.ENTITY_TYPE                                                    AS ENTITY_TYPE,
    ae.COUNTRY                                                        AS COUNTRY,

    'CERTIFIED'                                                       AS CERTIFICATION_STATUS,

    rs.TIER                                                           AS CERTIFIED_TIER,
    rs.BAND                                                           AS CERTIFIED_BAND,

    COALESCE(rs.PUBLISHED_AT, rs.APPROVED_AT)                         AS CERTIFIED_AT,

    ld.VALID_FROM                                                     AS VALID_FROM,
    ld.VALID_TO                                                       AS VALID_TO,

    COALESCE(rs.PUBLISHED_AT, rs.APPROVED_AT)                         AS PUBLISHED_AT,

    rs.RENEWAL_STATUS                                                 AS RENEWAL_STATUS,

    CASE
        WHEN ld.VALID_TO IS NULL OR ld.VALID_TO > CURRENT_TIMESTAMP()
        THEN 'active'
        ELSE 'expired'
    END                                                               AS LIFECYCLE_STATUS

FROM LATEST_REGISTRY_SNAPSHOT rs

INNER JOIN LATEST_DECISION ld
    ON rs.CASE_ID_NORM = ld.CASE_ID_NORM
   AND ld.RN = 1

LEFT JOIN CASE_ENRICHMENT ce
    ON rs.CASE_ID_NORM = ce.CASE_ID_NORM
   AND ce.RN = 1

LEFT JOIN APPLICATION_ENRICHMENT ae
    ON UPPER(TRIM(COALESCE(COALESCE(ld.APPLICATION_ID, ce.APPLICATION_ID), ''))) = ae.APPLICATION_ID_NORM
   AND ae.RN = 1

WHERE rs.RN = 1
  AND TRIM(COALESCE(rs.REGISTRY_ID, '')) <> ''
  AND ld.DECISION_STATUS = 'APPROVED'
  AND (
        ld.VALID_TO IS NULL
        OR ld.VALID_TO > CURRENT_TIMESTAMP()
      )
;

COMMENT ON VIEW CORE.V_REGISTRY_PUBLIC IS
'GAFAIG canonical public registry view. Surfaces only currently valid certified public records from the latest registry snapshot per CASE_ID. Includes CERTIFIED_TIER and CERTIFIED_BAND derived from the registry snapshot. Internal approval remains a private gate and is not exposed in the public contract.';