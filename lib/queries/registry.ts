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

  badgeImageUrl?: string | null;
  badgeLabel?: string | null;
  badgeTier?: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function normalizeId(value: string): string {
  return String(value || "")
    .normalize("NFKD")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeRegistryRow(row: Record<string, unknown>): RegistryQueryRow {
  const certificationStatus = asString(row.CERTIFICATION_STATUS);
  const certifiedScore = asNumber(row.CERTIFIED_SCORE);
  const certifiedTier = asString(row.CERTIFIED_TIER);
  const certifiedBand = asString(row.CERTIFIED_BAND);
  const decisionStatus = asString(row.DECISION_STATUS);

  const validFrom = asString(row.VALID_FROM);
  const validTo = asString(row.VALID_TO);
  const certifiedAt = asString(row.CERTIFIED_AT);
  const approvedAt = asString(row.APPROVED_AT);
  const publishedAt = asString(row.PUBLISHED_AT);
  const lastActivityAt = asString(row.LAST_ACTIVITY_AT);

  const scoredAt = certifiedAt ?? approvedAt ?? publishedAt ?? lastActivityAt;

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

    badgeImageUrl: asString(row.BADGE_IMAGE_URL),
    badgeLabel: asString(row.BADGE_LABEL),
    badgeTier: asString(row.BADGE_TIER),
  };
}

const REGISTRY_SOURCE = "GAFAIG_DB.CORE.V_REGISTRY_PUBLIC";

export async function getRegistryRecords(
  limit = 100
): Promise<RegistryQueryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT *
    FROM ${REGISTRY_SOURCE}
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
  const rows = await getRegistryRecords(params.limit ?? 500);

  const q = (params.q ?? "").trim().toUpperCase();
  const country = normalizeId(params.country ?? "");
  const registryId = normalizeId(params.registryId ?? "");
  const caseId = normalizeId(params.caseId ?? "");
  const applicationId = normalizeId(params.applicationId ?? "");

  return rows.filter((row) => {
    if (country && normalizeId(row.country ?? "") !== country) return false;
    if (registryId && normalizeId(row.registryId) !== registryId) return false;
    if (caseId && normalizeId(row.caseId ?? "") !== caseId) return false;
    if (applicationId && normalizeId(row.applicationId ?? "") !== applicationId) {
      return false;
    }

    if (q) {
      const haystack = [
        row.entityName ?? "",
        row.entityType ?? "",
        row.country ?? "",
        row.registryId ?? "",
        row.caseId ?? "",
        row.applicationId ?? "",
      ]
        .join(" ")
        .toUpperCase();

      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export async function getRegistryRecordByRegistryId(
  registryId: string
): Promise<RegistryQueryRow | null> {
  const id = String(registryId || "").trim();
  if (!id) return null;

  const rows = await sfQuery<Record<string, unknown>>(
    `
    SELECT *
    FROM ${REGISTRY_SOURCE}
    WHERE UPPER(REGEXP_REPLACE(REGISTRY_ID, '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    LIMIT 1
    `,
    [id]
  );

  if (!rows || rows.length === 0) {
    return null;
  }

  return normalizeRegistryRow(rows[0]);
}

export const getRegistryByRegistryId = getRegistryRecordByRegistryId;