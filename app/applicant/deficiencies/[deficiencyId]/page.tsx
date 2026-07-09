import { cookies, headers } from "next/headers";
import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type ApplicantDeficiencyDetailResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  deficiency?: {
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
    remediationId?: string | null;
    remediationEvidenceId?: string | null;
    remediationSubmittedAt?: string | null;
    remediationSubmittedBy?: string | null;
  };
  workflow?: Array<{
    stage: string;
    status: string;
  }>;
  authorityBoundary?: {
    applicantMayViewDeficiency: boolean;
    applicantMayCreateDeficiency: boolean;
    applicantMayCloseDeficiency: boolean;
    applicantMayModifyDeficiency: boolean;
    applicantMayModifyFindings: boolean;
    applicantMayModifyScoring: boolean;
    applicantMayModifyDecision: boolean;
    applicantMayModifyCertification: boolean;
    applicantMayModifyRegistry: boolean;
  };
  error?: string;
};

async function getBaseUrl() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

async function getDeficiencyDetail(
  deficiencyId: string,
): Promise<ApplicantDeficiencyDetailResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(
      `${baseUrl}/api/applicant/deficiencies/${encodeURIComponent(
        deficiencyId,
      )}`,
      {
        cache: "no-store",
        headers: {
          cookie: cookieHeader,
        },
      },
    );

    const json = (await res.json()) as ApplicantDeficiencyDetailResponse;

    if (res.ok && json.ok) {
      return json;
    }

    return {
      ok: false,
      error: json.error || `Deficiency detail failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load deficiency detail.",
    };
  }
}

function display(value: string | null | undefined) {
  const text = String(value ?? "").trim();
  return text || "Not available";
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>

      <div className="mt-4 break-words text-[16px] font-semibold leading-7 tracking-tight text-black">
        {display(value)}
      </div>
    </div>
  );
}

function WorkflowCard({ title, status }: { title: string; status: string }) {
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

function BoundaryCard({ label, allowed }: { label: string; allowed: boolean }) {
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

export default async function ApplicantDeficiencyDetailPage({
  params,
}: {
  params: {
    deficiencyId: string;
  };
}) {
  const data = await getDeficiencyDetail(params.deficiencyId);

  if (!data.ok || !data.deficiency) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Deficiency unavailable"
          description="The requested deficiency record could not be loaded."
          secondaryDescription={
            data.error ||
            "Deficiency access is available only for authenticated applicant users."
          }
          actions={
            <PublicButtonLink href="/applicant/deficiencies" variant="primary">
              Back to Deficiencies
            </PublicButtonLink>
          }
        />
      </main>
    );
  }

  const deficiency = data.deficiency;
  const workflow = data.workflow ?? [];
  const boundary = data.authorityBoundary;

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG DEFICIENCY NOTICE"
          title={deficiency.deficiencyId}
          description={`Deficiency visibility for ${deficiency.organizationName}.`}
          secondaryDescription="Deficiency detail pages provide applicant visibility only and do not grant deficiency authority, findings authority, scoring authority, decision authority, certification authority, publication authority, registry authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/deficiencies" variant="primary">
                Back to Deficiencies
              </PublicButtonLink>

              <PublicButtonLink
                href="/applicant/remediation/submit"
                variant="secondary"
              >
                Remediate
              </PublicButtonLink>

              <PublicButtonLink
                href={`/applicant/cases/${encodeURIComponent(
                  deficiency.caseId,
                )}`}
                variant="secondary"
              >
                Open Case
              </PublicButtonLink>

              <PublicButtonLink
                href={`/applicant/requests/${encodeURIComponent(
                  deficiency.requestId,
                )}`}
                variant="secondary"
              >
                Open Request
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/50">
            Deficiency Summary
          </div>

          <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
            Deficiency status and workflow context
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard label="Deficiency ID" value={deficiency.deficiencyId} />
            <SummaryCard label="Case ID" value={deficiency.caseId} />
            <SummaryCard label="Request ID" value={deficiency.requestId} />
            <SummaryCard label="Deficiency Status" value={deficiency.deficiencyStatus} />
            <SummaryCard label="Case Status" value={deficiency.caseStatus} />
            <SummaryCard label="Deficiency Type" value={deficiency.deficiencyType} />
            <SummaryCard label="Organization" value={deficiency.organizationName} />
            <SummaryCard label="Contact Email" value={display(deficiency.email)} />
            <SummaryCard label="Source" value={deficiency.source} />
            <SummaryCard
              label="Response Required"
              value={deficiency.responseRequired ? "Yes" : "No"}
            />
            <SummaryCard label="Due Date" value={display(deficiency.dueDate)} />
            <SummaryCard label="Updated At" value={display(deficiency.updatedAt)} />
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/50">
            Deficiency Detail
          </div>

          <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
            Applicant deficiency description
          </h2>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
            <p className="text-[15px] leading-7 text-black/75">
              {display(deficiency.description)}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/50">
            Remediation Linkage
          </div>

          <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
            Applicant remediation visibility
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              label="Remediation ID"
              value={display(deficiency.remediationId)}
            />
            <SummaryCard
              label="Remediation Evidence ID"
              value={display(deficiency.remediationEvidenceId)}
            />
            <SummaryCard
              label="Submitted At"
              value={display(deficiency.remediationSubmittedAt)}
            />
            <SummaryCard
              label="Submitted By"
              value={display(deficiency.remediationSubmittedBy)}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/50">
            Deficiency Workflow
          </div>

          <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
            Deficiency lifecycle visibility
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workflow.map((item) => (
              <WorkflowCard
                key={`${item.stage}-${item.status}`}
                title={item.stage}
                status={item.status}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/50">
            Applicant Authority Boundaries
          </div>

          <h2 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
            Deficiency visibility does not grant governance authority
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <BoundaryCard
              label="View deficiency"
              allowed={boundary?.applicantMayViewDeficiency ?? true}
            />
            <BoundaryCard
              label="Create deficiency"
              allowed={boundary?.applicantMayCreateDeficiency ?? false}
            />
            <BoundaryCard
              label="Close deficiency"
              allowed={boundary?.applicantMayCloseDeficiency ?? false}
            />
            <BoundaryCard
              label="Modify deficiency"
              allowed={boundary?.applicantMayModifyDeficiency ?? false}
            />
            <BoundaryCard
              label="Modify findings"
              allowed={boundary?.applicantMayModifyFindings ?? false}
            />
            <BoundaryCard
              label="Modify scoring"
              allowed={boundary?.applicantMayModifyScoring ?? false}
            />
            <BoundaryCard
              label="Modify decision"
              allowed={boundary?.applicantMayModifyDecision ?? false}
            />
            <BoundaryCard
              label="Modify certification"
              allowed={boundary?.applicantMayModifyCertification ?? false}
            />
            <BoundaryCard
              label="Modify registry"
              allowed={boundary?.applicantMayModifyRegistry ?? false}
            />
          </div>
        </section>
      </div>
    </main>
  );
}