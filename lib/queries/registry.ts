import { sfQuery } from "@/lib/snowflake";

export type RegistryQueryRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;

  certificationStatus: string | null;
  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;

  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  lastActivityAt: string | null;

  snapshotId: string | null;
  modelVersion: string | null;
  renewalStatus: string | null;
  registryStatus: string | null;

  score: number | null;
  tier: string | null;
  band: string | null;
  scoredAt: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeDateLike(value: unknown): string | null {
  return asString(value);
}

function normalizeRegistryRow(row: Record<string, unknown>): RegistryQueryRow {
  const certifiedAt =
    normalizeDateLike(row.CERTIFIED_AT) ??
    normalizeDateLike(row.APPROVED_AT) ??
    normalizeDateLike(row.PUBLISHED_AT);

  const approvedAt =
    normalizeDateLike(row.APPROVED_AT) ??
    normalizeDateLike(row.CERTIFIED_AT) ??
    normalizeDateLike(row.PUBLISHED_AT);

  const publishedAt =
    normalizeDateLike(row.PUBLISHED_AT) ??
    normalizeDateLike(row.CERTIFIED_AT) ??
    normalizeDateLike(row.APPROVED_AT);

  const validFrom =
    normalizeDateLike(row.VALID_FROM) ??
    normalizeDateLike(row.CERTIFIED_AT) ??
    normalizeDateLike(row.APPROVED_AT);

  const validTo = normalizeDateLike(row.VALID_TO);

  const lastActivityAt =
    normalizeDateLike(row.LAST_ACTIVITY_AT) ??
    normalizeDateLike(row.PUBLISHED_AT) ??
    normalizeDateLike(row.CERTIFIED_AT) ??
    normalizeDateLike(row.APPROVED_AT);

  const certifiedScore =
    asNumber(row.CERTIFIED_SCORE) ??
    asNumber(row.SCORE);

  const certifiedTier =
    asString(row.CERTIFIED_TIER) ??
    asString(row.TIER);

  const certifiedBand =
    asString(row.CERTIFIED_BAND) ??
    asString(row.BAND);

  const certificationStatus =
    asString(row.CERTIFICATION_STATUS) ??
    (certifiedTier ? "Certified" : null);

  const decisionStatus =
    asString(row.DECISION_STATUS) ??
    asString(row.REGISTRY_STATUS);

  const scoredAt =
    normalizeDateLike(row.CERTIFIED_AT) ??
    normalizeDateLike(row.APPROVED_AT) ??
    normalizeDateLike(row.PUBLISHED_AT);

  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),

    certificationStatus,
    certifiedScore,
    certifiedTier,
    certifiedBand,
    decisionStatus,

    validFrom,
    validTo,
    certifiedAt,
    approvedAt,
    publishedAt,
    lastActivityAt,

    snapshotId: asString(row.REGISTRY_SNAPSHOT_ID),
    modelVersion: asString(row.MODEL_VERSION),
    renewalStatus: asString(row.RENEWAL_STATUS),
    registryStatus: asString(row.REGISTRY_STATUS),

    score: asNumber(row.SCORE),
    tier: asString(row.TIER),
    band: asString(row.BAND),
    scoredAt,
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

    CERTIFICATION_STATUS,
    CERTIFIED_SCORE,
    CERTIFIED_TIER,
    CERTIFIED_BAND,
    DECISION_STATUS,

    VALID_FROM,
    VALID_TO,
    CERTIFIED_AT,
    APPROVED_AT,
    PUBLISHED_AT,
    LAST_ACTIVITY_AT,

    REGISTRY_SNAPSHOT_ID,
    MODEL_VERSION,
    RENEWAL_STATUS,
    REGISTRY_STATUS,

    SCORE,
    TIER,
    BAND
  FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
`;

export async function getRegistryRecords(
  limit = 50
): Promise<RegistryQueryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 200));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${REGISTRY_SELECT}
    ORDER BY COALESCE(PUBLISHED_AT, CERTIFIED_AT, APPROVED_AT) DESC, REGISTRY_ID ASC
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
    ORDER BY COALESCE(PUBLISHED_AT, CERTIFIED_AT, APPROVED_AT) DESC, REGISTRY_ID ASC
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

  if (rows.length === 0) return null;
  return normalizeRegistryRow(rows[0]);
}

export const getRegistryByRegistryId = getRegistryRecordByRegistryId;