import type {
  ApplicantGuidanceStatus,
} from "@/lib/guidance/useApplicantGuidance";

function normalizedStatus(
  status: ApplicantGuidanceStatus,
): string {
  const normalized =
    String(status ?? "")
      .trim()
      .toUpperCase();

  return normalized || "UNKNOWN";
}

function readableStatus(
  status: ApplicantGuidanceStatus,
): string {
  return normalizedStatus(status)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function statusClasses(
  status: ApplicantGuidanceStatus,
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

    case "UNRESOLVED":
    case "UNAVAILABLE":
    case "STALE":
      return "border-amber-200 bg-amber-50 text-amber-800";

    case "INCONSISTENT":
    case "UNAUTHORIZED":
    case "NOT_VISIBLE":
      return "border-orange-200 bg-orange-50 text-orange-800";

    case "INCOMPLETE":
    case "NOT_ELIGIBLE":
    default:
      return "border-black/10 bg-black/[0.03] text-black/65";
  }
}

export default function ApplicantGuidanceStatusBadge({
  status,
  label = "Guidance status",
}: {
  status: ApplicantGuidanceStatus;
  label?: string;
}) {
  const readable =
    readableStatus(status);

  return (
    <span
      className={[
        "inline-flex min-h-7 max-w-full items-center justify-center rounded-full border px-3 py-1",
        "text-center text-[10px] font-semibold uppercase leading-4 tracking-[0.11em] sm:text-[11px] sm:tracking-[0.12em]",
        statusClasses(status),
      ].join(" ")}
      aria-label={`${label}: ${readable}`}
      title={`${label}: ${readable}`}
    >
      <span
        className="break-words"
        aria-hidden="true"
      >
        {normalizedStatus(status)}
      </span>

      <span className="sr-only">
        {label}: {readable}
      </span>
    </span>
  );
}