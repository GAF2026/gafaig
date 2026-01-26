import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <nav style={{ padding: "1.25rem 4rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <a href="/" style={{ fontWeight: 700, marginRight: "1rem" }}>
              GAFAIG
            </a>
            <a href="/mission">Mission</a>
            <a href="/framework">Framework</a>
            <a href="/governance">Governance</a>
            <a href="/participate">Participate</a>
            <a href="/contact">Contact</a>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}
