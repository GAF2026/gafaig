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

import {
  isAdminRuntimeSession,
  isApplicantRuntimeSession,
} from "./participant";
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

type AdministrativeCaseScopeRow = {
  CASE_ID: string | null;
  ORG_ID: string | null;
  PARTICIPANT_ID: string | null;
  APPLICATION_ID: string | null;
  REQUEST_ID: string | null;
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

function administrativeParticipantAllowed(
  context: GuidanceContext,
): boolean {
  return (
    context.participant === "GAFAIG_OPERATIONS_REVIEWER" ||
    context.participant === "PLATFORM_ADMINISTRATOR"
  );
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

  const applicantSession =
    isApplicantRuntimeSession(context.session);

  const administrativeSession =
    isAdminRuntimeSession(context.session);

  if (
    !applicantSession &&
    !administrativeSession
  ) {
    return {
      ok: false,
      code: "PARTICIPANT_SCOPE_INVALID",
      message:
        "Repository context requires a recognized applicant or administrative guidance session.",
      retryable: false,
    };
  }

  if (
    administrativeSession &&
    !administrativeParticipantAllowed(context)
  ) {
    return {
      ok: false,
      code: "PARTICIPANT_SCOPE_INVALID",
      message:
        "Administrative repository context is not available to this guidance participant.",
      retryable: false,
    };
  }

  const organizationId =
    cleanApplicantValue(context.organizationId);

  if (!organizationId) {
    return {
      ok: false,
      code: "SOURCE_INCONSISTENT",
      message:
        "Repository context requires explicit organization scope.",
      retryable: false,
    };
  }

  const observedAt = new Date().toISOString();

  try {
    /*
     * Administrative guidance resolves the canonical operational identity
     * chain from the verification case:
     *
     * VERIFICATION_CASES.CASE_ID
     *   -> VERIFICATION_CASES.PARTICIPANT_ID
     *   -> PARTICIPANTS.APPLICATION_ID
     *   -> APPLICATIONS.REQUEST_ID
     *   -> V_ADMIN_SUBMISSIONS.REQUEST_ID
     *
     * Organization scope is independently preserved by requiring the
     * VERIFICATION_CASES CASE_ID / ORG_ID relationship supplied by the
     * administrative Guidance context.
     *
     * Applicant behavior remains unchanged.
     */
    let administrativeCaseRow:
      AdministrativeCaseScopeRow | null = null;

    if (administrativeSession) {
      const administrativeCaseRows =
        await snowflakeQuery<AdministrativeCaseScopeRow>(
          `
          SELECT
            vc.CASE_ID::STRING AS CASE_ID,
            vc.ORG_ID::STRING AS ORG_ID,
            vc.PARTICIPANT_ID::STRING AS PARTICIPANT_ID,
            p.APPLICATION_ID::STRING AS APPLICATION_ID,
            a.REQUEST_ID::STRING AS REQUEST_ID
          FROM GAFAIG_DB.CORE.VERIFICATION_CASES vc
          INNER JOIN GAFAIG_DB.CORE.PARTICIPANTS p
            ON TRIM(UPPER(p.PARTICIPANT_ID::STRING)) =
               TRIM(UPPER(vc.PARTICIPANT_ID::STRING))
          INNER JOIN GAFAIG_DB.CORE.APPLICATIONS a
            ON TRIM(UPPER(a.APPLICATION_ID::STRING)) =
               TRIM(UPPER(p.APPLICATION_ID::STRING))
          WHERE TRIM(UPPER(vc.CASE_ID::STRING)) = TRIM(UPPER(?))
            AND TRIM(UPPER(vc.ORG_ID::STRING)) = TRIM(UPPER(?))
          LIMIT 2
          `,
          [caseId, organizationId],
        );

      if (administrativeCaseRows.length === 0) {
        return {
          ok: false,
          code: "CASE_NOT_VISIBLE",
          message:
            "The requested case could not be resolved through the canonical administrative case, participant, application, and organization scope.",
          retryable: false,
        };
      }

      if (administrativeCaseRows.length > 1) {
        return {
          ok: false,
          code: "SOURCE_INCONSISTENT",
          message:
            "Multiple canonical administrative identity chains were returned for the same case and organization scope.",
          retryable: false,
        };
      }

      administrativeCaseRow =
        administrativeCaseRows[0];

      if (
        !cleanApplicantValue(
          administrativeCaseRow.REQUEST_ID,
        )
      ) {
        return {
          ok: false,
          code: "SOURCE_INCONSISTENT",
          message:
            "The canonical administrative case does not resolve to an application request identifier.",
          retryable: false,
        };
      }
    }

    /*
     * Applicant sessions retain the existing organization-name-scoped
     * workflow lookup.
     *
     * Administrative sessions use the REQUEST_ID resolved through the
     * authoritative CASE -> PARTICIPANT -> APPLICATION chain above.
     * No applicant organization name or applicant identity is fabricated.
     */
    const workflowRequestId =
      applicantSession
        ? caseId
        : cleanApplicantValue(
            administrativeCaseRow?.REQUEST_ID,
          );

    const workflowRows =
      applicantSession
        ? await snowflakeQuery<WorkflowRow>(
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
            [
              workflowRequestId,
              context.session.organizationName,
            ],
          )
        : await snowflakeQuery<WorkflowRow>(
    `
            SELECT
              REQUEST_ID::STRING AS REQUEST_ID,
              STATUS::STRING AS STATUS,
              COALESCE(SOURCE_TABLE, SOURCE)::STRING AS SOURCE
            FROM ${APPLICANT_WORKFLOW_VIEW}
            WHERE TRIM(UPPER(REQUEST_ID::STRING)) = TRIM(UPPER(?))
            ORDER BY
              UPDATED_AT DESC NULLS LAST,
              CREATED_AT DESC NULLS LAST
            LIMIT 1
            `,
            [workflowRequestId],
          );

    if (workflowRows.length === 0) {
      return {
        ok: false,
        code: "CASE_NOT_VISIBLE",
        message:
          applicantSession
            ? "The requested case is not visible within the authenticated organization scope."
            : "The canonical administrative case request does not resolve in the authoritative operational workflow view.",
        retryable: false,
      };
    }

    if (workflowRows.length > 1) {
      return {
        ok: false,
        code: "SOURCE_INCONSISTENT",
        message:
          "Multiple workflow rows were returned for the same scoped request.",
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

    /*
     * Applicant repository visibility retains the existing applicant
     * organization/session scope evaluation.
     *
     * Administrative guidance does not use applicant identity fields.
     * Its repository rows are constrained by verification CASE_ID after
     * the canonical administrative case and organization relationship was
     * independently verified.
     */
    let visibleRows:
      PersistedApplicantRepositoryRow[];

    if (
      isApplicantRuntimeSession(
        context.session,
      )
    ) {
      const scope =
        repositoryScopeFromSession(
          context.session,
          new Set([caseId]),
        );

      visibleRows =
        persistedRows.filter(
          (row) =>
            applicantRepositoryRowBelongsToScope(
              row,
              scope,
            ),
        );
    } else {
      visibleRows =
        persistedRows;
    }

    const repositories =
      buildSummaries(
        visibleRows,
        observedAt,
      );

    const workflowReference =
      createSnowflakeSourceReference({
        database: "GAFAIG_DB",
        schema: "CORE",
        objectName: "V_ADMIN_SUBMISSIONS",
        recordId:
          applicantSession
            ? caseId
            : workflowRequestId,
        observedAt,
      });

    const administrativeCaseReference =
      administrativeSession
        ? createSnowflakeSourceReference({
            database: "GAFAIG_DB",
            schema: "CORE",
            objectName: "VERIFICATION_CASES",
            recordId: caseId,
            observedAt,
          })
        : null;

    const administrativeParticipantReference =
      administrativeSession &&
      cleanApplicantValue(
        administrativeCaseRow?.PARTICIPANT_ID,
      )
        ? createSnowflakeSourceReference({
            database: "GAFAIG_DB",
            schema: "CORE",
            objectName: "PARTICIPANTS",
            recordId:
              cleanApplicantValue(
                administrativeCaseRow?.PARTICIPANT_ID,
              ),
            observedAt,
          })
        : null;

    const administrativeApplicationReference =
      administrativeSession &&
      cleanApplicantValue(
        administrativeCaseRow?.APPLICATION_ID,
      )
        ? createSnowflakeSourceReference({
            database: "GAFAIG_DB",
            schema: "CORE",
            objectName: "APPLICATIONS",
            recordId:
              cleanApplicantValue(
                administrativeCaseRow?.APPLICATION_ID,
              ),
            observedAt,
          })
        : null;

    return {
      ok: true,
      context: {
        organizationId,
        caseId,
        workflowStatus:
          cleanApplicantValue(
            workflowRows[0].STATUS,
          ) || null,
        workflowStage:
          cleanApplicantValue(
            workflowRows[0].SOURCE,
          ) || null,
        repositories,
        relationships:
          loadGuidanceRelationshipContext(),
        sourceReferences:
          uniqueSourceReferences([
            workflowReference,
            ...(administrativeCaseReference
              ? [administrativeCaseReference]
              : []),
            ...(administrativeParticipantReference
              ? [administrativeParticipantReference]
              : []),
            ...(administrativeApplicationReference
              ? [administrativeApplicationReference]
              : []),
            ...repositories.flatMap(
              (item) =>
                item.sourceReferences,
            ),
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