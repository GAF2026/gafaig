export default function ApplicantGuidanceLiveRegion({
  message,
  assertive = false,
}: {
  message: string;
  assertive?: boolean;
}) {
  return (
    <div
      className="sr-only"
      role={assertive ? "alert" : "status"}
      aria-live={
        assertive
          ? "assertive"
          : "polite"
      }
      aria-atomic="true"
    >
      {message}
    </div>
  );
}