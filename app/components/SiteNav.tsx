"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PublicButtonLink from "./PublicButtonLink";

type NavItem = {
  href: string;
  label: string;
};

const PUBLIC_NAV: NavItem[] = [
  { href: "/mission", label: "Mission" },
  { href: "/framework", label: "Framework" },
  { href: "/registry", label: "Registry" },
  { href: "/explorer", label: "Explorer" },
  { href: "/verify", label: "Verify" },
  { href: "/developers", label: "Developers" },
  { href: "/demo", label: "Demo" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-3 text-black transition hover:opacity-80"
          aria-label="GAFAIG home"
        >
          <div className="text-[20px] font-semibold tracking-tight">GAFAIG</div>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <nav
            className="flex flex-wrap items-center justify-end gap-2"
            aria-label="Primary"
          >
            {PUBLIC_NAV.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-black text-white"
                      : "border border-black/10 text-black hover:border-black/20 hover:bg-black/[0.03]",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <PublicButtonLink href="/apply" variant="primary" size="sm">
            Apply
          </PublicButtonLink>
        </div>
      </div>
    </header>
  );
}