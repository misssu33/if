/** react-dropzone 허용 비디오 MIME · 확장자 */
export const VIDEO_ACCEPT = {
  'video/mp4': ['.mp4', '.m4v'],
  'video/quicktime': ['.mov'],
  'video/webm': ['.webm'],
  'video/x-msvideo': ['.avi'],
  'video/x-matroska': ['.mkv'],
  'video/mpeg': ['.mpeg', '.mpg'],
} as const;

/** 한 번에 업로드 가능한 최대 파일 수 */
export const MAX_UPLOAD_FILES = 20;

/** 파일당 최대 크기 (500MB) */
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;
