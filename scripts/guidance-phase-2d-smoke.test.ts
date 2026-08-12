import assert from "node:assert/strict";
import test from "node:test";

import {
  executeGuidanceEngine,
} from "../lib/guidance/executor";

import {
  createOperationalGuidanceRegistry,
} from "../lib/guidance/guidanceServices";

import {
  createGuidanceEngineRegistry,
} from "../lib/guidance/registry";

import type {
  GuidanceEngine,
} from "../lib/guidance/engine";

import type {
  GuidanceContext,
  GuidanceResult,
  GuidanceRuntimeSession,
} from "../lib/guidance/types";

interface SmokeEngineInput {
  readonly value: string;
}

interface SmokeEnginePayload {
  readonly normalizedValue: string;
}

const FIXED_GENERATED_AT =
  "2026-07-28T12:00:00.000Z";

const SMOKE_CORRELATION_ID =
  "GUIDANCE-PHASE-2D-SMOKE";

const smokeSession = {
  userId: "phase-2d-smoke-user",
  email: "phase-2d-smoke@gafaig.test",
  role: "APPLICANT",
  organizationId: "ORG-PHASE-2D-SMOKE",
  organizationName: "GAFAIG Phase 2D Smoke",
} as GuidanceRuntimeSession;

/**
 * This context is an isolated executor fixture.
 *
 * It is not produced by, and does not replace, the authenticated Guidance
 * context loader. Context-loader authorization is validated separately
 * through the application runtime.
 */
const smokeContext: GuidanceContext = {
  session: smokeSession,
  participant: "APPLICANT",
  organizationId: "ORG-PHASE-2D-SMOKE",
  caseId: "CASE-PHASE-2D-SMOKE",
  requestedAt: FIXED_GENERATED_AT,
  correlationId: SMOKE_CORRELATION_ID,
};

const deterministicEngine:
  GuidanceEngine<
    SmokeEngineInput,
    SmokeEnginePayload
  > = {
    name: "phase-2d-deterministic-smoke",
    version: "1.0.0",

    async execute({
      context,
      input,
    }): Promise<
      GuidanceResult<SmokeEnginePayload>
    > {
      const normalizedValue =
        input.value.trim().toUpperCase();

      return {
        status: "AVAILABLE",
        payload: {
          normalizedValue,
        },
        explanation: {
          summary:
            "Deterministic smoke guidance is available.",
          ruleIds: [
            "PHASE_2D_DETERMINISTIC_SMOKE",
          ],
          facts: [
            `Normalized value: ${normalizedValue}.`,
          ],
          unresolvedConditions: [],
        },
        sourceReferences: [
          {
            sourceSystem: "SNOWFLAKE",
            database: "GAFAIG_DB",
            schema: "CORE",
            objectName:
              "PHASE_2D_SMOKE_REFERENCE",
            recordId:
              context.caseId,
            observedAt:
              FIXED_GENERATED_AT,
          },
        ],
        metadata: {
          generatedAt:
            FIXED_GENERATED_AT,
          correlationId:
            context.correlationId,
          engineName:
            deterministicEngine.name,
          engineVersion:
            deterministicEngine.version,
        },
      };
    },
  };

const throwingEngine:
  GuidanceEngine<
    SmokeEngineInput,
    SmokeEnginePayload
  > = {
    name: "phase-2d-throwing-smoke",
    version: "1.0.0",

    async execute(): Promise<
      GuidanceResult<SmokeEnginePayload>
    > {
      throw new Error(
        "Intentional Phase 2D smoke failure.",
      );
    },
  };

test(
  "canonical operational registry contains the Repository Context Engine",
  () => {
    const registry =
      createOperationalGuidanceRegistry();

    assert.equal(
      registry.has("repository-context"),
      true,
    );

    assert.equal(
      registry.get(
        "repository-context",
      )?.name,
      "repository-context",
    );

    assert.equal(
  registry.get(
    "repository-context",
  )?.version,
  "1.0.0",
);

assert.deepEqual(
  registry.names(),
  [
  "repository-context",
  "next-action",
  "blocking",
  "waiting-on",
  "composite-guidance",
  "operational-summary",
],
);
  },
);

test(
  "registry lookup normalizes engine names",
  () => {
    const registry =
      createOperationalGuidanceRegistry();

    assert.equal(
      registry.has(
        "  REPOSITORY-CONTEXT  ",
      ),
      true,
    );

    assert.equal(
      registry.get(
        "  REPOSITORY-CONTEXT  ",
      )?.name,
      "repository-context",
    );
  },
);

test(
  "unknown engine lookup returns null",
  () => {
    const registry =
      createOperationalGuidanceRegistry();

    assert.equal(
      registry.get(
        "engine-that-is-not-registered",
      ),
      null,
    );
  },
);

test(
  "duplicate engine registration is rejected",
  () => {
    const registry =
      createGuidanceEngineRegistry([
        deterministicEngine,
      ]);

    assert.throws(
      () => {
        registry.register(
          deterministicEngine,
        );
      },
      /already registered/i,
    );
  },
);

test(
  "executor preserves engine metadata, status, correlation ID, and source references",
  async () => {
    const outcome =
      await executeGuidanceEngine({
        engine:
          deterministicEngine,
        context:
          smokeContext,
        input: {
          value: "  guidance  ",
        },
      });

    assert.equal(
      outcome.result.status,
      "AVAILABLE",
    );

    assert.deepEqual(
      outcome.result.payload,
      {
        normalizedValue:
          "GUIDANCE",
      },
    );

    assert.equal(
      outcome.result.metadata
        .correlationId,
      SMOKE_CORRELATION_ID,
    );

    assert.equal(
      outcome.result.metadata
        .engineName,
      deterministicEngine.name,
    );

    assert.equal(
      outcome.result.metadata
        .engineVersion,
      deterministicEngine.version,
    );

    assert.equal(
      outcome.result
        .sourceReferences.length,
      1,
    );

    assert.equal(
      outcome.result
        .sourceReferences[0]
        ?.objectName,
      "PHASE_2D_SMOKE_REFERENCE",
    );

    assert.equal(
      outcome.trace.engineName,
      deterministicEngine.name,
    );

    assert.equal(
      outcome.trace.engineVersion,
      deterministicEngine.version,
    );

    assert.equal(
      outcome.trace.correlationId,
      SMOKE_CORRELATION_ID,
    );

    assert.equal(
      outcome.trace.status,
      "AVAILABLE",
    );

    assert.ok(
      outcome.trace.durationMs >= 0,
    );

    assert.ok(
      Date.parse(
        outcome.trace.completedAt,
      ) >=
        Date.parse(
          outcome.trace.startedAt,
        ),
    );
  },
);

test(
  "missing engine fails closed as UNAVAILABLE",
  async () => {
    const outcome =
      await executeGuidanceEngine<
        SmokeEngineInput,
        SmokeEnginePayload
      >({
        engine: null,
        context:
          smokeContext,
        input: {
          value: "guidance",
        },
      });

    assert.equal(
      outcome.result.status,
      "UNAVAILABLE",
    );

    assert.equal(
      outcome.result.failure?.code,
      "DEPENDENCY_FAILURE",
    );

    assert.equal(
      outcome.result.failure
        ?.retryable,
      false,
    );

    assert.equal(
      outcome.trace.engineName,
      "unregistered",
    );

    assert.equal(
      outcome.trace.engineVersion,
      "unknown",
    );

    assert.equal(
      outcome.trace.correlationId,
      SMOKE_CORRELATION_ID,
    );

    assert.equal(
      outcome.trace.status,
      "UNAVAILABLE",
    );
  },
);

test(
  "execution exception fails closed as ERROR",
  async () => {
    const outcome =
      await executeGuidanceEngine({
        engine:
          throwingEngine,
        context:
          smokeContext,
        input: {
          value: "guidance",
        },
      });

    assert.equal(
      outcome.result.status,
      "ERROR",
    );

    assert.equal(
      outcome.result.metadata
        .engineName,
      throwingEngine.name,
    );

    assert.equal(
      outcome.result.metadata
        .engineVersion,
      throwingEngine.version,
    );

    assert.equal(
      outcome.result.metadata
        .correlationId,
      SMOKE_CORRELATION_ID,
    );

    assert.equal(
      outcome.trace.engineName,
      throwingEngine.name,
    );

    assert.equal(
      outcome.trace.status,
      "ERROR",
    );

    assert.ok(
      outcome.result.failure,
    );
  },
);

test(
  "repeated deterministic execution returns equivalent Guidance results",
  async () => {
    const first =
      await executeGuidanceEngine({
        engine:
          deterministicEngine,
        context:
          smokeContext,
        input: {
          value: "guidance",
        },
      });

    const second =
      await executeGuidanceEngine({
        engine:
          deterministicEngine,
        context:
          smokeContext,
        input: {
          value: "guidance",
        },
      });

    assert.deepEqual(
      first.result,
      second.result,
    );

    assert.equal(
      first.trace.engineName,
      second.trace.engineName,
    );

    assert.equal(
      first.trace.engineVersion,
      second.trace.engineVersion,
    );

    assert.equal(
      first.trace.correlationId,
      second.trace.correlationId,
    );

    assert.equal(
      first.trace.status,
      second.trace.status,
    );
  },
);