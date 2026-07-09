import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantRequestsResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalRequests: number;
    openRequests: number;
    closedRequests: number;
  };
  requests?: Array<{
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

async function getApplicantRequests(): Promise<ApplicantRequestsResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/requests`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantRequestsResponse;
    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Requests failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant requests.",
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

function WorkflowCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

function StatusLabel({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/65">
      {value}
    </span>
  );
}

export default async function ApplicantRequestsPage() {
  const data = await getApplicantRequests();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant requests unavailable"
            description="The applicant request list could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant request access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Dashboard
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

  const organizationName =
    data.organization?.organizationName || "Applicant Organization";

  const summary = data.summary || {
    totalRequests: 0,
    openRequests: 0,
    closedRequests: 0,
  };

  const requests = data.requests || [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant requests"
          description={`Organization-scoped applicant request visibility for ${organizationName}.`}
          secondaryDescription="Applicant request pages expose workflow visibility only. They do not create evidence authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or verification authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/requests" variant="primary">
                Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
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
            Organization-scoped applicant request inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Requests shown here are limited to the applicant organization
            associated with the authenticated applicant session. This is a
            read-only visibility surface for the current implementation phase.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <MetricCard label="Total Requests" value={summary.totalRequests} />
            <MetricCard label="Open Requests" value={summary.openRequests} />
            <MetricCard label="Closed Requests" value={summary.closedRequests} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Request activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant request records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Request records are currently derived from organization-scoped
                applicant workflow records. Later phases will connect this view
                to formal information request and deficiency request objects.
              </p>
            </div>

            <PublicButtonLink href="/applicant/cases" variant="secondary">
              Back to cases
            </PublicButtonLink>
          </div>

          {requests.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant requests are currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped applicant request records are visible for
                this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {requests.map((item) => (
                <Link
                  key={item.requestId}
                  href={`/applicant/requests/${encodeURIComponent(
                    item.requestId,
                  )}`}
                  className="block rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Request
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.requestId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Case {item.caseId} · {item.requestType}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.email || "No contact email"} ·{" "}
                        {item.updatedAt || "No recent update"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.requestStatus} />
                      <StatusLabel value={item.caseStatus} />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Source
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.source || "Applicant Intake"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Due Date
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.dueDate || "Not assigned"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Current Capability
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        Read-only request visibility
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Request detail"
            body="Request detail pages will be added after list visibility is stable."
          />
          <WorkflowCard
            title="Response workflow"
            body="Applicant response submission will be added after request detail is implemented."
          />
          <WorkflowCard
            title="Evidence attachment"
            body="Evidence upload will attach documents and artifacts to applicant requests."
          />
          <WorkflowCard
            title="Review status"
            body="Governance review status will connect request responses to applicant progress."
          />
        </section>
      </div>
    </main>
  );
}