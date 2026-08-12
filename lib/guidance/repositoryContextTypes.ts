import type { GuidanceRepositoryName } from "./repositoryCatalog";
import type { GuidanceSourceReference } from "./types";

export interface GuidanceRepositorySummary {
  readonly repository: GuidanceRepositoryName;
  readonly recordCount: number;
  readonly visibleRecordIds: readonly string[];
  readonly sourceReferences: readonly GuidanceSourceReference[];
}

export interface GuidanceRelationshipContext {
  readonly availability: "UNRESOLVED";
  readonly relationships: readonly never[];
  readonly unresolvedConditions: readonly string[];
}

export interface LoadedRepositoryContext {
  readonly organizationId: string;
  readonly caseId: string;
  readonly workflowStatus: string | null;
  readonly workflowStage: string | null;
  readonly repositories: readonly GuidanceRepositorySummary[];
  readonly relationships: GuidanceRelationshipContext;
  readonly sourceReferences: readonly GuidanceSourceReference[];
  readonly observedAt: string;
}

export type RepositoryContextLoadResult =
  | { readonly ok: true; readonly context: LoadedRepositoryContext }
  | {
      readonly ok: false;
      readonly code:
        | "CASE_SCOPE_REQUIRED"
        | "PARTICIPANT_SCOPE_INVALID"
        | "CASE_NOT_VISIBLE"
        | "SOURCE_UNAVAILABLE"
        | "SOURCE_INCONSISTENT";
      readonly message: string;
      readonly retryable: boolean;
    };
