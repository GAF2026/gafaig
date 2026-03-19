-- ============================================================
-- GAFAIG — Registry AI Systems Views
-- Purpose:
--   Canonical views for AI systems attached to registry records
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- ============================================================
-- 1) Internal view (by registry)
-- ============================================================

CREATE OR REPLACE VIEW CORE.V_REGISTRY_AI_SYSTEMS_BY_REGISTRY AS
SELECT
    SYSTEM_ID,
    REGISTRY_ID,
    SYSTEM_NAME,
    SYSTEM_TYPE,
    INTENDED_USE,
    DEPLOYMENT_STATUS,
    OVERSIGHT_LEVEL,
    RISK_TIER,
    PUBLIC_SUMMARY,
    DISPLAY_ORDER
FROM CORE.REGISTRY_AI_SYSTEMS
WHERE REGISTRY_ID IS NOT NULL;

-- ============================================================
-- 2) Public view (app-facing)
-- ============================================================

CREATE OR REPLACE VIEW CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC AS
SELECT
    SYSTEM_ID,
    REGISTRY_ID,
    SYSTEM_NAME,
    SYSTEM_TYPE,
    INTENDED_USE,
    DEPLOYMENT_STATUS,
    OVERSIGHT_LEVEL,
    RISK_TIER,
    PUBLIC_SUMMARY,
    DISPLAY_ORDER
FROM CORE.REGISTRY_AI_SYSTEMS
WHERE REGISTRY_ID IS NOT NULL;

-- ============================================================
-- END
-- ============================================================