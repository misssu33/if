import { GIFEncoder, applyPalette, quantize } from 'gifenc';

/** ImageData 배열 → GIF 바이트 (브라우저 전용) */
export function encodeVideoFramesToGif(
  frames: ImageData[],
  fps: number,
  maxColors = 256,
): Uint8Array {
  if (frames.length === 0) {
    throw new Error('No frames to encode');
  }

  const encoder = GIFEncoder();
  const delay = Math.max(20, Math.round(1000 / fps));

  for (const frame of frames) {
    const palette = quantize(frame.data, maxColors);
    const index = applyPalette(frame.data, palette);
    encoder.writeFrame(index, frame.width, frame.height, { palette, delay });
  }

  return encoder.bytes();
}
