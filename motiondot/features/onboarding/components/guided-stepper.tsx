'use client';

import { useOnboardingStore } from '../stores/use-onboarding-store';
import type { GuidedStep } from '../types';

const STEPS: { n: GuidedStep; label: string }[] = [
  { n: 1, label: '미디어 업로드' },
  { n: 2, label: '프리셋 · 템플릿' },
  { n: 3, label: '미리보기 · Export' },
];

export function GuidedStepper() {
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const setStep = useOnboardingStore((s) => s.setStep);

  return (
    <nav aria-label="제작 단계" className="flex flex-col gap-3">
      <ol className="flex flex-wrap gap-2">
        {STEPS.map(({ n, label }) => {
          const active = currentStep === n;
          const done = currentStep > n;
          return (
            <li key={n}>
              <button
                type="button"
                onClick={() => setStep(n)}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'bg-violet-600 text-white'
                    : done
                      ? 'bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                    active ? 'bg-white/20' : 'bg-white dark:bg-zinc-900'
                  }`}
                >
                  {done ? '✓' : n}
                </span>
                {label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
