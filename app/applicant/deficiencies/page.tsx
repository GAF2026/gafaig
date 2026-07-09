import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantDeficienciesResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalDeficiencies: number;
    openDeficiencies: number;
    resolvedDeficiencies: number;
    responseRequired: number;
  };
  deficiencies?: Array<{
    deficiencyId: string;
    caseId: string;
    requestId: string;
    organizationName: string;
    email: string | null;
    deficiencyType: string;
    deficiencyStatus: string;
    caseStatus: string;
    source: string;
    description: string;
    responseRequired: boolean;
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

async function getApplicantDeficiencies(): Promise<ApplicantDeficienciesResponse> {
  const baseUrl = await getBaseUrl();
  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/deficiencies`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantDeficienciesResponse;
    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error:
        json.error || `Deficiencies request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant deficiencies.",
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

function StatusLabel({ value }: { value: string }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/65">
      {value}
    </span>
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

export default async function ApplicantDeficienciesPage() {
  const data = await getApplicantDeficiencies();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant deficiencies unavailable"
            description="The applicant deficiency notice view could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant deficiency access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Dashboard
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

  const organizationName =
    data.organization?.organizationName || "Applicant Organization";

  const summary = data.summary || {
    totalDeficiencies: 0,
    openDeficiencies: 0,
    resolvedDeficiencies: 0,
    responseRequired: 0,
  };

  const deficiencies = data.deficiencies || [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant deficiencies"
          description={`Organization-scoped deficiency notice visibility for ${organizationName}.`}
          secondaryDescription="Applicant deficiency pages expose workflow visibility only. They do not create findings authority, evidence authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/deficiencies" variant="primary">
                Deficiencies
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/requests" variant="secondary">
                Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/progress" variant="secondary">
                Progress
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Deficiency summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped deficiency notice inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Deficiency notices shown here are scoped to the authenticated
            applicant organization. This phase establishes deficiency visibility
            before remediation response submission is added.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard
              label="Total Deficiencies"
              value={summary.totalDeficiencies}
            />
            <MetricCard
              label="Open Deficiencies"
              value={summary.openDeficiencies}
            />
            <MetricCard
              label="Resolved Deficiencies"
              value={summary.resolvedDeficiencies}
            />
            <MetricCard
              label="Response Required"
              value={summary.responseRequired}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Deficiency activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant deficiency records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Deficiency records are read-only visibility surfaces derived
                from applicant workflow status until formal deficiency objects
                are connected.
              </p>
            </div>

            <PublicButtonLink href="/applicant/progress" variant="secondary">
              Back to progress
            </PublicButtonLink>
          </div>

          {deficiencies.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant deficiencies are currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped applicant deficiency records are visible
                for this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {deficiencies.map((item) => (
                <Link
                  key={item.deficiencyId}
                  href={`/applicant/deficiencies/${encodeURIComponent(
                    item.deficiencyId,
                  )}`}
                  className="block rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Deficiency
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.deficiencyId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Case {item.caseId} · Request {item.requestId}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.deficiencyStatus} />
                      <StatusLabel
                        value={
                          item.responseRequired
                            ? "RESPONSE_REQUIRED"
                            : "NO_RESPONSE_REQUIRED"
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Deficiency Type
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.deficiencyType}
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
                        Last Updated
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.updatedAt || "No recent update"}
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
            title="Deficiency detail"
            body="Deficiency detail pages will expose read-only deficiency metadata and authority boundaries."
          />
          <WorkflowCard
            title="Remediation response"
            body="Applicant remediation responses will be added after deficiency detail visibility is validated."
          />
          <WorkflowCard
            title="Evidence attachment"
            body="Remediation evidence will connect deficiency records to applicant evidence workflows."
          />
          <WorkflowCard
            title="Governance review"
            body="Governance review remains separate from applicant deficiency visibility."
          />
        </section>
      </div>
    </main>
  );
}