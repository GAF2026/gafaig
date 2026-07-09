import { cookies, headers } from "next/headers";
import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type InformationRequestDetailResponse = {
  ok: boolean;
  error?: string;
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
    responseId?: string | null;
    responseSubmittedAt?: string | null;
    responseSubmittedBy?: string | null;
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
};

async function getBaseUrl() {
  const h = await headers();

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}

async function getRequest(
  requestId: string,
): Promise<InformationRequestDetailResponse> {
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

    const json = (await res.json()) as InformationRequestDetailResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error:
        json.error ||
        `Information request detail failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load information request detail.",
    };
  }
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 break-words text-[14px] leading-7 text-black/75">
        {value}
      </div>
    </div>
  );
}

function WorkflowCard({ stage, status }: { stage: string; status: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {status}
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {stage}
      </div>
    </div>
  );
}

function BoundaryCard({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        Authority Boundary
      </div>
      <div className="mt-3 text-[14px] leading-7 text-black/75">
        {label}
      </div>
    </div>
  );
}

export default async function InformationRequestDetailPage({
  params,
}: {
  params: {
    requestId: string;
  };
}) {
  const requestId = decodeURIComponent(params.requestId);
  const data = await getRequest(requestId);

  if (!data.ok || !data.request) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Information request unavailable"
            description="The requested information request could not be loaded."
            secondaryDescription={
              data.error ||
              "Information request access is available only for authenticated applicant users."
            }
            actions={
              <>
                <PublicButtonLink
                  href="/applicant/information-requests"
                  variant="primary"
                >
                  Back to Information Requests
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/dashboard" variant="secondary">
                  Dashboard
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
          eyebrow="GAFAIG INFORMATION REQUEST"
          title={request.requestId}
          description={`Applicant-facing information request visibility for ${request.organizationName}.`}
          secondaryDescription="Information request detail pages provide workflow visibility only and do not grant governance authority, findings authority, scoring authority, decision authority, certification authority, publication authority, registry authority, or verification authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/information-requests"
                variant="primary"
              >
                Back to Information Requests
              </PublicButtonLink>
              <PublicButtonLink
                href={`/applicant/cases/${encodeURIComponent(request.caseId)}`}
                variant="secondary"
              >
                Open Case
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/progress" variant="secondary">
                Progress
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Information request metadata
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            This request is scoped to the authenticated applicant organization.
            It provides visibility into applicant response coordination without
            creating governance authority, review authority, scoring authority,
            decision authority, certification authority, registry authority, or
            verification authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <InfoCard label="Request ID" value={request.requestId} />
            <InfoCard label="Case ID" value={request.caseId} />
            <InfoCard label="Status" value={request.requestStatus} />
            <InfoCard label="Case Status" value={request.caseStatus} />
            <InfoCard label="Organization" value={request.organizationName} />
            <InfoCard label="Email" value={request.email || "N/A"} />
            <InfoCard label="Source" value={request.source} />
            <InfoCard label="Updated" value={request.updatedAt || "N/A"} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request metrics
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant activity
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard label="Attachments" value={metrics.attachments} />
            <MetricCard label="Responses" value={metrics.responses} />
            <MetricCard label="Artifacts" value={metrics.artifacts} />
            <MetricCard label="Certifications" value={metrics.certifications} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Workflow lifecycle
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Request processing lifecycle
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            {workflow.map((item) => (
              <WorkflowCard
                key={`${item.stage}-${item.status}`}
                stage={item.stage}
                status={item.status}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Applicant authority boundary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Visibility does not grant governance authority
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <BoundaryCard label="Applicant may view request." />
            <BoundaryCard label="Applicant may not alter findings." />
            <BoundaryCard label="Applicant may not alter scoring." />
            <BoundaryCard label="Applicant may not alter decisions." />
            <BoundaryCard label="Applicant may not issue certifications." />
            <BoundaryCard label="Applicant may not publish registry records." />
          </div>
        </section>
      </div>
    </main>
  );
}