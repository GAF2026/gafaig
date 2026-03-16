/**
 * GAFAIG platform contracts
 *
 * Purpose:
 * A single machine-readable source of truth for route params, API paths,
 * Snowflake object names, public/private boundaries, and canonical ID rules.
 *
 * Why this file matters:
 * - reduces AI-assisted coding drift
 * - prevents route/path inconsistencies
 * - prevents accidental use of the wrong Snowflake view/table
 * - makes public vs private data boundaries explicit
 * - gives every new page/API route one canonical place to anchor against
 *
 * Rule:
 * When adding or changing any GAFAIG route, API endpoint, Snowflake source,
 * registry record shape, or ID pattern, update this file first.
 */

export const GAFAIG_PLATFORM_CONTRACT_VERSION = "2026-03-15.surface-engine";

/* -------------------------------------------------------------------------- */
/*                                    IDS                                     */
/* -------------------------------------------------------------------------- */

export const ID_PATTERNS = {
  registryId: /^GAFAIG-\d{8}$/i,
  caseId: /^CASE-\d{4,}$/i,
  requestId: /^REQ-[A-Z0-9-]+$/i,
  systemId: /^SYS-[A-Z0-9-]+$/i,
  applicationId: /^APP-[A-Z0-9-]+$/i,
} as const;

export type CanonicalIdType =
  | "registryId"
  | "caseId"
  | "requestId"
  | "systemId"
  | "applicationId";

export function normalizeId(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

export function isCanonicalId(
  type: CanonicalIdType,
  value: unknown
): boolean {
  return ID_PATTERNS[type].test(normalizeId(value));
}

export function assertCanonicalId(
  type: CanonicalIdType,
  value: unknown
): string {
  const normalized = normalizeId(value);

  if (!isCanonicalId(type, normalized)) {
    throw new Error(`Invalid ${type}: ${normalized || "(empty)"}`);
  }

  return normalized;
}

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

export const ROUTES = {
  public: {
    home: "/",
    mission: "/mission",
    framework: "/framework",
    governance: "/governance",
    maturity: "/maturity",
    registryHome: "/registry",
    registryAiSystems: "/registry/ai-systems",
    registryRecord: (registryId: string) =>
      `/registry/${encodeURIComponent(assertCanonicalId("registryId", registryId))}`,
    registryAiSystemRecord: (registryId: string) =>
      `/registry/ai-systems/${encodeURIComponent(
        assertCanonicalId("registryId", registryId)
      )}`,
    organizationRecord: (registryId: string) =>
      `/organizations/${encodeURIComponent(assertCanonicalId("registryId", registryId))}`,
  },

  api: {
    publicRegistry: "/api/registry",
    publicRegistrySearch: "/api/registry/search",
    verifyRegistry: (registryId: string) =>
      `/api/verify/${encodeURIComponent(assertCanonicalId("registryId", registryId))}`,
    adminPublish: "/api/admin/publish",
  },

  admin: {
    login: "/admin/login",
    applications: "/admin/applications",
    submissions: "/admin/submissions",
    participants: "/admin/participants",
    verificationCaseScore: (caseId: string) =>
      `/admin/verification/${encodeURIComponent(assertCanonicalId("caseId", caseId))}/score`,
    verificationCaseEvidence: (caseId: string) =>
      `/admin/verification/${encodeURIComponent(assertCanonicalId("caseId", caseId))}/evidence`,
    verificationCaseFindings: (caseId: string) =>
      `/admin/verification/${encodeURIComponent(assertCanonicalId("caseId", caseId))}/findings`,
    verificationCaseSummaries: (caseId: string) =>
      `/api/admin/verification/${encodeURIComponent(assertCanonicalId("caseId", caseId))}/summaries`,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                              SNOWFLAKE OBJECTS                             */
/* -------------------------------------------------------------------------- */

export const SNOWFLAKE = {
  database: "GAFAIG_DB",
  schema: "CORE",

  views: {
    publicRegistry: "GAFAIG_DB.CORE.V_REGISTRY_PUBLIC",
    publicRegistrySearch: "GAFAIG_DB.CORE.V_REGISTRY_PUBLIC_SEARCH",
    publicAiSystems: "GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC",
    publicAiSystemsList: "GAFAIG_DB.CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC",
    adminApplications: "GAFAIG_DB.CORE.V_APPLICATIONS_ADMIN",
    adminUnified: "GAFAIG_DB.CORE.V_ADMIN_UNIFIED",
  },

  tables: {
    registrySnapshots: "GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS",
    registryAiSystems: "GAFAIG_DB.CORE.REGISTRY_AI_SYSTEMS",
    applications: "GAFAIG_DB.CORE.APPLICATIONS",
    participants: "GAFAIG_DB.CORE.PARTICIPANTS",
    findings: "GAFAIG_DB.CORE.FINDINGS",
    evidence: "GAFAIG_DB.CORE.EVIDENCE",
    events: "GAFAIG_DB.CORE.EVENTS",
    decisions: "GAFAIG_DB.CORE.DECISIONS",
  },

  procedures: {
    registryPublish: "GAFAIG_DB.CORE.REGISTRY_PUBLISH",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                           PUBLIC / PRIVATE BOUNDARY                        */
/* -------------------------------------------------------------------------- */

export const DATA_BOUNDARY = {
  publicMayExpose: [
    "REGISTRY_ID",
    "CASE_ID",
    "APPLICATION_ID",
    "ENTITY_NAME",
    "ENTITY_TYPE",
    "COUNTRY",
    "DECISION_STATUS",
    "CERTIFIED_TIER",
    "CERTIFIED_BAND",
    "CERTIFIED_AT",
    "VALID_FROM",
    "VALID_TO",
    "LAST_ACTIVITY_AT",
    "SYSTEM_NAME",
    "SYSTEM_TYPE",
    "INTENDED_USE",
    "DEPLOYMENT_STATUS",
    "OVERSIGHT_LEVEL",
    "RISK_TIER",
    "DEVELOPER_ORGANIZATION",
    "TRAINING_DATA_CATEGORY",
    "OVERSIGHT_MODEL",
    "HUMAN_REVIEW_REQUIRED",
    "EVALUATION_PROTOCOL",
    "AUDIT_FREQUENCY",
    "PUBLIC_SUMMARY",
    "DISPLAY_ORDER",
  ] as const,

  privateMustNeverExpose: [
    "PRIVATE_EVIDENCE",
    "REVIEWER_NOTES",
    "RAW_FINDINGS",
    "INTERNAL_SCORING_TRACE",
    "PRIVATE_ATTACHMENTS",
    "REVIEWER_IDENTITY",
    "ORG_INTERNAL_COMMENTS",
    "CONTROL_GAP_DETAIL",
    "NON_PUBLIC_EVENT_LOG",
  ] as const,
} as const;

/* -------------------------------------------------------------------------- */
/*                              API RESPONSE SHAPES                           */
/* -------------------------------------------------------------------------- */

export type RegistryPublicRecord = {
  registryId: string;
  applicationId: string | null;
  entityName: string;
  entityType: string | null;
  country: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
  lastActivityAt: string | null;
};

export type RegistrySearchRecord = RegistryPublicRecord & {
  caseId: string | null;
  entityNameNorm?: string | null;
  countryNorm?: string | null;
  q?: string | null;
};

export type RegistryAiSystemPublicRecord = {
  systemId: string;
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  systemName: string;
  systemType: string | null;
  intendedUse: string | null;
  deploymentStatus: string | null;
  oversightLevel: string | null;
  riskTier: string | null;
  developerOrganization: string | null;
  trainingDataCategory: string | null;
  oversightModel: string | null;
  humanReviewRequired: string | null;
  evaluationProtocol: string | null;
  auditFrequency: string | null;
  decisionStatus: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  governanceMaturityScore: number | null;
  controlsPct: number | null;
  coveragePct: number | null;
  freshnessPct: number | null;
  summaryPct: number | null;
  lastActivityAt: string | null;
  publicSummary: string | null;
  displayOrder: number | null;
};

export type VerifyApiResponse = {
  ok: boolean;
  registryId?: string;
  verified?: boolean;
  record?: RegistryPublicRecord;
  proof?: {
    alg: string;
    signature: string;
    message: string;
    issuedAt?: string;
  };
  error?: string;
};

export type RegistrySearchApiResponse = {
  ok: boolean;
  rows: RegistrySearchRecord[];
  total: number;
  limit: number;
  filters: {
    q: string;
    country: string;
    registryId: string;
    caseId: string;
    applicationId: string;
  };
  error?: string;
};

export type RegistryListApiResponse = {
  ok: boolean;
  rows: RegistryPublicRecord[];
  total: number;
  limit: number;
  filters: {
    q: string;
    country: string;
    registryId: string;
  };
  error?: string;
};

/* -------------------------------------------------------------------------- */
/*                             ROUTE PARAM CONTRACTS                          */
/* -------------------------------------------------------------------------- */

export const ROUTE_PARAM_CONTRACTS = {
  "/registry/[registryId]": {
    requiredParam: "registryId",
    validator: "registryId",
    canonicalSource: SNOWFLAKE.views.publicRegistrySearch,
  },

  "/registry/ai-systems/[registryId]": {
    requiredParam: "registryId",
    validator: "registryId",
    canonicalSource: SNOWFLAKE.views.publicAiSystems,
    supportingSource: SNOWFLAKE.views.publicRegistrySearch,
  },

  "/admin/verification/[caseId]/score": {
    requiredParam: "caseId",
    validator: "caseId",
    canonicalSource: SNOWFLAKE.tables.registrySnapshots,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                          CANONICAL QUERY SOURCE RULES                      */
/* -------------------------------------------------------------------------- */

export const QUERY_RULES = {
  registryPublicPages: {
    mustReadFrom: SNOWFLAKE.views.publicRegistrySearch,
    neverReadFromDirectly: [
      SNOWFLAKE.tables.findings,
      SNOWFLAKE.tables.evidence,
      SNOWFLAKE.tables.events,
    ],
  },

  registryAiSystemPages: {
    mustReadFrom: SNOWFLAKE.views.publicAiSystems,
    mayJoinWith: [SNOWFLAKE.views.publicRegistrySearch],
    neverReadFromDirectly: [
      SNOWFLAKE.tables.findings,
      SNOWFLAKE.tables.evidence,
      SNOWFLAKE.tables.decisions,
    ],
  },

  publishFlow: {
    mustWriteVia: SNOWFLAKE.procedures.registryPublish,
    mustNotBypassProcedure: true,
  },
} as const;

/* -------------------------------------------------------------------------- */
/*                            AI-ASSISTED DEV RULES                           */
/* -------------------------------------------------------------------------- */

export const AI_DEV_RULES = [
  "Do not invent route paths. Use ROUTES.",
  "Do not invent ID formats. Use ID_PATTERNS and assertCanonicalId().",
  "Do not query random Snowflake objects. Use SNOWFLAKE constants.",
  "Do not expose private verification data in public routes.",
  "For public registry detail pages, validate the param before querying.",
  "For AI-system certificate/detail links, route to ROUTES.public.registryAiSystemRecord(registryId).",
  "For organization/profile links, route to ROUTES.public.organizationRecord(registryId).",
  "If a route needs both system metadata and certification metadata, prefer public AI-system view plus public registry search view.",
  "When adding a new page or API route, update this contract file first.",
] as const;

/* -------------------------------------------------------------------------- */
/*                            SMALL HELPER BUILDERS                           */
/* -------------------------------------------------------------------------- */

export function buildRegistryRecordHref(registryId: string): string {
  return ROUTES.public.registryRecord(registryId);
}

export function buildRegistryAiSystemHref(registryId: string): string {
  return ROUTES.public.registryAiSystemRecord(registryId);
}

export function buildVerifyHref(registryId: string): string {
  return ROUTES.api.verifyRegistry(registryId);
}