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
        <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
          <section className="pt-2 pb-8">
            <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
              Admin
            </div>

            <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
              Admin login
            </h1>

            <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[880px]">
              Loading…
            </p>
          </section>
        </main>
      }
    >
      <LoginClient />
    </Suspense>
  );
}