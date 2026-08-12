function formatUpdatedAt(
  value:
    string | null,
): string {
  if (!value) {
    return "Not refreshed";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    },
  ).format(date);
}

export default function ApplicantGuidanceRefreshStatus({
  refreshing,
  lastUpdatedAt,
}: {
  refreshing:
    boolean;

  lastUpdatedAt:
    string | null;
}) {
  return (
    <div
      className="min-w-0 break-words text-[12px] leading-6 text-black/55"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {refreshing
        ? "Refreshing operational guidance..."
        : `Guidance last refreshed: ${formatUpdatedAt(
            lastUpdatedAt,
          )}`}
    </div>
  );
}