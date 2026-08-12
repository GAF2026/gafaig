import type { ApplicantSession } from "@/lib/applicant-auth";
import type { Session } from "@/lib/auth/session";
import type { GuidanceStatus } from "./status";

export type GuidanceCaseId = string;
export type GuidanceOrganizationId = string;
export type GuidanceParticipantId = string;
export type GuidanceRepositoryRecordId = string;
export type GuidanceRuleId = string;

export type GuidanceParticipant =
  | "APPLICANT"
  | "GAFAIG_OPERATIONS_REVIEWER"
  | "GOVERNANCE_REVIEWER"
  | "CERTIFICATION_AUTHORITY"
  | "PLATFORM_ADMINISTRATOR";

export type GuidanceRuntimeSession =
  | ApplicantSession
  | Session;

export type GuidanceSourceSystem = "SNOWFLAKE";

export interface GuidanceSourceReference {
  readonly sourceSystem: GuidanceSourceSystem;
  readonly database?: string;
  readonly schema?: string;
  readonly objectName: string;
  readonly recordId?: string;
  readonly fieldName?: string;
  readonly observedAt: string;
}

export interface GuidanceExplanation {
  readonly summary: string;
  readonly ruleIds: readonly GuidanceRuleId[];
  readonly facts: readonly string[];
  readonly unresolvedConditions: readonly string[];
}

export type GuidanceFailureCode =
  | "AUTHENTICATION_REQUIRED"
  | "ORGANIZATION_SCOPE_INVALID"
  | "PARTICIPANT_SCOPE_INVALID"
  | "CASE_SCOPE_INVALID"
  | "SOURCE_UNAVAILABLE"
  | "SOURCE_INCONSISTENT"
  | "SOURCE_STALE"
  | "DEPENDENCY_FAILURE"
  | "VALIDATION_FAILURE"
  | "INTERNAL_ERROR";

export interface GuidanceFailure {
  readonly code: GuidanceFailureCode;
  readonly message: string;
  readonly retryable: boolean;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface GuidanceContext {
  readonly session: GuidanceRuntimeSession;
  readonly participant: GuidanceParticipant;
  readonly organizationId: GuidanceOrganizationId;
  readonly caseId?: GuidanceCaseId;
  readonly requestedAt: string;
  readonly correlationId: string;
}

export interface GuidanceRepositoryContext {
  readonly repositoryName: string;
  readonly visibleRecordIds: readonly GuidanceRepositoryRecordId[];
  readonly unresolvedRecordIds: readonly GuidanceRepositoryRecordId[];
}

export interface GuidanceWorkspaceContext {
  readonly organizationId: GuidanceOrganizationId;
  readonly caseId: GuidanceCaseId;
  readonly currentStage?: string;
  readonly currentOwner?: GuidanceParticipant;
  readonly repositories: readonly GuidanceRepositoryContext[];
}

export interface GuidanceResultMetadata {
  readonly generatedAt: string;
  readonly correlationId: string;
  readonly engineName: string;
  readonly engineVersion: string;
}

export interface GuidanceResult<
  TPayload = Readonly<Record<string, unknown>>,
> {
  readonly status: GuidanceStatus;
  readonly payload?: TPayload;
  readonly explanation: GuidanceExplanation;
  readonly sourceReferences: readonly GuidanceSourceReference[];
  readonly failure?: GuidanceFailure;
  readonly metadata: GuidanceResultMetadata;
}
