import { NextResponse } from "next/server";

export const runtime = "nodejs";

type JsonInit = ResponseInit & {
  headers?: Record<string, string>;
};

function json(data: unknown, init: JsonInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init.headers || {}),
    },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;

    // If this endpoint is meant to be “public participant by slug”
    // but Snowflake isn’t configured, return a controlled response.
    if (!process.env.SNOWFLAKE_QUERY_ENDPOINT) {
      return json(
        {
          ok: false,
          error: "Participant endpoint is not configured (Snowflake not connected).",
          slug,
        },
        { status: 501 }
      );
    }

    // If you already have logic here (Snowflake lookup), keep it.
    // For now, this is a placeholder that won’t break build/typecheck.
    return json({ ok: true, slug });
  } catch (e: unknown) {
    const msg =
      e && typeof e === "object" && "message" in e
        ? String((e as any).message)
        : "Unknown error";
    return json({ ok: false, error: msg }, { status: 500 });
  }
}