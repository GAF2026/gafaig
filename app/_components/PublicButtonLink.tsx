import Link from "next/link";
import type { ReactNode } from "react";

type PublicButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
};

function cx(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export default function PublicButtonLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  className,
}: PublicButtonLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-full border font-semibold whitespace-nowrap transition";

  const sizeClass =
    size === "sm"
      ? "h-[40px] px-4 text-sm"
      : "h-[44px] px-5 text-sm";

  const variantClass =
    variant === "primary"
      ? "border-black bg-black text-white hover:bg-black/90"
      : variant === "ghost"
      ? "border-transparent bg-transparent text-black hover:bg-black/[0.04]"
      : "border-black text-black hover:bg-black/[0.04]";

  return (
    <Link href={href} className={cx(base, sizeClass, variantClass, className)}>
      {children}
    </Link>
  );
}