import { cleanApplicantValue } from "@/lib/applicant/helpers";
import { normalizeId } from "@/lib/ids";
import type { GuidanceSourceReference } from "./types";

export interface SnowflakeSourceReferenceInput {
  readonly objectName: string;
  readonly observedAt: string;
  readonly database?: string;
  readonly schema?: string;
  readonly recordId?: string | null;
  readonly fieldName?: string | null;
}

export function createSnowflakeSourceReference(
  input: SnowflakeSourceReferenceInput,
): GuidanceSourceReference {
  const objectName = cleanApplicantValue(input.objectName);
  const observedAt = cleanApplicantValue(input.observedAt);

  if (!objectName) throw new TypeError("Snowflake source object name is required.");
  if (!observedAt) {
    throw new TypeError(
      "Snowflake source observation timestamp is required.",
    );
  }

  const database = cleanApplicantValue(input.database);
  const schema = cleanApplicantValue(input.schema);
  const recordId = cleanApplicantValue(input.recordId)
    ? normalizeId(input.recordId ?? "")
    : "";
  const fieldName = cleanApplicantValue(input.fieldName).toUpperCase();

  return {
    sourceSystem: "SNOWFLAKE",
    ...(database ? { database: database.toUpperCase() } : {}),
    ...(schema ? { schema: schema.toUpperCase() } : {}),
    objectName: objectName.toUpperCase(),
    ...(recordId ? { recordId } : {}),
    ...(fieldName ? { fieldName } : {}),
    observedAt,
  };
}

export function uniqueSourceReferences(
  references: readonly GuidanceSourceReference[],
): GuidanceSourceReference[] {
  const seen = new Set<string>();
  const result: GuidanceSourceReference[] = [];

  for (const reference of references) {
    const key = [
      reference.sourceSystem,
      reference.database ?? "",
      reference.schema ?? "",
      reference.objectName,
      reference.recordId ?? "",
      reference.fieldName ?? "",
      reference.observedAt,
    ].join("|");

    if (!seen.has(key)) {
      seen.add(key);
      result.push(reference);
    }
  }

  return result;
}
