// lib/applicant/scope.ts
//
// Repository Maturation Layer
// Shared Applicant Repository Scope
//
// Snowflake remains the source of truth.
// This module performs applicant organization scope evaluation only.
// It does not compute governance authority.

import {
  APPLICANT_CASE_ID_FIELDS,
  APPLICANT_COMPLETED_STATUSES,
  APPLICANT_ORGANIZATION_ID_FIELDS,
  APPLICANT_ORGANIZATION_NAME_FIELDS,
  APPLICANT_SUBMITTED_BY_FIELDS,
} from "./constants";

import {
  cleanApplicantValue,
  firstApplicantValue,
} from "./helpers";

export type PersistedApplicantRepositoryRow = Record<string, unknown>;

export type ApplicantRepositoryScope = {
  organizationId: string;
  organizationName: string;
  email?: string | null;
  workflowCaseIds?: Set<string>;
};

export function applicantRepositoryRowCaseId(
  row: PersistedApplicantRepositoryRow,
): string {
  return firstApplicantValue(
    row,
    APPLICANT_CASE_ID_FIELDS,
  );
}

export function applicantRepositoryRowBelongsToScope(
  row: PersistedApplicantRepositoryRow,
  scope: ApplicantRepositoryScope,
): boolean {
  const sessionOrg =
    cleanApplicantValue(scope.organizationName).toLowerCase();

  const sessionOrgId =
    cleanApplicantValue(scope.organizationId).toLowerCase();

  const sessionEmail =
    cleanApplicantValue(scope.email).toLowerCase();

  const orgName = firstApplicantValue(
    row,
    APPLICANT_ORGANIZATION_NAME_FIELDS,
  ).toLowerCase();

  const orgId = firstApplicantValue(
    row,
    APPLICANT_ORGANIZATION_ID_FIELDS,
  ).toLowerCase();

  const submittedBy = firstApplicantValue(
    row,
    APPLICANT_SUBMITTED_BY_FIELDS,
  ).toLowerCase();

  const caseId = applicantRepositoryRowCaseId(row);

  return (
    Boolean(orgName && orgName === sessionOrg) ||
    Boolean(orgId && orgId === sessionOrgId) ||
    Boolean(
      sessionEmail &&
        submittedBy &&
        submittedBy === sessionEmail,
    ) ||
    Boolean(
      caseId &&
        scope.workflowCaseIds?.has(caseId),
    )
  );
}

export function repositoryScopeFromSession(
  session: {
    organizationId: string;
    organizationName: string;
    email?: string | null;
  },
  workflowCaseIds?: Set<string>,
): ApplicantRepositoryScope {
  return {
    organizationId: session.organizationId,
    organizationName: session.organizationName,
    email: session.email,
    workflowCaseIds,
  };
}

export function isApplicantActiveStatus(
  status: string,
): boolean {
  const normalized =
    cleanApplicantValue(status).toUpperCase();

  return !APPLICANT_COMPLETED_STATUSES.includes(
    normalized as
      (typeof APPLICANT_COMPLETED_STATUSES)[number],
  );
}