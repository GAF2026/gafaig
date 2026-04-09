import { NextResponse } from "next/server";
import { getRegistryScoreBreakdownByRegistryId } from "@/lib/queries/score-breakdown";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        dimensionCount: result.dimensions.length,
        componentCount: result.components.length,
        dimensions: result.dimensions,
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