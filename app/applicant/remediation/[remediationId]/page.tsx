import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RemediationDetail = {
  remediationId: string;
  evidenceId: string | null;
  deficiencyId: string;
  caseId: string;
  requestId: string;
  organizationName: string;
  email: string | null;
  submittedBy: string | null;
  remediationType: string;
  remediationStatus: string;
  caseStatus: string;
  source: string;
  title: string;
  description: string | null;
  sourceUrl: string | null;
  responseSubmitted: boolean;
  reviewPending: boolean;
  governanceDecisionPending: boolean;
  submittedAt: string | null;
  reviewedAt: string | null;
  updatedAt: string | null;
  repositoryCategory: string;
  workflowOrigin: string;
  workflowStage: string;
  remediationReadiness: string;
  repositoryHealth: string;
  ageDays: number | null;
  isOpen: boolean;
  isCompleted: boolean;
  isPendingApplicant: boolean;
  isPendingReview: boolean;
  authorityBoundaryText: string;
};

type RemediationAuthorityBoundaries = {
  applicantMayViewRemediation: boolean;
  applicantMaySubmitRemediation: boolean;
  applicantMayModifyFindings: boolean;
  applicantMayModifyScoring: boolean;
  applicantMayModifyDecision: boolean;
  applicantMayModifyCertification: boolean;
  applicantMayModifyRegistry: boolean;
  applicantMayPublish: boolean;
};

type RemediationDetailResponse = {
  ok: boolean;
  error?: string;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  remediation?: RemediationDetail;
  workflow?: Array<{
    stage: string;
    status: string;
  }>;
  authorityBoundaries?: RemediationAuthorityBoundaries;
};

function value(input: unknown, fallback = "Not available") {
  const text = String(input ?? "").trim();

  return text || fallback;
}

function badge(input: unknown) {
  return value(input, "UNKNOWN").toUpperCase();
}

function yesNo(input: boolean | undefined) {
  return input ? "YES" : "NO";
}

function ageLabel(input: number | null | undefined) {
  if (typeof input !== "number") {
    return "Unavailable";
  }

  return `${input} day${input === 1 ? "" : "s"}`;
}

async function getRemediation(remediationId: string) {
  const h = await headers();

  const host =
    h.get("x-forwarded-host") ??
    h.get("host");

  const proto =
    h.get("x-forwarded-proto") ??
    "http";

  const baseUrl = host
    ? `${proto}://${host}`
    : "http://localhost:3000";

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/remediation/${encodeURIComponent(
        remediationId,
      )}`,
      {
        cache: "no-store",
        headers: {
          cookie: h.get("cookie") ?? "",
        },
      },
    );

    const json = (await res.json()) as RemediationDetailResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error:
        json.error ??
        `Remediation detail failed with status ${res.status}`,
    } satisfies RemediationDetailResponse;
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load remediation detail.",
    } satisfies RemediationDetailResponse;
  }
}

function InfoCard({
  label,
  value: cardValue,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </p>

      <p className="mt-3 break-words text-sm font-semibold">
        {cardValue}
      </p>
    </div>
  );
}

function WorkflowCard({
  stage,
  status,
}: {
  stage: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
        {badge(status)}
      </p>

      <p className="mt-3 text-sm font-semibold">
        {stage}
      </p>
    </div>
  );
}

function BoundaryCard({
  label,
  allowed,
}: {
  label: string;
  allowed: boolean;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
        Authority boundary
      </p>

      <p className="mt-3 text-sm font-semibold">
        {label}
      </p>

      <p className="mt-2 text-sm text-neutral-600">
        {allowed
          ? "Allowed for applicant users."
          : "Not allowed for applicant users."}
      </p>
    </div>
  );
}

export default async function ApplicantRemediationDetailPage({
  params,
}: {
  params: {
    remediationId: string;
  };
}) {
  const remediationId = decodeURIComponent(
    params.remediationId,
  );

  const data = await getRemediation(remediationId);

  if (!data.ok || !data.remediation) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <section className="rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            GAFAIG applicant portal
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Remediation unavailable
          </h1>

          <p className="mt-4 text-sm text-neutral-600">
            {data.error ??
              "The requested remediation record could not be loaded."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-black px-4 py-2 text-sm text-white"
              href="/applicant/remediation"
            >
              Back to remediation
            </Link>

            <Link
              className="rounded-full border px-4 py-2 text-sm"
              href="/applicant/dashboard"
            >
              Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const remediation = data.remediation;
  const workflow = data.workflow ?? [];

  const authorityBoundaries =
    data.authorityBoundaries ?? {
      applicantMayViewRemediation: true,
      applicantMaySubmitRemediation: true,
      applicantMayModifyFindings: false,
      applicantMayModifyScoring: false,
      applicantMayModifyDecision: false,
      applicantMayModifyCertification: false,
      applicantMayModifyRegistry: false,
      applicantMayPublish: false,
    };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          GAFAIG applicant remediation
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {value(remediation.remediationId, remediationId)}
        </h1>

        <p className="mt-4 text-sm text-neutral-600">
          Organization-scoped remediation repository visibility for{" "}
          {value(
            remediation.organizationName ||
              data.organization?.organizationName,
          )}
          .
        </p>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Remediation detail pages expose repository visibility, workflow
          visibility, lifecycle visibility, and applicant remediation
          submission only. They do not create findings authority, scoring
          authority, decision authority, certification authority, registry
          authority, publication authority, verification authority, or
          governance authority.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-black px-4 py-2 text-sm text-white"
            href="/applicant/remediation"
          >
            Back to Remediation
          </Link>

          <Link
            className="rounded-full border px-4 py-2 text-sm"
            href="/applicant/remediation/submit"
          >
            Submit Remediation
          </Link>

          <Link
            className="rounded-full border px-4 py-2 text-sm"
            href={`/applicant/deficiencies/${encodeURIComponent(
              remediation.deficiencyId,
            )}`}
          >
            Open Deficiency
          </Link>

          <Link
            className="rounded-full border px-4 py-2 text-sm"
            href={`/applicant/cases/${encodeURIComponent(
              remediation.caseId,
            )}`}
          >
            Open Case
          </Link>

          <Link
            className="rounded-full border px-4 py-2 text-sm"
            href="/applicant/progress"
          >
            Progress
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Remediation summary
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Remediation status and deficiency context
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            label="Remediation ID"
            value={value(remediation.remediationId)}
          />

          <InfoCard
            label="Evidence ID"
            value={value(remediation.evidenceId)}
          />

          <InfoCard
            label="Deficiency ID"
            value={value(remediation.deficiencyId)}
          />

          <InfoCard
            label="Case ID"
            value={value(remediation.caseId)}
          />

          <InfoCard
            label="Request ID"
            value={value(remediation.requestId)}
          />

          <InfoCard
            label="Remediation Type"
            value={value(remediation.remediationType)}
          />

          <InfoCard
            label="Status"
            value={value(remediation.remediationStatus)}
          />

          <InfoCard
            label="Case Status"
            value={value(remediation.caseStatus)}
          />

          <InfoCard
            label="Organization"
            value={value(remediation.organizationName)}
          />

          <InfoCard
            label="Contact Email"
            value={value(remediation.email)}
          />

          <InfoCard
            label="Submitted By"
            value={value(remediation.submittedBy)}
          />

          <InfoCard
            label="Submitted At"
            value={value(remediation.submittedAt)}
          />

          <InfoCard
            label="Reviewed At"
            value={value(remediation.reviewedAt)}
          />

          <InfoCard
            label="Updated At"
            value={value(remediation.updatedAt)}
          />

          <InfoCard
            label="Source"
            value={value(remediation.source)}
          />

          <InfoCard
            label="Source URL"
            value={value(remediation.sourceUrl)}
          />

          <InfoCard
            label="Response Submitted"
            value={yesNo(remediation.responseSubmitted)}
          />

          <InfoCard
            label="Review Pending"
            value={yesNo(remediation.reviewPending)}
          />

          <InfoCard
            label="Governance Decision Pending"
            value={yesNo(
              remediation.governanceDecisionPending,
            )}
          />
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Repository metadata
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Derived remediation repository metadata
        </h2>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Derived metadata improves operational visibility and lifecycle
          awareness only. It does not alter Snowflake authority or create
          governance authority.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            label="Repository Category"
            value={value(
              remediation.repositoryCategory,
              "Remediation Repository",
            )}
          />

          <InfoCard
            label="Workflow Origin"
            value={value(
              remediation.workflowOrigin,
              "Applicant Workflow",
            )}
          />

          <InfoCard
            label="Workflow Stage"
            value={value(
              remediation.workflowStage,
              "REMEDIATION",
            )}
          />

          <InfoCard
            label="Remediation Readiness"
            value={value(
              remediation.remediationReadiness,
              "Not classified",
            )}
          />

          <InfoCard
            label="Repository Health"
            value={value(
              remediation.repositoryHealth,
              "Not classified",
            )}
          />

          <InfoCard
            label="Age"
            value={ageLabel(remediation.ageDays)}
          />

          <InfoCard
            label="Open"
            value={yesNo(remediation.isOpen)}
          />

          <InfoCard
            label="Completed"
            value={yesNo(remediation.isCompleted)}
          />

          <InfoCard
            label="Pending Applicant"
            value={yesNo(remediation.isPendingApplicant)}
          />

          <InfoCard
            label="Pending Review"
            value={yesNo(remediation.isPendingReview)}
          />
        </div>

        <p className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-7 text-neutral-600">
          {value(
            remediation.authorityBoundaryText,
            "Operational remediation repository visibility and applicant remediation submission only. No findings, scoring, decision, certification, registry, publication, verification, or governance authority is created.",
          )}
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Remediation content
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Applicant remediation response
        </h2>

        <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
          <p className="text-sm font-semibold">
            {value(remediation.title)}
          </p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-600">
            {value(
              remediation.description,
              "No remediation description provided.",
            )}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Remediation workflow
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Remediation lifecycle visibility
        </h2>

        {workflow.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
            <p className="text-sm font-semibold">
              No remediation workflow is currently available
            </p>

            <p className="mt-2 text-sm text-neutral-600">
              Workflow stages will appear when remediation lifecycle data
              is available.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {workflow.map((item) => (
              <WorkflowCard
                key={`${item.stage}-${item.status}`}
                stage={item.stage}
                status={item.status}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Applicant authority boundaries
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Remediation visibility does not grant governance authority
        </h2>

        <p className="mt-4 text-sm leading-7 text-neutral-600">
          Applicant users may view and submit remediation through
          authorized operational workflows. They may not alter findings,
          scoring, decisions, certification, publication, registry, or
          governance authority.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <BoundaryCard
            label="View remediation"
            allowed={
              authorityBoundaries.applicantMayViewRemediation
            }
          />

          <BoundaryCard
            label="Submit remediation"
            allowed={
              authorityBoundaries.applicantMaySubmitRemediation
            }
          />

          <BoundaryCard
            label="Modify findings"
            allowed={
              authorityBoundaries.applicantMayModifyFindings
            }
          />

          <BoundaryCard
            label="Modify scoring"
            allowed={
              authorityBoundaries.applicantMayModifyScoring
            }
          />

          <BoundaryCard
            label="Modify decision"
            allowed={
              authorityBoundaries.applicantMayModifyDecision
            }
          />

          <BoundaryCard
            label="Modify certification"
            allowed={
              authorityBoundaries.applicantMayModifyCertification
            }
          />

          <BoundaryCard
            label="Modify registry"
            allowed={
              authorityBoundaries.applicantMayModifyRegistry
            }
          />

          <BoundaryCard
            label="Publish"
            allowed={
              authorityBoundaries.applicantMayPublish
            }
          />
        </div>
      </section>
    </main>
  );
}