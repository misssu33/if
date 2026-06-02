'use client';

import { useCallback } from 'react';
import { useBatchStore } from '@/stores';
import { PreviewGrid } from './preview-grid';
import { ExportInspector } from './export-inspector';
import { PreviewPlayerShell } from './preview-player-shell';
import { OverlayTextFields } from './overlay-text-fields';
import { usePreviewSource } from '../hooks/use-preview-source';
import { useFocusOverlayInput } from '../hooks/use-focus-overlay-input';
import { usePreviewStore, type MotionAdTemplateId } from '../stores/use-preview-store';
import type { TextOverlayLayerId } from '../types/text-overlay-layer';
import { TemplateSelectField } from '@/features/templates/components/template-select-field';
import { trackTemplateSelected } from '@/lib/analytics';
import { TemplateViewedTracker } from '@/components/analytics/TemplateViewedTracker';

/** 광고 모션 템플릿 미리보기 패널 */
export function PreviewPanel() {
  const files = useBatchStore((s) => s.files);
  const { inputProps, loopPlayback, templates, templatesLoading, template } =
    usePreviewSource();
  const templateId = usePreviewStore((s) => s.templateId);
  const setTemplateId = usePreviewStore((s) => s.setTemplateId);
  const activeTextLayer = usePreviewStore((s) => s.activeTextLayer);
  const setActiveTextLayer = usePreviewStore((s) => s.setActiveTextLayer);
  const focusOverlayInput = useFocusOverlayInput();

  const handleSelectTextLayer = useCallback(
    (layerId: TextOverlayLayerId) => {
      setActiveTextLayer(layerId);
      focusOverlayInput(layerId);
    },
    [focusOverlayInput, setActiveTextLayer],
  );

  const handleTemplateChange = (nextId: MotionAdTemplateId) => {
    setTemplateId(nextId);
    const next = templates.find((t) => t.id === nextId);
    if (next) trackTemplateSelected(next);
  };

  return (
    <section className="flex flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
      <TemplateViewedTracker template={template} />
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        TikTok 제휴 9:16 미리보기
      </h2>

      <div>
        <span className="text-xs text-zinc-500">템플릿</span>
        <TemplateSelectField
          templates={templates}
          templateId={templateId}
          loading={templatesLoading}
          onChange={handleTemplateChange}
        />
      </div>

      <PreviewGrid files={files} />

      {inputProps ? (
        <PreviewPlayerShell
          inputProps={inputProps}
          loop={loopPlayback}
          activeTextLayer={activeTextLayer}
          onSelectTextLayer={handleSelectTextLayer}
          onClearTextLayer={() => setActiveTextLayer(null)}
        >
          <p className="text-[11px] text-zinc-500 md:hidden">
            미리보기의 텍스트 영역을 탭하면 아래 입력으로 바로 이동합니다.
          </p>
          <OverlayTextFields />
        </PreviewPlayerShell>
      ) : (
        <div className="mx-auto flex aspect-[9/16] w-full max-w-[280px] items-center justify-center rounded-lg bg-zinc-900 text-sm text-zinc-400 sm:max-w-xs">
          {templatesLoading ? '템플릿 로딩…' : '파일을 업로드하면 9:16 미리보기가 표시됩니다.'}
        </div>
      )}

      {!inputProps && <OverlayTextFields />}

      <ExportInspector />
    </section>
  );
}
