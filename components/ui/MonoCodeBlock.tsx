type MonoCodeBlockProps = {
  children: React.ReactNode;
};

export default function MonoCodeBlock({ children }: MonoCodeBlockProps) {
  return (
    <pre className="w-full overflow-x-auto rounded-2xl border border-black/10 bg-white p-4 font-mono text-[12px] leading-[1.6] text-black/85">
      {children}
    </pre>
  );
}