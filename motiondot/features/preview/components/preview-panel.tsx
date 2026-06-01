'use client';

import { useBatchStore } from '@/stores';
import { PreviewPlayer } from './preview-player';
import { PreviewGrid } from './preview-grid';
import { ExportInspector } from './export-inspector';
import { FreeTierUpgradeBanner } from '@/features/free-tier';
import { useFreeTier } from '@/hooks/useFreeTier';
import { usePreviewSource } from '../hooks/use-preview-source';
import { usePreviewStore, type MotionAdTemplateId } from '../stores/use-preview-store';

/** 광고 모션 템플릿 미리보기 패널 */
export function PreviewPanel() {
  const files = useBatchStore((s) => s.files);
  const { inputProps, loopPlayback, templates, templatesLoading } =
    usePreviewSource();
  const templateId = usePreviewStore((s) => s.templateId);
  const setTemplateId = usePreviewStore((s) => s.setTemplateId);
  const headline = usePreviewStore((s) => s.headline);
  const setHeadline = usePreviewStore((s) => s.setHeadline);
  const subline = usePreviewStore((s) => s.subline);
  const setSubline = usePreviewStore((s) => s.setSubline);
  const ctaText = usePreviewStore((s) => s.ctaText);
  const setCtaText = usePreviewStore((s) => s.setCtaText);
  const {
    isFree,
    exportsRemaining,
    limits,
    watermarkOpacity,
    setWatermarkOpacity,
  } = useFreeTier();

  return (
    <section className="flex flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        광고 모션 미리보기
      </h2>

      <div>
        <span className="text-xs text-zinc-500">템플릿</span>
        <select
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          value={templateId}
          disabled={templatesLoading}
          onChange={(e) => setTemplateId(e.target.value as MotionAdTemplateId)}
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <FreeTierUpgradeBanner
        isFree={isFree}
        exportsRemaining={exportsRemaining}
        limits={limits}
        watermarkOpacity={watermarkOpacity}
        onWatermarkOpacityChange={setWatermarkOpacity}
      />

      <PreviewGrid files={files} />

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-xs">
          <span className="text-zinc-500">헤드라인</span>
          <input
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 sm:min-h-0 sm:py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">서브라인</span>
          <input
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 sm:min-h-0 sm:py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={subline}
            onChange={(e) => setSubline(e.target.value)}
          />
        </label>
        <label className="text-xs sm:col-span-2">
          <span className="text-zinc-500">CTA</span>
          <input
            className="mt-1 min-h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 sm:min-h-0 sm:py-1 dark:border-zinc-700 dark:bg-zinc-900"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
          />
        </label>
      </div>

      {inputProps ? (
        <PreviewPlayer inputProps={inputProps} loop={loopPlayback} />
      ) : (
        <div className="flex aspect-video w-full max-w-full items-center justify-center rounded-lg bg-zinc-900 text-sm text-zinc-400">
          {templatesLoading ? '템플릿 로딩…' : '프리셋을 선택하면 미리보기가 표시됩니다.'}
        </div>
      )}

      <ExportInspector />
    </section>
  );
}
