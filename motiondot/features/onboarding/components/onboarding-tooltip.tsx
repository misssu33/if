'use client';

import { ONBOARDING_TOOLTIPS } from '../data/onboarding-tooltips';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import type { TooltipId } from '../types';

type OnboardingTooltipProps = {
  id: TooltipId;
};

/** 온보딩 설명 툴팁 (닫기 가능) */
export function OnboardingTooltip({ id }: OnboardingTooltipProps) {
  const dismissed = useOnboardingStore((s) => s.isTooltipDismissed(id));
  const dismissTooltip = useOnboardingStore((s) => s.dismissTooltip);

  if (dismissed) return null;

  const tip = ONBOARDING_TOOLTIPS[id];

  return (
    <aside
      className="relative rounded-lg border border-violet-200 bg-violet-50/90 px-4 py-3 text-left dark:border-violet-900 dark:bg-violet-950/50"
      role="note"
    >
      <button
        type="button"
        className="absolute right-2 top-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        aria-label="닫기"
        onClick={() => dismissTooltip(id)}
      >
        ✕
      </button>
      <p className="pr-6 text-xs font-semibold text-violet-900 dark:text-violet-200">
        {tip.title}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-violet-800/90 dark:text-violet-300/90">
        {tip.body}
      </p>
    </aside>
  );
}
