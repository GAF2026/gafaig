// lib/applicant/helpers.ts
//
// Repository Maturation Layer
// Shared Applicant Repository Helper Functions
//
// Snowflake remains the source of truth.
// These helpers perform no governance computation.

import type { PersistedApplicantRepositoryRow } from "./repository";

export function cleanApplicantValue(value: unknown): string {
  return String(value ?? "").trim();
}

export function firstApplicantValue(
  row: PersistedApplicantRepositoryRow,
  keys: readonly string[],
): string {
  for (const key of keys) {
    const value = cleanApplicantValue(row[key]);

    if (value) {
      return value;
    }
  }

  return "";
}

export function safeLowerCase(value: unknown): string {
  return cleanApplicantValue(value).toLowerCase();
}

export function safeUpperCase(value: unknown): string {
  return cleanApplicantValue(value).toUpperCase();
}

export function toCaseIdSet(values: readonly string[]): Set<string> {
  return new Set(
    values
      .map(cleanApplicantValue)
      .filter((value): value is string => value.length > 0),
  );
}

export function hasValue(value: unknown): boolean {
  return cleanApplicantValue(value).length > 0;
}

export function firstNonEmpty(
  ...values: readonly unknown[]
): string {
  for (const value of values) {
    const cleaned = cleanApplicantValue(value);

    if (cleaned) {
      return cleaned;
    }
  }

  return "";
}

export function normalizeEvidenceType(value: unknown): string {
  return cleanApplicantValue(value).toLowerCase();
}