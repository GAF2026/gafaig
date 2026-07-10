import { cookies, headers } from "next/headers";

import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type ApplicantCertificationDetail = {
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
  repositoryRecord: boolean;
  repositoryCategory: string;
  workflowOrigin: string;
  workflowStage: string;
  certificationReadiness: string;
  repositoryHealth: string;
  ageDays: number | null;
  isActive: boolean;
  isCertified: boolean;
  isRenewalPending: boolean;
  isSuspended: boolean;
  isRevoked: boolean;
  isAppealPending: boolean;
  isPublished: boolean;
  authorityBoundaryText: string;
};

type ApplicantCertificationAuthorityBoundary = {
  applicantMayViewCertification: boolean;
  applicantMayIssueCertification: boolean;
  applicantMayRenewCertification: boolean;
  applicantMayAppealCertification: boolean;
  applicantMayReinstateCertification: boolean;
  applicantMayRevokeCertification: boolean;
  applicantMayModifyCertification: boolean;
  applicantMayModifyFindings: boolean;
  applicantMayModifyScoring: boolean;
  applicantMayModifyDecision: boolean;
  applicantMayModifyRegistry: boolean;
  applicantMayPublishCertification: boolean;
};

type ApplicantCertificationDetailResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  certification?: ApplicantCertificationDetail;
  workflow?: Array<{
    stage: string;
    status: string;
  }>;
  authorityBoundary?: ApplicantCertificationAuthorityBoundary;
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

async function getCertificationDetail(
  certificationId: string,
): Promise<ApplicantCertificationDetailResponse> {
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
      `${baseUrl}/api/applicant/certifications/${encodeURIComponent(
        certificationId,
      )}`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      },
    );

    const json =
      (await res.json()) as ApplicantCertificationDetailResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error:
        json.error ||
        `Certification detail failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load certification detail.",
    };
  }
}

function displayValue(
  value: string | null | undefined,
  fallback = "—",
) {
  const normalized = String(value ?? "").trim();

  return normalized || fallback;
}

function yesNo(value: boolean | undefined) {
  return value ? "YES" : "NO";
}

function ageLabel(
  value: number | null | undefined,
) {
  if (typeof value !== "number") {
    return "Unavailable";
  }

  return `${value} day${value === 1 ? "" : "s"}`;
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
        {displayValue(value)}
      </div>
    </div>
  );
}

function WorkflowCard({
  title,
  status,
}: {
  title: string;
  status: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {displayValue(status, "UNKNOWN")}
      </div>

      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {title}
      </div>
    </div>
  );
}

function BoundaryCard({
  label,
  allowed,
}: {
  label: string;
  allowed: boolean;
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
        {allowed
          ? "Allowed for applicant visibility."
          : "Not allowed for applicant users."}
      </p>
    </div>
  );
}

export default async function ApplicantCertificationDetailPage({
  params,
}: {
  params: {
    certificationId: string;
  };
}) {
  const certificationId = decodeURIComponent(
    params.certificationId,
  );

  const data =
    await getCertificationDetail(certificationId);

  if (!data.ok || !data.certification) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Certification unavailable"
          description="The requested certification record could not be loaded."
          secondaryDescription={
            data.error ||
            "Certification access is available only for authenticated applicant users."
          }
          actions={
            <PublicButtonLink
              href="/applicant/certifications"
              variant="primary"
            >
              Back to Certifications
            </PublicButtonLink>
          }
        />
      </main>
    );
  }

  const certification = data.certification;
  const workflow = data.workflow ?? [];

  const boundary =
    data.authorityBoundary ?? {
      applicantMayViewCertification: true,
      applicantMayIssueCertification: false,
      applicantMayRenewCertification: false,
      applicantMayAppealCertification: false,
      applicantMayReinstateCertification: false,
      applicantMayRevokeCertification: false,
      applicantMayModifyCertification: false,
      applicantMayModifyFindings: false,
      applicantMayModifyScoring: false,
      applicantMayModifyDecision: false,
      applicantMayModifyRegistry: false,
      applicantMayPublishCertification: false,
    };

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG CERTIFICATION REPOSITORY"
          title={certification.certificationId}
          description={`Certification lifecycle visibility for ${certification.organizationName}.`}
          secondaryDescription="Certification detail pages expose repository visibility, certification lifecycle visibility, validity state, renewal state, appeal state, and publication state only. They do not grant certification issuance, renewal, appeal, reinstatement, publication, registry, scoring, decision, verification, or governance authority."
          actions={
            <>
              <PublicButtonLink
                href="/applicant/certifications"
                variant="primary"
              >
                Back to Certifications
              </PublicButtonLink>

              <PublicButtonLink
                href={`/applicant/cases/${encodeURIComponent(
                  certification.caseId,
                )}`}
                variant="secondary"
              >
                Open Case
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
            Certification Summary
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Certification status and lifecycle visibility
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard
              label="Certification ID"
              value={certification.certificationId}
            />

            <SummaryCard
              label="Case ID"
              value={certification.caseId}
            />

            <SummaryCard
              label="Request ID"
              value={certification.requestId}
            />

            <SummaryCard
              label="Certification Status"
              value={certification.certificationStatus}
            />

            <SummaryCard
              label="Case Status"
              value={certification.caseStatus}
            />

            <SummaryCard
              label="Organization"
              value={certification.organizationName}
            />

            <SummaryCard
              label="Contact Email"
              value={displayValue(
                certification.email,
              )}
            />

            <SummaryCard
              label="Certification Type"
              value={certification.certificationType}
            />

            <SummaryCard
              label="Publication Status"
              value={certification.publicationStatus}
            />

            <SummaryCard
              label="Renewal Status"
              value={certification.renewalStatus}
            />

            <SummaryCard
              label="Valid From"
              value={displayValue(
                certification.validFrom,
                "Not issued",
              )}
            />

            <SummaryCard
              label="Valid To"
              value={displayValue(
                certification.validTo,
                "Not issued",
              )}
            />

            <SummaryCard
              label="Issued At"
              value={displayValue(
                certification.issuedAt,
                "Not issued",
              )}
            />

            <SummaryCard
              label="Last Updated"
              value={displayValue(
                certification.updatedAt,
                "No recent update",
              )}
            />

            <SummaryCard
              label="Source"
              value={certification.source}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Repository Metadata
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Derived certification repository metadata
          </h2>

          <p className="mt-4 max-w-[920px] text-[14px] leading-7 text-black/70">
            Derived metadata improves applicant operational visibility only.
            It does not alter Snowflake authority or create certification,
            publication, registry, decision, or governance authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <SummaryCard
              label="Repository Category"
              value={displayValue(
                certification.repositoryCategory,
                "Certification Repository",
              )}
            />

            <SummaryCard
              label="Workflow Origin"
              value={displayValue(
                certification.workflowOrigin,
                "Applicant Workflow",
              )}
            />

            <SummaryCard
              label="Workflow Stage"
              value={displayValue(
                certification.workflowStage,
                "CERTIFICATION_PENDING",
              )}
            />

            <SummaryCard
              label="Certification Readiness"
              value={displayValue(
                certification.certificationReadiness,
                "NOT_READY",
              )}
            />

            <SummaryCard
              label="Repository Health"
              value={displayValue(
                certification.repositoryHealth,
                "Not classified",
              )}
            />

            <SummaryCard
              label="Age"
              value={ageLabel(
                certification.ageDays,
              )}
            />

            <SummaryCard
              label="Persisted Record"
              value={yesNo(
                certification.repositoryRecord,
              )}
            />

            <SummaryCard
              label="Active"
              value={yesNo(
                certification.isActive,
              )}
            />

            <SummaryCard
              label="Certified"
              value={yesNo(
                certification.isCertified,
              )}
            />

            <SummaryCard
              label="Renewal Pending"
              value={yesNo(
                certification.isRenewalPending,
              )}
            />

            <SummaryCard
              label="Suspended"
              value={yesNo(
                certification.isSuspended,
              )}
            />

            <SummaryCard
              label="Revoked"
              value={yesNo(
                certification.isRevoked,
              )}
            />

            <SummaryCard
              label="Appeal Pending"
              value={yesNo(
                certification.isAppealPending,
              )}
            />

            <SummaryCard
              label="Published"
              value={yesNo(
                certification.isPublished,
              )}
            />
          </div>

          <p className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-[14px] leading-7 text-black/70">
            {displayValue(
              certification.authorityBoundaryText,
              "Operational certification repository visibility only. No certification issuance, renewal, appeal, reinstatement, publication, registry, scoring, decision, verification, or governance authority is created.",
            )}
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Certification Workflow
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Certification lifecycle stages
          </h2>

          {workflow.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
              <div className="text-lg font-semibold text-black">
                No certification workflow is currently available
              </div>

              <p className="mt-2 text-sm leading-6 text-black/60">
                Certification workflow stages will appear when lifecycle
                data is available.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
              {workflow.map((step) => (
                <WorkflowCard
                  key={`${step.stage}-${step.status}`}
                  title={step.stage}
                  status={step.status}
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Applicant Authority Boundaries
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Certification visibility does not create certification authority
          </h2>

          <p className="mt-4 max-w-[920px] text-[14px] leading-7 text-black/70">
            Applicant users may view certification lifecycle information.
            Certification issuance, renewal, appeal, reinstatement,
            revocation, publication, registry mutation, findings, scoring,
            and decisions remain outside applicant authority.
          </p>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <BoundaryCard
              label="View Certification"
              allowed={
                boundary.applicantMayViewCertification
              }
            />

            <BoundaryCard
              label="Issue Certification"
              allowed={
                boundary.applicantMayIssueCertification
              }
            />

            <BoundaryCard
              label="Renew Certification"
              allowed={
                boundary.applicantMayRenewCertification
              }
            />

            <BoundaryCard
              label="Appeal Certification"
              allowed={
                boundary.applicantMayAppealCertification
              }
            />

            <BoundaryCard
              label="Reinstate Certification"
              allowed={
                boundary.applicantMayReinstateCertification
              }
            />

            <BoundaryCard
              label="Revoke Certification"
              allowed={
                boundary.applicantMayRevokeCertification
              }
            />

            <BoundaryCard
              label="Modify Certification"
              allowed={
                boundary.applicantMayModifyCertification
              }
            />

            <BoundaryCard
              label="Modify Findings"
              allowed={
                boundary.applicantMayModifyFindings
              }
            />

            <BoundaryCard
              label="Modify Scoring"
              allowed={
                boundary.applicantMayModifyScoring
              }
            />

            <BoundaryCard
              label="Modify Decision"
              allowed={
                boundary.applicantMayModifyDecision
              }
            />

            <BoundaryCard
              label="Modify Registry"
              allowed={
                boundary.applicantMayModifyRegistry
              }
            />

            <BoundaryCard
              label="Publish Certification"
              allowed={
                boundary.applicantMayPublishCertification
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}