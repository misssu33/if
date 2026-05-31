import 'server-only';

const VIDEO_MIME_PREFIX = 'video/';
const VIDEO_EXTENSIONS = new Set([
  '.mp4',
  '.m4v',
  '.mov',
  '.webm',
  '.avi',
  '.mkv',
  '.mpeg',
  '.mpg',
]);

/** 서버: 비디오 MIME / 확장자 검증 */
const IMAGE_MIME_PREFIX = 'image/';
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export function validateImageUpload(
  fileName: string,
  mimeType: string,
  sizeBytes: number,
  maxBytes: number,
): string | null {
  if (sizeBytes > maxBytes) {
    return `File exceeds maximum size of ${maxBytes} bytes`;
  }
  if (mimeType.startsWith(IMAGE_MIME_PREFIX)) return null;
  const ext = `.${fileName.split('.').pop()?.toLowerCase() ?? ''}`;
  if (IMAGE_EXTENSIONS.has(ext)) return null;
  return 'Only image files are allowed';
}

/** 비디오 또는 이미지 */
export function validateMediaUpload(
  fileName: string,
  mimeType: string,
  sizeBytes: number,
  maxBytes: number,
): string | null {
  const videoErr = validateVideoUpload(fileName, mimeType, sizeBytes, maxBytes);
  if (!videoErr) return null;
  const imageErr = validateImageUpload(fileName, mimeType, sizeBytes, maxBytes);
  if (!imageErr) return null;
  return 'Only video or image files are allowed';
}

export function validateVideoUpload(
  fileName: string,
  mimeType: string,
  sizeBytes: number,
  maxBytes: number,
): string | null {
  if (sizeBytes > maxBytes) {
    return `File exceeds maximum size of ${maxBytes} bytes`;
  }

  if (mimeType.startsWith(VIDEO_MIME_PREFIX)) {
    return null;
  }

  const ext = `.${fileName.split('.').pop()?.toLowerCase() ?? ''}`;
  if (VIDEO_EXTENSIONS.has(ext)) {
    return null;
  }

  return 'Only video files are allowed';
}
