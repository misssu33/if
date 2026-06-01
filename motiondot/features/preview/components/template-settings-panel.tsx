'use client';

import { useMemo } from 'react';
import { useTemplateCatalog } from '@/features/templates/hooks/use-template-catalog';
import { usePreviewStore, type MotionAdTemplateId } from '../stores/use-preview-store';
import { OverlayTextFields } from './overlay-text-fields';
import { overlaySelectClass } from '../constants/overlay-input-classes';
import { formatTemplateOptionLabel } from '../utils/format-template-option-label';
import { trackTemplateSelected } from '@/lib/analytics';
import { TemplateViewedTracker } from '@/components/analytics/TemplateViewedTracker';

/** 템플릿·카피 설정 (미리보기 플레이어 제외) */
export function TemplateSettingsPanel() {
  const { templates, loading } = useTemplateCatalog();
  const templateId = usePreviewStore((s) => s.templateId);
  const setTemplateId = usePreviewStore((s) => s.setTemplateId);

  const template = useMemo(
    () => templates.find((t) => t.id === templateId),
    [templates, templateId],
  );

  const handleTemplateChange = (nextId: MotionAdTemplateId) => {
    setTemplateId(nextId);
    const next = templates.find((t) => t.id === nextId);
    if (next) trackTemplateSelected(next);
  };

  return (
    <section className="flex flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
      <TemplateViewedTracker template={template} />
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        모션 템플릿
      </h3>
      <select
        className={overlaySelectClass}
        value={templateId}
        disabled={loading}
        onChange={(e) =>
          handleTemplateChange(e.target.value as MotionAdTemplateId)
        }
      >
        {templates
          .filter((t) => t.aspectRatio === '9:16')
          .map((t) => (
            <option key={t.id} value={t.id}>
              {formatTemplateOptionLabel(t)}
            </option>
          ))}
        {templates.some((t) => t.aspectRatio !== '9:16') && (
          <optgroup label="기타 비율">
            {templates
              .filter((t) => t.aspectRatio !== '9:16')
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {formatTemplateOptionLabel(t)}
                </option>
              ))}
          </optgroup>
        )}
      </select>
      <OverlayTextFields />
    </section>
  );
}
