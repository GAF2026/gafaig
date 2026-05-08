-- =========================================================
-- 24_VIEWS_RENEWAL_PUBLIC.sql
-- GAFAIG — PUBLIC RENEWAL OBSERVABILITY
-- =========================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- =========================================================
-- PUBLIC RENEWAL VIEW
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_RENEWAL_PUBLIC AS
SELECT
    lp.REGISTRY_ID,
    lp.REGISTRY_SNAPSHOT_ID,

    lp.ENTITY_NAME,
    lp.ENTITY_TYPE,
    lp.COUNTRY,

    lp.CERTIFICATION_STATUS,
    lp.VISIBILITY_STATUS,

    lp.CERTIFIED_AT,
    lp.PUBLISHED_AT,

    lp.VALID_FROM,
    lp.VALID_TO,

    lp.LIFECYCLE_STATUS,
    lp.RENEWAL_STATUS,

    lp.IS_CURRENTLY_ACTIVE,
    lp.IS_EXPIRED,
    lp.DAYS_UNTIL_EXPIRATION,
    lp.LIFECYCLE_WINDOW,

    CASE
        WHEN lp.IS_EXPIRED = TRUE
            THEN 'expired'

        WHEN lp.DAYS_UNTIL_EXPIRATION <= 30
            THEN 'renewal_due_30_days'

        WHEN lp.DAYS_UNTIL_EXPIRATION <= 90
            THEN 'renewal_due_90_days'

        ELSE 'active'
    END AS RENEWAL_WINDOW

FROM CORE.V_LIFECYCLE_PUBLIC lp
;

COMMENT ON VIEW CORE.V_RENEWAL_PUBLIC IS
'GAFAIG canonical public renewal observability view. Surfaces publication-safe renewal posture and certification continuity intelligence derived exclusively from canonical public lifecycle projections.';

-- =========================================================
-- PUBLIC RENEWAL SUMMARY
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_RENEWAL_SUMMARY_PUBLIC AS
SELECT
    COUNT(*) AS TOTAL_PUBLIC_RECORDS,

    COUNT_IF(RENEWAL_WINDOW = 'active')
        AS TOTAL_ACTIVE,

    COUNT_IF(RENEWAL_WINDOW = 'renewal_due_30_days')
        AS TOTAL_DUE_30_DAYS,

    COUNT_IF(RENEWAL_WINDOW = 'renewal_due_90_days')
        AS TOTAL_DUE_90_DAYS,

    COUNT_IF(RENEWAL_WINDOW = 'expired')
        AS TOTAL_EXPIRED,

    COUNT(DISTINCT COUNTRY)
        AS TOTAL_COUNTRIES,

    COUNT(DISTINCT ENTITY_NAME)
        AS TOTAL_ORGANIZATIONS,

    MAX(PUBLISHED_AT)
        AS LAST_PUBLICATION_ACTIVITY

FROM CORE.V_RENEWAL_PUBLIC
;

COMMENT ON VIEW CORE.V_RENEWAL_SUMMARY_PUBLIC IS
'GAFAIG canonical public renewal summary observability view. Aggregates public renewal posture and certification continuity telemetry across published public trust records.';

-- =========================================================
-- PUBLIC RENEWAL BY COUNTRY
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_RENEWAL_BY_COUNTRY_PUBLIC AS
SELECT
    COALESCE(NULLIF(TRIM(COUNTRY), ''), 'Unknown')
        AS COUNTRY,

    COUNT(*) AS TOTAL_PUBLIC_RECORDS,

    COUNT_IF(RENEWAL_WINDOW = 'active')
        AS ACTIVE_RECORDS,

    COUNT_IF(RENEWAL_WINDOW = 'renewal_due_30_days')
        AS DUE_30_DAYS,

    COUNT_IF(RENEWAL_WINDOW = 'renewal_due_90_days')
        AS DUE_90_DAYS,

    COUNT_IF(RENEWAL_WINDOW = 'expired')
        AS EXPIRED_RECORDS,

    MAX(PUBLISHED_AT)
        AS LAST_PUBLICATION_ACTIVITY

FROM CORE.V_RENEWAL_PUBLIC
GROUP BY COUNTRY
ORDER BY TOTAL_PUBLIC_RECORDS DESC, COUNTRY ASC
;

COMMENT ON VIEW CORE.V_RENEWAL_BY_COUNTRY_PUBLIC IS
'GAFAIG canonical public renewal observability by country. Shows publication-safe renewal posture and certification continuity grouped by country.';

-- =========================================================
-- PUBLIC RENEWAL BY ORGANIZATION
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_RENEWAL_BY_ORGANIZATION_PUBLIC AS
SELECT
    ENTITY_NAME,
    COUNTRY,

    COUNT(*) AS TOTAL_PUBLIC_RECORDS,

    COUNT_IF(RENEWAL_WINDOW = 'active')
        AS ACTIVE_RECORDS,

    COUNT_IF(RENEWAL_WINDOW = 'renewal_due_30_days')
        AS DUE_30_DAYS,

    COUNT_IF(RENEWAL_WINDOW = 'renewal_due_90_days')
        AS DUE_90_DAYS,

    COUNT_IF(RENEWAL_WINDOW = 'expired')
        AS EXPIRED_RECORDS,

    MAX(PUBLISHED_AT)
        AS LAST_PUBLICATION_ACTIVITY

FROM CORE.V_RENEWAL_PUBLIC
GROUP BY
    ENTITY_NAME,
    COUNTRY

ORDER BY
    TOTAL_PUBLIC_RECORDS DESC,
    ENTITY_NAME ASC
;

COMMENT ON VIEW CORE.V_RENEWAL_BY_ORGANIZATION_PUBLIC IS
'GAFAIG canonical public renewal observability by organization. Shows publication-safe renewal posture and certification continuity grouped by organization.';