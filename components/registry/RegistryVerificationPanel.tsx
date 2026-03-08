import StatusChip from "@/components/ui/StatusChip";
import MonoCodeBlock from "@/components/ui/MonoCodeBlock";
import type { VerifyApiResponse } from "@/types/registry";

type Props = {
  absoluteVerifyUrl: string;
  verifyData: VerifyApiResponse;
};

export default function RegistryVerificationPanel({
  absoluteVerifyUrl,
  verifyData,
}: Props) {
  const verifyJsonExample = `fetch("${absoluteVerifyUrl}")
  .then((r) => r.json())
  .then(console.log);`;

  const isVerified = verifyData.ok ? !!verifyData.verified : false;
  const signature =
    verifyData.ok && verifyData.proof?.signature
      ? verifyData.proof.signature
      : null;
  const signedAt =
    verifyData.ok && verifyData.proof?.signedAt
      ? verifyData.proof.signedAt
      : null;

  return (
    <section className="mt-10 border-t border-black/10 pt-8">
      <h2 className="text-[16px] font-semibold text-black">
        Verification endpoint
      </h2>

      <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
        This certification can be validated programmatically through the public
        verification API. External websites, procurement workflows, and
        compliance tools can use this endpoint to confirm current certification
        status and retrieve signed proof metadata.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Verification URL
          </div>
          <div className="mt-3">
            <MonoCodeBlock>{absoluteVerifyUrl}</MonoCodeBlock>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={absoluteVerifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-[14px] font-semibold hover:bg-black hover:text-white"
            >
              Open verification JSON
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 p-5">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Verification status
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <StatusChip>
              {verifyData.ok
                ? isVerified
                  ? "verified"
                  : "not currently valid"
                : "verification unavailable"}
            </StatusChip>

            {verifyData.ok && verifyData.proof?.alg ? (
              <StatusChip>{verifyData.proof.alg}</StatusChip>
            ) : null}
          </div>

          {verifyData.ok && signature ? (
            <div className="mt-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                Signature
              </div>
              <div className="mt-2">
                <MonoCodeBlock>{signature}</MonoCodeBlock>
              </div>
            </div>
          ) : null}

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
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 p-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
          Example usage
        </div>
        <div className="mt-3">
          <MonoCodeBlock>{verifyJsonExample}</MonoCodeBlock>
        </div>
      </div>
    </section>
  );
}