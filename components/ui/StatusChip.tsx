type StatusChipProps = {
  children: React.ReactNode;
};

export default function StatusChip({ children }: StatusChipProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/15 bg-black/[0.04] px-2.5 py-1 text-[12px] font-semibold leading-none text-black">
      {children}
    </span>
  );
}