export default function ApplicantGuidanceLoading() {
  return (
    <div
      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        Operational Guidance
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-4 w-56 animate-pulse rounded bg-black/10" />
        <div className="h-4 w-full max-w-[720px] animate-pulse rounded bg-black/10" />
        <div className="h-4 w-3/4 max-w-[560px] animate-pulse rounded bg-black/10" />
      </div>

      <p className="mt-5 text-[15px] leading-7 text-black/70">
        Loading operational guidance...
      </p>
    </div>
  );
}