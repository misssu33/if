'use client';

import { useMemo } from 'react';
import { useTemplateCatalog } from '@/features/templates/hooks/use-template-catalog';
import { TemplateSelectField } from '@/features/templates/components/template-select-field';
import { usePreviewStore, type MotionAdTemplateId } from '../stores/use-preview-store';
import { OverlayTextFields } from './overlay-text-fields';
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
        TikTok 제휴 템플릿
      </h3>
      <TemplateSelectField
        templates={templates}
        templateId={templateId}
        loading={loading}
        onChange={handleTemplateChange}
      />
      <OverlayTextFields />
    </section>
  );
}
