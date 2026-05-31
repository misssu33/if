import path from 'path';

/** Android 내부 저장소 기본 프로젝트 경로 */
export const DEFAULT_ANDROID_PROJECT_ROOT =
  '/storage/emulated/0/Projects/motiondot';

/** temp/ 하위 용도별 디렉터리 */
export const TEMP_SUBDIRS = {
  /** FFmpeg 등으로 추출한 프레임 이미지 */
  frames: 'frames',
  /** GIF 인코딩 중간 파일 (팔레트, 시퀀스 등) */
  gif: 'gif',
  /** zip 등 압축·패키징 중간/임시 파일 */
  archive: 'archive',
} as const;

export type TempSubdir = (typeof TEMP_SUBDIRS)[keyof typeof TEMP_SUBDIRS];

/** 프로젝트 루트 (Android: PROJECT_ROOT, 그 외: cwd) */
export function getProjectRoot(): string {
  const root = process.env.PROJECT_ROOT?.trim();
  if (root) {
    return path.resolve(root);
  }
  return process.cwd();
}

function resolveFromRoot(dir: string): string {
  const normalized = dir.replace(/^\.\//, '');
  if (path.isAbsolute(normalized)) {
    return path.resolve(normalized);
  }
  return path.join(getProjectRoot(), normalized);
}

export function getTempDir(): string {
  return resolveFromRoot(process.env.TEMP_DIR ?? 'temp');
}

/** temp/frames — 프레임 추출 */
export function getTempFramesDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.frames);
}

/** temp/gif — GIF 생성 중간파일 */
export function getTempGifDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.gif);
}

/** temp/archive — 압축파일 */
export function getTempArchiveDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.archive);
}

/** temp 하위 용도별 경로 */
export function getTempSubdir(subdir: TempSubdir): string {
  return path.join(getTempDir(), subdir);
}

export function getOutputDir(): string {
  return resolveFromRoot(process.env.OUTPUT_DIR ?? 'outputs');
}

export function getPresetsDir(): string {
  return resolveFromRoot(process.env.PRESETS_DIR ?? 'presets');
}
