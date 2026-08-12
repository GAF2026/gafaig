import {
  resolveRepositoryContext,
} from "./repositoryContextService";

import {
  resolveNextAction,
} from "./nextActionService";

import {
  resolveBlocking,
} from "./blockingService";

import {
  resolveWaitingOn,
} from "./waitingOnService";

import {
  resolveCompositeGuidance,
} from "./compositeGuidanceService";

import {
  resolveOperationalSummary,
} from "./operationalSummaryService";

import {
  buildWorkspaceGuidanceSnapshot,
} from "./workspaceGuidance";

import type {
  GuidanceApiResolution,
  GuidanceApiView,
} from "./guidanceApiTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

export interface ResolveGuidanceApiRequest {
  readonly context:
    GuidanceContext;

  readonly view:
    GuidanceApiView;

  readonly includeEmptyRepositories?:
    boolean;
}

/**
 * Canonical dispatcher for the consolidated Operational Guidance API.
 *
 * Exactly one service path is executed for each request.
 *
 * The Composite path resolves Repository Context once and executes the
 * dependent engines against that same authoritative payload.
 *
 * The Operational Summary path resolves Composite Guidance once and passes
 * that already-resolved execution to the Operational Summary service. It does
 * not rerun Repository Context, Next Action, Blocking, Waiting-On, or
 * Composite Guidance recursively.
 */
export async function resolveGuidanceApiRequest(
  request:
    ResolveGuidanceApiRequest,
): Promise<GuidanceApiResolution> {
  const includeEmptyRepositories =
    request.includeEmptyRepositories ??
    true;

  switch (request.view) {
    case "repository-context": {
      const response =
        await resolveRepositoryContext({
          context:
            request.context,

          includeEmptyRepositories,
        });

      return {
        view:
          request.view,

        result:
          response.result as
            GuidanceResult<unknown>,

        components:
          null,

        workspace:
          null,

        traces: {
          repositoryContext:
            response.trace,
        },
      };
    }

    case "next-action": {
      const response =
        await resolveNextAction({
          context:
            request.context,

          includeEmptyRepositories,
        });

      return {
        view:
          request.view,

        result:
          response.result as
            GuidanceResult<unknown>,

        components:
          null,

        workspace:
          null,

        traces: {
          repositoryContext:
            response
              .repositoryContext
              .trace,

          nextAction:
            response.trace,
        },
      };
    }

    case "blocking": {
      const response =
        await resolveBlocking({
          context:
            request.context,

          includeEmptyRepositories,
        });

      return {
        view:
          request.view,

        result:
          response.result as
            GuidanceResult<unknown>,

        components:
          null,

        workspace:
          null,

        traces: {
          repositoryContext:
            response
              .repositoryContext
              .trace,

          blocking:
            response.trace,
        },
      };
    }

    case "waiting-on": {
      const response =
        await resolveWaitingOn({
          context:
            request.context,

          includeEmptyRepositories,
        });

      return {
        view:
          request.view,

        result:
          response.result as
            GuidanceResult<unknown>,

        components:
          null,

        workspace:
          null,

        traces: {
          repositoryContext:
            response
              .repositoryContext
              .trace,

          waitingOn:
            response.trace,
        },
      };
    }

    case "operational-summary": {
      /*
       * Resolve the complete dependency execution exactly once.
       */
      const composite =
        await resolveCompositeGuidance({
          context:
            request.context,

          includeEmptyRepositories,
        });

      /*
       * Consume the already-resolved Composite execution.
       *
       * resolveOperationalSummary() does not call resolveCompositeGuidance()
       * and therefore does not recursively repeat the dependency chain.
       */
      const summary =
        await resolveOperationalSummary({
          context:
            request.context,

          composite,
        });

      const result =
        summary.result as
          GuidanceResult<unknown>;

      return {
        view:
          "operational-summary",

        result,

        components:
          composite.components,

        workspace:
          buildWorkspaceGuidanceSnapshot(
            composite.components,
            result,
          ),

        traces: {
          repositoryContext:
            composite.traces
              .repositoryContext,

          nextAction:
            composite.traces
              .nextAction,

          blocking:
            composite.traces
              .blocking,

          waitingOn:
            composite.traces
              .waitingOn,

          composite:
            composite.traces
              .composite,

          operationalSummary:
            summary.trace,
        },
      };
    }

    case "composite":
    default: {
      const response =
        await resolveCompositeGuidance({
          context:
            request.context,

          includeEmptyRepositories,
        });

      const result =
        response.result as
          GuidanceResult<unknown>;

      return {
        view:
          "composite",

        result,

        components:
          response.components,

        workspace:
          buildWorkspaceGuidanceSnapshot(
            response.components,
            result,
          ),

        traces:
          response.traces,
      };
    }
  }
}