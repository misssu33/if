'use client';

import { useTemplateCatalog } from '@/features/templates/hooks/use-template-catalog';
import { usePreviewStore, type MotionAdTemplateId } from '../stores/use-preview-store';

/** 템플릿·카피 설정 (미리보기 플레이어 제외) */
export function TemplateSettingsPanel() {
  const { templates, loading } = useTemplateCatalog();
  const templateId = usePreviewStore((s) => s.templateId);
  const setTemplateId = usePreviewStore((s) => s.setTemplateId);
  const headline = usePreviewStore((s) => s.headline);
  const setHeadline = usePreviewStore((s) => s.setHeadline);
  const subline = usePreviewStore((s) => s.subline);
  const setSubline = usePreviewStore((s) => s.setSubline);
  const ctaText = usePreviewStore((s) => s.ctaText);
  const setCtaText = usePreviewStore((s) => s.setCtaText);

  return (
    <section className="flex flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        모션 템플릿
      </h3>
      <select
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
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
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">
          <span className="text-zinc-500">헤드라인</span>
          <input
            className="mt-1 w-full rounded border border-zinc-200 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">서브라인</span>
          <input
            className="mt-1 w-full rounded border border-zinc-200 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={subline}
            onChange={(e) => setSubline(e.target.value)}
          />
        </label>
        <label className="text-xs sm:col-span-2">
          <span className="text-zinc-500">CTA</span>
          <input
            className="mt-1 w-full rounded border border-zinc-200 px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
