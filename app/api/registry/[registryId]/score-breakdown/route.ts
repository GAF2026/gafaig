import { NextResponse } from "next/server";
import { getRegistryScoreBreakdownByRegistryId } from "@/lib/queries/score-breakdown";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RawComponent = {
  scoreComponent?: string | null;
  scoreComponentOrder?: number | null;
  componentScore?: number | null;
  componentMaxScore?: number | null;
  componentWeight?: number | null;
  componentContribution?: number | null;
  componentScorePct?: number | null;
};

type RawDimension = {
  scoreDimension?: string | null;
  scoreDimensionOrder?: number | null;
  dimensionScore?: number | null;
  dimensionMaxScore?: number | null;
  dimensionContribution?: number | null;
  avgComponentWeight?: number | null;
  componentCount?: number | null;
  dimensionScorePct?: number | null;
  components?: RawComponent[] | null;
};

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function sanitizeComponent(component: RawComponent) {
  return {
    scoreComponent: String(component.scoreComponent ?? "").trim(),
    scoreComponentOrder:
      component.scoreComponentOrder == null
        ? null
        : toNumber(component.scoreComponentOrder, 0),
    componentScore: toNumber(component.componentScore, 0),
    componentMaxScore: toNumber(component.componentMaxScore, 0),
    componentWeight: toNumber(component.componentWeight, 0),
    componentContribution: toNumber(component.componentContribution, 0),
    componentScorePct: toNumber(component.componentScorePct, 0),
  };
}

function sanitizeDimension(dimension: RawDimension) {
  const components = Array.isArray(dimension.components)
    ? dimension.components.map(sanitizeComponent)
    : [];

  return {
    scoreDimension: String(dimension.scoreDimension ?? "").trim(),
    scoreDimensionOrder:
      dimension.scoreDimensionOrder == null
        ? null
        : toNumber(dimension.scoreDimensionOrder, 0),
    dimensionScore: toNumber(dimension.dimensionScore, 0),
    dimensionMaxScore: toNumber(dimension.dimensionMaxScore, 0),
    dimensionContribution: toNumber(dimension.dimensionContribution, 0),
    avgComponentWeight: toNumber(dimension.avgComponentWeight, 0),
    componentCount: toNumber(dimension.componentCount, components.length),
    dimensionScorePct: toNumber(dimension.dimensionScorePct, 0),
    components,
  };
}

export async function GET(
  _req: Request,
  { params }: { params: { registryId: string } }
) {
  try {
    const registryId = String(params.registryId || "").trim();

    if (!registryId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing registryId",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const result = await getRegistryScoreBreakdownByRegistryId(registryId);

    if (!result) {
      return NextResponse.json(
        {
          ok: false,
          error: "Score breakdown not found",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    const dimensions = Array.isArray(result.dimensions)
      ? result.dimensions.map(sanitizeDimension)
      : [];

    const totalComponentCount = dimensions.reduce(
      (sum, dimension) => sum + dimension.components.length,
      0
    );

    return NextResponse.json(
      {
        ok: true,
        registryId: result.registryId,
        caseId: result.caseId,
        applicationId: result.applicationId,
        entityName: result.entityName,
        entityType: result.entityType,
        country: result.country,
        verificationType: result.verificationType,
        modelVersion: result.modelVersion,
        certifiedScore: result.certifiedScore,
        certifiedTier: result.certifiedTier,
        certifiedBand: result.certifiedBand,
        decisionStatus: result.decisionStatus,
        certifiedAt: result.certifiedAt,
        validFrom: result.validFrom,
        validTo: result.validTo,
        dimensionCount: dimensions.length,
        componentCount: totalComponentCount,
        dimensions,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Score breakdown endpoint failed.",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}