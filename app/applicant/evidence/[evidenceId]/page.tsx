import { cookies, headers } from "next/headers";

import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type ApplicantEvidenceDetailResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  evidence?: {
    evidenceId: string;
    caseId: string;
    requestId: string;
    organizationName: string;
    email: string | null;
    evidenceType: string;
    evidenceStatus: string;
    source: string;
    fileName: string | null;
    fileType: string | null;
    fileSize: string | null;
    uploadedAt: string | null;
    updatedAt: string | null;
    repositoryRecord?: boolean;
    repositoryCategory?: string;
    workflowOrigin?: string;
    workflowStage?: string;
    reviewReadiness?: string;
    repositoryHealth?: string;
    ageDays?: number | null;
    hasFile?: boolean;
    isPending?: boolean;
    authorityBoundaryText?: string;
  };
  workflow?: Array<{
    stage: string;
    status: string;
  }>;
  authorityBoundary?: {
    applicantMayUploadEvidence: boolean;
    applicantMayViewEvidence: boolean;
    applicantMayMutateGovernanceReview: boolean;
    applicantMayMutateFindings: boolean;
    applicantMayMutateScoring: boolean;
    applicantMayMutateDecision: boolean;
    applicantMayMutateRegistry: boolean;
    applicantMayMutateCertification: boolean;
  };
  error?: string;
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

async function getApplicantEvidenceDetail(
  evidenceId: string,
): Promise<ApplicantEvidenceDetailResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/evidence/${encodeURIComponent(evidenceId)}`,
      {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      },
    );

    const json = (await res.json()) as ApplicantEvidenceDetailResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Evidence detail failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant evidence detail.",
    };
  }
}

function SummaryCard({ label, value }: { label: string; value: string }) {
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

function StatusCard({
  title,
  status,
  body,
}: {
  title: string;
  status: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {status}
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

function BoundaryCard({
  label,
  value,
}: {
  label: string;
  value: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        Authority Boundary
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {label}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {value
          ? "Allowed for applicant visibility."
          : "Not allowed for applicant users."}
      </p>
    </div>
  );
}

function yesNo(value: boolean | undefined) {
  return value ? "Yes" : "No";
}

function ageLabel(value: number | null | undefined) {
  if (typeof value !== "number") return "Unavailable";
  return `${value} day${value === 1 ? "" : "s"}`;
}

export default async function ApplicantEvidenceDetailPage({
  params,
}: {
  params: { evidenceId: string };
}) {
  const evidenceId = params.evidenceId;
  const data = await getApplicantEvidenceDetail(evidenceId);

  if (!data.ok || !data.evidence) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant evidence unavailable"
            description="The requested applicant evidence record could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant evidence access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/evidence" variant="primary">
                  Back to Evidence
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/requests" variant="secondary">
                  Requests
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const evidence = data.evidence;
  const workflow = data.workflow || [];

  const authorityBoundary =
    data.authorityBoundary || {
      applicantMayUploadEvidence: false,
      applicantMayViewEvidence: true,
      applicantMayMutateGovernanceReview: false,
      applicantMayMutateFindings: false,
      applicantMayMutateScoring: false,
      applicantMayMutateDecision: false,
      applicantMayMutateRegistry: false,
      applicantMayMutateCertification: false,
    };

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT EVIDENCE"
          title={evidence.evidenceId}
          description={`Organization-scoped applicant evidence visibility for ${evidence.organizationName}.`}
          secondaryDescription="Applicant evidence detail pages expose evidence repository visibility only. They do not create evidence authority, verification authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/evidence" variant="primary">
                Back to Evidence
              </PublicButtonLink>
              <PublicButtonLink
                href={`/applicant/requests/${encodeURIComponent(
                  evidence.requestId,
                )}`}
                variant="secondary"
              >
                Open Request
              </PublicButtonLink>
              <PublicButtonLink
                href={`/applicant/cases/${encodeURIComponent(evidence.caseId)}`}
                variant="secondary"
              >
                Open Case
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Evidence summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant evidence status and request context
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            This evidence record is scoped to the authenticated applicant
            organization and provides read-only visibility into applicant
            evidence repository state, upload status, and workflow context.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard label="Evidence ID" value={evidence.evidenceId} />
            <SummaryCard label="Case ID" value={evidence.caseId} />
            <SummaryCard label="Request ID" value={evidence.requestId} />
            <SummaryCard label="Evidence Status" value={evidence.evidenceStatus} />
            <SummaryCard label="Evidence Type" value={evidence.evidenceType} />
            <SummaryCard label="Source" value={evidence.source} />
            <SummaryCard
              label="Organization"
              value={evidence.organizationName}
            />
            <SummaryCard
              label="Contact Email"
              value={evidence.email || "No contact email"}
            />
            <SummaryCard
              label="Last Updated"
              value={evidence.updatedAt || "No recent update"}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Repository metadata
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Derived evidence repository metadata
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Derived metadata improves operational visibility, filtering,
            lifecycle awareness, and repository health review. These values do
            not alter Snowflake authority or create governance authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <SummaryCard
              label="Repository Category"
              value={evidence.repositoryCategory || "Evidence Repository"}
            />
            <SummaryCard
              label="Workflow Origin"
              value={evidence.workflowOrigin || "Applicant Workflow"}
            />
            <SummaryCard
              label="Workflow Stage"
              value={evidence.workflowStage || "Evidence"}
            />
            <SummaryCard
              label="Review Readiness"
              value={evidence.reviewReadiness || "Not classified"}
            />
            <SummaryCard
              label="Repository Health"
              value={evidence.repositoryHealth || "Not classified"}
            />
            <SummaryCard label="Age" value={ageLabel(evidence.ageDays)} />
            <SummaryCard label="Has File" value={yesNo(evidence.hasFile)} />
            <SummaryCard
              label="Pending"
              value={yesNo(evidence.isPending)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            File visibility
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Evidence file metadata
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            File metadata is displayed as applicant evidence repository
            visibility. Upload availability is controlled through the applicant
            evidence upload workflow and remains organization-scoped.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard
              label="File Name"
              value={evidence.fileName || "Not uploaded"}
            />
            <SummaryCard
              label="File Type"
              value={evidence.fileType || "Not uploaded"}
            />
            <SummaryCard
              label="File Size"
              value={evidence.fileSize || "Not uploaded"}
            />
            <SummaryCard
              label="Uploaded At"
              value={evidence.uploadedAt || "Not uploaded"}
            />
          </div>

          <p className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
            {evidence.authorityBoundaryText ||
              "Operational evidence visibility only. No verification, scoring, certification, registry, publication, or governance authority is created."}
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Evidence workflow timeline
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant evidence lifecycle visibility
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Evidence workflow stages are visibility-only and do not mutate
            evidence, artifact, request, case, review, certification,
            publication, registry, scoring, or decision state.
          </p>

          {workflow.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No evidence workflow is currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Evidence workflow stages will appear here when available.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
              {workflow.map((step) => (
                <StatusCard
                  key={`${step.stage}-${step.status}`}
                  title={step.stage}
                  status={step.status}
                  body="This stage is displayed as applicant evidence workflow visibility only."
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Applicant authority boundaries
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Evidence visibility does not create governance authority
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Applicant-facing evidence pages are visibility, upload, and workflow
            surfaces. They do not create reviewer authority, findings authority,
            scoring authority, decision authority, certification authority,
            publication authority, registry authority, or verification authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <BoundaryCard
              label="View evidence"
              value={authorityBoundary.applicantMayViewEvidence}
            />
            <BoundaryCard
              label="Upload evidence"
              value={authorityBoundary.applicantMayUploadEvidence}
            />
            <BoundaryCard
              label="Mutate governance review"
              value={authorityBoundary.applicantMayMutateGovernanceReview}
            />
            <BoundaryCard
              label="Mutate findings"
              value={authorityBoundary.applicantMayMutateFindings}
            />
            <BoundaryCard
              label="Mutate scoring"
              value={authorityBoundary.applicantMayMutateScoring}
            />
            <BoundaryCard
              label="Mutate decision"
              value={authorityBoundary.applicantMayMutateDecision}
            />
            <BoundaryCard
              label="Mutate registry"
              value={authorityBoundary.applicantMayMutateRegistry}
            />
            <BoundaryCard
              label="Mutate certification"
              value={authorityBoundary.applicantMayMutateCertification}
            />
          </div>
        </section>
      </div>
    </main>
  );
}