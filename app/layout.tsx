import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteFooter from "./_components/SiteFooter";
import SiteHeader from "./_components/SiteHeader";

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
          <SiteHeader />

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