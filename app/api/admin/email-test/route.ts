import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendEmail } from "@/lib/email/mailer";

const COOKIE_NAME = "gafaig_admin";

function hasEnv(name: string): boolean {
  const v = process.env[name];
  return !!(v && String(v).trim().length > 0);
}

export async function POST(request: NextRequest) {
  try {
    // Admin auth check
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (cookie !== "1") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // SAFE diagnostics: shows presence only (no secrets)
    const envPresence = {
      SMTP_HOST: hasEnv("SMTP_HOST"),
      SMTP_PORT: hasEnv("SMTP_PORT"),
      SMTP_USER: hasEnv("SMTP_USER"),
      SMTP_PASS: hasEnv("SMTP_PASS"),
      SMTP_FROM: hasEnv("SMTP_FROM"),
    };

    // If missing, report exactly which key(s) Next sees as missing
    const missing = Object.entries(envPresence)
      .filter(([, ok]) => !ok)
      .map(([k]) => k);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "SMTP is not configured. One or more required env vars are missing at runtime.",
          missing,
          envPresence,
        },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const to = String(body?.to ?? "").trim();

    if (!to) {
      return NextResponse.json(
        { ok: false, error: "Missing 'to' email address", envPresence },
        { status: 400 }
      );
    }

    await sendEmail({
      to,
      subject: "GAFAIG Test Email",
      text: "This is a test email from the GAFAIG system.",
      html: "<p>This is a <strong>test email</strong> from the GAFAIG system.</p>",
    });

    return NextResponse.json({ ok: true, message: "Test email sent", envPresence });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to send test email" },
      { status: 500 }
    );
  }
}
