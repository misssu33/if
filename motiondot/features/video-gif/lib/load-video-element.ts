export type LoadedVideo = {
  video: HTMLVideoElement;
  objectUrl: string;
  durationSec: number;
  videoWidth: number;
  videoHeight: number;
};

/** File → 재생 가능한 video 엘리먼트 */
export function loadVideoElement(file: File): Promise<LoadedVideo> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = objectUrl;

    const onReady = () => {
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('error', onError);
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Invalid video duration'));
        return;
      }
      resolve({
        video,
        objectUrl,
        durationSec: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });
    };

    const onError = () => {
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('error', onError);
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Video decode failed'));
    };

    video.addEventListener('loadedmetadata', onReady);
    video.addEventListener('error', onError);
  });
}

export function revokeLoadedVideo(loaded: LoadedVideo | null): void {
  if (!loaded) return;
  loaded.video.pause();
  loaded.video.removeAttribute('src');
  loaded.video.load();
  URL.revokeObjectURL(loaded.objectUrl);
}
