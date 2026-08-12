import type { GuidanceContext, GuidanceResult } from "./types";

export interface GuidanceEngine<TInput = Readonly<Record<string, unknown>>, TPayload = Readonly<Record<string, unknown>>> {
  readonly name: string;
  readonly version: string;
  execute(input: { readonly context: GuidanceContext; readonly input: TInput }): Promise<GuidanceResult<TPayload>>;
}

export function isGuidanceEngine(value: unknown): value is GuidanceEngine {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GuidanceEngine>;
  return typeof candidate.name === "string" && candidate.name.trim().length > 0 &&
    typeof candidate.version === "string" && candidate.version.trim().length > 0 &&
    typeof candidate.execute === "function";
}
