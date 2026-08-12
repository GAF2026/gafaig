import Link from "next/link";

function normalizedRepository(
  value:
    string | null | undefined,
): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
}

function readableRepository(
  value:
    string | null | undefined,
): string {
  const normalized =
    normalizedRepository(value);

  if (!normalized) {
    return "related applicant workflow";
  }

  return normalized
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

export function applicantGuidanceHref(
  repository:
    string | null | undefined,
): string | null {
  switch (
    normalizedRepository(repository)
  ) {
    case "EVIDENCE":
      return "/applicant/evidence";

    case "ARTIFACT":
    case "ARTIFACTS":
      return "/applicant/artifacts";

    case "INFORMATION_REQUEST":
    case "INFORMATION_REQUESTS":
    case "REQUEST":
    case "REQUESTS":
      return "/applicant/requests";

    case "DEFICIENCY":
    case "DEFICIENCIES":
      return "/applicant/deficiencies";

    case "REMEDIATION":
      return "/applicant/remediation";

    case "CERTIFICATION":
    case "CERTIFICATIONS":
      return "/applicant/certifications";

    case "PROGRESS":
      return "/applicant/progress";

    case "REVIEW":
    case "REVIEW_STATUS":
      return "/applicant/review-status";

    case "DECISION":
    case "DECISION_STATUS":
      return "/applicant/decision-status";

    default:
      return null;
  }
}

export default function ApplicantGuidanceActionLink({
  relatedRepository,
  label = "Open related workflow",
}: {
  relatedRepository:
    string | null | undefined;

  label?:
    string;
}) {
  const href =
    applicantGuidanceHref(
      relatedRepository,
    );

  if (!href) {
    return null;
  }

  const repositoryLabel =
    readableRepository(
      relatedRepository,
    );

  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={`${label}: ${repositoryLabel}`}
      className="inline-flex min-h-10 max-w-full items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-center text-[13px] font-semibold leading-5 text-black transition hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      <span className="break-words">
        {label}
      </span>

      <span className="sr-only">
        : {repositoryLabel}. This link opens an existing applicant workflow and
        does not execute the recommended action automatically.
      </span>
    </Link>
  );
}