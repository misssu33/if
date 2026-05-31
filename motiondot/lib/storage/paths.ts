import path from 'path';

/** Android 내부 저장소 기본 프로젝트 경로 */
export const DEFAULT_ANDROID_PROJECT_ROOT =
  '/storage/emulated/0/Projects/motiondot';

/** temp/ 하위 용도별 디렉터리 */
export const TEMP_SUBDIRS = {
  frames: 'frames',
  gif: 'gif',
  archive: 'archive',
  logs: 'logs',
  jobs: 'jobs',
} as const;

export type TempSubdir = (typeof TEMP_SUBDIRS)[keyof typeof TEMP_SUBDIRS];

/** outputs/ 하위 최종 산출물 형식 */
export const OUTPUT_SUBDIRS = {
  gif: 'gif',
  mp4: 'mp4',
  webp: 'webp',
} as const;

export type OutputSubdir = (typeof OUTPUT_SUBDIRS)[keyof typeof OUTPUT_SUBDIRS];

export function getProjectRoot(): string {
  const root = process.env.PROJECT_ROOT?.trim();
  if (root) return path.resolve(root);
  return process.cwd();
}

function resolveFromRoot(dir: string): string {
  const normalized = dir.replace(/^\.\//, '');
  if (path.isAbsolute(normalized)) return path.resolve(normalized);
  return path.join(getProjectRoot(), normalized);
}

export function getTempDir(): string {
  return resolveFromRoot(process.env.TEMP_DIR ?? 'temp');
}

export function getTempFramesDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.frames);
}

export function getTempGifDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.gif);
}

export function getTempArchiveDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.archive);
}

export function getTempLogsDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.logs);
}

export function getTempJobsDir(): string {
  return path.join(getTempDir(), TEMP_SUBDIRS.jobs);
}

export function getJobTempDir(jobId: string): string {
  return path.join(getTempJobsDir(), jobId);
}

export function getTempSubdir(subdir: TempSubdir): string {
  return path.join(getTempDir(), subdir);
}

export function getOutputDir(): string {
  return resolveFromRoot(process.env.OUTPUT_DIR ?? 'outputs');
}

export function getOutputGifDir(): string {
  return path.join(getOutputDir(), OUTPUT_SUBDIRS.gif);
}

export function getOutputMp4Dir(): string {
  return path.join(getOutputDir(), OUTPUT_SUBDIRS.mp4);
}

export function getOutputWebpDir(): string {
  return path.join(getOutputDir(), OUTPUT_SUBDIRS.webp);
}

export function getOutputSubdir(subdir: OutputSubdir): string {
  return path.join(getOutputDir(), subdir);
}

/** export 메타·히스토리 (temp와 분리) */
export function getExportMetaDir(): string {
  return path.join(getOutputDir(), 'meta');
}

export function getExportHistoryPath(): string {
  return path.join(getExportMetaDir(), 'history.json');
}

export function getTemplatesDir(): string {
  return resolveFromRoot(process.env.TEMPLATES_DIR ?? 'templates');
}

export function getPresetsDir(): string {
  return resolveFromRoot(process.env.PRESETS_DIR ?? 'presets');
}
