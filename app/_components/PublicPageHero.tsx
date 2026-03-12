import type { ReactNode } from "react";

type PublicPageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  secondaryDescription?: string;
  actions?: ReactNode;
};

export default function PublicPageHero({
  eyebrow,
  title,
  description,
  secondaryDescription,
  actions,
}: PublicPageHeroProps) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        {eyebrow}
      </div>

      <h1 className="mt-4 max-w-[980px] text-[40px] font-semibold leading-[1.12] tracking-tight text-black md:text-[48px]">
        {title}
      </h1>

      {description ? (
        <p className="mt-5 max-w-[920px] text-[18px] leading-[1.8] text-black/80">
          {description}
        </p>
      ) : null}

      {secondaryDescription ? (
        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/72">
          {secondaryDescription}
        </p>
      ) : null}

      {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
    </section>
  );
}