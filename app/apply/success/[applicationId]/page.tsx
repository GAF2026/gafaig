import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    applicationId: string;
  };
  searchParams?: {
    requestId?: string;
  };
};

export default function ApplySuccessPage({ params, searchParams }: PageProps) {
  const applicationId = params.applicationId;
  const requestId = searchParams?.requestId ?? null;

  return (
    <main className="mx-auto w-full max-w-[1180px] px-6 py-10">
      <section className="rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
          Application received
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-neutral-950 md:text-5xl">
          Your GAFAIG verification intake has started.
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-600">
          Your submission has entered the private GAFAIG verification intake
          process. Certification is evaluated privately. Public registry listing
          occurs only if the organization chooses to publish the certified record.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoCard label="Application ID" value={applicationId} />
          <InfoCard label="Request ID" value={requestId ?? "Pending"} />
          <InfoCard label="Current status" value="INTAKE RECEIVED" />
          <InfoCard label="Public visibility" value="Not public" />
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            What happens next
          </p>

          <ol className="mt-4 space-y-3 text-sm leading-6 text-neutral-700">
            <li>1. GAFAIG reviews the submitted organization and AI system context.</li>
            <li>2. If accepted, the application moves into structured verification.</li>
            <li>3. Certification is only granted after evaluation and approval.</li>
            <li>4. If certified, the organization may choose whether to publish the record to the public registry.</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/apply"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Submit another application
          </Link>

          <Link
            href="/registry"
            className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            Browse public registry
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
        {label}
      </p>
      <p className="mt-3 break-words text-base font-semibold text-neutral-950">
        {value}
      </p>
    </div>
  );
}