"use client";

import {
  useEffect,
  useRef,
} from "react";

export default function ApplicantGuidanceError({
  message,
  onRetry,
  retrying = false,
  focusOnMount = true,
}: {
  message: string;
  onRetry: () => void;
  retrying?: boolean;
  focusOnMount?: boolean;
}) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  useEffect(() => {
    if (!focusOnMount) {
      return;
    }

    containerRef.current?.focus();
  }, [focusOnMount]);

  return (
    <div
      ref={containerRef}
      className="min-w-0 rounded-2xl border border-amber-200 bg-amber-50 p-5 outline-none focus-visible:ring-4 focus-visible:ring-amber-600 focus-visible:ring-offset-2 sm:p-6"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
    >
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-amber-800">
        Operational Guidance Unavailable
      </div>

      <p className="mt-4 text-[15px] leading-7 text-amber-950">
        The Guidance Engine could not determine operational guidance for this
        case.
      </p>

      <p className="mt-2 break-words text-[14px] leading-7 text-amber-900/80">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        aria-disabled={retrying}
        className="mt-5 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-amber-300 bg-white px-4 py-2 text-[13px] font-semibold text-amber-950 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {retrying
          ? "Retrying guidance..."
          : "Retry guidance"}
      </button>
    </div>
  );
}