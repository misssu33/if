'use client';

import type { MotionTemplateDefinition } from '@/types/motion-template';
import { useOverlayEditor } from '../hooks/use-overlay-editor';
import { OverlayLayerEditor } from './overlay-layer-editor';
import type { OverlayLayerId } from '../types/overlay-editor';

const LAYER_ORDER: OverlayLayerId[] = ['headline', 'subline', 'cta', 'badge'];

type OverlayEditorPanelProps = {
  template: MotionTemplateDefinition | undefined;
};

/**
 * 접이식 오버레이 텍스트 편집기 (모바일: 미리보기 아래, 펼침 시에만 높이 확장)
 */
export function OverlayEditorPanel({ template }: OverlayEditorPanelProps) {
  const {
    layers,
    panelOpen,
    setPanelOpen,
    setLayerText,
    setLayerStyle,
    resetLayerToTemplate,
    resetAllToTemplate,
    isLayerEnabled,
  } = useOverlayEditor(template);

  if (!template || !layers) {
    return (
      <p className="text-xs text-zinc-500">템플릿을 선택하면 텍스트를 편집할 수 있습니다.</p>
    );
  }

  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-xl border border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20">
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-zinc-800 dark:text-zinc-100"
        aria-expanded={panelOpen}
        onClick={() => setPanelOpen(!panelOpen)}
      >
        <span>텍스트 오버레이 편집</span>
        <span className="text-xs text-zinc-500" aria-hidden>
          {panelOpen ? '▲' : '▼'}
        </span>
      </button>

      {panelOpen && (
        <div className="flex max-h-[min(70vh,520px)] flex-col gap-3 overflow-y-auto border-t border-violet-200/80 px-4 pb-4 pt-1 dark:border-violet-900">
          <p className="text-[11px] text-zinc-500">
            변경 사항은 미리보기에 즉시 반영됩니다. 긴 문장은 자동 줄바꿈됩니다.
          </p>
          <button
            type="button"
            className="min-h-10 self-start rounded-lg px-3 text-xs text-violet-700 underline-offset-2 hover:underline dark:text-violet-300"
            onClick={resetAllToTemplate}
          >
            전체 템플릿 기본값으로
          </button>
          {LAYER_ORDER.map((id) => (
            <OverlayLayerEditor
              key={id}
              layerId={id}
              layer={layers[id]}
              enabled={isLayerEnabled(id)}
              onTextChange={(text) => setLayerText(id, text)}
              onStyleChange={(patch) => setLayerStyle(id, patch)}
              onReset={() => resetLayerToTemplate(id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
