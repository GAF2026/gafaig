import MonoCodeBlock from "@/components/ui/MonoCodeBlock";

type Props = {
  absoluteRecordUrl: string;
  absoluteVerifyUrl: string;
  badgeSrcAbsolute: string;
  badgeSrcRelative: string;
};

function getRegistryIdFromRecordUrl(url: string) {
  const match = url.match(/\/registry\/([^/?#]+)/i);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

export default function RegistryBadgePanel({
  absoluteRecordUrl,
  absoluteVerifyUrl,
}: Props) {
  const registryId = getRegistryIdFromRecordUrl(absoluteRecordUrl);
  const dynamicBadgeUrl = registryId
    ? `${new URL(absoluteRecordUrl).origin}/badge/${encodeURIComponent(
        registryId
      )}.svg`
    : "";

  const embedHtml = `<a href="${absoluteRecordUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${dynamicBadgeUrl}" alt="Verified by GAFAIG" height="72" />
</a>`;

  const embedMarkdown = `[![Verified by GAFAIG](${dynamicBadgeUrl})](${absoluteRecordUrl})`;

  return (
    <section className="mt-10 border-t border-black/10 pt-8">
      <h2 className="text-[16px] font-semibold text-black">
        Verified by GAFAIG
      </h2>
      <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
        Organizations that successfully complete independent verification may
        display the GAFAIG Verified badge on their website. The dynamic badge
        links directly to the public registry record and reflects current
        certification status through the public verification layer.
      </p>

      <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
        <a
          href={absoluteRecordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <img
            src={dynamicBadgeUrl}
            alt="Verified by GAFAIG"
            className="h-[96px] w-auto md:h-[110px]"
          />
        </a>

        <div className="mt-4 text-[13px] text-black/60">
          Click the badge or use this link:
          <span className="ml-2 font-mono text-black">{absoluteRecordUrl}</span>
        </div>

        <div className="mt-3 text-[13px] text-black/60">
          Dynamic badge:
          <span className="ml-2 font-mono text-black">{dynamicBadgeUrl}</span>
        </div>

        <div className="mt-3 text-[13px] text-black/60">
          API verification:
          <span className="ml-2 font-mono text-black">{absoluteVerifyUrl}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Embed code (HTML)
          </div>
          <div className="mt-3">
            <MonoCodeBlock>{embedHtml}</MonoCodeBlock>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Embed code (Markdown)
          </div>
          <div className="mt-3">
            <MonoCodeBlock>{embedMarkdown}</MonoCodeBlock>
          </div>
        </div>
      </div>

      <p className="mt-4 max-w-[980px] text-[12px] leading-[1.7] text-black/60">
        Note: This badge confirms certification status and certification
        outcomes only. GAFAIG does not disclose internal evidence, findings,
        reviewer rationales, or private assessment materials through the public
        registry.
      </p>
    </section>
  );
}