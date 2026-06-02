/** 앱 상단 헤더 (랜딩) */
export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 px-4 py-4 dark:border-zinc-800 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
        <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          MotionDot
        </span>
        <span className="hidden text-xs text-zinc-500 sm:inline">
          TikTok 제휴 · 9:16 · GIF · MP4 · WebP
        </span>
      </div>
    </header>
  );
}
