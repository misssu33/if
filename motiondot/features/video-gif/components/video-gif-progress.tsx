'use client';

import { useVideoGifStore } from '../stores/use-video-gif-store';

/** 변환 진행률 */
export function VideoGifProgress() {
  const phase = useVideoGifStore((s) => s.phase);
  const progress = useVideoGifStore((s) => s.progress);
  const progressLabel = useVideoGifStore((s) => s.progressLabel);
  const error = useVideoGifStore((s) => s.error);

  if (phase === 'idle' || phase === 'ready' || phase === 'loading') {
    return null;
  }

  if (phase === 'error' && error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300" role="alert">
        {error}
      </p>
    );
  }

  if (phase === 'done') {
    return (
      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
        GIF가 생성되었습니다. 다운로드가 시작되지 않으면 아래 버튼을 사용하세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2" aria-live="polite">
      <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
        <span>{progressLabel || '변환 중…'}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full bg-violet-600 transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
