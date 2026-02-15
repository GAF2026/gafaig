import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sendEmail, isEmailConfigured } from "@/lib/email/mailer";

const COOKIE_NAME = "gafaig_admin";

export async function POST(request: NextRequest) {
  try {
    // Admin auth check
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (cookie !== "1") {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!isEmailConfigured()) {
      return NextResponse.json({
        ok: false,
        error: "SMTP is not configured. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM in .env.local"
      }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const to = String(body?.to ?? "").trim();

    if (!to) {
      return NextResponse.json({ ok: false, error: "Missing 'to' email address" }, { status: 400 });
    }

    await sendEmail({
      to,
      subject: "GAFAIG Test Email",
      text: "This is a test email from the GAFAIG system.",
      html: "<p>This is a <strong>test email</strong> from the GAFAIG system.</p>"
    });

    return NextResponse.json({ ok: true, message: "Test email sent" });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to send test email" },
      { status: 500 }
    );
  }
}
