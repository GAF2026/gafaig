import Script from "next/script";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

export const dynamic = "force-dynamic";

type VerifyApiResponse = {
  ok?: boolean;
  verified?: boolean;
  registryId?: string;
  record?: {
    registryId?: string | null;
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    applicationId?: string | null;
    caseId?: string | null;
    certificationStatus?: string | null;
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    decisionStatus?: string | null;
    certifiedAt?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
  } | null;
  proof?: {
    alg?: string | null;
    kid?: string | null;
    signature?: string | null;
    signedAt?: string | null;
    verificationKeyUrl?: string | null;
    message?: Record<string, unknown> | null;
    messageString?: string | null;
  } | null;
  error?: string;
};

function getRuntimeBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return process.env.NEXT_PUBLIC_BASE_URL || "https://www.gafaig.com";
}

async function getVerifyData(
  registryId: string
): Promise<VerifyApiResponse | null> {
  try {
    const baseUrl = getRuntimeBaseUrl();
    const res = await fetch(
      `${baseUrl}/api/verify/${encodeURIComponent(registryId)}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return (await res.json()) as VerifyApiResponse;
  } catch {
    return null;
  }
}

function valueOrDash(value?: string | null) {
  return value && value.trim() ? value : "—";
}

export default async function WidgetPreviewPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = params.registryId;
  const verifyData = await getVerifyData(registryId);

  const runtimeBaseUrl = getRuntimeBaseUrl();
  const widgetScriptSrc = `${runtimeBaseUrl}/widget/gafaig-widget.js`;

  const productionBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.gafaig.com";

  if (!verifyData?.ok || !verifyData?.verified || !verifyData?.record) {
    return (
      <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
        <div className="space-y-8">
          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
              Widget Preview
            </div>
            <h1 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Widget unavailable
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-black/70">
              This registry record could not be verified or is not currently
              available for widget preview.
            </p>
            <div className="mt-8">
              <PublicButtonLink href="/registry" variant="secondary">
                Back to registry
              </PublicButtonLink>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const record = verifyData.record;
  const entityName = record.entityName || "Unknown Entity";

  const widgetSnippet = `<script src="${productionBaseUrl}/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${registryId}"></div>`;

  const verifyButtonSnippet = `<script src="${productionBaseUrl}/widget/gafaig-verify.js"></script>
<button onclick="verifyGAFAIG('${registryId}')">Verify This AI System</button>`;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG WIDGET PREVIEW"
          title="Preview the live verification widget"
          description="This page shows the public GAFAIG widget exactly as external sites can embed it. The widget pulls from the live verification endpoint and renders the current public certification record."
          secondaryDescription="Use this page to inspect the live widget, copy installation snippets, and confirm how the registry page, badge, widget, and verify JSON work together as one public trust surface."
          actions={
            <>
              <PublicButtonLink
                href={`/api/verify/${encodeURIComponent(registryId)}`}
                variant="primary"
              >
                Open Verify JSON
              </PublicButtonLink>

              <PublicButtonLink
                href={`/registry/${encodeURIComponent(registryId)}`}
                variant="secondary"
              >
                Open Registry Record
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Entity" value={entityName} />
          <MetricCard
            label="Tier / Band"
            value={`${valueOrDash(record.certifiedTier)} · ${valueOrDash(
              record.certifiedBand
            )}`}
          />
          <MetricCard
            label="Decision"
            value={valueOrDash(record.decisionStatus)}
          />
          <MetricCard label="Valid To" value={valueOrDash(record.validTo)} />
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Live widget
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <Script src={widgetScriptSrc} strategy="afterInteractive" />
              <div data-gafaig-id={registryId}></div>
            </div>
          </section>

          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Quick install
            </div>

            <div className="mt-4 space-y-6">
              <div>
                <div className="text-sm font-semibold text-black">
                  Widget embed snippet
                </div>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
                  <code>{widgetSnippet}</code>
                </pre>
              </div>

              <div>
                <div className="text-sm font-semibold text-black">
                  Verify button snippet
                </div>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
                  <code>{verifyButtonSnippet}</code>
                </pre>
              </div>
            </div>
          </section>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            What this proves
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 p-5 text-[14px] leading-7 text-black/72">
              The widget runs against the live GAFAIG verification endpoint and
              renders the public certification record in real time.
            </div>
            <div className="rounded-2xl border border-black/10 p-5 text-[14px] leading-7 text-black/72">
              External sites can embed the same widget without reproducing
              certification logic or touching private evidence.
            </div>
            <div className="rounded-2xl border border-black/10 p-5 text-[14px] leading-7 text-black/72">
              The registry page, badge, widget, and verify JSON now form one
              unified public trust surface.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 break-words text-[20px] font-semibold tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}