import { sfQuery } from "@/lib/snowflake";

export type ScoreDimension = {
  scoreDimension: string;
  scoreDimensionOrder: number | null;
  dimensionScore: number | null;
  dimensionMaxScore: number | null;
  dimensionContribution: number | null;
  avgComponentWeight: number | null;
  componentCount: number | null;
  dimensionScorePct: number | null;
  components: ScoreComponent[];
};

export type ScoreComponent = {
  scoreComponent: string | null;
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
  dimensions: ScoreDimension[];
};

type DimensionQueryRow = {
  REGISTRY_ID: unknown;
  APPLICATION_ID: unknown;
  CASE_ID: unknown;
  ENTITY_NAME: unknown;
  ENTITY_TYPE: unknown;
  COUNTRY: unknown;
  VERIFICATION_TYPE: unknown;
  MODEL_VERSION: unknown;
  CERTIFIED_SCORE: unknown;
  CERTIFIED_TIER: unknown;
  CERTIFIED_BAND: unknown;
  DECISION_STATUS: unknown;
  CERTIFIED_AT: unknown;
  VALID_FROM: unknown;
  VALID_TO: unknown;
  SCORE_DIMENSION: unknown;
  SCORE_DIMENSION_ORDER: unknown;
  DIMENSION_SCORE: unknown;
  DIMENSION_MAX_SCORE: unknown;
  DIMENSION_CONTRIBUTION: unknown;
  AVG_COMPONENT_WEIGHT: unknown;
  COMPONENT_COUNT: unknown;
  DIMENSION_SCORE_PCT: unknown;
};

type ComponentQueryRow = {
  REGISTRY_ID: unknown;
  SCORE_DIMENSION: unknown;
  SCORE_COMPONENT: unknown;
  SCORE_DIMENSION_ORDER: unknown;
  SCORE_COMPONENT_ORDER: unknown;
  COMPONENT_SCORE: unknown;
  COMPONENT_MAX_SCORE: unknown;
  COMPONENT_WEIGHT: unknown;
  COMPONENT_CONTRIBUTION: unknown;
  COMPONENT_SCORE_PCT: unknown;
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

function normalizeDimensionKey(value: string | null): string {
  return String(value || "")
    .normalize("NFKD")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function mapComponentRow(row: ComponentQueryRow): ScoreComponent {
  return {
    scoreComponent: asString(row.SCORE_COMPONENT),
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

  const dimensionRows = await sfQuery<DimensionQueryRow>(
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

  if (dimensionRows.length === 0) {
    return null;
  }

  const componentRows = await sfQuery<ComponentQueryRow>(
    `
    SELECT
      REGISTRY_ID,
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

  const seed = dimensionRows[0];
  const normalizedId = normalizeRegistryId(asString(seed.REGISTRY_ID) ?? "");

  const dimensions: ScoreDimension[] = dimensionRows.map((dimensionRow) => {
    const scoreDimension = asString(dimensionRow.SCORE_DIMENSION) ?? "";
    const dimensionKey = normalizeDimensionKey(scoreDimension);

    const components = componentRows
      .filter((componentRow) => {
        const componentRegistryId = normalizeRegistryId(
          asString(componentRow.REGISTRY_ID) ?? ""
        );
        const componentDimensionKey = normalizeDimensionKey(
          asString(componentRow.SCORE_DIMENSION)
        );

        return (
          componentRegistryId === normalizedId &&
          componentDimensionKey === dimensionKey
        );
      })
      .map(mapComponentRow);

    return {
      scoreDimension,
      scoreDimensionOrder: asNumber(dimensionRow.SCORE_DIMENSION_ORDER),
      dimensionScore: asNumber(dimensionRow.DIMENSION_SCORE),
      dimensionMaxScore: asNumber(dimensionRow.DIMENSION_MAX_SCORE),
      dimensionContribution: asNumber(dimensionRow.DIMENSION_CONTRIBUTION),
      avgComponentWeight: asNumber(dimensionRow.AVG_COMPONENT_WEIGHT),
      componentCount: asNumber(dimensionRow.COMPONENT_COUNT),
      dimensionScorePct: asNumber(dimensionRow.DIMENSION_SCORE_PCT),
      components,
    };
  });

  return {
    registryId: asString(seed.REGISTRY_ID) ?? "",
    applicationId: asString(seed.APPLICATION_ID),
    caseId: asString(seed.CASE_ID),
    entityName: asString(seed.ENTITY_NAME),
    entityType: asString(seed.ENTITY_TYPE),
    country: asString(seed.COUNTRY),
    verificationType: asString(seed.VERIFICATION_TYPE),
    modelVersion: asString(seed.MODEL_VERSION),
    certifiedScore: asNumber(seed.CERTIFIED_SCORE),
    certifiedTier: asString(seed.CERTIFIED_TIER),
    certifiedBand: asString(seed.CERTIFIED_BAND),
    decisionStatus: asString(seed.DECISION_STATUS),
    certifiedAt: asString(seed.CERTIFIED_AT),
    validFrom: asString(seed.VALID_FROM),
    validTo: asString(seed.VALID_TO),
    dimensions,
  };
}