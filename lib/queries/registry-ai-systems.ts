import { sfQuery } from "@/lib/snowflake";

export type RegistryAiSystemRow = {
  systemId: string;
  registryId: string | null;
  applicationId: string | null;
  caseId: string | null;

  entityName: string | null;
  country: string | null;

  systemName: string;
  systemType: string | null;
  intendedUse: string | null;

  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;

  developerOrganization: string | null;
  trainingDataCategory: string | null;
  oversightModel: string | null;
  humanReviewRequired: boolean | null;
  evaluationProtocol: string | null;
  auditFrequency: string | null;
  publicSummary: string | null;

  decisionStatus: string | null;
  certificationStatus: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;

  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  approvedAt: string | null;
  publishedAt: string | null;
  registryStatus: string | null;
  renewalStatus: string | null;
  lifecycleStatus: string | null;
};

type RelatedRegistryAiSystemsArgs = {
  registryId: string | null;
  excludeSystemId?: string | null;
  limit?: number;
};

function safePositiveInt(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && Number(value) > 0 ? Math.floor(Number(value)) : fallback;
}

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

function parseBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value == null) return null;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(v)) return true;
    if (["false", "0", "no", "n"].includes(v)) return false;
  }
  return Boolean(value);
}

function mapRegistryAiSystemRow(r: any): RegistryAiSystemRow {
  return {
    systemId: r.SYSTEM_ID,
    registryId: r.REGISTRY_ID ?? null,
    applicationId: r.APPLICATION_ID ?? null,
    caseId: r.CASE_ID ?? null,

    entityName: r.ENTITY_NAME ?? null,
    country: r.COUNTRY ?? null,

    systemName: r.SYSTEM_NAME,
    systemType: r.SYSTEM_TYPE ?? null,
    intendedUse: r.INTENDED_USE ?? null,

    deploymentStatus: r.DEPLOYMENT_STATUS ?? null,
    oversightLevel: r.OVERSIGHT_LEVEL ?? null,
    riskTier: r.RISK_TIER ?? null,

    developerOrganization: r.DEVELOPER_ORGANIZATION ?? null,
    trainingDataCategory: r.TRAINING_DATA_CATEGORY ?? null,
    oversightModel: r.OVERSIGHT_MODEL ?? null,
    humanReviewRequired: parseBoolean(r.HUMAN_REVIEW_REQUIRED),
    evaluationProtocol: r.EVALUATION_PROTOCOL ?? null,
    auditFrequency: r.AUDIT_FREQUENCY ?? null,
    publicSummary: r.PUBLIC_SUMMARY ?? null,

    decisionStatus: r.DECISION_STATUS ?? null,
    certificationStatus: r.CERTIFICATION_STATUS ?? null,
    certifiedScore: r.CERTIFIED_SCORE ?? null,
    certifiedTier: r.CERTIFIED_TIER ?? null,
    certifiedBand: r.CERTIFIED_BAND ?? null,

    certifiedAt: r.CERTIFIED_AT ?? null,
    validFrom: r.VALID_FROM ?? null,
    validTo: r.VALID_TO ?? null,
    approvedAt: r.APPROVED_AT ?? null,
    publishedAt: r.PUBLISHED_AT ?? null,
    registryStatus: r.REGISTRY_STATUS ?? null,
    renewalStatus: r.RENEWAL_STATUS ?? null,
    lifecycleStatus: r.LIFECYCLE_STATUS ?? null,
  };
}

function baseSelectSql(): string {
  return `
    SELECT
      sys.SYSTEM_ID,
      sys.REGISTRY_ID,
      sys.APPLICATION_ID,
      sys.CASE_ID,

      reg.ENTITY_NAME,
      reg.COUNTRY,

      sys.SYSTEM_NAME,
      sys.SYSTEM_TYPE,
      sys.INTENDED_USE,
      sys.DEPLOYMENT_STATUS,
      sys.OVERSIGHT_LEVEL,
      sys.RISK_TIER,
      sys.DEVELOPER_ORGANIZATION,
      sys.TRAINING_DATA_CATEGORY,
      sys.OVERSIGHT_MODEL,
      sys.HUMAN_REVIEW_REQUIRED,
      sys.EVALUATION_PROTOCOL,
      sys.AUDIT_FREQUENCY,
      sys.PUBLIC_SUMMARY,

      reg.DECISION_STATUS,
      reg.CERTIFICATION_STATUS,
      TO_VARCHAR(reg.CERTIFIED_SCORE) AS CERTIFIED_SCORE,
      reg.CERTIFIED_TIER,
      reg.CERTIFIED_BAND,
      TO_VARCHAR(reg.CERTIFIED_AT) AS CERTIFIED_AT,
      TO_VARCHAR(reg.VALID_FROM) AS VALID_FROM,
      TO_VARCHAR(reg.VALID_TO) AS VALID_TO,
      TO_VARCHAR(reg.APPROVED_AT) AS APPROVED_AT,
      TO_VARCHAR(reg.PUBLISHED_AT) AS PUBLISHED_AT,
      reg.RENEWAL_STATUS,
      reg.LIFECYCLE_STATUS,
      CASE
        WHEN UPPER(COALESCE(reg.CERTIFICATION_STATUS, '')) = 'CERTIFIED' THEN 'published'
        WHEN UPPER(COALESCE(reg.DECISION_STATUS, '')) = 'APPROVED' THEN 'approved'
        ELSE NULL
      END AS REGISTRY_STATUS

    FROM CORE.REGISTRY_AI_SYSTEMS sys
    LEFT JOIN CORE.V_REGISTRY_PUBLIC reg
      ON UPPER(TRIM(sys.REGISTRY_ID)) = UPPER(TRIM(reg.REGISTRY_ID))

    WHERE COALESCE(sys.IS_PUBLIC, TRUE) = TRUE
  `;
}

export async function getRegistryAiSystemsPaginated({
  page = 1,
  pageSize = 200,
}: {
  page?: number;
  pageSize?: number;
} = {}): Promise<{ rows: RegistryAiSystemRow[] }> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize = safePositiveInt(pageSize, 200);
  const offset = (safePage - 1) * safePageSize;

  const rows = await sfQuery<any>(`
    ${baseSelectSql()}
    ORDER BY
      COALESCE(reg.CERTIFIED_AT, TO_TIMESTAMP_NTZ('1970-01-01')) DESC,
      sys.SYSTEM_NAME ASC,
      sys.SYSTEM_ID ASC
    LIMIT ${safePageSize}
    OFFSET ${offset}
  `);

  return { rows: rows.map(mapRegistryAiSystemRow) };
}

export async function getRegistryAiSystemsByRegistryId(
  registryId: string,
  limit = 200,
): Promise<RegistryAiSystemRow[]> {
  const normalizedRegistryId = String(registryId ?? "").trim();
  if (!normalizedRegistryId) return [];

  const safeLimit = safePositiveInt(limit, 200);

  const rows = await sfQuery<any>(`
    ${baseSelectSql()}
      AND UPPER(TRIM(sys.REGISTRY_ID)) = UPPER(TRIM('${escapeSqlString(normalizedRegistryId)}'))
    ORDER BY
      COALESCE(sys.DISPLAY_ORDER, 999999) ASC,
      sys.SYSTEM_NAME ASC,
      sys.SYSTEM_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map(mapRegistryAiSystemRow);
}

export async function getRegistryAiSystemBySystemId(
  systemId: string,
): Promise<RegistryAiSystemRow | null> {
  const normalizedSystemId = String(systemId ?? "").trim();
  if (!normalizedSystemId) return null;

  const rows = await sfQuery<any>(`
    ${baseSelectSql()}
      AND UPPER(TRIM(sys.SYSTEM_ID)) = UPPER(TRIM('${escapeSqlString(normalizedSystemId)}'))
    ORDER BY
      COALESCE(sys.DISPLAY_ORDER, 999999) ASC,
      sys.SYSTEM_NAME ASC,
      sys.SYSTEM_ID ASC
    LIMIT 1
  `);

  return rows.length ? mapRegistryAiSystemRow(rows[0]) : null;
}

export async function getRelatedRegistryAiSystems(
  args: string | RelatedRegistryAiSystemsArgs,
): Promise<RegistryAiSystemRow[]> {
  if (typeof args === "string") {
    const current = await getRegistryAiSystemBySystemId(args);
    if (!current?.registryId) return [];

    return getRelatedRegistryAiSystems({
      registryId: current.registryId,
      excludeSystemId: current.systemId,
      limit: 6,
    });
  }

  const registryId = String(args.registryId ?? "").trim();
  const excludeSystemId = String(args.excludeSystemId ?? "").trim();
  const safeLimit = safePositiveInt(args.limit, 6);

  if (!registryId) return [];

  const excludeSql = excludeSystemId
    ? `AND UPPER(TRIM(sys.SYSTEM_ID)) <> UPPER(TRIM('${escapeSqlString(excludeSystemId)}'))`
    : "";

  const rows = await sfQuery<any>(`
    ${baseSelectSql()}
      AND UPPER(TRIM(sys.REGISTRY_ID)) = UPPER(TRIM('${escapeSqlString(registryId)}'))
      ${excludeSql}
    ORDER BY
      COALESCE(sys.DISPLAY_ORDER, 999999) ASC,
      sys.SYSTEM_NAME ASC,
      sys.SYSTEM_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map(mapRegistryAiSystemRow);
}