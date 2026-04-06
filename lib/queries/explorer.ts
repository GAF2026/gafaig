// ============================================================
// explorer.ts (CANONICAL)
// ============================================================

import { sfQuery } from "@/lib/snowflake";

// ---------------- GLOBAL ----------------

export async function getExplorerGlobalStats() {
  const rows = await sfQuery<any>(`
    SELECT
      COUNT(*) AS TOTAL_RECORDS,
      COUNT(DISTINCT REGISTRY_ID) AS TOTAL_REGISTRY_IDS,
      COUNT(DISTINCT CASE_ID) AS TOTAL_CASES,
      COUNT(DISTINCT APPLICATION_ID) AS TOTAL_APPLICATIONS,
      COUNT(DISTINCT ENTITY_NAME) AS TOTAL_ENTITIES,
      COUNT(DISTINCT COUNTRY) AS TOTAL_COUNTRIES,
      COUNT_IF(CERTIFIED_AT IS NOT NULL) AS TOTAL_CERTIFIED,
      COUNT_IF(CERTIFIED_AT IS NULL) AS TOTAL_NOT_CERTIFIED,
      MIN(CERTIFIED_AT) AS FIRST_PUBLISHED_AT,
      MAX(CERTIFIED_AT) AS LAST_ACTIVITY_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
  `);

  return rows[0] || null;
}

// ---------------- COUNTRY ----------------

export async function getExplorerCountries() {
  return await sfQuery<any>(`
    SELECT
      COUNTRY,
      COUNT(*) AS TOTAL_RECORDS,
      COUNT(DISTINCT ENTITY_NAME) AS TOTAL_ENTITIES,
      COUNT(DISTINCT REGISTRY_ID) AS TOTAL_REGISTRY_IDS,
      COUNT_IF(CERTIFIED_AT IS NOT NULL) AS TOTAL_CERTIFIED,
      MAX(CERTIFIED_AT) AS LAST_ACTIVITY_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    WHERE COUNTRY IS NOT NULL
    GROUP BY COUNTRY
    ORDER BY TOTAL_RECORDS DESC
    LIMIT 6
  `);
}

// ---------------- RECENT ----------------

export async function getExplorerRecent() {
  return await sfQuery<any>(`
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_AT
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    ORDER BY CERTIFIED_AT DESC NULLS LAST
    LIMIT 5
  `);
}