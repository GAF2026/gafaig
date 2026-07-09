// lib/applicant/constants.ts
//
// Repository Maturation Layer
// Shared Applicant Repository Constants
//
// Snowflake remains the source of truth.
// This module contains only shared constants.
// No repository logic belongs here.

export const APPLICANT_WORKFLOW_VIEW =
  "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

export const APPLICANT_EVIDENCE_TABLE =
  "GAFAIG_DB.CORE.VERIFICATION_EVIDENCE";

export const APPLICANT_COMPLETED_STATUSES = [
  "CLOSED",
  "COMPLETE",
  "COMPLETED",
  "ARCHIVED",
] as const;

export const APPLICANT_CASE_ID_FIELDS = [
  "CASE_ID",
  "REQUEST_ID",
  "APPLICATION_ID",
  "VERIFICATION_CASE_ID",
] as const;

export const APPLICANT_ORGANIZATION_NAME_FIELDS = [
  "ORG_NAME",
  "ORGANIZATION_NAME",
  "ORGANIZATION",
  "ORG",
] as const;

export const APPLICANT_ORGANIZATION_ID_FIELDS = [
  "ORG_ID",
  "ORGANIZATION_ID",
  "APPLICANT_ORG_ID",
] as const;

export const APPLICANT_SUBMITTED_BY_FIELDS = [
  "SUBMITTED_BY",
  "UPLOADED_BY",
  "CREATED_BY",
  "EMAIL",
] as const;

export const APPLICANT_EVIDENCE_TYPE_FIELDS = [
  "EVIDENCE_TYPE",
  "TYPE",
] as const;

export const APPLICANT_TIMESTAMP_FIELDS = [
  "UPDATED_AT",
  "MODIFIED_AT",
  "CREATED_AT",
] as const;