import type {
  ReviewerGuidanceStatus,
} from "@/lib/guidance/useReviewerGuidance";

function normalizedStatus(
  status:
    ReviewerGuidanceStatus | null | undefined,
): string {
  return String(status ?? "")
    .trim()
    .toUpperCase();
}

function statusClasses(
  status:
    ReviewerGuidanceStatus | null | undefined,
): string {
  switch (normalizedStatus(status)) {
    case "AVAILABLE":
    case "READY":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";

    case "WAITING":
      return "border-blue-200 bg-blue-50 text-blue-800";

    case "BLOCKED":
    case "ERROR":
      return "border-red-200 bg-red-50 text-red-800";

    case "INCOMPLETE":
    case "UNRESOLVED":
    case "UNAVAILABLE":
    case "NOT_ELIGIBLE":
      return "border-amber-200 bg-amber-50 text-amber-900";

    case "UNAUTHORIZED":
    case "NOT_VISIBLE":
    case "INCONSISTENT":
    case "STALE":
      return "border-slate-300 bg-slate-50 text-slate-800";

    default:
      return "border-black/15 bg-white text-black/70";
  }
}

export default function ReviewerGuidanceStatusBadge({
  status,
  label,
}: {
  status:
    ReviewerGuidanceStatus | null | undefined;

  label:
    string;
}) {
  const displayStatus =
    normalizedStatus(status) ||
    "UNRESOLVED";

  return (
    <span
      className={[
        "inline-flex max-w-full items-center rounded-full border px-3 py-1",
        "text-[11px] font-semibold uppercase tracking-[0.12em]",
        statusClasses(status),
      ].join(" ")}
      aria-label={`${label}: ${displayStatus}`}
    >
      <span className="break-words">
        {displayStatus}
      </span>
    </span>
  );
}