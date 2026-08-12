"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type ApplicantGuidanceStatus =
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

export type ApplicantGuidanceNextAction = {
  readonly actionId?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly owner?: string | null;
  readonly relatedRepository?: string | null;
  readonly relatedStage?: string | null;
  readonly participantExplanation?: string | null;
};

export type ApplicantGuidanceExplanation = {
  readonly summary?: string | null;
  readonly ruleIds?: readonly string[];
  readonly facts?: readonly string[];
  readonly unresolvedConditions?: readonly string[];
};

export type ApplicantGuidanceFailure = {
  readonly code?: string | null;
  readonly message?: string | null;
  readonly retryable?: boolean;
};

export type ApplicantGuidanceSourceReference = {
  readonly sourceSystem?: string | null;
  readonly database?: string | null;
  readonly schema?: string | null;
  readonly objectName?: string | null;
  readonly recordId?: string | null;
  readonly observedAt?: string | null;
};

export type ApplicantOperationalRepositorySummary = {
  readonly repositoryCount:
    number;

  readonly repositoriesWithRecords:
    readonly string[];

  readonly emptyRepositories:
    readonly string[];

  readonly relationshipAvailability:
    string;
};

export type ApplicantOperationalBlockingSummary = {
  readonly status:
    ApplicantGuidanceStatus;

  readonly blocked:
    boolean | null;

  readonly conditionCount:
    number;

  readonly participantVisibleConditions:
    readonly string[];
};

export type ApplicantOperationalWaitingSummary = {
  readonly status:
    ApplicantGuidanceStatus;

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

export type ApplicantOperationalSummary = {
  readonly organizationId:
    string;

  readonly caseId:
    string;

  readonly aggregatedStatus:
    ApplicantGuidanceStatus;

  readonly currentStage:
    string | null;

  readonly currentOwner:
    string | null;

  readonly nextRequiredAction:
    ApplicantGuidanceNextAction | null;

  readonly repositorySummary:
    ApplicantOperationalRepositorySummary;

  readonly blockingSummary:
    ApplicantOperationalBlockingSummary;

  readonly waitingSummary:
    ApplicantOperationalWaitingSummary;

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
        ApplicantGuidanceStatus;

      readonly nextAction?:
        ApplicantGuidanceStatus;

      readonly blocking?:
        ApplicantGuidanceStatus;

      readonly waitingOn?:
        ApplicantGuidanceStatus;

      readonly composite?:
        ApplicantGuidanceStatus;
    };

    readonly appliedRuleIds?:
      readonly string[];

    readonly sourceReferenceCount?:
      number;
  };

  readonly observedAt:
    string;
};

export type ApplicantGuidanceResult = {
  readonly status?:
    ApplicantGuidanceStatus;

  readonly explanation?:
    ApplicantGuidanceExplanation;

  readonly sourceReferences?:
    readonly ApplicantGuidanceSourceReference[];

  readonly failure?:
    ApplicantGuidanceFailure;

  readonly payload?:
    ApplicantOperationalSummary |
    Record<string, unknown>;
};

export type ApplicantGuidanceComponents = {
  readonly repositoryContext?:
    ApplicantGuidanceResult;

  readonly nextAction?:
    ApplicantGuidanceResult;

  readonly blocking?:
    ApplicantGuidanceResult;

  readonly waitingOn?:
    ApplicantGuidanceResult;
};

export type ApplicantWorkspaceGuidance = {
  readonly organizationId:
    string | null;

  readonly caseId:
    string | null;

  readonly overallStatus:
    ApplicantGuidanceStatus;

  readonly repositoryContextStatus:
    ApplicantGuidanceStatus;

  readonly nextActionStatus:
    ApplicantGuidanceStatus;

  readonly blockingStatus:
    ApplicantGuidanceStatus;

  readonly waitingOnStatus:
    ApplicantGuidanceStatus;

  readonly workflowStatus:
    string | null;

  readonly workflowStage:
    string | null;

  readonly nextAction:
    ApplicantGuidanceNextAction | null;

  readonly blocked:
    boolean | null;

  readonly blockingConditionCount:
    number;

  readonly waiting:
    boolean | null;

  readonly waitingOn:
    string | null;

  readonly currentOwner:
    string | null;

  readonly observedAt:
    string | null;
};

export type ApplicantGuidanceAuthorityBoundary = {
  readonly readOnly?: boolean;
  readonly automaticActionExecution?: boolean;
  readonly automaticBlockerResolution?: boolean;
  readonly automaticReassignment?: boolean;
  readonly automaticWaitingResolution?: boolean;
  readonly workflowMutation?: boolean;
  readonly repositoryMutation?: boolean;
  readonly governanceAuthority?: boolean;
  readonly certificationAuthority?: boolean;
  readonly publicationAuthority?: boolean;
  readonly registryAuthority?: boolean;
  readonly verificationAuthority?: boolean;
};

export type ApplicantGuidanceApiResponse = {
  readonly ok: boolean;
  readonly view?: string;

  readonly status?:
    ApplicantGuidanceStatus;

  readonly guidance?:
    ApplicantGuidanceResult;

  readonly components?:
    ApplicantGuidanceComponents | null;

  readonly workspace?:
    ApplicantWorkspaceGuidance | null;

  readonly authorityBoundary?:
    ApplicantGuidanceAuthorityBoundary;

  readonly error?: string;
};

export type ApplicantGuidanceLoadState =
  | "idle"
  | "loading"
  | "refreshing"
  | "success"
  | "error";

export type UseApplicantGuidanceResult = {
  readonly loading:
    boolean;

  readonly refreshing:
    boolean;

  readonly loadState:
    ApplicantGuidanceLoadState;

  readonly error:
    string | null;

  readonly guidance:
    ApplicantGuidanceApiResponse | null;

  readonly operationalSummary:
    ApplicantOperationalSummary | null;

  readonly components:
    ApplicantGuidanceComponents | null;

  readonly workspace:
    ApplicantWorkspaceGuidance | null;

  readonly status:
    ApplicantGuidanceStatus | null;

  readonly lastUpdatedAt:
    string | null;

  readonly refresh:
    () => Promise<void>;
};

function guidanceErrorMessage(
  response:
    ApplicantGuidanceApiResponse,
  statusCode:
    number,
): string {
  return (
    response.error ||
    response.guidance
      ?.failure
      ?.message ||
    response.guidance
      ?.explanation
      ?.summary ||
    `Operational Guidance request failed with status ${statusCode}.`
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
): value is ApplicantOperationalSummary {
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

export function useApplicantGuidance(
  caseId:
    string,
): UseApplicantGuidanceResult {
  const [
    loadState,
    setLoadState,
  ] =
    useState<ApplicantGuidanceLoadState>(
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
      ApplicantGuidanceApiResponse | null
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
            "A case identifier is required to load Operational Guidance.",
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
              `/api/applicant/guidance/${encodeURIComponent(
                normalizedCaseId,
              )}?view=operational-summary`,
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
              ApplicantGuidanceApiResponse;

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
            requestError instanceof
              Error
              ? requestError.message
              : "Operational Guidance could not be loaded.",
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

  const payload =
    guidance?.guidance?.payload;

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
        payload,
      )
        ? payload
        : null,

    components:
      guidance?.components ??
      null,

    workspace:
      guidance?.workspace ??
      null,

    status:
      guidance?.status ??
      guidance?.guidance
        ?.status ??
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