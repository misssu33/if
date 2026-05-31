'use client';

import { useOnboardingStore } from '../stores/use-onboarding-store';
import type { GuidedStep } from '../types';

const STEPS: { n: GuidedStep; label: string }[] = [
  { n: 1, label: '미디어 업로드' },
  { n: 2, label: '프리셋 · 템플릿' },
  { n: 3, label: '미리보기 · Export' },
];

type GuidedStepperProps = {
  /** inline: 가로 칩(랜딩 등) · stacked: 사이드바/드로어 세로 목록 */
  layout?: 'inline' | 'stacked';
};

export function GuidedStepper({ layout = 'inline' }: GuidedStepperProps) {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const setStep = useOnboardingStore((s) => s.setStep);

  const isStacked = layout === 'stacked';

  return (
    <nav aria-label="제작 단계" className="flex flex-col gap-3">
      <ol
        className={
          isStacked
            ? 'flex flex-col gap-2'
            : 'flex flex-wrap gap-2'
        }
      >
        {STEPS.map(({ n, label }) => {
          const active = currentStep === n;
          const done = currentStep > n;
          return (
            <li key={n} className={isStacked ? 'w-full' : undefined}>
              <button
                type="button"
                onClick={() => setStep(n)}
                className={`flex min-h-11 items-center gap-2 rounded-lg font-medium transition ${
                  isStacked
                    ? 'w-full justify-start px-3 py-2.5 text-sm'
                    : 'rounded-full px-3 py-1.5 text-xs'
                } ${
                  active
                    ? 'bg-violet-600 text-white'
                    : done
                      ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                    active ? 'bg-white/20' : 'bg-white dark:bg-zinc-900'
                  }`}
                >
                  {done ? '✓' : n}
                </span>
                <span className={isStacked ? 'truncate text-left' : ''}>{label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
