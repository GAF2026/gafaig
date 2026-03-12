import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DemoScriptPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-black/10 p-8 md:p-10">
          <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            Demo script
          </div>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            The demo script now lives inside the Demo page
          </h1>

          <p className="mt-5 text-base leading-7 text-neutral-700">
            GAFAIG’s walkthrough has been consolidated so evaluators can follow
            one guided path instead of choosing between multiple demo entry
            points.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
            >
              Open demo hub
            </Link>

            <Link
              href="/admin/login"
              className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              Go directly to reviewer access
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}