"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "sm" | "md";

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function cx(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export default function PublicButton({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap transition focus:outline-none";

  const sizeClass =
    size === "sm"
      ? "h-[40px] px-4 text-sm"
      : "h-[44px] px-5 text-sm";

  const variantClass =
    variant === "primary"
      ? "border border-black bg-black text-white hover:bg-black/90"
      : variant === "ghost"
      ? "border border-transparent bg-transparent text-black hover:bg-black/[0.04]"
      : variant === "link"
      ? "border border-transparent bg-transparent text-black underline underline-offset-4 hover:text-black/70"
      : "border border-black text-black hover:bg-black/[0.04]";

  return (
    <button
      {...props}
      className={cx(base, sizeClass, variantClass, className)}
    >
      {children}
    </button>
  );
}