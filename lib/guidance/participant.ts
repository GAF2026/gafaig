import type { ApplicantSession } from "@/lib/applicant-auth";
import type { Role, Session } from "@/lib/auth/session";

import type { GuidanceParticipant } from "./types";

export type GuidanceRuntimeSession = ApplicantSession | Session;

export function isApplicantRuntimeSession(
  session: GuidanceRuntimeSession,
): session is ApplicantSession {
  return (
    "userId" in session &&
    "organizationId" in session &&
    "organizationName" in session
  );
}

export function isAdminRuntimeSession(
  session: GuidanceRuntimeSession,
): session is Session {
  return (
    "sub" in session &&
    "iat" in session &&
    "exp" in session
  );
}

/**
 * Maps an existing applicant runtime session to the canonical participant
 * classification used by Operational Guidance.
 *
 * This mapping is descriptive only. It creates no authority.
 */
export function mapApplicantSessionToGuidanceParticipant(
  session: ApplicantSession,
): GuidanceParticipant | null {
  const role = String(session.role ?? "").trim().toUpperCase();

  if (role === "ORG_ADMIN" || role === "ORG_USER") {
    return "APPLICANT";
  }

  return null;
}

/**
 * Maps existing signed-session roles conservatively.
 *
 * DEMO maps to the operations-reviewer classification rather than platform
 * administrator, preserving least privilege. Unsupported roles return null
 * and must fail closed.
 */
export function mapAdminRoleToGuidanceParticipant(
  role: Role,
): GuidanceParticipant | null {
  switch (role) {
    case "SUPER_ADMIN":
      return "PLATFORM_ADMINISTRATOR";
    case "REVIEWER":
    case "DEMO":
      return "GAFAIG_OPERATIONS_REVIEWER";
    case "ORG_USER":
      return "APPLICANT";
    case "PUBLIC":
      return null;
    default: {
      const exhaustiveCheck: never = role;
      return exhaustiveCheck;
    }
  }
}

export function mapRuntimeSessionToGuidanceParticipant(
  session: GuidanceRuntimeSession,
): GuidanceParticipant | null {
  if (isApplicantRuntimeSession(session)) {
    return mapApplicantSessionToGuidanceParticipant(session);
  }

  return mapAdminRoleToGuidanceParticipant(session.role);
}
