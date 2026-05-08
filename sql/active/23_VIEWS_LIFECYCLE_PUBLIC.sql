-- =========================================================
-- 23_VIEWS_LIFECYCLE_PUBLIC.sql
-- GAFAIG — PUBLIC CERTIFICATION LIFECYCLE OBSERVABILITY
-- =========================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- =========================================================
-- PUBLIC LIFECYCLE VIEW
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_LIFECYCLE_PUBLIC AS
WITH BASE AS (
    SELECT
        rp.REGISTRY_ID,
        rp.REGISTRY_SNAPSHOT_ID,
        rp.APPLICATION_ID,
        rp.CASE_ID,

        rp.ENTITY_NAME,
        rp.ENTITY_TYPE,
        rp.COUNTRY,

        rp.CERTIFICATION_STATUS,
        rp.VISIBILITY_STATUS,

        rp.CERTIFIED_AT,
        rp.PUBLISHED_AT,

        rp.VALID_FROM,
        rp.VALID_TO,

        rp.LIFECYCLE_STATUS,
        rp.RENEWAL_STATUS,

        CASE
            WHEN CURRENT_TIMESTAMP() BETWEEN rp.VALID_FROM AND rp.VALID_TO
                THEN TRUE
            ELSE FALSE
        END AS IS_CURRENTLY_ACTIVE,

        CASE
            WHEN rp.VALID_TO < CURRENT_TIMESTAMP()
                THEN TRUE
            ELSE FALSE
        END AS IS_EXPIRED,

        DATEDIFF(
            DAY,
            CURRENT_DATE(),
            TO_DATE(rp.VALID_TO)
        ) AS DAYS_UNTIL_EXPIRATION

    FROM CORE.V_REGISTRY_PUBLIC rp
    WHERE TRIM(COALESCE(rp.REGISTRY_ID, '')) <> ''
)

SELECT
    REGISTRY_ID,
    REGISTRY_SNAPSHOT_ID,

    ENTITY_NAME,
    ENTITY_TYPE,
    COUNTRY,

    CERTIFICATION_STATUS,
    VISIBILITY_STATUS,

    CERTIFIED_AT,
    PUBLISHED_AT,

    VALID_FROM,
    VALID_TO,

    LIFECYCLE_STATUS,
    RENEWAL_STATUS,

    IS_CURRENTLY_ACTIVE,
    IS_EXPIRED,
    DAYS_UNTIL_EXPIRATION,

    CASE
        WHEN DAYS_UNTIL_EXPIRATION <= 0
            THEN 'expired'

        WHEN DAYS_UNTIL_EXPIRATION <= 30
            THEN 'expires_30_days'

        WHEN DAYS_UNTIL_EXPIRATION <= 90
            THEN 'expires_90_days'

        ELSE 'active'
    END AS LIFECYCLE_WINDOW

FROM BASE
;

COMMENT ON VIEW CORE.V_LIFECYCLE_PUBLIC IS
'GAFAIG canonical public lifecycle observability view. Surfaces publication-safe certification lifecycle intelligence derived exclusively from CORE.V_REGISTRY_PUBLIC. Excludes scores, bands, tiers, evidence, findings, reviewer data, internal workflow telemetry, and unpublished records.';

-- =========================================================
-- PUBLIC LIFECYCLE SUMMARY VIEW
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_LIFECYCLE_SUMMARY_PUBLIC AS
SELECT
    COUNT(*) AS TOTAL_PUBLIC_RECORDS,

    COUNT_IF(IS_CURRENTLY_ACTIVE = TRUE)
        AS TOTAL_ACTIVE_RECORDS,

    COUNT_IF(IS_EXPIRED = TRUE)
        AS TOTAL_EXPIRED_RECORDS,

    COUNT_IF(LIFECYCLE_WINDOW = 'expires_30_days')
        AS TOTAL_EXPIRING_30_DAYS,

    COUNT_IF(LIFECYCLE_WINDOW = 'expires_90_days')
        AS TOTAL_EXPIRING_90_DAYS,

    COUNT(DISTINCT COUNTRY)
        AS TOTAL_COUNTRIES,

    COUNT(DISTINCT ENTITY_NAME)
        AS TOTAL_ORGANIZATIONS,

    MAX(PUBLISHED_AT)
        AS LAST_PUBLICATION_ACTIVITY

FROM CORE.V_LIFECYCLE_PUBLIC
;

COMMENT ON VIEW CORE.V_LIFECYCLE_SUMMARY_PUBLIC IS
'GAFAIG canonical public lifecycle summary observability view. Aggregates public certification continuity and lifecycle posture across published registry records.';

-- =========================================================
-- PUBLIC LIFECYCLE BY COUNTRY
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_LIFECYCLE_BY_COUNTRY_PUBLIC AS
SELECT
    COALESCE(NULLIF(TRIM(COUNTRY), ''), 'Unknown')
        AS COUNTRY,

    COUNT(*) AS TOTAL_PUBLIC_RECORDS,

    COUNT_IF(IS_CURRENTLY_ACTIVE = TRUE)
        AS ACTIVE_RECORDS,

    COUNT_IF(IS_EXPIRED = TRUE)
        AS EXPIRED_RECORDS,

    COUNT_IF(LIFECYCLE_WINDOW = 'expires_30_days')
        AS EXPIRING_30_DAYS,

    COUNT_IF(LIFECYCLE_WINDOW = 'expires_90_days')
        AS EXPIRING_90_DAYS,

    MAX(PUBLISHED_AT)
        AS LAST_PUBLICATION_ACTIVITY

FROM CORE.V_LIFECYCLE_PUBLIC
GROUP BY COUNTRY
ORDER BY TOTAL_PUBLIC_RECORDS DESC, COUNTRY ASC
;

COMMENT ON VIEW CORE.V_LIFECYCLE_BY_COUNTRY_PUBLIC IS
'GAFAIG canonical public lifecycle observability by country. Shows publication-safe certification continuity and lifecycle distribution grouped by country.';

-- =========================================================
-- PUBLIC LIFECYCLE BY ORGANIZATION
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_LIFECYCLE_BY_ORGANIZATION_PUBLIC AS
SELECT
    ENTITY_NAME,
    COUNTRY,

    COUNT(*) AS TOTAL_PUBLIC_RECORDS,

    COUNT_IF(IS_CURRENTLY_ACTIVE = TRUE)
        AS ACTIVE_RECORDS,

    COUNT_IF(IS_EXPIRED = TRUE)
        AS EXPIRED_RECORDS,

    COUNT_IF(LIFECYCLE_WINDOW = 'expires_30_days')
        AS EXPIRING_30_DAYS,

    COUNT_IF(LIFECYCLE_WINDOW = 'expires_90_days')
        AS EXPIRING_90_DAYS,

    MAX(PUBLISHED_AT)
        AS LAST_PUBLICATION_ACTIVITY

FROM CORE.V_LIFECYCLE_PUBLIC
GROUP BY
    ENTITY_NAME,
    COUNTRY

ORDER BY
    TOTAL_PUBLIC_RECORDS DESC,
    ENTITY_NAME ASC
;

COMMENT ON VIEW CORE.V_LIFECYCLE_BY_ORGANIZATION_PUBLIC IS
'GAFAIG canonical public lifecycle observability by organization. Shows publication-safe lifecycle continuity and expiration posture grouped by organization.';