import type { ExportSizeEstimate, ExportSizeEstimateInput } from '@/types/export';

/** 렌더 전 대략적 파일 크기 추정 (FFmpeg와 분리) */
export function estimateExportSize(
  input: ExportSizeEstimateInput,
): ExportSizeEstimate {
  const pixels = input.width * input.height;
  const frames = Math.max(1, Math.floor(input.durationSec * input.fps));
  const qualityFactor =
    input.quality === 'high' ? 1.2 : input.quality === 'low' ? 0.6 : 1;

  let bitrateKbps: number;
  let estimatedBytes: number;

  switch (input.format) {
    case 'gif':
      bitrateKbps = Math.min(8000, (pixels * input.fps * 0.08 * qualityFactor) / 1000);
      estimatedBytes = Math.floor((bitrateKbps * 1000 * input.durationSec) / 8);
      break;
    case 'webp':
      bitrateKbps = Math.min(4000, (pixels * input.fps * 0.04 * qualityFactor) / 1000);
      estimatedBytes = Math.floor((bitrateKbps * 1000 * input.durationSec) / 8);
      break;
    case 'mp4':
    default:
      bitrateKbps = Math.min(
        12000,
        (pixels * input.fps * 0.0012 * qualityFactor) / 1000 + 500,
      );
      estimatedBytes = Math.floor((bitrateKbps * 1000 * input.durationSec) / 8);
      break;
  }

  if (input.loop) estimatedBytes = Math.floor(estimatedBytes * 1.05);

  const mb = estimatedBytes / (1024 * 1024);
  return {
    estimatedBytes,
    bitrateKbps: Math.round(bitrateKbps),
    label: mb >= 1 ? `~${mb.toFixed(1)} MB` : `~${Math.round(estimatedBytes / 1024)} KB`,
  };
}
