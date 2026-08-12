import {
  buildGuidanceResult,
  createGuidanceMetadata,
} from "./resultBuilders";

import {
  loadRepositoryContext,
} from "./repositoryContextLoader";

import {
  REPOSITORY_CONTEXT_RULES,
} from "./repositoryContextRules";

import type {
  GuidanceEngine,
} from "./engine";

import type {
  GuidanceRepositoryName,
} from "./repositoryCatalog";

import type {
  GuidanceRepositorySummary,
  LoadedRepositoryContext,
} from "./repositoryContextTypes";

import type {
  GuidanceResult,
} from "./types";

const ENGINE_NAME =
  "repository-context";

const ENGINE_VERSION =
  "1.0.0";

export interface RepositoryContextEngineInput {
  readonly includeEmptyRepositories?: boolean;
}

export interface RepositoryContextPayload {
  readonly organizationId: string;
  readonly caseId: string;
  readonly workflowStatus: string | null;
  readonly workflowStage: string | null;
  readonly repositoryCount: number;
  readonly repositoriesWithRecords:
    readonly GuidanceRepositoryName[];
  readonly emptyRepositories:
    readonly GuidanceRepositoryName[];
  readonly repositories:
    readonly GuidanceRepositorySummary[];
  readonly relationshipAvailability:
    LoadedRepositoryContext["relationships"]["availability"];
  readonly observedAt: string;
}

function loadedPayload(
  context: LoadedRepositoryContext,
  includeEmptyRepositories: boolean,
): RepositoryContextPayload {
  const repositoriesWithRecords =
    context.repositories
      .filter(
        (repository) =>
          repository.recordCount > 0,
      )
      .map(
        (repository) =>
          repository.repository,
      );

  const emptyRepositories =
    context.repositories
      .filter(
        (repository) =>
          repository.recordCount === 0,
      )
      .map(
        (repository) =>
          repository.repository,
      );

  return {
    organizationId:
      context.organizationId,
    caseId:
      context.caseId,
    workflowStatus:
      context.workflowStatus,
    workflowStage:
      context.workflowStage,
    repositoryCount:
      repositoriesWithRecords.length,
    repositoriesWithRecords,
    emptyRepositories,
    repositories:
      includeEmptyRepositories
        ? context.repositories
        : context.repositories.filter(
            (repository) =>
              repository.recordCount > 0,
          ),
    relationshipAvailability:
      context.relationships.availability,
    observedAt:
      context.observedAt,
  };
}

function failureStatus(
  code: string,
): GuidanceResult["status"] {
  switch (code) {
    case "CASE_NOT_VISIBLE":
    case "PARTICIPANT_SCOPE_INVALID":
      return "NOT_VISIBLE";
    case "SOURCE_INCONSISTENT":
      return "INCONSISTENT";
    case "SOURCE_UNAVAILABLE":
      return "UNAVAILABLE";
    case "CASE_SCOPE_REQUIRED":
    default:
      return "UNRESOLVED";
  }
}

function failureCode(
  code: string,
):
  | "CASE_SCOPE_INVALID"
  | "PARTICIPANT_SCOPE_INVALID"
  | "SOURCE_UNAVAILABLE"
  | "SOURCE_INCONSISTENT" {
  switch (code) {
    case "PARTICIPANT_SCOPE_INVALID":
      return "PARTICIPANT_SCOPE_INVALID";
    case "SOURCE_INCONSISTENT":
      return "SOURCE_INCONSISTENT";
    case "SOURCE_UNAVAILABLE":
      return "SOURCE_UNAVAILABLE";
    case "CASE_NOT_VISIBLE":
    case "CASE_SCOPE_REQUIRED":
    default:
      return "CASE_SCOPE_INVALID";
  }
}

export const repositoryContextEngine:
  GuidanceEngine<
    RepositoryContextEngineInput,
    RepositoryContextPayload
  > = {
    name: ENGINE_NAME,
    version: ENGINE_VERSION,

    async execute({
      context,
      input,
    }): Promise<
      GuidanceResult<RepositoryContextPayload>
    > {
      const loaded =
        await loadRepositoryContext(context);

      if (!loaded.ok) {
        return buildGuidanceResult({
          status:
            failureStatus(loaded.code),
          summary:
            "Repository context could not be resolved.",
          ruleIds: [
            REPOSITORY_CONTEXT_RULES
              .CASE_SCOPE_REQUIRED,
            REPOSITORY_CONTEXT_RULES
              .ORGANIZATION_SCOPE_PRESERVED,
            REPOSITORY_CONTEXT_RULES
              .AUTHORITATIVE_RECORDS_ONLY,
          ],
          facts: [],
          unresolvedConditions: [
            loaded.message,
          ],
          sourceReferences: [],
          failure: {
            code:
              failureCode(loaded.code),
            message:
              loaded.message,
            retryable:
              loaded.retryable,
          },
          metadata:
            createGuidanceMetadata({
              correlationId:
                context.correlationId,
              engineName:
                ENGINE_NAME,
              engineVersion:
                ENGINE_VERSION,
            }),
        });
      }

      const payload =
        loadedPayload(
          loaded.context,
          input.includeEmptyRepositories ??
            true,
        );

      const relationshipUnresolved =
        loaded.context.relationships
          .availability === "UNRESOLVED";

      const facts = [
        `Case ${loaded.context.caseId} is visible within organization ${loaded.context.organizationId}.`,
        `${payload.repositoryCount} repository categories contain visible records.`,
        `${payload.emptyRepositories.length} repository categories contain no visible records.`,
      ];

      const unresolvedConditions =
        relationshipUnresolved
          ? loaded.context.relationships
              .unresolvedConditions
          : [];

      return buildGuidanceResult({
        status:
          relationshipUnresolved
            ? "INCOMPLETE"
            : "AVAILABLE",
        summary:
          relationshipUnresolved
            ? "Repository context is available, but canonical relationship context remains unresolved."
            : "Repository context is available.",
        ruleIds: [
          REPOSITORY_CONTEXT_RULES
            .ORGANIZATION_SCOPE_PRESERVED,
          REPOSITORY_CONTEXT_RULES
            .AUTHORITATIVE_RECORDS_ONLY,
          REPOSITORY_CONTEXT_RULES
            .RELATIONSHIPS_NOT_INFERRED,
          REPOSITORY_CONTEXT_RULES
            .SOURCE_REFERENCES_REQUIRED,
        ],
        facts,
        unresolvedConditions,
        sourceReferences:
          loaded.context.sourceReferences,
        payload,
        metadata:
          createGuidanceMetadata({
            correlationId:
              context.correlationId,
            engineName:
              ENGINE_NAME,
            engineVersion:
              ENGINE_VERSION,
            generatedAt:
              loaded.context.observedAt,
          }),
      });
    },
  };
