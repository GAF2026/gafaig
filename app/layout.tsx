import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteFooter from "./_components/SiteFooter";

export const metadata: Metadata = {
  title: "GAFAIG — Global Authority for AI Governance",
  description: "Structured and auditable oversight of AI systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/10">
            <div className="mx-auto max-w-[1100px] px-6 py-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 shrink-0">
                  <img
                    src="/images/gafaig-lockup.png"
                    alt="GAFAIG"
                    className="h-8 w-auto shrink-0"
                  />
                </Link>

                {/* Nav */}
                <nav className="md:ml-auto w-full md:w-auto">
                  {/* Primary links */}
                  <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-2 md:flex-wrap md:justify-end">
                    <Link
                      href="/mission"
                      className="px-3 py-2 rounded-full text-sm font-semibold border border-transparent hover:border-black/15 hover:bg-black/[0.04] text-center"
                    >
                      Mission
                    </Link>
                    <Link
                      href="/framework"
                      className="px-3 py-2 rounded-full text-sm font-semibold border border-transparent hover:border-black/15 hover:bg-black/[0.04] text-center"
                    >
                      Framework
                    </Link>
                    <Link
                      href="/registry"
                      className="px-3 py-2 rounded-full text-sm font-semibold border border-transparent hover:border-black/15 hover:bg-black/[0.04] text-center"
                    >
                      Registry
                    </Link>
                  </div>

                  {/* Action buttons (mobile: full width, centered; desktop: inline) */}
                  <div className="mt-2 flex flex-col gap-2 md:mt-0 md:ml-2 md:flex-row md:items-center">
                    <Link
                      href="/demo"
                      className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04] w-full md:w-auto text-center flex items-center justify-center"
                      title="Open the GAFAIG demo overview"
                    >
                      Demo
                    </Link>

                    <Link
                      href="/demo-script"
                      className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04] w-full md:w-auto text-center flex items-center justify-center"
                      title="Open the Snowflake demo talk track"
                    >
                      Demo Script
                    </Link>

                    <Link
                      href="/admin/login"
                      className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90 w-full md:w-auto text-center flex items-center justify-center"
                      title="Open the GAFAIG admin login"
                    >
                      Admin
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </header>

          <div className="flex-1">{children}</div>

          <div className="mt-auto">
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}