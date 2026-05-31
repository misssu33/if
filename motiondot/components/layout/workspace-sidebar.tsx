'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui';
import { GuidedStepper } from '@/features/onboarding/components/guided-stepper';

type WorkspaceSidebarProps = {
  onNavigate?: () => void;
  footer?: ReactNode;
};

/** 데스크톱 사이드바 · 모바일 드로어 공용 내비게이션 */
export function WorkspaceSidebar({ onNavigate, footer }: WorkspaceSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          제작 단계
        </p>
        <div className="mt-3" onClick={onNavigate}>
          <GuidedStepper layout="stacked" />
        </div>
      </div>
      {footer}
    </div>
  );
}

type WorkspaceSidebarFooterProps = {
  onHome: () => void;
  onNavigate?: () => void;
};

export function WorkspaceSidebarFooter({
  onHome,
  onNavigate,
}: WorkspaceSidebarFooterProps) {
  return (
    <div className="mt-auto border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <Button
        type="button"
        variant="secondary"
        className="w-full sm:w-auto"
        onClick={() => {
          onHome();
          onNavigate?.();
        }}
      >
        홈으로
      </Button>
    </div>
  );
}
