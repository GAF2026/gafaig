import { cookies, headers } from "next/headers";
import Link from "next/link";

import PublicPageHero from "../../_components/PublicPageHero";
import PublicButtonLink from "../../_components/PublicButtonLink";

type ApplicantDecisionStatusResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  summary?: {
    totalDecisions: number;
    issued: number;
    pending: number;
    favorable: number;
    notReady: number;
  };
  decisions?: Array<{
    decisionId: string;
    caseId: string;
    requestId: string;
    certificationId: string;
    organizationName: string;
    email: string | null;
    decisionStatus: string;
    caseStatus: string;
    source: string;
    decisionType: string;
    decisionOutcome: string;
    decisionIssued: boolean;
    certificationReady: boolean;
    issuedAt: string | null;
    updatedAt: string | null;
  }>;
  error?: string;
};

async function getBaseUrl() {
  const h = await headers();

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

async function getDecisionStatus(): Promise<ApplicantDecisionStatusResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map(
      (cookie) =>
        `${cookie.name}=${cookie.value}`,
    )
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/decision-status`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      },
    );

    const json =
      (await res.json()) as ApplicantDecisionStatusResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error:
        json.error ??
        `Decision status request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load decision status.",
    };
  }
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
  value: string;
}) {
  return (
    <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-black/65">
      {value}
    </span>
  );
}

function WorkflowCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>

      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {body}
      </p>
    </div>
  );
}

export default async function ApplicantDecisionStatusPage() {
  const data =
    await getDecisionStatus();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Decision status unavailable"
          description="The governance decision visibility page could not be loaded."
          secondaryDescription={
            data.error ??
            "Decision status access is available only for authenticated organization-scoped users."
          }
          actions={
            <>
              <PublicButtonLink
                href="/applicant/dashboard"
                variant="primary"
              >
                Dashboard
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/review-status"
                variant="secondary"
              >
                Review Status
              </PublicButtonLink>
            </>
          }
        />
      </main>
    );
  }

  const organizationName =
    data.organization
      ?.organizationName ??
    "Applicant Organization";

  const summary =
    data.summary ?? {
      totalDecisions: 0,
      issued: 0,
      pending: 0,
      favorable: 0,
      notReady: 0,
    };

  const decisions =
    data.decisions ?? [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG GOVERNANCE DECISION"
          title="Decision status"
          description={`Organization-scoped governance decision visibility for ${organizationName}.`}
          secondaryDescription="Decision status pages provide applicant visibility into governance outcomes without granting governance authority, scoring authority, certification authority, publication authority, registry authority, or decision authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/decision-status"
                variant="primary"
              >
                Decision Status
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/review-status"
                variant="secondary"
              >
                Review Status
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/remediation"
                variant="secondary"
              >
                Remediation
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/certifications"
                variant="secondary"
              >
                Certifications
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Decision Summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Governance decision inventory
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Governance decision visibility provides
            applicant organizations with outcome
            transparency while preserving governance
            authority boundaries and decision integrity.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-5">
            <MetricCard
              label="Total Decisions"
              value={summary.totalDecisions}
            />

            <MetricCard
              label="Issued"
              value={summary.issued}
            />

            <MetricCard
              label="Pending"
              value={summary.pending}
            />

            <MetricCard
              label="Favorable"
              value={summary.favorable}
            />

            <MetricCard
              label="Not Ready"
              value={summary.notReady}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                Governance Decision Activity
              </div>

              <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
                Decision visibility records
              </h2>
            </div>

            <PublicButtonLink
              href="/applicant/review-status"
              variant="secondary"
            >
              Back to Review Status
            </PublicButtonLink>
          </div>

          {decisions.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
              <div className="text-lg font-semibold text-black">
                No decision records available
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                No organization-scoped governance
                decision records are currently visible.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {decisions.map((item) => (
                <div
                  key={item.decisionId}
                  className="rounded-3xl border border-black/10 bg-white p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Decision Record
                      </div>

                      <h3 className="mt-3 text-[18px] font-semibold tracking-tight text-black">
                        {item.decisionId}
                      </h3>

                      <p className="mt-3 text-[14px] leading-7 text-black/70">
                        Case {item.caseId}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-black/70">
                        {item.decisionType}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusLabel
                        value={item.decisionStatus}
                      />

                      <StatusLabel
                        value={item.decisionOutcome}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-4">
                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Decision Issued
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.decisionIssued
                          ? "YES"
                          : "NO"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Certification Ready
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.certificationReady
                          ? "YES"
                          : "NO"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Issued At
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.issuedAt ??
                          "Not Issued"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                        Updated
                      </div>

                      <div className="mt-3 text-[14px] leading-7 text-black/75">
                        {item.updatedAt ??
                          "No Update"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/applicant/cases/${encodeURIComponent(
                        item.caseId,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Case
                    </Link>

                    <Link
                      href={`/applicant/certifications/${encodeURIComponent(
                        item.certificationId,
                      )}`}
                      className="inline-flex items-center rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                    >
                      Open Certification
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:gap-5 md:grid-cols-4">
          <WorkflowCard
            title="Decision Determination"
            body="Governance review outcomes ultimately flow into formal decision determination."
          />

          <WorkflowCard
            title="Certification Readiness"
            body="Approved decisions may become certification candidates after governance completion."
          />

          <WorkflowCard
            title="Registry Publication"
            body="Decision visibility does not imply registry publication authority."
          />

          <WorkflowCard
            title="Authority Preservation"
            body="Applicant organizations may view decision status but cannot alter governance outcomes."
          />
        </section>
      </div>
    </main>
  );
}