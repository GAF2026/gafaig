import crypto from "crypto";

export type Role =
  | "SUPER_ADMIN"
  | "REVIEWER"
  | "ORG_USER"
  | "PUBLIC"
  | "DEMO";

export type SessionMode =
  | "admin"
  | "applicant"
  | "demo";

export type Session = {
  sub: string;
  role: Role;
  mode?: SessionMode;

  organizationId?: string;
  organizationName?: string;
  email?: string;

  iat: number;
  exp: number;
};

export const SESSION_COOKIE_NAME =
  "gafaig_session";

function b64urlEncode(
  buf: Buffer,
): string {
  return buf
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function b64urlDecode(
  value: string,
): Buffer {
  const remainder =
    value.length % 4;

  const padding =
    remainder === 0
      ? ""
      : "=".repeat(4 - remainder);

  const base64 =
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/") +
    padding;

  return Buffer.from(
    base64,
    "base64",
  );
}

function hmacSHA256(
  secret: string,
  data: string,
): Buffer {
  return crypto
    .createHmac(
      "sha256",
      secret,
    )
    .update(data)
    .digest();
}

function getSecret(): string {
  const secret =
    String(
      process.env
        .GAFAIG_SESSION_SECRET ??
        "",
    ).trim();

  if (!secret) {
    throw new Error(
      "Missing env: GAFAIG_SESSION_SECRET",
    );
  }

  return secret;
}

function clean(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

export function signSession(
  session: Session,
): string {
  const secret =
    getSecret();

  const payload =
    b64urlEncode(
      Buffer.from(
        JSON.stringify(
          session,
        ),
        "utf8",
      ),
    );

  const signature =
    b64urlEncode(
      hmacSHA256(
        secret,
        payload,
      ),
    );

  return `${payload}.${signature}`;
}

export function verifySession(
  token: string,
): Session | null {
  try {
    const secret =
      getSecret();

    const [
      payload,
      signature,
    ] = token.split(".");

    if (
      !payload ||
      !signature
    ) {
      return null;
    }

    const expectedSignature =
      b64urlEncode(
        hmacSHA256(
          secret,
          payload,
        ),
      );

    const actualBuffer =
      Buffer.from(
        signature,
        "utf8",
      );

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8",
      );

    if (
      actualBuffer.length !==
      expectedBuffer.length
    ) {
      return null;
    }

    if (
      !crypto.timingSafeEqual(
        actualBuffer,
        expectedBuffer,
      )
    ) {
      return null;
    }

    const parsed =
      JSON.parse(
        b64urlDecode(
          payload,
        ).toString(
          "utf8",
        ),
      ) as Session;

    const now =
      Math.floor(
        Date.now() / 1000,
      );

    if (
      !clean(parsed?.sub) ||
      !clean(parsed?.role) ||
      !parsed?.iat ||
      !parsed?.exp
    ) {
      return null;
    }

    if (
      parsed.iat > now + 60
    ) {
      return null;
    }

    if (
      now >= parsed.exp
    ) {
      return null;
    }

    const validRoles:
      readonly Role[] = [
        "SUPER_ADMIN",
        "REVIEWER",
        "ORG_USER",
        "PUBLIC",
        "DEMO",
      ];

    if (
      !validRoles.includes(
        parsed.role,
      )
    ) {
      return null;
    }

    if (
      parsed.role ===
        "ORG_USER" &&
      (
        !clean(
          parsed.organizationId,
        ) ||
        !clean(
          parsed.organizationName,
        ) ||
        !clean(
          parsed.email,
        )
      )
    ) {
      return null;
    }

    return {
      ...parsed,

      sub:
        clean(parsed.sub),

      organizationId:
        clean(
          parsed.organizationId,
        ) || undefined,

      organizationName:
        clean(
          parsed.organizationName,
        ) || undefined,

      email:
        clean(parsed.email) ||
        undefined,
    };
  } catch {
    return null;
  }
}

export function buildSession(
  args: {
    sub: string;
    role: Role;
    mode?: SessionMode;
    organizationId?: string;
    organizationName?: string;
    email?: string;
    ttlSeconds?: number;
  },
): Session {
  const now =
    Math.floor(
      Date.now() / 1000,
    );

  const ttl =
    args.ttlSeconds ??
    60 * 60 * 8;

  return {
    sub:
      clean(args.sub),

    role:
      args.role,

    mode:
      args.mode,

    organizationId:
      clean(
        args.organizationId,
      ) || undefined,

    organizationName:
      clean(
        args.organizationName,
      ) || undefined,

    email:
      clean(args.email) ||
      undefined,

    iat:
      now,

    exp:
      now + ttl,
  };
}

export function roleAtLeast(
  role: Role,
  allowed: Role[],
): boolean {
  return allowed.includes(
    role,
  );
}