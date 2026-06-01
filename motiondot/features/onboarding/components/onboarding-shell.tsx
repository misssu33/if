'use client';

import { useEffect } from 'react';
import { PageShell } from '@/components/ui';
import { AppHeader } from '@/components/layout';
import { useConversionSync } from '@/features/queue/hooks/use-conversion-sync';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { LandingDashboard } from './landing-dashboard';
import { GuidedWorkspace } from './guided-workspace';

function ConversionSyncBridge() {
  useConversionSync();
  return null;
}

/** 랜딩 ↔ 3단계 가이드 전환 */
export function OnboardingShell() {
  const bootstrapped = useOnboardingStore((s) => s.bootstrapped);
  const bootstrapFromStorage = useOnboardingStore((s) => s.bootstrapFromStorage);
  const showLanding = useOnboardingStore((s) => s.showLanding);

  useEffect(() => {
    bootstrapFromStorage();
  }, [bootstrapFromStorage]);

  if (!bootstrapped) {
    return (
      <PageShell className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-500">로딩 중…</p>
      </PageShell>
    );
  }

  return (
    <>
      <ConversionSyncBridge />
      {showLanding ? (
        <PageShell className="min-h-screen">
          <AppHeader />
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
            <LandingDashboard />
          </div>
        </PageShell>
      ) : (
        <GuidedWorkspace />
      )}
    </>
  );
}
