import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import SiteFooter from "./_components/SiteFooter";

export const metadata: Metadata = {
  title: "GAFAIG — Global Authority for AI Governance",
  description: "Structured and auditable oversight of AI systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <div className="min-h-screen flex flex-col">
          {/* Global header */}
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/10">
            <div className="mx-auto max-w-[1100px] px-6 py-3">
              <div className="flex flex-wrap items-center gap-4">
                
                {/* Logo — prevent shrinking */}
                <Link
                  href="/"
                  className="flex items-center gap-3 flex-shrink-0"
                >
                  <img
                    src="/images/gafaig-lockup.png"
                    alt="GAFAIG"
                    className="h-8 w-auto object-contain"
                  />
                </Link>

                {/* Navigation */}
                <nav className="flex flex-wrap items-center gap-2 ml-auto">
                  <Link
                    href="/mission"
                    className="px-3 py-1.5 rounded-full text-sm font-semibold border border-transparent hover:border-black/15 hover:bg-black/[0.04]"
                  >
                    Mission
                  </Link>

                  <Link
                    href="/framework"
                    className="px-3 py-1.5 rounded-full text-sm font-semibold border border-transparent hover:border-black/15 hover:bg-black/[0.04]"
                  >
                    Framework
                  </Link>

                  <Link
                    href="/registry"
                    className="px-3 py-1.5 rounded-full text-sm font-semibold border border-transparent hover:border-black/15 hover:bg-black/[0.04]"
                  >
                    Registry
                  </Link>

                  <Link
                    href="/demo"
                    className="px-3 py-1.5 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
                  >
                    Demo
                  </Link>

                  <Link
                    href="/admin/login"
                    className="px-3 py-1.5 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
                  >
                    Admin
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="flex-1">{children}</div>

          {/* Footer */}
          <div className="mt-auto">
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}