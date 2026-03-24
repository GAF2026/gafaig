import { sfQuery } from "@/lib/snowflake";

export type RegistryQueryRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
  lastActivityAt: string | null;
  snapshotId: string | null;
  modelVersion: string | null;
  renewalStatus: string | null;
  scoredAt: string | null;
  certificationStatus: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeRegistryRow(row: Record<string, unknown>): RegistryQueryRow {
  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),

    // ✅ STRICT: ONLY certified fields
    certifiedScore: asNumber(row.CERTIFIED_SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),

    decisionStatus:
      asString(row.DECISION_STATUS) ??
      asString(row.REGISTRY_STATUS),

    // ✅ Use Snowflake-derived fields
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),

    certifiedAt: asString(row.CERTIFIED_AT),
    lastActivityAt: asString(row.LAST_ACTIVITY_AT),

    snapshotId: asString(row.REGISTRY_SNAPSHOT_ID),
    modelVersion: asString(row.MODEL_VERSION),
    renewalStatus: asString(row.RENEWAL_STATUS),

    scoredAt: asString(row.CERTIFIED_AT),

    certificationStatus: asString(row.CERTIFICATION_STATUS),
  };
}

const REGISTRY_SELECT = `
  SELECT
    REGISTRY_ID,
    APPLICATION_ID,
    CASE_ID,
    ENTITY_NAME,
    ENTITY_TYPE,
    COUNTRY,

    CERTIFIED_SCORE,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    CERTIFICATION_STATUS,

    DECISION_STATUS,

    CERTIFIED_AT,
    VALID_FROM,
    VALID_TO,
    LAST_ACTIVITY_AT,

    REGISTRY_SNAPSHOT_ID,
    MODEL_VERSION,
    RENEWAL_STATUS,

    REGISTRY_STATUS
  FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
`;

export async function getRegistryRecords(limit = 50): Promise<RegistryQueryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 200));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${REGISTRY_SELECT}
    ORDER BY LAST_ACTIVITY_AT DESC, REGISTRY_ID ASC
    LIMIT ?
    `,
    [safeLimit]
  );

  return rows.map(normalizeRegistryRow);
}

export async function searchRegistryRecords(params: {
  q?: string;
  country?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
  limit?: number;
}): Promise<RegistryQueryRow[]> {
  const safeLimit = Math.max(1, Math.min(params.limit ?? 50, 200));

  const q = (params.q ?? "").trim();
  const country = (params.country ?? "").trim();
  const registryId = (params.registryId ?? "").trim();
  const caseId = (params.caseId ?? "").trim();
  const applicationId = (params.applicationId ?? "").trim();

  const conditions: string[] = [];
  const binds: unknown[] = [];

  if (q) {
    conditions.push(`
      (
        UPPER(COALESCE(ENTITY_NAME, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(ENTITY_TYPE, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(COUNTRY, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(REGISTRY_ID, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(CASE_ID, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(APPLICATION_ID, '')) LIKE UPPER(?)
      )
    `);
    const like = `%${q}%`;
    binds.push(like, like, like, like, like, like);
  }

  if (country) {
    conditions.push(`UPPER(COALESCE(COUNTRY, '')) = UPPER(?)`);
    binds.push(country);
  }

  if (registryId) {
    conditions.push(`UPPER(COALESCE(REGISTRY_ID, '')) = UPPER(?)`);
    binds.push(registryId);
  }

  if (caseId) {
    conditions.push(`UPPER(COALESCE(CASE_ID, '')) = UPPER(?)`);
    binds.push(caseId);
  }

  if (applicationId) {
    conditions.push(`UPPER(COALESCE(APPLICATION_ID, '')) = UPPER(?)`);
    binds.push(applicationId);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${REGISTRY_SELECT}
    ${whereClause}
    ORDER BY LAST_ACTIVITY_AT DESC, REGISTRY_ID ASC
    LIMIT ?
    `,
    [...binds, safeLimit]
  );

  return rows.map(normalizeRegistryRow);
}

export async function getRegistryRecordByRegistryId(
  registryId: string
): Promise<RegistryQueryRow | null> {
  const id = registryId.trim();
  if (!id) return null;

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${REGISTRY_SELECT}
    WHERE UPPER(COALESCE(REGISTRY_ID, '')) = UPPER(?)
    LIMIT 1
    `,
    [id]
  );

  const row = rows[0];
  return row ? normalizeRegistryRow(row) : null;
}

export async function getRegistryByRegistryId(
  registryId: string
): Promise<RegistryQueryRow | null> {
  return getRegistryRecordByRegistryId(registryId);
}