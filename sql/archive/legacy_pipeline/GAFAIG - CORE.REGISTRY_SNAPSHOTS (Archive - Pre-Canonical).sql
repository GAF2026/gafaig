-- ============================================================
-- GAFAIG - CORE.REGISTRY_SNAPSHOTS.sql
-- Append-only registry snapshots + latest-approved view
-- (NO procedure creation / NO procedure dropping in this file)
-- ============================================================

use role ACCOUNTADMIN;
use warehouse GAFAIG_WH;
use database GAFAIG_DB;
use schema CORE;

-- ============================================================
-- 1) Registry snapshots (append-only)
-- ============================================================

create table if not exists GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS (
  SNAPSHOT_ID        string        not null,
  CASE_ID            string        not null,
  ORG_ID             string,
  STANDARD_CODE      string,
  STANDARD_VERSION   string,

  FINAL_SCORE        number(10,4),
  TIER               string,
  BAND               string,

  SUBSCORES          variant,
  COUNTS             variant,

  CASE_STATUS        string,
  LAST_ACTIVITY_AT   timestamp_ntz,

  APPROVED_AT        timestamp_ntz not null,
  APPROVED_BY        string,
  SOURCE_VIEW        string,
  SOURCE_HASH        string,
  PAYLOAD            variant
);

-- Ensure optional columns exist even if table was created earlier
alter table GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS add column if not exists SOURCE_VIEW string;
alter table GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS add column if not exists SOURCE_HASH string;
alter table GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS add column if not exists PAYLOAD variant;

-- Add CREATED_AT (NO DEFAULT — avoids your CURRENT_TIMESTAMP() default error)
alter table GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS add column if not exists CREATED_AT timestamp_ntz;

-- Backfill CREATED_AT for existing rows (safe for empty table too)
update GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS
set CREATED_AT = coalesce(CREATED_AT, APPROVED_AT);

-- Helpful clustering
alter table GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS cluster by (CASE_ID, APPROVED_AT);

-- ============================================================
-- 2) Latest approved snapshot per case (view)
-- ============================================================

create or replace view GAFAIG_DB.CORE.V_REGISTRY_LATEST_APPROVED as
select
  snapshot_id,
  case_id,
  org_id,
  standard_code,
  standard_version,
  final_score,
  tier,
  band,
  subscores,
  counts,
  case_status,
  last_activity_at,
  approved_at,
  approved_by,
  source_view,
  source_hash,
  payload,
  created_at
from GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS
qualify row_number() over (
  partition by case_id
  order by approved_at desc, created_at desc
) = 1;

-- ============================================================
-- 3) Grants (app role)
-- ============================================================

grant select on table GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS to role GAFAIG_APP_ROLE;
grant select on view GAFAIG_DB.CORE.V_REGISTRY_LATEST_APPROVED to role GAFAIG_APP_ROLE;

-- NOTE:
-- Do NOT put any "DROP PROCEDURE ..." lines in this file.
-- Procedures live in GAFAIG - CORE.REGISTRY_PUBLISH.sql only.