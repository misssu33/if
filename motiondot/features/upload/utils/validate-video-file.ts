import { MAX_VIDEO_BYTES, VIDEO_ACCEPT } from '../constants';

const VIDEO_EXTENSIONS = new Set<string>(
  Object.values(VIDEO_ACCEPT).flat(),
);

/** 클라이언트 사이드 비디오 파일 검증 */
export function validateVideoFile(file: File): string | null {
  if (file.size > MAX_VIDEO_BYTES) {
    return `파일 크기는 ${MAX_VIDEO_BYTES / (1024 * 1024)}MB 이하여야 합니다.`;
  }

  if (file.type.startsWith('video/')) {
    return null;
  }

  const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  if (VIDEO_EXTENSIONS.has(ext)) {
    return null;
  }

  return '비디오 파일만 업로드할 수 있습니다.';
}
