import { sfQuery } from "@/lib/snowflake";

export type CountryIntelligenceRow = {
  country: string;

  totalPublicRecords: number;
  totalOrganizations: number;
  totalAiSystems: number;
  certifiedAiSystems: number;
  activeAiSystems: number;

  activeCertifications: number;
  expiredCertifications: number;

  renewalDue30Days: number;
  renewalDue90Days: number;

  expiring30Days: number;
  expiring90Days: number;

  certificationContinuityRecords: number;

  firstPublicationActivity: string | null;
  latestPublicationActivity: string | null;
};

export type CountryGovernanceSignalRow = {
  country: string;

  signalType: string;
  signalValue: number;

  signalDescription: string;
  signalCategory: string;

  lastActivityAt: string | null;
};

export type CountryOrganizationRow = {
  country: string;
  organizationName: string;

  totalPublicRecords: number;
  activeCertifications: number;
  expiredCertifications: number;

  renewalDue30Days: number;
  renewalDue90Days: number;

  latestPublicationActivity: string | null;
};

export type CountryAiSystemRow = {
  country: string;

  registryId: string;

  systemName: string | null;
  systemType: string | null;
  intendedUse: string | null;

  deploymentStatus: string | null;
  oversightLevel: string | null;

  certificationStatus: string | null;
  lifecycleStatus: string | null;
  renewalStatus: string | null;

  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
};

export type CountryIntelligenceValidationRow = {
  totalCountries: number;
  emptyCountryValues: number;
  nullPublicRecordCounts: number;
  nullAiSystemCounts: number;
};

export async function getCountryIntelligence(): Promise<
  CountryIntelligenceRow[]
> {
  const rows = await sfQuery<CountryIntelligenceRow>(
    `
    SELECT
      COUNTRY AS "country",

      TOTAL_PUBLIC_RECORDS AS "totalPublicRecords",
      TOTAL_ORGANIZATIONS AS "totalOrganizations",
      TOTAL_AI_SYSTEMS AS "totalAiSystems",
      CERTIFIED_AI_SYSTEMS AS "certifiedAiSystems",
      ACTIVE_AI_SYSTEMS AS "activeAiSystems",

      ACTIVE_CERTIFICATIONS AS "activeCertifications",
      EXPIRED_CERTIFICATIONS AS "expiredCertifications",

      RENEWAL_DUE_30_DAYS AS "renewalDue30Days",
      RENEWAL_DUE_90_DAYS AS "renewalDue90Days",

      EXPIRING_30_DAYS AS "expiring30Days",
      EXPIRING_90_DAYS AS "expiring90Days",

      CERTIFICATION_CONTINUITY_RECORDS
        AS "certificationContinuityRecords",

      FIRST_PUBLICATION_ACTIVITY
        AS "firstPublicationActivity",

      LATEST_PUBLICATION_ACTIVITY
        AS "latestPublicationActivity"

    FROM CORE.V_COUNTRY_INTELLIGENCE_PUBLIC

    ORDER BY
      TOTAL_PUBLIC_RECORDS DESC,
      COUNTRY ASC
    `
  );

  return rows;
}

export async function getCountryGovernanceSignals(): Promise<
  CountryGovernanceSignalRow[]
> {
  const rows = await sfQuery<CountryGovernanceSignalRow>(
    `
    SELECT
      COUNTRY AS "country",

      SIGNAL_TYPE AS "signalType",
      SIGNAL_VALUE AS "signalValue",

      SIGNAL_DESCRIPTION AS "signalDescription",
      SIGNAL_CATEGORY AS "signalCategory",

      LAST_ACTIVITY_AT AS "lastActivityAt"

    FROM CORE.V_COUNTRY_GOVERNANCE_SIGNALS_PUBLIC

    ORDER BY
      COUNTRY ASC,
      SIGNAL_CATEGORY ASC,
      SIGNAL_TYPE ASC
    `
  );

  return rows;
}

export async function getCountryOrganizations(
  country: string
): Promise<CountryOrganizationRow[]> {
  const rows = await sfQuery<CountryOrganizationRow>(
    `
    SELECT
      COUNTRY AS "country",
      ENTITY_NAME AS "organizationName",

      TOTAL_PUBLIC_RECORDS AS "totalPublicRecords",

      ACTIVE_CERTIFICATIONS AS "activeCertifications",
      0 AS "expiredCertifications",

      0 AS "renewalDue30Days",
      0 AS "renewalDue90Days",

      LATEST_PUBLICATION_ACTIVITY
        AS "latestPublicationActivity"

    FROM CORE.V_COUNTRY_ORGANIZATIONS_PUBLIC

    WHERE TRIM(UPPER(COUNTRY)) = TRIM(UPPER(?))

    ORDER BY
      TOTAL_PUBLIC_RECORDS DESC,
      ENTITY_NAME ASC
    `,
    [country]
  );

  return rows;
}

export async function getCountryAiSystems(
  country: string
): Promise<CountryAiSystemRow[]> {
  const rows = await sfQuery<CountryAiSystemRow>(
    `
    SELECT
      COUNTRY AS "country",

      REGISTRY_ID AS "registryId",

      SYSTEM_NAME AS "systemName",
      SYSTEM_TYPE AS "systemType",
      INTENDED_USE AS "intendedUse",

      DEPLOYMENT_STATUS AS "deploymentStatus",
      OVERSIGHT_LEVEL AS "oversightLevel",

      CERTIFICATION_STATUS AS "certificationStatus",
      LIFECYCLE_STATUS AS "lifecycleStatus",
      RENEWAL_STATUS AS "renewalStatus",

      CERTIFIED_AT AS "certifiedAt",
      VALID_FROM AS "validFrom",
      VALID_TO AS "validTo"

    FROM CORE.V_COUNTRY_AI_SYSTEMS_PUBLIC

    WHERE TRIM(UPPER(COUNTRY)) = TRIM(UPPER(?))

    ORDER BY
      SYSTEM_NAME ASC,
      REGISTRY_ID ASC
    `,
    [country]
  );

  return rows;
}

export async function getCountryIntelligenceValidation(): Promise<
  CountryIntelligenceValidationRow | null
> {
  const rows = await sfQuery<CountryIntelligenceValidationRow>(
    `
    SELECT
      TOTAL_COUNTRIES AS "totalCountries",

      EMPTY_COUNTRY_VALUES
        AS "emptyCountryValues",

      NULL_PUBLIC_RECORD_COUNTS
        AS "nullPublicRecordCounts",

      NULL_AI_SYSTEM_COUNTS
        AS "nullAiSystemCounts"

    FROM CORE.V_COUNTRY_INTELLIGENCE_PUBLIC_VALIDATION

    LIMIT 1
    `
  );

  return rows[0] ?? null;
}