"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Tab = {
  label: string;
  href: string;
};

export default function CaseTabs({ caseId }: { caseId: string }) {
  const pathname = usePathname() || "";
  const base = `/admin/verification/${encodeURIComponent(caseId)}`;

  const tabs: Tab[] = [
    { label: "Overview", href: base },
    { label: "Status", href: `${base}/status` },
    { label: "Evidence", href: `${base}/evidence` },
    { label: "Findings", href: `${base}/findings` },
    { label: "Decisions", href: `${base}/decisions` },
    { label: "Events", href: `${base}/events` },
    { label: "Assignments", href: `${base}/assignments` },
    { label: "Score", href: `${base}/score` },
  ];

  return (
    <div className="border-b border-black/10">
      <div className="mx-auto max-w-[1100px] px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active =
              pathname === tab.href ||
              (tab.href !== base && pathname.startsWith(tab.href));

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cx(
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold transition",
                  active
                    ? "border border-black bg-black text-white"
                    : "border border-black/10 bg-white text-black hover:bg-black/[0.04]"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}