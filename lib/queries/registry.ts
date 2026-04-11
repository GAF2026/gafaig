import { sfQuery } from "@/lib/snowflake";

export type RegistryQueryRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  country: string | null;

  // keep UI contract safe
  entityType: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function normalizeId(value: string): string {
  return String(value || "")
    .normalize("NFKD")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeRegistryRow(row: Record<string, unknown>): RegistryQueryRow {
  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    country: asString(row.COUNTRY),

    // 🔒 FORCE SAFE NULLS (CRITICAL)
    entityType: null,
    certifiedScore: null,
    certifiedTier: null,
    certifiedBand: null,
    decisionStatus: null,
    validFrom: null,
    validTo: null,
    certifiedAt: null,
  };
}

const REGISTRY_SOURCE = "CORE.V_REGISTRY_PUBLIC";

const REGISTRY_SELECT = `
  SELECT
    REGISTRY_ID,
    APPLICATION_ID,
    CASE_ID,
    ENTITY_NAME,
    COUNTRY
  FROM ${REGISTRY_SOURCE}
`;

export async function getRegistryRecords(
  limit = 100
): Promise<RegistryQueryRow[]> {
  const safeLimit = Math.max(1, Math.min(limit, 1000));

  const rows = await sfQuery<Record<string, unknown>>(
    `
    ${REGISTRY_SELECT}
    ORDER BY ENTITY_NAME ASC, REGISTRY_ID ASC
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
    ${REGISTRY_SELECT}
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