'use client';

import { useEffect, useRef } from 'react';
import type { MotionTemplateDefinition } from '@/types/motion-template';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import { buildTemplateExportedPayload, trackTemplateExported } from '@/lib/analytics';

/** export 성공 시 template_exported 1회 */
export function useExportSuccessAnalytics(
  isSuccess: boolean,
  template: MotionTemplateDefinition | undefined,
) {
  const sent = useRef(false);

  useEffect(() => {
    if (!isSuccess || !template || sent.current) return;

    const resolved = useExportSettingsStore.getState().resolved;
    if (!resolved) return;

    const { headline, subline, ctaText, badgeText } = usePreviewStore.getState();

    const payload = buildTemplateExportedPayload({
      template,
      exportFormat: resolved.outputFormat,
      presetId: resolved.presetId,
      headline,
      subline,
      ctaText,
      badgeText,
    });

    trackTemplateExported(payload);
    sent.current = true;
  }, [isSuccess, template]);
}
