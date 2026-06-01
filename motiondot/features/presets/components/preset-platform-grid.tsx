'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import {
  inferSegmentFromPlatform,
  trackPresetApplied,
  trackExportDestinationSelected,
  trackSellerSegmentIdentified,
} from '@/lib/analytics';
import {
  getSellerSegment,
  setLastPresetUsed,
  setSelectedDestination,
  setSellerSegment,
} from '@/lib/analytics/storage';
import type { MotionDotPreset } from '@/types';
import { useExportSettingsStore } from '../stores/use-export-settings-store';

const PLATFORM_META: Record<
  string,
  { label: string; icon: string; accent: string }
> = {
  tiktok: {
    label: 'TikTok',
    icon: '♪',
    accent: 'border-zinc-900 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900',
  },
  instagram: {
    label: 'Instagram Reels',
    icon: '◎',
    accent:
      'border-pink-300 bg-pink-50/80 dark:border-pink-900 dark:bg-pink-950/40',
  },
  threads: {
    label: 'Threads',
    icon: '@',
    accent:
      'border-zinc-400 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800/80',
  },
  coupang: {
    label: 'Coupang',
    icon: 'C',
    accent:
      'border-red-300 bg-red-50/80 dark:border-red-900 dark:bg-red-950/30',
  },
  kakaotalk: {
    label: 'KakaoTalk',
    icon: 'K',
    accent:
      'border-yellow-400 bg-yellow-50/90 dark:border-yellow-700 dark:bg-yellow-950/30',
  },
  custom: {
    label: 'Custom',
    icon: '⚙',
    accent:
      'border-violet-300 bg-violet-50/80 dark:border-violet-800 dark:bg-violet-950/40',
  },
};

type PresetPlatformGridProps = {
  presets: MotionDotPreset[];
  loading?: boolean;
};

/** SNS 프리셋 카드 그리드 (모바일 2열 · 데스크톱 3열) */
export function PresetPlatformGrid({ presets, loading }: PresetPlatformGridProps) {
  const selected = useExportSettingsStore((s) => s.preset);
  const setPreset = useExportSettingsStore((s) => s.setPreset);

  const handlePresetSelect = (p: MotionDotPreset) => {
    setPreset(p);
    setLastPresetUsed(p.id);
    setSelectedDestination(p.platform);
    trackPresetApplied({
      preset_id: p.id,
      preset_name: p.name,
      platform: p.platform,
    });
    trackExportDestinationSelected({
      destination: p.platform,
      preset_id: p.id,
    });
    if (!getSellerSegment()) {
      const inferred = inferSegmentFromPlatform(p.platform);
      if (inferred) {
        setSellerSegment(inferred, 'inferred', p.platform);
        trackSellerSegmentIdentified({
          segment: inferred,
          source: 'inferred',
          selected_destination: p.platform,
        });
      }
    }
  };

  if (loading) {
    return (
      <p className="text-xs text-zinc-500" aria-live="polite">
        SNS 프리셋 불러오는 중…
      </p>
    );
  }

  if (presets.length === 0) {
    return (
      <p className="text-xs text-zinc-500">사용 가능한 프리셋이 없습니다.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-zinc-500">
        플랫폼을 선택하면 GIF 해상도·프레임 간격·품질·색 수가 자동 적용됩니다.
      </p>
      <ul
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
        role="listbox"
        aria-label="SNS export 프리셋"
      >
        {presets.map((p) => {
          const meta = PLATFORM_META[p.platform] ?? PLATFORM_META.custom;
          const active = selected?.id === p.id;
          return (
            <li key={p.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={active}
                disabled={loading}
                onClick={() => handlePresetSelect(p)}
                className={`flex min-h-[5.5rem] w-full flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition sm:min-h-[6rem] sm:p-4 ${
                  active
                    ? 'border-violet-600 ring-2 ring-violet-400/40 dark:border-violet-500'
                    : meta.accent
                }`}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {meta.icon}
                </span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {meta.label}
                </span>
                <span className="line-clamp-2 text-[10px] leading-snug text-zinc-500 sm:text-xs">
                  {p.aspectRatioRecommendation ?? p.aspectRatio}
                </span>
                <span className="mt-auto text-[10px] font-medium text-violet-600 dark:text-violet-400">
                  {p.width}×{p.height} · {p.maxColors ?? '—'}색
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
