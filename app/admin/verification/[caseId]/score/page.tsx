import Link from "next/link";
import { notFound } from "next/navigation";
import PublicButtonLink from "../../../../_components/PublicButtonLink";
import PublishCertificationButton from "./PublishCertificationButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ScorePageProps = {
  params: Promise<{
    caseId: string;
  }>;
};

function normalizeCaseId(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidCaseId(value: string): boolean {
  return /^[A-Z0-9][A-Z0-9._:-]{1,127}$/i.test(value);
}

export default async function VerificationScorePage({
  params,
}: ScorePageProps) {
  const { caseId: rawCaseId } = await params;
  const caseId = normalizeCaseId(rawCaseId);

  if (!isValidCaseId(caseId)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0b1020] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-white/60">
          <Link href="/admin/applications" className="transition hover:text-white">
            Applications
          </Link>
          <span>/</span>
          <Link
            href={`/admin/verification/${encodeURIComponent(caseId)}`}
            className="transition hover:text-white"
          >
            Verification
          </Link>
          <span>/</span>
          <span className="text-white/85">Score</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/70">
              GAFAIG Admin
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Certification Score
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
              Review deterministic scoring output for this verification case and
              publish the approved certification into the public registry without
              exposing private evidence.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
            <div className="text-[11px] uppercase tracking-[0.14em] text-white/45">
              Case ID
            </div>
            <div className="mt-1 font-medium text-white">{caseId}</div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid gap-6">
          {/* Score + Publish */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">
                Score + Publish
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                This screen is the bridge between the private verification
                engine and the public registry. Publishing creates or returns
                the deterministic registry record for this case while keeping
                evidence private inside the controlled layer.
              </p>
            </div>

            <PublishCertificationButton
              caseId={caseId}
              initialRegistryId={null}
            />
          </section>

          {/* Next Integration */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-white">
              Next integration point
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Once this publish action is working, the next step is to connect
              the public registry views:
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                  Public registry list
                </div>
                <div className="mt-2 text-sm font-medium text-white">
                  /registry/ai-systems
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                  Verification endpoint
                </div>
                <div className="mt-2 text-sm font-medium text-white">
                  /api/verify/[registryId]
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/45">
                  Public record page
                </div>
                <div className="mt-2 text-sm font-medium text-white">
                  /registry/ai-systems/[registryId]
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Actions (STANDARDIZED) */}
          <div className="flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/admin/verification/${encodeURIComponent(caseId)}`}
              variant="secondary"
              size="sm"
            >
              ← Back to Verification
            </PublicButtonLink>

            <PublicButtonLink
              href="/admin/applications"
              variant="ghost"
              size="sm"
            >
              Applications
            </PublicButtonLink>
          </div>
        </div>
      </div>
    </main>
  );
}