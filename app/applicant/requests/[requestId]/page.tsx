import { cookies, headers } from "next/headers";
import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type ApplicantRequestDetailResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  request?: {
    requestId: string;
    caseId: string;
    organizationName: string;
    email: string | null;
    requestType: string;
    requestStatus: string;
    caseStatus: string;
    source: string;
    dueDate: string | null;
    updatedAt: string | null;
  };
  metrics?: {
    attachments: number;
    responses: number;
    artifacts: number;
    certifications: number;
  };
  workflow?: Array<{
    stage: string;
    status: string;
  }>;
  error?: string;
};

async function getBaseUrl() {
  const h = await headers();

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}

async function getApplicantRequest(
  requestId: string,
): Promise<ApplicantRequestDetailResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/requests/${encodeURIComponent(requestId)}`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      },
    );

    const json = (await res.json()) as ApplicantRequestDetailResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Request detail failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant request.",
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

function MetricCard({ label, value }: { label: string; value: number }) {
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

function WorkflowStep({ stage, status }: { stage: string; status: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {status}
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {stage}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">
        This stage is displayed as applicant workflow visibility only.
      </p>
    </div>
  );
}

function CapabilityCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

export default async function ApplicantRequestDetailPage({
  params,
}: {
  params: { requestId: string };
}) {
  const requestId = params.requestId;
  const data = await getApplicantRequest(requestId);

  if (!data.ok || !data.request) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant request unavailable"
            description="The requested applicant request could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant request access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/requests" variant="primary">
                  Back to Requests
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/cases" variant="secondary">
                  Cases
                </PublicButtonLink>
              </>
            }
          />
        </div>
      </main>
    );
  }

  const request = data.request;

  const metrics = data.metrics || {
    attachments: 0,
    responses: 0,
    artifacts: 0,
    certifications: 0,
  };

  const workflow = data.workflow || [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT REQUEST"
          title={request.requestId}
          description={`Organization-scoped applicant request visibility for ${request.organizationName}.`}
          secondaryDescription="Applicant request detail pages expose request workflow visibility and applicant response submission. They do not create evidence authority, certification authority, publication authority, registry authority, scoring authority, decision authority, or verification authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/requests" variant="primary">
                Back to Requests
              </PublicButtonLink>

              <PublicButtonLink
                href={`/applicant/requests/${encodeURIComponent(
                  request.requestId,
                )}/respond`}
                variant="secondary"
              >
                Respond
              </PublicButtonLink>

              <PublicButtonLink
                href={`/applicant/cases/${encodeURIComponent(request.caseId)}`}
                variant="secondary"
              >
                Open Case
              </PublicButtonLink>

              <PublicButtonLink href="/applicant/dashboard" variant="secondary">
                Dashboard
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant request status and case context
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            This page provides visibility into an applicant request scoped to
            the authenticated organization. Applicant response submission is
            available through the Respond action and is stored as
            applicant-submitted response evidence.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard label="Request ID" value={request.requestId} />
            <SummaryCard label="Case ID" value={request.caseId} />
            <SummaryCard label="Request Status" value={request.requestStatus} />
            <SummaryCard label="Case Status" value={request.caseStatus} />
            <SummaryCard label="Request Type" value={request.requestType} />
            <SummaryCard label="Source" value={request.source} />
            <SummaryCard
              label="Organization"
              value={request.organizationName}
            />
            <SummaryCard
              label="Contact Email"
              value={request.email || "No contact email"}
            />
            <SummaryCard
              label="Last Updated"
              value={request.updatedAt || "No recent update"}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request-linked activity
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Current request workflow visibility
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            These metrics provide applicant-facing visibility into current
            request activity. Response evidence, evidence uploads, and artifact
            repository activity are connected through the applicant workflow
            surfaces.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard label="Attachments" value={metrics.attachments} />
            <MetricCard label="Responses" value={metrics.responses} />
            <MetricCard label="Artifacts" value={metrics.artifacts} />
            <MetricCard label="Certifications" value={metrics.certifications} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request workflow timeline
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant request lifecycle visibility
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            The request timeline is read-only. It provides applicant visibility
            without mutating request state, evidence state, case state, or
            governance authority.
          </p>

          {workflow.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No request workflow is currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Request workflow stages will appear here when available.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
              {workflow.map((step) => (
                <WorkflowStep
                  key={`${step.stage}-${step.status}`}
                  stage={step.stage}
                  status={step.status}
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <CapabilityCard
            title="Response workflow"
            body="Applicant response submission stores applicant-submitted response evidence for request visibility."
          />
          <CapabilityCard
            title="Evidence attachment"
            body="Evidence upload attaches applicant files and supporting artifacts to request and case records."
          />
          <CapabilityCard
            title="Artifact repository"
            body="The artifact repository preserves applicant-visible evidence and documentation metadata."
          />
          <CapabilityCard
            title="Governance review"
            body="Governance review status connects request response activity to applicant progress."
          />
        </section>
      </div>
    </main>
  );
}