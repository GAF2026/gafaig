// app/admin/verification/[caseId]/_components/CaseTabs.tsx
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
    { label: "Score", href: `${base}/score` }, // ✅ new
  ];

  return (
    <div className="border-b">
      <div className="flex flex-wrap gap-2 py-3">
        {tabs.map((t) => {
          const active =
            pathname === t.href || (t.href !== base && pathname.startsWith(t.href));
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cx(
                "rounded-md px-3 py-1.5 text-sm transition",
                active
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
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