import { sfQuery } from "@/lib/snowflake";

export type GovernanceSignal = {
  signalType: string;
  signalValue: number;
  signalDescription: string | null;
  lastActivityAt: string | null;
};

export type GovernanceObservabilitySummary = {
  totalPublicRecords: number;
  totalCertifiedRecords: number;
  totalActiveCertifications: number;
  totalExpiredCertifications: number;
  totalExpiring30Days: number;
  totalExpiring90Days: number;
  totalCertificationContinuity: number;
  totalActiveCountries: number;
  totalActiveOrganizations: number;
  lastPublicationActivity: string | null;
};

export type AiSystemObservabilitySummary = {
  totalPublicAiSystems: number;
  totalLinkedRegistryRecords: number;
  totalAiSystemCountries: number;
  totalAiSystemOrganizations: number;
  totalCertifiedAiSystems: number;
  totalActiveAiSystems: number;
  totalRenewalValidAiSystems: number;
  lastAiSystemCertificationActivity: string | null;
};

export type GovernanceSignalValidation = {
  totalSignals: number;
  emptySignalTypes: number;
  nullSignalValues: number;
  distinctSignalTypes: number;
};

function toNumber(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export async function getGovernanceSignals(): Promise<GovernanceSignal[]> {
  return sfQuery<GovernanceSignal>(`
    SELECT
      SIGNAL_TYPE AS "signalType",
      SIGNAL_VALUE AS "signalValue",
      SIGNAL_DESCRIPTION AS "signalDescription",
      LAST_ACTIVITY_AT AS "lastActivityAt"
    FROM CORE.V_GOVERNANCE_SIGNALS_PUBLIC
    ORDER BY SIGNAL_TYPE ASC
  `);
}

export async function getGovernanceObservabilitySummary(): Promise<GovernanceObservabilitySummary> {
  const rows = await sfQuery<{
    totalPublicRecords: number;
    totalCertifiedRecords: number;
    totalActiveCertifications: number;
    totalExpiredCertifications: number;
    totalExpiring30Days: number;
    totalExpiring90Days: number;
    totalCertificationContinuity: number;
    totalActiveCountries: number;
    totalActiveOrganizations: number;
    lastPublicationActivity: string | null;
  }>(`
    SELECT
      TOTAL_PUBLIC_RECORDS AS "totalPublicRecords",
      TOTAL_CERTIFIED_RECORDS AS "totalCertifiedRecords",
      TOTAL_ACTIVE_CERTIFICATIONS AS "totalActiveCertifications",
      TOTAL_EXPIRED_CERTIFICATIONS AS "totalExpiredCertifications",
      TOTAL_EXPIRING_30_DAYS AS "totalExpiring30Days",
      TOTAL_EXPIRING_90_DAYS AS "totalExpiring90Days",
      TOTAL_CERTIFICATION_CONTINUITY AS "totalCertificationContinuity",
      TOTAL_ACTIVE_COUNTRIES AS "totalActiveCountries",
      TOTAL_ACTIVE_ORGANIZATIONS AS "totalActiveOrganizations",
      LAST_PUBLICATION_ACTIVITY AS "lastPublicationActivity"
    FROM CORE.V_OBSERVABILITY_PUBLIC
    LIMIT 1
  `);

  const row = rows?.[0];

  return {
    totalPublicRecords: toNumber(row?.totalPublicRecords),
    totalCertifiedRecords: toNumber(row?.totalCertifiedRecords),
    totalActiveCertifications: toNumber(row?.totalActiveCertifications),
    totalExpiredCertifications: toNumber(row?.totalExpiredCertifications),
    totalExpiring30Days: toNumber(row?.totalExpiring30Days),
    totalExpiring90Days: toNumber(row?.totalExpiring90Days),
    totalCertificationContinuity: toNumber(row?.totalCertificationContinuity),
    totalActiveCountries: toNumber(row?.totalActiveCountries),
    totalActiveOrganizations: toNumber(row?.totalActiveOrganizations),
    lastPublicationActivity: row?.lastPublicationActivity ?? null,
  };
}

export async function getAiSystemObservabilitySummary(): Promise<AiSystemObservabilitySummary> {
  const rows = await sfQuery<{
    totalPublicAiSystems: number;
    totalLinkedRegistryRecords: number;
    totalAiSystemCountries: number;
    totalAiSystemOrganizations: number;
    totalCertifiedAiSystems: number;
    totalActiveAiSystems: number;
    totalRenewalValidAiSystems: number;
    lastAiSystemCertificationActivity: string | null;
  }>(`
    SELECT
      TOTAL_PUBLIC_AI_SYSTEMS AS "totalPublicAiSystems",
      TOTAL_LINKED_REGISTRY_RECORDS AS "totalLinkedRegistryRecords",
      TOTAL_AI_SYSTEM_COUNTRIES AS "totalAiSystemCountries",
      TOTAL_AI_SYSTEM_ORGANIZATIONS AS "totalAiSystemOrganizations",
      TOTAL_CERTIFIED_AI_SYSTEMS AS "totalCertifiedAiSystems",
      TOTAL_ACTIVE_AI_SYSTEMS AS "totalActiveAiSystems",
      TOTAL_RENEWAL_VALID_AI_SYSTEMS AS "totalRenewalValidAiSystems",
      LAST_AI_SYSTEM_CERTIFICATION_ACTIVITY AS "lastAiSystemCertificationActivity"
    FROM CORE.V_AI_SYSTEM_OBSERVABILITY_PUBLIC
    LIMIT 1
  `);

  const row = rows?.[0];

  return {
    totalPublicAiSystems: toNumber(row?.totalPublicAiSystems),
    totalLinkedRegistryRecords: toNumber(row?.totalLinkedRegistryRecords),
    totalAiSystemCountries: toNumber(row?.totalAiSystemCountries),
    totalAiSystemOrganizations: toNumber(row?.totalAiSystemOrganizations),
    totalCertifiedAiSystems: toNumber(row?.totalCertifiedAiSystems),
    totalActiveAiSystems: toNumber(row?.totalActiveAiSystems),
    totalRenewalValidAiSystems: toNumber(row?.totalRenewalValidAiSystems),
    lastAiSystemCertificationActivity:
      row?.lastAiSystemCertificationActivity ?? null,
  };
}

export async function getGovernanceSignalValidation(): Promise<GovernanceSignalValidation> {
  const rows = await sfQuery<{
    totalSignals: number;
    emptySignalTypes: number;
    nullSignalValues: number;
    distinctSignalTypes: number;
  }>(`
    SELECT
      TOTAL_SIGNALS AS "totalSignals",
      EMPTY_SIGNAL_TYPES AS "emptySignalTypes",
      NULL_SIGNAL_VALUES AS "nullSignalValues",
      DISTINCT_SIGNAL_TYPES AS "distinctSignalTypes"
    FROM CORE.V_GOVERNANCE_SIGNALS_PUBLIC_VALIDATION
    LIMIT 1
  `);

  const row = rows?.[0];

  return {
    totalSignals: toNumber(row?.totalSignals),
    emptySignalTypes: toNumber(row?.emptySignalTypes),
    nullSignalValues: toNumber(row?.nullSignalValues),
    distinctSignalTypes: toNumber(row?.distinctSignalTypes),
  };
}

export async function getGovernanceObservabilityData(): Promise<{
  signals: GovernanceSignal[];
  summary: GovernanceObservabilitySummary;
  aiSystems: AiSystemObservabilitySummary;
  validation: GovernanceSignalValidation;
}> {
  const [signals, summary, aiSystems, validation] = await Promise.all([
    getGovernanceSignals(),
    getGovernanceObservabilitySummary(),
    getAiSystemObservabilitySummary(),
    getGovernanceSignalValidation(),
  ]);

  return {
    signals,
    summary,
    aiSystems,
    validation,
  };
}