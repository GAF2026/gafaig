import Link from "next/link";

type TabKey =
  | "overview"
  | "evidence"
  | "findings"
  | "assignments"
  | "events"
  | "decision"
  | "status";

export default function CaseTabs({
  caseId,
  active,
}: {
  caseId: string;
  active?: TabKey;
}) {
  const base = `/admin/verification/${encodeURIComponent(caseId)}`;

  const tabs: { key: TabKey; label: string; href: string }[] = [
    { key: "overview", label: "Overview", href: `${base}` },
    { key: "evidence", label: "Evidence", href: `${base}/evidence` },
    { key: "findings", label: "Findings", href: `${base}/findings` },
    { key: "assignments", label: "Assignments", href: `${base}/assignments` },
    { key: "events", label: "Events", href: `${base}/events` },
    { key: "decision", label: "Decision", href: `${base}/decisions` },
    { key: "status", label: "Status", href: `${base}/status` },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <Link
            key={t.key}
            href={t.href}
            className={[
              "px-4 py-2 rounded-full text-sm font-semibold border",
              isActive
                ? "border-black bg-black text-white"
                : "border-black/15 bg-white text-black hover:bg-black/[0.04] hover:border-black/25",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}