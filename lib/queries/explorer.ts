// lib/queries/explorer.ts

import { sfQuery } from "@/lib/snowflake";

export type ExplorerStats = {
  totalRecords: number;
  totalCountries: number;
  totalEntities: number;
};

export type ExplorerRecord = {
  registryId: string;
  entityName: string;
  country: string;
  certificationStatus: string;
  certifiedAt: string | null;
};

export async function getExplorerData() {
  try {
    // ✅ SAFE stats query (only uses known fields)
    const statsResult = await sfQuery(`
      SELECT
        COUNT(*) AS total_records,
        COUNT(DISTINCT COUNTRY) AS total_countries,
        COUNT(DISTINCT ENTITY_NAME) AS total_entities
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE CERTIFICATION_STATUS = 'CERTIFIED'
    `);

    const statsRow = statsResult?.[0] || {};

    const stats: ExplorerStats = {
      totalRecords: Number(statsRow.total_records || 0),
      totalCountries: Number(statsRow.total_countries || 0),
      totalEntities: Number(statsRow.total_entities || 0),
    };

    // ✅ SAFE records query
    const recordsResult = await sfQuery(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        COUNTRY,
        CERTIFICATION_STATUS,
        CERTIFIED_AT
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE CERTIFICATION_STATUS = 'CERTIFIED'
      ORDER BY CERTIFIED_AT DESC
      LIMIT 25
    `);

    const records: ExplorerRecord[] =
      (recordsResult || []).map((r: any) => ({
        registryId: r.REGISTRY_ID,
        entityName: r.ENTITY_NAME,
        country: r.COUNTRY,
        certificationStatus: r.CERTIFICATION_STATUS,
        certifiedAt: r.CERTIFIED_AT,
      })) || [];

    return {
      stats,
      records,
    };
  } catch (err) {
    console.error("Explorer query failed:", err);

    return {
      stats: {
        totalRecords: 0,
        totalCountries: 0,
        totalEntities: 0,
      },
      records: [],
    };
  }
}