'use client';

import type { GuidedStep } from '@/features/onboarding/types';

const STEP_LABELS: Record<GuidedStep, string> = {
  1: '미디어 업로드',
  2: '프리셋 · 템플릿',
  3: '미리보기 · Export',
};

type MobileTopNavProps = {
  currentStep: GuidedStep;
  onOpenMenu: () => void;
};

/** 모바일 상단 바 — 메뉴 버튼 + 현재 단계 */
export function MobileTopNav({ currentStep, onOpenMenu }: MobileTopNavProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/95 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-black/90 lg:hidden">
      <button
        type="button"
        className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        aria-label="메뉴 열기"
        onClick={onOpenMenu}
      >
        <span className="sr-only">메뉴</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          MotionDot
        </p>
        <p className="truncate text-xs text-zinc-500">
          {currentStep}/3 · {STEP_LABELS[currentStep]}
        </p>
      </div>
    </header>
  );
}
