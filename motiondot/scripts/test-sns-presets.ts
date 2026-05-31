/**
 * SNS export 프리셋 검증 스크립트
 * npx tsx scripts/test-sns-presets.ts [--api-base http://127.0.0.1:3000] [--gif]
 */
import { SNS_EXPORT_PRESET_IDS, getSnsExportPresets } from '../config/sns-export-presets';
import { resolveExportSettings } from '../features/presets/utils/resolve-export-settings';

const EXPECTED: Record<
  string,
  { width: number; height: number; maxColors: number; frameDelayMs: number }
> = {
  'tiktok-short-clip': { width: 1080, height: 1920, maxColors: 256, frameDelayMs: 67 },
  'instagram-reels': { width: 1080, height: 1920, maxColors: 256, frameDelayMs: 83 },
  'threads-loop': { width: 1080, height: 1350, maxColors: 128, frameDelayMs: 83 },
  'coupang-product-detail-gif': {
    width: 1000,
    height: 1000,
    maxColors: 128,
    frameDelayMs: 100,
  },
  'kakaotalk-share': { width: 800, height: 1000, maxColors: 128, frameDelayMs: 100 },
  custom: { width: 1080, height: 1080, maxColors: 256, frameDelayMs: 83 },
};

const apiBase = process.argv.includes('--api-base')
  ? process.argv[process.argv.indexOf('--api-base') + 1]
  : 'http://127.0.0.1:3000';
const runGif = process.argv.includes('--gif');

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

async function testConfigAndResolve(): Promise<void> {
  const presets = getSnsExportPresets();
  assert(presets.length === 6, `expected 6 presets, got ${presets.length}`);
  assert(
    SNS_EXPORT_PRESET_IDS.length === 6,
    `expected 6 ids, got ${SNS_EXPORT_PRESET_IDS.length}`,
  );

  for (const id of SNS_EXPORT_PRESET_IDS) {
    const preset = presets.find((p) => p.id === id);
    assert(!!preset, `missing preset ${id}`);
    const exp = EXPECTED[id];
    assert(preset!.outputFormat === 'gif', `${id} should default gif`);
    const resolved = resolveExportSettings(preset!);
    assert(resolved.width === exp.width, `${id} width ${resolved.width} != ${exp.width}`);
    assert(
      resolved.height === exp.height,
      `${id} height ${resolved.height} != ${exp.height}`,
    );
    assert(
      resolved.maxColors === exp.maxColors,
      `${id} maxColors ${resolved.maxColors} != ${exp.maxColors}`,
    );
    assert(
      resolved.frameDelayMs === exp.frameDelayMs,
      `${id} frameDelayMs ${resolved.frameDelayMs} != ${exp.frameDelayMs}`,
    );
    console.log(`  OK config+resolve ${id}`);
  }

  const custom = presets.find((p) => p.id === 'custom')!;
  const overridden = resolveExportSettings(custom, {
    width: 640,
    height: 640,
    maxColors: 64,
    frameDelayMs: 200,
    quality: 'low',
  });
  assert(overridden.width === 640, 'override width');
  assert(overridden.maxColors === 64, 'override maxColors');
  assert(overridden.frameDelayMs === 200, 'override frameDelayMs');
  assert(overridden.fps === 5, `override fps expected 5 got ${overridden.fps}`);
  console.log('  OK manual override after preset');
}

async function testApiPresets(): Promise<void> {
  const res = await fetch(`${apiBase}/api/presets`);
  assert(res.ok, `GET /api/presets ${res.status}`);
  const data = (await res.json()) as {
    id: string;
    width: number;
    maxColors?: number;
  }[];
  assert(data.length === 6, `API returned ${data.length} presets`);
  for (const id of SNS_EXPORT_PRESET_IDS) {
    const p = data.find((x) => x.id === id);
    assert(!!p, `API missing ${id}`);
    assert(p!.width === EXPECTED[id].width, `API ${id} width mismatch`);
    console.log(`  OK API ${id}`);
  }
}

async function testGifPerPreset(): Promise<void> {
  const sample =
    process.env.TEST_MP4 ??
    '/workspace/motiondot/temp/archive/e2e-sample.mp4';
  const { access } = await import('fs/promises');
  try {
    await access(sample);
  } catch {
    console.log('  SKIP GIF (no sample mp4 at', sample, ')');
    return;
  }

  const { enqueueBatchConvertJobs, getBatchProgress } = await import('../lib/queue');

  for (const id of SNS_EXPORT_PRESET_IDS) {
    const preset = getSnsExportPresets().find((p) => p.id === id)!;
    const resolved = resolveExportSettings(preset);
    const { batchId, jobIds } = await enqueueBatchConvertJobs(
      [
        {
          fileId: `test-${id}`,
          inputPath: sample,
          presetId: id,
          format: 'gif',
          width: resolved.width,
          height: resolved.height,
          fps: resolved.fps,
          quality: resolved.quality,
          loop: resolved.loop,
          maxFileSizeBytes: resolved.maxFileSizeBytes,
          overrides: { maxColors: resolved.maxColors },
        },
      ],
      `test-sns-${id}`,
    );
    const jobId = jobIds[0]!;
    let done = false;
    for (let i = 0; i < 60; i++) {
      const { jobs } = await getBatchProgress(batchId);
      const j = jobs[0];
      if (j?.status === 'completed') {
        done = true;
        const { access: acc } = await import('fs/promises');
        const { resolveOutputPath } = await import('../lib/export/resolve-output-path');
        const out = resolveOutputPath(jobId, 'gif');
        await acc(out);
        console.log(`  OK GIF ${id} → ${out}`);
        break;
      }
      if (j?.status === 'failed') {
        throw new Error(`GIF failed ${id}: ${j.error}`);
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    if (!done) throw new Error(`GIF timeout ${id}`);
  }
}

async function main(): Promise<void> {
  console.log('[sns-presets] config + resolve');
  await testConfigAndResolve();
  console.log('[sns-presets] API');
  await testApiPresets();
  if (runGif) {
    console.log('[sns-presets] GIF x6');
    await testGifPerPreset();
  }
  console.log('\n[sns-presets] ALL PASSED');
}

main().catch((e) => {
  console.error('[sns-presets] FAIL:', e);
  process.exit(1);
});
