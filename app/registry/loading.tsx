export default function Loading() {
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-black/10" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-black/10 bg-black/[0.03]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}