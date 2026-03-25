import { ReactNode } from "react";

type PublicPageSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export default function PublicPageSection({
  eyebrow,
  title,
  description,
  actions,
  children,
  className = "",
}: PublicPageSectionProps) {
  return (
    <section
      className={[
        "rounded-[32px] border border-black/10 bg-white px-8 py-8 md:px-12 md:py-10",
        className,
      ].join(" ")}
    >
      {(eyebrow || title || description || actions) && (
        <div className="mb-8">
          {eyebrow ? (
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/50">
              {eyebrow}
            </div>
          ) : null}

          {title ? (
            <h2 className="mt-4 max-w-4xl text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-black md:text-[56px]">
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className="mt-6 max-w-3xl text-[18px] leading-[1.75] text-black/70">
              {description}
            </p>
          ) : null}

          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      )}

      {children}
    </section>
  );
}