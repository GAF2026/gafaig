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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 break-words text-[20px] font-semibold tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function StatementCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-3 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}

function BulletCard({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
      <span className="text-[14px] leading-6 text-black/75">{text}</span>
    </div>
  );
}

export default async function WidgetPreviewPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = decodeURIComponent(params.registryId);
  const verifyData = await getVerifyData(registryId);

  const runtimeBaseUrl = getRuntimeBaseUrl();
  const widgetScriptSrc = `${runtimeBaseUrl}/widget/gafaig-widget.v1.js`;
  const verifyScriptSrc = `${runtimeBaseUrl}/widget/gafaig-verify.v1.js`;

  const productionBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.gafaig.com";

  if (!verifyData?.ok || !verifyData?.record) {
    return (
      <main className="mx-auto max-w-[1180px] px-6 py-10">
        <div className="space-y-8">
          <PublicPageHero
            eyebrow="WIDGET PREVIEW"
            title="Widget unavailable"
            description="This registry record could not be loaded for widget preview."
            secondaryDescription="The widget preview depends on a live public verification record. If the record is unavailable, unpublished, or unresolved, the widget cannot render."
            actions={
              <>
                <PublicButtonLink href="/demo" variant="primary">
                  Return to Demo
                </PublicButtonLink>
                <PublicButtonLink href="/registry" variant="secondary">
                  Browse Registry
                </PublicButtonLink>
              </>
            }
          />

          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <p className="max-w-[900px] text-[15px] leading-[1.85] text-black/72">
              This preview uses the same public trust surfaces that external
              sites use. If a live verification record is not available, the
              widget cannot show a trust result.
            </p>
          </section>
        </div>
      </main>
    );
  }

  const record = verifyData.record;
  const entityName = record.entityName || "Unknown Entity";
  const trustState = String(record.certifiedAt ?? "").trim()
    ? "Certified"
    : "Not Certified";

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
  const demoUrl = `${productionBaseUrl}/demo`;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="WIDGET PREVIEW"
          title="From verified proof to portable trust"
          description="This page shows how a real GAFAIG record can be displayed on a third-party website through a live widget and verification modal."
          secondaryDescription="The widget preview is part of the GAFAIG proof flow. A record is certified in GAFAIG, verified through signed public proof, and then surfaced as a portable trust signal that can appear outside the originating organization’s platform."
          actions={
            <>
              <PublicButtonLink
                href={`/registry/${encodeURIComponent(registryId)}`}
                variant="primary"
              >
                Open Registry Record
              </PublicButtonLink>

              <PublicButtonLink
                href={`/verify/${encodeURIComponent(registryId)}`}
                variant="secondary"
              >
                Open Verify Page
              </PublicButtonLink>

              <PublicButtonLink href="/demo" variant="secondary">
                Return to Demo
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <p className="text-[15px] leading-[1.8] text-black/70">
            The widget independently verifies the signed GAFAIG payload in the browser using the public verification key.
            No trust is assumed from the host system. The result is cryptographically validated against the canonical signed messageString returned by the verification endpoint.
          </p>

          <p className="mt-4 text-[15px] leading-[1.8] text-black/70">
            This is how GAFAIG trust appears outside the originating organization’s platform.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THIS PAGE SHOWS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            A verified trust signal that can be displayed on any external system
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75">
            The widget is not a static badge. It is a live trust surface that
            reads from GAFAIG’s public verification layer and independently
            verifies the signed payload in the browser. This allows a
            third-party site to display a current GAFAIG trust record without
            recreating the verification process or exposing private internal
            materials.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="What it proves"
              body="A certified GAFAIG record can be surfaced outside the GAFAIG website while preserving the same public trust outcome."
            />
            <StatementCard
              title="Why it matters"
              body="Trust no longer has to remain inside the certifying platform. It can be reviewed and verified wherever the record appears."
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Entity" value={entityName} />
          <MetricCard label="Trust State" value={trustState} />
          <MetricCard label="Certified At" value={valueOrDash(record.certifiedAt)} />
          <MetricCard label="Valid To" value={valueOrDash(record.validTo)} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            THE WIDGET FLOW
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            How external trust is delivered
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Certified registry record"
              body="A GAFAIG record exists in the public registry and can be verified through the public trust surface."
            />
            <StepCard
              number="2"
              title="External widget integration"
              body="An external site loads the GAFAIG widget script using the registry identifier."
            />
            <StepCard
              number="3"
              title="Live verification fetch"
              body="The widget resolves the live trust data from GAFAIG’s public verification endpoints."
            />
            <StepCard
              number="4"
              title="Portable trust surface"
              body="The site displays a current GAFAIG trust signal without running its own governance verification logic."
            />
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              LIVE PREVIEW
            </div>

            <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
              Embedded trust widget
            </h2>

            <p className="mt-4 max-w-[820px] text-[15px] leading-[1.8] text-black/72">
              This is the live widget rendering for the selected record. It is
              the same trust surface that can be embedded on an external website.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <Script src={widgetScriptSrc} strategy="afterInteractive" />

              <Script id="gafaig-widget-reinit" strategy="afterInteractive">
                {`
                  (function () {
                    function reinit() {
                      try {
                        if (window.GAFAIGWidget && typeof window.GAFAIGWidget.mount === "function") {
                          window.GAFAIGWidget.mount();
                        }
                      } catch (e) {}
                    }

                    // Back/forward navigation
                    window.addEventListener("pageshow", reinit);

                    // Next.js/browser initial load
                    document.addEventListener("DOMContentLoaded", reinit);

                    // Tab visibility return
                    document.addEventListener("visibilitychange", function () {
                      if (document.visibilityState === "visible") {
                        reinit();
                      }
                    });

                    // Initial fallback (important for hydration timing)
                    setTimeout(reinit, 250);
                  })();
                `}
              </Script>

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

          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              QUICK INSTALL
            </div>

            <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
              Copy and use on a third-party site
            </h2>

            <p className="mt-4 text-[14px] leading-7 text-black/70">
              The widget displays verified results from the GAFAIG verification endpoint.
              Independent verification must use the exact signed messageString returned by the API.
            </p>

            <div className="mt-6 space-y-6">
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
                    Verification modal snippet
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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            MODAL EXPERIENCE
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Open verification without leaving the page
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            The verification helper allows a third-party site to open a live
            GAFAIG verification modal. This lets users inspect the trust result
            without navigating away from the host site.
          </p>

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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THIS ADDS TO THE DEMO
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            The proof does not stop at the verify page
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <BulletCard text="The registry page proves a public certification record exists." />
            <BulletCard text="The verify page proves the record is backed by signed public proof." />
            <BulletCard text="The widget preview proves the trust signal can travel outside GAFAIG." />
            <BulletCard text="The modal proves verification can be surfaced in third-party environments." />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              Why this matters
            </div>
            <p className="mt-3 text-[15px] leading-[1.85] text-black/75">
              GAFAIG turns verified AI governance into a portable public trust
              signal. It is a public trust infrastructure layer that allows
              verified governance outcomes to appear, be reviewed, and be trusted
              outside the originating organization’s platform.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            RELATED LINKS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Open each connected trust surface
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            <MetricCard label="Registry Record" value={registryUrl} />
            <MetricCard label="Verify Page" value={verifyPageUrl} />
            <MetricCard label="Verify JSON" value={verifyJsonUrl} />
            <MetricCard label="Demo Page" value={demoUrl} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="primary">
              Return to Demo
            </PublicButtonLink>
            <PublicButtonLink href="/registry" variant="secondary">
              Browse Registry
            </PublicButtonLink>
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
                    const targetRegistryId = verifyButton.getAttribute('data-gafaig-open-verify');
                    if (targetRegistryId && window.verifyGAFAIG) {
                      window.verifyGAFAIG(targetRegistryId, {
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