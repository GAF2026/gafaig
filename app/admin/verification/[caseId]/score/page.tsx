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

function StepCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </div>
      <div className="mt-3 text-[15px] font-semibold text-black">{value}</div>
    </div>
  );
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
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-black/60">
            <PublicButtonLink
              href="/admin/applications"
              variant="ghost"
              size="sm"
            >
              Applications
            </PublicButtonLink>
            <span>/</span>
            <PublicButtonLink
              href={`/admin/verification/${encodeURIComponent(caseId)}`}
              variant="ghost"
              size="sm"
            >
              Verification
            </PublicButtonLink>
            <span>/</span>
            <span className="text-black/85">Score</span>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                GAFAIG ADMIN
              </div>
              <h1 className="mt-4 text-[32px] md:text-[38px] font-semibold tracking-tight text-black">
                Certification Score
              </h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-black/70">
                Review deterministic scoring output for this verification case and
                publish the approved certification into the public registry without
                exposing private evidence.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 text-sm text-black/75">
              <div className="text-[11px] uppercase tracking-[0.14em] text-black/45">
                Case ID
              </div>
              <div className="mt-2 font-medium text-black">{caseId}</div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="mb-4">
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Score + Publish
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-black/70">
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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Next trust surfaces
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-black/70">
            Once publish succeeds, validate the certification across the live
            public trust surfaces that now represent the canonical GAFAIG
            record.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StepCard label="Public registry list" value="/registry" />
            <StepCard
              label="Verification endpoint"
              value="/api/verify/[registryId]"
            />
            <StepCard
              label="Public record page"
              value="/registry/[registryId]"
            />
            <StepCard label="Badge endpoint" value="/badge/[registryId]" />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            After publish
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-black/70">
            After publishing, confirm that the registry record resolves
            correctly through the public registry, verification endpoint, and
            badge layer.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StepCard
              label="Step 1"
              value="Confirm the record appears in /registry"
            />
            <StepCard
              label="Step 2"
              value="Open /api/verify/[registryId]"
            />
            <StepCard
              label="Step 3"
              value="Test /badge/[registryId] and /registry/[registryId]"
            />
          </div>
        </section>

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
    </main>
  );
}