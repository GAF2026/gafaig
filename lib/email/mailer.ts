import nodemailer from "nodemailer";

type MailSendArgs = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

function env(name: string) {
  return (process.env[name] ?? "").trim();
}

export function isEmailConfigured() {
  return (
    env("SMTP_HOST").length > 0 &&
    env("SMTP_PORT").length > 0 &&
    env("SMTP_USER").length > 0 &&
    env("SMTP_PASS").length > 0 &&
    env("SMTP_FROM").length > 0
  );
}

function makeTransport() {
  const host = env("SMTP_HOST");
  const port = Number(env("SMTP_PORT") || "587");
  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },

    // DEV ONLY: bypass TLS validation (fixes "self-signed certificate in certificate chain")
    tls: { rejectUnauthorized: false },
  });
}

export async function sendEmail(args: MailSendArgs) {
  if (!isEmailConfigured()) throw new Error("SMTP is not configured.");

  const transporter = makeTransport();
  const from = env("SMTP_FROM");

  return transporter.sendMail({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
  });
}
