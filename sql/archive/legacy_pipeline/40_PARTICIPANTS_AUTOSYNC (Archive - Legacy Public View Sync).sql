-- ============================================================
-- 40_PARTICIPANTS_AUTOSYNC.sql
--
-- Purpose:
--   Sync participant identity records from the public registry
--   and public AI systems views into CORE.PARTICIPANTS.
--
-- Sources:
--   - GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
--   - GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC
--
-- Behavior:
--   - Upserts participant rows by normalized organization name
--   - Fills missing participant metadata from registry/system sources
--   - Creates participant records for newly surfaced public entities
--
-- Safe to rerun.
-- ============================================================

USE ROLE GAFAIG_APP_ROLE;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

MERGE INTO GAFAIG_DB.CORE.PARTICIPANTS AS tgt
USING (
    WITH registry_orgs AS (
        SELECT DISTINCT
            TRIM(ENTITY_NAME) AS ORG_NAME,
            COUNTRY,
            'company' AS PARTICIPANT_TYPE,
            'participant' AS DESIGNATION_LEVEL,
            'verified' AS VERIFICATION_STATUS
        FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
        WHERE TRIM(COALESCE(ENTITY_NAME, '')) <> ''
    ),
    system_orgs AS (
        SELECT DISTINCT
            TRIM(s.DEVELOPER_ORGANIZATION) AS ORG_NAME,
            r.COUNTRY,
            'company' AS PARTICIPANT_TYPE,
            'participant' AS DESIGNATION_LEVEL,
            'verified' AS VERIFICATION_STATUS
        FROM GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
        LEFT JOIN GAFAIG_DB.CORE.V_REGISTRY_PUBLIC r
          ON s.REGISTRY_ID = r.REGISTRY_ID
        WHERE TRIM(COALESCE(s.DEVELOPER_ORGANIZATION, '')) <> ''
    ),
    combined AS (
        SELECT * FROM registry_orgs
        UNION
        SELECT * FROM system_orgs
    )
    SELECT
        ORG_NAME,
        COUNTRY,
        PARTICIPANT_TYPE,
        DESIGNATION_LEVEL,
        VERIFICATION_STATUS,
        LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(ORG_NAME, '[^A-Za-z0-9]+', '-'),
                '(^-+|-+$)',
                ''
            )
        ) AS PROFILE_SLUG
    FROM combined
) AS src
ON LOWER(TRIM(tgt.NAME)) = LOWER(TRIM(src.ORG_NAME))

WHEN MATCHED THEN UPDATE SET
    tgt.COUNTRY = COALESCE(src.COUNTRY, tgt.COUNTRY),
    tgt.PARTICIPANT_TYPE = COALESCE(tgt.PARTICIPANT_TYPE, src.PARTICIPANT_TYPE),
    tgt.DESIGNATION_LEVEL = COALESCE(tgt.DESIGNATION_LEVEL, src.DESIGNATION_LEVEL),
    tgt.VERIFICATION_STATUS = COALESCE(tgt.VERIFICATION_STATUS, src.VERIFICATION_STATUS),
    tgt.PROFILE_SLUG = COALESCE(tgt.PROFILE_SLUG, src.PROFILE_SLUG),
    tgt.UPDATED_AT = CURRENT_TIMESTAMP()

WHEN NOT MATCHED THEN INSERT (
    PARTICIPANT_ID,
    PARTICIPANT_TYPE,
    JURISDICTION_LEVEL,
    NAME,
    COUNTRY,
    WEBSITE,
    PROFILE_SLUG,
    DESIGNATION_LEVEL,
    VERIFICATION_STATUS,
    CONTACT_EMAIL,
    PUBLIC_SUMMARY,
    LOGO_URL,
    CREATED_AT,
    UPDATED_AT
) VALUES (
    'PART-' || REPLACE(UUID_STRING(), '-', ''),
    src.PARTICIPANT_TYPE,
    NULL,
    src.ORG_NAME,
    src.COUNTRY,
    NULL,
    src.PROFILE_SLUG,
    src.DESIGNATION_LEVEL,
    src.VERIFICATION_STATUS,
    NULL,
    NULL,
    NULL,
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
);

-- ------------------------------------------------------------
-- Diagnostics
-- ------------------------------------------------------------
SELECT
  NAME,
  PARTICIPANT_TYPE,
  COUNTRY,
  DESIGNATION_LEVEL,
  VERIFICATION_STATUS,
  PROFILE_SLUG
FROM GAFAIG_DB.CORE.PARTICIPANTS
ORDER BY UPDATED_AT DESC, NAME ASC;