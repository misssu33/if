/** 앱 상단 헤더 */
export function AppHeader() {
  return (
    <header className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          MotionDot
        </span>
        <span className="text-xs text-zinc-500">
          GIF · MP4 · WebP 배치 변환
        </span>
      </div>
    </header>
  );
}
