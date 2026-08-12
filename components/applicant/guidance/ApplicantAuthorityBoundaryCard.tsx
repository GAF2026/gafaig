import type {
  ApplicantGuidanceAuthorityBoundary,
} from "@/lib/guidance/useApplicantGuidance";

function BoundaryBadge({
  label,
}: {
  label:
    string;
}) {
  return (
    <span className="inline-flex min-h-8 max-w-full items-center justify-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.09em] text-black/65 sm:text-[11px] sm:tracking-[0.1em]">
      <span className="break-words">
        {label}
      </span>
    </span>
  );
}

export default function ApplicantAuthorityBoundaryCard({
  boundary,
}: {
  boundary:
    ApplicantGuidanceAuthorityBoundary | undefined;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        Authority Boundaries
      </div>

      <p className="mt-4 text-[14px] leading-7 text-black/70">
        Operational Guidance is advisory, read-only, and non-authoritative.
        Human governance authority remains supreme.
      </p>

      <div className="mt-5 flex min-w-0 flex-wrap gap-2">
        <BoundaryBadge label="Read Only" />
        <BoundaryBadge label="No Workflow Mutation" />
        <BoundaryBadge label="No Repository Mutation" />
        <BoundaryBadge label="No Governance Authority" />
        <BoundaryBadge label="No Certification Authority" />
        <BoundaryBadge label="No Publication Authority" />
        <BoundaryBadge label="No Registry Authority" />
        <BoundaryBadge label="No Verification Authority" />
      </div>

      {boundary?.readOnly === false ? (
        <p
          className="mt-5 break-words text-[13px] font-semibold leading-6 text-red-700"
          role="alert"
        >
          The returned authority boundary was not marked read-only.
        </p>
      ) : null}
    </div>
  );
}