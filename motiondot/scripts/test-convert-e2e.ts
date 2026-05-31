/**
 * E2E 변환 테스트: Upload → Queue → FFmpeg → outputs/gif → Preview → Download
 *
 * 사전 준비:
 *   npm run ensure-dirs
 *   redis-server
 *   npm run worker          # 별도 터미널
 *
 * 로컬 (라이브러리 + 큐, HTTP 불필요):
 *   npm run test:e2e
 *   npm run test:e2e -- ./my-sample.mp4
 *
 * HTTP (npm run dev 필요):
 *   npm run test:e2e:api
 *   MOTIONDOT_BASE_URL=http://127.0.0.1:3000 npm run test:e2e:api -- ./my-sample.mp4
 */
import { randomUUID } from 'crypto';
import { access, copyFile, mkdir, readFile, stat } from 'fs/promises';
import path from 'path';
import Redis from 'ioredis';
import { readPresetJson } from '../features/presets/utils/read-preset-json';
import { resolveExportSettings } from '../features/presets/utils/resolve-export-settings';
import { readConversionLog } from '../lib/ffmpeg';
import { createFfmpegCommand } from '../lib/ffmpeg/binary';
import { resolveOutputPath } from '../lib/export/resolve-output-path';
import {
  ensureStorageDirs,
  getOutputGifDir,
  getTempArchiveDir,
} from '../lib/storage';
import { getRedisHostConfig } from '../lib/redis/connection';
import { e2eFail, e2eLog, e2eStep } from './lib/e2e-logger';

const args = process.argv.slice(2);
const apiMode = args.includes('--api');
const inputArg = args.find((a) => !a.startsWith('--'));

const PRESET_ID = process.env.TEST_PRESET_ID ?? 'tiktok-short-clip';
const BASE_URL = (process.env.MOTIONDOT_BASE_URL ?? 'http://127.0.0.1:3000').replace(
  /\/$/,
  '',
);
const POLL_MS = Number(process.env.E2E_POLL_MS ?? 1500);
const POLL_MAX = Number(process.env.E2E_POLL_MAX ?? 180);

type UploadMeta = {
  id: string;
  originalName: string;
  tempPath: string;
  sizeBytes: number;
  mediaKind: 'video';
};

async function ensureSampleMp4(targetPath: string): Promise<string> {
  try {
    await access(targetPath);
    return targetPath;
  } catch {
    /* 생성 */
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  e2eLog('info', '샘플 MP4 생성', { path: targetPath });

  await new Promise<void>((resolve, reject) => {
    createFfmpegCommand('/dev/zero')
      .inputOptions([
        '-f',
        'rawvideo',
        '-pix_fmt',
        'rgb24',
        '-s',
        '640x360',
        '-r',
        '15',
        '-t',
        '3',
      ])
      .outputOptions(['-pix_fmt', 'yuv420p', '-an'])
      .output(targetPath)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });

  return targetPath;
}

async function resolveInputMp4(): Promise<string> {
  if (inputArg) {
    const resolved = path.resolve(inputArg);
    await access(resolved);
    return resolved;
  }
  return ensureSampleMp4(path.join(getTempArchiveDir(), 'e2e-sample.mp4'));
}

async function pingRedis(): Promise<void> {
  const cfg = getRedisHostConfig();
  const redis = new Redis(cfg);
  try {
    const pong = await redis.ping();
    if (pong !== 'PONG') {
      e2eFail('Redis ping 실패', pong);
    }
    e2eLog('info', 'Redis 연결 OK', cfg);
  } catch (err) {
    e2eFail(
      'Redis에 연결할 수 없습니다. redis-server 실행 후 다시 시도하세요.',
      err,
    );
  } finally {
    redis.disconnect();
  }
}

/** 1) Upload — API와 동일 경로에 MP4 저장 */
async function uploadMp4(sourcePath: string): Promise<UploadMeta> {
  await ensureStorageDirs();
  const originalName = path.basename(sourcePath);
  if (!originalName.toLowerCase().endsWith('.mp4')) {
    e2eFail('입력 파일은 .mp4 여야 합니다.');
  }

  const id = randomUUID();
  const tempPath = path.join(getTempArchiveDir(), `${id}-${originalName}`);
  await copyFile(sourcePath, tempPath);
  const st = await stat(tempPath);

  const meta: UploadMeta = {
    id,
    originalName,
    tempPath,
    sizeBytes: st.size,
    mediaKind: 'video',
  };

  e2eLog('info', '업로드 완료 (temp/archive)', {
    id: meta.id,
    tempPath: meta.tempPath,
    sizeBytes: meta.sizeBytes,
  });
  return meta;
}

async function uploadMp4ViaApi(sourcePath: string): Promise<UploadMeta> {
  const buffer = await readFile(sourcePath);
  const name = path.basename(sourcePath);
  const file = new File([buffer], name, { type: 'video/mp4' });
  const form = new FormData();
  form.append('file', file);
  form.append('mediaKind', 'video');

  const res = await fetch(`${BASE_URL}/api/upload`, { method: 'POST', body: form });
  const body = (await res.json()) as UploadMeta & { error?: string };
  if (!res.ok) {
    e2eFail('POST /api/upload 실패', body.error ?? res.statusText);
  }
  e2eLog('info', 'HTTP 업로드 완료', { id: body.id, tempPath: body.tempPath });
  return body;
}

/** 2) Queue — GIF 단일 job 등록 */
async function enqueueGifJob(
  meta: UploadMeta,
): Promise<{ batchId: string; jobId: string }> {
  const preset = await readPresetJson(PRESET_ID);
  const settings = resolveExportSettings(preset, { outputFormat: 'gif' });
  const batchId = randomUUID();
  const jobId = randomUUID();

  const job = {
    jobId,
    fileId: meta.id,
    inputPath: meta.tempPath,
    presetId: PRESET_ID,
    format: 'gif' as const,
    width: settings.width,
    height: settings.height,
    fps: settings.fps,
    quality: settings.quality,
    loop: settings.loop,
    maxFileSizeBytes: settings.maxFileSizeBytes,
  };

  if (apiMode) {
    const res = await fetch(`${BASE_URL}/api/jobs/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ batchId, jobs: [job] }),
    });
    const body = (await res.json()) as {
      batchId: string;
      jobIds: string[];
      error?: string;
    };
    if (!res.ok) {
      e2eFail('POST /api/jobs/batch 실패', body.error ?? res.statusText);
    }
    e2eLog('info', 'HTTP 큐 등록', { batchId: body.batchId, jobIds: body.jobIds });
    return { batchId: body.batchId, jobId: body.jobIds[0] ?? jobId };
  }

  const { enqueueBatchConvertJobs } = await import('../lib/queue');
  const { jobIds } = await enqueueBatchConvertJobs([job], batchId);
  e2eLog('info', 'BullMQ 큐 등록', { batchId, jobIds });
  e2eLog('warn', 'Worker 필요: npm run worker');
  return { batchId, jobId: jobIds[0] ?? jobId };
}

type JobSnapshot = {
  jobId: string;
  status: string;
  progress: number;
  message?: string;
  error?: string;
  outputPath?: string;
};

/** 3–4) 진행률 폴링 + FFmpeg 완료 대기 */
async function pollUntilDone(
  batchId: string,
  jobId: string,
): Promise<JobSnapshot> {
  e2eStep('변환 진행률 폴링 (Queue → Worker → FFmpeg)');

  for (let i = 0; i < POLL_MAX; i++) {
    let jobs: JobSnapshot[];

    if (apiMode) {
      const res = await fetch(
        `${BASE_URL}/api/jobs/batch/progress?batchId=${encodeURIComponent(batchId)}`,
      );
      const body = (await res.json()) as { jobs: JobSnapshot[]; error?: string };
      if (!res.ok) {
        e2eFail('진행률 조회 실패', body.error);
      }
      jobs = body.jobs;
    } else {
      const { getBatchProgress } = await import('../lib/queue');
      const batch = await getBatchProgress(batchId);
      jobs = batch.jobs;
    }

    const job = jobs.find((j) => j.jobId === jobId) ?? jobs[0];
    if (!job) {
      e2eFail('job을 찾을 수 없습니다.', { jobId, batchId });
    }

    e2eLog('progress', `poll ${i + 1}/${POLL_MAX}`, {
      status: job.status,
      progress: job.progress,
      message: job.message,
    });

    if (job.status === 'completed') {
      e2eLog('info', '변환 완료', { outputPath: job.outputPath });
      return job;
    }
    if (job.status === 'failed' || job.status === 'cancelled') {
      const log = await readConversionLog(jobId, 40);
      e2eFail(`변환 ${job.status}`, { error: job.error, log });
    }

    await new Promise((r) => setTimeout(r, POLL_MS));
  }

  const log = await readConversionLog(jobId, 50);
  e2eFail('변환 타임아웃 — worker가 실행 중인지 확인하세요.', { log });
}

/** 5) outputs/gif 저장 검증 */
async function verifyGifOnDisk(jobId: string): Promise<string> {
  e2eStep('outputs/gif 저장 검증');
  const outputPath = resolveOutputPath(jobId, 'gif');
  await access(outputPath);
  const st = await stat(outputPath);
  if (st.size < 100) {
    e2eFail('GIF 파일 크기가 비정상적으로 작습니다.', { size: st.size });
  }

  const head = await readFile(outputPath, { encoding: null });
  const sig = head.subarray(0, 6).toString('ascii');
  if (sig !== 'GIF89a' && sig !== 'GIF87a') {
    e2eFail('GIF 시그니처 불일치', { sig });
  }

  e2eLog('info', 'GIF 저장 확인', {
    path: outputPath,
    sizeBytes: st.size,
    dir: getOutputGifDir(),
  });
  return outputPath;
}

/** 6) Preview — HTTP 또는 로컬 바이트 검증 */
async function verifyPreview(outputPath: string): Promise<void> {
  e2eStep('미리보기(Preview) 검증');

  if (apiMode) {
    const url = `${BASE_URL}/api/preview/media?path=${encodeURIComponent(outputPath)}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      e2eFail('GET /api/preview/media 실패', { status: res.status, text });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const type = res.headers.get('content-type');
    e2eLog('info', 'HTTP 미리보기 OK', {
      contentType: type,
      bytes: buf.length,
    });
    const sig = buf.subarray(0, 6).toString('ascii');
    if (sig !== 'GIF89a' && sig !== 'GIF87a') {
      e2eFail('미리보기 응답이 GIF가 아닙니다.', { sig });
    }
    return;
  }

  const buf = await readFile(outputPath);
  e2eLog('info', '로컬 미리보기(파일 읽기) OK', { bytes: buf.length });
}

/** 7) Download — export download API 또는 로컬 동일 검증 */
async function verifyDownload(jobId: string, outputPath: string): Promise<void> {
  e2eStep('다운로드(Download) 검증');
  const fileName = path.basename(outputPath);

  if (apiMode) {
    const url = `${BASE_URL}/api/export/download?file=${encodeURIComponent(fileName)}&format=gif`;
    const res = await fetch(url);
    if (!res.ok) {
      e2eFail('GET /api/export/download 실패', { status: res.status });
    }
    const downloaded = Buffer.from(await res.arrayBuffer());
    const original = await readFile(outputPath);
    if (downloaded.length !== original.length) {
      e2eFail('다운로드 크기 불일치', {
        downloaded: downloaded.length,
        original: original.length,
      });
    }
    e2eLog('info', 'HTTP 다운로드 OK', {
      fileName,
      bytes: downloaded.length,
      contentType: res.headers.get('content-type'),
    });
    return;
  }

  const original = await readFile(outputPath);
  e2eLog('info', '로컬 다운로드 검증(파일 일치) OK', {
    fileName,
    bytes: original.length,
  });
}

async function printConversionLog(jobId: string): Promise<void> {
  const log = await readConversionLog(jobId, 30);
  if (log) {
    e2eLog('info', '변환 로그 (tail)', { jobId });
    console.log(log);
  }
}

async function main(): Promise<void> {
  e2eStep('E2E 변환 테스트 시작');
  e2eLog('info', '설정', {
    mode: apiMode ? 'api' : 'integrated',
    preset: PRESET_ID,
    baseUrl: apiMode ? BASE_URL : '(n/a)',
  });

  await pingRedis();
  const sourceMp4 = await resolveInputMp4();
  e2eLog('info', '입력 MP4', { path: sourceMp4 });

  const meta = apiMode
    ? await uploadMp4ViaApi(sourceMp4)
    : await uploadMp4(sourceMp4);

  const { batchId, jobId } = await enqueueGifJob(meta);
  const finished = await pollUntilDone(batchId, jobId);
  await printConversionLog(jobId);

  const outputPath = await verifyGifOnDisk(jobId);
  if (finished.outputPath && finished.outputPath !== path.basename(outputPath)) {
    e2eLog('warn', '진행률 outputPath와 파일명 불일치', {
      reported: finished.outputPath,
      expected: path.basename(outputPath),
    });
  }

  await verifyPreview(outputPath);
  await verifyDownload(jobId, outputPath);

  e2eStep('E2E 성공 — Upload → Queue → FFmpeg → outputs/gif → Preview → Download');
  console.log('\n결과 GIF:', outputPath);
  console.log('다운로드 URL (dev 실행 시):');
  console.log(
    `  ${BASE_URL}/api/export/download?file=${encodeURIComponent(path.basename(outputPath))}&format=gif`,
  );
}

main().catch((err) => {
  e2eFail('예기치 않은 오류', err);
});
