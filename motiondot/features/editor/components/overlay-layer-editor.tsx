'use client';

import type { OverlayLayerId } from '../types/overlay-editor';
import { OVERLAY_LAYER_LABELS } from '../types/overlay-editor';
import type { OverlayLayerContent } from '../types/overlay-editor';
import type { TextAlign } from '../types/overlay-editor';

type OverlayLayerEditorProps = {
  layerId: OverlayLayerId;
  layer: OverlayLayerContent;
  enabled: boolean;
  onTextChange: (text: string) => void;
  onStyleChange: (patch: Partial<OverlayLayerContent['style']>) => void;
  onReset: () => void;
};

const inputClass =
  'mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900';

/** 단일 레이어 편집 필드 */
export function OverlayLayerEditor({
  layerId,
  layer,
  enabled,
  onTextChange,
  onStyleChange,
  onReset,
}: OverlayLayerEditorProps) {
  if (!enabled) return null;

  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <legend className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {OVERLAY_LAYER_LABELS[layerId]}
        </legend>
        <button
          type="button"
          className="min-h-9 shrink-0 rounded-lg px-2 text-[11px] text-violet-600 hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-950/40"
          onClick={onReset}
        >
          템플릿 기본값
        </button>
      </div>

      <label className="text-xs">
        <span className="text-zinc-500">텍스트</span>
        <textarea
          rows={2}
          className={`${inputClass} resize-y`}
          value={layer.text}
          onChange={(e) => onTextChange(e.target.value)}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs">
          <span className="text-zinc-500">글자 크기</span>
          <input
            type="number"
            min={10}
            max={120}
            className={inputClass}
            value={layer.style.fontSize}
            onChange={(e) =>
              onStyleChange({ fontSize: Number(e.target.value) || 12 })
            }
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">굵기</span>
          <input
            type="number"
            min={100}
            max={900}
            step={100}
            className={inputClass}
            value={layer.style.fontWeight}
            onChange={(e) =>
              onStyleChange({ fontWeight: Number(e.target.value) || 400 })
            }
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">색상</span>
          <input
            type="color"
            className={`${inputClass} h-11 cursor-pointer p-1`}
            value={layer.style.color.startsWith('#') ? layer.style.color : '#ffffff'}
            onChange={(e) => onStyleChange({ color: e.target.value })}
          />
        </label>
        <label className="text-xs">
          <span className="text-zinc-500">정렬</span>
          <select
            className={inputClass}
            value={layer.style.textAlign}
            onChange={(e) =>
              onStyleChange({ textAlign: e.target.value as TextAlign })
            }
          >
            <option value="left">왼쪽</option>
            <option value="center">가운데</option>
            <option value="right">오른쪽</option>
          </select>
        </label>
        <label className="col-span-2 text-xs">
          <span className="text-zinc-500">
            불투명도 ({Math.round(layer.style.opacity * 100)}%)
          </span>
          <input
            type="range"
            min={0}
            max={100}
            className="mt-2 h-2 w-full accent-violet-600"
            value={Math.round(layer.style.opacity * 100)}
            onChange={(e) =>
              onStyleChange({ opacity: Number(e.target.value) / 100 })
            }
          />
        </label>
      </div>
    </fieldset>
  );
}
