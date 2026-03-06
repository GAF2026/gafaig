"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/admin/applications") {
    return pathname === "/admin/applications" || pathname.startsWith("/admin/applications/");
  }
  if (href === "/admin/participants") {
    return pathname === "/admin/participants" || pathname.startsWith("/admin/participants/");
  }
  return pathname === href;
}

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/applications", label: "Submissions" },
    { href: "/admin/participants", label: "Participants" },
  ];

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/"
            className="text-[16px] font-semibold text-black tracking-[0.02em]"
          >
            GAFAIG
          </Link>

          <div className="hidden h-5 w-px bg-black/10 sm:block" />

          <div className="text-[13px] uppercase tracking-[0.18em] text-black/50 font-semibold">
            Admin
          </div>
        </div>

        <nav className="flex items-center gap-2 flex-wrap">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-[14px] font-semibold transition",
                  active
                    ? "bg-black text-white border border-black"
                    : "bg-white text-black border border-black/10 hover:bg-black/[0.04]",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}