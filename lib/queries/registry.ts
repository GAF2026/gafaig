import { snowflakeQuery } from "@/lib/snowflake";

export type RegistryRecordRow = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  entityType: string | null;
  country: string | null;

  verificationType: string | null;
  modelVersion: string | null;

  certifiedScore: number | null;
  certifiedTier: string | null;
  certifiedBand: string | null;

  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  lastActivityAt: string | null;
  certifiedAt: string | null;
  publishedAt: string | null;
  registryStatus: string | null;
  createdAt: string | null;
};

export type RegistryListRow = RegistryRecordRow;

function firstString(...values: any[]): string | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

function firstNumber(...values: any[]): number | null {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function normalizeText(value: string | null | undefined): string {
  return String(value ?? "").trim().toUpperCase();
}

function normalizeRegistryRow(row: Record<string, any>): RegistryRecordRow {
  return {
    registryId: firstString(row.REGISTRY_ID) ?? "",
    applicationId: firstString(row.APPLICATION_ID),
    caseId: firstString(row.CASE_ID),

    entityName: firstString(row.ENTITY_NAME),
    entityType: firstString(row.ENTITY_TYPE),
    country: firstString(row.COUNTRY),

    verificationType: firstString(row.VERIFICATION_TYPE),
    modelVersion: firstString(row.MODEL_VERSION),

    certifiedScore: firstNumber(row.CERTIFIED_SCORE, row.SCORE, row.FINAL_SCORE),
    certifiedTier: firstString(row.CERTIFIED_TIER, row.TIER),
    certifiedBand: firstString(row.CERTIFIED_BAND, row.BAND),

    decisionStatus: firstString(row.DECISION_STATUS, row.REGISTRY_STATUS, row.STATUS),
    validFrom: firstString(row.VALID_FROM, row.APPROVED_AT),
    validTo: firstString(row.VALID_TO),
    lastActivityAt: firstString(row.LAST_ACTIVITY_AT, row.PUBLISHED_AT, row.CREATED_AT),
    certifiedAt: firstString(row.CERTIFIED_AT, row.APPROVED_AT, row.PUBLISHED_AT),
    publishedAt: firstString(row.PUBLISHED_AT),
    registryStatus: firstString(row.REGISTRY_STATUS),
    createdAt: firstString(row.CREATED_AT),
  };
}

const baseSelect = `
  SELECT *
  FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
`;

export async function getRegistryRecords(): Promise<RegistryListRow[]> {
  const sql = `
    ${baseSelect}
  `;

  const rows = await snowflakeQuery<Record<string, any>>(sql);
  const normalized = rows.map(normalizeRegistryRow);

  normalized.sort((a, b) => {
    const aName = normalizeText(a.entityName);
    const bName = normalizeText(b.entityName);
    return aName.localeCompare(bName);
  });

  return normalized;
}

export async function getRegistryByRegistryId(
  registryId: string
): Promise<RegistryRecordRow | null> {
  const rows = await getRegistryRecords();
  const match = rows.find(
    (row) => normalizeText(row.registryId) === normalizeText(registryId)
  );
  return match ?? null;
}