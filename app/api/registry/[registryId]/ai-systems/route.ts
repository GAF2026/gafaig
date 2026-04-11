import { NextResponse } from "next/server";
import { getRegistryAiSystemsByRegistryId } from "@/lib/queries/registry-ai-systems";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: { registryId: string } }
) {
  try {
    const registryId = (ctx?.params?.registryId || "").trim();

    if (!registryId) {
      return NextResponse.json(
        { ok: false, error: "Missing registryId" },
        { status: 400 }
      );
    }

    const rows = await getRegistryAiSystemsByRegistryId(registryId, 200);

    return NextResponse.json({
      ok: true,
      rows,
      total: rows.length,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to load registry AI systems.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}