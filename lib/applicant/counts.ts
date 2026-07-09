// lib/applicant/counts.ts
//
// Repository Maturation Layer
// Shared Applicant Repository Counting
//
// Snowflake remains the source of truth.
// This module performs repository categorization only.
// It does not compute governance state.

export type ApplicantRepositoryCounts = {
  evidenceRecords: number;
  artifactRecords: number;
  requestResponseRecords: number;
  remediationRecords: number;
  certificationRecords: number;
};

export function emptyApplicantRepositoryCounts(): ApplicantRepositoryCounts {
  return {
    evidenceRecords: 0,
    artifactRecords: 0,
    requestResponseRecords: 0,
    remediationRecords: 0,
    certificationRecords: 0,
  };
}

export function classifyApplicantEvidenceType(
  value: string,
): keyof ApplicantRepositoryCounts {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "artifact" ||
    normalized === "artifact_upload" ||
    normalized === "applicant_artifact" ||
    normalized === "applicant_artifact_upload" ||
    normalized.startsWith("artifact:")
  ) {
    return "artifactRecords";
  }

  if (
    normalized === "request_response" ||
    normalized === "request_response_submission" ||
    normalized === "applicant_request_response" ||
    normalized === "applicant_response" ||
    normalized === "information_request_response" ||
    normalized.startsWith("request_response:")
  ) {
    return "requestResponseRecords";
  }

  if (
    normalized === "remediation" ||
    normalized === "remediation_submission" ||
    normalized === "applicant_remediation" ||
    normalized === "deficiency_remediation" ||
    normalized.startsWith("remediation:")
  ) {
    return "remediationRecords";
  }

  if (
    normalized === "certification" ||
    normalized === "certification_record" ||
    normalized === "certification_issuance" ||
    normalized === "applicant_certification" ||
    normalized === "applicant_certification_record" ||
    normalized.startsWith("certification:")
  ) {
    return "certificationRecords";
  }

  return "evidenceRecords";
}

export function applicantRepositoryActivity(
  counts: ApplicantRepositoryCounts,
): number {
  return (
    counts.evidenceRecords +
    counts.artifactRecords +
    counts.requestResponseRecords +
    counts.remediationRecords +
    counts.certificationRecords
  );
}

export function mergeApplicantRepositoryCounts(
  target: ApplicantRepositoryCounts,
  source: ApplicantRepositoryCounts,
): ApplicantRepositoryCounts {
  return {
    evidenceRecords:
      target.evidenceRecords + source.evidenceRecords,
    artifactRecords:
      target.artifactRecords + source.artifactRecords,
    requestResponseRecords:
      target.requestResponseRecords +
      source.requestResponseRecords,
    remediationRecords:
      target.remediationRecords +
      source.remediationRecords,
    certificationRecords:
      target.certificationRecords +
      source.certificationRecords,
  };
}

export function incrementApplicantRepositoryCount(
  counts: ApplicantRepositoryCounts,
  evidenceType: string,
): ApplicantRepositoryCounts {
  const bucket = classifyApplicantEvidenceType(evidenceType);

  counts[bucket] += 1;

  return counts;
}