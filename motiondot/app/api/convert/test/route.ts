import { randomUUID } from 'crypto';
import { access } from 'fs/promises';
import { loadPreset } from '@/features/presets/server/load-preset';
import { resolveExportSettings } from '@/features/presets/utils/resolve-export-settings';
import { enqueueBatchConvertJobs } from '@/lib/queue';
import type { OutputFormat } from '@/types';

type TestConvertBody = {
  inputPath: string;
  presetId?: string;
  formats?: OutputFormat[];
};

/** 로컬 변환 파이프라인 테스트 — GIF + WebP 큐 등록 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TestConvertBody;
    const inputPath = body.inputPath?.trim();

    if (!inputPath) {
      return Response.json({ error: 'inputPath required' }, { status: 400 });
    }

    await access(inputPath);

    const presetId = body.presetId ?? 'tiktok-short-clip';
    const formats = body.formats ?? ['gif', 'webp'];
    const preset = await loadPreset(presetId);

    const batchId = randomUUID();
    const jobs = formats.map((format) => {
      const settings = resolveExportSettings(preset, { outputFormat: format });
      return {
        fileId: randomUUID(),
        inputPath,
        presetId,
        format,
        width: settings.width,
        height: settings.height,
        fps: settings.fps,
        quality: settings.quality,
        loop: settings.loop,
        maxFileSizeBytes: settings.maxFileSizeBytes,
      };
    });

    const { jobIds } = await enqueueBatchConvertJobs(jobs, batchId);

    return Response.json({
      batchId,
      jobIds,
      presetId,
      formats,
      inputPath,
      progressUrl: `/api/jobs/batch/progress?batchId=${batchId}`,
      status: 'queued',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Test enqueue failed';
    const status = message.includes('ENOENT') ? 404 : 500;
    return Response.json({ error: message }, { status });
  }
}
