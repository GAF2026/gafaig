import Script from "next/script";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

function CopySnippetButton({
  label,
  copyValue,
}: {
  label: string;
  copyValue: string;
}) {
  return (
    <button
      type="button"
      data-copy-text={copyValue}
      className="gafaig-copy-button inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
    >
      {label}
    </button>
  );
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
  const verifyScriptSrc = `${runtimeBaseUrl}/widget/gafaig-verify.js`;

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
  const isCertified = Boolean(String(record.certifiedAt ?? "").trim());

  const widgetSnippet = `<script src="${productionBaseUrl}/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${registryId}"></div>`;

  const verifyButtonSnippet = `<script src="${productionBaseUrl}/widget/gafaig-widget.js"></script>
<script src="${productionBaseUrl}/widget/gafaig-verify.js"></script>
<button onclick="verifyGAFAIG('${registryId}', { baseUrl: '${productionBaseUrl}' })">
  Verify this GAFAIG record
</button>`;

  const verifyJsonUrl = `${productionBaseUrl}/api/verify/${encodeURIComponent(
    registryId
  )}`;
  const registryUrl = `${productionBaseUrl}/registry/${encodeURIComponent(
    registryId
  )}`;
  const verifyPageUrl = `${productionBaseUrl}/verify/${encodeURIComponent(
    registryId
  )}`;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GAFAIG WIDGET PREVIEW"
          title="Preview the live verification widget"
          description="This page shows the public GAFAIG widget exactly as external sites can embed it. The widget pulls from the live verification endpoint and renders the current public trust record."
          secondaryDescription="A record may be Approved or Certified. Approved means evaluated. Certified means trusted and published as a finalized public registry record. Use this page to inspect the live widget, copy installation snippets, and confirm how the registry page, badge, widget, and verify JSON work together as one public trust surface."
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

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-[980px] space-y-3 text-[15px] leading-[1.8] text-black/65">
            <p>
              The widget preview distinguishes between evaluated records and
              publicly trusted records.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="grid gap-3 text-[15px] leading-[1.8] text-black/72">
                <div>
                  <span className="font-semibold text-black">Approved</span>{" "}
                  means the record has completed the GAFAIG evaluation process
                  and received a governance decision.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means the evaluated outcome has been finalized and published as
                  a trusted public record in the GAFAIG registry of record.
                </div>
              </div>
            </div>

            <p className="text-black/60">
              This widget renders the live public trust state for the selected
              record.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Entity" value={entityName} />
          <MetricCard
            label="Trust State"
            value={isCertified ? "Certified" : "Approved"}
          />
          <MetricCard
            label="Tier / Band"
            value={
              isCertified
                ? `${valueOrDash(record.certifiedTier)} · ${valueOrDash(
                    record.certifiedBand
                  )}`
                : "—"
            }
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

            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink
                href={`/registry/${encodeURIComponent(registryId)}`}
                variant="secondary"
              >
                Open record
              </PublicButtonLink>

              <PublicButtonLink
                href={`/verify/${encodeURIComponent(registryId)}`}
                variant="secondary"
              >
                Open verify page
              </PublicButtonLink>
            </div>
          </section>

          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Quick install
            </div>

            <div className="mt-4 space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-black">
                    Widget embed snippet
                  </div>
                  <CopySnippetButton
                    label="Copy Widget Snippet"
                    copyValue={widgetSnippet}
                  />
                </div>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
                  <code>{widgetSnippet}</code>
                </pre>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-black">
                    Verify button snippet
                  </div>
                  <CopySnippetButton
                    label="Copy Verify Snippet"
                    copyValue={verifyButtonSnippet}
                  />
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
            Verification modal test
          </div>

          <div className="mt-4 max-w-[900px] text-[15px] leading-[1.8] text-black/68">
            The external verification modal can be launched from any site that
            includes the GAFAIG verification helper. This simulates how a
            third-party site can let users inspect the live trust result without
            leaving the page.
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
            <Script src={verifyScriptSrc} strategy="afterInteractive" />
            <button
              type="button"
              data-gafaig-open-verify={registryId}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Open Verification Modal
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            What this proves
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-black/10 p-5 text-[14px] leading-7 text-black/72">
              The widget runs against the live GAFAIG verification endpoint and
              renders the current public trust record in real time.
            </div>
            <div className="rounded-2xl border border-black/10 p-5 text-[14px] leading-7 text-black/72">
              External sites can embed the same widget without reproducing
              evaluation or certification logic or touching private evidence.
            </div>
            <div className="rounded-2xl border border-black/10 p-5 text-[14px] leading-7 text-black/72">
              The registry page, badge, widget, and verify JSON form one
              unified public trust surface.
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            External URLs
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <MetricCard label="Registry Record" value={registryUrl} />
            <MetricCard label="Verify Page" value={verifyPageUrl} />
            <MetricCard label="Verify JSON" value={verifyJsonUrl} />
          </div>
        </section>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const copyButtons = Array.from(document.querySelectorAll('.gafaig-copy-button'));

                async function copyText(text) {
                  try {
                    if (navigator.clipboard && window.isSecureContext) {
                      await navigator.clipboard.writeText(text);
                      return true;
                    }
                  } catch (_) {}

                  try {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-9999px';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    const ok = document.execCommand('copy');
                    document.body.removeChild(textarea);
                    return ok;
                  } catch (_) {
                    return false;
                  }
                }

                copyButtons.forEach((button) => {
                  button.addEventListener('click', async () => {
                    const original = button.textContent || 'Copy';
                    const text = button.getAttribute('data-copy-text') || '';
                    const ok = await copyText(text);
                    button.textContent = ok ? 'Copied' : 'Copy Failed';
                    setTimeout(() => {
                      button.textContent = original;
                    }, 1500);
                  });
                });

                const verifyButton = document.querySelector('[data-gafaig-open-verify]');
                if (verifyButton) {
                  verifyButton.addEventListener('click', () => {
                    const registryId = verifyButton.getAttribute('data-gafaig-open-verify');
                    if (registryId && window.verifyGAFAIG) {
                      window.verifyGAFAIG(registryId, {
                        baseUrl: '${productionBaseUrl}',
                      });
                    }
                  });
                }
              })();
            `,
          }}
        />
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