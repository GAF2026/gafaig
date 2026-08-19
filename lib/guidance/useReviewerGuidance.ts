"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type ReviewerGuidanceStatus =
  | "AVAILABLE"
  | "BLOCKED"
  | "WAITING"
  | "INCOMPLETE"
  | "READY"
  | "NOT_ELIGIBLE"
  | "UNRESOLVED"
  | "UNAVAILABLE"
  | "UNAUTHORIZED"
  | "NOT_VISIBLE"
  | "INCONSISTENT"
  | "STALE"
  | "ERROR"
  | string;

export type ReviewerGuidanceNextAction = {
  readonly actionId?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly owner?: string | null;
  readonly relatedRepository?: string | null;
  readonly relatedStage?: string | null;
  readonly participantExplanation?: string | null;
};

export type ReviewerGuidanceExplanation = {
  readonly summary?: string | null;
  readonly ruleIds?: readonly string[];
  readonly facts?: readonly string[];
  readonly unresolvedConditions?: readonly string[];
};

export type ReviewerGuidanceFailure = {
  readonly code?: string | null;
  readonly message?: string | null;
  readonly retryable?: boolean;
};

export type ReviewerGuidanceSourceReference = {
  readonly sourceSystem?: string | null;
  readonly database?: string | null;
  readonly schema?: string | null;
  readonly objectName?: string | null;
  readonly recordId?: string | null;
  readonly observedAt?: string | null;
};

export type ReviewerOperationalRepositorySummary = {
  readonly repositoryCount: number;

  readonly repositoriesWithRecords:
    readonly string[];

  readonly emptyRepositories:
    readonly string[];

  readonly relationshipAvailability:
    string;
};

export type ReviewerOperationalBlockingSummary = {
  readonly status:
    ReviewerGuidanceStatus;

  readonly blocked:
    boolean | null;

  readonly conditionCount:
    number;

  readonly participantVisibleConditions:
    readonly string[];
};

export type ReviewerOperationalWaitingSummary = {
  readonly status:
    ReviewerGuidanceStatus;

  readonly waiting:
    boolean | null;

  readonly waitingOn:
    string | null;

  readonly currentOwner:
    string | null;

  readonly conditionCount:
    number;

  readonly participantVisibleConditions:
    readonly string[];
};

export type ReviewerOperationalSummary = {
  readonly organizationId:
    string;

  readonly caseId:
    string;

  readonly aggregatedStatus:
    ReviewerGuidanceStatus;

  readonly currentStage:
    string | null;

  readonly currentOwner:
    string | null;

  readonly nextRequiredAction:
    ReviewerGuidanceNextAction | null;

  readonly repositorySummary:
    ReviewerOperationalRepositorySummary;

  readonly blockingSummary:
    ReviewerOperationalBlockingSummary;

  readonly waitingSummary:
    ReviewerOperationalWaitingSummary;

  readonly completionSummary:
    null;

  readonly transitionSummary:
    null;

  readonly unresolvedConditions:
    readonly string[];

  readonly participantSummary:
    string;

  readonly explainabilityBasis?: {
    readonly componentStatuses?: {
      readonly repositoryContext?:
        ReviewerGuidanceStatus;

      readonly nextAction?:
        ReviewerGuidanceStatus;

      readonly blocking?:
        ReviewerGuidanceStatus;

      readonly waitingOn?:
        ReviewerGuidanceStatus;

      readonly composite?:
        ReviewerGuidanceStatus;
    };

    readonly appliedRuleIds?:
      readonly string[];

    readonly sourceReferenceCount?:
      number;
  };

  readonly observedAt:
    string;
};

export type ReviewerGuidanceResult<
  TPayload = Record<string, unknown>,
> = {
  readonly status?:
    ReviewerGuidanceStatus;

  readonly explanation?:
    ReviewerGuidanceExplanation;

  readonly sourceReferences?:
    readonly ReviewerGuidanceSourceReference[];

  readonly failure?:
    ReviewerGuidanceFailure;

  readonly payload?:
    TPayload;
};

export type ReviewerGuidanceComponents = {
  readonly repositoryContext?:
    ReviewerGuidanceResult;

  readonly nextAction?:
    ReviewerGuidanceResult;

  readonly blocking?:
    ReviewerGuidanceResult;

  readonly waitingOn?:
    ReviewerGuidanceResult;
};

export type ReviewerGuidanceScope = {
  readonly caseId?:
    string | null;

  readonly organizationId?:
    string | null;

  readonly participant?:
    string | null;
};

export type ReviewerGuidanceAuthorityBoundary = {
  readonly readOnly?:
    boolean;

  readonly automaticActionExecution?:
    boolean;

  readonly automaticBlockerResolution?:
    boolean;

  readonly automaticReassignment?:
    boolean;

  readonly automaticWaitingResolution?:
    boolean;

  readonly workflowMutation?:
    boolean;

  readonly repositoryMutation?:
    boolean;

  readonly governanceAuthority?:
    boolean;

  readonly certificationAuthority?:
    boolean;

  readonly publicationAuthority?:
    boolean;

  readonly registryAuthority?:
    boolean;

  readonly verificationAuthority?:
    boolean;

  readonly scoringAuthority?:
    boolean;
};

export type ReviewerGuidanceApiResponse = {
  readonly ok:
    boolean;

  readonly status?:
    ReviewerGuidanceStatus;

  readonly guidance?:
    ReviewerGuidanceResult;

  readonly components?:
    ReviewerGuidanceComponents | null;

  readonly traces?:
    unknown;

  readonly operationalSummary?:
    ReviewerGuidanceResult<
      ReviewerOperationalSummary
    > | null;

  readonly operationalSummaryTrace?:
    unknown;

  readonly scope?:
    ReviewerGuidanceScope;

  readonly authorityBoundary?:
    ReviewerGuidanceAuthorityBoundary;

  readonly error?:
    string;
};

export type ReviewerGuidanceLoadState =
  | "idle"
  | "loading"
  | "refreshing"
  | "success"
  | "error";

export type UseReviewerGuidanceResult = {
  readonly loading:
    boolean;

  readonly refreshing:
    boolean;

  readonly loadState:
    ReviewerGuidanceLoadState;

  readonly error:
    string | null;

  readonly guidance:
    ReviewerGuidanceApiResponse | null;

  readonly operationalSummary:
    ReviewerOperationalSummary | null;

  readonly components:
    ReviewerGuidanceComponents | null;

  readonly status:
    ReviewerGuidanceStatus | null;

  readonly scope:
    ReviewerGuidanceScope | null;

  readonly authorityBoundary:
    ReviewerGuidanceAuthorityBoundary | null;

  readonly lastUpdatedAt:
    string | null;

  readonly refresh:
    () => Promise<void>;
};

function guidanceErrorMessage(
  response:
    ReviewerGuidanceApiResponse,
  statusCode:
    number,
): string {
  return (
    response.error ||
    response.operationalSummary
      ?.failure
      ?.message ||
    response.operationalSummary
      ?.explanation
      ?.summary ||
    response.guidance
      ?.failure
      ?.message ||
    response.guidance
      ?.explanation
      ?.summary ||
    `Reviewer Operational Guidance request failed with status ${statusCode}.`
  );
}

function isAbortError(
  error:
    unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

function isRecord(
  value:
    unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

function isOperationalSummary(
  value:
    unknown,
): value is ReviewerOperationalSummary {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.organizationId ===
      "string" &&
    typeof value.caseId ===
      "string" &&
    typeof value.aggregatedStatus ===
      "string" &&
    typeof value.participantSummary ===
      "string" &&
    typeof value.observedAt ===
      "string" &&
    Array.isArray(
      value.unresolvedConditions,
    ) &&
    isRecord(
      value.repositorySummary,
    ) &&
    isRecord(
      value.blockingSummary,
    ) &&
    isRecord(
      value.waitingSummary,
    )
  );
}

/**
 * Loads reviewer Operational Guidance from the authenticated,
 * read-only administrative guidance endpoint.
 *
 * This hook:
 *
 * - executes no governance action;
 * - performs no assignment or reassignment;
 * - performs no blocker or waiting-state resolution;
 * - performs no workflow mutation;
 * - performs no repository mutation;
 * - creates no certification, publication, registry,
 *   verification, scoring, decision, or constitutional authority.
 */
export function useReviewerGuidance(
  caseId:
    string,
): UseReviewerGuidanceResult {
  const [
    loadState,
    setLoadState,
  ] =
    useState<ReviewerGuidanceLoadState>(
      "idle",
    );

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    guidance,
    setGuidance,
  ] =
    useState<
      ReviewerGuidanceApiResponse | null
    >(null);

  const [
    lastUpdatedAt,
    setLastUpdatedAt,
  ] =
    useState<string | null>(
      null,
    );

  const activeRequestIdRef =
    useRef(0);

  const abortControllerRef =
    useRef<AbortController | null>(
      null,
    );

  const mountedRef =
    useRef(true);

  const loadGuidance =
    useCallback(
      async (
        mode:
          "initial" | "refresh" =
          "refresh",
      ): Promise<void> => {
        const normalizedCaseId =
          caseId.trim();

        if (!normalizedCaseId) {
          if (!mountedRef.current) {
            return;
          }

          setGuidance(null);

          setError(
            "A case identifier is required to load Reviewer Operational Guidance.",
          );

          setLoadState("error");
          return;
        }

        abortControllerRef.current
          ?.abort();

        const controller =
          new AbortController();

        abortControllerRef.current =
          controller;

        const requestId =
          activeRequestIdRef.current +
          1;

        activeRequestIdRef.current =
          requestId;

        setLoadState(
          mode === "initial"
            ? "loading"
            : "refreshing",
        );

        setError(null);

        try {
          const response =
            await fetch(
              `/api/admin/verification/${encodeURIComponent(
                normalizedCaseId,
              )}/guidance`,
              {
                method:
                  "GET",

                cache:
                  "no-store",

                signal:
                  controller.signal,

                headers: {
                  Accept:
                    "application/json",
                },
              },
            );

          const result =
            (await response.json()) as
              ReviewerGuidanceApiResponse;

          if (
            !mountedRef.current ||
            requestId !==
              activeRequestIdRef.current
          ) {
            return;
          }

          setGuidance(result);

          if (!response.ok) {
            setError(
              guidanceErrorMessage(
                result,
                response.status,
              ),
            );

            setLoadState("error");
            return;
          }

          setLastUpdatedAt(
            new Date().toISOString(),
          );

          setLoadState("success");
        } catch (requestError) {
          if (
            isAbortError(
              requestError,
            ) ||
            !mountedRef.current ||
            requestId !==
              activeRequestIdRef.current
          ) {
            return;
          }

          setError(
            requestError instanceof Error
              ? requestError.message
              : "Reviewer Operational Guidance could not be loaded.",
          );

          setLoadState("error");
        }
      },
      [caseId],
    );

  useEffect(() => {
    mountedRef.current = true;

    void loadGuidance(
      "initial",
    );

    return () => {
      mountedRef.current =
        false;

      abortControllerRef.current
        ?.abort();
    };
  }, [loadGuidance]);

  const operationalSummaryPayload =
    guidance
      ?.operationalSummary
      ?.payload;

  return {
    loading:
      loadState === "loading",

    refreshing:
      loadState === "refreshing",

    loadState,
    error,
    guidance,

    operationalSummary:
      isOperationalSummary(
        operationalSummaryPayload,
      )
        ? operationalSummaryPayload
        : null,

    components:
      guidance?.components ??
      null,

    status:
      guidance?.status ??
      guidance?.guidance
        ?.status ??
      guidance
        ?.operationalSummary
        ?.status ??
      null,

    scope:
      guidance?.scope ??
      null,

    authorityBoundary:
      guidance?.authorityBoundary ??
      null,

    lastUpdatedAt,

    refresh:
      async () => {
        await loadGuidance(
          "refresh",
        );
      },
  };
}
