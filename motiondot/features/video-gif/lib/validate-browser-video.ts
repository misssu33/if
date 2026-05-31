import {
  BROWSER_VIDEO_ACCEPT,
  BROWSER_VIDEO_MAX_BYTES,
  BROWSER_VIDEO_MAX_SEGMENT_SEC,
} from '../constants';

const EXTENSIONS = new Set<string>(Object.values(BROWSER_VIDEO_ACCEPT).flat());

/** 브라우저 비디오→GIF용 파일 검증 */
export function validateBrowserVideoFile(file: File): string | null {
  if (file.size > BROWSER_VIDEO_MAX_BYTES) {
    const mb = Math.round(BROWSER_VIDEO_MAX_BYTES / (1024 * 1024));
    return `파일이 너무 큽니다. 브라우저 변환은 ${mb}MB 이하만 지원합니다.`;
  }

  if (file.type.startsWith('video/')) {
    return null;
  }

  const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`;
  if (EXTENSIONS.has(ext)) {
    return null;
  }

  return 'MP4, WebM, MOV 형식만 지원합니다.';
}

/** 트림 구간 검증 */
export function validateTrimSegment(
  startSec: number,
  endSec: number,
  durationSec: number,
): string | null {
  if (!Number.isFinite(durationSec) || durationSec <= 0) {
    return '비디오 길이를 읽을 수 없습니다.';
  }
  if (startSec < 0 || endSec <= startSec) {
    return '시작·종료 시간을 확인하세요.';
  }
  if (endSec > durationSec + 0.05) {
    return '종료 시간이 영상 길이를 넘습니다.';
  }
  const len = endSec - startSec;
  if (len > BROWSER_VIDEO_MAX_SEGMENT_SEC) {
    return `선택 구간은 최대 ${BROWSER_VIDEO_MAX_SEGMENT_SEC}초입니다.`;
  }
  return null;
}
