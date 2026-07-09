import { cookies, headers } from "next/headers";
import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type ApplicantCertificationDetailResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  certification?: {
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
  };
  workflow?: Array<{
    stage: string;
    status: string;
  }>;
  authorityBoundary?: {
    applicantMayViewCertification: boolean;
    applicantMayIssueCertification: boolean;
    applicantMayRevokeCertification: boolean;
    applicantMayModifyCertification: boolean;
    applicantMayModifyFindings: boolean;
    applicantMayModifyScoring: boolean;
    applicantMayModifyDecision: boolean;
    applicantMayModifyRegistry: boolean;
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

async function getCertificationDetail(
  certificationId: string,
): Promise<ApplicantCertificationDetailResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/certifications/${encodeURIComponent(
        certificationId,
      )}`,
      {
        cache: "no-store",
        headers: { cookie: cookieHeader },
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
        {value || "—"}
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
        {status}
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
  const data = await getCertificationDetail(params.certificationId);

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
            <>
              <PublicButtonLink
                href="/applicant/certifications"
                variant="primary"
              >
                Back to Certifications
              </PublicButtonLink>
            </>
          }
        />
      </main>
    );
  }

  const certification = data.certification;
  const workflow = data.workflow || [];
  const boundary = data.authorityBoundary;

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG CERTIFICATION REPOSITORY"
          title={certification.certificationId}
          description={`Certification lifecycle visibility for ${certification.organizationName}.`}
          secondaryDescription="Certification detail pages provide applicant visibility only and do not grant certification issuance, publication, registry, scoring, decision, or governance authority."
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
              value={certification.validFrom || "Not issued"}
            />

            <SummaryCard
              label="Valid To"
              value={certification.validTo || "Not issued"}
            />

            <SummaryCard
              label="Issued At"
              value={certification.issuedAt || "Not issued"}
            />

            <SummaryCard
              label="Last Updated"
              value={certification.updatedAt || "No recent update"}
            />

            <SummaryCard
              label="Source"
              value={certification.source}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Certification Workflow
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Certification lifecycle stages
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            {workflow.map((step) => (
              <WorkflowCard
                key={`${step.stage}-${step.status}`}
                title={step.stage}
                status={step.status}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Applicant Authority Boundaries
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Certification visibility does not create certification authority
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-4">
            <BoundaryCard
              label="View Certification"
              allowed={boundary?.applicantMayViewCertification ?? false}
            />

            <BoundaryCard
              label="Issue Certification"
              allowed={boundary?.applicantMayIssueCertification ?? false}
            />

            <BoundaryCard
              label="Revoke Certification"
              allowed={boundary?.applicantMayRevokeCertification ?? false}
            />

            <BoundaryCard
              label="Modify Certification"
              allowed={boundary?.applicantMayModifyCertification ?? false}
            />

            <BoundaryCard
              label="Modify Findings"
              allowed={boundary?.applicantMayModifyFindings ?? false}
            />

            <BoundaryCard
              label="Modify Scoring"
              allowed={boundary?.applicantMayModifyScoring ?? false}
            />

            <BoundaryCard
              label="Modify Decision"
              allowed={boundary?.applicantMayModifyDecision ?? false}
            />

            <BoundaryCard
              label="Modify Registry"
              allowed={boundary?.applicantMayModifyRegistry ?? false}
            />
          </div>
        </section>
      </div>
    </main>
  );
}