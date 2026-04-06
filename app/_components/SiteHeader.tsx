"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  filled?: boolean;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/mission", label: "Mission" },
  { href: "/framework", label: "Framework" },
  { href: "/registry", label: "Registry" },
  { href: "/explorer", label: "Explorer" },
  { href: "/verify", label: "Verify" },
  { href: "/developers", label: "Developers" },
];

const ACTION_NAV: NavItem[] = [
  { href: "/demo", label: "Demo" },
  { href: "/apply", label: "Apply", filled: true },
  { href: "/admin/login", label: "Admin", filled: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopNavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "rounded-full px-3 py-2 text-sm font-semibold transition",
        active
          ? "border border-black bg-black text-white"
          : "border border-transparent text-black/80 hover:border-black/15 hover:bg-black/[0.035] hover:text-black",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function PillLink({
  href,
  children,
  filled = false,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  filled?: boolean;
  active?: boolean;
}) {
  if (filled) {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={[
          "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
          active
            ? "border-black bg-black text-white"
            : "border border-black/15 text-black hover:border-black hover:bg-black hover:text-white",
        ].join(" ")}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold whitespace-nowrap transition",
        active
          ? "border-black bg-black text-white"
          : "border border-black/15 text-black hover:border-black/25 hover:bg-black/[0.035]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function DesktopHeader({ pathname }: { pathname: string }) {
  return (
    <header className="sticky top-0 z-50 hidden border-b border-black/10 bg-[#fcfcfb]/92 backdrop-blur lg:block">
      <div className="mx-auto max-w-[1180px] px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="GAFAIG home">
            <Image
              src="/images/gafaig-lockup.png"
              alt="GAFAIG"
              width={156}
              height={36}
              priority
              className="h-9 w-auto shrink-0"
            />
          </Link>

          <div className="h-8 w-px bg-black/10" />

          <nav className="ml-auto flex items-center gap-2" aria-label="Primary">
            {PRIMARY_NAV.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isActive(pathname, item.href)}
              />
            ))}

            <div className="mx-1 h-7 w-px bg-black/10" />

            {ACTION_NAV.map((item) => (
              <PillLink
                key={item.href}
                href={item.href}
                filled={item.filled}
                active={isActive(pathname, item.href)}
              >
                {item.label}
              </PillLink>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileHeader({ pathname }: { pathname: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fcfcfb]/96 backdrop-blur lg:hidden">
      <div className="px-4 py-3">
        <Link href="/" className="flex items-center" aria-label="GAFAIG home">
          <Image
            src="/images/gafaig-lockup.png"
            alt="GAFAIG"
            width={139}
            height={32}
            priority
            className="h-8 w-auto shrink-0"
          />
        </Link>

        <nav
          className="mt-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex min-w-max items-center gap-2">
            {PRIMARY_NAV.map((item) => (
              <PillLink
                key={item.href}
                href={item.href}
                active={isActive(pathname, item.href)}
              >
                {item.label}
              </PillLink>
            ))}

            {ACTION_NAV.map((item) => (
              <PillLink
                key={item.href}
                href={item.href}
                filled={item.filled}
                active={isActive(pathname, item.href)}
              >
                {item.label}
              </PillLink>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <>
      <DesktopHeader pathname={pathname} />
      <MobileHeader pathname={pathname} />
    </>
  );
}