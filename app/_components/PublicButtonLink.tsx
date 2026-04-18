import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light" | "outline-light" | "outline-dark" | "ghost";
  size?: "sm" | "md";
  className?: string;
};

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const sizes = {
  sm: "min-h-[36px] px-4 text-sm",
  md: "min-h-[42px] px-5 text-sm",
};

const variants = {
  // 🔴 Use on LIGHT backgrounds
  dark: "bg-black text-white hover:bg-black/90",

  // ⚪ Use on DARK backgrounds
  light: "bg-white text-black hover:bg-white/90",

  // Outline on DARK sections
  "outline-light":
    "border border-white text-white hover:bg-white/10",

  // Outline on LIGHT sections
  "outline-dark":
    "border border-black/20 text-black hover:bg-black hover:text-white",

  // Minimal
  ghost: "text-black hover:bg-black/[0.04]",
};

export default function PublicButtonLink({
  href,
  children,
  variant = "outline-dark",
  size = "md",
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition whitespace-nowrap",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {children}
    </Link>
  );
}