import { cookies, headers } from "next/headers";
import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type InformationRequestDetail = {
  requestId: string;
  caseId: string;
  organizationName: string;
  contactEmail?: string | null;
  email?: string | null;
  requestType: string;
  requestStatus: string;
  caseStatus: string;
  source: string;
  sourceUrl?: string | null;
  requestText?: string | null;
  responseText?: string | null;
  submittedAt?: string | null;
  dueDate?: string | null;
  updatedAt: string | null;
  responseId?: string | null;
  responseSubmittedAt?: string | null;
  responseSubmittedBy?: string | null;
  repositoryCategory?: string;
  workflowOrigin?: string;
  workflowStage?: string;
  responseReadiness?: string;
  repositoryHealth?: string;
  ageDays?: number | null;
  isOpen?: boolean;
  isCompleted?: boolean;
  isPendingApplicant?: boolean;
  isPendingReview?: boolean;
  isDeficiencyRelated?: boolean;
  authorityBoundaryText?: string;
};

type InformationRequestDetailResponse = {
  ok: boolean;
  error?: string;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  request?: InformationRequestDetail;
  informationRequest?: InformationRequestDetail;
  metrics?: {
    attachments: number;
    responses: number;
    artifacts: number;
    certifications: number;
  };
  workflow?: Array<{
    stage?: string;
    title?: string;
    status: string;
  }>;
  authorityBoundaries?: Array<{
    title: string;
    description: string;
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
      `${baseUrl}/api/applicant/information-requests/${encodeURIComponent(
        requestId,
      )}`,
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

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-4 break-words text-[16px] font-semibold leading-7 tracking-tight text-black">
        {value || "N/A"}
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

function BoundaryCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        Authority Boundary
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {description}
      </p>
    </div>
  );
}

function TextPanel({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-[14px] leading-7 text-black/75">
        {value || `No ${label.toLowerCase()} is currently available.`}
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

export default async function InformationRequestDetailPage({
  params,
}: {
  params: {
    requestId: string;
  };
}) {
  const requestId = decodeURIComponent(params.requestId);
  const data = await getRequest(requestId);
  const request = data.request || data.informationRequest;

  if (!data.ok || !request) {
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

  const workflow = data.workflow || [];
  const authorityBoundaries =
    data.authorityBoundaries || [
      {
        title: "View Request",
        description: "Allowed for applicant users.",
      },
      {
        title: "Submit Response",
        description: "Allowed for applicant users.",
      },
      {
        title: "Modify Findings",
        description: "Not allowed for applicant users.",
      },
      {
        title: "Modify Scoring",
        description: "Not allowed for applicant users.",
      },
      {
        title: "Modify Decision",
        description: "Not allowed for applicant users.",
      },
      {
        title: "Publish Registry",
        description: "Not allowed for applicant users.",
      },
    ];

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
            creating governance authority, review authority, findings authority,
            scoring authority, decision authority, certification authority,
            registry authority, or verification authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard label="Request ID" value={request.requestId} />
            <SummaryCard label="Case ID" value={request.caseId} />
            <SummaryCard label="Request Type" value={request.requestType} />
            <SummaryCard label="Request Status" value={request.requestStatus} />
            <SummaryCard label="Case Status" value={request.caseStatus} />
            <SummaryCard label="Source" value={request.source} />
            <SummaryCard label="Organization" value={request.organizationName} />
            <SummaryCard
              label="Contact Email"
              value={request.email || request.contactEmail || "No contact email"}
            />
            <SummaryCard
              label="Last Updated"
              value={request.updatedAt || "No recent update"}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Repository metadata
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Derived information request repository metadata
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Derived metadata improves operational visibility, filtering,
            lifecycle awareness, response coordination, and repository health
            review. These values do not alter Snowflake authority or create
            governance authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <SummaryCard
              label="Repository Category"
              value={request.repositoryCategory || "Information Request Repository"}
            />
            <SummaryCard
              label="Workflow Origin"
              value={request.workflowOrigin || "Applicant Workflow"}
            />
            <SummaryCard
              label="Workflow Stage"
              value={request.workflowStage || "Information Request"}
            />
            <SummaryCard
              label="Response Readiness"
              value={request.responseReadiness || "Not classified"}
            />
            <SummaryCard
              label="Repository Health"
              value={request.repositoryHealth || "Not classified"}
            />
            <SummaryCard label="Age" value={ageLabel(request.ageDays)} />
            <SummaryCard label="Open" value={yesNo(request.isOpen)} />
            <SummaryCard label="Completed" value={yesNo(request.isCompleted)} />
            <SummaryCard
              label="Pending Applicant"
              value={yesNo(request.isPendingApplicant)}
            />
            <SummaryCard
              label="Pending Review"
              value={yesNo(request.isPendingReview)}
            />
            <SummaryCard
              label="Deficiency Related"
              value={yesNo(request.isDeficiencyRelated)}
            />
            <SummaryCard
              label="Submitted"
              value={request.submittedAt || "Unavailable"}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request and response
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant information request text
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Request and response text are displayed as organization-scoped
            applicant workflow visibility. Displaying this text does not create
            findings, scoring, decision, certification, publication, registry,
            verification, or governance authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2">
            <TextPanel label="Request Text" value={request.requestText} />
            <TextPanel label="Response Text" value={request.responseText} />
          </div>

          <p className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[13px] leading-6 text-black/65">
            {request.authorityBoundaryText ||
              "Operational information request visibility only. No governance authority, certification authority, publication authority, registry authority, scoring authority, decision authority, findings authority, or verification authority is created."}
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Workflow lifecycle
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Request processing lifecycle
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Information request workflow stages are visibility-only and do not
            mutate request, case, review, findings, scoring, certification,
            publication, registry, verification, or decision state.
          </p>

          {workflow.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No request workflow is currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Information request workflow stages will appear here when
                available.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
              {workflow.map((item) => (
                <StatusCard
                  key={`${item.stage || item.title}-${item.status}`}
                  title={item.stage || item.title || "Workflow Stage"}
                  status={item.status}
                  body="This stage is displayed as applicant information request workflow visibility only."
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
            Information request visibility does not create governance authority
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Applicant-facing information request pages are visibility and
            response coordination surfaces. They do not create reviewer
            authority, findings authority, scoring authority, decision
            authority, certification authority, publication authority, registry
            authority, or verification authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            {authorityBoundaries.map((boundary) => (
              <BoundaryCard
                key={`${boundary.title}-${boundary.description}`}
                title={boundary.title}
                description={boundary.description}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
