// /lib/status.ts

export const ALLOWED_STATUSES = [
  "received",
  "in_review",
  "approved",
  "rejected",
] as const;

export type SubmissionStatus = (typeof ALLOWED_STATUSES)[number];

export function isValidStatus(v: unknown): v is SubmissionStatus {
  return typeof v === "string" && (ALLOWED_STATUSES as readonly string[]).includes(v);
}
