"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Tab = { label: string; href: string };

export default function CaseTabs({ caseId }: { caseId: string }) {
  const pathname = usePathname() || "";
  const base = `/admin/verification/${caseId}`;

  const tabs: Tab[] = [
    { label: "Overview", href: base },
    { label: "Status", href: `${base}/status` },
    { label: "Evidence", href: `${base}/evidence` },
    { label: "Findings", href: `${base}/findings` },
    { label: "Decisions", href: `${base}/decisions` },
    { label: "Events", href: `${base}/events` },
    { label: "Assignments", href: `${base}/assignments` },
    { label: "Score", href: `${base}/score` },
    { label: "AI Systems", href: `${base}/ai-systems` },
    { label: "Publish", href: `${base}/publish` },
  ];

  return (
    <div className="border-b border-black/10">
      <div className="flex flex-wrap gap-2 py-3">
        {tabs.map((t) => {
          const active =
            pathname === t.href || (t.href !== base && pathname.startsWith(t.href));

          return (
            <Link
              key={t.href}
              href={t.href}
              className={cx(
                "rounded-full px-4 py-2 text-[14px] font-semibold transition border",
                active
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black/15 hover:bg-black/[0.04]"
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}