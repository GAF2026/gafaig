import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  description: string;
};

type Props = {
  title?: string;
  intro?: string;
  items: NavItem[];
};

export default function RegistryNavigationGraph({
  title = "Registry navigation",
  intro = "Navigate across related GAFAIG public records, verification endpoints, and AI system disclosures.",
  items,
}: Props) {
  if (!items.length) return null;

  return (
    <section className="mt-10 border-t border-black/10 pt-8">
      <h2 className="text-[16px] font-semibold text-black">{title}</h2>
      <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
        {intro}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={`${item.label}-${item.href}`}
            href={item.href}
            className="rounded-2xl border border-black/10 bg-white/70 p-5 transition hover:bg-black/[0.02]"
          >
            <div className="text-[15px] font-semibold text-black">{item.label}</div>
            <div className="mt-2 text-[14px] leading-[1.7] text-black/72">
              {item.description}
            </div>
            <div className="mt-4 font-mono text-[12px] text-black/60">
              {item.href}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}