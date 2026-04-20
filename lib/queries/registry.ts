import { sfQuery } from "@/lib/snowflake";

export type RegistryRecord = {
  registryId: string;
  caseId: string | null;
  applicationId: string | null;

  entityName: string;
  entityType: string | null;
  country: string | null;

  decisionStatus: string | null;
  certificationStatus: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;

  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;

  renewalStatus: string | null;
};

export type RegistryFilterOptions = {
  countries: string[];
  organizations: string[];
  tiers: string[];
  bands: string[];
};

type SearchRegistryArgs = {
  q?: string;
  country?: string;
  organization?: string;
  tier?: string;
  band?: string;
  registryId?: string;
  caseId?: string;
  applicationId?: string;
  limit?: number;
};

function safePositiveInt(value: number | undefined, fallback: number): number {
  return Number.isFinite(value) && Number(value) > 0
    ? Math.floor(Number(value))
    : fallback;
}

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

function mapRegistryRecord(r: any): RegistryRecord {
  return {
    registryId: r.REGISTRY_ID,
    caseId: r.CASE_ID ?? null,
    applicationId: r.APPLICATION_ID ?? null,

    entityName: r.ENTITY_NAME,
    entityType: r.ENTITY_TYPE ?? null,
    country: r.COUNTRY ?? null,

    decisionStatus: r.DECISION_STATUS ?? null,
    certificationStatus: r.CERTIFICATION_STATUS ?? null,
    certifiedScore: r.CERTIFIED_SCORE != null ? String(r.CERTIFIED_SCORE) : null,
    certifiedTier: r.CERTIFIED_TIER ?? null,
    certifiedBand: r.CERTIFIED_BAND ?? null,

    certifiedAt: r.CERTIFIED_AT ? String(r.CERTIFIED_AT) : null,
    validFrom: r.VALID_FROM ? String(r.VALID_FROM) : null,
    validTo: r.VALID_TO ? String(r.VALID_TO) : null,

    renewalStatus: r.RENEWAL_STATUS ?? null,
  };
}

function baseRegistrySelectSql(): string {
  return `
    SELECT
      REGISTRY_ID,
      CASE_ID,
      APPLICATION_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      DECISION_STATUS,
      CERTIFICATION_STATUS,
      CERTIFIED_SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      CERTIFIED_AT,
      VALID_FROM,
      VALID_TO,
      RENEWAL_STATUS
    FROM CORE.V_REGISTRY_PUBLIC
  `;
}

export async function getRegistryRecords(limit = 200): Promise<RegistryRecord[]> {
  const safeLimit = safePositiveInt(limit, 200);

  const rows = await sfQuery<any>(`
    ${baseRegistrySelectSql()}
    ORDER BY
      CERTIFIED_AT DESC NULLS LAST,
      ENTITY_NAME ASC,
      REGISTRY_ID ASC
    LIMIT ${safeLimit}
  `);

  return rows.map(mapRegistryRecord);
}

export async function getRegistryByRegistryId(
  registryId: string
): Promise<RegistryRecord | null> {
  const normalizedRegistryId = String(registryId ?? "").trim();
  if (!normalizedRegistryId) return null;

  const rows = await sfQuery<any>(`
    ${baseRegistrySelectSql()}
    WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM('${escapeSqlString(
      normalizedRegistryId
    )}'))
    LIMIT 1
  `);

  return rows.length ? mapRegistryRecord(rows[0]) : null;
}

export async function getRegistryFilterOptions(): Promise<RegistryFilterOptions> {
  const rows = await getRegistryRecords(500);

  const dedupeSort = (values: Array<string | null | undefined>) =>
    Array.from(
      new Set(
        values
          .map((v) => String(v ?? "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

  return {
    countries: dedupeSort(rows.map((r) => r.country)),
    organizations: dedupeSort(rows.map((r) => r.entityName)),
    tiers: dedupeSort(rows.map((r) => r.certifiedTier)),
    bands: dedupeSort(rows.map((r) => r.certifiedBand)),
  };
}

export async function searchRegistryRecords(
  args: string | SearchRegistryArgs
): Promise<RegistryRecord[]> {
  if (typeof args === "string") {
    const q = String(args ?? "").trim();
    return searchRegistryRecords({ q });
  }

  const q = String(args.q ?? "").trim();
  const country = String(args.country ?? "").trim();
  const organization = String(args.organization ?? "").trim();
  const tier = String(args.tier ?? "").trim();
  const band = String(args.band ?? "").trim();
  const registryId = String(args.registryId ?? "").trim();
  const caseId = String(args.caseId ?? "").trim();
  const applicationId = String(args.applicationId ?? "").trim();
  const limit = safePositiveInt(args.limit, 200);

  const whereClauses: string[] = [];

  if (q) {
    const escaped = escapeSqlString(q);
    whereClauses.push(`
      (
        UPPER(COALESCE(ENTITY_NAME, '')) LIKE UPPER('%${escaped}%')
        OR UPPER(COALESCE(REGISTRY_ID, '')) LIKE UPPER('%${escaped}%')
        OR UPPER(COALESCE(CASE_ID, '')) LIKE UPPER('%${escaped}%')
        OR UPPER(COALESCE(APPLICATION_ID, '')) LIKE UPPER('%${escaped}%')
        OR UPPER(COALESCE(COUNTRY, '')) LIKE UPPER('%${escaped}%')
      )
    `);
  }

  if (country) {
    whereClauses.push(
      `UPPER(TRIM(COUNTRY)) = UPPER(TRIM('${escapeSqlString(country)}'))`
    );
  }

  if (organization) {
    whereClauses.push(
      `UPPER(TRIM(ENTITY_NAME)) = UPPER(TRIM('${escapeSqlString(organization)}'))`
    );
  }

  if (tier) {
    whereClauses.push(
      `UPPER(TRIM(CERTIFIED_TIER)) = UPPER(TRIM('${escapeSqlString(tier)}'))`
    );
  }

  if (band) {
    whereClauses.push(
      `UPPER(TRIM(CERTIFIED_BAND)) = UPPER(TRIM('${escapeSqlString(band)}'))`
    );
  }

  if (registryId) {
    whereClauses.push(
      `UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM('${escapeSqlString(registryId)}'))`
    );
  }

  if (caseId) {
    whereClauses.push(
      `UPPER(TRIM(CASE_ID)) = UPPER(TRIM('${escapeSqlString(caseId)}'))`
    );
  }

  if (applicationId) {
    whereClauses.push(
      `UPPER(TRIM(APPLICATION_ID)) = UPPER(TRIM('${escapeSqlString(applicationId)}'))`
    );
  }

  const whereSql = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  const rows = await sfQuery<any>(`
    ${baseRegistrySelectSql()}
    ${whereSql}
    ORDER BY
      CERTIFIED_AT DESC NULLS LAST,
      ENTITY_NAME ASC,
      REGISTRY_ID ASC
    LIMIT ${limit}
  `);

  return rows.map(mapRegistryRecord);
}