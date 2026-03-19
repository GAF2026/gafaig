-- ============================================================
-- GAFAIG — True Global Registry Identity
-- Creates:
--   CORE.REGISTRY_ID_SEQ
--   CORE.REGISTRY_ENTITIES
-- Purpose:
--   Stable, global REGISTRY_ID independent of application_id
--   One registry identity row per certified entity (per application for now)
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE WAREHOUSE GAFAIG_WH;
USE DATABASE GAFAIG_DB;
USE SCHEMA CORE;

-- 1) Sequence for stable registry ids (safe to re-run)
CREATE SEQUENCE IF NOT EXISTS CORE.REGISTRY_ID_SEQ
  START = 1
  INCREMENT = 1;

-- 2) Registry identity table (safe to re-run)
CREATE TABLE IF NOT EXISTS CORE.REGISTRY_ENTITIES (
  REGISTRY_ID       STRING,
  APPLICATION_ID    STRING,
  PARTICIPANT_ID    STRING,

  ENTITY_NAME       STRING,
  ENTITY_TYPE       STRING,
  COUNTRY           STRING,

  STATUS            STRING,          -- active | inactive (future)
  CREATED_AT        TIMESTAMP_NTZ,
  UPDATED_AT        TIMESTAMP_NTZ
);

-- 3) Ensure columns exist (hardening; safe to re-run)
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS REGISTRY_ID    STRING;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS APPLICATION_ID STRING;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS PARTICIPANT_ID STRING;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS ENTITY_NAME    STRING;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS ENTITY_TYPE    STRING;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS COUNTRY        STRING;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS STATUS         STRING;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS CREATED_AT     TIMESTAMP_NTZ;
ALTER TABLE CORE.REGISTRY_ENTITIES ADD COLUMN IF NOT EXISTS UPDATED_AT     TIMESTAMP_NTZ;

-- 4) Seed identities for approved + currently valid certifications
--    Uses V_VERIFICATION_CASE_DETAIL as source-of-truth for decision/validity.
--
--    This is intentionally conservative:
--    - only creates identities for entities that are actually "in the registry"
--      (approved + within validity window)
--
MERGE INTO CORE.REGISTRY_ENTITIES re
USING (
  SELECT
    v.application_id,
    v.participant_id,
    COALESCE(v.org_name, p.entity_name)   AS entity_name,
    COALESCE(v.org_type, p.entity_type)   AS entity_type,
    COALESCE(v.country,  p.country)       AS country
  FROM CORE.V_VERIFICATION_CASE_DETAIL v
  LEFT JOIN CORE.PARTICIPANTS p
    ON v.participant_id = p.participant_id
  WHERE
    LOWER(v.decision_status) = 'approved'
    AND (v.valid_from IS NULL OR v.valid_from <= CURRENT_TIMESTAMP())
    AND (v.valid_to   IS NULL OR v.valid_to   >  CURRENT_TIMESTAMP())
) src
ON re.application_id = src.application_id

WHEN MATCHED THEN
  UPDATE SET
    re.participant_id = src.participant_id,
    re.entity_name    = src.entity_name,
    re.entity_type    = src.entity_type,
    re.country        = src.country,
    re.status         = COALESCE(re.status, 'active'),
    re.updated_at     = CURRENT_TIMESTAMP()

WHEN NOT MATCHED THEN
  INSERT (
    registry_id,
    application_id,
    participant_id,
    entity_name,
    entity_type,
    country,
    status,
    created_at,
    updated_at
  )
  VALUES (
    'GAFAIG-' || LPAD(TO_VARCHAR(CORE.REGISTRY_ID_SEQ.NEXTVAL), 8, '0'),
    src.application_id,
    src.participant_id,
    src.entity_name,
    src.entity_type,
    src.country,
    'active',
    CURRENT_TIMESTAMP(),
    CURRENT_TIMESTAMP()
  );

-- 5) Quick check
SELECT *
FROM CORE.REGISTRY_ENTITIES
ORDER BY created_at DESC
LIMIT 50;

-- 6) Grants for app role (safe to re-run)
GRANT SELECT ON TABLE CORE.REGISTRY_ENTITIES TO ROLE GAFAIG_APP_ROLE;