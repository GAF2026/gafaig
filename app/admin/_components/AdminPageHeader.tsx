import type { ReactNode } from "react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: string;
  actions?: ReactNode;
};

export default function AdminPageHeader({
  eyebrow = "Admin",
  title,
  description,
  meta,
  actions,
}: AdminPageHeaderProps) {
  return (
    <section className="pt-2 pb-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
            {eyebrow}
          </div>

          <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
            {title}
          </h1>

          {description ? (
            <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
              {description}
            </p>
          ) : null}

          {meta ? (
            <div className="mt-4 text-[16px] leading-[1.7] text-black/65">
              {meta}
            </div>
          ) : null}
        </div>

        {actions ? <div className="pt-2">{actions}</div> : null}
      </div>
    </section>
  );
}