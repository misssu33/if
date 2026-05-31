type ProgressBarProps = {
  value: number;
  max?: number;
};

/** 공유 진행률 바 (Tailwind) */
export function ProgressBar({ value, max = 100 }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div
        className="h-full rounded-full bg-violet-600 transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
