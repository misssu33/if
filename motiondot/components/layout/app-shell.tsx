'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { MobileTopNav } from './mobile-top-nav';
import {
  WorkspaceSidebar,
  WorkspaceSidebarFooter,
} from './workspace-sidebar';
import type { GuidedStep } from '@/features/onboarding/types';

type AppShellProps = {
  currentStep: GuidedStep;
  onHome: () => void;
  children: ReactNode;
};

/** 반응형 앱 셸 — lg+ 고정 사이드바, 모바일 상단바 + 슬라이드 드로어 */
export function AppShell({ currentStep, onHome, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => {
      if (mq.matches) setDrawerOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden lg:flex-row">
      <MobileTopNav
        currentStep={currentStep}
        onOpenMenu={() => setDrawerOpen(true)}
      />

      {drawerOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
          tabIndex={-1}
          onClick={closeDrawer}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,18rem)] flex-col border-r border-zinc-200 bg-zinc-50 p-4 shadow-xl transition-transform duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-950 lg:static lg:z-auto lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:shadow-none lg:transition-none ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="워크스페이스 내비게이션"
      >
        <div className="mb-4 flex items-center justify-between lg:block">
          <div className="hidden lg:block">
            <p className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              MotionDot
            </p>
            <p className="mt-0.5 text-xs text-zinc-500">GIF · MP4 · WebP 배치 변환</p>
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 lg:hidden">
            메뉴
          </span>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden"
            aria-label="메뉴 닫기"
            onClick={closeDrawer}
          >
            ✕
          </button>
        </div>
        <WorkspaceSidebar
          onNavigate={closeDrawer}
          footer={
            <WorkspaceSidebarFooter onHome={onHome} onNavigate={closeDrawer} />
          }
        />
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
