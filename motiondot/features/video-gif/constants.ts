/** 브라우저 내 비디오→GIF 전용 (서버 큐·Redis와 분리) */

export const BROWSER_VIDEO_ACCEPT = {
  'video/mp4': ['.mp4', '.m4v'],
  'video/webm': ['.webm'],
  'video/quicktime': ['.mov'],
} as const;

/** 브라우저 변환 최대 파일 크기 (80MB) */
export const BROWSER_VIDEO_MAX_BYTES = 80 * 1024 * 1024;

/** 브라우저 변환 최대 구간 길이(초) */
export const BROWSER_VIDEO_MAX_SEGMENT_SEC = 60;

/** FPS 범위 */
export const BROWSER_GIF_FPS_MIN = 1;
export const BROWSER_GIF_FPS_MAX = 30;
export const BROWSER_GIF_FPS_DEFAULT = 12;

/** 출력 너비(px) 범위 */
export const BROWSER_GIF_WIDTH_MIN = 120;
export const BROWSER_GIF_WIDTH_MAX = 1080;
export const BROWSER_GIF_WIDTH_DEFAULT = 480;
