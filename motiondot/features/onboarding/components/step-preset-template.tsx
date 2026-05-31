'use client';

import { PresetSelector } from '@/features/presets';
import { TemplateSettingsPanel } from '@/features/preview/components/template-settings-panel';
import { PreviewGrid } from '@/features/preview/components/preview-grid';
import { useBatchStore } from '@/stores';
import { useOnboardingStore } from '../stores/use-onboarding-store';
import { OnboardingTooltip } from './onboarding-tooltip';
import { Button } from '@/components/ui';

export function StepPresetTemplate() {
  const files = useBatchStore((s) => s.files);
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const prevStep = useOnboardingStore((s) => s.prevStep);

  return (
    <div className="flex flex-col gap-6">
      <OnboardingTooltip id="sns-presets" />
      <OnboardingTooltip id="motion-templates" />
      <PresetSelector />
      {files.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-zinc-500">미리보기 대상</p>
          <PreviewGrid files={files} />
        </div>
      )}
      <TemplateSettingsPanel />
      <div className="flex justify-between">
        <Button type="button" variant="secondary" onClick={() => prevStep()}>
          이전
        </Button>
        <Button type="button" onClick={() => nextStep()}>
          다음: 미리보기 · Export
        </Button>
      </div>
    </div>
  );
}
