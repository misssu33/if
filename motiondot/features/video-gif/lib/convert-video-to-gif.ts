import type { LoadedVideo } from './load-video-element';
import { extractVideoFrames } from './extract-video-frames';
import { encodeVideoFramesToGif } from './encode-video-gif';
import { validateTrimSegment } from './validate-browser-video';

export type ConvertVideoToGifOptions = {
  loaded: LoadedVideo;
  startSec: number;
  endSec: number;
  fps: number;
  outputWidth: number;
  onProgress?: (percent: number, phase: 'extract' | 'encode') => void;
};

export type ConvertVideoToGifResult = {
  bytes: Uint8Array;
  width: number;
  height: number;
  frameCount: number;
};

/** 비디오 구간 → GIF (클라이언트 전용 파이프라인) */
export async function convertVideoToGif(
  options: ConvertVideoToGifOptions,
): Promise<ConvertVideoToGifResult> {
  const { loaded, startSec, endSec, fps, outputWidth, onProgress } = options;

  const trimError = validateTrimSegment(startSec, endSec, loaded.durationSec);
  if (trimError) {
    throw new Error(trimError);
  }

  const { frames, width, height } = await extractVideoFrames({
    video: loaded.video,
    startSec,
    endSec,
    fps,
    outputWidth,
    onProgress: (ratio) => onProgress?.(Math.round(ratio * 85), 'extract'),
  });

  onProgress?.(90, 'encode');
  const bytes = encodeVideoFramesToGif(frames, fps);
  onProgress?.(100, 'encode');

  return { bytes, width, height, frameCount: frames.length };
}
