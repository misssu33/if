'use client';

import { useEffect } from 'react';
import { AppHeader } from '@/components/layout';
import { PageShell } from '@/components/ui';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { GuidedStepper } from './guided-stepper';
import { StepUpload } from './step-upload';
import { StepPresetTemplate } from './step-preset-template';
import { StepPreviewExport } from './step-preview-export';
import { Button } from '@/components/ui';

export function GuidedWorkspace() {
  const hydrate = useOnboardingStore((s) => s.hydrate);
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const openLanding = useOnboardingStore((s) => s.openLanding);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <PageShell className="min-h-screen">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GuidedStepper />
          <Button type="button" variant="secondary" onClick={openLanding}>
            홈으로
          </Button>
        </div>
        {currentStep === 1 && <StepUpload />}
        {currentStep === 2 && <StepPresetTemplate />}
        {currentStep === 3 && <StepPreviewExport />}
      </div>
    </PageShell>
  );
}
