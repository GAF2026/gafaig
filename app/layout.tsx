import type { Metadata } from "next";
import Link from "next/link";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fcfcfb] text-black antialiased`}>
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 border-b border-black/10 bg-[#fcfcfb]/92 backdrop-blur">
            <div className="mx-auto max-w-[1180px] px-6 py-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                <Link href="/" className="flex shrink-0 items-center gap-3">
                  <img
                    src="/images/gafaig-lockup.png"
                    alt="GAFAIG"
                    className="h-9 w-auto shrink-0"
                  />
                </Link>

                <div className="hidden lg:block h-8 w-px bg-black/10" />

                <nav className="w-full lg:ml-auto lg:w-auto">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:items-center lg:gap-2">
                      <Link
                        href="/mission"
                        className="rounded-full border border-transparent px-3 py-2 text-center text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
                      >
                        Mission
                      </Link>
                      <Link
                        href="/framework"
                        className="rounded-full border border-transparent px-3 py-2 text-center text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
                      >
                        Framework
                      </Link>
                      <Link
                        href="/registry"
                        className="rounded-full border border-transparent px-3 py-2 text-center text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
                      >
                        Registry
                      </Link>
                      <Link
                        href="/explorer"
                        className="rounded-full border border-transparent px-3 py-2 text-center text-sm font-semibold text-black/80 transition hover:border-black/15 hover:bg-black/[0.035] hover:text-black"
                      >
                        Explorer
                      </Link>
                    </div>

                    <div className="hidden lg:block h-7 w-px bg-black/10" />

                    <div className="mt-1 flex flex-col gap-2 lg:mt-0 lg:flex-row lg:items-center">
                      <Link
                        href="/demo"
                        className="inline-flex w-full items-center justify-center rounded-full border border-black/15 px-4 py-2 text-center text-sm font-semibold text-black transition hover:border-black/25 hover:bg-black/[0.035] lg:w-auto"
                        title="Open the GAFAIG demo overview"
                      >
                        Demo
                      </Link>

                      <Link
                        href="/demo-script"
                        className="inline-flex w-full items-center justify-center rounded-full border border-black/15 px-4 py-2 text-center text-sm font-semibold text-black/70 transition hover:border-black/20 hover:bg-black/[0.02] hover:text-black lg:w-auto"
                        title="Open the GAFAIG demo talk track"
                      >
                        Demo Script
                      </Link>

                      <Link
                        href="/admin/login"
                        className="inline-flex w-full items-center justify-center rounded-full border border-black bg-black px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-black/90 lg:w-auto"
                        title="Open the GAFAIG admin login"
                      >
                        Admin
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </header>

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