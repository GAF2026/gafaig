import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "GAFAIG Standards",
};

export default function StandardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}