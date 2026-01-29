import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GAFAIG — Global Authority for AI Governance",
  description:
    "A global framework for human-centered AI governance, enabling transparent oversight, participation, and accountability at planetary scale.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SiteNav />

        <div className="container">
          <div className="prose">
            {children}
          </div>
        </div>

        <SiteFooter />
      </body>
    </html>
  );
}
