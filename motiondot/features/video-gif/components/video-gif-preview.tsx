'use client';

import { useEffect, useRef } from 'react';
import { useVideoGifStore } from '../stores/use-video-gif-store';

/** 선택 구간 미리보기 */
export function VideoGifPreview() {
  const loaded = useVideoGifStore((s) => s.loaded);
  const trimStartSec = useVideoGifStore((s) => s.trimStartSec);
  const trimEndSec = useVideoGifStore((s) => s.trimEndSec);
  const previewTimeSec = useVideoGifStore((s) => s.previewTimeSec);
  const setPreviewTimeSec = useVideoGifStore((s) => s.setPreviewTimeSec);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !loaded) return;
    el.src = loaded.objectUrl;
  }, [loaded]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !loaded) return;
    const t = Math.min(Math.max(trimStartSec, previewTimeSec), trimEndSec);
    if (Math.abs(el.currentTime - t) > 0.05) {
      el.currentTime = t;
    }
  }, [loaded, previewTimeSec, trimStartSec, trimEndSec]);

  if (!loaded) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-900">
        비디오를 선택하면 미리보기가 표시됩니다
      </div>
    );
  }

  const segmentLen = Math.max(0.1, trimEndSec - trimStartSec);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-black dark:border-zinc-800">
        <video
          ref={videoRef}
          className="aspect-video w-full object-contain"
          muted
          playsInline
          preload="auto"
        />
      </div>
      <label className="text-xs text-zinc-500">
        구간 내 위치 ({previewTimeSec.toFixed(1)}s)
        <input
          type="range"
          min={trimStartSec}
          max={trimEndSec}
          step={0.05}
          value={previewTimeSec}
          className="mt-1 h-2 w-full accent-violet-600"
          onChange={(e) => setPreviewTimeSec(Number(e.target.value))}
        />
      </label>
      <p className="text-[10px] text-zinc-400">
        선택 구간 {segmentLen.toFixed(1)}초 · 원본 {loaded.videoWidth}×
        {loaded.videoHeight}
      </p>
    </div>
  );
}
