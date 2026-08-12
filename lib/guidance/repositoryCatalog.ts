export const GUIDANCE_REPOSITORIES = [
  "EVIDENCE",
  "ARTIFACT",
  "INFORMATION_REQUEST",
  "DEFICIENCY",
  "REMEDIATION",
  "CERTIFICATION",
  "PROGRESS",
] as const;

export type GuidanceRepositoryName =
  (typeof GUIDANCE_REPOSITORIES)[number];

export function isGuidanceRepositoryName(
  value: unknown,
): value is GuidanceRepositoryName {
  return (
    typeof value === "string" &&
    (GUIDANCE_REPOSITORIES as readonly string[]).includes(value)
  );
}
