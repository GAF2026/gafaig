import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function normalizePublicKey(raw: string) {
  return raw
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "")
    .trim();
}

export async function GET() {
  try {
    const publicKeyPem = process.env.GAFAIG_VERIFY_PUBLIC_KEY_PEM?.trim() || "";
    const kid = process.env.GAFAIG_VERIFY_KID?.trim() || "gafaig-ed25519-1";

    if (!publicKeyPem) {
      return NextResponse.json(
        {
          ok: false,
          error: "GAFAIG_VERIFY_PUBLIC_KEY_PEM is not configured",
        },
        { status: 500 }
      );
    }

    const publicKeyBase64 = normalizePublicKey(publicKeyPem);

    return NextResponse.json(
      {
        ok: true,
        kty: "OKP",
        crv: "Ed25519",
        use: "sig",
        alg: "EdDSA",
        kid,
        publicKeyPem,
        publicKeyBase64,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=300",
        },
      }
    );
  } catch (err) {
    console.error("PUBLIC KEY ERROR:", err);

    return NextResponse.json(
      {
        ok: false,
        error: "Failed to load public key",
      },
      { status: 500 }
    );
  }
}