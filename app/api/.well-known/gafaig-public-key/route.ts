import { NextResponse } from "next/server";
import {
  getPublicKeyPem,
  getSigningKeyId,
  GAFAIG_VERIFY_ALG,
} from "@/lib/crypto/verify-signing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function pemToBase64(pem: string) {
  return pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function getCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "public, max-age=300, s-maxage=300",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(),
  });
}

export async function GET() {
  try {
    const publicKeyPem = getPublicKeyPem();
    const kid = getSigningKeyId();
    const publicKeyBase64 = pemToBase64(publicKeyPem);

    return NextResponse.json(
      {
        ok: true,
        kid,
        alg: GAFAIG_VERIFY_ALG,
        publicKey: publicKeyPem,
        publicKeyPem,
        publicKeyBase64,
        kty: "OKP",
        crv: "Ed25519",
        use: "sig",
      },
      {
        status: 200,
        headers: getCorsHeaders(),
      }
    );
  } catch (err) {
    console.error("PUBLIC KEY ERROR:", err);

    return NextResponse.json(
      {
        ok: false,
        error:
          err instanceof Error ? err.message : "Failed to load public key",
      },
      {
        status: 500,
        headers: {
          ...getCorsHeaders(),
          "Cache-Control": "no-store",
        },
      }
    );
  }
}