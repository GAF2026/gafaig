"use client";

import { useState } from "react";
import PublicPageHero from "../../../_components/PublicPageHero";
import PublicButtonLink from "../../../_components/PublicButtonLink";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function ApplicantRemediationSubmitPage() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: "submitting" });

    const form = new FormData(event.currentTarget);

    const payload = {
      deficiencyId: String(form.get("deficiencyId") ?? "").trim(),
      caseId: String(form.get("caseId") ?? "").trim(),
      remediationTitle: String(form.get("remediationTitle") ?? "").trim(),
      remediationDescription: String(
        form.get("remediationDescription") ?? "",
      ).trim(),
      sourceUrl: String(form.get("sourceUrl") ?? "").trim() || null,
    };

    try {
      const res = await fetch("/api/applicant/remediation/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.ok) {
        setState({
          status: "error",
          message: json.error || `Submission failed with status ${res.status}`,
        });
        return;
      }

      setState({
        status: "success",
        message: `Remediation submitted successfully: ${json.remediationId}`,
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit remediation.",
      });
    }
  }

  return (
    <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
      <div className="space-y-7 sm:space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG APPLICANT PORTAL"
          title="Submit remediation"
          description="Submit applicant remediation for an organization-scoped deficiency."
          secondaryDescription="Applicant remediation submission creates applicant-submitted remediation evidence only. It does not create findings authority, scoring authority, decision authority, certification authority, registry authority, publication authority, or governance authority."
          actions={
            <>
              <PublicButtonLink href="/applicant/remediation" variant="primary">
                Remediation
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/deficiencies" variant="secondary">
                Deficiencies
              </PublicButtonLink>
              <PublicButtonLink href="/applicant/progress" variant="secondary">
                Progress
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            Remediation submission
          </div>

          <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black sm:text-[26px]">
            Submit applicant remediation response
          </h2>

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <input
              name="deficiencyId"
              required
              placeholder="DEF-REQ-DEMO-1024"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
            />

            <input
              name="caseId"
              required
              placeholder="REQ-DEMO-1024"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
            />

            <input
              name="remediationTitle"
              required
              placeholder="Remediation response title"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
            />

            <textarea
              name="remediationDescription"
              required
              rows={8}
              placeholder="Describe the remediation completed or proposed."
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm leading-7"
            />

            <input
              name="sourceUrl"
              type="url"
              placeholder="https://example.com/supporting-reference"
              className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm"
            />

            {state.status === "success" && (
              <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-sm font-medium text-black">
                {state.message}
              </div>
            )}

            {state.status === "error" && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {state.message}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={state.status === "submitting"}
                className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {state.status === "submitting"
                  ? "Submitting..."
                  : "Submit Remediation"}
              </button>

              <PublicButtonLink href="/applicant/remediation" variant="secondary">
                Cancel
              </PublicButtonLink>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}