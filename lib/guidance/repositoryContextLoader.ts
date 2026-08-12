import {
  APPLICANT_EVIDENCE_TABLE,
  APPLICANT_WORKFLOW_VIEW,
  applicantRepositoryRowBelongsToScope,
  cleanApplicantValue,
  classifyApplicantEvidenceType,
  firstApplicantValue,
  repositoryScopeFromSession,
  type PersistedApplicantRepositoryRow,
} from "@/lib/applicant/repository";
import { snowflakeQuery } from "@/lib/snowflake";

import { isApplicantRuntimeSession } from "./participant";
import { loadGuidanceRelationshipContext } from "./relationshipContext";
import type {
  GuidanceRepositoryName,
} from "./repositoryCatalog";
import type {
  GuidanceRepositorySummary,
  RepositoryContextLoadResult,
} from "./repositoryContextTypes";
import {
  createSnowflakeSourceReference,
  uniqueSourceReferences,
} from "./sourceReferences";
import type {
  GuidanceContext,
  GuidanceSourceReference,
} from "./types";

type WorkflowRow = {
  REQUEST_ID: string | null;
  STATUS: string | null;
  SOURCE: string | null;
};

const ORDERED_REPOSITORIES: readonly GuidanceRepositoryName[] = [
  "EVIDENCE",
  "ARTIFACT",
  "INFORMATION_REQUEST",
  "DEFICIENCY",
  "REMEDIATION",
  "CERTIFICATION",
  "PROGRESS",
];

function repositoryForEvidenceType(
  evidenceType: string,
): GuidanceRepositoryName {
  const bucket = classifyApplicantEvidenceType(evidenceType);

  switch (bucket) {
    case "artifactRecords":
      return "ARTIFACT";
    case "requestResponseRecords":
      return "INFORMATION_REQUEST";
    case "remediationRecords":
      return "REMEDIATION";
    case "certificationRecords":
      return "CERTIFICATION";
    default:
      return "EVIDENCE";
  }
}

function recordId(row: PersistedApplicantRepositoryRow): string {
  return firstApplicantValue(row, [
    "EVIDENCE_ID",
    "ARTIFACT_ID",
    "RECORD_ID",
    "ID",
    "REQUEST_ID",
    "CASE_ID",
  ]);
}

function buildSummaries(
  records: readonly PersistedApplicantRepositoryRow[],
  observedAt: string,
): GuidanceRepositorySummary[] {
  const grouped = new Map<
    GuidanceRepositoryName,
    { ids: string[]; refs: GuidanceSourceReference[] }
  >();

  for (const row of records) {
    const repository = repositoryForEvidenceType(
      firstApplicantValue(row, ["EVIDENCE_TYPE", "TYPE"]),
    );
    const current = grouped.get(repository) ?? { ids: [], refs: [] };
    const id = recordId(row);

    if (id) current.ids.push(id);

    current.refs.push(
      createSnowflakeSourceReference({
        database: "GAFAIG_DB",
        schema: "CORE",
        objectName: "VERIFICATION_EVIDENCE",
        recordId: id || undefined,
        observedAt,
      }),
    );

    grouped.set(repository, current);
  }

  return ORDERED_REPOSITORIES.map((repository) => {
    const current = grouped.get(repository);

    return {
      repository,
      recordCount: current?.ids.length ?? 0,
      visibleRecordIds: Array.from(new Set(current?.ids ?? [])),
      sourceReferences: uniqueSourceReferences(current?.refs ?? []),
    };
  });
}

export async function loadRepositoryContext(
  context: GuidanceContext,
): Promise<RepositoryContextLoadResult> {
  const caseId = cleanApplicantValue(context.caseId);

  if (!caseId) {
    return {
      ok: false,
      code: "CASE_SCOPE_REQUIRED",
      message: "Repository context requires an explicit case identifier.",
      retryable: false,
    };
  }

  if (!isApplicantRuntimeSession(context.session)) {
    return {
      ok: false,
      code: "PARTICIPANT_SCOPE_INVALID",
      message:
        "Phase 2A repository loading currently requires an applicant organization session.",
      retryable: false,
    };
  }

  const observedAt = new Date().toISOString();

  try {
    const workflowRows = await snowflakeQuery<WorkflowRow>(
      `
      SELECT
        REQUEST_ID::STRING AS REQUEST_ID,
        STATUS::STRING AS STATUS,
        COALESCE(SOURCE_TABLE, SOURCE)::STRING AS SOURCE
      FROM ${APPLICANT_WORKFLOW_VIEW}
      WHERE REQUEST_ID::STRING = ?
        AND COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING ILIKE ?
      LIMIT 2
      `,
      [caseId, context.session.organizationName],
    );

    if (workflowRows.length === 0) {
      return {
        ok: false,
        code: "CASE_NOT_VISIBLE",
        message:
          "The requested case is not visible within the authenticated organization scope.",
        retryable: false,
      };
    }

    if (workflowRows.length > 1) {
      return {
        ok: false,
        code: "SOURCE_INCONSISTENT",
        message:
          "Multiple workflow rows were returned for the same scoped case.",
        retryable: false,
      };
    }

    const persistedRows =
      await snowflakeQuery<PersistedApplicantRepositoryRow>(
        `
        SELECT *
        FROM ${APPLICANT_EVIDENCE_TABLE}
        WHERE CASE_ID::STRING = ?
        ORDER BY CREATED_AT DESC NULLS LAST
        LIMIT 500
        `,
        [caseId],
      );

    const scope = repositoryScopeFromSession(
      context.session,
      new Set([caseId]),
    );

    const visibleRows = persistedRows.filter((row) =>
      applicantRepositoryRowBelongsToScope(row, scope),
    );

    const repositories = buildSummaries(visibleRows, observedAt);

    const workflowReference = createSnowflakeSourceReference({
      database: "GAFAIG_DB",
      schema: "CORE",
      objectName: "V_ADMIN_SUBMISSIONS",
      recordId: caseId,
      observedAt,
    });

    return {
      ok: true,
      context: {
        organizationId: context.organizationId,
        caseId,
        workflowStatus:
          cleanApplicantValue(workflowRows[0].STATUS) || null,
        workflowStage:
          cleanApplicantValue(workflowRows[0].SOURCE) || null,
        repositories,
        relationships: loadGuidanceRelationshipContext(),
        sourceReferences: uniqueSourceReferences([
          workflowReference,
          ...repositories.flatMap((item) => item.sourceReferences),
        ]),
        observedAt,
      },
    };
  } catch (error) {
    return {
      ok: false,
      code: "SOURCE_UNAVAILABLE",
      message:
        error instanceof Error
          ? error.message
          : "Repository context loading failed.",
      retryable: true,
    };
  }
}
