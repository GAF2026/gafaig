// ============================================================
// explorer.ts
//
// Canonical query layer for Explorer / Analytics
//
// RULES:
// - Only reads Snowflake views
// - No business logic
// - Typed, deterministic outputs
// ============================================================

import { sfQuery } from "@/lib/snowflake";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export type ExplorerGlobalStats = {
  totalRegistryRecords: number;
  totalRegistryIds: number;
  totalCases: number;
  totalApplications: number;
  totalEntities: number;
  totalCountries: number;
  totalPublished: number;
  totalCertified: number;
  totalNotCertified: number;
  firstPublishedAt: string | null;
  lastActivityAt: string | null;
};

export type ExplorerCountryStats = {
  country: string;
  totalRecords: number;
  totalEntities: number;
  totalRegistryIds: number;
  totalCertified: number;
  totalNotCertified: number;
  lastActivityAt: string | null;
};

export type ExplorerStatusStats = {
  certificationStatus: string;
  totalRecords: number;
  totalEntities: number;
  lastActivityAt: string | null;
};

export type ExplorerTierStats = {
  certifiedTier: string;
  totalRecords: number;
  totalEntities: number;
  lastActivityAt: string | null;
};

export type ExplorerBandStats = {
  certifiedBand: string;
  totalRecords: number;
  totalEntities: number;
  lastActivityAt: string | null;
};

export type ExplorerEntityTypeStats = {
  entityType: string;
  totalRecords: number;
  totalEntities: number;
  totalCertified: number;
  totalNotCertified: number;
  lastActivityAt: string | null;
};

// ------------------------------------------------------------
// Queries
// ------------------------------------------------------------

export async function getExplorerGlobalStats(): Promise<ExplorerGlobalStats | null> {
  const rows = await sfQuery<any>(`
    SELECT * FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_GLOBAL
  `);

  if (!rows.length) return null;

  const r = rows[0];

  return {
    totalRegistryRecords: r.TOTAL_REGISTRY_RECORDS,
    totalRegistryIds: r.TOTAL_REGISTRY_IDS,
    totalCases: r.TOTAL_CASES,
    totalApplications: r.TOTAL_APPLICATIONS,
    totalEntities: r.TOTAL_ENTITIES,
    totalCountries: r.TOTAL_COUNTRIES,
    totalPublished: r.TOTAL_PUBLISHED,
    totalCertified: r.TOTAL_CERTIFIED,
    totalNotCertified: r.TOTAL_NOT_CERTIFIED,
    firstPublishedAt: r.FIRST_PUBLISHED_AT,
    lastActivityAt: r.LAST_ACTIVITY_AT,
  };
}

export async function getExplorerByCountry(): Promise<ExplorerCountryStats[]> {
  const rows = await sfQuery<any>(`
    SELECT * FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_COUNTRY
  `);

  return rows.map((r) => ({
    country: r.COUNTRY,
    totalRecords: r.TOTAL_RECORDS,
    totalEntities: r.TOTAL_ENTITIES,
    totalRegistryIds: r.TOTAL_REGISTRY_IDS,
    totalCertified: r.TOTAL_CERTIFIED,
    totalNotCertified: r.TOTAL_NOT_CERTIFIED,
    lastActivityAt: r.LAST_ACTIVITY_AT,
  }));
}

export async function getExplorerByStatus(): Promise<ExplorerStatusStats[]> {
  const rows = await sfQuery<any>(`
    SELECT * FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_STATUS
  `);

  return rows.map((r) => ({
    certificationStatus: r.CERTIFICATION_STATUS,
    totalRecords: r.TOTAL_RECORDS,
    totalEntities: r.TOTAL_ENTITIES,
    lastActivityAt: r.LAST_ACTIVITY_AT,
  }));
}

export async function getExplorerByTier(): Promise<ExplorerTierStats[]> {
  const rows = await sfQuery<any>(`
    SELECT * FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_TIER
  `);

  return rows.map((r) => ({
    certifiedTier: r.CERTIFIED_TIER,
    totalRecords: r.TOTAL_RECORDS,
    totalEntities: r.TOTAL_ENTITIES,
    lastActivityAt: r.LAST_ACTIVITY_AT,
  }));
}

export async function getExplorerByBand(): Promise<ExplorerBandStats[]> {
  const rows = await sfQuery<any>(`
    SELECT * FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_BAND
  `);

  return rows.map((r) => ({
    certifiedBand: r.CERTIFIED_BAND,
    totalRecords: r.TOTAL_RECORDS,
    totalEntities: r.TOTAL_ENTITIES,
    lastActivityAt: r.LAST_ACTIVITY_AT,
  }));
}

export async function getExplorerByEntityType(): Promise<ExplorerEntityTypeStats[]> {
  const rows = await sfQuery<any>(`
    SELECT * FROM GAFAIG_DB.CORE.V_REGISTRY_STATS_BY_ENTITY_TYPE
  `);

  return rows.map((r) => ({
    entityType: r.ENTITY_TYPE,
    totalRecords: r.TOTAL_RECORDS,
    totalEntities: r.TOTAL_ENTITIES,
    totalCertified: r.TOTAL_CERTIFIED,
    totalNotCertified: r.TOTAL_NOT_CERTIFIED,
    lastActivityAt: r.LAST_ACTIVITY_AT,
  }));
}