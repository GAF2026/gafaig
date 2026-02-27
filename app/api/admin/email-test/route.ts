import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";

export const dynamic = "force-dynamic";

function hasEnv(name: string): boolean {
  // TS-safe way to index process.env
  const v = ((process.env as unknown) as Record<string, string | undefined>)[name];
  return !!(v && v.trim().length > 0);
}

export async function GET(req: NextRequest) {
  // Admin-gated diagnostics endpoint
  const auth = await requireAdmin(req);
  if (!auth.ok) {
  return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
}

  // Keep this list aligned with whatever your email utility expects
  const required = [
    "GAFAIG_ADMIN_PASSWORD",
    "GAFAIG_SESSION_SECRET",
    // add/remove as needed:
    // "RESEND_API_KEY",
    // "SMTP_HOST",
    // "SMTP_USER",
    // "SMTP_PASS",
    // "EMAIL_FROM",
  ];

  const present = required.filter(hasEnv);
  const missing = required.filter((k) => !hasEnv(k));

  return NextResponse.json({
    ok: true,
    present,
    missing,
    notes: "This endpoint only checks env presence. It does not send email.",
  });
}