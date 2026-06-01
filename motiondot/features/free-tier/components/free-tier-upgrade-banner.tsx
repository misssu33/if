'use client';

import type { FreeTierLimits } from '@/lib/freeTier';

type FreeTierUpgradeBannerProps = {
  isFree: boolean;
  exportsRemaining: number;
  limits: FreeTierLimits;
  watermarkOpacity: number;
  onWatermarkOpacityChange: (opacity: number) => void;
};

/** 무료 플랜 안내 · 업그레이드 메시지 */
export function FreeTierUpgradeBanner({
  isFree,
  exportsRemaining,
  limits,
  watermarkOpacity,
  onWatermarkOpacityChange,
}: FreeTierUpgradeBannerProps) {
  if (!isFree) return null;

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-900/60 dark:bg-amber-950/25">
      <div>
        <h3 className="text-sm font-semibold text-amber-950 dark:text-amber-100">
          무료 플랜
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/80">
          Pro 업그레이드 시 워터마크 제거, 더 높은 해상도·품질, 더 긴 GIF
          길이를 사용할 수 있습니다. (결제·로그인은 아직 연결되지 않았습니다.)
        </p>
      </div>

      <ul className="grid gap-1 text-[11px] text-amber-900/90 dark:text-amber-100/90 sm:grid-cols-2">
        <li>· 세션당 Export {limits.maxExportsPerSession}회 (남음 {exportsRemaining}회)</li>
        <li>· 최대 길이 {limits.maxGifDurationSec}초</li>
        <li>
          · 최대 해상도 {limits.maxWidth}×{limits.maxHeight}
        </li>
        <li>· 미리보기·무료 Export에 MotionDot 워터마크</li>
      </ul>

      <label className="flex flex-col gap-1 text-xs">
        <span className="text-amber-900/70 dark:text-amber-200/70">
          워터마크 불투명도 ({Math.round(watermarkOpacity * 100)}%)
        </span>
        <input
          type="range"
          min={15}
          max={100}
          className="h-2 w-full accent-violet-600"
          value={Math.round(watermarkOpacity * 100)}
          onChange={(e) =>
            onWatermarkOpacityChange(Number(e.target.value) / 100)
          }
        />
      </label>
    </section>
  );
}
