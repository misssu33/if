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
