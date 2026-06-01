'use client';

import type { ReactNode } from 'react';

import { useBatchStore } from '@/stores';
import { OverlayEditorPanel } from '@/features/editor';
import { useOnboardingStore } from '@/features/onboarding/stores/use-onboarding-store';
import { PreviewPlayer } from './preview-player';
import { PreviewGrid } from './preview-grid';
import { ExportInspector } from './export-inspector';
import { PreviewErrorBoundary } from './preview-error-boundary';
import { PreviewFallback } from './preview-fallback';
import { usePreviewSource } from '../hooks/use-preview-source';
import { usePreviewStore, type MotionAdTemplateId } from '../stores/use-preview-store';

/** 광고 모션 템플릿 미리보기 패널 (편집기는 미리보기 아래) */
export function PreviewPanel() {
  const files = useBatchStore((s) => s.files);
  const openLanding = useOnboardingStore((s) => s.openLanding);
  const {
    inputProps,
    loopPlayback,
    templates,
    templatesLoading,
    template,
  } = usePreviewSource();
  const templateId = usePreviewStore((s) => s.templateId);
  const setTemplateId = usePreviewStore((s) => s.setTemplateId);

  let previewBody: ReactNode;
  if (templatesLoading) {
    previewBody = (
      <PreviewFallback
        title="템플릿 로딩 중"
        description="잠시만 기다려 주세요."
      />
    );
  } else if (!template) {
    previewBody = (
      <PreviewFallback
        title="템플릿을 불러올 수 없습니다"
        description="2단계에서 템플릿을 선택하거나 잠시 후 다시 시도하세요."
        onBack={openLanding}
      />
    );
  } else if (inputProps) {
    previewBody = (
      <PreviewErrorBoundary>
        <PreviewPlayer inputProps={inputProps} loop={loopPlayback} />
      </PreviewErrorBoundary>
    );
  } else {
    previewBody = (
      <PreviewFallback
        title="미리보기 준비 중"
        description="템플릿·프리셋·미디어가 준비되면 여기에 표시됩니다. 이미지만 업로드한 경우에도 안전하게 미리볼 수 있습니다."
        onBack={openLanding}
      />
    );
  }

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl border border-zinc-200 p-4 sm:p-6 dark:border-zinc-800">
      <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        광고 모션 미리보기
      </h2>

      <div>
        <span className="text-xs text-zinc-500">템플릿</span>
        <select
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          value={templateId}
          disabled={templatesLoading || templates.length === 0}
          onChange={(e) => setTemplateId(e.target.value as MotionAdTemplateId)}
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <PreviewGrid files={files} />

      <div className="min-w-0">{previewBody}</div>

      <OverlayEditorPanel template={template} />

      <ExportInspector />
    </section>
  );
}
