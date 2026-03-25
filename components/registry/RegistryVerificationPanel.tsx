type VerifyApiResponse = {
  ok: boolean;
  verified?: boolean;
  registryId?: string;
  entity?: string | null;
  entityType?: string | null;
  country?: string | null;
  applicationId?: string | null;
  caseId?: string | null;
  status?: string | null;
  tier?: string | null;
  band?: string | null;
  score?: number | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  lastActivityAt?: string | null;
  proof?: {
    alg?: string | null;
    signature?: string | null;
    signedAt?: string | null;
    message?: string | null;
  } | null;
  error?: string;
};

type Props = {
  absoluteVerifyUrl: string;
  absoluteRegistryUrl: string;
  registryId: string;
  entityName: string;
  verifyData: VerifyApiResponse;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function chipClass(label?: string | null) {
  const v = String(label || "").toLowerCase();

  if (v.includes("certified")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (v.includes("published") || v.includes("approved")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (v.includes("registry")) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }
  if (v.includes("b")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-800">
      <code>{children}</code>
    </pre>
  );
}

export default function RegistryVerificationPanel({
  absoluteVerifyUrl,
  absoluteRegistryUrl,
  registryId,
  entityName,
  verifyData,
}: Props) {
  const isVerified = verifyData.ok ? !!verifyData.verified : false;
  const certificationStatus =
    verifyData.ok && verifyData.status ? verifyData.status : null;
  const tier = verifyData.ok && verifyData.tier ? verifyData.tier : null;
  const band = verifyData.ok && verifyData.band ? verifyData.band : null;
  const score =
    verifyData.ok && typeof verifyData.score === "number"
      ? verifyData.score
      : null;
  const signature =
    verifyData.ok && verifyData.proof?.signature
      ? verifyData.proof.signature
      : null;
  const signedAt =
    verifyData.ok && verifyData.proof?.signedAt
      ? verifyData.proof.signedAt
      : null;

  const badgeUrl = `/api/badge/${registryId}`;

  const verifyJsonExample = `fetch("${absoluteVerifyUrl}")
  .then((r) => r.json())
  .then(console.log);`;

  const htmlEmbedSnippet = `<a href="${absoluteRegistryUrl}" target="_blank" rel="noopener noreferrer">
  <img
    src="${badgeUrl}"
    alt="${escapeHtml(entityName)} GAFAIG certification badge"
    style="height:64px;width:auto"
  />
</a>`;

  const markdownEmbedSnippet = `[![${entityName} GAFAIG certification badge](${badgeUrl})](${absoluteRegistryUrl})`;

  const plainSignalSummary = verifyData.ok
    ? [
        `Registry-backed: ${isVerified ? "Yes" : "No"}`,
        `Certification status: ${certificationStatus ?? "Unavailable"}`,
        tier ? `Tier: ${tier}` : null,
        band ? `Band: ${band}` : null,
        score !== null ? `Score: ${score}` : null,
      ]
        .filter(Boolean)
        .join(" • ")
    : "Verification unavailable";

  return (
    <section className="mt-12 border-t border-black/10 pt-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-black">
            Certification signal
          </h2>
          <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
            Certification outcomes are published through the GAFAIG Registry.
            Evidence, findings, and internal assessment materials remain
            private. This block provides a portable, registry-backed public
            certification signal for external websites, procurement workflows,
            and verification systems.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${chipClass(
              isVerified ? "certified" : "not certified"
            )}`}
          >
            {isVerified ? "certified" : "not certified"}
          </span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${chipClass(
              "published"
            )}`}
          >
            published
          </span>
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${chipClass(
              "registry-backed"
            )}`}
          >
            registry-backed
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Live badge preview
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <a
              href={absoluteRegistryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src={badgeUrl}
                alt={`${entityName} GAFAIG certification badge`}
                className="h-auto max-w-full"
              />
            </a>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={badgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-[14px] font-semibold hover:bg-black hover:text-white"
            >
              Open badge image
            </a>

            <a
              href={absoluteRegistryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-[14px] font-semibold hover:bg-black hover:text-white"
            >
              Open registry record
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Trust signal summary
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${chipClass(
                isVerified ? "certified" : "inactive"
              )}`}
            >
              {isVerified ? "verified live" : "inactive"}
            </span>
            {tier ? (
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${chipClass(
                  tier
                )}`}
              >
                {tier}
              </span>
            ) : null}
            {band ? (
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${chipClass(
                  band
                )}`}
              >
                band {band}
              </span>
            ) : null}
            {verifyData.ok && verifyData.proof?.alg ? (
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${chipClass(
                  verifyData.proof.alg
                )}`}
              >
                {verifyData.proof.alg}
              </span>
            ) : null}
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[14px] leading-[1.8] text-black/75">
            {plainSignalSummary}
          </div>

          {signedAt ? (
            <div className="mt-4 text-[13px] text-black/60">
              Signed at:{" "}
              <span className="font-mono text-black/80">{signedAt}</span>
            </div>
          ) : verifyData.ok ? null : (
            <div className="mt-4 text-[13px] text-red-700">
              {verifyData.error}
            </div>
          )}

          {signature ? (
            <div className="mt-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                Signature
              </div>
              <div className="mt-2">
                <CodeBlock>{signature}</CodeBlock>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Verification URL
          </div>
          <div className="mt-3">
            <CodeBlock>{absoluteVerifyUrl}</CodeBlock>
          </div>

          <div className="mt-4 text-[13px] leading-[1.7] text-black/65">
            External systems can use this endpoint to confirm live certification
            status and retrieve signed proof metadata.
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Badge image URL
          </div>
          <div className="mt-3">
            <CodeBlock>{badgeUrl}</CodeBlock>
          </div>

          <div className="mt-4 text-[13px] leading-[1.7] text-black/65">
            Use this image URL for public website embeds, partner pages, and
            procurement documentation.
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 p-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
          HTML embed snippet
        </div>
        <div className="mt-3">
          <CodeBlock>{htmlEmbedSnippet}</CodeBlock>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 p-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
          Markdown embed snippet
        </div>
        <div className="mt-3">
          <CodeBlock>{markdownEmbedSnippet}</CodeBlock>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 p-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
          Example verification request
        </div>
        <div className="mt-3">
          <CodeBlock>{verifyJsonExample}</CodeBlock>
        </div>
      </div>
    </section>
  );
}