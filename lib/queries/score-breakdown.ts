import { sfQuery } from "@/lib/snowflake";

export type ScoreDimensionRow = {
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
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  scoreDimension: string | null;
  scoreDimensionOrder: number | null;
  dimensionScore: number | null;
  dimensionMaxScore: number | null;
  dimensionContribution: number | null;
  avgComponentWeight: number | null;
  componentCount: number | null;
  dimensionScorePct: number | null;
};

export type ScoreComponentRow = {
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
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  scoreDimension: string | null;
  scoreComponent: string | null;
  scoreDimensionOrder: number | null;
  scoreComponentOrder: number | null;
  componentScore: number | null;
  componentMaxScore: number | null;
  componentWeight: number | null;
  componentContribution: number | null;
  componentScorePct: number | null;
};

export type RegistryScoreBreakdown = {
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
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  dimensions: Array<
    ScoreDimensionRow & {
      components: ScoreComponentRow[];
    }
  >;
  components: ScoreComponentRow[];
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeRegistryId(value: string): string {
  return String(value || "")
    .normalize("NFKD")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeDimensionRow(
  row: Record<string, unknown>
): ScoreDimensionRow {
  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),
    verificationType: asString(row.VERIFICATION_TYPE),
    modelVersion: asString(row.MODEL_VERSION),
    certifiedScore: asNumber(row.CERTIFIED_SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),
    decisionStatus: asString(row.DECISION_STATUS),
    certifiedAt: asString(row.CERTIFIED_AT),
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),
    scoreDimension: asString(row.SCORE_DIMENSION),
    scoreDimensionOrder: asNumber(row.SCORE_DIMENSION_ORDER),
    dimensionScore: asNumber(row.DIMENSION_SCORE),
    dimensionMaxScore: asNumber(row.DIMENSION_MAX_SCORE),
    dimensionContribution: asNumber(row.DIMENSION_CONTRIBUTION),
    avgComponentWeight: asNumber(row.AVG_COMPONENT_WEIGHT),
    componentCount: asNumber(row.COMPONENT_COUNT),
    dimensionScorePct: asNumber(row.DIMENSION_SCORE_PCT),
  };
}

function normalizeComponentRow(
  row: Record<string, unknown>
): ScoreComponentRow {
  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    entityType: asString(row.ENTITY_TYPE),
    country: asString(row.COUNTRY),
    verificationType: asString(row.VERIFICATION_TYPE),
    modelVersion: asString(row.MODEL_VERSION),
    certifiedScore: asNumber(row.CERTIFIED_SCORE),
    certifiedTier: asString(row.CERTIFIED_TIER),
    certifiedBand: asString(row.CERTIFIED_BAND),
    decisionStatus: asString(row.DECISION_STATUS),
    certifiedAt: asString(row.CERTIFIED_AT),
    validFrom: asString(row.VALID_FROM),
    validTo: asString(row.VALID_TO),
    scoreDimension: asString(row.SCORE_DIMENSION),
    scoreComponent: asString(row.SCORE_COMPONENT),
    scoreDimensionOrder: asNumber(row.SCORE_DIMENSION_ORDER),
    scoreComponentOrder: asNumber(row.SCORE_COMPONENT_ORDER),
    componentScore: asNumber(row.COMPONENT_SCORE),
    componentMaxScore: asNumber(row.COMPONENT_MAX_SCORE),
    componentWeight: asNumber(row.COMPONENT_WEIGHT),
    componentContribution: asNumber(row.COMPONENT_CONTRIBUTION),
    componentScorePct: asNumber(row.COMPONENT_SCORE_PCT),
  };
}

export async function getRegistryScoreBreakdownByRegistryId(
  registryId: string
): Promise<RegistryScoreBreakdown | null> {
  const id = String(registryId || "").trim();
  if (!id) return null;

  const dimensionRowsRaw = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      REGISTRY_ID,
      APPLICATION_ID,
      CASE_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      VERIFICATION_TYPE,
      MODEL_VERSION,
      CERTIFIED_SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      CERTIFIED_AT,
      VALID_FROM,
      VALID_TO,
      SCORE_DIMENSION,
      SCORE_DIMENSION_ORDER,
      DIMENSION_SCORE,
      DIMENSION_MAX_SCORE,
      DIMENSION_CONTRIBUTION,
      AVG_COMPONENT_WEIGHT,
      COMPONENT_COUNT,
      DIMENSION_SCORE_PCT
    FROM CORE.V_SCORE_DIMENSIONS_PUBLIC
    WHERE UPPER(REGEXP_REPLACE(REGISTRY_ID, '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    ORDER BY
      COALESCE(SCORE_DIMENSION_ORDER, 999999),
      SCORE_DIMENSION
    `,
    [id]
  );

  const componentRowsRaw = await sfQuery<Record<string, unknown>>(
    `
    SELECT
      REGISTRY_ID,
      APPLICATION_ID,
      CASE_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      VERIFICATION_TYPE,
      MODEL_VERSION,
      CERTIFIED_SCORE,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      DECISION_STATUS,
      CERTIFIED_AT,
      VALID_FROM,
      VALID_TO,
      SCORE_DIMENSION,
      SCORE_COMPONENT,
      SCORE_DIMENSION_ORDER,
      SCORE_COMPONENT_ORDER,
      COMPONENT_SCORE,
      COMPONENT_MAX_SCORE,
      COMPONENT_WEIGHT,
      COMPONENT_CONTRIBUTION,
      COMPONENT_SCORE_PCT
    FROM CORE.V_SCORE_BREAKDOWN_PUBLIC
    WHERE UPPER(REGEXP_REPLACE(REGISTRY_ID, '[^A-Za-z0-9]', '')) =
          UPPER(REGEXP_REPLACE(?, '[^A-Za-z0-9]', ''))
    ORDER BY
      COALESCE(SCORE_DIMENSION_ORDER, 999999),
      SCORE_DIMENSION,
      COALESCE(SCORE_COMPONENT_ORDER, 999999),
      SCORE_COMPONENT
    `,
    [id]
  );

  const dimensions = dimensionRowsRaw.map(normalizeDimensionRow);
  const components = componentRowsRaw.map(normalizeComponentRow);

  if (dimensions.length === 0 && components.length === 0) {
    return null;
  }

  const seed = dimensions[0] ?? components[0];
  if (!seed) return null;

  const normalizedId = normalizeRegistryId(seed.registryId);

  const dimensionsWithComponents = dimensions.map((dimension) => {
    const dimensionKey = normalizeRegistryId(dimension.scoreDimension ?? "");

    const groupedComponents = components.filter((component) => {
      return (
        normalizeRegistryId(component.registryId) === normalizedId &&
        normalizeRegistryId(component.scoreDimension ?? "") === dimensionKey
      );
    });

    return {
      ...dimension,
      components: groupedComponents,
    };
  });

  return {
    registryId: seed.registryId,
    applicationId: seed.applicationId,
    caseId: seed.caseId,
    entityName: seed.entityName,
    entityType: seed.entityType,
    country: seed.country,
    verificationType: seed.verificationType,
    modelVersion: seed.modelVersion,
    certifiedScore: seed.certifiedScore,
    certifiedTier: seed.certifiedTier,
    certifiedBand: seed.certifiedBand,
    decisionStatus: seed.decisionStatus,
    certifiedAt: seed.certifiedAt,
    validFrom: seed.validFrom,
    validTo: seed.validTo,
    dimensions: dimensionsWithComponents,
    components,
  };
}