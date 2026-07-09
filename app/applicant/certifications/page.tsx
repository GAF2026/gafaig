import { cookies, headers } from "next/headers";
import Link from "next/link";
import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantCertificationsResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalCertifications: number;
    activeCertifications: number;
    renewalPending: number;
    notCertified: number;
  };
  certifications?: Array<{
    certificationId: string;
    caseId: string;
    requestId: string;
    organizationName: string;
    email: string | null;
    certificationType: string;
    certificationStatus: string;
    caseStatus: string;
    source: string;
    issuedAt: string | null;
    validFrom: string | null;
    validTo: string | null;
    renewalStatus: string;
    publicationStatus: string;
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

async function getApplicantCertifications(): Promise<ApplicantCertificationsResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/certifications`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantCertificationsResponse;
    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error:
        json.error ||
        `Certifications request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant certifications.",
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

export default async function ApplicantCertificationsPage() {
  const data = await getApplicantCertifications();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Applicant certifications unavailable"
            description="The applicant certification repository could not be loaded."
            secondaryDescription={
              data.error ||
              "Applicant certification access is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/dashboard" variant="primary">
                  Dashboard
                </PublicButtonLink>
                <PublicButtonLink href="/applicant/artifacts" variant="secondary">
                  Artifacts
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
    totalCertifications: 0,
    activeCertifications: 0,
    renewalPending: 0,
    notCertified: 0,
  };

  const certifications = data.certifications || [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Applicant certifications"
          description={`Organization-scoped certification repository visibility for ${organizationName}.`}
          secondaryDescription="Applicant certification pages expose certification lifecycle visibility only. They do not create certification authority, publication authority, registry authority, verification authority, scoring authority, decision authority, or governance authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/certifications"
                variant="primary"
              >
                Certifications
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/artifacts" variant="secondary">
                Artifacts
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/evidence" variant="secondary">
                Evidence
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Certification repository summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Organization-scoped certification inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Certification records shown here are scoped to the authenticated
            applicant organization. This phase establishes certification
            repository visibility before lifecycle mutation, renewal action,
            appeals, reinstatement, or publication controls are added.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <MetricCard
              label="Total Certifications"
              value={summary.totalCertifications}
            />
            <MetricCard
              label="Active Certifications"
              value={summary.activeCertifications}
            />
            <MetricCard label="Renewal Pending" value={summary.renewalPending} />
            <MetricCard label="Not Certified" value={summary.notCertified} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Certification activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Applicant certification repository records
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] leading-7 text-black/70">
                Certification records are currently read-only lifecycle
                visibility slots derived from applicant workflow records.
              </p>
            </div>

            <PublicButtonLink href="/applicant/artifacts" variant="secondary">
              Back to artifacts
            </PublicButtonLink>
          </div>

          {certifications.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center sm:px-10">
              <div className="text-lg font-semibold text-black">
                No applicant certification records are currently available
              </div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped applicant certification records are
                visible for this applicant session.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {certifications.map((item) => (
                <Link
                  key={item.certificationId}
                  href={`/applicant/certifications/${encodeURIComponent(
                    item.certificationId,
                  )}`}
                  className="block rounded-3xl border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Certification
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.certificationId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Case {item.caseId} · {item.certificationType}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.email || "No contact email"} ·{" "}
                        {item.updatedAt || "No recent update"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel value={item.certificationStatus} />
                      <StatusLabel value={item.publicationStatus} />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Valid From
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.validFrom || "Not issued"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Valid To
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.validTo || "Not issued"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Renewal Status
                      </div>
                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.renewalStatus}
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
            title="Certification detail"
            body="Certification detail pages will expose read-only certification lifecycle metadata and authority boundaries."
          />
          <WorkflowCard
            title="Renewal status"
            body="Renewal lifecycle visibility will be added after certification repository visibility is validated."
          />
          <WorkflowCard
            title="Appeals"
            body="Appeal and reinstatement visibility will follow certification lifecycle implementation."
          />
          <WorkflowCard
            title="Publication control"
            body="Registry publication remains separate from applicant certification visibility."
          />
        </section>
      </div>
    </main>
  );
}