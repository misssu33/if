import path from 'path';

/** Android 내부 저장소 기본 프로젝트 경로 */
export const DEFAULT_ANDROID_PROJECT_ROOT =
  '/storage/emulated/0/Projects/motiondot';

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

export function getOutputDir(): string {
  return resolveFromRoot(process.env.OUTPUT_DIR ?? 'outputs');
}

export function getPresetsDir(): string {
  return resolveFromRoot(process.env.PRESETS_DIR ?? 'presets');
}
