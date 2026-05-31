'use client';

import { useCallback } from 'react';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import { usePresetCatalog } from '@/features/presets/hooks/use-preset-catalog';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';
import { useExportSessionStore } from '@/features/export/stores/use-export-session-store';
import type { SampleProject } from '../types';
import { useOnboardingStore } from '../stores/use-onboarding-store';

/** 샘플 프로젝트 → 프리셋·템플릿·포맷 (UI 상태만) */
export function useApplySampleProject() {
  const { presets } = usePresetCatalog();
  const setPreset = useExportSettingsStore((s) => s.setPreset);
  const setTemplateId = usePreviewStore((s) => s.setTemplateId);
  const setFormats = useExportSessionStore((s) => s.setFormats);
  const startFlow = useOnboardingStore((s) => s.startFlow);
  const setStep = useOnboardingStore((s) => s.setStep);

  return useCallback(
    (project: SampleProject) => {
      const preset = presets.find((p) => p.id === project.presetId);
      if (preset) setPreset(preset);
      setTemplateId(project.templateId as Parameters<typeof setTemplateId>[0]);
      setFormats(project.formats);
      startFlow('template');
      setStep(2);
    },
    [presets, setPreset, setTemplateId, setFormats, startFlow, setStep],
  );
}
