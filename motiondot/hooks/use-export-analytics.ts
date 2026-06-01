'use client';

import { useEffect, useRef } from 'react';
import { useConversionStore } from '@/features/queue/stores/use-conversion-store';
import { usePreviewStore } from '@/features/preview/stores/use-preview-store';
import { useExportSettingsStore } from '@/features/presets/stores/use-export-settings-store';
import {
  trackExportCompleted,
  trackExportFailed,
  trackTemplateExported,
} from '@/lib/analytics/events';
import {
  getActiveTemplateMeta,
  getCtaEdited,
  getEditTimeSec,
  markExportCompleted,
} from '@/lib/analytics/session';
import {
  setLastPresetUsed,
  setLastTemplateUsed,
} from '@/lib/analytics/storage';

/** 큐 job 상태 전환 → export_completed / export_failed / template_exported */
export function useExportAnalytics() {
  const jobs = useConversionStore((s) => s.jobs);
  const prevStatusRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const previewTemplateId = usePreviewStore.getState().templateId;
    const meta = getActiveTemplateMeta();
    const templateId = meta.id ?? previewTemplateId;
    const templateName = meta.name ?? templateId;
    const ctaText = usePreviewStore.getState().ctaText;
    const resolved = useExportSettingsStore.getState().resolved;
    const preset = useExportSettingsStore.getState().preset;

    for (const job of jobs) {
      const prev = prevStatusRef.current.get(job.jobId);
      const next = job.status;
      if (prev === next) continue;
      prevStatusRef.current.set(job.jobId, next);

      if (prev === 'completed' || prev === 'failed') continue;

      const presetUsed = job.presetId || resolved?.presetId;
      const exportFormat = job.format;

      if (next === 'completed' && job.outputPath) {
        markExportCompleted();
        setLastTemplateUsed(templateId);
        if (presetUsed) setLastPresetUsed(presetUsed);

        trackExportCompleted({
          export_format: exportFormat,
          template_id: templateId,
          preset_used: presetUsed,
          job_id: job.jobId,
        });

        trackTemplateExported({
          template_id: templateId,
          template_name: templateName,
          preset_used: presetUsed,
          export_format: exportFormat,
          aspect_ratio: resolved?.aspectRatio ?? preset?.aspectRatio,
          cta_edited: getCtaEdited(),
          edit_time_sec: getEditTimeSec(),
          watermarked: false,
          char_count: ctaText.length,
        });
      }

      if (next === 'failed') {
        trackExportFailed({
          error_type: 'conversion_failed',
          error_message: job.error,
          export_format: exportFormat,
          template_id: templateId,
          preset_used: presetUsed,
        });
      }
    }
  }, [jobs]);
}
