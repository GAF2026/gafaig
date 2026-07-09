import { cookies, headers } from "next/headers";
import PublicPageHero from "../../../../_components/PublicPageHero";
import PublicButtonLink from "../../../../_components/PublicButtonLink";

type ApplicantRequestDetailResponse = {
  ok: boolean;
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
    title: string;
    description: string;
    responseRequired: boolean;
    dueDate: string | null;
    updatedAt: string | null;
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

async function getRequestDetail(
  requestId: string,
): Promise<ApplicantRequestDetailResponse> {
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
        headers: { cookie: cookieHeader },
      },
    );

    const json = (await res.json()) as ApplicantRequestDetailResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Request detail failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load request detail.",
    };
  }
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>

      <div className="mt-4 break-words text-[15px] font-semibold leading-7 tracking-tight text-black">
        {value || "—"}
      </div>
    </div>
  );
}

export default async function ApplicantRequestRespondPage({
  params,
}: {
  params: {
    requestId: string;
  };
}) {
  const requestId = decodeURIComponent(params.requestId);
  const data = await getRequestDetail(requestId);

  if (!data.ok || !data.request) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Request response unavailable"
          description="The applicant request response form could not be loaded."
          secondaryDescription={
            data.error ||
            "Request response access is available only for authenticated applicant users."
          }
          actions={
            <>
              <PublicButtonLink href="/applicant/requests" variant="primary">
                Back to Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/dashboard" variant="secondary">
                Dashboard
              </PublicButtonLink>
            </>
          }
        />
      </main>
    );
  }

  const request = data.request;

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT RESPONSE"
          title={`Respond to ${request.requestId}`}
          description={`Organization-scoped applicant response submission for ${request.organizationName}.`}
          secondaryDescription="Applicant request response submission creates applicant-submitted response evidence only. It does not create findings authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink
                href={`/applicant/requests/${encodeURIComponent(
                  request.requestId,
                )}`}
                variant="primary"
              >
                Back to Request
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/requests" variant="secondary">
                Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/evidence/upload" variant="secondary">
                Upload Evidence
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Request Context
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Applicant request requiring response
          </h2>

          <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <SummaryCard label="Request ID" value={request.requestId} />
            <SummaryCard label="Case ID" value={request.caseId} />
            <SummaryCard label="Request Status" value={request.requestStatus} />
            <SummaryCard label="Request Type" value={request.requestType} />
            <SummaryCard label="Case Status" value={request.caseStatus} />
            <SummaryCard label="Due Date" value={request.dueDate || "Not assigned"} />
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 bg-black/[0.02] p-6">
            <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Request Description
            </div>

            <p className="mt-4 text-[15px] leading-8 text-black/75">
              {request.description}
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Response Submission
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Submit applicant response
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Submit a written applicant response for this request. The response
            will be stored as applicant-submitted evidence associated with the
            request and case.
          </p>

          <form
            action={`/api/applicant/requests/${encodeURIComponent(
              request.requestId,
            )}/respond`}
            method="post"
            className="mt-8 space-y-6"
          >
            <div>
              <label
                htmlFor="responseType"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Response Type
              </label>

              <select
                id="responseType"
                name="responseType"
                defaultValue="applicant_response"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              >
                <option value="applicant_response">Applicant Response</option>
                <option value="clarification">Clarification</option>
                <option value="deficiency_response">Deficiency Response</option>
                <option value="remediation_response">Remediation Response</option>
                <option value="supplemental_information">
                  Supplemental Information
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Response Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder={`Applicant response for ${request.requestId}`}
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label
                htmlFor="response"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Response
              </label>

              <textarea
                id="response"
                name="response"
                rows={8}
                required
                placeholder="Enter the applicant response for this request."
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] leading-7 text-black outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label
                htmlFor="sourceUrl"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Source URL
              </label>

              <input
                id="sourceUrl"
                name="sourceUrl"
                type="url"
                placeholder="https://example.com/supporting-reference"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              />
            </div>

            <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6">
              <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Authority Boundary
              </div>

              <p className="mt-3 text-[14px] leading-7 text-black/70">
                This form submits applicant response evidence only. It does not
                change governance findings, scoring, decisions, certification
                status, registry publication, or governance authority.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full border border-black bg-black px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-black/80"
              >
                Submit Response
              </button>

              <PublicButtonLink
                href={`/applicant/requests/${encodeURIComponent(
                  request.requestId,
                )}`}
                variant="secondary"
              >
                Cancel
              </PublicButtonLink>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}