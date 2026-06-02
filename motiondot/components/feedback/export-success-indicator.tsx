'use client';

/** Export 완료 체크 — 짧은 pop 애니메이션 */
export function ExportSuccessIndicator() {
  return (
    <span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white animate-export-success-pop motion-reduce:animate-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4 stroke-[2.5] text-white animate-export-check-pop motion-reduce:animate-none"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" pathLength={1} className="export-check-stroke" />
      </svg>
    </span>
  );
}
