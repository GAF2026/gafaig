import { createPublicKey } from "crypto";
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

function getRawEd25519PublicKeyBase64(publicKeyPem: string): string {
  const key = createPublicKey(publicKeyPem);
  const jwk = key.export({ format: "jwk" }) as JsonWebKey;

  if (!jwk.x || typeof jwk.x !== "string") {
    throw new Error("Failed to export Ed25519 public key raw material");
  }

  return jwk.x;
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

    const publicKeySpkiBase64 = pemToBase64(publicKeyPem);
    const publicKeyRawBase64 = getRawEd25519PublicKeyBase64(publicKeyPem);

    return NextResponse.json(
      {
        ok: true,
        kid,
        alg: GAFAIG_VERIFY_ALG,
        publicKey: publicKeyPem,
        publicKeyPem,
        publicKeyBase64: publicKeyRawBase64,
        publicKeyRawBase64,
        publicKeySpkiBase64,
        jwk: {
          kty: "OKP",
          crv: "Ed25519",
          x: publicKeyRawBase64,
          use: "sig",
          kid,
          alg: "EdDSA",
        },
        kty: "OKP",
        crv: "Ed25519",
        x: publicKeyRawBase64,
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