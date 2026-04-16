import { sfQuery } from "@/lib/snowflake";

export type RegistryAiSystemRow = {
  systemId: string;
  registryId: string | null;
  applicationId: string | null;
  caseId: string | null;
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
};

export async function getRegistryAiSystemsPaginated({
  page = 1,
  pageSize = 200,
}: {
  page?: number;
  pageSize?: number;
} = {}): Promise<{ rows: RegistryAiSystemRow[] }> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 200;
  const offset = (safePage - 1) * safePageSize;

  const rows = await sfQuery<any>(`
    SELECT
      sys.SYSTEM_ID,
      sys.REGISTRY_ID,
      sys.APPLICATION_ID,
      sys.CASE_ID,

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
      TO_VARCHAR(reg.VALID_TO) AS VALID_TO

    FROM CORE.REGISTRY_AI_SYSTEMS sys
    LEFT JOIN CORE.V_REGISTRY_PUBLIC reg
      ON sys.REGISTRY_ID = reg.REGISTRY_ID

    WHERE COALESCE(sys.IS_PUBLIC, TRUE) = TRUE

    ORDER BY
      COALESCE(reg.CERTIFIED_AT, TO_TIMESTAMP_NTZ('1970-01-01')) DESC,
      sys.SYSTEM_NAME ASC

    LIMIT ${safePageSize}
    OFFSET ${offset}
  `);

  return {
    rows: rows.map((r: any): RegistryAiSystemRow => ({
      systemId: r.SYSTEM_ID,
      registryId: r.REGISTRY_ID ?? null,
      applicationId: r.APPLICATION_ID ?? null,
      caseId: r.CASE_ID ?? null,
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
      humanReviewRequired:
        typeof r.HUMAN_REVIEW_REQUIRED === "boolean"
          ? r.HUMAN_REVIEW_REQUIRED
          : r.HUMAN_REVIEW_REQUIRED == null
          ? null
          : Boolean(r.HUMAN_REVIEW_REQUIRED),
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
    })),
  };
}