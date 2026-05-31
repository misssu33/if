import { copyFile, mkdir, rm } from 'fs/promises';
import path from 'path';
import { getJobTempDir, getTempFramesDir } from '@/lib/storage/paths';

export type JobTempWorkspace = {
  root: string;
  input: string;
  frames: string;
};

/** 작업별 temp 워크스페이스 생성 */
export async function createJobTempWorkspace(
  jobId: string,
  inputPath: string,
): Promise<JobTempWorkspace> {
  const root = getJobTempDir(jobId);
  const frames = path.join(root, 'frames');
  const stagedInput = path.join(root, path.basename(inputPath));

  await mkdir(frames, { recursive: true });
  await copyFile(inputPath, stagedInput);

  return { root, input: stagedInput, frames };
}

/** temp 작업 디렉터리 정리 (로그는 유지) */
export async function cleanupJobTempWorkspace(jobId: string): Promise<void> {
  const root = getJobTempDir(jobId);
  try {
    await rm(root, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  // frames 글로벌 temp는 job별 하위만 사용
  void getTempFramesDir();
}
