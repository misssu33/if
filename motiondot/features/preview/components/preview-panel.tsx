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
import { overlaySelectClass } from '../constants/overlay-input-classes';
import { formatTemplateOptionLabel } from '../utils/format-template-option-label';

/** 광고 모션 템플릿 미리보기 패널 */
export function PreviewPanel() {
  const files = useBatchStore((s) => s.files);
  const { inputProps, loopPlayback, templates, templatesLoading } =
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

  return (
    <section className="flex flex-col gap-4 min-w-0 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        광고 모션 미리보기
      </h2>

      <div>
        <span className="text-xs text-zinc-500">템플릿</span>
        <select
          className={overlaySelectClass}
          value={templateId}
          disabled={templatesLoading}
          onChange={(e) => setTemplateId(e.target.value as MotionAdTemplateId)}
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
        <div className="flex aspect-video w-full max-w-full items-center justify-center rounded-lg bg-zinc-900 text-sm text-zinc-400">
          {templatesLoading ? '템플릿 로딩…' : '프리셋을 선택하면 미리보기가 표시됩니다.'}
        </div>
      )}

      {!inputProps && <OverlayTextFields />}

      <ExportInspector />
    </section>
  );
}
