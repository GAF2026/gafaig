import { sfQuery } from "@/lib/snowflake";

export type ExplorerSystemRow = {
  systemId: string;
  systemName: string;
  systemType: string;
  intendedUse: string;

  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;

  developerOrganization: string | null;
  country: string | null;

  registryId: string;
  entityName: string;

  certificationStatus: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  lifecycleStatus: string | null;
};

export async function getExplorerSystems(): Promise<ExplorerSystemRow[]> {
  const rows = await sfQuery<any>(`
    SELECT
      s.SYSTEM_ID,
      s.SYSTEM_NAME,
      s.SYSTEM_TYPE,
      s.INTENDED_USE,

      s.DEPLOYMENT_STATUS,
      s.OVERSIGHT_LEVEL,
      s.RISK_TIER,

      s.DEVELOPER_ORGANIZATION,
      s.COUNTRY,

      s.REGISTRY_ID,
      s.ENTITY_NAME,

      s.CERTIFICATION_STATUS,
      s.CERTIFIED_TIER,
      s.CERTIFIED_BAND,
      s.DECISION_STATUS,
      s.LIFECYCLE_STATUS

    FROM CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC s
    WHERE s.REGISTRY_ID IS NOT NULL
      AND s.REGISTRY_ID LIKE 'GAFAIG-%'
    ORDER BY
      COALESCE(s.DISPLAY_ORDER, 999999) ASC,
      s.SYSTEM_NAME ASC,
      s.SYSTEM_ID ASC
  `);

  return rows.map((r) => ({
    systemId: r.SYSTEM_ID,
    systemName: r.SYSTEM_NAME,
    systemType: r.SYSTEM_TYPE,
    intendedUse: r.INTENDED_USE,

    deploymentStatus: r.DEPLOYMENT_STATUS,
    oversightLevel: r.OVERSIGHT_LEVEL,
    riskTier: r.RISK_TIER,

    developerOrganization: r.DEVELOPER_ORGANIZATION,
    country: r.COUNTRY,

    registryId: r.REGISTRY_ID,
    entityName: r.ENTITY_NAME,

    certificationStatus: r.CERTIFICATION_STATUS,
    certifiedTier: r.CERTIFIED_TIER,
    certifiedBand: r.CERTIFIED_BAND,
    decisionStatus: r.DECISION_STATUS,
    lifecycleStatus: r.LIFECYCLE_STATUS,
  }));
}