import { sfQuery } from "@/lib/snowflake";

export type RegistryRecord = {
  registrySnapshotId: string | null;
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  recordType: string | null;
  recordName: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certificationStatus: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  lifecycleStatus: string | null;
  visibilityStatus: string | null;
  verificationEligible: boolean | string | null;
  badgeEligible: boolean | string | null;
  renewalStatus: string | null;
  publishedAt: string | null;
};

export type RegistryFilterOptions = {
  countries: string[];
  entityTypes: string[];
  statuses: string[];
  recordTypes: string[];
  lifecycleStatuses: string[];
  visibilityStatuses: string[];
};

type SearchRegistryParams = {
  q?: string;
  country?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
  limit?: number;
};

function esc(value: string): string {
  return String(value).replace(/'/g, "''");
}

function toLimit(value?: number): number {
  const n = Number(value ?? 50);
  if (!Number.isFinite(n)) return 50;
  return Math.min(Math.max(Math.trunc(n), 1), 500);
}

const BASE_SELECT = `
  SELECT
    REGISTRY_SNAPSHOT_ID   AS "registrySnapshotId",
    REGISTRY_ID            AS "registryId",
    APPLICATION_ID         AS "applicationId",
    CASE_ID                AS "caseId",
    RECORD_TYPE            AS "recordType",
    RECORD_NAME            AS "recordName",
    ENTITY_NAME            AS "entityName",
    ENTITY_TYPE            AS "entityType",
    COUNTRY                AS "country",
    CERTIFICATION_STATUS   AS "certificationStatus",
    CERTIFIED_AT           AS "certifiedAt",
    VALID_FROM             AS "validFrom",
    VALID_TO               AS "validTo",
    LIFECYCLE_STATUS       AS "lifecycleStatus",
    VISIBILITY_STATUS      AS "visibilityStatus",
    VERIFICATION_ELIGIBLE  AS "verificationEligible",
    BADGE_ELIGIBLE         AS "badgeEligible",
    RENEWAL_STATUS         AS "renewalStatus",
    PUBLISHED_AT           AS "publishedAt"
  FROM CORE.V_REGISTRY_PUBLIC
`;

export async function getRegistryRecords(limit = 50): Promise<RegistryRecord[]> {
  const safeLimit = toLimit(limit);

  return sfQuery<RegistryRecord>(`
    ${BASE_SELECT}
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);
}

export async function searchRegistryRecords(
  params: SearchRegistryParams = {}
): Promise<RegistryRecord[]> {
  const safeLimit = toLimit(params.limit);

  const where: string[] = [];

  if (params.registryId?.trim()) {
    where.push(`UPPER(REGISTRY_ID) = UPPER('${esc(params.registryId.trim())}')`);
  }

  if (params.caseId?.trim()) {
    where.push(`UPPER(CASE_ID) = UPPER('${esc(params.caseId.trim())}')`);
  }

  if (params.applicationId?.trim()) {
    where.push(
      `UPPER(APPLICATION_ID) = UPPER('${esc(params.applicationId.trim())}')`
    );
  }

  if (params.country?.trim()) {
    where.push(`UPPER(COUNTRY) = UPPER('${esc(params.country.trim())}')`);
  }

  if (params.q?.trim()) {
    const q = esc(params.q.trim());
    where.push(`
      (
        UPPER(COALESCE(REGISTRY_SNAPSHOT_ID, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(REGISTRY_ID, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(APPLICATION_ID, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(CASE_ID, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(RECORD_TYPE, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(RECORD_NAME, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(ENTITY_NAME, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(ENTITY_TYPE, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(COUNTRY, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(CERTIFICATION_STATUS, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(LIFECYCLE_STATUS, '')) LIKE UPPER('%${q}%')
        OR UPPER(COALESCE(VISIBILITY_STATUS, '')) LIKE UPPER('%${q}%')
      )
    `);
  }

  const whereSql = where.length ? `WHERE ${where.join("\n      AND ")}` : "";

  return sfQuery<RegistryRecord>(`
    ${BASE_SELECT}
    ${whereSql}
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);
}

export async function getRegistryRecordById(
  registryId: string
): Promise<RegistryRecord | null> {
  const value = registryId.trim();
  if (!value) return null;

  const rows = await sfQuery<RegistryRecord>(`
    ${BASE_SELECT}
    WHERE UPPER(REGISTRY_ID) = UPPER('${esc(value)}')
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
    LIMIT 1
  `);

  return rows[0] ?? null;
}

export async function getRegistryFilterOptions(): Promise<RegistryFilterOptions> {
  const rows = await sfQuery<{
    country: string | null;
    entityType: string | null;
    certificationStatus: string | null;
    recordType: string | null;
    lifecycleStatus: string | null;
    visibilityStatus: string | null;
  }>(`
    SELECT DISTINCT
      COUNTRY              AS "country",
      ENTITY_TYPE          AS "entityType",
      CERTIFICATION_STATUS AS "certificationStatus",
      RECORD_TYPE          AS "recordType",
      LIFECYCLE_STATUS     AS "lifecycleStatus",
      VISIBILITY_STATUS    AS "visibilityStatus"
    FROM CORE.V_REGISTRY_PUBLIC
    ORDER BY 1, 2, 3, 4, 5, 6
  `);

  const countries = new Set<string>();
  const entityTypes = new Set<string>();
  const statuses = new Set<string>();
  const recordTypes = new Set<string>();
  const lifecycleStatuses = new Set<string>();
  const visibilityStatuses = new Set<string>();

  for (const row of rows) {
    if (row.country?.trim()) countries.add(row.country.trim());
    if (row.entityType?.trim()) entityTypes.add(row.entityType.trim());
    if (row.certificationStatus?.trim()) {
      statuses.add(row.certificationStatus.trim());
    }
    if (row.recordType?.trim()) recordTypes.add(row.recordType.trim());
    if (row.lifecycleStatus?.trim()) {
      lifecycleStatuses.add(row.lifecycleStatus.trim());
    }
    if (row.visibilityStatus?.trim()) {
      visibilityStatuses.add(row.visibilityStatus.trim());
    }
  }

  return {
    countries: Array.from(countries).sort((a, b) => a.localeCompare(b)),
    entityTypes: Array.from(entityTypes).sort((a, b) => a.localeCompare(b)),
    statuses: Array.from(statuses).sort((a, b) => a.localeCompare(b)),
    recordTypes: Array.from(recordTypes).sort((a, b) => a.localeCompare(b)),
    lifecycleStatuses: Array.from(lifecycleStatuses).sort((a, b) =>
      a.localeCompare(b)
    ),
    visibilityStatuses: Array.from(visibilityStatuses).sort((a, b) =>
      a.localeCompare(b)
    ),
  };
}