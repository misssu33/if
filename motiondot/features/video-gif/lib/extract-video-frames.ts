/** 비디오 구간에서 프레임 추출 (canvas) — 이미지 GIF 유틸과 분리 */

function seekVideo(video: HTMLVideoElement, timeSec: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Video seek failed'));
    };
    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
    };
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    const safeTime = Math.min(Math.max(0, timeSec), Math.max(0, video.duration - 0.001));
    video.currentTime = safeTime;
  });
}

export type ExtractFramesOptions = {
  video: HTMLVideoElement;
  startSec: number;
  endSec: number;
  fps: number;
  outputWidth: number;
  onProgress?: (ratio: number) => void;
};

export type ExtractedFrames = {
  frames: ImageData[];
  width: number;
  height: number;
};

/** 선택 구간을 FPS 간격으로 샘플링 */
export async function extractVideoFrames(
  options: ExtractFramesOptions,
): Promise<ExtractedFrames> {
  const { video, startSec, endSec, fps, outputWidth, onProgress } = options;
  const segmentSec = Math.max(0.05, endSec - startSec);
  const frameCount = Math.max(1, Math.ceil(segmentSec * fps));
  const aspect = video.videoHeight / Math.max(1, video.videoWidth);
  const width = outputWidth;
  const height = Math.max(1, Math.round(outputWidth * aspect));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('Canvas 2D is not available');
  }

  const frames: ImageData[] = [];

  for (let i = 0; i < frameCount; i++) {
    const t = startSec + i / fps;
    await seekVideo(video, Math.min(t, endSec - 0.001));
    ctx.drawImage(video, 0, 0, width, height);
    frames.push(ctx.getImageData(0, 0, width, height));
    onProgress?.((i + 1) / frameCount);
  }

  return { frames, width, height };
}
