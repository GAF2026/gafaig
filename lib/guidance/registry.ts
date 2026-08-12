import { cleanApplicantValue } from "@/lib/applicant/helpers";

import {
  isGuidanceEngine,
  type GuidanceEngine,
} from "./engine";

/**
 * A registry contains engines with different input and payload contracts.
 *
 * Generic types remain strongly enforced when each engine is declared and
 * executed. They are intentionally erased only while engines are stored
 * together in this heterogeneous registry.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RegisteredGuidanceEngine = GuidanceEngine<any, any>;

export class GuidanceEngineRegistry {
  private readonly engines =
    new Map<string, RegisteredGuidanceEngine>();

  register<
    TInput,
    TPayload,
  >(
    engine: GuidanceEngine<TInput, TPayload>,
  ): void {
    if (!isGuidanceEngine(engine)) {
      throw new TypeError(
        "A valid guidance engine is required.",
      );
    }

    const key =
      this.normalizeEngineName(engine.name);

    if (this.engines.has(key)) {
      throw new Error(
        `Guidance engine "${engine.name}" is already registered.`,
      );
    }

    this.engines.set(key, engine);
  }

  has(name: string): boolean {
    return this.engines.has(
      this.normalizeEngineName(name),
    );
  }

  get(
    name: string,
  ): RegisteredGuidanceEngine | null {
    return (
      this.engines.get(
        this.normalizeEngineName(name),
      ) ?? null
    );
  }

  list(): readonly RegisteredGuidanceEngine[] {
    return Array.from(
      this.engines.values(),
    );
  }

  names(): readonly string[] {
    return this.list().map(
      (engine) => engine.name,
    );
  }

  private normalizeEngineName(
    name: unknown,
  ): string {
    const cleaned =
      cleanApplicantValue(name).toLowerCase();

    if (!cleaned) {
      throw new TypeError(
        "Guidance engine name is required.",
      );
    }

    return cleaned;
  }
}

export function createGuidanceEngineRegistry(
  engines:
    readonly RegisteredGuidanceEngine[] = [],
): GuidanceEngineRegistry {
  const registry =
    new GuidanceEngineRegistry();

  for (const engine of engines) {
    registry.register(engine);
  }

  return registry;
}