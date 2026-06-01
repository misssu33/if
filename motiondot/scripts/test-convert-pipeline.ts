/**
 * FFmpeg 변환 파이프라인 로컬 테스트
 *
 * 직접 변환 (Redis 불필요):
 *   npx tsx scripts/test-convert-pipeline.ts --direct [input.mp4]
 *
 * 큐 + Worker (Redis + npm run worker 필요):
 *   npx tsx scripts/test-convert-pipeline.ts --queue [input.mp4]
 */
import { randomUUID } from 'crypto';
import { access, mkdir } from 'fs/promises';
import path from 'path';
import { readPresetJson } from '../features/presets/utils/read-preset-json';
import { resolveExportSettings } from '../features/presets/utils/resolve-export-settings';
import { getOutputGifDir, getOutputWebpDir, getTempArchiveDir, getOutputDir, getTempDir, getTempLogsDir, getTempJobsDir } from '../lib/storage/paths';
import { readConversionLog, runConvertPipeline } from '../lib/ffmpeg';
import { createFfmpegCommand } from '../lib/ffmpeg/binary';

const args = process.argv.slice(2);
const queueMode = args.includes('--queue');
const inputArg = args.find((a) => !a.startsWith('--'));

const PRESET_ID = process.env.TEST_PRESET_ID ?? 'tiktok-short-clip';

async function ensureSampleMp4(targetPath: string): Promise<string> {
  try {
    await access(targetPath);
    return targetPath;
  } catch {
    /* create */
  }

  await mkdir(path.dirname(targetPath), { recursive: true });
  console.log('[test] 샘플 MP4 생성:', targetPath);

  await new Promise<void>((resolve, reject) => {
    createFfmpegCommand('testsrc=size=640x360:rate=15:duration=3')
      .inputOptions(['-f', 'lavfi'])
      .outputOptions(['-pix_fmt', 'yuv420p', '-an'])
      .output(targetPath)
      .on('end', () => resolve())
      .on('error', reject)
      .run();
  });

  return targetPath;
}

async function resolveInput(): Promise<string> {
  if (inputArg) {
    await access(inputArg);
    return path.resolve(inputArg);
  }
  const sample = path.join(getTempArchiveDir(), 'test-sample.mp4');
  return ensureSampleMp4(sample);
}

async function runDirect(inputPath: string): Promise<void> {
  const preset = await readPresetJson(PRESET_ID);
  const formats = ['gif', 'webp'] as const;

  for (const format of formats) {
    const jobId = randomUUID();
    const settings = resolveExportSettings(preset, { outputFormat: format });

    console.log(`\n[test] direct ${format} jobId=${jobId}`);

    const outputPath = await runConvertPipeline(
      { jobId, inputPath, settings, format },
      (progress, message) => {
        process.stdout.write(`\r  ${progress}% ${message}          `);
      },
    );

    console.log(`\n  → ${outputPath}`);
    const log = await readConversionLog(jobId, 20);
    if (log) console.log('  log tail:\n', log);
  }

  console.log('\n[test] outputs:');
  console.log('  gif:', getOutputGifDir());
  console.log('  webp:', getOutputWebpDir());
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function runQueue(inputPath: string): Promise<void> {
  const { enqueueBatchConvertJobs, getBatchProgress } = await import('../lib/queue');
  const batchId = randomUUID();
  const formats = ['gif', 'webp'] as const;

  const preset = await readPresetJson(PRESET_ID);
  const jobs = formats.map((format) => {
    const settings = resolveExportSettings(preset, { outputFormat: format });
    return {
      fileId: randomUUID(),
      inputPath,
      presetId: PRESET_ID,
      format,
      width: settings.width,
      height: settings.height,
      fps: settings.fps,
      quality: settings.quality,
      loop: settings.loop,
    };
  });

  const { jobIds } = await enqueueBatchConvertJobs(jobs, batchId);
  console.log('[test] queued batchId=', batchId);
  console.log('[test] jobIds=', jobIds.join(', '));
  console.log('[test] worker 실행: npm run worker');

  for (let i = 0; i < 120; i++) {
    const { jobs } = await getBatchProgress(batchId);
    const line = jobs
      .map((j) => `${j.jobId.slice(0, 8)} ${j.status} ${j.progress}% ${j.message ?? ''}`)
      .join(' | ');
    console.log(`[poll ${i}]`, line);

    const done = jobs.every((j) =>
      ['completed', 'failed', 'cancelled'].includes(j.status),
    );
    if (done) {
      for (const j of jobs) {
        if (j.status === 'completed') {
          console.log('  OK', j.outputPath);
          const log = await readConversionLog(j.jobId, 15);
          if (log) console.log(log);
        }
        if (j.status === 'failed') {
          console.error('  FAIL', j.error);
          const log = await readConversionLog(j.jobId, 30);
          if (log) console.error(log);
        }
      }
      break;
    }
    await sleep(2000);
  }
}

async function main(): Promise<void> {
  const { mkdir } = await import('fs/promises');
  for (const d of [getTempDir(), getOutputDir(), getOutputGifDir(), getOutputWebpDir(), getTempArchiveDir(), getTempLogsDir(), getTempJobsDir()]) {
    await mkdir(d, { recursive: true });
  }
  const inputPath = await resolveInput();
  console.log('[test] input:', inputPath);
  console.log('[test] preset:', PRESET_ID);
  console.log('[test] mode:', queueMode ? 'queue' : 'direct');

  if (queueMode) {
    await runQueue(inputPath);
  } else {
    await runDirect(inputPath);
  }

  console.log('\n[test] done');
}

main().catch((err) => {
  console.error('[test] fatal:', err);
  process.exit(1);
});
