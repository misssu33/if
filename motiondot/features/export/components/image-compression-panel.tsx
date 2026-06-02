'use client';

import type { ImageCompressionPresetId } from '@/lib/image/compression-presets';
import { IMAGE_COMPRESSION_PRESETS } from '@/lib/image/compression-presets';
import { useImageCompressionStore } from '../stores/use-image-compression-store';
import { useCoupangCompressionSuggestion } from '../hooks/use-coupang-compression-suggestion';
import { useExportCompressionEstimate } from '../hooks/use-export-compression-estimate';

const OPTIONS: { id: ImageCompressionPresetId; label: string }[] = [
  { id: 'off', label: '압축 안 함' },
  ...IMAGE_COMPRESSION_PRESETS.map((p) => ({ id: p.id, label: p.shortLabel })),
];

/** 이미지 압축 옵션 — 쿠팡·상세페이지 친화 (선택) */
export function ImageCompressionPanel() {
  useCoupangCompressionSuggestion();

  const presetId = useImageCompressionStore((s) => s.presetId);
  const setPresetId = useImageCompressionStore((s) => s.setPresetId);
  const lastUploadSummary = useImageCompressionStore((s) => s.lastUploadSummary);
  const { exportEstimate, sourceImageHint, coupangLimitHint } =
    useExportCompressionEstimate();

  const activePreset = IMAGE_COMPRESSION_PRESETS.find((p) => p.id === presetId);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
          이미지 압축 (선택)
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">
          상품 이미지 업로드 시 브라우저에서 줄입니다. GIF 변환(비디오)은 그대로
          진행됩니다.
        </p>
      </div>

      <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="이미지 압축 프리셋">
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              presetId === opt.id
                ? 'border-violet-500 bg-violet-50 dark:border-violet-600 dark:bg-violet-950/30'
                : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
            }`}
          >
            <input
              type="radio"
              name="image-compression"
              className="h-4 w-4 shrink-0 accent-violet-600"
              checked={presetId === opt.id}
              onChange={() => setPresetId(opt.id)}
            />
            <span className="text-zinc-800 dark:text-zinc-100">{opt.label}</span>
          </label>
        ))}
      </div>

      {activePreset && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {activePreset.description}
        </p>
      )}

      {lastUploadSummary && (
        <p className="rounded-lg bg-emerald-50 px-2 py-1.5 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          {lastUploadSummary}
        </p>
      )}

      <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">예상 GIF 용량</dt>
          <dd className="font-medium text-violet-600">
            {exportEstimate?.label ?? '—'}
          </dd>
        </div>
        {sourceImageHint && (
          <div>
            <dt className="text-zinc-500">소스 이미지</dt>
            <dd className="font-medium">{sourceImageHint.label}</dd>
          </div>
        )}
      </dl>

      {sourceImageHint?.detail && (
        <p className="text-[11px] text-zinc-500">{sourceImageHint.detail}</p>
      )}

      {coupangLimitHint && (
        <p
          className={`text-xs ${
            coupangLimitHint.over
              ? 'text-amber-700 dark:text-amber-300'
              : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          쿠팡 권장 한도 {coupangLimitHint.limitLabel} · 예상{' '}
          {coupangLimitHint.exportLabel}
          {coupangLimitHint.over
            ? ' — FPS·길이·품질을 낮추거나 압축을 켜 보세요.'
            : ' — 한도 내로 보입니다.'}
        </p>
      )}
    </div>
  );
}
