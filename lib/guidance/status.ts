export const GUIDANCE_STATUSES = [
  "AVAILABLE",
  "BLOCKED",
  "WAITING",
  "INCOMPLETE",
  "READY",
  "NOT_ELIGIBLE",
  "UNRESOLVED",
  "UNAVAILABLE",
  "UNAUTHORIZED",
  "NOT_VISIBLE",
  "INCONSISTENT",
  "STALE",
  "ERROR",
] as const;

export type GuidanceStatus = (typeof GUIDANCE_STATUSES)[number];

const GUIDANCE_STATUS_SET: ReadonlySet<string> = new Set(GUIDANCE_STATUSES);

export function isGuidanceStatus(value: unknown): value is GuidanceStatus {
  return typeof value === "string" && GUIDANCE_STATUS_SET.has(value);
}

export function parseGuidanceStatus(value: unknown): GuidanceStatus {
  if (!isGuidanceStatus(value)) {
    throw new TypeError(
      `Invalid operational guidance status: ${String(value)}`,
    );
  }

  return value;
}
