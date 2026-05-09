import { sfQuery } from "@/lib/snowflake";

export type OrganizationIntelligenceRow = {
  organizationName: string;
  country: string;

  totalPublicRecords: number;
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

export type OrganizationGovernanceSignalRow = {
  organizationName: string;
  country: string;

  signalType: string;
  signalValue: number;

  signalDescription: string;
  signalCategory: string;

  lastActivityAt: string | null;
};

export type OrganizationCertificationRecordRow = {
  organizationName: string;
  country: string;

  registryId: string;
  registrySnapshotId: string | null;

  certificationStatus: string | null;
  visibilityStatus: string | null;

  certifiedAt: string | null;
  publishedAt: string | null;

  validFrom: string | null;
  validTo: string | null;

  lifecycleStatus: string | null;
  renewalStatus: string | null;

  isCurrentlyActive: boolean | string | null;
  isExpired: boolean | string | null;
  daysUntilExpiration: number | null;
  lifecycleWindow: string | null;
  certificationContinuityActive: boolean | string | null;
};

export type OrganizationAiSystemRow = {
  organizationName: string;
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

export type OrganizationIntelligenceValidationRow = {
  totalOrganizations: number;
  emptyOrganizationValues: number;
  nullPublicRecordCounts: number;
  nullAiSystemCounts: number;
};

export async function getOrganizationIntelligence(): Promise<
  OrganizationIntelligenceRow[]
> {
  return sfQuery<OrganizationIntelligenceRow>(`
    SELECT
      ORGANIZATION_NAME AS "organizationName",
      COUNTRY AS "country",

      TOTAL_PUBLIC_RECORDS AS "totalPublicRecords",

      TOTAL_AI_SYSTEMS AS "totalAiSystems",
      CERTIFIED_AI_SYSTEMS AS "certifiedAiSystems",
      ACTIVE_AI_SYSTEMS AS "activeAiSystems",

      ACTIVE_CERTIFICATIONS AS "activeCertifications",
      EXPIRED_CERTIFICATIONS AS "expiredCertifications",

      RENEWAL_DUE_30_DAYS AS "renewalDue30Days",
      RENEWAL_DUE_90_DAYS AS "renewalDue90Days",

      EXPIRING_30_DAYS AS "expiring30Days",
      EXPIRING_90_DAYS AS "expiring90Days",

      CERTIFICATION_CONTINUITY_RECORDS AS "certificationContinuityRecords",

      FIRST_PUBLICATION_ACTIVITY AS "firstPublicationActivity",
      LATEST_PUBLICATION_ACTIVITY AS "latestPublicationActivity"
    FROM CORE.V_ORGANIZATION_INTELLIGENCE_PUBLIC
    ORDER BY TOTAL_PUBLIC_RECORDS DESC, ORGANIZATION_NAME ASC, COUNTRY ASC
  `);
}

export async function getOrganizationGovernanceSignals(
  organizationName: string
): Promise<OrganizationGovernanceSignalRow[]> {
  return sfQuery<OrganizationGovernanceSignalRow>(
    `
    SELECT
      ORGANIZATION_NAME AS "organizationName",
      COUNTRY AS "country",

      SIGNAL_TYPE AS "signalType",
      SIGNAL_VALUE AS "signalValue",

      SIGNAL_DESCRIPTION AS "signalDescription",
      SIGNAL_CATEGORY AS "signalCategory",

      LAST_ACTIVITY_AT AS "lastActivityAt"
    FROM CORE.V_ORGANIZATION_GOVERNANCE_SIGNALS_PUBLIC
    WHERE TRIM(UPPER(ORGANIZATION_NAME)) = TRIM(UPPER(?))
    ORDER BY SIGNAL_CATEGORY ASC, SIGNAL_TYPE ASC, COUNTRY ASC
    `,
    [organizationName]
  );
}

export async function getOrganizationCertificationRecords(
  organizationName: string
): Promise<OrganizationCertificationRecordRow[]> {
  return sfQuery<OrganizationCertificationRecordRow>(
    `
    SELECT
      ORGANIZATION_NAME AS "organizationName",
      COUNTRY AS "country",

      REGISTRY_ID AS "registryId",
      REGISTRY_SNAPSHOT_ID AS "registrySnapshotId",

      CERTIFICATION_STATUS AS "certificationStatus",
      VISIBILITY_STATUS AS "visibilityStatus",

      CERTIFIED_AT AS "certifiedAt",
      PUBLISHED_AT AS "publishedAt",

      VALID_FROM AS "validFrom",
      VALID_TO AS "validTo",

      LIFECYCLE_STATUS AS "lifecycleStatus",
      RENEWAL_STATUS AS "renewalStatus",

      IS_CURRENTLY_ACTIVE AS "isCurrentlyActive",
      IS_EXPIRED AS "isExpired",
      DAYS_UNTIL_EXPIRATION AS "daysUntilExpiration",
      LIFECYCLE_WINDOW AS "lifecycleWindow",
      CERTIFICATION_CONTINUITY_ACTIVE AS "certificationContinuityActive"
    FROM CORE.V_ORGANIZATION_CERTIFICATION_RECORDS_PUBLIC
    WHERE TRIM(UPPER(ORGANIZATION_NAME)) = TRIM(UPPER(?))
    ORDER BY PUBLISHED_AT DESC, REGISTRY_ID ASC
    `,
    [organizationName]
  );
}

export async function getOrganizationAiSystems(
  organizationName: string
): Promise<OrganizationAiSystemRow[]> {
  return sfQuery<OrganizationAiSystemRow>(
    `
    SELECT
      ORGANIZATION_NAME AS "organizationName",
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
    FROM CORE.V_ORGANIZATION_AI_SYSTEMS_PUBLIC
    WHERE TRIM(UPPER(ORGANIZATION_NAME)) = TRIM(UPPER(?))
    ORDER BY SYSTEM_NAME ASC, REGISTRY_ID ASC
    `,
    [organizationName]
  );
}

export async function getOrganizationIntelligenceValidation(): Promise<
  OrganizationIntelligenceValidationRow | null
> {
  const rows = await sfQuery<OrganizationIntelligenceValidationRow>(`
    SELECT
      TOTAL_ORGANIZATIONS AS "totalOrganizations",
      EMPTY_ORGANIZATION_VALUES AS "emptyOrganizationValues",
      NULL_PUBLIC_RECORD_COUNTS AS "nullPublicRecordCounts",
      NULL_AI_SYSTEM_COUNTS AS "nullAiSystemCounts"
    FROM CORE.V_ORGANIZATION_INTELLIGENCE_PUBLIC_VALIDATION
    LIMIT 1
  `);

  return rows[0] ?? null;
}