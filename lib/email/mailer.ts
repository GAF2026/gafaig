// lib/email/mailer.ts
/**
 * GAFAIG mail helper.
 * - Strict TS safe (no process.env[string] without casting)
 * - Exports expected by the app: sendEmail, isEmailConfigured
 *
 * NOTE: This uses nodemailer if available. If you haven't installed it,
 * we fail gracefully with a controlled error.
 */

type EmailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

function env(name: string): string {
  const e = (process.env as unknown) as Record<string, string | undefined>;
  return (e[name] ?? "").trim();
}

export function isEmailConfigured(): boolean {
  return (
    !!env("EMAIL_HOST") &&
    !!env("EMAIL_PORT") &&
    !!env("EMAIL_USER") &&
    !!env("EMAIL_PASS") &&
    !!env("EMAIL_FROM")
  );
}

function getEmailConfig() {
  return {
    host: env("EMAIL_HOST"),
    port: Number(env("EMAIL_PORT") || "0"),
    user: env("EMAIL_USER"),
    pass: env("EMAIL_PASS"),
    from: env("EMAIL_FROM"),
  };
}

export async function sendEmail(input: EmailInput): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isEmailConfigured()) {
    return { ok: false, error: "Email is not configured (missing EMAIL_* env vars)." };
  }

  const cfg = getEmailConfig();

  // Dynamically import so build won't fail if nodemailer isn't installed.
  let nodemailer: any;
  try {
    nodemailer = await import("nodemailer");
  } catch {
    return { ok: false, error: "nodemailer is not installed. Install it or disable email sending." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465, // common default
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
    });

    await transporter.sendMail({
      from: cfg.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? String(e) };
  }
}