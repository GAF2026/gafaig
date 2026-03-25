import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "./_components/SiteFooter";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GAFAIG — Global Authority for AI Governance",
  description:
    "Independent verification of human oversight for AI systems.",
};

function NavPill({
  href,
  children,
  filled = false,
}: {
  href: string;
  children: React.ReactNode;
  filled?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        filled
          ? "inline-flex items-center justify-center rounded-full border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90 whitespace-nowrap"
          : "inline-flex items-center justify-center rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black transition hover:border-black/25 hover:bg-black/[0.035] whitespace-nowrap"
      }
    >
      {children}
    </Link>
  );
}

function DesktopHeader() {
  return (
    <header className="hidden lg:block sticky top-0 z-50 border-b border-black/10 bg-[#fcfcfb]/92 backdrop-blur">
      <div className="mx-auto max-w-[1180px] px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
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

          <nav className="ml-auto flex items-center gap-2">
            <Link
              href="/mission"
              className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
            >
              Mission
            </Link>
            <Link
              href="/framework"
              className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
            >
              Framework
            </Link>
            <Link
              href="/registry"
              className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
            >
              Registry
            </Link>
            <Link
              href="/explorer"
              className="rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
            >
              Explorer
            </Link>

            <div className="mx-1 h-7 w-px bg-black/10" />

            <NavPill href="/demo">Demo</NavPill>
            <NavPill href="/admin/login" filled>
              Admin
            </NavPill>
          </nav>
        </div>
      </div>
    </header>
  );
}

function MobileHeader() {
  return (
    <header className="lg:hidden sticky top-0 z-50 border-b border-black/10 bg-[#fcfcfb]/96 backdrop-blur">
      <div className="px-4 py-3">
        <Link href="/" className="flex items-center">
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
            <NavPill href="/mission">Mission</NavPill>
            <NavPill href="/framework">Framework</NavPill>
            <NavPill href="/registry">Registry</NavPill>
            <NavPill href="/explorer">Explorer</NavPill>
            <NavPill href="/demo">Demo</NavPill>
            <NavPill href="/admin/login" filled>
              Admin
            </NavPill>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fcfcfb] text-black antialiased`}>
        <div className="min-h-screen flex flex-col">
          <DesktopHeader />
          <MobileHeader />

          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.05),transparent_58%)]"
          />

          <div className="flex-1">
            <div className="mx-auto max-w-[1320px] px-0">{children}</div>
          </div>

          <div className="mt-auto border-t border-black/8 bg-black/[0.015]">
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}