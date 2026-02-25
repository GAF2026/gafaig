// lib/auth/session.ts
import crypto from "crypto";

export type Role = "SUPER_ADMIN" | "REVIEWER" | "ORG_USER" | "PUBLIC" | "DEMO";

export type Session = {
  sub: string; // subject (user id)
  role: Role;
  mode?: "admin" | "demo";
  iat: number; // issued at (unix seconds)
  exp: number; // expiry (unix seconds)
};

export const SESSION_COOKIE_NAME = "gafaig_session";

function b64urlEncode(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlDecode(s: string) {
  const pad = 4 - (s.length % 4 || 4);
  const base64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  return Buffer.from(base64, "base64");
}

function hmacSHA256(secret: string, data: string) {
  return crypto.createHmac("sha256", secret).update(data).digest();
}

function getSecret() {
  const secret = String(process.env.GAFAIG_SESSION_SECRET ?? "").trim();
  if (!secret) throw new Error("Missing env: GAFAIG_SESSION_SECRET");
  return secret;
}

export function signSession(session: Session) {
  const secret = getSecret();
  const payload = b64urlEncode(Buffer.from(JSON.stringify(session), "utf8"));
  const sig = b64urlEncode(hmacSHA256(secret, payload));
  return `${payload}.${sig}`;
}

export function verifySession(token: string): Session | null {
  try {
    const secret = getSecret();
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;

    const expectedSig = b64urlEncode(hmacSHA256(secret, payload));
    // constant-time compare
    const a = Buffer.from(sig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length) return null;
    if (!crypto.timingSafeEqual(a, b)) return null;

    const session = JSON.parse(b64urlDecode(payload).toString("utf8")) as Session;
    const now = Math.floor(Date.now() / 1000);

    if (!session?.sub || !session?.role || !session?.exp) return null;
    if (now >= session.exp) return null;

    return session;
  } catch {
    return null;
  }
}

export function buildSession(args: { sub: string; role: Role; mode?: "admin" | "demo"; ttlSeconds?: number }): Session {
  const now = Math.floor(Date.now() / 1000);
  const ttl = args.ttlSeconds ?? 60 * 60 * 8; // default: 8 hours
  return {
    sub: args.sub,
    role: args.role,
    mode: args.mode,
    iat: now,
    exp: now + ttl,
  };
}

export function roleAtLeast(role: Role, allowed: Role[]) {
  return allowed.includes(role);
}