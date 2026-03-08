export const REGISTRY_DECISION_STATUSES = {
  APPROVED: "approved",
  PENDING: "pending",
  REJECTED: "rejected",
  EXPIRED: "expired",
} as const;

export const REGISTRY_VERIFICATION_STATES = {
  VERIFIED: "verified",
  NOT_CURRENTLY_VALID: "not currently valid",
  VERIFICATION_ACTIVE: "verification active",
  VERIFICATION_UNAVAILABLE: "verification unavailable",
} as const;

export const REGISTRY_DEFAULTS = {
  EMPTY_VALUE: "—",
  PUBLIC_PAGE_SIZE: 20,
} as const;

export const REGISTRY_LABELS = {
  RECORD: "Registry record",
  ENTITY: "Entity",
  CERTIFICATION_OUTCOME: "Certification outcome",
  VERIFICATION_ENDPOINT: "Verification endpoint",
  AI_SYSTEMS_SECTION: "AI systems covered by this certification",
  PRIVACY_BOUNDARY: "Privacy boundary",
  VERIFIED_BY_GAFAIG: "Verified by GAFAIG",
} as const;