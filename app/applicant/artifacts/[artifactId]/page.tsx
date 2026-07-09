import { cookies, headers } from "next/headers";

import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type ApplicantArtifactDetailResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  artifact?: {
    artifactId: string;
    evidenceId: string;
    caseId: string;
    requestId: string;
    organizationName: string;
    email: string | null;
    artifactType: string;
    artifactStatus: string;
    source: string;
    title: string;
    fileName: string | null;
    fileType: string | null;
    fileSize: string | null;
    version: string;
    preservedAt: string | null;
    updatedAt: string | null;
    repositoryRecord?: boolean;
    repositoryCategory?: string;
    workflowOrigin?: string;
    workflowStage?: string;
    preservationReadiness?: string;
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
    applicantMayViewArtifact: boolean;
    applicantMayUploadArtifact: boolean;
    applicantMayDeleteArtifact: boolean;
    applicantMayMutateEvidenceReview: boolean;
    applicantMayMutateFindings: boolean;
    applicantMayMutateScoring: boolean;
    applicantMayMutateDecision: boolean;
    applicantMayMutateCertification: boolean;
    applicantMayMutateRegistry: boolean;
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

async function getApplicantArtifactDetail(
  artifactId: string,
): Promise<ApplicantArtifactDetailResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/artifacts/${encodeURIComponent(artifactId)}`,
      {
        cache: "no-store",
        headers: { cookie: cookieHeader },
      },
    );

    const json = (await res.json()) as ApplicantArtifactDetailResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Artifact detail failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant artifact detail.",
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

export default async function ApplicantArtifactDetailPage({
  params,
}: {
  params: { artifactId: string };
}) {
  const artifactId = params.artifactId;
  const data = await getApplicantArtifactDetail(artifactId);

  if (!data.ok || !data.artifact) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant artifact unavailable"
            description="The requested applicant artifact record could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant artifact access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/artifacts" variant="primary">
                  Back to Artifacts
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/evidence" variant="secondary">
                  Evidence
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const artifact = data.artifact;
  const workflow = data.workflow || [];

  const authorityBoundary =
    data.authorityBoundary || {
      applicantMayViewArtifact: true,
      applicantMayUploadArtifact: false,
      applicantMayDeleteArtifact: false,
      applicantMayMutateEvidenceReview: false,
      applicantMayMutateFindings: false,
      applicantMayMutateScoring: false,
      applicantMayMutateDecision: false,
      applicantMayMutateCertification: false,
      applicantMayMutateRegistry: false,
    };

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT ARTIFACT"
          title={artifact.artifactId}
          description={`Organization-scoped applicant artifact repository visibility for ${artifact.organizationName}.`}
          secondaryDescription="Applicant artifact detail pages expose artifact repository visibility only. They do not create evidence authority, verification authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/artifacts" variant="primary">
                Back to Artifacts
              </PublicButtonLink>
              <PublicButtonLink
                href={`/applicant/evidence/${encodeURIComponent(
                  artifact.evidenceId,
                )}`}
                variant="secondary"
              >
                Open Evidence
              </PublicButtonLink>
              <PublicButtonLink
                href={`/applicant/requests/${encodeURIComponent(
                  artifact.requestId,
                )}`}
                variant="secondary"
              >
                Open Request
              </PublicButtonLink>
              <PublicButtonLink
                href={`/applicant/cases/${encodeURIComponent(artifact.caseId)}`}
                variant="secondary"
              >
                Open Case
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Artifact summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant artifact status and repository context
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            This artifact record is scoped to the authenticated applicant
            organization and provides read-only visibility into artifact
            repository state, preservation status, and workflow context.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard label="Artifact ID" value={artifact.artifactId} />
            <SummaryCard label="Evidence ID" value={artifact.evidenceId} />
            <SummaryCard label="Case ID" value={artifact.caseId} />
            <SummaryCard label="Request ID" value={artifact.requestId} />
            <SummaryCard
              label="Artifact Status"
              value={artifact.artifactStatus}
            />
            <SummaryCard label="Artifact Type" value={artifact.artifactType} />
            <SummaryCard label="Source" value={artifact.source} />
            <SummaryCard label="Version" value={artifact.version} />
            <SummaryCard
              label="Organization"
              value={artifact.organizationName}
            />
            <SummaryCard
              label="Contact Email"
              value={artifact.email || "No contact email"}
            />
            <SummaryCard
              label="Last Updated"
              value={artifact.updatedAt || "No recent update"}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Repository metadata
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Derived artifact repository metadata
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Derived metadata improves operational visibility, filtering,
            lifecycle awareness, and repository health review. These values do
            not alter Snowflake authority or create governance authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <SummaryCard
              label="Repository Category"
              value={artifact.repositoryCategory || "Artifact Repository"}
            />
            <SummaryCard
              label="Workflow Origin"
              value={artifact.workflowOrigin || "Applicant Workflow"}
            />
            <SummaryCard
              label="Workflow Stage"
              value={artifact.workflowStage || "Artifact"}
            />
            <SummaryCard
              label="Preservation Readiness"
              value={artifact.preservationReadiness || "Not classified"}
            />
            <SummaryCard
              label="Repository Health"
              value={artifact.repositoryHealth || "Not classified"}
            />
            <SummaryCard label="Age" value={ageLabel(artifact.ageDays)} />
            <SummaryCard label="Has File" value={yesNo(artifact.hasFile)} />
            <SummaryCard label="Pending" value={yesNo(artifact.isPending)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Repository file metadata
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Artifact file and preservation metadata
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Artifact file metadata is displayed as applicant artifact repository
            visibility. Artifact upload and preservation are handled through the
            authorized applicant artifact workflow and remain organization-scoped.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard label="Title" value={artifact.title} />
            <SummaryCard
              label="File Name"
              value={artifact.fileName || "Not persisted"}
            />
            <SummaryCard
              label="File Type"
              value={artifact.fileType || "Not persisted"}
            />
            <SummaryCard
              label="File Size"
              value={artifact.fileSize || "Not persisted"}
            />
            <SummaryCard
              label="Preserved At"
              value={artifact.preservedAt || "Not persisted"}
            />
          </div>

          <p className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
            {artifact.authorityBoundaryText ||
              "Operational artifact repository visibility only. No evidence, verification, scoring, certification, registry, publication, or governance authority is created."}
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Artifact workflow timeline
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant artifact lifecycle visibility
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Artifact workflow stages are visibility-only and do not mutate
            evidence, artifact, request, case, review, certification,
            publication, registry, scoring, or decision state.
          </p>

          {workflow.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No artifact workflow is currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Artifact workflow stages will appear here when available.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
              {workflow.map((step) => (
                <StatusCard
                  key={`${step.stage}-${step.status}`}
                  title={step.stage}
                  status={step.status}
                  body="This stage is displayed as applicant artifact workflow visibility only."
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
            Artifact visibility does not create governance authority
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Applicant-facing artifact pages are visibility, upload, and
            repository surfaces. They do not create evidence authority, reviewer
            authority, findings authority, scoring authority, decision authority,
            certification authority, publication authority, registry authority,
            or verification authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <BoundaryCard
              label="View artifact"
              value={authorityBoundary.applicantMayViewArtifact}
            />
            <BoundaryCard
              label="Upload artifact"
              value={authorityBoundary.applicantMayUploadArtifact}
            />
            <BoundaryCard
              label="Delete artifact"
              value={authorityBoundary.applicantMayDeleteArtifact}
            />
            <BoundaryCard
              label="Mutate evidence review"
              value={authorityBoundary.applicantMayMutateEvidenceReview}
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
              label="Mutate certification"
              value={authorityBoundary.applicantMayMutateCertification}
            />
            <BoundaryCard
              label="Mutate registry"
              value={authorityBoundary.applicantMayMutateRegistry}
            />
          </div>
        </section>
      </div>
    </main>
  );
}