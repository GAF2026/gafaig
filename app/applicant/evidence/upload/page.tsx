import { cookies, headers } from "next/headers";

import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type ApplicantCasesResponse = {
  ok: boolean;
  organization?: {
    organizationId: string;
    organizationName: string;
  };
  cases?: Array<{
    caseId: string;
    organizationName: string;
    email: string | null;
    status: string;
    stage: string;
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

async function getApplicantCases(): Promise<ApplicantCasesResponse> {
  const baseUrl = await getBaseUrl();

  const cookieHeader = cookies()
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}/api/applicant/cases`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    });

    const json = (await res.json()) as ApplicantCasesResponse;

    if (res.ok && json.ok) return json;

    return {
      ok: false,
      error: json.error || `Cases request failed with status ${res.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to load applicant cases.",
    };
  }
}

export default async function ApplicantEvidenceUploadPage() {
  const data = await getApplicantCases();

  if (!data.ok) {
    return (
      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="space-y-7 sm:space-y-8">
          <PublicPageHero
            eyebrow="GAFAIG APPLICANT PORTAL"
            title="Evidence upload unavailable"
            description="The applicant evidence upload form could not be loaded."
            secondaryDescription={
              data.error ||
              "Evidence upload is available only for authenticated organization-scoped users."
            }
            actions={
              <>
                <PublicButtonLink href="/applicant/evidence" variant="primary">
                  Back to Evidence
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

  const organizationName =
    data.organization?.organizationName || "Applicant Organization";

  const cases = data.cases || [];

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Upload applicant evidence"
          description={`Organization-scoped evidence upload for ${organizationName}.`}
          secondaryDescription="Applicant evidence upload creates applicant-submitted evidence records only. It does not create findings authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/evidence" variant="primary">
                Evidence
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/requests" variant="secondary">
                Requests
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/cases" variant="secondary">
                Cases
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Evidence upload
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Submit evidence for an organization-scoped case
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-8 text-black/75">
            Select an applicant case, attach a file, and submit applicant
            evidence. The upload route verifies that the selected case belongs
            to the authenticated applicant organization before writing evidence
            metadata.
          </p>

          <form
            action="/api/applicant/evidence/upload"
            method="post"
            encType="multipart/form-data"
            className="mt-8 space-y-6"
          >
            <div>
              <label
                htmlFor="caseId"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Case
              </label>

              <select
                id="caseId"
                name="caseId"
                required
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              >
                <option value="">Select a case</option>
                {cases.map((item) => (
                  <option key={item.caseId} value={item.caseId}>
                    {item.caseId} — {item.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="evidenceType"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Evidence Type
              </label>

              <select
                id="evidenceType"
                name="evidenceType"
                defaultValue="document"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              >
                <option value="document">Document</option>
                <option value="policy">Policy</option>
                <option value="procedure">Procedure</option>
                <option value="attestation">Attestation</option>
                <option value="audit_artifact">Audit Artifact</option>
                <option value="system_record">System Record</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Uploaded applicant evidence"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Describe what this evidence supports."
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
                placeholder="https://example.com/source"
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                File
              </label>

              <input
                id="file"
                name="file"
                type="file"
                required
                className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] text-black outline-none transition focus:border-black/30"
              />
            </div>

            <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6">
              <div className="text-[13px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Authority Boundary
              </div>

              <p className="mt-3 text-[14px] leading-7 text-black/70">
                This form submits applicant evidence metadata and stores the
                uploaded file. It does not create findings, scoring, decision,
                certification, registry, publication, or governance authority.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full border border-black bg-black px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-black/80"
              >
                Upload Evidence
              </button>

              <PublicButtonLink href="/applicant/evidence" variant="secondary">
                Cancel
              </PublicButtonLink>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}