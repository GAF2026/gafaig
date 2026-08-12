import {
  cookies,
  headers,
} from "next/headers";

import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

import {
  ApplicantGuidancePanel,
} from "@/components/applicant/guidance";

type ApplicantCaseDetailResponse = {
  ok: boolean;

  organization?: {
    organizationId: string;
    organizationName: string;
  };

  case?: {
    caseId: string;
    organizationName: string;
    email: string | null;
    status: string;
    stage: string;
    updatedAt: string | null;
  };

  workflow?: {
    submissionReceived: boolean;
    informationRequest: boolean;
    deficiencyNotice: boolean;
    responseSubmitted: boolean;
    review: boolean;
    certification: boolean;
    published: boolean;
  };

  counts?: {
    openRequests: number;
    uploadedEvidence: number;
    artifacts: number;
    certifications: number;
    requestResponseRecords: number;
    remediationRecords: number;
    repositoryActivity: number;
  };

  lifecycle?: {
    reviewStatus: string;
    decisionStatus: string;
    repositoryRecord: boolean;
  };

  error?: string;
};

async function getBaseUrl() {
  const h =
    await headers();

  const host =
    h.get("x-forwarded-host") ??
    h.get("host");

  const proto =
    h.get("x-forwarded-proto") ??
    "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

async function getApplicantCase(
  caseId:
    string,
): Promise<ApplicantCaseDetailResponse> {
  const baseUrl =
    await getBaseUrl();

  const cookieHeader =
    cookies()
      .getAll()
      .map(
        (cookie) =>
          `${cookie.name}=${cookie.value}`,
      )
      .join("; ");

  try {
    const res =
      await fetch(
        `${baseUrl}/api/applicant/cases/${encodeURIComponent(
          caseId,
        )}`,
        {
          cache:
            "no-store",

          headers: {
            cookie:
              cookieHeader,
          },
        },
      );

    const json =
      (await res.json()) as
        ApplicantCaseDetailResponse;

    if (
      res.ok &&
      json.ok
    ) {
      return json;
    }

    return {
      ok:
        false,

      error:
        json.error ||
        `Case request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok:
        false,

      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant case.",
    };
  }
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>

      <div className="mt-4 break-words text-[16px] font-semibold leading-7 tracking-tight text-black">
        {value || "—"}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>

      <div className="mt-4 text-[32px] font-semibold leading-none tracking-tight text-black sm:text-[36px]">
        {value}
      </div>
    </div>
  );
}

function StatusLabel({
  value,
}: {
  value:
    string;
}) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/65">
      {value}
    </span>
  );
}

function WorkflowStep({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {complete
          ? "Complete"
          : "Pending"}
      </div>

      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {label}
      </div>

      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {complete
          ? "This workflow stage is currently visible as complete for this applicant case."
          : "This workflow stage is not currently marked complete for this applicant case."}
      </p>
    </div>
  );
}

function WorkflowNavigationCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>

      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {body}
      </p>

      <div className="mt-5">
        <PublicButtonLink
          href={href}
          variant="secondary"
          size="sm"
        >
          {cta}
        </PublicButtonLink>
      </div>
    </div>
  );
}

export default async function ApplicantCaseDetailPage({
  params,
}: {
  params: {
    caseId: string;
  };
}) {
  const caseId =
    params.caseId;

  const data =
    await getApplicantCase(
      caseId,
    );

  if (
    !data.ok ||
    !data.case
  ) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant case unavailable"
            description="The requested applicant case could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant case access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink
                  href="/applicant/cases"
                  variant="primary"
                >
                  Back to Cases
                </PublicButtonLink>

                <PublicButtonLink
                  href="/applicant/dashboard"
                  variant="secondary"
                >
                  Dashboard
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const applicantCase =
    data.case;

  const counts =
    data.counts || {
      openRequests: 0,
      uploadedEvidence: 0,
      artifacts: 0,
      certifications: 0,
      requestResponseRecords: 0,
      remediationRecords: 0,
      repositoryActivity: 0,
    };

  const lifecycle =
    data.lifecycle || {
      reviewStatus:
        "PENDING_REVIEW",

      decisionStatus:
        "NOT_READY_FOR_DECISION",

      repositoryRecord:
        false,
    };

  const workflow =
    data.workflow || {
      submissionReceived:
        false,

      informationRequest:
        false,

      deficiencyNotice:
        false,

      responseSubmitted:
        false,

      review:
        false,

      certification:
        false,

      published:
        false,
    };

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT CASE"
          title={applicantCase.caseId}
          description={`Organization-scoped applicant case visibility for ${applicantCase.organizationName}.`}
          secondaryDescription="Applicant case detail pages expose operational workflow and repository lifecycle visibility only. They do not create scoring authority, decision authority, certification authority, registry authority, publication authority, or verification authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/cases"
                variant="primary"
              >
                Back to Cases
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/dashboard"
                variant="secondary"
              >
                Dashboard
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/progress"
                variant="secondary"
              >
                Progress
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Case summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant case status and organization context
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard
              label="Case ID"
              value={
                applicantCase.caseId
              }
            />

            <SummaryCard
              label="Status"
              value={
                applicantCase.status
              }
            />

            <SummaryCard
              label="Stage"
              value={
                applicantCase.stage
              }
            />

            <SummaryCard
              label="Organization"
              value={
                applicantCase.organizationName
              }
            />

            <SummaryCard
              label="Contact Email"
              value={
                applicantCase.email ||
                "No contact email"
              }
            />

            <SummaryCard
              label="Last Updated"
              value={
                applicantCase.updatedAt ||
                "No recent update"
              }
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Lifecycle status
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Review and decision visibility
          </h2>

          <div className="mt-6 flex flex-wrap gap-2">
            <StatusLabel
              value={
                lifecycle.reviewStatus
              }
            />

            <StatusLabel
              value={
                lifecycle.decisionStatus
              }
            />

            <StatusLabel
              value={
                lifecycle.repositoryRecord
                  ? "Repository Record"
                  : "Workflow Only"
              }
            />
          </div>
        </section>

        <ApplicantGuidancePanel
          caseId={
            applicantCase.caseId
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Repository activity
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Case-linked persisted repository records
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            These counts summarize persisted applicant repository records where
            available. They are visibility fields only and do not mutate
            evidence, certification, publication, registry, decision, or
            governance authority state.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard
              label="Repository Activity"
              value={
                counts.repositoryActivity
              }
            />

            <MetricCard
              label="Evidence Records"
              value={
                counts.uploadedEvidence
              }
            />

            <MetricCard
              label="Artifact Records"
              value={
                counts.artifacts
              }
            />

            <MetricCard
              label="Request Responses"
              value={
                counts.requestResponseRecords
              }
            />

            <MetricCard
              label="Remediation Records"
              value={
                counts.remediationRecords
              }
            />

            <MetricCard
              label="Certification Records"
              value={
                counts.certifications
              }
            />

            <MetricCard
              label="Open Requests"
              value={
                counts.openRequests
              }
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Applicant workflow timeline
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Case progress visibility
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <WorkflowStep
              label="Submission Received"
              complete={
                workflow.submissionReceived
              }
            />

            <WorkflowStep
              label="Information Request"
              complete={
                workflow.informationRequest
              }
            />

            <WorkflowStep
              label="Deficiency Notice"
              complete={
                workflow.deficiencyNotice
              }
            />

            <WorkflowStep
              label="Response Submitted"
              complete={
                workflow.responseSubmitted
              }
            />

            <WorkflowStep
              label="Review"
              complete={
                workflow.review
              }
            />

            <WorkflowStep
              label="Certification"
              complete={
                workflow.certification
              }
            />

            <WorkflowStep
              label="Published"
              complete={
                workflow.published
              }
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Case workflow hub
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Open case-related applicant workflows
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <WorkflowNavigationCard
              title="Requests"
              body="Review applicant information requests and submit responses where available."
              href="/applicant/requests"
              cta="Open requests"
            />

            <WorkflowNavigationCard
              title="Evidence"
              body="Review submitted evidence records and upload applicant evidence."
              href="/applicant/evidence"
              cta="Open evidence"
            />

            <WorkflowNavigationCard
              title="Artifacts"
              body="Review preserved applicant artifacts and upload artifact records."
              href="/applicant/artifacts"
              cta="Open artifacts"
            />

            <WorkflowNavigationCard
              title="Deficiencies"
              body="Review deficiency visibility for applicant workflow records."
              href="/applicant/deficiencies"
              cta="Open deficiencies"
            />

            <WorkflowNavigationCard
              title="Remediation"
              body="Review remediation records and submit applicant remediation responses."
              href="/applicant/remediation"
              cta="Open remediation"
            />

            <WorkflowNavigationCard
              title="Certification"
              body="Review certification repository visibility and lifecycle status."
              href="/applicant/certifications"
              cta="Open certifications"
            />

            <WorkflowNavigationCard
              title="Review status"
              body="Review applicant-facing governance review status visibility."
              href="/applicant/review-status"
              cta="Open review"
            />

            <WorkflowNavigationCard
              title="Decision status"
              body="Review applicant-facing decision status visibility."
              href="/applicant/decision-status"
              cta="Open decision"
            />

            <WorkflowNavigationCard
              title="Progress"
              body="Review applicant lifecycle progress and case-level activity."
              href="/applicant/progress"
              cta="Open progress"
            />
          </div>
        </section>
      </div>
    </main>
  );
}