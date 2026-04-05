import Script from "next/script";
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

async function getVerifyData(
  registryId: string
): Promise<VerifyApiResponse | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gafaig.com";
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

  if (!verifyData?.ok || !verifyData?.verified || !verifyData?.record) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
            Widget Preview
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-black">
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
        </div>
      </div>
    );
  }

  const record = verifyData.record;
  const entityName = record.entityName || "Unknown Entity";

  const widgetSnippet = `<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${registryId}"></div>`;

  const verifyButtonSnippet = `<script src="https://www.gafaig.com/widget/gafaig-verify.js"></script>
<button onclick="verifyGAFAIG('${registryId}')">Verify This AI System</button>`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[760px]">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/55">
              GAFAIG Widget Preview
            </div>

            <h1 className="mt-4 text-[38px] font-semibold leading-[1.08] tracking-tight text-black">
              Preview the live verification widget
            </h1>

            <p className="mt-4 text-[15px] leading-8 text-black/72">
              This page shows the public GAFAIG widget exactly as external sites
              can embed it. The widget pulls from the live verification endpoint
              and renders the current public certification record.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PublicButtonLink
              href={`/registry/${encodeURIComponent(registryId)}`}
              variant="secondary"
            >
              Open registry record
            </PublicButtonLink>

            <PublicButtonLink
              href={`/api/verify/${encodeURIComponent(registryId)}`}
              variant="primary"
            >
              Open verify JSON
            </PublicButtonLink>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
              Entity
            </div>
            <div className="mt-3 text-[16px] font-semibold text-black">
              {entityName}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
              Tier / Band
            </div>
            <div className="mt-3 text-[16px] font-semibold text-black">
              {valueOrDash(record.certifiedTier)} · {valueOrDash(record.certifiedBand)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
              Decision
            </div>
            <div className="mt-3 text-[16px] font-semibold text-black">
              {valueOrDash(record.decisionStatus)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
              Valid To
            </div>
            <div className="mt-3 text-[16px] font-semibold text-black">
              {valueOrDash(record.validTo)}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-black/10 p-6">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Live widget
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <Script
                src="https://www.gafaig.com/widget/gafaig-widget.js"
                strategy="afterInteractive"
              />
              <div data-gafaig-id={registryId}></div>
            </div>
          </section>

          <section className="rounded-3xl border border-black/10 p-6">
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
        </div>

        <div className="mt-10 rounded-3xl border border-black/10 p-6">
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
        </div>
      </div>
    </div>
  );
}