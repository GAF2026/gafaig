import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export default function RegistryNavigationGraph({
  items,
}: {
  items: NavItem[];
}) {
  if (!items?.length) return null;

  return (
    <section className="mt-12 border-t border-black/10 pt-8">
      <h2 className="text-[16px] font-semibold text-black">
        Registry navigation
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
          >
            <div className="text-[15px] font-semibold text-black">
              {item.label}
            </div>

            {item.description ? (
              <div className="mt-2 text-[13px] leading-[1.6] text-black/70">
                {item.description}
              </div>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}