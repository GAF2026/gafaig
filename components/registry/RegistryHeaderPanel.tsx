import Link from "next/link";
import StatusChip from "@/components/ui/StatusChip";
import { REGISTRY_VERIFICATION_STATES } from "@/lib/constants/registry";
type Props = {
  registryId: string;
  entityName?: string | null;
  decisionStatus?: string | null;
  showVerificationState: boolean;
  isVerified: boolean;
  absoluteVerifyUrl: string;
  absoluteRecordUrl: string;
};

export default function RegistryHeaderPanel({
  registryId,
  entityName,
  decisionStatus,
  showVerificationState,
  isVerified,
  absoluteVerifyUrl,
  absoluteRecordUrl,
}: Props) {
  return (
    <section className="pt-2 pb-8">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        Registry record
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
            {entityName ?? "Registry record"}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusChip>{registryId}</StatusChip>

            {decisionStatus ? <StatusChip>{decisionStatus}</StatusChip> : null}

            {showVerificationState ? (
              <StatusChip>
                {
  isVerified
    ? REGISTRY_VERIFICATION_STATES.VERIFICATION_ACTIVE
    : REGISTRY_VERIFICATION_STATES.NOT_CURRENTLY_VALID
}
              </StatusChip>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/registry"
            className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
          >
            Back to registry
          </Link>

          <a
            href={absoluteVerifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-[14px] font-semibold hover:bg-black hover:text-white"
          >
            Verify via API
          </a>

          <a
            href={absoluteRecordUrl}
            className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-[14px] font-semibold text-white hover:bg-black/90"
          >
            Permalink
          </a>
        </div>
      </div>

      <p className="mt-5 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
        This registry record is a controlled disclosure: it confirms certification
        outcomes without exposing internal evidence, findings, reviewer rationales,
        or private assessment materials.
      </p>
    </section>
  );
}