import imageCompression from 'browser-image-compression';
import type { ImageCompressionPresetId } from './compression-presets';
import { getCompressionPreset } from './compression-presets';

const SKIP_TYPES = new Set(['image/gif', 'image/svg+xml']);

/** browser-image-compression — GIF/export 전 소스 이미지 압축 */
export async function compressImageFile(
  file: File,
  presetId: ImageCompressionPresetId,
): Promise<{ file: File; compressed: boolean; originalBytes: number; resultBytes: number }> {
  const originalBytes = file.size;

  if (presetId === 'off' || SKIP_TYPES.has(file.type)) {
    return { file, compressed: false, originalBytes, resultBytes: originalBytes };
  }

  const preset = getCompressionPreset(presetId);
  if (!preset) {
    return { file, compressed: false, originalBytes, resultBytes: originalBytes };
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: preset.maxSizeMB,
      maxWidthOrHeight: preset.maxWidthOrHeight,
      initialQuality: preset.initialQuality,
      useWebWorker: true,
      preserveExif: false,
    });

    return {
      file: compressed,
      compressed: compressed.size < originalBytes,
      originalBytes,
      resultBytes: compressed.size,
    };
  } catch {
    return { file, compressed: false, originalBytes, resultBytes: originalBytes };
  }
}
