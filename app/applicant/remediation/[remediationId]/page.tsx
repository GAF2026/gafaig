import Link from "next/link";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RemediationDetailResponse = {
  ok: boolean;
  error?: string;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  remediation?: Record<string, any>;
  workflow?: Array<{
    stage: string;
    status: string;
  }>;
  authorityBoundaries?: Record<string, boolean>;
};

function value(input: unknown, fallback = "Not available") {
  const text = String(input ?? "").trim();
  return text || fallback;
}

function badge(input: unknown) {
  return value(input, "UNKNOWN").toUpperCase();
}

async function getRemediation(remediationId: string) {
  const h = headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  const res = await fetch(
    `${proto}://${host}/api/applicant/remediation/${encodeURIComponent(
      remediationId,
    )}`,
    {
      cache: "no-store",
      headers: {
        cookie: h.get("cookie") ?? "",
      },
    },
  );

  return (await res.json()) as RemediationDetailResponse;
}

export default async function ApplicantRemediationDetailPage({
  params,
}: {
  params: { remediationId: string };
}) {
  const remediationId = decodeURIComponent(params.remediationId);
  const data = await getRemediation(remediationId);

  if (!data.ok || !data.remediation) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <section className="rounded-3xl border border-neutral-200 bg-white p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            GAFAIG applicant portal
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Remediation unavailable
          </h1>
          <p className="mt-4 text-sm text-neutral-600">
            {data.error ?? "The requested remediation record could not be loaded."}
          </p>
          <div className="mt-6 flex gap-3">
            <Link className="rounded-full bg-black px-4 py-2 text-sm text-white" href="/applicant/remediation">
              Back to remediation
            </Link>
            <Link className="rounded-full border px-4 py-2 text-sm" href="/applicant/dashboard">
              Dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const remediation = data.remediation;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          GAFAIG applicant remediation
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {value(remediation.remediationId, remediationId)}
        </h1>
        <p className="mt-4 text-sm text-neutral-600">
          Organization-scoped remediation visibility for{" "}
          {value(data.organization?.organizationName)}.
        </p>
        <p className="mt-4 text-sm text-neutral-600">
          Remediation detail pages expose applicant-facing remediation visibility
          only. They do not create findings authority, scoring authority,
          decision authority, certification authority, registry authority,
          publication authority, or governance authority.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="rounded-full bg-black px-4 py-2 text-sm text-white" href="/applicant/remediation">
            Back to Remediation
          </Link>
          <Link className="rounded-full border px-4 py-2 text-sm" href={`/applicant/cases/${remediation.caseId}`}>
            Open Case
          </Link>
          <Link className="rounded-full border px-4 py-2 text-sm" href="/applicant/progress">
            Progress
          </Link>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Remediation summary
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Remediation status and deficiency context
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["Remediation ID", remediation.remediationId],
            ["Evidence ID", remediation.evidenceId],
            ["Deficiency ID", remediation.deficiencyId],
            ["Case ID", remediation.caseId],
            ["Request ID", remediation.requestId],
            ["Status", remediation.remediationStatus],
            ["Case Status", remediation.caseStatus],
            ["Submitted By", remediation.submittedBy],
            ["Submitted At", remediation.submittedAt],
            ["Updated At", remediation.updatedAt],
            ["Source", remediation.source],
            ["Source URL", remediation.sourceUrl],
          ].map(([label, val]) => (
            <div key={label} className="rounded-2xl border border-neutral-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                {label}
              </p>
              <p className="mt-3 text-sm font-semibold break-words">
                {value(val)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Remediation content
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Applicant remediation response
        </h2>
        <div className="mt-6 rounded-2xl border border-neutral-200 p-5">
          <p className="text-sm font-semibold">{value(remediation.title)}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm text-neutral-600">
            {value(remediation.description, "No remediation description provided.")}
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Remediation workflow
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Remediation lifecycle visibility
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(data.workflow ?? []).map((item) => (
            <div key={item.stage} className="rounded-2xl border border-neutral-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                {badge(item.status)}
              </p>
              <p className="mt-3 text-sm font-semibold">{item.stage}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
          Applicant authority boundaries
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          Remediation visibility does not grant governance authority
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            ["View Remediation", true],
            ["Submit Remediation", true],
            ["Modify Findings", false],
            ["Modify Scoring", false],
            ["Modify Decision", false],
            ["Modify Registry", false],
          ].map(([label, allowed]) => (
            <div key={String(label)} className="rounded-2xl border border-neutral-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                Authority boundary
              </p>
              <p className="mt-3 text-sm font-semibold">{label}</p>
              <p className="mt-2 text-sm text-neutral-600">
                {allowed ? "Allowed for applicant users." : "Not allowed for applicant users."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}