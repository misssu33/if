'use client';

import { OverlayEditorPanel } from '@/features/editor';
import { useTemplateCatalog } from '@/features/templates/hooks/use-template-catalog';
import { resolveTemplateId } from '@/features/templates/utils/legacy-template-map';
import { usePreviewStore, type MotionAdTemplateId } from '../stores/use-preview-store';

/** 템플릿 선택 + 오버레이 텍스트 편집 (미리보기 플레이어 제외) */
export function TemplateSettingsPanel() {
  const { templates, loading } = useTemplateCatalog();
  const templateId = usePreviewStore((s) => s.templateId);
  const setTemplateId = usePreviewStore((s) => s.setTemplateId);

  const template =
    resolveTemplateId(templateId, templates) ??
    templates.find((t) => t.id === 'tiktok-product-hook');

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        모션 템플릿
      </h3>
      <select
        className="min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        value={templateId}
        disabled={loading}
        onChange={(e) => setTemplateId(e.target.value as MotionAdTemplateId)}
      >
        {templates.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <OverlayEditorPanel template={template} />
    </section>
  );
}
