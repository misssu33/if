'use client';

import {
  BROWSER_GIF_FPS_MAX,
  BROWSER_GIF_FPS_MIN,
  BROWSER_GIF_WIDTH_MAX,
  BROWSER_GIF_WIDTH_MIN,
  BROWSER_VIDEO_MAX_SEGMENT_SEC,
} from '../constants';
import { useVideoGifStore } from '../stores/use-video-gif-store';

/** 트림 · FPS · 출력 너비 */
export function VideoGifControls() {
  const loaded = useVideoGifStore((s) => s.loaded);
  const trimStartSec = useVideoGifStore((s) => s.trimStartSec);
  const trimEndSec = useVideoGifStore((s) => s.trimEndSec);
  const fps = useVideoGifStore((s) => s.fps);
  const outputWidth = useVideoGifStore((s) => s.outputWidth);
  const setTrim = useVideoGifStore((s) => s.setTrim);
  const setFps = useVideoGifStore((s) => s.setFps);
  const setOutputWidth = useVideoGifStore((s) => s.setOutputWidth);
  const setPreviewTimeSec = useVideoGifStore((s) => s.setPreviewTimeSec);

  if (!loaded) return null;

  const duration = loaded.durationSec;
  const maxEnd = Math.min(duration, trimStartSec + BROWSER_VIDEO_MAX_SEGMENT_SEC);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="text-xs sm:col-span-2">
        <span className="text-zinc-500">시작 (초)</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, duration - 0.1)}
          step={0.05}
          value={trimStartSec}
          className="mt-1 h-2 w-full accent-violet-600"
          onChange={(e) => {
            const start = Number(e.target.value);
            const end = Math.min(Math.max(start + 0.1, trimEndSec), maxEnd);
            setTrim(start, end);
            setPreviewTimeSec(start);
          }}
        />
        <span className="mt-0.5 block text-[10px] text-zinc-400">{trimStartSec.toFixed(2)}s</span>
      </label>

      <label className="text-xs sm:col-span-2">
        <span className="text-zinc-500">종료 (초)</span>
        <input
          type="range"
          min={trimStartSec + 0.1}
          max={maxEnd}
          step={0.05}
          value={trimEndSec}
          className="mt-1 h-2 w-full accent-violet-600"
          onChange={(e) => {
            const end = Number(e.target.value);
            setTrim(trimStartSec, end);
            setPreviewTimeSec(end);
          }}
        />
        <span className="mt-0.5 block text-[10px] text-zinc-400">
          {trimEndSec.toFixed(2)}s · 최대 {BROWSER_VIDEO_MAX_SEGMENT_SEC}초 구간
        </span>
      </label>

      <label className="text-xs">
        <span className="text-zinc-500">FPS</span>
        <input
          type="number"
          min={BROWSER_GIF_FPS_MIN}
          max={BROWSER_GIF_FPS_MAX}
          value={fps}
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          onChange={(e) => setFps(Number(e.target.value))}
        />
      </label>

      <label className="text-xs">
        <span className="text-zinc-500">출력 너비 (px)</span>
        <input
          type="number"
          min={BROWSER_GIF_WIDTH_MIN}
          max={BROWSER_GIF_WIDTH_MAX}
          step={10}
          value={outputWidth}
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          onChange={(e) => setOutputWidth(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
