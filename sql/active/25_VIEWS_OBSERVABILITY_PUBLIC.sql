-- =========================================================
-- 25_VIEWS_OBSERVABILITY_PUBLIC.sql
-- GAFAIG — PUBLIC GOVERNANCE OBSERVABILITY
-- =========================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- =========================================================
-- PUBLIC OBSERVABILITY SUMMARY
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_OBSERVABILITY_PUBLIC AS
SELECT
    ls.TOTAL_PUBLIC_RECORDS,
    ls.TOTAL_ACTIVE_RECORDS,
    ls.TOTAL_EXPIRED_RECORDS,
    ls.TOTAL_EXPIRING_30_DAYS,
    ls.TOTAL_EXPIRING_90_DAYS,
    ls.TOTAL_COUNTRIES,
    ls.TOTAL_ORGANIZATIONS,
    ls.LAST_PUBLICATION_ACTIVITY,

    rs.TOTAL_DUE_30_DAYS AS TOTAL_RENEWAL_DUE_30_DAYS,
    rs.TOTAL_DUE_90_DAYS AS TOTAL_RENEWAL_DUE_90_DAYS,

    (
        SELECT COUNT(*)
        FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
    ) AS TOTAL_PUBLIC_AI_SYSTEMS

FROM CORE.V_LIFECYCLE_SUMMARY_PUBLIC ls
CROSS JOIN CORE.V_RENEWAL_SUMMARY_PUBLIC rs
;

COMMENT ON VIEW CORE.V_OBSERVABILITY_PUBLIC IS
'GAFAIG canonical public governance observability summary view. Aggregates publication-safe lifecycle, renewal, geographic, organization, and public AI system disclosure telemetry.';

-- =========================================================
-- PUBLIC OBSERVABILITY BY COUNTRY
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_OBSERVABILITY_BY_COUNTRY_PUBLIC AS
SELECT
    lc.COUNTRY,

    lc.TOTAL_PUBLIC_RECORDS,
    lc.ACTIVE_RECORDS,
    lc.EXPIRED_RECORDS,
    lc.EXPIRING_30_DAYS,
    lc.EXPIRING_90_DAYS,

    rc.DUE_30_DAYS AS RENEWAL_DUE_30_DAYS,
    rc.DUE_90_DAYS AS RENEWAL_DUE_90_DAYS,

    (
        SELECT COUNT(*)
        FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
        WHERE COALESCE(NULLIF(TRIM(s.COUNTRY), ''), 'Unknown') = lc.COUNTRY
    ) AS PUBLIC_AI_SYSTEMS,

    lc.LAST_PUBLICATION_ACTIVITY

FROM CORE.V_LIFECYCLE_BY_COUNTRY_PUBLIC lc
LEFT JOIN CORE.V_RENEWAL_BY_COUNTRY_PUBLIC rc
    ON lc.COUNTRY = rc.COUNTRY
;

COMMENT ON VIEW CORE.V_OBSERVABILITY_BY_COUNTRY_PUBLIC IS
'GAFAIG canonical public governance observability by country. Combines lifecycle, renewal, and public AI system disclosure telemetry by country.';

-- =========================================================
-- PUBLIC OBSERVABILITY BY ORGANIZATION
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_OBSERVABILITY_BY_ORGANIZATION_PUBLIC AS
SELECT
    lo.ENTITY_NAME,
    lo.COUNTRY,

    lo.TOTAL_PUBLIC_RECORDS,
    lo.ACTIVE_RECORDS,
    lo.EXPIRED_RECORDS,
    lo.EXPIRING_30_DAYS,
    lo.EXPIRING_90_DAYS,

    ro.DUE_30_DAYS AS RENEWAL_DUE_30_DAYS,
    ro.DUE_90_DAYS AS RENEWAL_DUE_90_DAYS,

    (
        SELECT COUNT(*)
        FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
        WHERE TRIM(UPPER(s.ENTITY_NAME)) = TRIM(UPPER(lo.ENTITY_NAME))
    ) AS PUBLIC_AI_SYSTEMS,

    lo.LAST_PUBLICATION_ACTIVITY

FROM CORE.V_LIFECYCLE_BY_ORGANIZATION_PUBLIC lo
LEFT JOIN CORE.V_RENEWAL_BY_ORGANIZATION_PUBLIC ro
    ON TRIM(UPPER(lo.ENTITY_NAME)) = TRIM(UPPER(ro.ENTITY_NAME))
   AND COALESCE(NULLIF(TRIM(lo.COUNTRY), ''), 'Unknown')
     = COALESCE(NULLIF(TRIM(ro.COUNTRY), ''), 'Unknown')
;

COMMENT ON VIEW CORE.V_OBSERVABILITY_BY_ORGANIZATION_PUBLIC IS
'GAFAIG canonical public governance observability by organization. Combines lifecycle, renewal, and public AI system disclosure telemetry by organization.';

-- =========================================================
-- PUBLIC GOVERNANCE SIGNALS
-- =========================================================

CREATE OR REPLACE VIEW CORE.V_GOVERNANCE_SIGNALS_PUBLIC AS
SELECT
    'public_certification_activity' AS SIGNAL_TYPE,
    TOTAL_PUBLIC_RECORDS AS SIGNAL_VALUE,
    'Total published public certification records' AS SIGNAL_DESCRIPTION,
    LAST_PUBLICATION_ACTIVITY AS LAST_ACTIVITY_AT
FROM CORE.V_OBSERVABILITY_PUBLIC

UNION ALL

SELECT
    'active_certification_continuity' AS SIGNAL_TYPE,
    TOTAL_ACTIVE_RECORDS AS SIGNAL_VALUE,
    'Total active public certifications' AS SIGNAL_DESCRIPTION,
    LAST_PUBLICATION_ACTIVITY AS LAST_ACTIVITY_AT
FROM CORE.V_OBSERVABILITY_PUBLIC

UNION ALL

SELECT
    'renewal_due_30_days' AS SIGNAL_TYPE,
    TOTAL_RENEWAL_DUE_30_DAYS AS SIGNAL_VALUE,
    'Public certifications requiring renewal attention within 30 days' AS SIGNAL_DESCRIPTION,
    LAST_PUBLICATION_ACTIVITY AS LAST_ACTIVITY_AT
FROM CORE.V_OBSERVABILITY_PUBLIC

UNION ALL

SELECT
    'renewal_due_90_days' AS SIGNAL_TYPE,
    TOTAL_RENEWAL_DUE_90_DAYS AS SIGNAL_VALUE,
    'Public certifications requiring renewal attention within 90 days' AS SIGNAL_DESCRIPTION,
    LAST_PUBLICATION_ACTIVITY AS LAST_ACTIVITY_AT
FROM CORE.V_OBSERVABILITY_PUBLIC

UNION ALL

SELECT
    'public_ai_system_disclosure' AS SIGNAL_TYPE,
    TOTAL_PUBLIC_AI_SYSTEMS AS SIGNAL_VALUE,
    'Total public AI systems disclosed through GAFAIG certification records' AS SIGNAL_DESCRIPTION,
    LAST_PUBLICATION_ACTIVITY AS LAST_ACTIVITY_AT
FROM CORE.V_OBSERVABILITY_PUBLIC
;

COMMENT ON VIEW CORE.V_GOVERNANCE_SIGNALS_PUBLIC IS
'GAFAIG canonical public governance signals view. Provides aggregate, publication-safe observability signals only. Excludes private governance intelligence, evidence, findings, scores, reviewer data, and internal workflow telemetry.';

-- =========================================================
-- GRANTS
-- =========================================================

GRANT SELECT ON VIEW CORE.V_OBSERVABILITY_PUBLIC TO ROLE GAFAIG_APP_ROLE;
GRANT SELECT ON VIEW CORE.V_OBSERVABILITY_BY_COUNTRY_PUBLIC TO ROLE GAFAIG_APP_ROLE;
GRANT SELECT ON VIEW CORE.V_OBSERVABILITY_BY_ORGANIZATION_PUBLIC TO ROLE GAFAIG_APP_ROLE;
GRANT SELECT ON VIEW CORE.V_GOVERNANCE_SIGNALS_PUBLIC TO ROLE GAFAIG_APP_ROLE;