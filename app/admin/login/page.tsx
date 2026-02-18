import type { Metadata } from "next";
import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Admin Login — GAFAIG",
  description: "Admin access for the GAFAIG demo.",
};

// Important: avoids static prerender pitfalls during build
export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 1.25rem 4.5rem" }}>
          <div style={{ fontSize: 14, opacity: 0.8 }}>Loading…</div>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}