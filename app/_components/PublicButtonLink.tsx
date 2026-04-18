import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type PublicButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "ghost"
    | "link"
    | "dark"
    | "light"
    | "outline-light"
    | "outline-dark";
  size?: "sm" | "md";
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const sizeClasses: Record<NonNullable<PublicButtonLinkProps["size"]>, string> = {
  sm: "min-h-[36px] px-4 text-sm",
  md: "min-h-[42px] px-5 text-sm",
};

const variantClasses: Record<
  NonNullable<PublicButtonLinkProps["variant"]>,
  string
> = {
  primary: "bg-black text-white border border-black hover:bg-black/90",
  secondary:
    "bg-white text-black border border-black/20 hover:bg-black hover:text-white",
  ghost: "bg-transparent text-black hover:bg-black/[0.04]",
  link: "bg-transparent text-black underline underline-offset-4 hover:text-black/70",
  dark: "bg-black text-white border border-black hover:bg-black/90",
  light: "bg-white text-black border border-white hover:bg-white/90",
  "outline-light": "border border-white text-white hover:bg-white/10",
  "outline-dark":
    "border border-black/20 text-black hover:bg-black hover:text-white",
};

export default function PublicButtonLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  className,
  ...rest
}: PublicButtonLinkProps) {
  const isLinkVariant = variant === "link";

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition whitespace-nowrap",
        !isLinkVariant && sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}